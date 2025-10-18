import { S3Client } from "@aws-sdk/client-s3";

// AWS S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
export const S3_REGION = process.env.AWS_REGION || "us-east-1";

// Image upload configuration
export const IMAGE_CONFIG = {
  maxSizeMB: 5, // Maximum file size in MB
  maxWidthOrHeight: 1920, // Max width or height in pixels
  useWebWorker: true,
  quality: 0.8, // Compression quality (0-1)
  fileType: "image/jpeg" as const,
};


