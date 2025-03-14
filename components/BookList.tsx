import React from "react";
import BookCard from "@/components/BookCard";

interface Props {
  title: string;
  // "Book" are defined in types.d.ts
  books: Book[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  // if (title === "Latest Books") {
  //   if (books.length < 2) return;
  // }

  if (books.length === 0) {
    return <h3 className="text-light-100 font-bold mt-10">No books found.</h3>;
  }

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => {
          return <BookCard key={book.id} {...book} />;
        })}
      </ul>
    </section>
  );
};

export default BookList;
