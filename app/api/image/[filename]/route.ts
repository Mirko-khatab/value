import { NextRequest, NextResponse } from "next/server";

const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "https://cloud.mirkokawa.dev/api";
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // For legacy support, try to fetch from cloud storage
    // This endpoint is used for backwards compatibility with old image URLs
    // Format: /api/image/customers/filename.jpg

    // Extract just the filename without path
    const cleanFilename = filename.split("/").pop() || filename;

    // Try to fetch from cloud storage using the public API
    // Note: This assumes the file exists in your cloud storage
    // You may need to implement a mapping from old filenames to new file IDs

    const publicUrl = `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${cleanFilename}`;
    const response = await fetch(publicUrl);

    if (!response.ok) {
      // If not found in cloud storage, return 404
      return new NextResponse("Image not found", { status: 404 });
    }

    // Get the image data
    const buffer = await response.arrayBuffer();

    // Forward the content type from cloud storage
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
