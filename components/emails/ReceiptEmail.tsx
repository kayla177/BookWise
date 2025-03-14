// components/emails/ReceiptEmail.tsx
import * as React from "react";
import { Text, Button, Link } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface ReceiptEmailProps {
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  receiptUrl: string;
}

export const ReceiptEmail = ({
  fullName,
  bookTitle,
  borrowDate,
  dueDate,
  receiptUrl,
}: ReceiptEmailProps) => {
  return (
    <EmailLayout
      title={`Your Receipt for ${bookTitle} is Ready!`}
      previewText={`Your borrowing receipt for ${bookTitle} is available for download`}
    >
      <Text className="text-light-100 mb-4">Hi {fullName},</Text>

      <Text className="text-light-100 mb-4">
        Your receipt for borrowing <strong>{bookTitle}</strong> has been
        generated. Here are the details:
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
        You can download the receipt here:
      </Text>

      <Button
        href={receiptUrl}
        className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
      >
        Download Receipt
      </Button>

      <Text className="text-light-100 mt-6">Keep the pages turning,</Text>
    </EmailLayout>
  );
};

export default ReceiptEmail;

// Function to render the email as HTML string for sending via Resend
export function renderReceiptEmail(params: {
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  receiptUrl: string;
}): string {
  const { render } = require("@react-email/render");

  return render(
    <ReceiptEmail
      fullName={params.fullName}
      bookTitle={params.bookTitle}
      borrowDate={params.borrowDate}
      dueDate={params.dueDate}
      receiptUrl={params.receiptUrl}
    />,
  );
}
