import React from "react";
import BorrowBookCard from "@/components/BorrowBookCard";

interface Props {
  books: BorrowBook[];
  title?: string;
}

const BorrowBookList = ({ books, title = "Borrowed books" }: Props) => {
  return (
    <div>
      <h1 className="font-semibold text-light-100 text-3xl mb-5">{title}</h1>
      <section>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BorrowBookCard key={book.id} {...book} />
          ))}
        </ul>
      </section>
    </div>
  );
};

export default BorrowBookList;
