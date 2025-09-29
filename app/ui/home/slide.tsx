"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string;
}

interface SlideProps {
  mediaItems?: MediaItem[];
  autoPlay?: boolean;
  interval?: number;
}

const defaultMediaItems: MediaItem[] = [
  { type: "image", src: "/image/2.jpg", alt: "Slide 1" },
  { type: "image", src: "/image/barham.jpg", alt: "Slide 2" },
  { type: "video", src: "/video/loading.mp4", alt: "Loading Video" },
  { type: "image", src: "/image/value.png", alt: "Slide 5" },
];

export const Slide: React.FC<SlideProps> = ({
  mediaItems = defaultMediaItems,
  autoPlay = true,
  interval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const goToSlide = (index: number) => setCurrentIndex(index);

  return (
    <div
      className={
        // Responsive height: shorter on phones, full-screen from md+
        "relative w-full h-[60vh] sm:h-[70vh] md:h-screen overflow-hidden"
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
                  style={{
                    filter: "contrast(1.1) saturate(1.1)",
                  }}
                  width={1200}
                  height={1200}
                  loading={isActive ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <video
                  className="w-full h-full object-cover"
                  autoPlay={isActive}
                  muted
                  loop
                  poster={item.poster}
                  preload={isActive ? "auto" : "metadata"}
                  playsInline
                  style={{ filter: "contrast(1.05) saturate(1.05)" }}
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
