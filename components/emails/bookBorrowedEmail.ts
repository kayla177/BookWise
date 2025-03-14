// components/emails/bookBorrowedEmail.ts
export function renderBookBorrowedEmail(params: {
  fullName: string;
  bookTitle: string;
  dueDate: string;
}): string {
  const { fullName, bookTitle, dueDate } = params;

  return `
    <div>
      <h1>Book Borrowed Successfully</h1>
      <p>Hello ${fullName},</p>
      <p>
        You have successfully borrowed <strong>${bookTitle}</strong>.
      </p>
      <p>
        Please return the book by <strong>${dueDate}</strong>.
      </p>
      <p>Thank you for using our library!</p>
      <p>University Library Team</p>
    </div>
  `;
}
