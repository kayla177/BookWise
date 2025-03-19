"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ImageKitProvider } from "imagekitio-next";
import { Calendar } from "lucide-react";
import config from "@/lib/config";
import {
  accountRequestsDev,
  borrowRequestsDev,
  recentBooksDev,
  statsDev,
} from "@/constants";

import StatsCard from "@/components/admin/home/StatsCard";
import AccountRequests from "@/components/admin/home/AccountRequests";
import RecentlyAddedBooks from "@/components/admin/home/RecentlyAddedBooks";
import BorrowRequests from "@/components/admin/home/BorrowRequests";

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

interface RecentlyAddedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl: string;
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
  // In app/admin/page.tsx, update the fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Attempt to fetch from API
        const response = await fetch("/api/admin/stats");

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        console.log("Stats data:", data); // Log to verify data structure

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

        if (process.env.NODE_ENV === "development") {
          setStats(statsDev);
        }
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
        <BorrowRequests
          bookRequests={bookRequests}
          loading={loading.bookRequests}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recently Added Books */}
          <RecentlyAddedBooks
            recentBooks={recentBooks}
            loading={loading.recentBooks}
          />

          {/* Account Requests */}
          <Link href="/admin/account-requests">
            <AccountRequests
              accountRequests={accountRequests}
              loading={loading.accountRequests}
            />
          </Link>
        </div>
      </div>
    </ImageKitProvider>
  );
};

export default AdminDashboard;
