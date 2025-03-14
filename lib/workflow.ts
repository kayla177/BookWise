import { Client as WorkflowClient } from "@upstash/workflow";
import config from "@/lib/config";
import { Client as QStashClient, resend } from "@upstash/qstash";

export const workflowClient = new WorkflowClient({
  baseUrl: config.env.upstash.qstashUrl,
  token: config.env.upstash.qstashToken,
});

const qstashClient = new QStashClient({
  token: config.env.upstash.qstashToken,
});

// accept HTML content
export const sendEmail = async ({
  email,
  subject,
  html,
}: {
  email: string;
  subject: string;
  html: string;
}) => {
  try {
    console.log(
      `Attempting to send email to ${email} with subject: ${subject}`,
    );
    console.log(
      `Using QStash token: ${config.env.upstash.qstashToken ? "Token exists" : "Token missing!"}`,
    );
    console.log(
      `Using Resend token: ${config.env.resendToken ? "Token exists" : "Token missing!"}`,
    );

    const response = await qstashClient.publishJSON({
      api: {
        name: "email",
        provider: resend({ token: config.env.resendToken }),
      },
      body: {
        from: "Kayla <contact@kayla-li.com>",
        to: [email],
        subject: subject,
        html: html,
      },
    });

    console.log("QStash publish response:", response);
    console.log(`Email successfully queued to ${email}`);
    return { success: true, response };
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
    return { success: false, error: String(error) };
  }
};
