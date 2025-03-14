// import React from "react";
// import EmailLayout from "./EmailLayout";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
//
// interface BorrowConfirmationEmailProps {
//   userName: string;
//   bookTitle: string;
//   borrowDate: string;
//   dueDate: string;
// }
//
// const BorrowConfirmationEmail = ({
//   userName,
//   bookTitle,
//   borrowDate,
//   dueDate,
// }: BorrowConfirmationEmailProps) => {
//   return (
//     <EmailLayout title="You've Borrowed a Book!">
//       <p>Hi {userName},</p>
//       <p>
//         You've successfully borrowed <strong>{bookTitle}</strong>. Here are the
//         details:
//       </p>
//       <ul>
//         <li>Borrowed On: {borrowDate}</li>
//         <li>
//           Due Date: <strong>{dueDate}</strong>
//         </li>
//       </ul>
//
//       <Link href="/my-profile">
//         <Button>View Borrowed Books</Button>
//       </Link>
//     </EmailLayout>
//   );
// };
//
// export default BorrowConfirmationEmail;

import React from "react";

interface BorrowConfirmationEmailProps {
  userName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
}

const BorrowConfirmationEmail = ({
  userName,
  bookTitle,
  borrowDate,
  dueDate,
}: BorrowConfirmationEmailProps) => (
  <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
    <h1>📚 You’ve Borrowed a Book!</h1>
    <p>Hi {userName},</p>
    <p>
      You have successfully borrowed <strong>{bookTitle}</strong>.
    </p>
    <ul>
      <li>
        <strong>Borrowed On:</strong> {borrowDate}
      </li>
      <li>
        <strong>Due Date:</strong> {dueDate}
      </li>
    </ul>
    <p>Enjoy your reading, and don’t forget to return the book on time!</p>
    <a
      href="https://bookwise.com/my-borrowed-books"
      style={{
        display: "inline-block",
        padding: "10px 15px",
        backgroundColor: "#FFC107",
        color: "#000",
        textDecoration: "none",
        borderRadius: "5px",
        fontWeight: "bold",
      }}
    >
      View Borrowed Books
    </a>
    <p>
      Happy reading,
      <br />
      The BookWise Team
    </p>
  </div>
);

export default BorrowConfirmationEmail;
