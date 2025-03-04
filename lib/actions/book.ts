"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    // add 7 days from today for borrowing the book
    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    // const record = db.insert().values();
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
