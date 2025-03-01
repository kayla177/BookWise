import NextAuth, { User } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Defines how user authentication sessions are stored.
  session: {
    strategy: "jwt",
  },
  // Defines how users can log in.
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        //   if the user exist, try to fetch the user from the database
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        // "compare()" from bcryptjs checks if the provided password matches the hashed password
        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password,
        );

        if (!isPasswordValid) return null;

        // if login is successful, return user's info
        // this data is stored in the JWT session
        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
        } as User;
        //  means this will follow the structure as User
      },
    }),
  ],
  // Overrides the default NextAuth.js sign-in page
  // Instead of NextAuth’s built-in UI, the login page is now at /sign-in.
  pages: {
    signIn: "/sign-in",
  },
  // Modifies JWT token contents before storing it, when a user logs in, their ID and name are added to the token.
  // The token is used to authenticate API requests (instead of making a database call every time).
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      // console.log("SESSION CALLBACK:", session);

      return session;
    },
  },
});
