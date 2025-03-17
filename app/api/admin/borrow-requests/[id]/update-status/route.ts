// import { NextResponse } from "next/server";
// import { db } from "@/database/drizzle";
// import { borrowRecords, books } from "@/database/schema";
// import { eq } from "drizzle-orm";
//
// export async function POST(
//   request: Request,
//   { params }: { params: { id: string } },
// ) {
//   try {
//     const { id } = params;
//     const { status } = await request.json();
//
//     // Validate status
//     if (!["BORROWED", "RETURNED", "LATE_RETURN"].includes(status)) {
//       return NextResponse.json(
//         {
//           error:
//             "Invalid status. Must be one of: BORROWED, RETURNED, LATE_RETURN",
//         },
//         { status: 400 },
//       );
//     }
//
//     // Update borrow record status
//     await db
//       .update(borrowRecords)
//       .set({
//         status: status,
//         ...(status === "RETURNED"
//           ? { returnDate: new Date().toISOString() }
//           : {}),
//       })
//       .where(eq(borrowRecords.id, id));
//
//     // If status is RETURNED, update book availableCopies
//     if (status === "RETURNED") {
//       const record = await db
//         .select({ bookId: borrowRecords.bookId })
//         .from(borrowRecords)
//         .where(eq(borrowRecords.id, id))
//         .limit(1);
//
//       if (record.length > 0) {
//         const bookId = record[0].bookId;
//
//         // Get current book info
//         const book = await db
//           .select({ availableCopies: books.availableCopies })
//           .from(books)
//           .where(eq(books.id, bookId))
//           .limit(1);
//
//         if (book.length > 0) {
//           // Increment available copies
//           await db
//             .update(books)
//             .set({ availableCopies: book[0].availableCopies + 1 })
//             .where(eq(books.id, bookId));
//         }
//       }
//     }
//
//     return NextResponse.json({
//       success: true,
//       message: `Status updated to ${status}`,
//       id: id,
//     });
//   } catch (error) {
//     console.error("Error updating borrow request status:", error);
//     return NextResponse.json(
//       { error: "Failed to update status", details: String(error) },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Validate status
    if (!["BORROWED", "RETURNED", "LATE_RETURN"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Must be one of: BORROWED, RETURNED, LATE_RETURN",
        },
        { status: 400 },
      );
    }

    console.log(
      `[UPDATE-STATUS] Updating status to ${status} for record ${id}`,
    );

    // Update borrow record status
    if (status === "RETURNED") {
      // If status is RETURNED, set returnDate to now
      await db
        .update(borrowRecords)
        .set({
          status: status,
          returnDate: new Date(), // Don't convert to string, let the DB handle it
        })
        .where(eq(borrowRecords.id, id));

      console.log(`[UPDATE-STATUS] Set status to ${status} with return date`);
    } else {
      // Otherwise just update the status
      await db
        .update(borrowRecords)
        .set({ status: status })
        .where(eq(borrowRecords.id, id));

      console.log(
        `[UPDATE-STATUS] Set status to ${status} without return date`,
      );
    }

    // If status is RETURNED, update book availableCopies
    if (status === "RETURNED") {
      const record = await db
        .select({ bookId: borrowRecords.bookId })
        .from(borrowRecords)
        .where(eq(borrowRecords.id, id))
        .limit(1);

      if (record.length > 0) {
        const bookId = record[0].bookId;

        // Get current book info
        const book = await db
          .select({ availableCopies: books.availableCopies })
          .from(books)
          .where(eq(books.id, bookId))
          .limit(1);

        if (book.length > 0) {
          // Increment available copies
          await db
            .update(books)
            .set({ availableCopies: book[0].availableCopies + 1 })
            .where(eq(books.id, bookId));

          console.log(
            `[UPDATE-STATUS] Incremented available copies for book ${bookId}`,
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      id: id,
    });
  } catch (error) {
    console.error("Error updating borrow request status:", error);
    return NextResponse.json(
      { error: "Failed to update status", details: String(error) },
      { status: 500 },
    );
  }
}
