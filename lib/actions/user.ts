"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

/**
 * Updates a user's status to request admin access
 * @param userId The user's ID
 * @returns Success or error response
 */
// In lib/actions/user.ts
export async function requestAdminAccess(userId: string) {
  try {
    // First check if the user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // If user is already an admin, don't proceed
    if (user[0].role === "ADMIN") {
      return {
        success: false,
        error: "User already has admin privileges",
      };
    }

    // If user has a pending request, don't proceed
    if (user[0].status === "PENDING") {
      return {
        success: false,
        error: "Admin request already pending",
      };
    }

    // Update the user's status to PENDING for admin approval
    await db
      .update(users)
      .set({ status: "PENDING" })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: "Admin request submitted successfully",
    };
  } catch (error) {
    console.error("Error requesting admin access:", error);
    return {
      success: false,
      error: "An error occurred while submitting your request",
    };
  }
}

export async function approveAdminRequest(userId: string) {
  try {
    console.log(`Approving admin request for user ID: ${userId}`);

    // Fetch the user before updating
    const userBeforeUpdate = await db
      .select({ id: users.id, role: users.role, status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    console.log("Before update:", userBeforeUpdate);

    await db
      .update(users)
      .set({
        role: "ADMIN",
        status: "APPROVED",
      })
      .where(eq(users.id, userId));

    // Fetch the user after updating
    const userAfterUpdate = await db
      .select({ id: users.id, role: users.role, status: users.status })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    console.log("After update:", userAfterUpdate);

    return {
      success: true,
      message: "Admin request approved successfully",
    };
  } catch (error) {
    console.error("Error approving admin request:", error);
    return {
      success: false,
      error: "An error occurred while approving the request",
    };
  }
}

/**
 * Denies a user's admin request
 * @param userId The user's ID
 * @returns Success or error response
 */
export async function denyAdminRequest(userId: string) {
  try {
    // Reset the user's status to APPROVED (not ADMIN role)
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    return {
      success: true,
      message: "Admin request denied successfully",
    };
  } catch (error) {
    console.error("Error denying admin request:", error);
    return {
      success: false,
      error: "An error occurred while denying the request",
    };
  }
}
