import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";

/**
 * This endpoint combines two operations:
 * 1. Sets a user as inactive (X days ago)
 * 2. Immediately sends them an inactivity reminder email
 *
 * This helps isolate whether the issue is with:
 * - Identifying inactive users
 * - The email sending process
 * - The connection between the two
 *
 * Example usage:
 * /api/test/inactive-and-send?userId=YOUR_USER_ID&days=5&email=user@example.com
 */
export async function GET(request: Request) {
  try {
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const days = parseInt(searchParams.get("days") || "5");

    // Allow overriding the email for testing
    const emailOverride = searchParams.get("email");

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
      `[INACTIVE_AND_SEND]Setting user ${userId} lastActivityDate to ${pastDateStr} (${days} days ago)`,
    );

    // Update the user's lastActivityDate
    await db
      .update(users)
      .set({
        lastActivityDate: pastDateStr,
      })
      .where(eq(users.id, userId));

    // Get updated user data
    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        lastActivityDate: users.lastActivityDate,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("[INACTIVE_AND_SEND] User retrieved:", user);

    // immediately try to send an inactivity reminder
    console.log(
      `[INACTIVE_AND_SEND] Sending inactivity reminder to ${emailOverride || user.email}`,
    );

    const emailResult = await sendEmail({
      email: emailOverride || user.email,
      subject: "We Miss You at BookWise! [TEST]",
      renderEmail: () => renderInactivityReminderEmail(user.fullName),
    });

    console.log("[INACTIVE_AND_SEND] Email send result:", emailResult);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "User was set inactive but email failed to send",
          user,
          emailError: emailResult.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `User set as inactive (${days} days ago) and reminder email sent`,
      user,
      emailResult,
    });
  } catch (error) {
    console.error("Error in inactive-and-send test:", error);
    return NextResponse.json(
      { error: "Operation failed", details: String(error) },
      { status: 500 },
    );
  }
}
