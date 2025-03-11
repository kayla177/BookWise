"use client";

import React, { useState } from "react";
import { Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import Link from "next/link";

interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    genre: string;
    createdAt: string;
    coverUrl: string;
  };
  onDelete: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onDelete }) => {
  // console.log("ImageKit Endpoint:", config.env.imagekit.urlEndpoint);
  // console.log("Book Cover URL:", book.coverUrl);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    await onDelete(book.id);
    setIsDeleting(false);
  };

  return (
    <ImageKitProvider
      urlEndpoint={config.env.imagekit.urlEndpoint}
      publicKey={config.env.imagekit.publicKey}
    >
      <tr className="border-b border-light-700 text-white">
        {/* Book Title with Cover */}
        <td className="py-4 px-6 flex items-center gap-3">
          <IKImage
            alt={book.title}
            src={`${config.env.imagekit.urlEndpoint}${book.coverUrl}`}
            width={40}
            height={60}
            className="w-10 h-14 rounded-md object-cover"
          />

          <div>
            <p className="text-black text-sm font-semibold">{book.title}</p>
            <p className="text-xs text-gray-400">{book.author}</p>
          </div>
        </td>

        {/* Author */}
        <td className="py-4 px-6 text-dark-600 text-sm">{book.author}</td>

        {/* Genre */}
        <td className="py-4 px-6 text-dark-600 text-sm">{book.genre}</td>

        {/* Date Created */}
        <td className="py-4 px-6 text-dark-600 text-sm">
          {new Date(book.createdAt).toDateString()}
        </td>

        {/* Actions */}
        <td className="py-4 px-6 flex gap-3">
          <Link href={`/admin/books/${book.id}`}>
            <Button
              variant="link"
              className="text-blue-400 flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Button>
          </Link>

          <Button
            variant="ghost"
            onClick={handleDeleteClick}
            className="text-red-400"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : <Trash className="w-5 h-5" />}
          </Button>
        </td>
      </tr>
    </ImageKitProvider>
  );
};

export default BookCard;
