import { NextResponse } from "next/server";
import { fetchLocations } from "@/app/lib/data";

export async function GET() {
  try {
    const locations = await fetchLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
