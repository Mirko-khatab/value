import { NextResponse } from "next/server";
import { fetchProjectCategories } from "@/app/lib/data";

export async function GET() {
  try {
    const categories = await fetchProjectCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching project categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch project categories" },
      { status: 500 }
    );
  }
}
