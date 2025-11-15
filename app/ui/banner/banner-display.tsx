"use client";
import Image from "next/image";
import { Banner } from "@/app/lib/definitions";

interface BannerDisplayProps {
  banner: Banner;
  className?: string;
  language?: "en" | "ar" | "ku";
}

export default function BannerDisplay({
  banner,
  className = "",
  language = "en",
}: BannerDisplayProps) {
  // Get the title based on language
  const getTitle = () => {
    switch (language) {
      case "ku":
        return banner.title_ku;
      case "ar":
        return banner.title_ar;
      default:
        return banner.title_en;
    }
  };

  const title = getTitle();
  const isRTL = language === "ar" || language === "ku";
  return (
    <div
      className={`relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg ${className}`}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {banner.type === "video" && banner.video_url ? (
          <video
            src={banner.video_url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : banner.image_url ? (
          <Image
            src={banner.image_url}
            alt={banner.title_en}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-xl">No media available</span>
          </div>
        )}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
        <div className="max-w-4xl mx-auto">
          {/* Banner Title */}
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white"
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              fontFamily: isRTL ? "'Arial', 'Tahoma', sans-serif" : "inherit",
            }}
          >
            {title}
          </h1>
        </div>
      </div>

      {/* Type indicator */}
      <div className="absolute top-4 right-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          {banner.type === "video" ? (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4">
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            banner.is_active
              ? "bg-green-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {banner.is_active ? "Active" : "Inactive"}
        </div>
      </div>
    </div>
  );
}
