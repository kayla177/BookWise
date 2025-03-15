import * as React from "react";
import { Text, Button } from "@react-email/components";
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
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Welcome to BookWise! We're excited to have you join our community of
        book enthusiasts. Explore a wide range of books, borrow with ease, and
        manage your reading journey seamlessly.
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        Get started by logging in to your account:
      </Text>

      <Button
        href="https://bookwise.yourdomain.com/login"
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
        Login to BookWise
      </Button>
    </EmailLayout>
  );
};

export default WelcomeEmail;

import { render } from "@react-email/render";

export async function renderWelcomeEmail(fullName: string): Promise<string> {
  return render(<WelcomeEmail fullName={fullName} />);
}
