import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import { render } from "@react-email/render";

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
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        You've successfully borrowed <strong>{bookTitle}</strong>. Here are the
        details:
      </Text>

      <table
        style={{
          width: "100%",
          borderSpacing: "0",
          color: "#f8fafc",
          marginBottom: "24px",
        }}
      >
        <tr>
          <td style={{ padding: "8px 0" }}>
            <strong>Borrowed On:</strong>
          </td>
          <td style={{ padding: "8px 0" }}>{borrowDate}</td>
        </tr>
        <tr>
          <td style={{ padding: "8px 0" }}>
            <strong>Due Date:</strong>
          </td>
          <td style={{ padding: "8px 0" }}>{dueDate}</td>
        </tr>
      </table>

      <Button
        href="https://book-store-rho-woad.vercel.app/my-profile"
        style={{
          backgroundColor: "#E7C9A5",
          color: "#1e293b",
          padding: "12px 24px",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        View Borrowed Books
      </Button>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        Happy reading,
        <br />
        The BookWise Team
      </Text>
    </EmailLayout>
  );
};

export default BookBorrowedEmail;

// Function to render the email as HTML string for sending via Resend

export async function renderBookBorrowedEmail(params: {
  fullName: string;
  bookTitle: string;
  borrowDate: string | Promise<string>;
  dueDate: string | Promise<string>;
}): Promise<string> {
  return render(
    <BookBorrowedEmail
      fullName={params.fullName}
      bookTitle={params.bookTitle}
      borrowDate={await params.borrowDate}
      dueDate={await params.dueDate}
    />,
  );
}
