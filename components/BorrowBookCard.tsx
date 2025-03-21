"use client";

import React, { useState } from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { returnBook } from "@/lib/actions/return-book";

const BorrowBookCard = ({
  id,
  userId,
  bookId,
  borrowDate,
  dueDate,
  returnDate,
  status,
  createdAt,
  book,
}: BorrowBook) => {
  const [isReturning, setIsReturning] = useState(false);
  const isCurrentlyBorrowed = status === "BORROWED";

  // Calculate days left or days since return
  const today = dayjs();
  const due = dayjs(dueDate);
  const daysLeft = due.diff(today, "day");
  const isOverdue = daysLeft < 0 && isCurrentlyBorrowed;

  // Return date formatting for returned books
  const returned = returnDate ? dayjs(returnDate) : null;
  const daysAgo = returned ? today.diff(returned, "day") : null;

  // Generate receipt ID using bookId and timestamp
  const receiptId = `REC-${bookId.substring(0, 4)}-${dayjs(createdAt).unix()}`;

  // Handle book return
  const handleReturnBook = async () => {
    if (!isCurrentlyBorrowed) return;

    try {
      setIsReturning(true);
      const result = await returnBook(id);

      if (result.success) {
        toast.success("Book returned successfully", {
          description: "Thank you for returning the book on time!",
        });

        // Force a refresh of the page to update the UI
        window.location.reload();
      } else {
        toast.error("Failed to return book", {
          description: result.error || "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsReturning(false);
    }
  };

  return (
    <li className="bg-dark-200 p-5 rounded-2xl w-full xs:w-52 shadow-lg">
      <div className="flex flex-col">
        <Link href={`/books/${book.id}`} className="flex flex-col">
          <BookCover
            coverColor={book.coverColor}
            coverImage={book.coverUrl}
            className="mx-auto"
          />

          <div className="mt-4">
            <p className="book-title">{book.title}</p>
            <p className="book-genre">{book.genre}</p>
          </div>

          <div className="mt-3 w-full">
            <div className="flex items-center gap-1 text-sm text-light-100">
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={18}
                height={18}
                className="object-contain"
              />
              <p>Borrowed on {dayjs(borrowDate).format("MMM DD")}</p>
            </div>

            {isCurrentlyBorrowed ? (
              // Status for currently borrowed books
              <div
                className={cn(
                  "flex items-center gap-1 text-sm mt-1",
                  isOverdue ? "text-red-500 font-semibold" : "text-light-100",
                )}
              >
                <Image
                  src={isOverdue ? "/icons/warning.svg" : "/icons/clock.svg"}
                  alt="status"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <p>
                  {isOverdue
                    ? "Overdue Return"
                    : `${daysLeft} days left to return`}
                </p>
              </div>
            ) : (
              // Status for returned books
              <div className="flex items-center gap-1 text-sm mt-1 text-green-500 font-semibold">
                <Image
                  src="/icons/tick.svg"
                  alt="status"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                <p>
                  {daysAgo === 0
                    ? "Returned today"
                    : daysAgo === 1
                      ? "Returned yesterday"
                      : `Returned ${daysAgo} days ago`}
                </p>
              </div>
            )}
          </div>
        </Link>

        {isCurrentlyBorrowed && (
          <Button
            onClick={handleReturnBook}
            disabled={isReturning}
            className="mt-4 text-sm text-white font-semibold bg-green-700 hover:bg-green-800"
          >
            <Image
              src="/icons/admin/calendar.svg"
              alt="return-book"
              height={18}
              width={18}
            />
            {isReturning ? "Returning..." : "Return Book"}
          </Button>
        )}

        <Link href={`/receipts/${receiptId}`}>
          <Button className="mt-4 text-sm text-white font-semibold bg-amber-950">
            <Image
              src="/icons/receipt.svg"
              alt="receipt"
              width={18}
              height={18}
              className="object-contain mr-1"
            />
            Download Receipt
          </Button>
        </Link>
      </div>
    </li>
  );
};

export default BorrowBookCard;
