import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const latestBooks = await db
      .select()
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(10);

    return NextResponse.json(latestBooks);
  } catch (error) {
    console.error("❌ Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}
