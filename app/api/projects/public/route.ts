import { NextResponse } from "next/server";
import { fetchProjects, fetchProjectsPaginated } from "@/app/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    // If page is provided, use paginated fetch
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit || "12");
      const result = await fetchProjectsPaginated(pageNum, limitNum);
      return NextResponse.json(result);
    }

    // Legacy support - return all projects
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
