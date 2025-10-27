import { NextRequest, NextResponse } from "next/server";
import { fetchEventGalleries } from "@/app/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleries = await fetchEventGalleries(id);
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Failed to fetch event galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch event galleries" },
      { status: 500 }
    );
  }
}
