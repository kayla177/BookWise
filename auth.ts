// import NextAuth, { User } from "next-auth";
// import { compare } from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { db } from "@/database/drizzle";
// import { users } from "@/database/schema";
// import { eq } from "drizzle-orm";
//
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   // Defines how user authentication sessions are stored.
//   session: {
//     strategy: "jwt",
//   },
//   // Defines how users can log in.
//   providers: [
//     CredentialsProvider({
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }
//
//         //   if the user exist, try to fetch the user from the database
//         const user = await db
//           .select()
//           .from(users)
//           .where(eq(users.email, credentials.email.toString()))
//           .limit(1);
//
//         if (user.length === 0) return null;
//
//         // "compare()" from bcryptjs checks if the provided password matches the hashed password
//         const isPasswordValid = await compare(
//           credentials.password.toString(),
//           user[0].password,
//         );
//
//         if (!isPasswordValid) return null;
//
//         // if login is successful, return user's info
//         // this data is stored in the JWT session
//         return {
//           id: user[0].id.toString(),
//           email: user[0].email,
//           name: user[0].fullName,
//         } as User;
//         //  means this will follow the structure as User
//       },
//     }),
//   ],
//   // Overrides the default NextAuth.js sign-in page
//   // Instead of NextAuth’s built-in UI, the login page is now at /sign-in.
//   pages: {
//     signIn: "/sign-in",
//   },
//   // Modifies JWT token contents before storing it, when a user logs in, their ID and name are added to the token.
//   // The token is used to authenticate API requests (instead of making a database call every time).
//   // callbacks: {
//   //   async jwt({ token, user }) {
//   //     if (user) {
//   //       token.id = user.id;
//   //       token.name = user.name;
//   //     }
//   //
//   //     return token;
//   //   },
//   //   async session({ session, token }) {
//   //     if (session.user) {
//   //       session.user.id = token.id as string;
//   //       session.user.name = token.name as string;
//   //     }
//   //
//   //     // console.log("SESSION CALLBACK:", session);
//   //
//   //     return session;
//   //   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//       }
//       return token;
//     },
//     async session({ session, token }): Promise<Session> {
//       if (session.user) {
//         // Validate user still exists in DB
//         const dbUser = await db
//           .select()
//           .from(users)
//           .where(eq(users.id, token.id as string))
//           .limit(1);
//
//         if (dbUser.length === 0) {
//           console.warn("⚠️ User no longer exists. Returning an empty session.");
//           return { ...session, user: { id: "", name: "", email: "" } }; // Prevents type error
//         }
//
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//       }
//       return session;
//     },
//   },
// });

import NextAuth, { User } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { ROLE_ENUM, users } from "@/database/schema";
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

        // if the user exist, try to fetch the user from the database
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
          role: user[0].role,
        } as User;
      },
    }),
  ],

  // Overrides the default NextAuth.js sign-in page
  pages: {
    signIn: "/sign-in",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Validate user still exists in DB
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);

        if (dbUser.length === 0) {
          console.warn("⚠️ User no longer exists. Returning an empty session.");
          return { ...session, user: { id: "", name: "", email: "" } }; // Prevents type error
        }

        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as (typeof ROLE_ENUM.enumValues)[number];
      }
      return session;
    },
  },
});
