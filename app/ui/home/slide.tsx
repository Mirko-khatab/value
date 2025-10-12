"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/app/lib/language-context";

interface Banner {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  image_url: string;
  video_url: string;
  type: "image" | "video";
  is_active: boolean;
  sort_order: number;
}

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  title?: string;
  title_en?: string;
  title_ar?: string;
  title_ku?: string;
}

interface SlideProps {
  autoPlay?: boolean;
  interval?: number;
}

export const Slide: React.FC<SlideProps> = ({
  autoPlay = true,
  interval = 8000,
}) => {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Fetch banners from database
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("/api/banners");
        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }
        const banners: Banner[] = await response.json();

        // Convert banners to media items
        const items: MediaItem[] = banners.map((banner) => ({
          type: banner.type,
          src: banner.type === "video" ? banner.video_url : banner.image_url,
          alt: banner.title_en,
          title: banner.title_en, // Default to English
          title_en: banner.title_en,
          title_ar: banner.title_ar,
          title_ku: banner.title_ku,
        }));

        setMediaItems(items);
      } catch (error) {
        console.error("Error fetching banners:", error);
        // Set empty array if fetch fails
        setMediaItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Get title based on current language
  const getCurrentTitle = (item: MediaItem) => {
    switch (language) {
      case "ku":
        return item.title_ku || item.title_en;
      case "ar":
        return item.title_ar || item.title_en;
      default:
        return item.title_en || item.title;
    }
  };

  const isRTL = language === "ar" || language === "ku";

  useEffect(() => {
    if (autoPlay && mediaItems.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) =>
          prev === mediaItems.length - 1 ? 0 : prev + 1
        );
      }, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, mediaItems.length]);

  // Control video playback based on active slide
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch((error) => {
            console.log("Video play failed:", error);
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const goToSlide = (index: number) => setCurrentIndex(index);

  // Show loading state
  if (loading) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">
          Loading banners...
        </div>
      </div>
    );
  }

  // Show empty state if no banners
  if (mediaItems.length === 0) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          No banners available
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        // Responsive height: shorter on phones, full-screen from md+
        "relative w-full h-screen overflow-hidden"
      }
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {mediaItems.map((item, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`${
                isActive ? "block" : "hidden"
              } duration-700 ease-in-out absolute inset-0`}
            >
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  className="w-full h-full object-cover"
                  alt={item.alt || `Slide ${index + 1}`}
                  fill
                  quality={100}
                  priority={index === 0}
                  sizes="100vw"
                  loading={isActive || index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  poster={item.poster}
                  preload="auto"
                  playsInline
                >
                  <source src={item.src} type="video/mp4" />
                  <source
                    src={item.src.replace(".mp4", ".webm")}
                    type="video/webm"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom gradient overlay for better title visibility */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 sm:h-56 md:h-64 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
        }}
      />

      {/* Side blur overlays — hidden on small screens */}
      <div
        className="hidden md:block absolute top-0 left-0 w-24 lg:w-28 xl:w-32 2xl:w-36 h-full z-10 pointer-events-none transition-all duration-300"
        style={{
          background: "linear-gradient(to right, #596A86, transparent)",
          opacity: 0.9,
          filter: "blur(8px)",
        }}
      />
      <div
        className="hidden md:block absolute top-0 right-0 w-24 lg:w-28 xl:w-32 2xl:w-36 h-full z-10 pointer-events-none transition-all duration-300"
        style={{
          background: "linear-gradient(to left, #596A86, transparent)",
          opacity: 0.9,
          filter: "blur(8px)",
        }}
      />

      {/* Slide Title */}
      {mediaItems[currentIndex] && (
        <div className="absolute z-20 bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 text-center">
          <h2
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg px-4 py-2"
            dir={isRTL ? "rtl" : "ltr"}
            style={{
              fontFamily: isRTL ? "'Arial', 'Tahoma', sans-serif" : "inherit",
            }}
          >
            {getCurrentTitle(mediaItems[currentIndex])}
          </h2>
        </div>
      )}

      {/* Dots */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-4 sm:bottom-6 md:bottom-8 left-1/2 space-x-2 sm:space-x-3 md:space-x-4">
        {mediaItems.map((_, index) => {
          const active = index === currentIndex;
          return (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                active
                  ? "bg-white shadow-lg scale-110"
                  : "bg-white/50 hover:bg-white/70 hover:scale-105"
              }`}
              aria-current={active ? "true" : "false"}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          );
        })}
      </div>
    </div>
  );
};
