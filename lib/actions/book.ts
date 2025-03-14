"use server";

import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { and, eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    const borrowedBook = await db
      .select()
      .from(borrowRecords)
      .where(
        and(eq(borrowRecords.bookId, bookId), eq(borrowRecords.userId, userId)),
      )
      .limit(1);

    // console.log("[BOOK ACTION]: borrowedBook result:", borrowedBook);

    // borrowBook is array, make sure to use "borrowedBook.length" to check empty instead of just borrowBook
    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    // console.log("[BOOK ACTION]: borrowedBook length:", borrowedBook.length);

    // need debug
    if (borrowedBook.length > 0) {
      console.warn("[WARN] User has already borrowed this book.");
      return { success: false, error: "You already have borrowed this book" };
    }

    // add 7 days from today for borrowing the book
    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    // update the books' available copies after borrow the book
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
