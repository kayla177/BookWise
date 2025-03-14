// components/emails/AccountApprovalEmail.tsx
import * as React from "react";
import { Text, Button, Link } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface AccountApprovalEmailProps {
  fullName: string;
}

export const AccountApprovalEmail = ({
  fullName,
}: AccountApprovalEmailProps) => {
  return (
    <EmailLayout
      title="Your BookWise Account Has Been Approved!"
      previewText="Good news! Your BookWise library account is now approved"
    >
      <Text className="text-light-100 mb-4">Hi {fullName},</Text>

      <Text className="text-light-100 mb-4">
        Congratulations! Your BookWise account has been approved. You can now
        browse our library, borrow books, and enjoy all the features of your new
        account.
      </Text>

      <Text className="text-light-100 mb-6">Log in to get started:</Text>

      <Button
        href="https://bookwise.yourdomain.com/login"
        className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
      >
        Log in to BookWise
      </Button>

      <Text className="text-light-100 mt-6">Welcome aboard,</Text>
    </EmailLayout>
  );
};

export default AccountApprovalEmail;

// Function to render the email as HTML string for sending via Resend
export function renderAccountApprovalEmail(fullName: string): string {
  // Import the render function directly in this function to prevent server-side issues
  const { render } = require("@react-email/render");
  return render(<AccountApprovalEmail fullName={fullName} />);
}
