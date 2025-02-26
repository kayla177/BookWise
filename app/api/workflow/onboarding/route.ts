import { serve } from "@upstash/workflow/nextjs";

// from https://upstash.com/docs/workflow/examples/customerOnboarding

type InitialData = {
  email: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload;

  // 1. send an email to new sign-iup user
  await context.run("new-signup", async () => {
    await sendEmail("Welcome to the platform", email);
  });

  // 2. To leave time for the user to interact with our platform,
  //    we use context.sleep to pause our workflow for 3 days
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  //  3. infinite loop to periodically (every month) check
  //     the user’s engagement level with our platform and send appropriate emails:
  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState();
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail("Email to non-active users", email);
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail("Send newsletter to active users", email);
      });
    }

    // go back to sleep after send a checkin email to user
    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

async function sendEmail(message: string, email: string) {
  // Implement email sending logic here
  console.log(`Sending ${message} email to ${email}`);
}

type UserState = "non-active" | "active";

const getUserState = async (): Promise<UserState> => {
  // Implement user state logic here
  return "non-active";
};
