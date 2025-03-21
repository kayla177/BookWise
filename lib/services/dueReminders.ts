"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, and, lte } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderDueReminderEmail } from "@/components/emails/DueReminderEmail";

export async function processBookDueReminders(): Promise<{
  processed: number;
  reminded: number;
}> {
  // console.log(
  //   "[SERVICES/DUE_REMINDERS] Starting due book reminders process...",
  // );

  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // console.log(
    //   `[SERVICES/DUE_REMINDERS] Looking for books due on or before: ${today}`,
    // );

    // Query for borrowed books that are due and have NEVER received a reminder
    const dueBorrows = await db
      .select({
        id: borrowRecords.id,
        dueDate: borrowRecords.dueDate,
        borrowDate: borrowRecords.borrowDate,
        reminded: borrowRecords.reminded,
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
          lte(borrowRecords.dueDate, today), // Due today or overdue
          eq(borrowRecords.reminded, false), // Only books that have NEVER been reminded
        ),
      );

    // console.log(
    //   `[SERVICES/DUE_REMINDERS] Found ${dueBorrows.length} books due that need reminders`,
    // );

    let remindedCount = 0;

    // Send reminders for each due book
    for (const record of dueBorrows) {
      try {
        // console.log(
        //   `[SERVICES/DUE_REMINDERS] Processing reminder for book: ${record.book.title} borrowed by ${record.user.email}`,
        // );

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
          // Mark as reminded so we never remind about this borrow record again
          await db
            .update(borrowRecords)
            .set({ reminded: true })
            .where(eq(borrowRecords.id, record.id));

          // console.log(
          //   `[SERVICES/DUE_REMINDERS] Email successfully sent to ${record.user.email} for book "${record.book.title}"`,
          // );
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

    // console.log(
    //   `[SERVICES/DUE_REMINDERS] Completed: ${dueBorrows.length} books processed, ${remindedCount} reminders sent`,
    // );

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
