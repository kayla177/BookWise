import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { ilike, desc } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json([]);
  }

  const searchResults = await db
    .select()
    .from(books)
    .where(ilike(books.title, `%${query}%`))
    .orderBy(desc(books.createdAt))
    .limit(10);

  return NextResponse.json(searchResults);
}
