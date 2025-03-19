"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";

// Helper to calculate days between two dates
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffTime / oneDay);
};

// Update a user's last activity date
export async function trackUserActivity(userId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  try {
    await db
      .update(users)
      .set({ lastActivityDate: today })
      .where(eq(users.id, userId));

    console.log(
      `[SERVICES/ENGAGEMENT] User ${userId} activity tracked on ${today}`,
    );
  } catch (error) {
    console.error(`Error updating activity for user ${userId}:`, error);
  }
}

// Identifies inactive users and sends them reminder emails
export async function processUserEngagement(): Promise<{
  processed: number;
  reminded: number;
}> {
  console.log("[SERVICES/ENGAGEMENT] Starting user engagement processing...");

  try {
    // Calculate date that was exactly 3 days ago (YYYY-MM-DD)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split("T")[0];

    console.log(
      `[SERVICES/ENGAGEMENT] Looking for users last active on exactly: ${threeDaysAgoStr}`,
    );

    // Get today's date for checking/updating last reminder
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Find users who:
    // 1. Were last active exactly 3 days ago
    // 2. Either:
    //    a. Have never received a reminder (lastReminderSent is null)
    //    b. Last reminder was sent on a different day than today
    const inactiveUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        lastActivityDate: users.lastActivityDate,
        lastReminderSent: users.lastReminderSent,
      })
      .from(users)
      .where(
        and(
          // Only users with lastActivityDate exactly 3 days ago (based on date, ignoring time)
          sql`DATE(${users.lastActivityDate}) = ${threeDaysAgoStr}`,

          // Either lastReminderSent is null OR lastReminderSent is not from today
          sql`(${users.lastReminderSent} IS NULL OR DATE(${users.lastReminderSent}) <> ${todayStr})`,
        ),
      );

    console.log(
      `[SERVICES/ENGAGEMENT] Found ${inactiveUsers.length} users inactive for exactly 3 days`,
    );

    let remindedCount = 0;

    // Process each eligible user
    for (const user of inactiveUsers) {
      console.log(
        `[SERVICES/ENGAGEMENT] Processing user: ${user.fullName} (${user.email})`,
      );

      try {
        // Send inactivity reminder
        console.log(
          `[SERVICES/ENGAGEMENT] Sending inactivity reminder to ${user.email}`,
        );

        const emailResult = await sendEmail({
          email: user.email,
          subject: "We Miss You at BookWise!",
          renderEmail: () => renderInactivityReminderEmail(user.fullName),
        });

        if (emailResult.success) {
          // Update lastReminderSent to current timestamp
          await db
            .update(users)
            .set({ lastReminderSent: new Date() })
            .where(eq(users.id, user.id));

          console.log(
            `[SERVICES/ENGAGEMENT] Email sent successfully to ${user.email}`,
          );
          remindedCount++;
        } else {
          console.error(
            `[SERVICES/ENGAGEMENT] Failed to send email to ${user.email}:`,
            emailResult.error,
          );
        }
      } catch (error) {
        console.error(
          `[SERVICES/ENGAGEMENT] Error processing user ${user.id}:`,
          error,
        );
      }
    }

    console.log(
      `[SERVICES/ENGAGEMENT] Engagement processing complete: ${inactiveUsers.length} users processed, ${remindedCount} reminders sent`,
    );

    return {
      processed: inactiveUsers.length,
      reminded: remindedCount,
    };
  } catch (error) {
    console.error(
      "[SERVICES/ENGAGEMENT] Error processing user engagement:",
      error,
    );
    return {
      processed: 0,
      reminded: 0,
    };
  }
}
