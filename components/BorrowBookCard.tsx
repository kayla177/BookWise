import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

const BorrowBookCard = ({
  userId,
  bookId,
  borrowDate,
  dueDate,
  status,
  createdAt,
  book,
}: BorrowBook) => {
  // console.log("BorrowBookCard", book);

  const today = dayjs();
  const due = dayjs(dueDate);
  const daysLeft = due.diff(today, "day");
  const isOverdue = daysLeft < 0;

  return (
    <li className="bg-dark-200 p-5 rounded-2xl w-full xs:w-52 shadow-lg">
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
              {isOverdue ? "Overdue Return" : `${daysLeft} days left to return`}
            </p>
          </div>
        </div>

        {/*/!* Download Receipt Button *!/*/}
        {/*<Button className="book-btn mt-3">Download receipt</Button>*/}
      </Link>
    </li>
  );
};

export default BorrowBookCard;
