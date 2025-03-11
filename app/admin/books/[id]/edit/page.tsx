"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BookForm from "@/components/admin/forms/BookForm";

const EditBookPage = () => {
  const params = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const abortController = new AbortController();

    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`/api/books/${params.id}`, {
          signal: abortController.signal, // ✅ Allow canceling the request
        });
        const data = await res.json();
        setBook(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching book details:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();

    return () => abortController.abort(); // ✅ Cleanup on unmount or re-fetch
  }, [params.id]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-dark-600">Loading book details...</p>
    );
  }

  if (!book) {
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
