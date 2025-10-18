import { NextRequest, NextResponse } from "next/server";
import { deleteCloudFile } from "@/app/lib/cloud-storage";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Delete the image from cloud storage
    const deleteResult = await deleteCloudFile(imageUrl);

    if (deleteResult) {
      return NextResponse.json(
        {
          message: "Image deleted successfully",
          deletedUrl: imageUrl,
          success: true,
        },
        { status: 200 }
      );
    } else {
      console.error(`API: Failed to delete image: ${imageUrl}`);
      return NextResponse.json(
        {
          error: "Failed to delete image from cloud storage",
          imageUrl: imageUrl,
          success: false,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API: Error in delete-image endpoint:", error);
    return NextResponse.json(
      {
        error: "Internal server error during image deletion",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
