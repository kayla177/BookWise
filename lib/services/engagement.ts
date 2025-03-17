// lib/services/engagement.ts
"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";
import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";

// Helper to calculate days between two dates (not exported so doesn't need to be async)
const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
};

/**
 * Check if a user should receive an activity reminder
 */
export async function shouldSendActivityReminder(
  lastActivityDate: Date | null,
): Promise<boolean> {
  if (!lastActivityDate) return false;

  const now = new Date();
  const daysSinceActivity = daysBetween(lastActivityDate, now);

  return daysSinceActivity >= 3 && daysSinceActivity <= 30;
}

/**
 * Update a user's last activity date
 */
export async function trackUserActivity(userId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  await db
    .update(users)
    .set({ lastActivityDate: today })
    .where(eq(users.id, userId));

  console.log(`User ${userId} activity tracked on ${today}`);
}

/**
 * Process user engagement (for API route/cron job)
 */
export async function processUserEngagement(): Promise<{
  processed: number;
  reminded: number;
}> {
  // Get all users
  const allUsers = await db.select().from(users);
  const now = new Date();
  let remindedCount = 0;

  // Process each user
  for (const user of allUsers) {
    // Skip users without last activity date
    if (!user.lastActivityDate) continue;

    const lastActivityDate = new Date(user.lastActivityDate);
    const daysSinceActivity = daysBetween(lastActivityDate, now);

    // Users inactive for more than 3 days but less than 30 days
    if (daysSinceActivity > 3 && daysSinceActivity <= 30) {
      remindedCount++;

      // Send inactivity reminder
      await sendEmail({
        email: user.email,
        subject: "We Miss You at BookWise!",
        renderEmail: () => renderInactivityReminderEmail(user.fullName),
      });

      console.log(
        `📧 Sent inactivity reminder to ${user.email} (inactive for ${daysSinceActivity} days)`,
      );
    }
  }

  return {
    processed: allUsers.length,
    reminded: remindedCount,
  };
}
