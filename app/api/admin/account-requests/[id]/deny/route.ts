import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;

    // Get user details for notification
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user status to REJECTED
    await db
      .update(users)
      .set({ status: "REJECTED" })
      .where(eq(users.id, userId));

    // Could implement rejection email here
    // Example:
    // await sendEmail({
    //   email: user[0].email,
    //   subject: "Update on Your BookWise Account Request",
    //   renderEmail: () => renderAccountRejectionEmail(user[0].fullName),
    // });

    return NextResponse.json({
      success: true,
      message: "Account request denied",
      userId: userId,
    });
  } catch (error) {
    console.error("Error denying account request:", error);
    return NextResponse.json(
      { error: "Failed to deny account request", details: String(error) },
      { status: 500 },
    );
  }
}
