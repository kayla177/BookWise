import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, desc, asc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Get sort parameter from URL
    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get("sort") || "desc"; // Default to newest first

    console.log(`[BORROW-REQUESTS] Fetching with sort order: ${sortOrder}`);

    // Dynamically select the order function based on the sort parameter
    const orderFunction = sortOrder === "asc" ? asc : desc;

    const borrowRequests = await db
      .select({
        id: borrowRecords.id,
        userId: borrowRecords.userId,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,

        // Join user details
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },

        // Join book details
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          genre: books.genre,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor,
        },
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(orderFunction(borrowRecords.borrowDate));

    // Format dates and structure for the frontend
    const formattedRequests = borrowRequests.map((request) => {
      // Safe date formatting function
      const formatDate = (date: Date | null) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      return {
        id: request.id,
        bookId: request.bookId,
        bookTitle: request.book.title,
        bookAuthor: request.book.author || "Unknown",
        bookGenre: request.book.genre || "Fiction",
        bookCover: request.book.coverUrl,
        userId: request.userId,
        userName: request.user.fullName,
        userEmail: request.user.email,
        borrowedDate: formatDate(request.borrowDate),
        dueDate: formatDate(request.dueDate),
        returnDate: request.returnDate ? formatDate(request.returnDate) : "",
        status: request.status,
      };
    });

    console.log(
      `[BORROW-REQUESTS] Returning ${formattedRequests.length} requests sorted ${sortOrder}`,
    );

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching borrow requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch borrow requests", details: String(error) },
      { status: 500 },
    );
  }
}
