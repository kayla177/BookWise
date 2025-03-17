import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    // Get total counts
    const [totalUsersResult, totalBooksResult, totalBorrowsResult] =
      await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(books),
        db.select({ count: count() }).from(borrowRecords),
      ]);

    const totalUsers = totalUsersResult[0]?.count || 0;
    const totalBooks = totalBooksResult[0]?.count || 0;
    const totalBorrows = totalBorrowsResult[0]?.count || 0;

    // Calculate change (this would ideally compare to last week/month)
    // For demo purposes, we'll just assign some sample change values
    const userChange = 4; // Increased by 4 users
    const bookChange = 2; // Increased by 2 books
    const borrowChange = 2; // Increased by 2 borrows

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
