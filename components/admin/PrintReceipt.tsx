"use client";

import React from "react";

interface PrintReceiptProps {
  receiptData: ReceiptData;
}

const PrintReceipt: React.FC<PrintReceiptProps> = ({ receiptData }) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

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

  return (
    <button
      onClick={handlePrint}
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
  );
};

export default PrintReceipt;
