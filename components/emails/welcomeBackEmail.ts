// components/emails/welcomeBackEmail.ts
export function renderWelcomeBackEmail(fullName: string): string {
  return `
    <div>
      <h1>Welcome back!</h1>
      <p>Welcome back ${fullName}, good to see you! 🥳🥳</p>
      <p>
        We're glad to see you're using our library services again.
        Check out our new arrivals section for the latest books!
      </p>
      <p>University Library Team</p>
    </div>
  `;
}
