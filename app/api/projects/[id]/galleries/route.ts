import { NextResponse } from "next/server";
import { fetchProjectGalleriesData } from "@/app/lib/data";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const galleries = await fetchProjectGalleriesData(id);

    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching project galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}
