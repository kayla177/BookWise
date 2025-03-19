import { NextResponse } from "next/server";
import { processUserEngagement } from "@/lib/services/engagement";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get("key");

    // Use the NEXT_PUBLIC_CRON_SECRET_KEY for validation
    const expectedKey = process.env.NEXT_PUBLIC_CRON_SECRET_KEY;

    // Log for debugging
    console.log("🔑[CRON/ENGAGEMENT] Received cron request");
    console.log(
      `🔑[CRON/ENGAGEMENT] Provided key: ${secretKey ? secretKey.substring(0, 5) + "..." : "none"}`,
    );
    console.log(
      `🔑[CRON/ENGAGEMENT] Expected key: ${expectedKey ? expectedKey.substring(0, 5) + "..." : "none"}`,
    );

    // Skip key validation during development if requested
    const skipValidation = searchParams.get("skip_validation") === "true";
    const validateKey =
      expectedKey && expectedKey.length > 0 && !skipValidation;

    if (validateKey && secretKey !== expectedKey) {
      console.log(
        "⛔[CRON/ENGAGEMENT] Unauthorized cron request - key mismatch",
      );
      return NextResponse.json(
        {
          error: "Unauthorized",
          provided: secretKey ? secretKey.substring(0, 5) : "none",
          expected: expectedKey.substring(0, 5),
        },
        { status: 401 },
      );
    }

    console.log(
      "✅[CRON/ENGAGEMENT] Authorization passed, processing user engagement...",
    );

    // Process all users' engagement - this will now only send emails
    // to users who were last active exactly 3 days ago
    const result = await processUserEngagement();
    console.log("✅[CRON/ENGAGEMENT] Engagement processing complete:", result);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "🔴[CRON/ENGAGEMENT] Error processing user engagement:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to process user engagement", details: String(error) },
      { status: 500 },
    );
  }
}
