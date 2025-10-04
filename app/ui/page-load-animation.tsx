"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import VideoLoading from "./video-loading";

export default function PageLoadAnimation() {
  const [showLoading, setShowLoading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const isHomepage = pathname === "/";
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    // Show loading on page load/reload, but skip homepage if intro hasn't been seen
    if (isHomepage && !hasSeenIntro) {
      // Homepage first visit - intro will show instead
      setShowLoading(false);
      setIsFirstRender(false);
    } else if (isFirstRender) {
      // Any other page or homepage after intro - show video loading
      setShowLoading(true);
      setIsFirstRender(false);
    }
  }, [pathname, isFirstRender]);

  const handleComplete = () => {
    setShowLoading(false);
  };

  if (!showLoading) return null;

  return (
    <VideoLoading
      onComplete={handleComplete}
      autoHide={true}
      hideDelay={2000}
      className="z-[10000]"
    />
  );
}
