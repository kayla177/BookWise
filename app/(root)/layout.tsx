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
