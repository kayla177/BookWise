import React from "react";
import EmailLayout from "./EmailLayout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DueReminderEmailProps {
  userName: string;
  bookTitle: string;
  dueDate: string;
}

const DueReminderEmail = ({
  userName,
  bookTitle,
  dueDate,
}: DueReminderEmailProps) => {
  return (
    <EmailLayout title={`Reminder: ${bookTitle} is Due Soon!`}>
      <p>Hi {userName},</p>
      <p>
        Just a reminder that <strong>{bookTitle}</strong> is due for return on{" "}
        <strong>{dueDate}</strong>. Kindly return it on time to avoid late fees.
      </p>

      <Link href="/my-profile">
        <Button>Renew Book Now</Button>
      </Link>
    </EmailLayout>
  );
};

export default DueReminderEmail;
