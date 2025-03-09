import React from "react";
import BookCard from "@/components/BookCard";

interface Props {
  title: string;
  // "Book" are defined in types.d.ts
  books: (Book | BorrowBook)[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  if (books.length < 2) return;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => {
          // Check if book is a BorrowBook (has a book field)
          const bookData = "book" in book ? book.book : book;

          return <BookCard key={bookData.id} {...bookData} />;
        })}
      </ul>
    </section>
  );
};

export default BookList;
