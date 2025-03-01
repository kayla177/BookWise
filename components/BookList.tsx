import React from "react";
import BookCard from "@/components/BookCard";
import book from "@/lib/admin/actions/book";

interface BookListProps {
  title: string;
  // "Book" are defined in types.d.ts
  books: Book[];
  containerClassName: string;
}

const BookList = ({ title, books, containerClassName }: BookListProps) => {
  if (books.length > 2) {
    return;
  }

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.title} {...book} />
        ))}
      </ul>
    </section>
  );
};
export default BookList;
