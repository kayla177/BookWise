// simulate-inactive.ts
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables
config({ path: ".env.local" });

// Get user ID and days from command line arguments
const userId = process.argv[2];
const days = parseInt(process.argv[3] || "3");

if (!userId) {
  console.error("Please provide a user ID as the first argument.");
  console.error("Usage: ts-node simulate-inactive.ts <userId> [days=3]");
  process.exit(1);
}

async function simulateInactiveUser(userId: string, days: number) {
  try {
    console.log(`Simulating user ${userId} as inactive for ${days} days...`);

    // Get the database URL from environment variables
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL not found in environment variables");
    }

    // Connect to the database
    const sql = neon(databaseUrl);

    // Calculate the past date
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);
    const pastDateStr = pastDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // First check if the user exists
    const user = await sql`
      SELECT id, full_name, email, last_activity_date, last_reminder_sent
      FROM users
      WHERE id = ${userId}
    `;

    if (user.length === 0) {
      throw new Error(`User with ID ${userId} not found in the database.`);
    }

    console.log(`User found: ${user[0].full_name} (${user[0].email})`);
    console.log(`Current last_activity_date: ${user[0].last_activity_date}`);
    console.log(
      `Current last_reminder_sent: ${user[0].last_reminder_sent || "null"}`,
    );

    // Update the user's last_activity_date and reset last_reminder_sent
    await sql`
      UPDATE users
      SET 
        last_activity_date = ${pastDateStr},
        last_reminder_sent = NULL
      WHERE id = ${userId}
    `;

    // Verify the update
    const updatedUser = await sql`
      SELECT id, full_name, email, last_activity_date, last_reminder_sent
      FROM users
      WHERE id = ${userId}
    `;

    console.log("\nUpdate successful:");
    console.log(`User: ${updatedUser[0].full_name} (${updatedUser[0].email})`);
    console.log(
      `New last_activity_date: ${updatedUser[0].last_activity_date} (${days} days ago)`,
    );
    console.log(
      `New last_reminder_sent: ${updatedUser[0].last_reminder_sent || "null"}`,
    );

    console.log("\nUser is now set up to receive an inactivity reminder.");
  } catch (error) {
    console.error("Error simulating inactive user:", error);
  }
}

// Run the function
simulateInactiveUser(userId, days)
  .then(() => {
    console.log("Simulation completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Simulation failed:", err);
    process.exit(1);
  });
