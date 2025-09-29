"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/app/lib/theme-context";

interface VideoLoadingProps {
  onComplete?: () => void;
  autoHide?: boolean;
  hideDelay?: number;
  className?: string;
}

export default function VideoLoading({
  onComplete,
  autoHide = true,
  hideDelay = 2000,
  className = "",
}: VideoLoadingProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(true); // Start with true to show video immediately
  const videoRef = useRef<HTMLVideoElement>(null);
  const { theme, colors } = useTheme();

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, hideDelay, onComplete]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoCanPlay = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    // Still show the video area even if there's an error
    setIsVideoLoaded(true);
  };

  const handleVideoEnd = () => {
    if (autoHide) {
      setIsVisible(false);
      onComplete?.();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`video-loading-container fixed inset-0 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        backgroundColor: "#000000",
        transition: "background-color 0.3s ease, opacity 0.5s ease",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Full page background overlay to ensure consistency */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundColor: "#000000",
        }}
      />
      {/* Video Container with black background */}
      <div
        className="relative w-full flex items-center justify-center"
        style={{
          backgroundColor: "#000000",
          height: "100vh",
          minHeight: "100vh",
        }}
      >
        {/* Black background overlay behind video */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: "#000000",
          }}
        />

        {/* Black background for video */}
        <div
          className="absolute inset-0 z-5"
          style={{
            backgroundColor: "#000000",
          }}
        />

        {/* Video wrapper for perfect centering */}
        <div className="flex items-center justify-center w-full h-screen">
          <video
            ref={videoRef}
            className="video-loading-video relative z-10 w-4/5 h-auto sm:w-4/5 sm:h-4/5 md:w-3/4 md:h-3/4 lg:w-2/3 lg:h-2/3 xl:w-1/2 xl:h-1/2 object-contain"
            style={{
              opacity: 1,
              maxWidth: "80%",
              maxHeight: "80%",
              display: "block",
            }}
            autoPlay
            muted
            loop={!autoHide}
            playsInline
            onLoadedData={handleVideoLoad}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
            onEnded={handleVideoEnd}
            preload="auto"
          >
            <source src="/video/loading.webm" type="video/webm" />
            <source src="/video/loading.mp4" type="video/mp4" />
            <source src="/video/loading.MOV" type="video/quicktime" />
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-center">
                <div className="loading-spinner rounded-full h-16 w-16 border-b-2 border-primary dark:border-tertiary mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  Loading...
                </p>
              </div>
            </div>
          </video>
        </div>

        {/* Only show loading overlay if video fails to load (which shouldn't happen now) */}
        {!isVideoLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
              backgroundColor: "#000000",
            }}
          >
            <div className="text-center">
              <div
                className="loading-spinner rounded-full h-16 w-16 border-b-2 mx-auto mb-4"
                style={{
                  borderBottomColor: colors.primary,
                }}
              ></div>
              <p
                className="text-lg font-medium"
                style={{
                  color: colors.text,
                }}
              >
                Loading video...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook for managing global loading state
export function useVideoLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
}
