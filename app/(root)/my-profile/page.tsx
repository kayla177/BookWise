import React from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { desc, eq } from "drizzle-orm";
import BorrowBookList from "@/components/BorrowBookList";
import ProfileCard from "@/components/ProfileCard";

const Page = async () => {
  const session = await auth();
  const user = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
    })
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

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
  console.log("[MY-PROFILE] user: ", user[0]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Profile Card Section */}
        <div className="md:w-1/3">
          <ProfileCard user={user[0]} session={session} />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mt-4"
          >
            <Button className="w-full bg-light-500 hover:bg-rose-600">
              Logout
            </Button>
          </form>
        </div>

        {/* Borrowed Books Section */}
        <div className="md:w-2/3">
          {latestBooks.length === 0 ? (
            <div className="mt-20 w-full text-center">
              <h3 className="text-2xl font-semibold text-light-100">
                No Borrow Record Found
              </h3>
            </div>
          ) : (
            <BorrowBookList books={latestBooks} />
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
