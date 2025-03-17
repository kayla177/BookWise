import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    const recentBooks = await db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        coverUrl: books.coverUrl,
        coverColor: books.coverColor,
        createdAt: books.createdAt,
      })
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(limit);

    // Format dates and transform data for the frontend
    const formattedBooks = recentBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      coverUrl: book.coverUrl,
      coverColor: book.coverColor,
      createdAt: book.createdAt?.toISOString(),
    }));

    return NextResponse.json(formattedBooks);
  } catch (error) {
    console.error("Error fetching recent books:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent books", details: String(error) },
      { status: 500 },
    );
  }
}
