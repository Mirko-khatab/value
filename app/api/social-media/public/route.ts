import { NextResponse } from "next/server";
import { fetchSocialMedia } from "@/app/lib/data";

export async function GET() {
  try {
    const socialMedia = await fetchSocialMedia();
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Failed to fetch social media:", error);
    return NextResponse.json(
      { error: "Failed to fetch social media" },
      { status: 500 }
    );
  }
}
