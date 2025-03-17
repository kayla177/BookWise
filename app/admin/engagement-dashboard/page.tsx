import React from "react";
import EngagementDashboardClient from "./EngagementDashboardClient";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

const fetchUsers = async () => {
  try {
    const userData = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        lastActivityDate: users.lastActivityDate,
        createdAt: users.createdAt,
        status: users.status,
      })
      .from(users);

    // Convert Date fields to string before sending to the client
    const formattedUsers = userData.map((user) => ({
      ...user,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    }));

    return { users: formattedUsers };
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
