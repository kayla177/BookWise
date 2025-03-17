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
//
// import { Client as WorkflowClient } from "@upstash/workflow";
// import { Client as QStashClient } from "@upstash/qstash";
// import { Resend } from "resend"; // Import Resend SDK
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
// const resend = new Resend(config.env.resendToken); // Initialize Resend
//
// export const sendEmail = async ({
//   email,
//   subject,
//   renderEmail,
// }: {
//   email: string;
//   subject: string;
//   renderEmail: () => Promise<string>; // Ensure this is async
// }) => {
//   try {
//     console.log(`🟡 Sending email to: ${email}, Subject: ${subject}`);
//
//     const html = await renderEmail(); // Ensure email is correctly rendered
//     console.log(`🟡 Rendered Email Preview:`, html.substring(0, 200));
//
//     const response = await resend.emails.send({
//       from: "BookWise <contact@kayla-li.com>",
//       to: [email],
//       subject,
//       html,
//     });
//
//     console.log(`🟢 Email sent successfully!`, response);
//     return { success: true, response };
//   } catch (error) {
//     console.error(`🔴 Failed to send email:`, error);
//     return { success: false, error: String(error) };
//   }
// };

import { Client as WorkflowClient } from "@upstash/workflow";
import { Client as QStashClient } from "@upstash/qstash";
import { Resend } from "resend";
import config from "@/lib/config";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

// Create a fresh Resend client every time
const getResend = () => {
  const token = config.env.resendToken;
  console.log(
    `Creating Resend client with key: ${token.substring(0, 5)}...${token.substring(token.length - 3)}`,
  );
  return new Resend(token);
};

export const sendEmail = async ({
  email,
  subject,
  renderEmail,
}: {
  email: string;
  subject: string;
  renderEmail: () => Promise<string>;
}) => {
  console.log(`========== BEGIN EMAIL SEND: ${subject} ==========`);
  console.log(`📧 Recipient: ${email}`);

  try {
    // Step 1: Create a fresh Resend client
    const resend = getResend();

    // Step 2: Render the email HTML
    console.log(`Rendering email content...`);
    let html;
    try {
      html = await renderEmail();
      console.log(
        `✅ Email content rendered successfully (${html.length} bytes)`,
      );
      console.log(`Content preview: ${html.substring(0, 100)}...`);
    } catch (renderError) {
      console.error(`❌ Failed to render email content:`, renderError);
      return {
        success: false,
        error: `Email rendering failed: ${renderError instanceof Error ? renderError.message : String(renderError)}`,
      };
    }

    // Step 3: Send the email
    console.log(`Sending email via Resend...`);
    try {
      const result = await resend.emails.send({
        from: "Kayla <contact@kayla-li.com>",
        to: [email],
        subject,
        html,
      });

      if (result.error) {
        console.error(`❌ Resend API returned an error:`, result.error);
        return {
          success: false,
          error: `Resend API error: ${JSON.stringify(result.error)}`,
        };
      }

      console.log(`✅ Email sent successfully! ID: ${result.data?.id}`);
      console.log(`========== END EMAIL SEND: SUCCESS ==========`);

      return { success: true, data: result.data };
    } catch (sendError) {
      console.error(`❌ Exception while calling Resend API:`, sendError);
      console.log(`========== END EMAIL SEND: FAILED ==========`);

      return {
        success: false,
        error: `Exception during email send: ${sendError instanceof Error ? sendError.message : String(sendError)}`,
      };
    }
  } catch (error) {
    console.error(`❌ Unexpected error in sendEmail:`, error);
    console.log(`========== END EMAIL SEND: ERROR ==========`);

    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};
