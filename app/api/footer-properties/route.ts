import { NextResponse } from "next/server";
import { fetchFooterProperties } from "@/app/lib/data";

export async function GET() {
  try {
    const properties = await fetchFooterProperties();
    return NextResponse.json(properties);
  } catch (error) {
    console.error("Failed to fetch footer properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch footer properties" },
      { status: 500 }
    );
  }
}
