"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";

// Helper to calculate days between two dates (not exported so doesn't need to be async)
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
};

// Check if a user should receive an activity reminder
export async function shouldSendActivityReminder(
  lastActivityDate: Date | null,
): Promise<boolean> {
  if (!lastActivityDate) return false;

  const now = new Date();
  const daysSinceActivity = daysBetween(lastActivityDate, now);

  console.log(`Days since activity: ${daysSinceActivity}`);
  return daysSinceActivity >= 3 && daysSinceActivity <= 30;
}

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

// identifies inactive users and sends them reminder emails
export async function processUserEngagement(): Promise<{
  processed: number;
  reminded: number;
}> {
  console.log("[SERVICES/ENGAGEMENT] Starting user engagement processing...");

  try {
    const allUsers = await db.select().from(users);
    console.log(`[SERVICES/ENGAGEMENT] Found ${allUsers.length} users total`);

    if (allUsers.length === 0) {
      console.log("[SERVICES/ENGAGEMENT] No users found in database!");
      return { processed: 0, reminded: 0 };
    }

    console.log(`Processing ${allUsers.length} users...`);

    const now = new Date();
    let remindedCount = 0;

    // Process each user
    for (const user of allUsers) {
      console.log(
        `\n[SERVICES/ENGAGEMENT]Processing user: ${user.fullName} (${user.email})`,
      );

      // Skip users without last activity date
      if (!user.lastActivityDate) {
        console.log(
          `[SERVICES/ENGAGEMENT] Skipping user ${user.email} - no last activity date`,
        );
        continue;
      }

      const lastActivityDate = new Date(user.lastActivityDate);
      const daysSinceActivity = daysBetween(lastActivityDate, now);

      console.log(
        `[SERVICES/ENGAGEMENT] User ${user.email} last active ${daysSinceActivity} days ago (${lastActivityDate.toISOString().split("T")[0]})`,
      );

      // Users inactive for 3-30 days should receive a reminder
      if (daysSinceActivity >= 3 && daysSinceActivity <= 30) {
        console.log(
          `[SERVICES/ENGAGEMENT] User ${user.email} needs an inactivity reminder`,
        );

        try {
          // Send inactivity reminder
          console.log(
            `[SERVICES/ENGAGEMENT] Sending inactivity reminder to ${user.email}...`,
          );

          const emailResult = await sendEmail({
            email: user.email,
            subject: "We Miss You at BookWise!",
            renderEmail: () => renderInactivityReminderEmail(user.fullName),
          });

          if (emailResult.success) {
            console.log(
              `[SERVICES/ENGAGEMENT] Email successfully sent to ${user.email}`,
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
            `[SERVICES/ENGAGEMENT] Error sending email to ${user.email}:`,
            error,
          );
        }
      } else {
        console.log(
          `[SERVICES/ENGAGEMENT] User ${user.email} is ${daysSinceActivity <= 2 ? "active" : "dormant"} (${daysSinceActivity} days)`,
        );
      }
    }

    console.log(
      `\n[SERVICES/ENGAGEMENT] Engagement processing complete: ${allUsers.length} users processed, ${remindedCount} reminders sent`,
    );

    return {
      processed: allUsers.length,
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
