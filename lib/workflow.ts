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
  renderEmail,
}: {
  email: string;
  subject: string;
  renderEmail: () => Promise<string>;
}): Promise<{ success: boolean; response?: any; error?: string }> => {
  try {
    console.log(
      `[WORKFLOW.ts] 📩 Sending email to: ${email}, Subject: ${subject}`,
    );

    console.log(
      `Using QStash token: ${config.env.upstash.qstashToken ? "Token exists" : "Token missing!"}`,
    );
    console.log(
      `Using Resend token: ${config.env.resendToken ? "Token exists" : "Token missing!"}`,
    );

    // Generate email content
    const html: string = await renderEmail();

    const response = await qstashClient.publishJSON({
      api: {
        name: "email",
        provider: resend({ token: config.env.resendToken, batch: true }),
      },
      body: {
        from: "BookWise <contact@kayla-li.com>",
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
