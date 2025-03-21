import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq, desc, asc } from "drizzle-orm";

// Get all pending account requests (admin requests)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get("sort") || "desc"; // Default to newest first

    const pendingUsers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        universityId: users.universityId,
        universityCard: users.universityCard,
        createdAt: users.createdAt,
        status: users.status,
        role: users.role,
      })
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(
        sortOrder === "asc" ? asc(users.createdAt) : desc(users.createdAt),
      );

    // Format the data for the frontend
    const formattedUsers = pendingUsers.map((user) => {
      const formatDate = (date: Date | null) => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      };

      return {
        ...user,
        createdAt: user.createdAt ? formatDate(user.createdAt) : "",
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching pending account requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending account requests" },
      { status: 500 },
    );
  }
}
