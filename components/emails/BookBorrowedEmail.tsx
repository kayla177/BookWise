// components/emails/BookBorrowedEmail.tsx
import * as React from "react";
import { Text, Button, Link } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface BookBorrowedEmailProps {
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
}

export const BookBorrowedEmail = ({
  fullName,
  bookTitle,
  borrowDate,
  dueDate,
}: BookBorrowedEmailProps) => {
  return (
    <EmailLayout
      title="You've Borrowed a Book!"
      previewText={`You've successfully borrowed ${bookTitle}`}
    >
      <Text className="text-light-100 mb-4">Hi {fullName},</Text>

      <Text className="text-light-100 mb-4">
        You've successfully borrowed <strong>{bookTitle}</strong>. Here are the
        details:
      </Text>

      <ul className="text-light-100 mb-6 list-disc pl-5">
        <li className="mb-2">
          Borrowed On: <strong>{borrowDate}</strong>
        </li>
        <li>
          Due Date: <strong>{dueDate}</strong>
        </li>
      </ul>

      <Text className="text-light-100 mb-6">
        Enjoy your reading, and don't forget to return the book on time!
      </Text>

      <Button
        href="https://bookwise.yourdomain.com/my-profile"
        className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
      >
        View Borrowed Books
      </Button>
    </EmailLayout>
  );
};

export default BookBorrowedEmail;

// Function to render the email as HTML string for sending via Resend
export function renderBookBorrowedEmail(params: {
  fullName: string;
  bookTitle: string;
  borrowDate?: string;
  dueDate: string;
}): string {
  const { render } = require("@react-email/render");
  // Use current date if borrowDate is not provided
  const borrowDate = params.borrowDate || new Date().toLocaleDateString();

  return render(
    <BookBorrowedEmail
      fullName={params.fullName}
      bookTitle={params.bookTitle}
      borrowDate={borrowDate}
      dueDate={params.dueDate}
    />,
  );
}
