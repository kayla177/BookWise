// import { NextResponse } from "next/server";
// import { db } from "@/database/drizzle";
// import { books } from "@/database/schema";
// import { desc } from "drizzle-orm";
//
// export async function GET() {
//   try {
//     const latestBooks = await db
//       .select()
//       .from(books)
//       .orderBy(desc(books.createdAt))
//       .limit(10);
//
//     return NextResponse.json(latestBooks);
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch books" },
//       { status: 500 },
//     );
//   }
// }
//

import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let bookList;

    if (query) {
      // 🔍 Ensure `coverColor` is included in search results
      bookList = await db
        .select({
          id: books.id,
          title: books.title,
          author: books.author,
          genre: books.genre,
          createdAt: books.createdAt,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor, // ✅ Ensure this is fetched
        })
        .from(books)
        .where(ilike(books.title, `%${query}%`)) // Case-insensitive search
        .orderBy(desc(books.createdAt))
        .limit(10);
    } else {
      // 📚 Fetch latest books (for homepage & admin panel)
      bookList = await db
        .select({
          id: books.id,
          title: books.title,
          author: books.author,
          genre: books.genre,
          createdAt: books.createdAt,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor, // ✅ Make sure this is also included
        })
        .from(books)
        .orderBy(desc(books.createdAt))
        .limit(10);
    }

    return NextResponse.json(bookList);
  } catch (error) {
    console.error("❌ Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 },
    );
  }
}
