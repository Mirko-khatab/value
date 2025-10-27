import { NextResponse } from "next/server";
import { fetchQuotes } from "@/app/lib/data";

export async function GET() {
  try {
    const quotes = await fetchQuotes();
    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
