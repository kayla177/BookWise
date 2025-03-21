import React from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { desc, eq } from "drizzle-orm";
import BorrowBookList from "@/components/BorrowBookList";
import ProfileCard from "@/components/ProfileCard";
import AdminRequest from "@/components/AdminRequest";

const Page = async () => {
  const session = await auth();
  const user = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      universityId: users.universityId,
      universityCard: users.universityCard,
      status: users.status,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session?.user?.id))
    .limit(1);

  // Fetch both borrowed and returned books
  const borrowedRecords = await db
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
    .where(eq(borrowRecords.userId, session?.user?.id))
    .orderBy(desc(borrowRecords.borrowDate));

  // Separate currently borrowed and returned books
  const currentlyBorrowed = borrowedRecords.filter(
    (record) => record.status === "BORROWED",
  );

  const returnedBooks = borrowedRecords.filter(
    (record) => record.status === "RETURNED",
  );

  console.log("User data:", user[0]); // Log to verify

  return (
    <>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Profile Card Section */}
        <div className="md:w-1/3">
          <ProfileCard user={user[0]} session={session} />

          {/* Admin Request Component */}
          <AdminRequest
            userId={user[0].id}
            currentStatus={user[0].status}
            currentRole={user[0].role}
          />

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

        {/* Books Section */}
        <div className="md:w-2/3">
          {/* Show message if no books at all */}
          {borrowedRecords.length === 0 ? (
            <div className="mt-20 w-full text-center">
              <h3 className="text-2xl font-semibold text-light-100">
                No Borrow Record Found
              </h3>
              <p className="text-light-100 mt-2">
                You haven't borrowed any books yet. Visit our library to start
                reading!
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Borrowed Books Section */}
              {currentlyBorrowed.length > 0 ? (
                <BorrowBookList
                  books={currentlyBorrowed}
                  title="Currently Borrowed Books"
                />
              ) : (
                <div className="w-full">
                  <h1 className="font-semibold text-light-100 text-3xl mb-5">
                    Currently Borrowed Books
                  </h1>
                  <p className="text-light-100">
                    You don't have any books currently borrowed.
                  </p>
                </div>
              )}

              {/* Returned Books Section */}
              {returnedBooks.length > 0 && (
                <BorrowBookList books={returnedBooks} title="Returned Books" />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
