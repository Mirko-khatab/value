"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageSkeleton } from "./skeleton-loader";

interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  onClick?: () => void;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

/**
 * Optimized Image Component with:
 * - Skeleton loader while loading
 * - Blur placeholder
 * - Error handling with fallback
 * - Progressive loading
 * - Automatic quality optimization
 */
export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  priority = false,
  className = "",
  sizes,
  quality = 75,
  onClick,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Fallback image for errors
  const fallbackImage = "/image/2.jpg";

  // Generate blur data URL for instant placeholder
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#e5e7eb"/>
      <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
    </svg>`
  ).toString("base64")}`;

  return (
    <div className={`relative ${fill ? "w-full h-full" : ""}`} onClick={onClick}>
      {/* Skeleton loader while image is loading */}
      {isLoading && !hasError && (
        <ImageSkeleton
          className={fill ? "absolute inset-0" : `w-[${width}px] h-[${height}px]`}
        />
      )}

      {/* Next.js optimized image */}
      <Image
        src={hasError ? fallbackImage : src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        quality={quality}
        sizes={
          sizes ||
          (fill
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            : undefined)
        }
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500 ease-in-out ${
          objectFit === "cover"
            ? "object-cover"
            : objectFit === "contain"
            ? "object-contain"
            : objectFit === "fill"
            ? "object-fill"
            : objectFit === "none"
            ? "object-none"
            : "object-scale-down"
        }`}
        placeholder="blur"
        blurDataURL={blurDataURL}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        loading={priority ? "eager" : "lazy"}
      />

      {/* Error indicator (optional) */}
      {hasError && (
        <div className="absolute top-2 left-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded">
          Fallback Image
        </div>
      )}
    </div>
  );
}
