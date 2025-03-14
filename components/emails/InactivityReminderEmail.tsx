// components/emails/ReminderEmail.tsx
import * as React from "react";
import { Text, Button, Link } from "@react-email/components";
import EmailLayout from "./EmailLayout";

interface ReminderEmailProps {
  fullName: string;
}

export const ReminderEmail = ({ fullName }: ReminderEmailProps) => {
  return (
    <EmailLayout
      title="We Miss You at BookWise!"
      previewText="It's been a while since we saw you - come check out our new books!"
    >
      <Text className="text-light-100 mb-4">Hi {fullName},</Text>

      <Text className="text-light-100 mb-4">
        It's been a while since we last saw you—over three days, to be exact!
        New books are waiting for you, and your next great read might just be a
        click away.
      </Text>

      <Text className="text-light-100 mb-6">Come back and explore now:</Text>

      <Button
        href="https://bookwise.yourdomain.com/library"
        className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
      >
        Explore Books on BookWise
      </Button>

      <Text className="text-light-100 mt-6">See you soon,</Text>
    </EmailLayout>
  );
};

export default ReminderEmail;

// Function to render the email as HTML string for sending via Resend
export function renderReminderEmail(fullName: string): string {
  const { render } = require("@react-email/render");
  return render(<ReminderEmail fullName={fullName} />);
}
