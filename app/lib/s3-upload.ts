"use server";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET_NAME, S3_REGION } from "./aws-config";
import { randomUUID } from "crypto";

const CLOUDFRONT_DOMAIN = process.env.CLOUDFRONT_DOMAIN;

export async function getSignedUploadUrl(fileName: string, fileType: string) {
  try {
    const key = `customers/${randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      // Add metadata for better organization
      Metadata: {
        "upload-date": new Date().toISOString(),
        "original-name": fileName,
      },
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Return CloudFront CDN URL instead of direct S3 URL
    return {
      signedUrl,
      key,
      publicUrl: `https://${CLOUDFRONT_DOMAIN}/${key}`,
      fullS3Url: `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}

// Generate signed URL for reading images (solves access denied issue)
export async function getSignedReadUrl(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600 * 24 * 7, // 7 days for reading
    });

    return signedUrl;
  } catch (error) {
    console.error("Error generating read URL:", error);
    throw new Error("Failed to generate read URL");
  }
}

export async function deleteS3Object(key: string) {
  try {
    // Extract S3 key from full URL if needed
    let s3Key = key;

    // If it's a full URL, extract the key part
    if (key.startsWith("http")) {
      try {
        const url = new URL(key);

        // Handle CloudFront URLs (e.g., https://d123.cloudfront.net/customers/uuid-filename.jpg)
        if (url.hostname.includes("cloudfront.net")) {
          // Remove leading slash and get the path
          s3Key = url.pathname.substring(1);
        } else if (url.hostname.includes("s3.amazonaws.com")) {
          // Handle direct S3 URLs
          s3Key = url.pathname.substring(1);
        } else {
          console.error("Unknown URL format:", key);
          return false;
        }
      } catch (urlError) {
        console.error("Invalid URL format:", key, urlError);
        return false;
      }
    }

    const command = new DeleteObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: s3Key,
    });

    const result = await s3Client.send(command);
    return true;
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    return false;
  }
}
