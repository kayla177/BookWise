"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import { BorrowStatusDropdown } from "@/components/admin/BorrowStatusDropdown";
import BorrowReceipt from "@/components/admin/BorrowReceipt";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

interface BorrowRequest {
  id: string;
  bookId: string;
  bookTitle: string;
  bookCover: string;
  bookAuthor: string;
  bookGenre: string;
  userId: string;
  userName: string;
  userEmail: string;
  borrowedDate: string;
  dueDate: string;
  returnDate: string;
  status: "Borrowed" | "Returned" | "Late Return";
}

interface ReceiptData {
  receiptId: string;
  borrowInfo: {
    borrowDate: string;
    dueDate: string;
    returnDate?: string | null;
    duration: number;
  };
  book: {
    title: string;
    author: string;
    genre: string;
  };
  issuedAt: string;
}

const Page = () => {
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Default to newest first
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBorrowRequests = async (
    order: "asc" | "desc" = "desc",
    page: number = 1,
  ) => {
    try {
      setLoading(true);

      console.log(`Fetching borrow requests with sort=${order}&page=${page}`);

      const response = await fetch(
        `/api/admin/borrow-requests?sort=${order}&page=${page}`,
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch borrow requests: ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log(`Received ${data.length} borrow requests`);

      // Transform the data to match our component's expected format
      const formattedRequests = data.map((request: any) => ({
        id: request.id,
        bookId: request.bookId,
        bookTitle: request.bookTitle,
        bookCover: request.bookCover,
        bookAuthor: request.bookAuthor || "Unknown",
        bookGenre: request.bookGenre || "Fiction",
        userId: request.userId,
        userName: request.userName,
        userEmail: request.userEmail,
        borrowedDate: request.borrowedDate,
        dueDate: request.dueDate,
        returnDate: request.returnDate || "",
        // Map API status values to display values
        status:
          request.status === "BORROWED"
            ? "Borrowed"
            : request.status === "RETURNED"
              ? "Returned"
              : "Late Return",
      }));

      setBorrowRequests(formattedRequests);

      // Set total pages based on headers or response data
      if (response.headers.get("X-Total-Pages")) {
        setTotalPages(parseInt(response.headers.get("X-Total-Pages") || "1"));
      }
    } catch (err) {
      console.error("Error fetching borrow requests:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load borrow requests",
      );

      // For development, add some sample data if the API fails
      if (process.env.NODE_ENV === "development") {
        setBorrowRequests([
          {
            id: "1",
            bookId: "b1",
            bookTitle: "The Great Reclamation: A Memoir",
            bookCover: "/books/covers/book1.jpg",
            bookAuthor: "Sarah Johnson",
            bookGenre: "Memoir",
            userId: "u1",
            userName: "Darrell Steward",
            userEmail: "darrellsteward@gmail.com",
            borrowedDate: "Dec 19 2023",
            dueDate: "Dec 29 2023",
            returnDate: "Dec 31 2023",
            status: "Borrowed",
          },
          {
            id: "2",
            bookId: "b2",
            bookTitle: "Inside Evil: Inside Evil's Secret Story",
            bookCover: "/books/covers/book2.jpg",
            bookAuthor: "Michael Roberts",
            bookGenre: "True Crime",
            userId: "u2",
            userName: "Marc Atenson",
            userEmail: "marcine@gmail.com",
            borrowedDate: "Dec 21 2024",
            dueDate: "Jan 17 2024",
            returnDate: "Jan 12 2024",
            status: "Late Return",
          },
          {
            id: "3",
            bookId: "b3",
            bookTitle: "Jayne Castle - People Investigation",
            bookCover: "/books/covers/book3.jpg",
            bookAuthor: "Jayne Castle",
            bookGenre: "Mystery",
            userId: "u3",
            userName: "Susan Drake",
            userEmail: "contact@susandrake.io",
            borrowedDate: "Dec 31 2023",
            dueDate: "Jan 15 2023",
            returnDate: "Jan 25 2023",
            status: "Returned",
          },
          {
            id: "4",
            bookId: "b1",
            bookTitle: "The Great Reclamation: A Memoir",
            bookCover: "/books/covers/book1.jpg",
            bookAuthor: "Sarah Johnson",
            bookGenre: "Memoir",
            userId: "u4",
            userName: "David Smith",
            userEmail: "davidc@yahoo.com",
            borrowedDate: "Dec 19 2023",
            dueDate: "Dec 29 2023",
            returnDate: "Dec 31 2023",
            status: "Borrowed",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Use effect to load data when component mounts or when dependencies change
  useEffect(() => {
    console.log(
      `useEffect triggered with sortOrder=${sortOrder}, page=${currentPage}`,
    );
    fetchBorrowRequests(sortOrder, currentPage);
  }, [sortOrder, currentPage]);

  // Clean toggle function with no async/await or setTimeout
  const toggleSortOrder = () => {
    const newOrder = sortOrder === "desc" ? "asc" : "desc";
    console.log(`Toggling sort order from ${sortOrder} to ${newOrder}`);

    // Update the state
    setSortOrder(newOrder);

    // The useEffect will handle the API call when sortOrder changes

    toast.success(
      newOrder === "asc" ? "Showing oldest first" : "Showing newest first",
    );
  };

  const handleStatusChange = async (
    requestId: string,
    newStatus: "Borrowed" | "Returned" | "Late Return",
  ) => {
    // Map the display status to the API status value
    const apiStatus =
      newStatus === "Borrowed"
        ? "BORROWED"
        : newStatus === "Returned"
          ? "RETURNED"
          : "LATE_RETURN";

    try {
      // Update UI immediately for better UX
      setBorrowRequests(
        borrowRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request,
        ),
      );

      // Call API to update status
      const response = await fetch(
        `/api/admin/borrow-requests/${requestId}/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: apiStatus }),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      toast.success("Status updated", {
        description: `Book status changed to ${newStatus}`,
      });

      // Refresh the list after a short delay
      setTimeout(() => fetchBorrowRequests(sortOrder, currentPage), 1000);
    } catch (error) {
      console.error("Failed to update borrow status:", error);

      // Revert the UI change if the API call fails
      setBorrowRequests(borrowRequests);

      toast.error("Failed to update status", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const generateReceipt = async (requestId: string) => {
    try {
      const response = await fetch(
        `/api/admin/borrow-requests/${requestId}/generate-receipt`,
      );

      if (!response.ok) {
        throw new Error(`Failed to generate receipt: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.receipt) {
        throw new Error("Receipt data not found in response");
      }

      setReceiptData(data.receipt);
      setShowReceipt(true);
    } catch (error) {
      console.error("Error generating receipt:", error);
      toast.error("Failed to generate receipt", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const handlePrintReceipt = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow || !receiptData) return;

    // Create printable HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BookWise - Borrow Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            padding: 20px;
          }
          .receipt {
            max-width: 500px;
            margin: 0 auto;
            background-color: #1e293b;
            color: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .receipt-header {
            padding: 20px;
            border-bottom: 1px solid #2d3748;
          }
          .receipt-body {
            padding: 20px;
          }
          .receipt-footer {
            padding: 20px;
            border-top: 1px solid #2d3748;
            font-size: 14px;
          }
          h1, h2, h3 {
            margin-top: 0;
          }
          .highlight {
            color: #E7C9A5;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 5px;
          }
          .section {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #2d3748;
          }
          @media print {
            body {
              background-color: white;
            }
            .receipt {
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="receipt-header">
            <h1>BookWise</h1>
            <h2>Borrow Receipt</h2>
            <p>Receipt ID: <span class="highlight">${receiptData.receiptId}</span></p>
            <p>Date Issued: <span class="highlight">${receiptData.issuedAt}</span></p>
          </div>
          <div class="receipt-body">
            <div class="section">
              <h3>Book Details:</h3>
              <ul>
                <li>Title: ${receiptData.book.title}</li>
                <li>Author: ${receiptData.book.author}</li>
                <li>Genre: ${receiptData.book.genre}</li>
                <li>Borrowed On: ${receiptData.borrowInfo.borrowDate}</li>
                <li>Due Date: ${receiptData.borrowInfo.dueDate}</li>
                <li>Duration: ${receiptData.borrowInfo.duration} Days</li>
              </ul>
            </div>
            <div class="section">
              <h3>Terms</h3>
              <ul>
                <li>Please return the book by the due date.</li>
                <li>Lost or damaged books may incur replacement costs.</li>
              </ul>
            </div>
            <div class="receipt-footer">
              <p>Thank you for using <strong>BookWise</strong>!</p>
              <p>Website: bookwise.example.com</p>
              <p>Email: support@bookwise.example.com</p>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading borrow requests...</p>
        </div>
      </section>
    );
  }

  if (error && borrowRequests.length === 0) {
    return (
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex justify-center flex-col items-center h-64">
          <p className="text-red-500 mb-2">Failed to load borrow requests</p>
          <p className="text-gray-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <ImageKitProvider
      publicKey={config.env.imagekit.publicKey}
      urlEndpoint={config.env.imagekit.urlEndpoint}
    >
      <section className="w-full rounded-2xl bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <h2 className="text-xl font-semibold">Borrow Book Requests</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 bg-light-800 rounded-md"
              onClick={toggleSortOrder}
              title={sortOrder === "desc" ? "Sort by oldest" : "Sort by newest"}
            >
              <ArrowUpDown size={20} className="text-gray-500" />
            </button>
            <div id="pagination" className="flex-shrink-0">
              <Button
                className="pagination-btn_light"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} className="text-gray-700" />
              </Button>
              <p className="bg-primary-admin text-white">{currentPage}</p>
              <Button
                className="pagination-btn_light"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} className="text-gray-700" />
              </Button>
            </div>
          </div>
        </div>

        {borrowRequests.length === 0 ? (
          <div className="bg-light-700 rounded-lg p-8 text-center">
            <p className="text-gray-600">No borrow requests available.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>User Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Borrowed date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return date</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-10 relative">
                        {request.bookCover ? (
                          <IKImage
                            path={request.bookCover}
                            alt={request.bookTitle}
                            width={40}
                            height={48}
                            className="object-cover rounded"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-sm">{request.bookTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-light-400 flex items-center justify-center">
                        {request.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-dark-400 font-medium">
                          {request.userName}
                        </p>
                        <p className="text-light-500 text-xs">
                          {request.userEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <BorrowStatusDropdown
                      status={request.status}
                      onStatusChange={(newStatus) =>
                        handleStatusChange(request.id, newStatus)
                      }
                    />
                  </TableCell>
                  <TableCell>{request.borrowedDate}</TableCell>
                  <TableCell>{request.dueDate}</TableCell>
                  <TableCell>{request.returnDate}</TableCell>
                  <TableCell>
                    <Button
                      className="book-receipt_admin-btn"
                      onClick={() => generateReceipt(request.id)}
                    >
                      Generate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Receipt Modal */}
        {showReceipt && receiptData && (
          <BorrowReceipt
            receiptData={receiptData}
            onClose={() => setShowReceipt(false)}
            onPrint={handlePrintReceipt}
          />
        )}
      </section>
    </ImageKitProvider>
  );
};

export default Page;
