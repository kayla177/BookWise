"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImageKitProvider } from "imagekitio-next";
import config from "@/lib/config";
import BorrowReceipt from "@/components/admin/borrowRequests/BorrowReceipt";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

import BorrowRequestCard from "@/components/admin/borrowRequests/BorrowRequestCard";
import PrintReceipt from "@/components/admin/borrowRequests/PrintReceipt";
import { generateReceiptPDF } from "@/lib/utils";

const Page = () => {
  const [borrowRequests, setBorrowRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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

  const onPrint = useCallback(() => {
    if (receiptData) {
      // Try to generate and download the PDF
      const element = document.getElementById("receipt-container");
      if (element) {
        generateReceiptPDF(
          element as HTMLElement,
          `BookWise-Receipt-${receiptData.receiptId}.pdf`,
        );
      } else {
        // Fallback to browser print
        window.print();
      }
    }
  }, [receiptData]);

  const generateReceipt = async (requestId: string) => {
    console.log("[BOOK_REQUEST]Generating receipt for requestId:", requestId);

    try {
      const response = await fetch(
        `/api/admin/borrow-requests/${requestId}/generate-receipt`,
      );

      if (!response.ok) {
        throw new Error(
          `[BOOK_REQUEST] Failed to generate receipt: ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data.receipt) {
        throw new Error("[BOOK_REQUEST] Receipt data not found in response");
      }

      setReceiptData(data.receipt);
      setShowReceipt(true);
    } catch (error) {
      console.error("[BOOK_REQUEST] Error generating receipt:", error);
      toast.error("[BOOK_REQUEST] Failed to generate receipt", {
        description:
          error instanceof Error
            ? error.message
            : "[BOOK_REQUEST] Unknown error occurred",
      });
    }
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
          <BorrowRequestCard
            borrowRequests={borrowRequests}
            handleStatusChange={handleStatusChange}
            generateReceipt={generateReceipt}
          />
        )}

        {/* Receipt Modal */}
        {showReceipt && receiptData && (
          <BorrowReceipt
            receiptData={receiptData}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </section>
    </ImageKitProvider>
  );
};

export default Page;
