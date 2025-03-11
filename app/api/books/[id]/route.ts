import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = (await params).id;
    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);

    if (!book.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book[0]);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Failed to fetch book details" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const ID = (await params).id;

    await db.update(books).set(body).where(eq(books.id, ID));

    const updatedBook = await db
      .select()
      .from(books)
      .where(eq(books.id, ID))
      .limit(1);

    return NextResponse.json(updatedBook[0]); // ✅ Return updated book
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const ID = (await params).id;

    const existingBook = await db
      .select()
      .from(books)
      .where(eq(books.id, ID))
      .limit(1);

    if (!existingBook.length) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await db.delete(borrowRecords).where(eq(borrowRecords.bookId, ID));

    await db.delete(books).where(eq(books.id, ID));

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 },
    );
  }
}
