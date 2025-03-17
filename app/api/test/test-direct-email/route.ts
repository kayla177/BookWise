import { NextResponse } from "next/server";
import { Resend } from "resend";
import config from "@/lib/config";

export async function GET(request: Request) {
  try {
    const resend = new Resend(config.env.resendToken);

    // Get email from query params
    const url = new URL(request.url);
    const testEmail = url.searchParams.get("email") || "test@example.com";

    console.log(
      `[TEST_DIRECT_EMAIL] Using Resend token: ${config.env.resendToken?.substring(0, 5)}...`,
    );

    console.log("Attempting to send direct email using Resend");

    // Call Resend API directly
    const { data, error } = await resend.emails.send({
      from: "BookWise <contact@kayla-li.com>", // Make sure this domain is verified in Resend
      to: [testEmail],
      subject: "Direct Resend API Test",
      html:
        "<p>This is a direct test of the Resend API without QStash.</p><p>Time: " +
        new Date().toISOString() +
        "</p>",
    });

    console.log("[TEST_DIRECT_EMAIL] Resend API response:", data);

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    return NextResponse.json({
      success: true,
      message: `Direct email test sent to ${testEmail} via Resend`,
      data,
    });
  } catch (error) {
    console.error("Direct Resend API test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
