import { NextResponse } from "next/server";
import { fetchProjectLocations } from "@/app/lib/data";

export async function GET() {
  try {
    const locations = await fetchProjectLocations();
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error fetching project locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch project locations" },
      { status: 500 }
    );
  }
}
