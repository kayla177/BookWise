// components/emails/WelcomeEmail.tsx
import * as React from "react";
import { Text, Button, Link } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface WelcomeEmailProps {
  fullName: string;
}

export const WelcomeEmail = ({ fullName }: WelcomeEmailProps) => {
  return (
    <EmailLayout
      title="Welcome to BookWise, Your Reading Companion!"
      previewText="Welcome to BookWise - Your university library awaits"
    >
      <Text className="text-light-100 mb-4">Hi {fullName},</Text>

      <Text className="text-light-100 mb-4">
        Welcome to BookWise! We're excited to have you join our community of
        book enthusiasts. Explore a wide range of books, borrow with ease, and
        manage your reading journey seamlessly.
      </Text>

      <Text className="text-light-100 mb-6">
        Get started by logging in to your account:
      </Text>

      <Button
        href="https://bookwise.yourdomain.com/login"
        className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
      >
        Login to BookWise
      </Button>
    </EmailLayout>
  );
};

export default WelcomeEmail;

// Function to render the email as HTML string for sending via Resend
export function renderWelcomeEmail(fullName: string): string {
  // Import the render function directly in this function to prevent server-side issues
  const { render } = require("@react-email/render");
  return render(<WelcomeEmail fullName={fullName} />);
}
