import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  context: { params: { id: string } }, // ✅ Fix: Properly extract `id`
) {
  const { id } = context.params; // ✅ Correct param extraction

  console.log(`🔍 Received API request for borrow ID:`, id);

  // ✅ Fix: Ensure `id` is a valid UUID
  if (!id || id.length !== 36) {
    console.error("❌ Invalid UUID format:", id);
    return NextResponse.json(
      { error: "Invalid borrow record ID format" },
      { status: 400 },
    );
  }

  try {
    console.log(`🔍 Querying database for borrow record ID: ${id}`);

    // ✅ Fix: Fetch borrow record properly
    const record = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,

        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          universityId: users.universityId,
        },

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
      .where(eq(borrowRecords.id, id))
      .limit(1);

    console.log(`📌 Query result:`, record);

    if (!record || record.length === 0) {
      console.error("❌ Borrow record not found for ID:", id);
      return NextResponse.json(
        { error: "Borrow record not found" },
        { status: 404 },
      );
    }

    const formatDate = (date: string | Date | null) => {
      if (!date) return "";
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return "Invalid Date";
      return parsedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const receiptId = `REC-${id.substring(0, 8)}-${Date.now().toString(36)}`;

    // format data
    const receiptData = {
      receiptId: receiptId,
      borrowInfo: {
        id: record[0].id,
        borrowDate: formatDate(record[0].borrowDate),
        dueDate: formatDate(record[0].dueDate),
        returnDate: record[0].returnDate
          ? formatDate(record[0].returnDate)
          : null,
        status: record[0].status,
      },
      user: {
        id: record[0].user.id,
        name: record[0].user.fullName,
        email: record[0].user.email,
        universityId: record[0].user.universityId,
      },
      book: {
        id: record[0].book.id,
        title: record[0].book.title,
        genre: record[0].book.genre,
        author: record[0].book.author,
        coverUrl: record[0].book.coverUrl,
      },
      issuedAt: formatDate(new Date()),
    };

    console.log("✅ Successfully generated receipt:", receiptData);

    return NextResponse.json({
      success: true,
      receipt: receiptData,
    });
  } catch (error) {
    console.error("🚨 Error in generate-receipt API:", error);
    return NextResponse.json(
      { error: "Failed to generate receipt", details: String(error) },
      { status: 500 },
    );
  }
}
