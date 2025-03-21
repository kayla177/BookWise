import { redirect } from "next/navigation";
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";
import Receipt from "@/components/Receipt";
import dayjs from "dayjs";
import { formatDate } from "@/lib/utils";
import { auth } from "@/auth";

// Receipt page that displays a receipt for a specific borrow record
export default async function ReceiptPage({
  params,
}: {
  params: { receiptId: string };
}) {
  // Check if user is logged in
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in?callbackUrl=/receipts/" + params.receiptId);
  }

  // Parse receipt ID format: REC-{bookIdPrefix}-{timestamp}
  const receiptParts = params.receiptId.split("-");

  if (receiptParts.length < 3 || receiptParts[0] !== "REC") {
    redirect("/my-profile"); // Invalid receipt ID format
  }

  try {
    // Get user's borrowing records
    const bookIdPrefix = receiptParts[1];

    const userBorrowRecords = await db
      .select({
        id: borrowRecords.id,
        bookId: borrowRecords.bookId,
        borrowDate: borrowRecords.borrowDate,
        dueDate: borrowRecords.dueDate,
        returnDate: borrowRecords.returnDate,
        status: borrowRecords.status,
        createdAt: borrowRecords.createdAt,

        book: {
          id: books.id,
          title: books.title,
          author: books.author,
          genre: books.genre,
        },
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .where(eq(borrowRecords.userId, session.user.id));

    // Find the most likely match based on the receipt prefix and timestamp
    const record = userBorrowRecords.find((record) =>
      record.bookId.startsWith(bookIdPrefix),
    );

    if (!record) {
      redirect("/my-profile"); // No matching record found
    }

    // Calculate duration based on borrow and due dates
    const borrowDate = dayjs(record.borrowDate);
    const dueDate = dayjs(record.dueDate);
    const duration = dueDate.diff(borrowDate, "day");

    // Format dates for display
    const formattedBorrowDate = formatDate(record.borrowDate);
    const formattedDueDate = formatDate(record.dueDate);

    // Generate receipt data
    const receiptData = {
      receiptId: params.receiptId,
      borrowInfo: {
        borrowDate: formattedBorrowDate,
        dueDate: formattedDueDate,
        returnDate: record.returnDate ? formatDate(record.returnDate) : null,
        duration: duration,
      },
      book: {
        title: record.book.title,
        author: record.book.author,
        genre: record.book.genre,
      },
      user: {
        name: session.user.name || "User",
        email: session.user.email || "",
      },
      issuedAt: formatDate(new Date()),
    };

    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Receipt receiptData={receiptData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching receipt:", error);
    redirect("/my-profile");
  }
}
