// components/admin/BorrowReceipt.tsx
import React, { useRef } from "react";
import Image from "next/image";
import { generateReceiptPDF } from "@/lib/utils";
import { toast } from "sonner";

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
    issuedAt: string;
  };
  onClose: () => void;
}

const BorrowReceipt: React.FC<ReceiptProps> = ({ receiptData, onClose }) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!receiptRef.current) {
      toast.error("Could not generate receipt");
      return;
    }

    try {
      const success = await generateReceiptPDF(
        receiptRef.current,
        `BookWise-Receipt-${receiptData.receiptId}.pdf`,
      );

      if (success) {
        toast.success("Receipt downloaded successfully");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("An error occurred while generating the receipt");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full overflow-hidden">
        {/* The receipt content - dark themed to match Figma */}
        <div ref={receiptRef} className="bg-dark-800 text-white p-6">
          {/* Header with BookWise logo */}
          <div className="flex items-center mb-4">
            <div className="text-white mr-2">
              <Image
                src="/icons/logo.svg"
                alt="BookWise"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-white">BookWise</h1>
          </div>

          <h2 className="text-xl font-semibold mb-2">Borrow Receipt</h2>

          <div className="mb-6">
            <p className="text-sm text-light-100">
              Receipt ID: {receiptData.receiptId}
            </p>
            <p className="text-sm text-light-100">
              Date Issued: {receiptData.issuedAt}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Book Details:</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-700 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Title</p>
                <p className="text-sm">{receiptData.book.title}</p>
              </div>

              <div className="bg-dark-700 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Author</p>
                <p className="text-sm">{receiptData.book.author}</p>
              </div>

              <div className="bg-dark-700 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Genre</p>
                <p className="text-sm">{receiptData.book.genre}</p>
              </div>

              <div className="bg-dark-700 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Borrowed on</p>
                <p className="text-sm">{receiptData.borrowInfo.borrowDate}</p>
              </div>

              <div className="bg-dark-700 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Due Date</p>
                <p className="text-sm">{receiptData.borrowInfo.dueDate}</p>
              </div>

              <div className="bg-dark-700 p-3 rounded">
                <p className="text-gray-400 text-xs mb-1">Duration</p>
                <p className="text-sm">
                  {receiptData.borrowInfo.duration || 7} Days
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Terms</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Please return the book by the due date.</li>
              <li>Lost or damaged books may incur replacement costs.</li>
            </ul>
          </div>

          <div className="text-center text-sm">
            <p className="mb-1">
              Thank you for using{" "}
              <span className="font-semibold">BookWise</span>!
            </p>
            <p>Website: books.kayla-li.com | Email: contact@kayla-li.com</p>
          </div>

          {/* Wavy bottom edge */}
          <div className="mt-4 flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 bg-gray-900 rounded-full -mb-2.5"
              ></div>
            ))}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="bg-white p-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-dark-800"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-amber-300 hover:bg-amber-400 rounded text-dark-800 font-semibold flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowReceipt;
