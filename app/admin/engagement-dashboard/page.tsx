// import { auth } from "@/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/database/drizzle";
// import { users } from "@/database/schema";
// import { eq } from "drizzle-orm";
// import EngagementDashboardClient from "./EngagementDashboardClient";
//
// export default async function EngagementDashboardPage() {
//   // Fetch the session
//   const session = await auth();
//
//   // Extensive logging
//   console.log("Full Session Object:", JSON.stringify(session, null, 2));
//   console.log("Session User:", JSON.stringify(session?.user, null, 2));
//
//   // Check if user is authenticated
//   if (!session?.user) {
//     console.log("No user in session - redirecting to sign-in");
//     redirect("/sign-in");
//   }
//
//   // Fetch user from database to double-check role
//   try {
//     const [dbUser] = await db
//       .select({ role: users.role })
//       .from(users)
//       .where(eq(users.id, session.user.id))
//       .limit(1);
//
//     console.log("Database User Role:", JSON.stringify(dbUser, null, 2));
//
//     // Check if user is an admin
//     if (!dbUser || dbUser.role !== "ADMIN") {
//       console.log("User is not an admin - redirecting");
//       console.log("User Role:", dbUser?.role);
//       redirect("/");
//     }
//
//     // Fetch all users for the dashboard
//     const allUsers = await db
//       .select({
//         id: users.id,
//         fullName: users.fullName,
//         email: users.email,
//         lastActivityDate: users.lastActivityDate,
//         createdAt: users.createdAt,
//         status: users.status,
//       })
//       .from(users);
//
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold mb-6">Engagement Dashboard</h1>
//         <EngagementDashboardClient userData={{ users: allUsers }} />
//       </div>
//     );
//   } catch (error) {
//     console.error("Error in engagement dashboard page:", error);
//     redirect("/");
//   }
// }
//
// // Disable static generation for this page
// export const dynamic = "force-dynamic";

import React from "react";
import EngagementDashboardClient from "./EngagementDashboardClient";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const fetchUsers = async () => {
  try {
    const userData = await db.select().from(users);
    return { users: userData };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [] };
  }
};

const EngagementDashboardPage = async () => {
  const userData = await fetchUsers();

  return (
    <div>
      <EngagementDashboardClient userData={userData} />
    </div>
  );
};

export default EngagementDashboardPage;
