// app/api/test/email/route.ts
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/workflow";
import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";
import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";
import { renderAccountApprovalEmail } from "@/components/emails/AccountApprovalEmail";
import { renderBookBorrowedEmail } from "@/components/emails/BookBorrowedEmail";
import { renderDueReminderEmail } from "@/components/emails/DueReminderEmail";
import { renderReturnConfirmationEmail } from "@/components/emails/ReturnConfirmationEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, email, name, bookTitle } = body;

    if (!type || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 },
      );
    }

    let result;
    const userName = name || "Test User";
    const bookName = bookTitle || "The Great Gatsby";
    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = dueDate.toISOString().split("T")[0];

    switch (type) {
      case "welcome":
        result = await sendEmail({
          email,
          subject: "Welcome to BookWise! (TEST)",
          renderEmail: () => renderWelcomeEmail(userName),
        });
        break;

      case "inactivity":
        result = await sendEmail({
          email,
          subject: "We Miss You at BookWise! (TEST)",
          renderEmail: () => renderInactivityReminderEmail(userName),
        });
        break;

      case "welcome-back":
        result = await sendEmail({
          email,
          subject: "Welcome Back to BookWise! (TEST)",
          renderEmail: () => renderWelcomeBackEmail(userName),
        });
        break;

      case "approval":
        result = await sendEmail({
          email,
          subject: "Your BookWise Account is Approved! (TEST)",
          renderEmail: () => renderAccountApprovalEmail(userName),
        });
        break;

      case "borrowed":
        result = await sendEmail({
          email,
          subject: `Book Borrowed: ${bookName} (TEST)`,
          renderEmail: () =>
            renderBookBorrowedEmail({
              fullName: userName,
              bookTitle: bookName,
              borrowDate: today,
              dueDate: dueDateStr,
            }),
        });
        break;

      case "due-reminder":
        result = await sendEmail({
          email,
          subject: `Reminder: ${bookName} is Due Soon (TEST)`,
          renderEmail: () =>
            renderDueReminderEmail({
              fullName: userName,
              bookTitle: bookName,
              dueDate: dueDateStr,
            }),
        });
        break;

      case "return":
        result = await sendEmail({
          email,
          subject: `Book Return Confirmation: ${bookName} (TEST)`,
          renderEmail: () =>
            renderReturnConfirmationEmail({
              fullName: userName,
              bookTitle: bookName,
            }),
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `Test email of type '${type}' sent to ${email}`,
      result,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "Failed to send test email", details: String(error) },
      { status: 500 },
    );
  }
}
