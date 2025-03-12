"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IKImage, IKVideo, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import { Pencil, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const BookDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Use useCallback to prevent unnecessary re-renders
  const fetchBookDetails = useCallback(async () => {
    if (!params.id) return;

    const abortController = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/books/${params.id}`, {
        signal: abortController.signal,
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch book: ${res.statusText}`);
      }

      const data: Book = await res.json();
      setBook(data);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching book details:", error);
          setError(error.message || "Failed to fetch book");
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setLoading(false);
    }

    return () => abortController.abort();
  }, [params.id]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-dark-600">Loading book details...</p>
    );
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (!loading && !book) {
    return <p className="text-center mt-10 text-red-500">Book not found.</p>;
  }

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Go Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 bg-white"
        >
          <ArrowLeft className="w-5 h-5" />
          Go back
        </Button>

        <div className="flex gap-8">
          {/* Book Cover */}
          <div className="w-48 h-64 bg-light-700 rounded-md p-2">
            {book?.coverUrl ? (
              <IKImage
                path={book.coverUrl}
                alt={book.title}
                width={400}
                height={550}
                className="rounded-md object-cover"
              />
            ) : (
              <p className="text-center text-gray-400">No cover available</p>
            )}
          </div>

          {/* Book Details */}
          <div className="flex-1">
            <p className="text-light-500 text-sm flex items-center gap-1">
              Created at:
              <Image
                src="/icons/calendar.svg"
                alt="Calendar Icon"
                width={16}
                height={16}
              />
              {book?.createdAt
                ? new Date(book.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <h1 className="mt-3 text-2xl font-bold text-dark-600">
              {book?.title}
            </h1>
            <p className="mt-1 text-md text-dark-700 font-semibold">
              By {book?.author}
            </p>
            <p className="mt-1.5 text-sm text-gray-500">{book?.genre}</p>

            {/* Edit Button (if admin) */}
            <Link href={`/admin/books/${params.id}/edit`}>
              <Button className="mt-6 flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Edit Book
              </Button>
            </Link>
          </div>
        </div>

        {/* Book Summary & Video */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary */}
          <div>
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            {book?.summary ? (
              book.summary.split("\n").map((line, i) => (
                <p key={i} className="text-dark-700 mt-2.5">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-gray-400">No summary available.</p>
            )}
          </div>

          {/* Video */}
          <div>
            <h2 className="text-lg font-bold mb-2">Video</h2>
            {book?.videoUrl ? (
              <IKVideo
                className="mt-2 rounded-lg w-full"
                controls={true}
                path={book.videoUrl}
              />
            ) : (
              <p className="text-gray-400">No video available.</p>
            )}
          </div>
        </div>
      </div>
    </ImageKitProvider>
  );
};

export default BookDetail;
