// Create a new file: lib/services/dueReminders.ts
"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderDueReminderEmail } from "@/components/emails/DueReminderEmail";

export async function processBookDueReminders(): Promise<{
  processed: number;
  reminded: number;
}> {
  console.log(
    "[SERVICES/DUE_REMINDERS] Starting due book reminders process...",
  );

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Query for borrowed books due today
    const dueBorrows = await db
      .select({
        id: borrowRecords.id,
        dueDate: borrowRecords.dueDate,
        bookId: borrowRecords.bookId,
        userId: borrowRecords.userId,
        // Join book details
        book: {
          title: books.title,
        },
        // Join user details
        user: {
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(
        and(
          eq(borrowRecords.status, "BORROWED"),
          eq(borrowRecords.dueDate, today),
        ),
      );

    console.log(
      `[SERVICES/DUE_REMINDERS] Found ${dueBorrows.length} books due today`,
    );

    let remindedCount = 0;

    // Send reminders for each due book
    for (const record of dueBorrows) {
      try {
        console.log(
          `[SERVICES/DUE_REMINDERS] Sending reminder for book: ${record.book.title} to ${record.user.email}`,
        );

        // Send due reminder email
        const emailResult = await sendEmail({
          email: record.user.email,
          subject: `Reminder: ${record.book.title} is Due Today`,
          renderEmail: () =>
            renderDueReminderEmail({
              fullName: record.user.fullName,
              bookTitle: record.book.title,
              dueDate: record.dueDate,
            }),
        });

        if (emailResult.success) {
          console.log(
            `[SERVICES/DUE_REMINDERS] Email successfully sent to ${record.user.email}`,
          );
          remindedCount++;
        } else {
          console.error(
            `[SERVICES/DUE_REMINDERS] Failed to send email to ${record.user.email}:`,
            emailResult.error,
          );
        }
      } catch (error) {
        console.error(
          `[SERVICES/DUE_REMINDERS] Error processing reminder for ${record.id}:`,
          error,
        );
      }
    }

    console.log(
      `[SERVICES/DUE_REMINDERS] Completed: ${dueBorrows.length} processed, ${remindedCount} reminded`,
    );

    return {
      processed: dueBorrows.length,
      reminded: remindedCount,
    };
  } catch (error) {
    console.error(
      "[SERVICES/DUE_REMINDERS] Error processing due reminders:",
      error,
    );
    return {
      processed: 0,
      reminded: 0,
    };
  }
}
