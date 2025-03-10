"use client";

import React, { useState, useEffect } from "react";
import BookCard from "@/components/admin/BookCard";

const BookList = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  };

  if (loading) {
    return <p className="text-dark-600 text-center mt-10">Loading books...</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-dark-600 mb-4">All Books</h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-light-800 rounded-lg">
            <tr className="text-dark-600 text-sm border-b border-light-700">
              <th className="py-2 px-4 text-left font-normal">Book Title</th>
              <th className="py-2 px-4 text-left font-normal">Author</th>
              <th className="py-2 px-4 text-left font-normal">Genre</th>
              <th className="py-2 px-4 text-left font-normal">Date Created</th>
              <th className="py-2 px-4 text-left font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <BookCard key={book.id} book={book} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;
