import { NextRequest, NextResponse } from "next/server";
import { fetchLocations, fetchLocationsByCountry } from "@/app/lib/data";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");

    let locations;
    if (countryId) {
      locations = await fetchLocationsByCountry(countryId);
    } else {
      locations = await fetchLocations();
    }

    const response = NextResponse.json(locations);

    // Add caching headers for better performance
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=7200"
    );

    return response;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}



