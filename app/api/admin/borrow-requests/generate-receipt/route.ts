import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Get borrow record with related info
    const record = await db
      .select({
        id: borrowRecords.id,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,

        // User info
        user: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
          universityId: users.universityId,
        },

        // Book info
        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          coverUrl: books.coverUrl,
          coverColor: books.coverColor,
        },
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.id, id))
      .limit(1);

    if (record.length === 0) {
      return NextResponse.json(
        { error: "Borrow record not found" },
        { status: 404 },
      );
    }

    // Generate a unique receipt ID
    const receiptId = `REC-${id.substring(0, 8)}-${Date.now().toString(36)}`;

    // Format dates for the receipt
    const formatDate = (date: Date | string | null) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Create receipt data
    const receiptData = {
      receiptId: receiptId,
      borrowInfo: {
        id: record[0].id,
        borrowDate: formatDate(new Date(record[0].borrowDate)),
        dueDate: formatDate(new Date(record[0].dueDate)),
        returnDate: record[0].returnDate
          ? formatDate(new Date(record[0].returnDate))
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
        author: record[0].book.author,
        coverUrl: record[0].book.coverUrl,
      },
      issuedAt: formatDate(new Date()),
    };

    return NextResponse.json({
      success: true,
      receipt: receiptData,
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
    return NextResponse.json(
      { error: "Failed to generate receipt", details: String(error) },
      { status: 500 },
    );
  }
}
