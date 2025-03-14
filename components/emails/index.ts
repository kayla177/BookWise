// components/emails/index.ts

// Export all email components
export { default as WelcomeEmail, renderWelcomeEmail } from "./WelcomeEmail";
export {
  default as AccountApprovalEmail,
  renderAccountApprovalEmail,
} from "./AccountApprovalEmail";
export {
  default as BookBorrowedEmail,
  renderBookBorrowedEmail,
} from "./BookBorrowedEmail";
export {
  default as DueReminderEmail,
  renderDueReminderEmail,
} from "./DueReminderEmail";
export {
  default as CheckInReminderEmail,
  renderCheckInReminderEmail,
} from "./CheckInReminderEmail";
export {
  default as ReturnConfirmationEmail,
  renderReturnConfirmationEmail,
} from "./ReturnConfirmationEmail";
export { default as ReceiptEmail, renderReceiptEmail } from "./ReceiptEmail";
export {
  default as WelcomeBackEmail,
  renderWelcomeBackEmail,
} from "./WelcomeBackEmail";

// Export the layout
export { default as EmailLayout } from "./EmailLayout";
