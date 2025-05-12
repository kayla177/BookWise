"use server";

import { randomBytes } from "crypto";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { signIn } from "@/auth";
import { users, passwordResetTokens } from "@/database/schema";
import { hash } from "bcryptjs";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";
import config from "@/lib/config";

import { sendEmail } from "@/lib/workflow";
import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
import { renderPasswordResetEmail } from "@/components/emails/PasswordResetEmail";

// Request password reset
export const requestPasswordReset = async (email: string) => {
  try {
    // Apply rate limiting
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return {
        success: false,
        error: "Too many requests. Please try again later.",
      };
    }

    // Check if user exists
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      // Don't reveal if user exists or not for security reasons
      return { success: true };
    }

    // Generate a token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Clean up any existing tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user[0].id));

    // Insert the new token
    await db.insert(passwordResetTokens).values({
      userId: user[0].id,
      token,
      expiresAt,
    });

    // Generate reset URL
    const resetUrl = `${config.env.prodApiEndpoint}/reset-password/${token}`;

    // Send the email
    await sendEmail({
      email: user[0].email,
      subject: "Reset Your BookWise Password",
      renderEmail: () => renderPasswordResetEmail(user[0].fullName, resetUrl),
    });

    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Failed to process reset request" };
  }
};

// Reset password with token
export const resetPassword = async ({
  token,
  password,
}: {
  token: string;
  password: string;
}) => {
  try {
    // Find the token
    const resetToken = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (resetToken.length === 0) {
      return { success: false, error: "Invalid or expired token" };
    }

    // Check if token is expired
    const now = new Date();
    if (resetToken[0].expiresAt < now) {
      // Clean up expired token
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.token, token));

      return { success: false, error: "Token has expired" };
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update user's password
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, resetToken[0].userId));

    // Delete the used token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));

    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
};

// Sign in with credentials
export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">,
) => {
  const { email, password } = params;

  // // get the current ip address(rate limit)
  // const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // // this success will let us know if we can go to that page successfully
  // const { success } = await ratelimit.limit(ip);
  //
  // if (!success) {
  //   return redirect("/too-fast");
  // }

  console.log("Starting signin with credentials:", { email });

  try {
    // means that we want to use the "credentials" method to signIn
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // if there is error
    if (result?.error) {
      console.error("Sign-in error:", result.error);
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (e) {
    console.error("SignIn error:", e);
    return { success: false, error: "Authentication error. Please try again." };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password, universityCard, universityId } = params;

  // get the current ip address(rate limit)
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  // this success will let us know if we can go to that page successfully
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

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
    await db.insert(users).values({
      fullName,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
      status: "ACTIVE",
      role: "USER",
    });

    // Send Welcome Email
    await sendEmail({
      email,
      subject: "Welcome to BookWise!",
      renderEmail: () => renderWelcomeEmail(fullName),
    });

    //!!! automatically signIn for new user
    return await signInWithCredentials({ email, password });
  } catch (e) {
    console.log(e, "Signup error");
    return { success: false, error: "Signup error" };
  }
};
