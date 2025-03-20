"use server";

import { randomBytes } from "crypto";
import { db } from "@/database/drizzle";
import { users, passwordResetTokens } from "@/database/schema";
import { eq, lt } from "drizzle-orm";
import { hash } from "bcryptjs";
import { sendEmail } from "@/lib/workflow";
import { renderPasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import config from "@/lib/config";

// Request a password reset
export async function requestPasswordReset(email: string) {
  try {
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
    const resetUrl = `${config.env.apiEndpoint}/reset-password/${token}`;

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
}

// Reset password with token
export async function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
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
}

// Clean up expired tokens (can be run periodically)
export async function cleanupExpiredTokens() {
  try {
    const now = new Date();
    await db
      .delete(passwordResetTokens)
      .where(lt(passwordResetTokens.expiresAt, now));

    return { success: true };
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    return { success: false, error: "Failed to clean up tokens" };
  }
}
