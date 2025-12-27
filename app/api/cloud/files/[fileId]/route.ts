import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

// New API: https://api.mirkokawa.dev/api
const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "https://api.mirkokawa.dev/api";
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ || "";

// Default fallback image path
const FALLBACK_IMAGE_PATH = join(process.cwd(), "public", "image", "2.jpg");

// Enable Next.js caching for this route
export const revalidate = 3600; // Cache for 1 hour

async function getFallbackImage() {
  try {
    const fallbackBuffer = await readFile(FALLBACK_IMAGE_PATH);
    return fallbackBuffer;
  } catch (error) {
    console.error("Failed to read fallback image:", error);
    return null;
  }
}

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

    // Retry logic for rate limiting
    const maxRetries = 2;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Fetch file from cloud storage using the public URL endpoint
        // New format: https://api.mirkokawa.dev/public/{API_KEY}/{FILE_ID}
        const publicUrl = `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${fileId}`;
        const response = await fetch(publicUrl, {
          // Add caching
          next: { revalidate: 3600 }
        });

        if (response.ok) {
          // Get the file data
          const fileBuffer = await response.arrayBuffer();

          // Check if buffer is valid
          if (!fileBuffer || fileBuffer.byteLength === 0) {
            console.warn(`⚠️  Empty or null file buffer for ${fileId}`);
            break; // Exit retry loop and use fallback
          }

          // Forward headers with strong caching
          const contentType =
            response.headers.get("content-type") || "image/jpeg";
          const contentDisposition = response.headers.get("content-disposition");

          const headers: HeadersInit = {
            "Content-Type": contentType,
            // Cache for 1 year - images don't change
            "Cache-Control": "public, max-age=31536000, immutable, stale-while-revalidate=86400",
            // CDN caching
            "CDN-Cache-Control": "public, max-age=31536000, immutable",
          };

          if (contentDisposition) {
            headers["Content-Disposition"] = contentDisposition;
          }

          return new NextResponse(fileBuffer, {
            status: 200,
            headers,
          });
        }

        // Handle specific error cases
        if (response.status === 404) {
          console.warn(`⚠️  File not found: ${fileId}`);
          break; // Exit retry loop and use fallback
        }

        if (response.status === 429) {
          lastError = "Rate limit reached";
          const waitTime = (attempt + 1) * 1; // 1s, 2s
          console.warn(
            `⚠️  Rate limit for ${fileId}. Retry ${attempt + 1}/${maxRetries} after ${waitTime}s...`
          );
          
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            continue;
          }
          // If last retry fails, use fallback
          break;
        }

        // Other errors
        console.warn(
          `⚠️  Cloud storage returned ${response.status} for file ${fileId}`
        );
        lastError = `Service returned ${response.status}`;
        break;
        
      } catch (fetchError) {
        lastError = fetchError;
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
      }
    }

    // If we get here, all retries failed - serve fallback image
    console.warn(`⚠️  All retries failed for ${fileId}, serving fallback image`);
    const fallbackBuffer = await getFallbackImage();
    
    if (fallbackBuffer) {
      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=300", // Cache fallback for 5 minutes only
          "X-Fallback": "true",
        },
      });
    }

    // If even fallback fails, return error
    return NextResponse.json(
      {
        error: "Failed to retrieve image",
        message: lastError instanceof Error ? lastError.message : String(lastError),
      },
      { status: 503 }
    );

  } catch (error) {
    console.error("⚠️  Error in proxy route:", error);
    
    // Try to serve fallback image
    const fallbackBuffer = await getFallbackImage();
    if (fallbackBuffer) {
      return new NextResponse(fallbackBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=300",
          "X-Fallback": "true",
        },
      });
    }

    return NextResponse.json(
      {
        error: "Failed to retrieve image",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
