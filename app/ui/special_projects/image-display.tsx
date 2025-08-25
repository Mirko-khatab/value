"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getSignedReadUrl } from "@/app/lib/s3-upload";

interface ImageDisplayProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageDisplay({
  src,
  alt,
  width = 200,
  height = 200,
  className = "",
}: ImageDisplayProps) {
  const [signedUrl, setSignedUrl] = useState<string>("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract the key from the S3 URL
    const extractKey = (url: string) => {
      try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");
        // Remove the first empty element and get the rest
        return pathParts.slice(1).join("/");
      } catch {
        return null;
      }
    };

    const key = extractKey(src);
    if (key) {
      // Generate signed URL for secure access
      getSignedReadUrl(key)
        .then((url) => {
          setSignedUrl(url);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to generate signed URL:", err);
          setError(true);
          setLoading(false);
        });
    } else {
      setError(true);
      setLoading(false);
    }
  }, [src]);

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  if (error) {
    return (
      <div
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  if (loading || !signedUrl) {
    return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={signedUrl}
        alt={alt}
        width={width}
        height={height}
        className="transition-opacity duration-300"
        onError={handleImageError}
        onLoad={handleImageLoad}
        // Enable Next.js image optimization
        unoptimized={false}
        // Add placeholder for better UX
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}
