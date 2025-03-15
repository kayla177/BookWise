import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import { render } from "@react-email/render";

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
      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        Keep the pages turning,
        <br />
        The BookWise Team
      </Text>
    </EmailLayout>
  );
};

export default ReceiptEmail;

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
