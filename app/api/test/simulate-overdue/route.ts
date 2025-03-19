import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * API route to simulate an overdue book for testing the due date reminders
 *
 * Required query parameters:
 * - userId: ID of the user who borrowed the book
 * - bookId: ID of the book to mark as overdue
 * - days: (optional) Number of days to set as past due (default: 1)
 * - reminded: (optional) Whether to mark as already reminded (default: false)
 *
 * Example:
 * /api/test/simulate-overdue?userId=123&bookId=456&days=2&reminded=false
 */
export async function GET(request: Request) {
  try {
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const bookId = searchParams.get("bookId");
    const days = parseInt(searchParams.get("days") || "1"); // Default to 1 day overdue
    const reminded = searchParams.get("reminded") === "true"; // Default to false

    // Validate parameters
    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "Both userId and bookId are required" },
        { status: 400 },
      );
    }

    if (isNaN(days) || days < 0) {
      return NextResponse.json(
        { error: "Days must be a positive number" },
        { status: 400 },
      );
    }

    // Check if the user exists
    const userExists = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the book exists
    const bookExists = await db
      .select({ id: books.id, title: books.title })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (bookExists.length === 0) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Check if borrow record exists
    const existingBorrow = await db
      .select()
      .from(borrowRecords)
      .where(
        and(
          eq(borrowRecords.userId, userId),
          eq(borrowRecords.bookId, bookId),
          eq(borrowRecords.status, "BORROWED"),
        ),
      )
      .limit(1);

    // Calculate the overdue date
    const today = new Date();
    const pastDueDate = new Date();
    pastDueDate.setDate(today.getDate() - days);
    const pastDueDateStr = pastDueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    let borrowId;

    // If borrow record exists, update it to be overdue
    if (existingBorrow.length > 0) {
      await db
        .update(borrowRecords)
        .set({
          dueDate: pastDueDateStr,
          reminded: reminded, // Set the reminded flag based on parameter
        })
        .where(eq(borrowRecords.id, existingBorrow[0].id));

      borrowId = existingBorrow[0].id;

      console.log(
        `[SIMULATE_OVERDUE] Updated existing borrow record ${borrowId} to be ${days} days overdue (reminded: ${reminded})`,
      );
    } else {
      // Create a new borrow record that's overdue
      const borrowDate = new Date();
      borrowDate.setDate(pastDueDate.getDate() - 14); // Borrowed 14 days before due date
      const borrowDateStr = borrowDate.toISOString().split("T")[0];

      const result = await db
        .insert(borrowRecords)
        .values({
          userId,
          bookId,
          borrowDate,
          dueDate: pastDueDateStr,
          status: "BORROWED",
          reminded: reminded, // Set the reminded flag based on parameter
        })
        .returning({ id: borrowRecords.id });

      borrowId = result[0].id;

      console.log(
        `[SIMULATE_OVERDUE] Created new borrow record ${borrowId} that is ${days} days overdue (reminded: ${reminded})`,
      );

      // Update available copies
      await db
        .update(books)
        .set({
          availableCopies: sql`${books.availableCopies} - 1`,
        })
        .where(eq(books.id, bookId));
    }

    // Get the updated borrow record
    const updatedBorrow = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        status: borrowRecords.status,
        reminded: borrowRecords.reminded,
        bookTitle: books.title,
        bookId: books.id,
        userId: users.id,
        userName: users.fullName,
        userEmail: users.email,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(eq(borrowRecords.id, borrowId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: `Book "${bookExists[0].title}" is now set to be ${days} days overdue (reminded: ${reminded})`,
      borrowRecord: updatedBorrow[0],
    });
  } catch (error) {
    console.error("[SIMULATE_OVERDUE] Error:", error);
    return NextResponse.json(
      { error: "Failed to simulate overdue book", details: String(error) },
      { status: 500 },
    );
  }
}
