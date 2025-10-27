import { NextResponse } from "next/server";
import { fetchAboutStats } from "@/app/lib/data";

export async function GET() {
  try {
    const stats = await fetchAboutStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch about stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch about stats" },
      { status: 500 }
    );
  }
}
