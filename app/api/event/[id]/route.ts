import { NextRequest, NextResponse } from "next/server";
import { fetchEventById } from "@/app/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await fetchEventById(id);
    if (!events || events.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    // Return as array to match frontend expectations
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}
