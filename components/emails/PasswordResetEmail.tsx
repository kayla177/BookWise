import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import { render } from "@react-email/render";

interface PasswordResetEmailProps {
  fullName: string;
  resetLink: string;
}

export const PasswordResetEmail = ({
  fullName,
  resetLink,
}: PasswordResetEmailProps) => {
  return (
    <EmailLayout
      title="Reset Your BookWise Password"
      previewText="Follow the link to reset your BookWise password"
    >
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        We received a request to reset your password for your BookWise account.
        To proceed with resetting your password, click the button below:
      </Text>

      <Button
        href={resetLink}
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
        Reset Your Password
      </Button>

      <Text
        style={{ color: "#f8fafc", marginTop: "16px", marginBottom: "16px" }}
      >
        This link will expire in 24 hours. If you didn't request a password
        reset, you can safely ignore this email.
      </Text>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        Best regards,
        <br />
        The BookWise Team
      </Text>
    </EmailLayout>
  );
};

export default PasswordResetEmail;

export async function renderPasswordResetEmail(
  fullName: string,
  resetLink: string,
): Promise<string> {
  return render(
    <PasswordResetEmail fullName={fullName} resetLink={resetLink} />,
  );
}
