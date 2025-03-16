import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";

// from https://upstash.com/docs/workflow/examples/customerOnboarding

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

// return the type "UserState"
const getUserState = async (email: string): Promise<UserState> => {
  //   step 1 : get a single user
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return "non-active";
  }

  //  step 2: get the time difference that the user login
  // add the "!" to let typeScript know it will be there, avoid error
  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

  // step 3: write conditional logic to get the user state
  if (
    timeDifference > THREE_DAYS_IN_MS &&
    timeDifference <= THIRTY_DAYS_IN_MS
  ) {
    return "non-active";
  }

  return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  console.log(`[WORKFLOW] New signup for: ${email}`);

  // 1. send an welcome email to new sign-up user
  await context.run("new-signup", async () => {
    console.log(`[WORKFLOW] Sending welcome email to ${email}`);

    await sendEmail({
      email,
      subject: "Welcome to the University Library",
      renderEmail: () => renderWelcomeEmail(fullName),
    });
  });

  // 2. To leave time for the user to interact with our platform,
  //    we use context.sleep to pause our workflow for 3 days
  console.log(`[WORKFLOW] Sleeping for 3 days before engagement check`);

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  //  3. infinite loop to periodically (every month) check
  //     the user’s engagement level with our platform and send appropriate emails:
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "Are you still there?",
          renderEmail: () => renderInactivityReminderEmail(fullName),
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back!",
          renderEmail: () => renderWelcomeBackEmail(fullName),
        });
      });
    }

    // go back to sleep after send a checkin email to user
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

// // no engagement version:
// import { serve } from "@upstash/workflow/nextjs";
// import { db } from "@/database/drizzle";
// import { eq } from "drizzle-orm";
// import { users } from "@/database/schema";
// import { sendEmail } from "@/lib/workflow";
// import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
// import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";
// import { renderCheckInReminderEmail } from "@/components/emails/CheckInReminderEmail";
//
// type UserState = "non-active" | "active";
//
// const getUserState = async (email: string): Promise<UserState> => {
//   const user = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);
//   if (user.length === 0) return "non-active";
//
//   return "active";
// };
//
// export const { POST } = serve<{ email: string; fullName: string }>(
//   async (context) => {
//     const { email, fullName } = context.requestPayload;
//     console.log(`[WORKFLOW] Onboarding started for: ${email}`);
//
//     await sendEmail({
//       email,
//       subject: "Welcome to BookWise!",
//       renderEmail: () => renderWelcomeEmail(fullName),
//     });
//
//     await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);
//
//     const state = await getUserState(email);
//
//     if (state === "non-active") {
//       await sendEmail({
//         email,
//         subject: "We miss you at BookWise!",
//         renderEmail: () => renderCheckInReminderEmail(fullName),
//       });
//     } else {
//       await sendEmail({
//         email,
//         subject: "Welcome back to BookWise!",
//         renderEmail: () => renderWelcomeBackEmail(fullName),
//       });
//     }
//   },
// );
//
// import { serve } from "@upstash/workflow/nextjs";
// import { db } from "@/database/drizzle";
// import { eq } from "drizzle-orm";
// import { users } from "@/database/schema";
// import { sendEmail, scheduleInactivityCheck } from "@/lib/workflow";
// import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
// import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";
// import { renderCheckInReminderEmail } from "@/components/emails/CheckInReminderEmail";
//
// type UserState = "non-active" | "active";
//
// const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
//
// const getUserState = async (email: string): Promise<UserState> => {
//   const user = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);
//
//   if (user.length === 0) return "non-active";
//
//   const lastActivityDate = new Date(user[0].lastActivityDate!);
//   const now = new Date();
//   const timeDifference = now.getTime() - lastActivityDate.getTime();
//
//   return timeDifference > THREE_DAYS_IN_MS ? "non-active" : "active";
// };
//
// export const { POST } = serve<{ email: string; fullName: string }>(
//   async (context) => {
//     const { email, fullName } = context.requestPayload;
//     console.log(`[WORKFLOW] Onboarding started for: ${email}`);
//
//     // **Step 1: Send Welcome Email**
//     await sendEmail({
//       email,
//       subject: "Welcome to BookWise!",
//       renderEmail: () => renderWelcomeEmail(fullName),
//     });
//
//     // **Step 2: Wait 3 Days Before Checking Engagement**
//     await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);
//
//     const state = await getUserState(email);
//
//     if (state === "non-active") {
//       console.log(`[WORKFLOW] ${email} is non-active. Sending reminder.`);
//
//       await sendEmail({
//         email,
//         subject: "We miss you at BookWise!",
//         renderEmail: () => renderCheckInReminderEmail(fullName),
//       });
//
//       // **Step 3: Schedule QStash to Check Again After 30 Days**
//       await scheduleInactivityCheck(email, fullName);
//     } else {
//       console.log(`[WORKFLOW] ${email} is active. Sending welcome back email.`);
//
//       await sendEmail({
//         email,
//         subject: "Welcome back to BookWise!",
//         renderEmail: () => renderWelcomeBackEmail(fullName),
//       });
//     }
//   },
// );
