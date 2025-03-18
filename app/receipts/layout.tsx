import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReceiptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  return (
    <main className="root-container">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  );
}
