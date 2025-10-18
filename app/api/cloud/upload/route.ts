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
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
