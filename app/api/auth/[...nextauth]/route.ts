import { NextAuth } from "@auth/nextjs";
import { handlers } from "@/auth";

// Add some debugging
console.log("NextAuth handlers initialized");

export const { GET, POST } = handlers;
