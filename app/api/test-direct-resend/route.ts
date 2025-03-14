// app/api/test-direct-resend/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import config from "@/lib/config";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email") || "test@example.com";
    const name = url.searchParams.get("name") || "Test User";

    console.log(`Testing direct Resend email to: ${email}`);

    // Create Resend instance
    const resend = new Resend(config.env.resendToken);

    // Simple HTML string for testing
    const htmlString = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
            <h1 style="color: #ffffff;">Welcome to BookWise!</h1>
            <p style="color: #e2e8f0;">Hello ${name},</p>
            <p style="color: #e2e8f0;">Thank you for joining BookWise. We're excited to have you as part of our community!</p>
            <div style="margin-top: 30px; text-align: center;">
              <a href="https://example.com/login" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Started</a>
            </div>
            <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Happy reading,<br>The BookWise Team</p>
          </div>
        </body>
      </html>
    `;

    // Send email directly through Resend
    const { data, error } = await resend.emails.send({
      from: "Kayla <contact@kayla-li.com>",
      to: [email],
      subject: "Welcome to BookWise (DIRECT TEST)",
      html: htmlString,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(JSON.stringify(error));
    }

    console.log("Resend API success:", data);

    return NextResponse.json({
      success: true,
      message: `Direct Resend email sent to ${email}`,
      data,
    });
  } catch (error) {
    console.error("Direct Resend test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    );
  }
}
