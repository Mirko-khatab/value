"use client";
import { useState, useEffect } from "react";
import BannerDisplay from "./banner-display";
import { Banner } from "@/app/lib/definitions";
import { useLanguage } from "@/app/lib/language-context";

interface BannerPageProps {
  className?: string;
}

export default function BannerPage({ className = "" }: BannerPageProps) {
  const { language } = useLanguage();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/banners");
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        const data = await response.json();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError(err instanceof Error ? err.message : "Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-rotate banners every 8 seconds
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (loading) {
    return (
      <div
        className={`w-full h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center ${className}`}
      >
        <div className="text-gray-500 dark:text-gray-400">
          Loading banners...
        </div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div
        className={`w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-gray-500 dark:text-gray-400 text-center">
          {error || "No banners available"}
        </div>
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <BannerDisplay banner={currentBanner} language={language} />

      {/* Navigation dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Type indicator */}
      <div className="absolute top-4 left-4">
        <div className="px-3 py-1 bg-black bg-opacity-50 rounded-full text-white text-sm">
          {currentBanner.type === "video" ? "🎥 Video" : "🖼️ Image"}
        </div>
      </div>
    </div>
  );
}
