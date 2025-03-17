import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/workflow";
import { renderWelcomeEmail } from "@/components/emails/WelcomeEmail";
import { renderInactivityReminderEmail } from "@/components/emails/InactivityReminderEmail";
import { renderWelcomeBackEmail } from "@/components/emails/WelcomeBackEmail";
import { renderAccountApprovalEmail } from "@/components/emails/AccountApprovalEmail";
import { renderBookBorrowedEmail } from "@/components/emails/BookBorrowedEmail";
import { renderDueReminderEmail } from "@/components/emails/DueReminderEmail";
import { renderReturnConfirmationEmail } from "@/components/emails/ReturnConfirmationEmail";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const emailType = url.searchParams.get("type") || "welcome";
    const testEmail = url.searchParams.get("email") || "test@example.com";
    const userName = url.searchParams.get("name") || "Test User";
    const bookTitle = url.searchParams.get("book") || "The Great Gatsby";

    console.log(`Sending ${emailType} email to ${testEmail}`);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toDateString();

    let renderEmail;

    switch (emailType) {
      case "welcome":
        renderEmail = async () => await renderWelcomeEmail(userName);
        break;
      case "approved":
        renderEmail = async () => await renderAccountApprovalEmail(userName);
        break;
      case "borrowed":
        renderEmail = async () =>
          await renderBookBorrowedEmail({
            fullName: userName,
            bookTitle: bookTitle,
            borrowDate: new Date().toDateString(),
            dueDate: dueDate,
          });
        break;
      case "due":
        renderEmail = async () =>
          await renderDueReminderEmail({
            fullName: userName,
            bookTitle: bookTitle,
            dueDate: dueDate,
          });
        break;
      case "return":
        renderEmail = async () =>
          await renderReturnConfirmationEmail({
            fullName: userName,
            bookTitle: bookTitle,
          });
        break;
      case "reminder":
      case "inactivity":
        renderEmail = async () => await renderInactivityReminderEmail(userName);
        break;
      case "checkin":
      case "welcome-back":
        renderEmail = async () => await renderWelcomeBackEmail(userName);
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid email type" },
          { status: 400 },
        );
    }

    const result = await sendEmail({
      email: testEmail,
      subject: `Test Email: ${emailType}`,
      renderEmail,
    });

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `Test ${emailType} email sent!`
        : `Failed to send email: ${result.error}`,
      details: result,
    });
  } catch (error) {
    console.error("Error sending test email:", error);

    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 },
    );
  }
}
