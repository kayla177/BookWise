import React from "react";
import Image from "next/image";

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
  onPrint: () => void;
}

const BorrowReceipt: React.FC<ReceiptProps> = ({
  receiptData,
  onClose,
  onPrint,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="relative bg-dark-800 text-white rounded-lg max-w-md w-full overflow-hidden">
        {/* Top part of the receipt with wavy border */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center">
              <Image
                src="/icons/logo.svg"
                alt="BookWise"
                width={36}
                height={36}
                className="mr-2"
              />
              <h1 className="text-2xl font-bold">BookWise</h1>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-4">Borrow Receipt</h2>

          <p className="mb-1 text-sm">
            Receipt ID:{" "}
            <span className="text-primary">{receiptData.receiptId}</span>
          </p>
          <p className="mb-6 text-sm">
            Date Issued:{" "}
            <span className="text-primary">{receiptData.issuedAt}</span>
          </p>

          <div className="border-t border-gray-700 pt-4 mb-4">
            <h3 className="font-semibold mb-4">Book Details:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span className="mr-1 text-gray-400">Title:</span>
                <span>{receiptData.book.title}</span>
              </li>
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span className="mr-1 text-gray-400">Author:</span>
                <span>{receiptData.book.author}</span>
              </li>
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span className="mr-1 text-gray-400">Genre:</span>
                <span>{receiptData.book.genre}</span>
              </li>
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span className="mr-1 text-gray-400">Borrowed On:</span>
                <span>{receiptData.borrowInfo.borrowDate}</span>
              </li>
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span className="mr-1 text-gray-400">Due Date:</span>
                <span>{receiptData.borrowInfo.dueDate}</span>
              </li>
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span className="mr-1 text-gray-400">Duration:</span>
                <span>{receiptData.borrowInfo.duration} Days</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-4 mb-4">
            <h3 className="font-semibold mb-2">Terms</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span>Please return the book by the due date.</span>
              </li>
              <li className="flex">
                <span className="w-4 mr-2">•</span>
                <span>Lost or damaged books may incur replacement costs.</span>
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-700 pt-4 text-sm">
            <p>
              Thank you for using{" "}
              <span className="font-semibold">BookWise</span>!
            </p>
            <p>
              Website: <span className="text-primary">books.kayla-li.com</span>
            </p>
            <p>
              Email: <span className="text-primary">contact@kayla-li.com</span>
            </p>
          </div>
        </div>

        {/* Wavy bottom edge */}
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-dark-800"></div>
          <div className="flex">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 bg-gray-900 rounded-full -mb-2.5"
              ></div>
            ))}
          </div>
        </div>

        {/* Print button */}
        <div className="bg-gray-900 p-4 flex justify-center">
          <button
            onClick={onPrint}
            className="bg-primary hover:bg-primary/90 text-dark-800 font-bold py-2 px-6 rounded flex items-center"
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
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowReceipt;
