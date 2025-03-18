import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

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

        <Link href={`/receipts/${receiptId}`}>
          <Button className="mt-4 text-sm text-white font-semibold bg-amber-950">
            <Image
              src="/icons/receipt.svg"
              alt="receipt"
              width={18}
              height={18}
              className="object-contain"
            />
            Download Receipt
          </Button>
        </Link>
      </div>
    </li>
  );
};

export default BorrowBookCard;
