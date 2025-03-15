import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface WelcomeBackEmailProps {
  fullName: string;
}

export const WelcomeBackEmail = ({ fullName }: WelcomeBackEmailProps) => {
  return (
    <EmailLayout
      title="Welcome Back!"
      previewText="Great to see you back at BookWise Library!"
    >
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Welcome back! Good to see you! 🥳🥳
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        We're glad to see you're using our library services again. Check out our
        new arrivals section for the latest books!
      </Text>

      <Button
        href="https://bookwise.yourdomain.com/library/new-arrivals"
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
        Explore New Arrivals
      </Button>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        Happy to have you back!
      </Text>
    </EmailLayout>
  );
};

export default WelcomeBackEmail;

// Function to render the email as an HTML string for Resend
import { render } from "@react-email/render";

export async function renderWelcomeBackEmail(
  fullName: string,
): Promise<string> {
  return render(<WelcomeBackEmail fullName={fullName} />);
}
