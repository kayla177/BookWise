// Create a new file: app/api/cron/due-reminders/route.ts
import { NextResponse } from "next/server";
import { processBookDueReminders } from "@/lib/services/dueReminders";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get("key");

    // Use the NEXT_PUBLIC_CRON_SECRET_KEY for validation
    const expectedKey = process.env.NEXT_PUBLIC_CRON_SECRET_KEY;

    // Log for debugging
    console.log("🔑[CRON/DUE_REMINDERS] Received cron request");

    // Skip key validation during development if requested
    const skipValidation = searchParams.get("skip_validation") === "true";
    const validateKey =
      expectedKey && expectedKey.length > 0 && !skipValidation;

    if (validateKey && secretKey !== expectedKey) {
      console.log(
        "⛔[CRON/DUE_REMINDERS] Unauthorized cron request - key mismatch",
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "✅[CRON/DUE_REMINDERS] Authorization passed, processing due reminders...",
    );

    // Process due reminders
    const result = await processBookDueReminders();
    console.log(
      "✅[CRON/DUE_REMINDERS] Due reminders processing complete:",
      result,
    );

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "🔴[CRON/DUE_REMINDERS] Error processing due reminders:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to process due reminders", details: String(error) },
      { status: 500 },
    );
  }
}
