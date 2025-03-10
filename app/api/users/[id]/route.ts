import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users, ROLE_ENUM } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { role } = await req.json();

    if (!ROLE_ENUM.enumValues.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await db.update(users).set({ role }).where(eq(users.id, params.id));

    return NextResponse.json({ success: true, message: "User role updated" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await db.delete(users).where(eq(users.id, params.id));
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 },
    );
  }
}
