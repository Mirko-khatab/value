import { NextResponse } from "next/server";
import { fetchMachineGroups } from "@/app/lib/data";

export async function GET() {
  try {
    const machineGroups = await fetchMachineGroups();
    return NextResponse.json(machineGroups);
  } catch (error) {
    console.error("Error fetching machine groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch machine groups" },
      { status: 500 }
    );
  }
}
