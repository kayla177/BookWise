import { db } from "@/database/drizzle";
import { users, borrowRecords } from "@/database/schema";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userList = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        role: users.role,
        universityId: users.universityId,
        dateJoined: users.createdAt,
        booksBorrowed: count(borrowRecords.id), // Count books borrowed
      })
      .from(users)
      .leftJoin(borrowRecords, eq(users.id, borrowRecords.userId)) // Join with borrowRecords
      .groupBy(users.id); // Group by user ID to count properly

    return NextResponse.json(userList);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
