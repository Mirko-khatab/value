import { NextResponse } from "next/server";
import { fetchLocations } from "@/app/lib/data";

export async function GET() {
  try {
    const locations = await fetchLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching project locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch project locations" },
      { status: 500 }
    );
  }
}
