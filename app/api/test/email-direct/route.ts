import { NextResponse } from "next/server";
import { Resend } from "resend";
import config from "@/lib/config";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";

/**
 * This is the most basic email test endpoint
 * It bypasses all the engagement logic and just attempts to:
 * 1. Render an inactivity reminder email
 * 2. Send it directly via Resend
 *
 * Example usage:
 * /api/test/email-direct?email=your@email.com&name=Your%20Name
 */
export async function GET(request: Request) {
  try {
    // Parse URL parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "test@example.com";
    const name = searchParams.get("name") || "Test User";

    console.log("Starting direct email test");
    console.log(`Sending to: ${email}`);
    console.log(`Recipient name: ${name}`);

    // Initialize Resend directly
    const resendKey = config.env.resendToken;
    console.log(
      `[EMAIL_DIRECT] Using Resend key starting with: ${resendKey.substring(0, 5)}...`,
    );

    const resend = new Resend(resendKey);

    // Render the email content
    console.log("[EMAIL_DIRECT] Rendering email content...");
    const htmlContent = await renderInactivityReminderEmail(name);
    console.log(
      `[EMAIL_DIRECT] Email content rendered (${htmlContent.length} characters)`,
    );
    console.log(
      "[EMAIL_DIRECT] HTML Content Preview:",
      htmlContent.substring(0, 200) + "...",
    );

    console.log("[EMAIL_DIRECT] Sending email...");
    const { data, error } = await resend.emails.send({
      from: "Kayla <contact@kayla-li.com>",
      to: [email],
      subject: "We Miss You at BookWise! [DIRECT TEST]",
      html: htmlContent,
    });

    console.log("Resend API response:", data);

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error,
          details: {
            key: resendKey.substring(0, 5) + "...",
            recipient: email,
            name: name,
            contentLength: htmlContent.length,
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent directly to ${email}`,
      data,
      details: {
        key: resendKey.substring(0, 5) + "...",
        recipient: email,
        name: name,
        contentLength: htmlContent.length,
      },
    });
  } catch (error) {
    console.error("Error in direct email test:", error);
    return NextResponse.json(
      {
        error: "Email send failed",
        details: String(error),
        stack: (error as Error).stack,
      },
      { status: 500 },
    );
  }
}
