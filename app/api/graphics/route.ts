import { NextRequest, NextResponse } from "next/server";
import { fetchGraphics } from "@/app/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const graphics = await fetchGraphics();

    // Apply limit if specified
    const result = limit ? graphics.slice(0, parseInt(limit)) : graphics;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching graphics:", error);
    return NextResponse.json(
      { error: "Failed to fetch graphics" },
      { status: 500 }
    );
  }
}
