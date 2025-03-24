"use server";

import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { and, eq } from "drizzle-orm";
import dayjs from "dayjs";

import { sendEmail } from "@/lib/workflow";
import {
  renderBookBorrowedEmail,
  renderReceiptEmail,
} from "@/components/emails";
import config from "@/lib/config";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({
        availableCopies: books.availableCopies,
        title: books.title,
        author: books.author,
        genre: books.genre,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    const borrowedBook = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.status, "BORROWED"), // Only consider books that are still borrowed
        ),
      )
      .limit(1);

    // Check if book is available
    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    // Check if user already borrowed this book
    if (borrowedBook.length > 0) {
      console.warn("[WARN] User has already borrowed this book.");
      return { success: false, error: "You already have borrowed this book" };
    }

    // Add 7 days from today for borrowing the book
    const borrowDate = new Date().toDateString();
    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    // Insert the borrow record
    const record = await db
      .insert(borrowRecords)
      .values({
        userId,
        bookId,
        dueDate,
        status: "BORROWED",
      })
      .returning();

    // Update the books' available copies after borrowing the book
    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    // Get user information
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // Generate a receipt ID that will be consistent and can be recreated
    // This format allows us to generate the exact same ID in the UI
    const receiptId = `REC-${bookId.substring(0, 4)}-${Math.floor(Date.now() / 1000)}`;

    // Generate receipt URL - path to view/download the receipt
    const receiptUrl = `${config.env.prodApiEndpoint}/receipts/${receiptId}`;

    // Send Book Borrowed Email
    await sendEmail({
      email: user[0].email,
      subject: `Book Borrowed: ${book[0].title}`,
      renderEmail: () =>
        renderBookBorrowedEmail({
          fullName: user[0].fullName,
          bookTitle: book[0].title,
          borrowDate: borrowDate,
          dueDate: dueDate,
        }),
    });

    // Send Receipt Email
    await sendEmail({
      email: user[0].email,
      subject: `Your Receipt for ${book[0].title}`,
      renderEmail: () =>
        renderReceiptEmail({
          fullName: user[0].fullName,
          bookTitle: book[0].title,
          borrowDate: borrowDate,
          dueDate: dueDate,
          receiptUrl: receiptUrl,
        }),
    });

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

// "use server";
//
// import { books, borrowRecords, users } from "@/database/schema";
// import { db } from "@/database/drizzle";
// import { and, eq } from "drizzle-orm";
// import dayjs from "dayjs";
//
// import { sendEmail } from "@/lib/workflow";
// import { renderBookBorrowedEmail } from "@/components/emails";
//
// export const borrowBook = async (params: BorrowBookParams) => {
//   const { userId, bookId } = params;
//
//   try {
//     const book = await db
//       .select({ availableCopies: books.availableCopies, title: books.title })
//       .from(books)
//       .where(eq(books.id, bookId))
//       .limit(1);
//
//     const borrowedBook = await db
//       .select()
//       .from(borrowRecords)
//       .where(
//         and(eq(borrowRecords.bookId, bookId), eq(borrowRecords.userId, userId)),
//       )
//       .limit(1);
//
//     // console.log("[BOOK ACTION]: borrowedBook result:", borrowedBook);
//
//     // borrowBook is array, make sure to use "borrowedBook.length" to check empty instead of just borrowBook
//     if (!book.length || book[0].availableCopies <= 0) {
//       return {
//         success: false,
//         error: "Book is not available for borrowing",
//       };
//     }
//
//     // console.log("[BOOK ACTION]: borrowedBook length:", borrowedBook.length);
//
//     // need debug
//     if (borrowedBook.length > 0) {
//       console.warn("[WARN] User has already borrowed this book.");
//       return { success: false, error: "You already have borrowed this book" };
//     }
//
//     // add 7 days from today for borrowing the book
//     const dueDate = dayjs().add(7, "day").toDate().toDateString();
//
//     const record = await db.insert(borrowRecords).values({
//       userId,
//       bookId,
//       dueDate,
//       status: "BORROWED",
//     });
//
//     // update the books' available copies after borrow the book
//     await db
//       .update(books)
//       .set({ availableCopies: book[0].availableCopies - 1 })
//       .where(eq(books.id, bookId));
//
//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, userId))
//       .limit(1);
//
//     // 🔹 Send Book Borrowed Email
//     await sendEmail({
//       email: user[0].email,
//       subject: `Book Borrowed: ${book[0].title}`,
//       renderEmail: () =>
//         renderBookBorrowedEmail({
//           fullName: user[0].fullName,
//           bookTitle: book[0].title,
//           borrowDate: new Date().toDateString(),
//           dueDate,
//         }),
//     });
//
//     return {
//       success: true,
//       data: JSON.parse(JSON.stringify(record)),
//     };
//   } catch (err) {
//     console.error(err);
//
//     return {
//       success: false,
//       error: "An error occurred while borrowing the book",
//     };
//   }
// };
