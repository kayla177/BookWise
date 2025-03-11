"use client";

import React, { useState, useEffect, useCallback } from "react";
import BookCard from "@/components/admin/BookCard";
import { toast } from "sonner";

const BookList = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/books?page=${page}&limit=10`);
        const data = await res.json();

        if (data.length === 0) {
          setHasMore(false);
          return;
        }

        // Ensure no duplicates are added
        setBooks((prevBooks) => {
          const newBooks = data.filter(
            (newBook) => !prevBooks.some((b) => b.id === newBook.id),
          );
          return [...prevBooks, ...newBooks];
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]);

  // console.log(
  //   "Book IDs:",
  //   books.map((b) => b.id),
  // );

  const handleDelete = useCallback(async (id: string) => {
    try {
      const confirmDelete = confirm(
        "Are you sure you want to delete this book?",
      );
      if (!confirmDelete) return;

      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to delete book");

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Failed to delete book:", error);
      toast.error("Error deleting book", { description: error.message });
    }
  }, []);

  if (loading) {
    return <p className="text-dark-600 text-center mt-10">Loading books...</p>;
  }

  if (books.length === 0) {
    return (
      <div className="text-center text-dark-600 mt-10">
        <p>No books found. 📚</p>
      </div>
    );
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
