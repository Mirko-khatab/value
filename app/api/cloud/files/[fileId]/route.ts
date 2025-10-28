import { NextRequest, NextResponse } from "next/server";

const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "https://cloud.mirkokawa.dev/api";
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ || "";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Fetch file from cloud storage using the public URL endpoint
    // Format: https://cloud.mirkokawa.dev/api/public/{PUBLIC_KEY}/{FILE_ID}
    const publicUrl = `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${fileId}`;
    const response = await fetch(publicUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      if (response.status === 429) {
        console.warn(
          `⚠️  Cloud storage rate limit reached for file ${fileId}. Falling back to default image.`
        );
        return NextResponse.json(
          {
            warning: "Rate limit reached",
            message: "Too many requests, please try again later",
          },
          { status: 429 }
        );
      }
      console.warn(
        `⚠️  Cloud storage returned ${response.status} for file ${fileId}`
      );
      return NextResponse.json(
        {
          warning: "Cloud storage unavailable",
          message: `Service returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    // Get the file data
    const fileBuffer = await response.arrayBuffer();

    // Check if buffer is valid (prevent Next.js Image Optimization crash)
    if (!fileBuffer || fileBuffer.byteLength === 0) {
      console.warn(`⚠️  Empty or null file buffer for ${fileId}`);
      return NextResponse.json(
        { error: "File is empty or corrupted" },
        { status: 404 }
      );
    }

    // Forward headers
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition = response.headers.get("content-disposition");

    const headers: HeadersInit = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (contentDisposition) {
      headers["Content-Disposition"] = contentDisposition;
    }

    // Return the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.warn("⚠️  Warning proxying file:", error);
    return NextResponse.json(
      {
        warning: "Failed to retrieve file",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 } // Service Unavailable instead of Internal Server Error
    );
  }
}
