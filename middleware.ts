// export { auth as middleware } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function middleware(req: NextRequest) {
  console.log("🔥 Middleware triggered!");
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.next();
  }

  // Get user from the database
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  console.log("[MIDDLEWARE]User data: ", user);

  if (!user.length) {
    console.warn("⚠️ User not found in middleware:", session.user.id);
    return NextResponse.next();
  }

  // Extract lastActivityDate
  const lastActivityDate = user[0]?.lastActivityDate;
  const today = new Date().toISOString().slice(0, 10);

  if (lastActivityDate === today) {
    return NextResponse.next(); // No need to update
  }

  // Update lastActivityDate asynchronously (does not block request)
  db.update(users)
    .set({ lastActivityDate: today })
    .where(eq(users.id, session.user.id))
    .then(() => console.log("✅ Updated lastActivityDate in middleware"))
    .catch((err) => console.error("❌ Error updating lastActivityDate", err));

  return NextResponse.next();
}

// Apply middleware only on specific routes
export const config = {
  matcher: ["/:path*", "/my-profile/:path*"], // Adjust this based on your routes
};
