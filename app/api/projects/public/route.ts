import { NextResponse } from "next/server";
import { fetchPublicProjects } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;

    const projects = await fetchPublicProjects({
      search,
      location,
      category,
      status,
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching public projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
