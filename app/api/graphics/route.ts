import { NextResponse } from "next/server";
import { fetchGraphics } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const graphics = await fetchGraphics();

    if (limit) {
      const limitedGraphics = graphics.slice(0, parseInt(limit));
      return NextResponse.json(limitedGraphics);
    }

    return NextResponse.json(graphics);
  } catch (error) {
    console.error("Failed to fetch graphics:", error);
    return NextResponse.json(
      { error: "Failed to fetch graphics" },
      { status: 500 }
    );
  }
}
