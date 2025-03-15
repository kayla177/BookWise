// // components/emails/BookBorrowedEmail.tsx
// import * as React from "react";
// import { Text, Button, Link } from "@react-email/components";
// import EmailLayout from "./EmailLayout";
//
// interface BookBorrowedEmailProps {
//   fullName: string;
//   bookTitle: string;
//   borrowDate: string;
//   dueDate: string;
// }
//
// export const BookBorrowedEmail = ({
//   fullName,
//   bookTitle,
//   borrowDate,
//   dueDate,
// }: BookBorrowedEmailProps) => {
//   return (
//     <EmailLayout
//       title="You've Borrowed a Book!"
//       previewText={`You've successfully borrowed ${bookTitle}`}
//     >
//       <Text className="text-light-100 mb-4">Hi {fullName},</Text>
//
//       <Text className="text-light-100 mb-4">
//         You've successfully borrowed <strong>{bookTitle}</strong>. Here are the
//         details:
//       </Text>
//
//       <ul className="text-light-100 mb-6 list-disc pl-5">
//         <li className="mb-2">
//           Borrowed On: <strong>{borrowDate}</strong>
//         </li>
//         <li>
//           Due Date: <strong>{dueDate}</strong>
//         </li>
//       </ul>
//
//       <Text className="text-light-100 mb-6">
//         Enjoy your reading, and don't forget to return the book on time!
//       </Text>
//
//       <Button
//         href="https://bookwise.yourdomain.com/my-profile"
//         className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
//       >
//         View Borrowed Books
//       </Button>
//     </EmailLayout>
//   );
// };
//
// export default BookBorrowedEmail;
//
// // Function to render the email as HTML string for sending via Resend
// export function renderBookBorrowedEmail(params: {
//   fullName: string;
//   bookTitle: string;
//   borrowDate?: string;
//   dueDate: string;
// }): string {
//   const { render } = require("@react-email/render");
//   // Use current date if borrowDate is not provided
//   const borrowDate = params.borrowDate || new Date().toLocaleDateString();
//
//   return render(
//     <BookBorrowedEmail
//       fullName={params.fullName}
//       bookTitle={params.bookTitle}
//       borrowDate={borrowDate}
//       dueDate={params.dueDate}
//     />,
//   );
// }

import * as React from "react";
import { Text, Button } from "@react-email/components";
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
        href="https://bookwise.yourdomain.com/my-profile"
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
    </EmailLayout>
  );
};

export default BookBorrowedEmail;

// Function to render the email as HTML string for sending via Resend
import { render } from "@react-email/render";
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
