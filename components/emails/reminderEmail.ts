export function renderReminderEmail(fullName: string): string {
  return `
    <div>
      <h1>Are you still there?</h1>
      <p>Hey ${fullName}, we miss you! 🥰🥰</p>
      <p>
        It's been a while since you've used our library services.
        Don't forget we have many great books waiting for you!
      </p>
      <p>University Library Team</p>
    </div>
  `;
}
