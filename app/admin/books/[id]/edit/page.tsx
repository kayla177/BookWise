"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BookForm from "@/components/admin/forms/BookForm";

const EditBookPage = () => {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookDetails = useCallback(async () => {
    if (!params.id) return;

    const abortController = new AbortController();
    setLoading(true);

    try {
      const res = await fetch(`/api/books/${params.id}`, {
        signal: abortController.signal, // ✅ Allow canceling the request
      });
      const data = await res.json();

      if (data.createdAt) {
        data.createdAt = new Date(data.createdAt);
      }

      setBook(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching book details:", error);
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
    return () => abortController.abort(); // ✅ Cleanup on unmount or re-fetch
  }, [params.id]);
  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-dark-600">Loading book details...</p>
    );
  }

  if (!loading && !book) {
    return <p className="text-center mt-10 text-red-500">Book not found.</p>;
  }

  return (
    <>
      <Button onClick={() => router.back()} className="back-btn">
        Go Back
      </Button>

      <section className="w-full max-w-2xl">
        {/* Pass existing book details to the BookForm */}
        <BookForm type="update" {...book} />
      </section>
    </>
  );
};
export default EditBookPage;
