import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IKImage } from "imagekitio-next";
import { Calendar, Plus } from "lucide-react";

interface RecentlyAddedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  date: string;
}

interface RecentlyAddedBooksProps {
  recentBooks: RecentlyAddedBook[];
  loading: boolean;
}

const RecentlyAddedBooks: React.FC<RecentlyAddedBooksProps> = ({
  recentBooks,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl p-7">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recently Added Books</h2>
        <Link href="/admin/books" className="text-blue-600 text-sm">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="h-40 w-full flex items-center justify-center">
          <p className="text-gray-500">Loading recent books...</p>
        </div>
      ) : (
        <>
          <Link href="/admin/books/new">
            <Button
              variant="outline"
              className="w-full p-4 mb-5 flex justify-center items-center gap-2 border-dashed"
            >
              <Plus size={18} />
              Add New Book
            </Button>
          </Link>

          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="h-12 w-9 relative">
                  {book.coverUrl ? (
                    <IKImage
                      path={book.coverUrl}
                      alt={book.title}
                      width={36}
                      height={48}
                      className="object-cover rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-12 w-9 bg-gray-200 rounded"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-dark-400">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    By {book.author} • {book.genre}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={14} />
                  <span>{book.date}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecentlyAddedBooks;
