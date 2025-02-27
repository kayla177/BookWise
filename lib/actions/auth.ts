"use server";
// database call or database mutations must be secure

import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

// since we only need to signIn not signUp, only need "email"  "password" type from AuthCredentials
// use Pick to pick only some of the type that will apply
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  // get the current ip address(rate limit)
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // this success will let us know if we can go to that page successfully
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  try {
    // means that we want to use the "credentials" method to signIn
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // if there is error
    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (e) {
    console.log(e, "SignIn error");
    return { success: false, error: "SignIn error" };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityCard, universityId } = params;

  // get the current ip address(rate limit)
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // this success will let us know if we can go to that page successfully
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return redirect("/too-fast");
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  // "salt": complexity upon which it'll be hashed
  const hashedPassword = await hash(password, 10);

  try {
    // how you create user
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    // trigger the workflow immediately after we create the user
    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/onboarding`,
      body: {
        email,
        fullName,
      },
    });

    //!!! automatically signIn for new user
    return await signInWithCredentials({ email, password });
  } catch (e) {
    console.log(e, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
