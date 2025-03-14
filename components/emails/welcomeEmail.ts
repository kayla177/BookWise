// components/emails/welcomeEmail.ts
export function renderWelcomeEmail(fullName: string): string {
  return `
    <div>
      <h1>Welcome to the University Library!</h1>
      <p>Hello ${fullName},</p>
      <p>
        Thank you for registering with our library system. You can now borrow books
        and access other resources available in our library.
      </p>
      <p>Happy reading!</p>
      <p>University Library Team</p>
    </div>
  `;
}
