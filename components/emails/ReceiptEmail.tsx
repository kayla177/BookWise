// // components/emails/ReceiptEmail.tsx
// import * as React from "react";
// import { Text, Button, Link } from "@react-email/components";
// import EmailLayout from "./EmailLayout";
//
// interface ReceiptEmailProps {
//   fullName: string;
//   bookTitle: string;
//   borrowDate: string;
//   dueDate: string;
//   receiptUrl: string;
// }
//
// export const ReceiptEmail = ({
//   fullName,
//   bookTitle,
//   borrowDate,
//   dueDate,
//   receiptUrl,
// }: ReceiptEmailProps) => {
//   return (
//     <EmailLayout
//       title={`Your Receipt for ${bookTitle} is Ready!`}
//       previewText={`Your borrowing receipt for ${bookTitle} is available for download`}
//     >
//       <Text className="text-light-100 mb-4">Hi {fullName},</Text>
//
//       <Text className="text-light-100 mb-4">
//         Your receipt for borrowing <strong>{bookTitle}</strong> has been
//         generated. Here are the details:
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
//         You can download the receipt here:
//       </Text>
//
//       <Button
//         href={receiptUrl}
//         className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
//       >
//         Download Receipt
//       </Button>
//
//       <Text className="text-light-100 mt-6">Keep the pages turning,</Text>
//     </EmailLayout>
//   );
// };
//
// export default ReceiptEmail;
//
// // Function to render the email as HTML string for sending via Resend
// export function renderReceiptEmail(params: {
//   fullName: string;
//   bookTitle: string;
//   borrowDate: string;
//   dueDate: string;
//   receiptUrl: string;
// }): string {
//   const { render } = require("@react-email/render");
//
//   return render(
//     <ReceiptEmail
//       fullName={params.fullName}
//       bookTitle={params.bookTitle}
//       borrowDate={params.borrowDate}
//       dueDate={params.dueDate}
//       receiptUrl={params.receiptUrl}
//     />,
//   );
// }
import * as React from "react";
import { Text, Button } from "@react-email/components";
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
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Your receipt for borrowing <strong>{bookTitle}</strong> has been
        generated. Here are the details:
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
        href={receiptUrl}
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
        Download Receipt
      </Button>
    </EmailLayout>
  );
};

export default ReceiptEmail;

// ✅ **Fixed `renderReceiptEmail` Function**
import { render } from "@react-email/render";

export async function renderReceiptEmail(params: {
  fullName: string;
  bookTitle: string;
  borrowDate: string | Promise<string>;
  dueDate: string | Promise<string>;
  receiptUrl: string | Promise<string>;
}): Promise<string> {
  return render(
    <ReceiptEmail
      fullName={params.fullName}
      bookTitle={params.bookTitle}
      borrowDate={await params.borrowDate}
      dueDate={await params.dueDate}
      receiptUrl={await params.receiptUrl}
    />,
  );
}
