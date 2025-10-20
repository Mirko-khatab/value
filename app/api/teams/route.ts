import { NextResponse } from "next/server";
import { fetchTeams } from "@/app/lib/data";

export async function GET() {
  try {
    const teams = await fetchTeams();
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
