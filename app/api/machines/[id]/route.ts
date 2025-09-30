import { NextRequest, NextResponse } from "next/server";
import { fetchMachineById } from "@/app/lib/data";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const machines = await fetchMachineById(id);

    if (machines.length === 0) {
      return NextResponse.json({ error: "Machine not found" }, { status: 404 });
    }

    return NextResponse.json(machines[0]);
  } catch (error) {
    console.error("Error fetching machine:", error);
    return NextResponse.json(
      { error: "Failed to fetch machine" },
      { status: 500 }
    );
  }
}
