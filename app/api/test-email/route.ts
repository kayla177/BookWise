// app/api/test-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import config from "@/lib/config";

// Email templates - using simple HTML strings for reliability
const renderWelcomeEmail = (name: string) => `
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

const renderBookBorrowedEmail = (params: {
  fullName: string;
  bookTitle: string;
  dueDate: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">You've Borrowed a Book!</h1>
        <p style="color: #e2e8f0;">Hello ${params.fullName},</p>
        <p style="color: #e2e8f0;">You've successfully borrowed <strong>${params.bookTitle}</strong>.</p>
        <ul style="color: #e2e8f0;">
          <li>Borrowed On: <strong>${new Date().toDateString()}</strong></li>
          <li>Due Date: <strong>${params.dueDate}</strong></li>
        </ul>
        <p style="color: #e2e8f0;">Enjoy your reading, and don't forget to return the book on time!</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/my-books" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View My Books</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Happy reading,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

const renderAccountApprovalEmail = (name: string) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">Your BookWise Account Has Been Approved!</h1>
        <p style="color: #e2e8f0;">Hello ${name},</p>
        <p style="color: #e2e8f0;">Congratulations! Your BookWise account has been approved. You can now browse our library, borrow books, and enjoy all the features of your new account.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/login" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log in to BookWise</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Welcome aboard,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

const renderDueReminderEmail = (params: {
  fullName: string;
  bookTitle: string;
  dueDate: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">Reminder: ${params.bookTitle} is Due Soon!</h1>
        <p style="color: #e2e8f0;">Hello ${params.fullName},</p>
        <p style="color: #e2e8f0;">Just a reminder that <strong>${params.bookTitle}</strong> is due for return on <strong>${params.dueDate}</strong>. Kindly return it on time to avoid late fees.</p>
        <p style="color: #e2e8f0;">If you're still reading, you can renew the book in your account.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/renew" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Renew Book Now</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Keep reading,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

const renderCheckInReminderEmail = (name: string) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">Don't Forget to Check In at BookWise</h1>
        <p style="color: #e2e8f0;">Hello ${name},</p>
        <p style="color: #e2e8f0;">We noticed you haven't checked in recently. Stay active and keep track of your borrowed books, due dates, and new arrivals.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/login" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log in to BookWise</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Keep the pages turning,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

const renderReturnConfirmationEmail = (params: {
  fullName: string;
  bookTitle: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">Thank You for Returning ${params.bookTitle}!</h1>
        <p style="color: #e2e8f0;">Hello ${params.fullName},</p>
        <p style="color: #e2e8f0;">We've successfully received your return of <strong>${params.bookTitle}</strong>. Thank you for returning it on time.</p>
        <p style="color: #e2e8f0;">Looking for your next read? Browse our collection and borrow your next favorite book!</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/library" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore New Books</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Happy exploring,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

const renderReceiptEmail = (params: {
  fullName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  receiptUrl: string;
}) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">Your Receipt for ${params.bookTitle} is Ready!</h1>
        <p style="color: #e2e8f0;">Hello ${params.fullName},</p>
        <p style="color: #e2e8f0;">Your receipt for borrowing <strong>${params.bookTitle}</strong> has been generated. Here are the details:</p>
        <ul style="color: #e2e8f0;">
          <li>Borrowed On: <strong>${params.borrowDate}</strong></li>
          <li>Due Date: <strong>${params.dueDate}</strong></li>
        </ul>
        <div style="margin-top: 30px; text-align: center;">
          <a href="${params.receiptUrl}" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Download Receipt</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Keep the pages turning,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

const renderWelcomeBackEmail = (name: string) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">Welcome Back!</h1>
        <p style="color: #e2e8f0;">Hello ${name},</p>
        <p style="color: #e2e8f0;">Welcome back! Good to see you! 🥳🥳</p>
        <p style="color: #e2e8f0;">We're glad to see you're using our library services again. Check out our new arrivals section for the latest books!</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/new-arrivals" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore New Arrivals</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">Happy to have you back!<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

// Reminder email function
const renderReminderEmail = (name: string) => `
  <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #1e293b; color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #334155; padding: 20px; border-radius: 8px;">
        <h1 style="color: #ffffff;">We Miss You at BookWise!</h1>
        <p style="color: #e2e8f0;">Hello ${name},</p>
        <p style="color: #e2e8f0;">It's been a while since we last saw you—over three days, to be exact! New books are waiting for you, and your next great read might just be a click away.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://example.com/library" style="background-color: #E7C9A5; color: #1e293b; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Explore Books on BookWise</a>
        </div>
        <p style="color: #94a3b8; margin-top: 30px; font-size: 14px;">See you soon,<br>The BookWise Team</p>
      </div>
    </body>
  </html>
`;

export async function GET(request: Request) {
  try {
    // Get parameters from the URL properly
    const url = new URL(request.url);
    const emailType = url.searchParams.get("type") || "welcome";
    const testEmail = url.searchParams.get("email") || "test@example.com";
    const userName = url.searchParams.get("name") || "Test User";
    const bookTitle = url.searchParams.get("book") || "The Great Gatsby";

    console.log(`Sending ${emailType} email to ${testEmail}`);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dueDate = tomorrow.toDateString();

    const receiptUrl = "https://bookwise.yourdomain.com/receipts/123456";

    // Create Resend instance
    const resend = new Resend(config.env.resendToken);
    let htmlContent = "";
    let emailSubject = "";

    // Determine which email template to use
    switch (emailType) {
      case "welcome":
        htmlContent = renderWelcomeEmail(userName);
        emailSubject = "Welcome to BookWise (TEST)";
        break;

      case "borrowed":
        htmlContent = renderBookBorrowedEmail({
          fullName: userName,
          bookTitle: bookTitle,
          dueDate: dueDate,
        });
        emailSubject = "Book Borrowed Successfully (TEST)";
        break;

      case "approved":
        htmlContent = renderAccountApprovalEmail(userName);
        emailSubject = "Your BookWise Account Has Been Approved (TEST)";
        break;

      case "reminder":
        htmlContent = renderReminderEmail(userName);
        emailSubject = "We Miss You at BookWise (TEST)";
        break;

      case "due":
        htmlContent = renderDueReminderEmail({
          fullName: userName,
          bookTitle: bookTitle,
          dueDate: dueDate,
        });
        emailSubject = `Reminder: ${bookTitle} is Due Soon (TEST)`;
        break;

      case "checkin":
        htmlContent = renderCheckInReminderEmail(userName);
        emailSubject = "Don't Forget to Check In at BookWise (TEST)";
        break;

      case "return":
        htmlContent = renderReturnConfirmationEmail({
          fullName: userName,
          bookTitle: bookTitle,
        });
        emailSubject = `Thank You for Returning ${bookTitle} (TEST)`;
        break;

      case "receipt":
        htmlContent = renderReceiptEmail({
          fullName: userName,
          bookTitle: bookTitle,
          borrowDate: new Date().toDateString(),
          dueDate: dueDate,
          receiptUrl: receiptUrl,
        });
        emailSubject = `Your Receipt for ${bookTitle} is Ready (TEST)`;
        break;

      case "welcomeback":
        htmlContent = renderWelcomeBackEmail(userName);
        emailSubject = "Welcome Back to BookWise (TEST)";
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message: `Unknown email type: ${emailType}`,
            availableTypes: [
              "welcome",
              "borrowed",
              "approved",
              "reminder",
              "due",
              "checkin",
              "return",
              "receipt",
              "welcomeback",
            ],
          },
          { status: 400 },
        );
    }

    // Send email directly via Resend
    const { data, error } = await resend.emails.send({
      from: "Kayla <contact@kayla-li.com>",
      to: [testEmail],
      subject: emailSubject,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(JSON.stringify(error));
    }

    console.log("Email sent successfully:", data);

    return NextResponse.json({
      success: true,
      message: `Test ${emailType} email sent to ${testEmail}`,
      data,
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
