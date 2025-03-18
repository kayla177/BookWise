"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer, Download, BookOpen } from "lucide-react";
import { generateReceiptPDF } from "@/lib/utils";

interface ReceiptProps {
  receiptData: {
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
    user: {
      name: string;
      email: string;
    };
    issuedAt: string;
  };
}

const Receipt: React.FC<ReceiptProps> = ({ receiptData }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  // print receipt
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // generate pdf
  const handleDownload = async () => {
    if (!receiptRef.current) return;

    const success = await generateReceiptPDF(
      receiptRef.current,
      `BookWise-Receipt-${receiptData.receiptId}.pdf`,
    );

    if (!success) {
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6 flex justify-between items-center">
        <Link href="/my-profile">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Profile
          </Button>
        </Link>

        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Printer size={16} className="mr-2" />
            Print Receipt
          </Button>

          <Button
            onClick={handleDownload}
            className="bg-primary hover:bg-primary/90"
          >
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div
        id="receipt-container"
        className="w-full max-w-md print:w-full"
        ref={receiptRef}
      >
        <Card className="bg-dark-800 text-white rounded-lg w-full overflow-hidden border-0 shadow-lg">
          <div className="p-6">
            {/* Header with Logo */}
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-white h-6 w-6" />
              <h1 className="text-xl font-bold">BookWise</h1>
            </div>

            {/* Receipt Title */}
            <h2 className="text-2xl font-bold mb-2">Borrow Receipt</h2>

            <div className="space-y-1 mb-6">
              <p className="text-sm">
                Receipt ID:{" "}
                <span className="text-amber-300">{receiptData.receiptId}</span>
              </p>
              <p className="text-sm">
                Date Issued:{" "}
                <span className="text-amber-300">{receiptData.issuedAt}</span>
              </p>
            </div>

            <div className="border-t border-gray-700 my-6"></div>

            {/* Book Details Section */}
            <h3 className="text-lg font-bold mb-4">Book Details:</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-dark-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Title</p>
                <p className="text-sm font-medium">{receiptData.book.title}</p>
              </div>

              <div className="bg-dark-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Author</p>
                <p className="text-sm font-medium">{receiptData.book.author}</p>
              </div>

              <div className="bg-dark-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Genre</p>
                <p className="text-sm font-medium">{receiptData.book.genre}</p>
              </div>

              <div className="bg-dark-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Borrowed on</p>
                <p className="text-sm font-medium">
                  {receiptData.borrowInfo.borrowDate}
                </p>
              </div>

              <div className="bg-dark-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Due Date</p>
                <p className="text-sm font-medium">
                  {receiptData.borrowInfo.dueDate}
                </p>
              </div>

              <div className="bg-dark-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Duration</p>
                <p className="text-sm font-medium">
                  {receiptData.borrowInfo.duration} Days
                </p>
              </div>

              {receiptData.borrowInfo.returnDate && (
                <div className="bg-dark-700/50 p-4 rounded-lg col-span-2">
                  <p className="text-gray-400 text-xs mb-1">Return Date</p>
                  <p className="text-sm font-medium text-green-400">
                    {receiptData.borrowInfo.returnDate}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-700 mb-6 pt-6">
              <h3 className="font-bold text-lg mb-4">Terms</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Please return the book by the due date.</li>
                <li>Lost or damaged books may incur replacement costs.</li>
              </ul>
            </div>

            <div className="border-t border-gray-700 pt-6 text-center">
              <p className="mb-1">
                Thank you for using <span className="font-bold">BookWise</span>!
              </p>
              <p className="text-sm text-gray-400">
                Website: books.kayla-li.com
              </p>
              <p className="text-sm text-gray-400">
                Email: contact@kayla-li.com
              </p>
            </div>
          </div>

          {/*bottom half circle*/}
          <div className="flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-5 bg-gray-900 rounded-full -mb-2.5"
              ></div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Receipt;
