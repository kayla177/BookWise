import React, { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  // after we check if the user are sign in
  //
  after(async () => {
    // additional check if the user is logged in
    if (!session?.user?.id) return;

    // get the user and see if the last activity dat is today
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session?.user?.id))
      .limit(1);

    if (user[0].lastActivityDate === new Date().toISOString().slice(0, 10)) {
      // if the last activity date is today, don't record
      return;
    }
    // if the user is logged in, update the database
    // the slice(0,10) here is takes the day, month and year, we do not need the time here
    // eq() --> we only want to update the date for the user that is currently logged in
    await db
      .update(users)
      .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
      .where(eq(users.id, session?.user?.id));
  });

  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};
export default Layout;
