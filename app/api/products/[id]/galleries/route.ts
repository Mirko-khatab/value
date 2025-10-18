import { NextRequest, NextResponse } from "next/server";
import { fetchProductGalleries } from "@/app/lib/data";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleries = await fetchProductGalleries(id);
    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching product galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch product galleries" },
      { status: 500 }
    );
  }
}
