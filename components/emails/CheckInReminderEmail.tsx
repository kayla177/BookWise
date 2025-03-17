import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";
import { render } from "@react-email/render";

interface CheckInReminderEmailProps {
  fullName: string;
}

export const CheckInReminderEmail = ({
  fullName,
}: CheckInReminderEmailProps) => {
  return (
    <EmailLayout
      title="Don't Forget to Check In at BookWise"
      previewText="Stay up-to-date with your borrowed books and due dates"
    >
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        We noticed you haven't checked in recently. Stay active and keep track
        of your borrowed books, due dates, and new arrivals.
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        Log in now to stay on top of your reading:
      </Text>

      <Button
        href="https://book.kayla-li.com/sign-in"
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
        Keep the pages turning,
        <br />
        The BookWise Team
      </Text>
    </EmailLayout>
  );
};

export default CheckInReminderEmail;

// Function to render the email as HTML string for sending via Resend

export async function renderCheckInReminderEmail(
  fullName: string,
): Promise<string> {
  return render(<CheckInReminderEmail fullName={fullName} />);
}
