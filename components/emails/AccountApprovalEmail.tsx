import * as React from "react";
import { Text, Button } from "@react-email/components";
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
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Congratulations! Your BookWise account has been approved. You can now
        browse our library, borrow books, and enjoy all the features of your new
        account.
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        Log in to get started:
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
        Log in to BookWise
      </Button>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        Welcome aboard,
      </Text>
    </EmailLayout>
  );
};

export default AccountApprovalEmail;

import { render } from "@react-email/render";

export async function renderAccountApprovalEmail(
  fullName: string,
): Promise<string> {
  return render(<AccountApprovalEmail fullName={fullName} />);
}
