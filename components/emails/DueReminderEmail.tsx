import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface DueReminderEmailProps {
  fullName: string;
  bookTitle: string;
  dueDate: string;
}

export const DueReminderEmail = ({
  fullName,
  bookTitle,
  dueDate,
}: DueReminderEmailProps) => {
  return (
    <EmailLayout
      title={`Reminder: ${bookTitle} is Due Soon!`}
      previewText={`Your borrowed book ${bookTitle} is due on ${dueDate}`}
    >
      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Hi {fullName},
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "16px" }}>
        Just a reminder that <strong>{bookTitle}</strong> is due for return on{" "}
        <strong>{dueDate}</strong>. Kindly return it on time to avoid late fees.
      </Text>

      <Text style={{ color: "#f8fafc", marginBottom: "24px" }}>
        If you're still reading, you can renew the book in your account.
      </Text>

      <Button
        href="https://bookwise.yourdomain.com/my-profile"
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
        Renew Book Now
      </Button>

      <Text style={{ color: "#f8fafc", marginTop: "16px" }}>Keep reading,</Text>
    </EmailLayout>
  );
};

export default DueReminderEmail;

import { render } from "@react-email/render";

export async function renderDueReminderEmail(params: {
  fullName: string;
  bookTitle: string;
  dueDate: string;
}): Promise<string> {
  return render(
    <DueReminderEmail
      fullName={params.fullName}
      bookTitle={params.bookTitle}
      dueDate={params.dueDate}
    />,
  );
}
