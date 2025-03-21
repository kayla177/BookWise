"use server";

import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderReturnConfirmationEmail } from "@/components/emails/ReturnConfirmationEmail";

export const returnBook = async (borrowId: string) => {
  try {
    // 1. Get the borrow record details
    const record = await db
      .select({
        id: borrowRecords.id,
        bookId: borrowRecords.bookId,
        userId: borrowRecords.userId,
        status: borrowRecords.status,
      })
      .from(borrowRecords)
      .where(eq(borrowRecords.id, borrowId))
      .limit(1);

    if (!record.length) {
      return { success: false, error: "Borrow record not found" };
    }

    // Check if the book is already returned
    if (record[0].status === "RETURNED") {
      return { success: false, error: "Book has already been returned" };
    }

    // 2. Update borrow record status to RETURNED
    await db
      .update(borrowRecords)
      .set({
        status: "RETURNED",
        returnDate: new Date(), // Set return date to now
      })
      .where(eq(borrowRecords.id, borrowId));

    // 3. Get book details to update available copies
    const bookInfo = await db
      .select({
        id: books.id,
        title: books.title,
        availableCopies: books.availableCopies,
      })
      .from(books)
      .where(eq(books.id, record[0].bookId))
      .limit(1);

    if (!bookInfo.length) {
      return { success: false, error: "Book not found" };
    }

    // 4. Increment available copies
    await db
      .update(books)
      .set({ availableCopies: bookInfo[0].availableCopies + 1 })
      .where(eq(books.id, record[0].bookId));

    // 5. Get user information for email using proper join syntax
    const userInfo = await db
      .select({
        borrowId: borrowRecords.id,
        userName: users.fullName,
        userEmail: users.email,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.id, borrowId))
      .limit(1);

    // 6. Send return confirmation email
    if (userInfo.length > 0) {
      await sendEmail({
        email: userInfo[0].userEmail,
        subject: `Book Return Confirmation: ${bookInfo[0].title}`,
        renderEmail: () =>
          renderReturnConfirmationEmail({
            fullName: userInfo[0].userName,
            bookTitle: bookInfo[0].title,
          }),
      });
    }

    return {
      success: true,
      message: "Book returned successfully",
    };
  } catch (err) {
    console.error("Error returning book:", err);
    return {
      success: false,
      error: "An error occurred while returning the book",
    };
  }
};
