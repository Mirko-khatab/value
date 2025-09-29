import { NextRequest, NextResponse } from "next/server";
import { fetchMachineGalleries } from "@/app/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const galleries = await fetchMachineGalleries(params.id);
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching machine galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch machine galleries" },
      { status: 500 }
    );
  }
}
