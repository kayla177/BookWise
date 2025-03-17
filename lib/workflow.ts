// import { Client as WorkflowClient } from "@upstash/workflow";
// import config from "@/lib/config";
// import { Client as QStashClient, resend } from "@upstash/qstash";
//
// export const workflowClient = new WorkflowClient({
//   baseUrl: config.env.upstash.qstashUrl,
//   token: config.env.upstash.qstashToken,
// });
//
// const qstashClient = new QStashClient({
//   token: config.env.upstash.qstashToken,
// });
//
// // accept HTML content
// export const sendEmail = async ({
//   email,
//   subject,
//   html,
// }: {
//   email: string;
//   subject: string;
//   html: string;
// }) => {
//   try {
//     console.log(
//       `Attempting to send email to ${email} with subject: ${subject}`,
//     );
//     console.log(
//       `Using QStash token: ${config.env.upstash.qstashToken ? "Token exists" : "Token missing!"}`,
//     );
//     console.log(
//       `Using Resend token: ${config.env.resendToken ? "Token exists" : "Token missing!"}`,
//     );
//
//     const response = await qstashClient.publishJSON({
//       api: {
//         name: "email",
//         provider: resend({ token: config.env.resendToken }),
//       },
//       body: {
//         from: "Kayla <contact@kayla-li.com>",
//         to: [email],
//         subject: subject,
//         html: html,
//       },
//     });
//
//     console.log("QStash publish response:", response);
//     console.log(`Email successfully queued to ${email}`);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`Failed to send email to ${email}:`, error);
//     return { success: false, error: String(error) };
//   }
// };
//
// import { Client as WorkflowClient } from "@upstash/workflow";
// import { Client as QStashClient, resend } from "@upstash/qstash";
// import config from "@/lib/config";
//
// export const workflowClient = new WorkflowClient({
//   baseUrl: config.env.upstash.qstashUrl,
//   token: config.env.upstash.qstashToken,
// });
//
// const qstashClient = new QStashClient({
//   token: config.env.upstash.qstashToken,
// });
//
// export const sendEmail = async ({
//   email,
//   subject,
//   renderEmail,
// }: {
//   email: string;
//   subject: string;
//   renderEmail: () => string;
// }) => {
//   try {
//     console.log(
//       `🟡 Attempting to send email to ${email} with subject: ${subject}`,
//     );
//
//     const html = await renderEmail(); // Ensure resolution
//     console.log(`🟡 Debug: typeof html =`, typeof html, "| Value:", html);
//
//     const response = await qstashClient.publishJSON({
//       api: {
//         name: "email",
//         provider: resend({ token: config.env.resendToken }),
//       },
//       body: {
//         from: "Kayla <contact@kayla-li.com>",
//         to: [email],
//         subject: subject,
//         html: html,
//       },
//     });
//
//     console.log(`🟢 QStash Response:`, response);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`🔴 Failed to send email to ${email}:`, error);
//     return { success: false, error: String(error) };
//   }
// };

import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import { Resend } from "resend"; // Import Resend SDK
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

const resend = new Resend(config.env.resendToken); // Initialize Resend

export const sendEmail = async ({
  email,
  subject,
  renderEmail,
}: {
  email: string;
  subject: string;
  renderEmail: () => Promise<string>; // Ensure this is async
}) => {
  try {
    console.log(`🟡 Sending email to: ${email}, Subject: ${subject}`);

    const html = await renderEmail(); // Ensure email is correctly rendered
    console.log(`🟡 Rendered Email Preview:`, html.substring(0, 200));

    const response = await resend.emails.send({
      from: "BookWise <contact@kayla-li.com>",
      to: [email],
      subject,
      html,
    });

    console.log(`🟢 Email sent successfully!`, response);
    return { success: true, response };
  } catch (error) {
    console.error(`🔴 Failed to send email:`, error);
    return { success: false, error: String(error) };
  }
};
