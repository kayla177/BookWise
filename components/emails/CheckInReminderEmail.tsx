// // components/emails/CheckInReminderEmail.tsx
// import * as React from "react";
// import { Text, Button, Link } from "@react-email/components";
// import EmailLayout from "./EmailLayout";
//
// interface CheckInReminderEmailProps {
//   fullName: string;
// }
//
// export const CheckInReminderEmail = ({
//   fullName,
// }: CheckInReminderEmailProps) => {
//   return (
//     <EmailLayout
//       title="Don't Forget to Check In at BookWise"
//       previewText="Stay up-to-date with your borrowed books and due dates"
//     >
//       <Text className="text-light-100 mb-4">Hi {fullName},</Text>
//
//       <Text className="text-light-100 mb-4">
//         We noticed you haven't checked in recently. Stay active and keep track
//         of your borrowed books, due dates, and new arrivals.
//       </Text>
//
//       <Text className="text-light-100 mb-6">
//         Log in now to stay on top of your reading:
//       </Text>
//
//       <Button
//         href="https://bookwise.yourdomain.com/login"
//         className="bg-primary text-dark-100 px-6 py-3 rounded-md font-semibold text-center"
//       >
//         Log in to BookWise
//       </Button>
//
//       <Text className="text-light-100 mt-6">Keep the pages turning,</Text>
//     </EmailLayout>
//   );
// };
//
// export default CheckInReminderEmail;
//
// // Function to render the email as HTML string for sending via Resend
// export function renderCheckInReminderEmail(fullName: string): string {
//   const { render } = require("@react-email/render");
//   return render(<CheckInReminderEmail fullName={fullName} />);
// }

import * as React from "react";
import { Text, Button } from "@react-email/components";
import EmailLayout from "./EmailLayout";

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
    </EmailLayout>
  );
};

export default CheckInReminderEmail;

// Function to render the email as HTML string for sending via Resend
import { render } from "@react-email/render";

export async function renderCheckInReminderEmail(
  fullName: string,
): Promise<string> {
  return render(<CheckInReminderEmail fullName={fullName} />);
}
