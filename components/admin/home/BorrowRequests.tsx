import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IKImage } from "imagekitio-next";
import { Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookRequest {
  id: string;
  title: string;
  coverUrl: string;
  coverColor: string;
  author: string;
  genre: string;
  user: {
    name: string;
    avatar?: string;
  };
  date: string;
}

interface BorrowRequestProp {
  bookRequests: BookRequest[];
  loading: boolean;
}

const BorrowRequests: React.FC<BorrowRequestProp> = ({
  bookRequests,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl p-7 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Borrow Requests</h2>
        <Link href="/admin/book-requests" className="text-blue-600 text-sm">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="h-40 w-full flex items-center justify-center">
          <p className="text-gray-500">Loading borrow requests...</p>
        </div>
      ) : bookRequests.length === 0 ? (
        <div className="border border-gray-100 rounded-lg p-8 flex flex-col items-center">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <Image
              src="/images/no-borrow-request.png"
              alt="No Borrow Requests"
              width={250}
              height={250}
            />
          </div>
          <h3 className="text-lg font-medium mb-2">
            No Pending Borrow Requests
          </h3>
          <p className="text-gray-500 text-center">
            There are no borrow book requests awaiting your review at this time.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
            >
              <div className="h-14 w-11 relative">
                {request.coverUrl ? (
                  <IKImage
                    path={request.coverUrl}
                    alt={request.title}
                    width={44}
                    height={56}
                    className="object-cover rounded"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="h-14 w-11 rounded"
                    style={{ backgroundColor: request.coverColor }}
                  ></div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-dark-400">{request.title}</h3>
                <p className="text-sm text-gray-500">
                  By {request.author} • {request.genre}
                </p>
              </div>

              <div className="flex items-center gap-1 min-w-44">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs text-blue-800">
                  {request.user.avatar ? (
                    <Image
                      src={request.user.avatar}
                      alt={request.user.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    request.user.name.charAt(0)
                  )}
                </div>
                <span className="text-sm">{request.user.name}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar size={16} />
                <span>{request.date}</span>
              </div>

              <Button variant="ghost" className="p-2">
                <Eye size={18} className="text-gray-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BorrowRequests;
