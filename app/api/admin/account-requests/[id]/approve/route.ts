import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/workflow";
import { renderAccountApprovalEmail } from "@/components/emails";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id;

    // Get user details before updating
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Log before update
    console.log("[APPROVE/ROUTE.TS] Before update:", user[0]);

    // Update user status to APPROVED and role to ADMIN
    await db
      .update(users)
      .set({ status: "APPROVED", role: "ADMIN" })
      .where(eq(users.id, userId));

    // Fetch user after update to confirm changes
    const updatedUser = await db
      .select({ id: users.id, status: users.status, role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    console.log("[APPROVE/ROUTE.TS]✅ After update:", updatedUser[0]);

    // Send approval email
    await sendEmail({
      email: user[0].email,
      subject: "Your BookWise Account Has Been Approved!",
      renderEmail: () => renderAccountApprovalEmail(user[0].fullName),
    });

    return NextResponse.json({
      success: true,
      message: "Account approved, role updated, and email sent",
      userId: userId,
    });
  } catch (error) {
    console.error("❌ Error approving account request:", error);
    return NextResponse.json(
      { error: "Failed to approve account", details: String(error) },
      { status: 500 },
    );
  }
}
