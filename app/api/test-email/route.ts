// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/workflow";
import { renderWelcomeEmail } from "@/components/emails/welcomeEmail";
import { renderBookBorrowedEmail } from "@/components/emails/bookBorrowedEmail";

export async function GET(request: Request) {
  try {
    // Get parameters from the URL properly
    const url = new URL(request.url);
    const emailType = url.searchParams.get("type") || "welcome";
    const testEmail = url.searchParams.get("email") || "test@example.com";

    console.log(`Sending ${emailType} email to ${testEmail}`);

    if (emailType === "welcome") {
      await sendEmail({
        email: testEmail,
        subject: "Welcome to the University Library (TEST)",
        html: renderWelcomeEmail("Test User"),
      });
    } else if (emailType === "borrowed") {
      await sendEmail({
        email: testEmail,
        subject: "Book Borrowed Successfully (TEST)",
        html: renderBookBorrowedEmail({
          fullName: "Test User",
          bookTitle: "Test Book Title",
          dueDate: new Date().toDateString(),
        }),
      });
    }

    // Return a proper JSON response
    return NextResponse.json({
      success: true,
      message: `Test ${emailType} email sent to ${testEmail}`,
    });
  } catch (error) {
    // Log the entire error
    console.error("Email test failed:", error);

    // Return a proper error response
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        stack:
          process.env.NODE_ENV === "development"
            ? (error as Error).stack
            : undefined,
      },
      { status: 500 },
    );
  }
}
