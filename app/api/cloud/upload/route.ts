import { NextRequest, NextResponse } from "next/server";
import { uploadFileToCloud } from "@/app/lib/cloud-storage";
import { getPublicFileUrl } from "@/app/lib/cloud-storage-utils";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to cloud storage
    const result = await uploadFileToCloud(buffer, file.name, file.type, {
      uploadedFrom: "web-app",
      uploadedAt: new Date().toISOString(),
    });

    // Generate public URL using the read-only API key
    const publicUrl = getPublicFileUrl(result.id);

    // Return the file ID and public URL
    return NextResponse.json(
      {
        success: true,
        data: {
          id: result.id,
          fileName: result.fileName,
          size: result.size,
          mimeType: result.mimeType,
          uploadedAt: result.uploadedAt,
          publicUrl: publicUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Check if it's a file too large error
    if (
      errorMessage.includes("too large") ||
      errorMessage.includes("413") ||
      errorMessage.includes("Payload Too Large")
    ) {
      console.warn("⚠️  File upload too large");
      return NextResponse.json(
        {
          error: "File too large",
          message:
            "The file you're trying to upload is too large. Maximum upload size is 25MB. Please reduce the file size and try again.",
          canRetry: false,
        },
        { status: 413 }
      );
    }

    // Check if it's a rate limiting error
    if (
      errorMessage.includes("Too many requests") ||
      errorMessage.includes("rate limit")
    ) {
      console.warn("⚠️  Cloud storage rate limit reached during upload");
      return NextResponse.json(
        {
          warning: "Rate limit reached",
          message:
            "Too many upload requests. Please wait a moment and try again.",
          canRetry: true,
        },
        { status: 429 }
      );
    }

    console.warn("⚠️  Upload warning:", error);
    return NextResponse.json(
      {
        warning: "Upload temporarily unavailable",
        message: errorMessage,
        canRetry: true,
      },
      { status: 503 } // Service Unavailable instead of Internal Server Error
    );
  }
}
