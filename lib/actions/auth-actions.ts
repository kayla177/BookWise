"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function logoutAction() {
  try {
    await signOut();
    // Explicitly redirect after signOut
    redirect("/sign-in");
  } catch (error) {
    console.error("Server logout error:", error);
    // Return the error to be handled client-side
    return { success: false, error: "Failed to sign out" };
  }
}
