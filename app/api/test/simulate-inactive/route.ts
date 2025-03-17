import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

/**
 * This is a helper API to simulate a user being inactive for testing purposes
 * It allows you to set a user's lastActivityDate to a specified number of days ago
 *
 * Example usage:
 * /api/test/simulate-inactive?userId=YOUR_USER_ID&days=5
 */
export async function GET(request: Request) {
  try {
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const days = parseInt(searchParams.get("days") || "5");

    // Validate parameters
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    if (isNaN(days) || days < 0) {
      return NextResponse.json(
        { error: "Days must be a positive number" },
        { status: 400 },
      );
    }

    // Calculate the past date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);

    const pastDateStr = pastDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    console.log(
      `[SIMULATE_INACTIVE] Setting user ${userId} lastActivityDate to ${pastDateStr} (${days} days ago)`,
    );

    // Update the user's lastActivityDate
    await db
      .update(users)
      .set({
        lastActivityDate: pastDateStr,
      })
      .where(eq(users.id, userId));

    // Get updated user data
    const updatedUser = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        lastActivityDate: users.lastActivityDate,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: `User's last activity date set to ${days} days ago`,
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error setting inactive user:", error);
    return NextResponse.json(
      { error: "Failed to set inactive user", details: String(error) },
      { status: 500 },
    );
  }
}
