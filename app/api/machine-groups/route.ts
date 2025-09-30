import { NextRequest, NextResponse } from "next/server";
import { fetchMachineGroups } from "@/app/lib/data";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const machineGroups = await fetchMachineGroups();

    const response = NextResponse.json(machineGroups);

    // Add caching headers for better performance
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );

    return response;
  } catch (error) {
    console.error("Error fetching machine groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch machine groups" },
      { status: 500 }
    );
  }
}
