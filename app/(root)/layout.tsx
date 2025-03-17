// import React, { ReactNode } from "react";
// import Header from "@/components/Header";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { after } from "next/server";
// import { db } from "@/database/drizzle";
// import { users } from "@/database/schema";
// import { eq } from "drizzle-orm";
//
// const Layout = async ({ children }: { children: ReactNode }) => {
//   const session = await auth();
//   // console.log("[root/layout.tsx]Session Query Result:", session);
//
//   if (!session) {
//     redirect("/sign-in");
//   }
//
//   // after we check if the user are sign in
//   after(async () => {
//     // additional check if the user is logged in
//     if (!session?.user?.id) return;
//
//     // get the user and see if the last activity dat is today
//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, session?.user?.id))
//       .limit(1);
//
//     console.log("[root/layout.tsx]User Query Result:", user);
//
//     // Safety check: Ensure user exists before accessing lastActivityDate
//     if (!user.length || !user[0]?.lastActivityDate) {
//       console.warn(
//         "User not found or missing lastActivityDate:",
//         session?.user?.id,
//       );
//       return;
//     }
//
//     // Extract last activity date
//     const lastActivityDate = user[0].lastActivityDate;
//     const today = new Date().toISOString().slice(0, 10);
//
//     // If the last activity date is already today, skip updating
//     if (lastActivityDate === today) {
//       return;
//     }
//
//     // if the user is logged in, update the database
//     // the slice(0,10) here is takes the day, month and year, we do not need the time here
//     // eq() --> we only want to update the date for the user that is currently logged in
//     await db
//       .update(users)
//       .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
//       .where(eq(users.id, session?.user?.id));
//   });
//
//   return (
//     <main className="root-container">
//       <div className="max-w-7xl">
//         <Header session={session} />
//         <div className="mt-20 pb-20">{children}</div>
//       </div>
//     </main>
//   );
// };
// export default Layout;

// app/(root)/layout.tsx
import React, { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { trackUserActivity } from "@/lib/services/engagement";
import UserStatusTracker from "@/components/UserStatusTracker";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Track user activity on the server
  after(async () => {
    if (!session?.user?.id) return;
    await trackUserActivity(session.user.id);
  });

  return (
    <main className="root-container">
      <div className="max-w-7xl">
        <Header session={session} />

        {/* Client-side status tracker */}
        <UserStatusTracker
          userId={session.user.id}
          userName={session.user.name || "User"}
        />

        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
