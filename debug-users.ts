// debug-users.js
require("dotenv").config({ path: ".env.local" });
const { neon } = require("@neondatabase/serverless");

// Define the user interface to match database columns
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} full_name
 * @property {string|null} last_activity_date
 * @property {string|null} last_reminder_sent
 * @property {string} created_at
 */

async function debugUsers() {
  try {
    console.log("Connecting to database...");

    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL not found in environment variables");
    }

    // Connect to the database
    const sql = neon(databaseUrl);

    console.log("Fetching all users with their activity dates...");

    // Get all users with their activity info
    const users = await sql`
      SELECT 
        id, 
        email, 
        full_name, 
        last_activity_date, 
        last_reminder_sent,
        created_at
      FROM users 
      ORDER BY last_activity_date DESC NULLS LAST;
    `;

    console.log(`Found ${users.length} users in the database.`);

    // Calculate days since last activity for each user
    const now = new Date();

    const usersWithData = users.map((user) => {
      const lastActivityDate = user.last_activity_date
        ? new Date(user.last_activity_date)
        : null;
      const lastReminderSent = user.last_reminder_sent
        ? new Date(user.last_reminder_sent)
        : null;

      // Calculate days since last activity
      let daysSinceActivity = null;
      if (lastActivityDate) {
        const diffTime = Math.abs(now.getTime() - lastActivityDate.getTime());
        daysSinceActivity = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }

      // Calculate days since last reminder
      let daysSinceReminder = null;
      if (lastReminderSent) {
        const diffTime = Math.abs(now.getTime() - lastReminderSent.getTime());
        daysSinceReminder = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }

      // Determine if user should receive a reminder
      const shouldSendReminder =
        daysSinceActivity === 3 && // Exactly 3 days inactive
        (!lastReminderSent ||
          (daysSinceReminder !== null && daysSinceReminder > 0)); // No reminder sent or not sent today

      return {
        ...user,
        lastActivityDate,
        lastReminderSent,
        daysSinceActivity,
        daysSinceReminder,
        shouldSendReminder,
      };
    });

    // Print user info
    usersWithData.forEach((user) => {
      console.log(`User: ${user.full_name} (${user.email})`);
      console.log(
        `  Last Activity: ${user.lastActivityDate ? user.lastActivityDate.toISOString().split("T")[0] : "Never"} (${user.daysSinceActivity} days ago)`,
      );
      console.log(
        `  Last Reminder: ${user.lastReminderSent ? user.lastReminderSent.toISOString() : "Never"}`,
      );
      console.log(
        `  Should Send Reminder: ${user.shouldSendReminder ? "YES" : "NO"}`,
      );
      console.log("---");
    });

    // Find users who should receive a reminder
    const usersForReminder = usersWithData.filter(
      (user) => user.shouldSendReminder,
    );

    console.log(
      `\n${usersForReminder.length} users should receive a reminder today.`,
    );

    if (usersForReminder.length > 0) {
      console.log("Users who should receive reminders:");
      usersForReminder.forEach((user) => {
        console.log(`- ${user.full_name} (${user.email})`);
      });
    }
  } catch (error) {
    console.error("Error debugging users:", error);
  }
}

// Run the function
debugUsers()
  .then(() => {
    console.log("Debug script completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Debug script failed:", err);
    process.exit(1);
  });
