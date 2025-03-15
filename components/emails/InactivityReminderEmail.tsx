import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import { render } from "@react-email/render";

interface InactivityReminderEmailProps {
  fullName: string;
}

export const InactivityReminderEmail = ({
  fullName,
}: InactivityReminderEmailProps) => {
  return (
    <EmailLayout
      title="We Miss You at BookWise!"
      previewText="It's been a while since we saw you - come check out our new books!"
    >
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        It's been a while since we last saw you—over three days, to be exact!
        New books are waiting for you, and your next great read might just be a
        click away.
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        Come back and explore now:
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
        Explore Books on BookWise
      </Button>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>
        See you soon,
        <br />
        The BookWise Team
      </Text>
    </EmailLayout>
  );
};

export default InactivityReminderEmail;

export async function renderInactivityReminderEmail(
  fullName: string,
): Promise<string> {
  return render(<InactivityReminderEmail fullName={fullName} />);
}
