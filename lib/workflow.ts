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
// export const sendEmail = async ({
//   email,
//   subject,
//   message,
// }: {
//   email: string;
//   subject: string;
//   message: string;
// }) => {
//   await qstashClient.publishJSON({
//     api: {
//       name: "email",
//       provider: resend({ token: config.env.resendToken }),
//     },
//     body: {
//       from: "Kayla <contact@kayla-li.com>",
//       to: [email],
//       subject: subject,
//       html: message,
//     },
//   });
// };

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
  await qstashClient.publishJSON({
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
};
