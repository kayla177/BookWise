"use client";

import React from "react";
import { IKImage } from "imagekitio-next";
import { Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookItemProps {
  id: string;
  title: string;
  coverUrl: string;
  coverColor: string;
  author: string;
  genre: string;
  user?: {
    name: string;
    avatar?: string;
  };
  date: string;
  isBorrowRequest?: boolean; // Toggle between borrow requests & recent books
}

const BookItem: React.FC<BookItemProps> = ({
  id,
  title,
  coverUrl,
  coverColor,
  author,
  genre,
  user,
  date,
  isBorrowRequest = false,
}) => {
  return (
    <div
      key={id}
      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
    >
      {/* Book Cover */}
      <div className="h-14 w-11 relative">
        {coverUrl ? (
          <IKImage
            path={coverUrl}
            alt={title}
            width={44}
            height={56}
            className="object-cover rounded"
            loading="lazy"
          />
        ) : (
          <div
            className="h-14 w-11 rounded"
            style={{ backgroundColor: coverColor }}
          ></div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1">
        <h3 className="font-medium text-dark-400">{title}</h3>
        <p className="text-sm text-gray-500">
          By {author} • {genre}
        </p>
      </div>

      {/* User Info (Only for Borrow Requests) */}
      {isBorrowRequest && user && (
        <div className="flex items-center gap-1 min-w-44">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-full w-6 h-6"
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <span className="text-sm">{user.name}</span>
        </div>
      )}

      {/* Date */}
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Calendar size={16} />
        <span>{date}</span>
      </div>

      {/* View Button (Only for Borrow Requests) */}
      {isBorrowRequest && (
        <Button variant="ghost" className="p-2">
          <Eye size={18} className="text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default BookItem;
