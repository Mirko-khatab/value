import { NextRequest, NextResponse } from "next/server";
import { deleteS3Object } from "@/app/lib/s3-upload";

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }


    // Delete the image from S3
    const deleteResult = await deleteS3Object(imageUrl);

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
          error: "Failed to delete image from S3",
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
