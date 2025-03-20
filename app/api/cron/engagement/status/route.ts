import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { sql } from "drizzle-orm";

// This API route checks the engagement status of all users without sending emails

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Optional email filter
    const emailFilter = searchParams.get("email");

    // Get all users with their last activity date
    let query = db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        lastActivityDate: users.lastActivityDate,
        lastReminderSent: users.lastReminderSent,
        createdAt: users.createdAt,
      })
      .from(users);

    // Apply email filter if provided
    if (emailFilter) {
      query = query.where(sql`${users.email} LIKE ${`%${emailFilter}%`}`);
    }

    const allUsers = await query;

    // Process each user to determine engagement status
    const now = new Date();
    const usersWithStatus = allUsers.map((user) => {
      // Calculate days since last activity
      let daysSinceActivity = null;
      if (user.lastActivityDate) {
        const lastActivity = new Date(user.lastActivityDate);
        const diffTime = Math.abs(now.getTime() - lastActivity.getTime());
        daysSinceActivity = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }

      // Calculate days since last reminder sent
      let daysSinceReminder = null;
      if (user.lastReminderSent) {
        const lastReminder = new Date(user.lastReminderSent);
        const diffTime = Math.abs(now.getTime() - lastReminder.getTime());
        daysSinceReminder = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }

      // Determine if user should receive a reminder
      const shouldRemind =
        daysSinceActivity === 3 &&
        (!daysSinceReminder || daysSinceReminder > 0);

      // Determine engagement status
      let status = "active";
      if (daysSinceActivity === null) {
        status = "unknown";
      } else if (daysSinceActivity === 0) {
        status = "active_today";
      } else if (daysSinceActivity <= 2) {
        status = "active_recently";
      } else if (daysSinceActivity === 3) {
        status = "inactive_reminder_due";
      } else if (daysSinceActivity > 3 && daysSinceActivity <= 7) {
        status = "inactive_recent";
      } else {
        status = "inactive_dormant";
      }

      return {
        ...user,
        daysSinceActivity,
        daysSinceReminder,
        shouldSendReminder: shouldRemind,
        engagementStatus: status,
      };
    });

    return NextResponse.json({
      success: true,
      users: usersWithStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking engagement status:", error);
    return NextResponse.json(
      { error: "Failed to check engagement status", details: String(error) },
      { status: 500 },
    );
  }
}
