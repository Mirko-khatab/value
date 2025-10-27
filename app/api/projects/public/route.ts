import { NextResponse } from "next/server";
import { fetchProjects } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const projects = await fetchProjects();

    if (limit) {
      const limitedProjects = projects.slice(0, parseInt(limit));
      return NextResponse.json(limitedProjects);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
