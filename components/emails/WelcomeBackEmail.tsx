// components/emails/WelcomeBackEmail.tsx
import * as React from "react";
import { Text, Button, Link } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface WelcomeBackEmailProps {
  fullName: string;
}

export const WelcomeBackEmail = ({ fullName }: WelcomeBackEmailProps) => {
  return (
    <EmailLayout
      title="Welcome back!"
      previewText="Great to see you back at BookWise Library"
    >
      <Text className="text-light-100 mb-4">Hi {fullName},</Text>

      <Text className="text-light-100 mb-4">
        Welcome back! Good to see you! 🥳🥳
      </Text>

      <Text className="text-light-100 mb-4">
        We're glad to see you're using our library services again. Check out our
        new arrivals section for the latest books!
      </Text>

      <Button
        href="https://bookwise.yourdomain.com/library/new-arrivals"
        className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
      >
        Explore New Arrivals
      </Button>

      <Text className="text-light-100 mt-6">Happy to have you back!</Text>
    </EmailLayout>
  );
};

export default WelcomeBackEmail;

// Function to render the email as HTML string for sending via Resend
export function renderWelcomeBackEmail(fullName: string): string {
  const { render } = require("@react-email/render");
  return render(<WelcomeBackEmail fullName={fullName} />);
}
