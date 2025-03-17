// app/api/cron/engagement/route.ts
import { NextResponse } from "next/server";
import { processUserEngagement } from "@/lib/services/engagement";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secretKey = searchParams.get("key");

    // Simple API key protection
    if (secretKey !== process.env.NEXT_PUBLIC_CRON_SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Process all users' engagement
    const result = await processUserEngagement();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing user engagement:", error);
    return NextResponse.json(
      { error: "Failed to process user engagement", details: String(error) },
      { status: 500 },
    );
  }
}
