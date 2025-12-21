import { NextResponse } from "next/server";
import { fetchProjectGalleriesData } from "@/app/lib/data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleries = await fetchProjectGalleriesData(id);
    return NextResponse.json(galleries || []);
  } catch (error) {
    console.error("Failed to fetch project galleries:", error);
    return NextResponse.json([]);
  }
}
