import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { books, borrowRecords } from "@/database/schema";
import { db } from "@/database/drizzle";
import { desc, eq } from "drizzle-orm";
import { late } from "zod";

const Page = async () => {
  // const latestBooks = await db
  //   .select()
  //   .from(borrowRecords)
  //   .limit(10)
  //   .orderBy(desc(borrowRecords.borrowDate));

  const latestBooks = await db
    .select({
      id: borrowRecords.id,
      userId: borrowRecords.userId,
      bookId: borrowRecords.bookId,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      returnDate: borrowRecords.returnDate,
      status: borrowRecords.status,
      createdAt: borrowRecords.createdAt,

      // Join book details
      book: {
        id: books.id,
        title: books.title,
        author: books.author,
        genre: books.genre,
        rating: books.rating,
        totalCopies: books.totalCopies,
        availableCopies: books.availableCopies,
        description: books.description,
        coverColor: books.coverColor,
        coverUrl: books.coverUrl,
        videoUrl: books.videoUrl,
        summary: books.summary,
        createdAt: books.createdAt,
      },
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .limit(10)
    .orderBy(desc(borrowRecords.borrowDate));

  console.log("[MY-PROFILE] Latest Books: ", latestBooks);

  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      {latestBooks.length === 0 ? (
        <div className="mt-20 w-full text-center">
          <h3 className="text-2xl font-semibold text-light-100">
            No Borrow Record Found
          </h3>
        </div>
      ) : (
        <BookList
          title="Borrowed Books"
          books={latestBooks.map((b) => b.book)}
          containerClassName="mt-28"
        />
      )}
    </>
  );
};
export default Page;
