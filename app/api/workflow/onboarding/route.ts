// import { serve } from "@upstash/workflow/nextjs";
// import { db } from "@/database/drizzle";
// import { eq } from "drizzle-orm";
// import { users } from "@/database/schema";
// import { sendEmail } from "@/lib/workflow";
//
// // from https://upstash.com/docs/workflow/examples/customerOnboarding
//
// type UserState = "non-active" | "active";
//
// type InitialData = {
//   email: string;
//   fullName: string;
// };
//
// const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
// const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
// const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;
//
// // return the type "UserState"
// const getUserState = async (email: string): Promise<UserState> => {
//   //   step 1 : get a single user
//   const user = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);
//
//   if (user.length === 0) {
//     return "non-active";
//   }
//
//   //  step 2: get the time difference that the user login
//   // add the "!" to let typeScript know it will be there, avoid error
//   const lastActivityDate = new Date(user[0].lastActivityDate!);
//   const now = new Date();
//   const timeDifference = now.getTime() - lastActivityDate.getTime();
//
//   // step 3: write conditional logic to get the user state
//   if (
//     timeDifference > THREE_DAYS_IN_MS &&
//     timeDifference <= THIRTY_DAYS_IN_MS
//   ) {
//     return "non-active";
//   }
//
//   return "active";
// };
//
// export const { POST } = serve<InitialData>(async (context) => {
//   const { email, fullName } = context.requestPayload;
//
//   console.log(`[WORKFLOW] New signup for: ${email}`);
//
//   // 1. send an welcome email to new sign-up user
//   await context.run("new-signup", async () => {
//     console.log(`[WORKFLOW] Sending welcome email to ${email}`);
//
//     await sendEmail({
//       email,
//       subject: "Welcome to the University Library",
//       html: renderWelcomeEmail(fullName),
//     });
//   });
//
//   // 2. To leave time for the user to interact with our platform,
//   //    we use context.sleep to pause our workflow for 3 days
//   console.log(`[WORKFLOW] Sleeping for 3 days before engagement check`);
//
//   await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);
//
//   //  3. infinite loop to periodically (every month) check
//   //     the user’s engagement level with our platform and send appropriate emails:
//   while (true) {
//     const state = await context.run("check-user-state", async () => {
//       return await getUserState(email);
//     });
//
//     if (state === "non-active") {
//       await context.run("send-email-non-active", async () => {
//         await sendEmail({
//           email,
//           subject: "Are you still there?",
//           message: `Hey ${fullName}, we miss you! 🥰🥰`,
//         });
//       });
//     } else if (state === "active") {
//       await context.run("send-email-active", async () => {
//         await sendEmail({
//           email,
//           subject: "Welcome back!",
//           message: `Welcome back ${fullName}, good to see you! 🥳🥳`,
//         });
//       });
//     }
//
//     // go back to sleep after send a checkin email to user
//     await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
//   }
// });
//

import { serve } from "@upstash/workflow/nextjs";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/database/schema";
import { sendEmail } from "@/lib/workflow";
import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";
import { renderAccountApprovalEmail } from "@/components/emails/AccountApprovalEmail";
import { renderCheckInReminderEmail } from "@/components/emails/CheckInReminderEmail";

type UserState = "non-active" | "active";

type InitialData = {
  email: string;
  fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAYS_IN_MS = 30 * ONE_DAY_IN_MS;

const getUserState = async (email: string): Promise<UserState> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user.length === 0) {
    return "non-active";
  }

  const lastActivityDate = new Date(user[0].lastActivityDate!);
  const now = new Date();
  const timeDifference = now.getTime() - lastActivityDate.getTime();

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
      subject: "Welcome to BookWise Library",
      html: renderWelcomeEmail(fullName),
    });
  });

  // 2. To leave time for the user to interact with our platform,
  //    we use context.sleep to pause our workflow for 3 days
  console.log(`[WORKFLOW] Sleeping for 3 days before engagement check`);

  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  //  3. infinite loop to periodically (every month) check
  //     the user's engagement level with our platform and send appropriate emails:
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState(email);
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail({
          email,
          subject: "We miss you at BookWise!",
          html: renderReminderEmail(fullName),
        });
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail({
          email,
          subject: "Welcome back to BookWise!",
          html: renderWelcomeBackEmail(fullName),
        });
      });
    }

    // go back to sleep after send a checkin email to user
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});
