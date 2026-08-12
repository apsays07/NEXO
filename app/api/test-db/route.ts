import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    // Ping MongoDB to confirm active connectivity
    await client.db().admin().ping();
    return NextResponse.json({ connected: true });
  } catch (error: any) {
    console.error("MongoDB Connection Error:", error);
    return NextResponse.json(
      {
        connected: false,
        error: error?.message || "Failed to connect to database",
      },
      { status: 500 }
    );
  }
}
