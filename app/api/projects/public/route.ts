import { NextResponse } from "next/server";
import { fetchProjects } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const limit = searchParams.get("limit");

    const projects = await fetchProjects();

    // Apply limit if specified
    const result = limit ? projects.slice(0, parseInt(limit)) : projects;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching public projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
