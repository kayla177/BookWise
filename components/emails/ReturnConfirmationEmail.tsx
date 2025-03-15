import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import { render } from "@react-email/render";

interface ReturnConfirmationEmailProps {
  fullName: string;
  bookTitle: string;
}

export const ReturnConfirmationEmail = ({
  fullName,
  bookTitle,
}: ReturnConfirmationEmailProps) => {
  return (
    <EmailLayout
      title={`Thank You for Returning ${bookTitle}!`}
      previewText={`Your return of ${bookTitle} has been confirmed`}
    >
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        We've successfully received your return of <strong>{bookTitle}</strong>.
        Thank you for returning it on time.
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        Looking for your next read? Browse our collection and borrow your next
        favorite book!
      </Text>

      <Button
        href="https://book-store-rho-woad.vercel.app"
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
        Explore New Books
      </Button>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        Happy exploring,
        <br />
        The BookWise Team
      </Text>
    </EmailLayout>
  );
};

export default ReturnConfirmationEmail;

// Function to render the email as HTML string for sending via Resend

export async function renderReturnConfirmationEmail(params: {
  fullName: string;
  bookTitle: string;
}): Promise<string> {
  return render(
    <ReturnConfirmationEmail
      fullName={params.fullName}
      bookTitle={params.bookTitle}
    />,
  );
}
