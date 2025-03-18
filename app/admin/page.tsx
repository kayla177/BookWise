"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import { Calendar, Eye, ArrowUp, ArrowDown, Plus } from "lucide-react";
import config from "@/lib/config";
import {
  accountRequestsDev,
  borrowRequestsDev,
  recentBooksDev,
  statsDev,
} from "@/constants";

// Define types
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

interface AccountRequest {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  bgColor: string;
}

interface RecentlyAddedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
  date: string;
}

interface StatsCard {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
}

const AdminDashboard = () => {
  const [bookRequests, setBookRequests] = useState<BookRequest[]>([]);
  const [accountRequests, setAccountRequests] = useState<AccountRequest[]>([]);
  const [recentBooks, setRecentBooks] = useState<RecentlyAddedBook[]>([]);
  const [stats, setStats] = useState({
    borrowedBooks: { value: 0, change: 0 },
    totalUsers: { value: 0, change: 0 },
    totalBooks: { value: 0, change: 0 },
  });
  const [loading, setLoading] = useState({
    bookRequests: true,
    accountRequests: true,
    recentBooks: true,
    stats: true,
  });

  // Fetch book requests
  useEffect(() => {
    const fetchBookRequests = async () => {
      try {
        // Attempt to fetch from API
        const response = await fetch("/api/admin/borrow-requests?limit=3");

        if (!response.ok) {
          throw new Error("Failed to fetch book requests");
        }

        const data = await response.json();

        // Transform the data
        const formattedRequests = data.map((item: any) => ({
          id: item.id,
          title: item.bookTitle,
          coverUrl: item.bookCover,
          coverColor: "#27364E", // Default color if not available
          author: item.bookAuthor || "Unknown Author",
          genre: item.bookGenre || "Unknown Genre",
          user: {
            name: item.userName,
            avatar: item.userAvatar,
          },
          date: item.borrowedDate,
        }));

        setBookRequests(formattedRequests);
      } catch (error) {
        console.error("Failed to fetch book requests:", error);

        // Fallback data for development
        setBookRequests(borrowRequestsDev);
      } finally {
        setLoading((prev) => ({ ...prev, bookRequests: false }));
      }
    };

    fetchBookRequests();
  }, []);

  // Fetch account requests
  useEffect(() => {
    const fetchAccountRequests = async () => {
      try {
        // Attempt to fetch from API
        const response = await fetch("/api/admin/account-requests?limit=6");

        if (!response.ok) {
          throw new Error("Failed to fetch account requests");
        }

        const data = await response.json();

        // Generate random background colors
        const bgColors = [
          "#f0f9ff",
          "#e6f4ff",
          "#ffefd5",
          "#e6ffe6",
          "#ffe6e6",
          "#f5f5f5",
        ];

        // Transform the data
        const formattedRequests = data.map((item: any, index: number) => ({
          id: item.id,
          name: item.fullName,
          email: item.email,
          avatar: item.avatar,
          initials: getInitials(item.fullName),
          bgColor: bgColors[index % bgColors.length],
        }));

        setAccountRequests(formattedRequests);
      } catch (error) {
        console.error("Failed to fetch account requests:", error);

        // Fallback data for development
        setAccountRequests(accountRequestsDev);
      } finally {
        setLoading((prev) => ({ ...prev, accountRequests: false }));
      }
    };

    fetchAccountRequests();
  }, []);

  // Fetch recent books
  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        // Attempt to fetch from API
        const response = await fetch("/api/admin/books/recent?limit=6");

        if (!response.ok) {
          throw new Error("Failed to fetch recent books");
        }

        const data = await response.json();

        // Transform the data
        const formattedBooks = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          genre: item.genre,
          coverUrl: item.coverUrl,
          date: new Date(item.createdAt).toLocaleDateString(),
        }));

        setRecentBooks(formattedBooks);
      } catch (error) {
        console.error("Failed to fetch recent books:", error);

        // Fallback data for development
        setRecentBooks(recentBooksDev);
      } finally {
        setLoading((prev) => ({ ...prev, recentBooks: false }));
      }
    };

    fetchRecentBooks();
  }, []);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Attempt to fetch from API
        const response = await fetch("/api/admin/dashboard/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();

        setStats({
          borrowedBooks: {
            value: data.borrowedBooks.value,
            change: data.borrowedBooks.change,
          },
          totalUsers: {
            value: data.totalUsers.value,
            change: data.totalUsers.change,
          },
          totalBooks: {
            value: data.totalBooks.value,
            change: data.totalBooks.change,
          },
        });
      } catch (error) {
        console.error("Failed to fetch statistics:", error);

        // Fallback data for development
        setStats(statsDev);
      } finally {
        setLoading((prev) => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, []);

  // Helper function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <div className="w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatsCard
            title="Borrowed Books"
            value={stats.borrowedBooks.value}
            change={stats.borrowedBooks.change}
            icon={<Calendar size={22} className="text-orange-500" />}
            loading={loading.stats}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.value}
            change={stats.totalUsers.change}
            icon={<Calendar size={22} className="text-green-500" />}
            loading={loading.stats}
          />
          <StatsCard
            title="Total Books"
            value={stats.totalBooks.value}
            change={stats.totalBooks.change}
            icon={<Calendar size={22} className="text-green-500" />}
            loading={loading.stats}
          />
        </div>

        {/* Borrow Requests Section */}
        <div className="bg-white rounded-2xl p-7 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Borrow Requests</h2>
            <Link href="/admin/book-requests" className="text-blue-600 text-sm">
              View all
            </Link>
          </div>

          {loading.bookRequests ? (
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
                There are no borrow book requests awaiting your review at this
                time.
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
                    <h3 className="font-medium text-dark-400">
                      {request.title}
                    </h3>
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

        {/* Recently Added Books + Account Requests Split Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recently Added Books */}
          <div className="bg-white rounded-2xl p-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recently Added Books</h2>
              <Link href="/admin/books" className="text-blue-600 text-sm">
                View all
              </Link>
            </div>

            {loading.recentBooks ? (
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

          {/* Account Requests */}
          <div className="bg-white rounded-2xl p-7">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Account Requests</h2>
              <Link
                href="/admin/account-requests"
                className="text-blue-600 text-sm"
              >
                View all
              </Link>
            </div>

            {loading.accountRequests ? (
              <div className="h-40 w-full flex items-center justify-center">
                <p className="text-gray-500">Loading account requests...</p>
              </div>
            ) : accountRequests.length === 0 ? (
              <div className="border border-gray-100 rounded-lg p-8 flex flex-col items-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <Image
                    src="/icons/admin/no-account-request.png"
                    alt="No Requests"
                    width={200}
                    height={150}
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No Pending Account Requests
                </h3>
                <p className="text-gray-500 text-center">
                  There are currently no account requests awaiting approval.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5">
                {accountRequests.map((account) => (
                  <div
                    key={account.id}
                    className="flex flex-col items-center border border-gray-100 rounded-lg p-4 hover:shadow-sm transition"
                  >
                    {account.avatar ? (
                      <Image
                        src={account.avatar}
                        alt={account.name}
                        width={48}
                        height={48}
                        className="rounded-full mb-2"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: account.bgColor }}
                      >
                        <span className="text-lg font-medium">
                          {account.initials}
                        </span>
                      </div>
                    )}
                    <h3 className="font-medium text-sm text-center">
                      {account.name}
                    </h3>
                    <p className="text-xs text-gray-500 text-center truncate w-full">
                      {account.email}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ImageKitProvider>
  );
};

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  loading: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  loading,
}) => {
  const isPositive = change >= 0;

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm h-32 flex items-center justify-center">
        <p className="text-gray-500">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-5">
        <p className="text-gray-500">{title}</p>
        <div className="p-2 rounded-full bg-gray-50">{icon}</div>
      </div>

      <div className="flex justify-between items-end">
        <h3 className="text-4xl font-bold">{value.toLocaleString()}</h3>
        <div
          className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-orange-500"}`}
        >
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{Math.abs(change)}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
