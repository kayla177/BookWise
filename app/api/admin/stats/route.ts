import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { count, sum } from "drizzle-orm";

export async function GET() {
  try {
    // Get total counts
    const [totalUsersResult, totalBorrowsResult, totalAvailableBooks] =
      await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(borrowRecords),
        db.select({ totalAvailable: sum(books.availableCopies) }).from(books),
      ]);

    const totalUsers = totalUsersResult[0]?.count || 0;
    const totalBorrows = totalBorrowsResult[0]?.count || 0;
    const totalBooks = totalAvailableBooks[0]?.totalAvailable || 0;

    // Calculate change (this would ideally compare to last week/month)
    // For demo purposes, we'll just assign some sample change values
    const userChange = 4; // Increased by 4 users
    const borrowChange = 2; // Increased by 2 borrows
    const bookChange = 2; // Increased by 2 books

    return NextResponse.json({
      totalUsers: {
        value: totalUsers,
        change: userChange,
      },
      totalBooks: {
        value: totalBooks,
        change: bookChange,
      },
      borrowedBooks: {
        value: totalBorrows,
        change: borrowChange,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics", details: String(error) },
      { status: 500 },
    );
  }
}
