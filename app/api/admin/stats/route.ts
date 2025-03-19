// Fix for app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users, books, borrowRecords } from "@/database/schema";
import { count, sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get total counts - simplified to ensure it works
    const [usersCount, booksResult, borrowsCount] = await Promise.all([
      // Count all users
      db.select({ count: count() }).from(users),

      // Get book counts directly
      db
        .select({
          total: count(books.id),
          available: sql`SUM(${books.availableCopies})`,
        })
        .from(books),

      // Count current borrowed books
      db
        .select({ count: count() })
        .from(borrowRecords)
        .where(eq(borrowRecords.status, "BORROWED")),
    ]);

    // Handle the data safely
    const totalUsers = usersCount[0]?.count || 0;
    const totalBooks = Number(booksResult[0]?.total || 0);
    const availableBooks = Number(booksResult[0]?.available || 0);
    const borrowedBooks = borrowsCount[0]?.count || 0;

    // sample increase number
    const userChange = 2;
    const bookChange = 3;
    const borrowChange = borrowedBooks > 2 ? 2 : 0;

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
        value: borrowedBooks,
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
