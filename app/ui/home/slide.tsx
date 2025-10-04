"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
  title?: string;
}

interface SlideProps {
  mediaItems?: MediaItem[];
  autoPlay?: boolean;
  interval?: number;
}

const defaultMediaItems: MediaItem[] = [
  { type: "image", src: "/image/2.jpg", title: "Slide 1", alt: "Slide 1" },

  {
    type: "video",
    src: "/video/1.mp4",
    title: " Video",
    alt: " Video",
  },
  {
    type: "video",
    src: "/video/2.mp4",
    title: " Video",
    alt: " Video",
  },
];

export const Slide: React.FC<SlideProps> = ({
  mediaItems = defaultMediaItems,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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
      {mediaItems[currentIndex]?.title && (
        <div className="absolute z-20 bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg px-4 py-2">
            {mediaItems[currentIndex].title}
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
