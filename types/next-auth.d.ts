import "next-auth";
import { ROLE_ENUM } from "@/database/schema";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: (typeof ROLE_ENUM.enumValues)[number] | null;
  }

  interface Session {
    user: User & {
      id: string;
      name: string;
      email: string;
      role?: (typeof ROLE_ENUM.enumValues)[number];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: (typeof ROLE_ENUM.enumValues)[number] | null;
  }
}
