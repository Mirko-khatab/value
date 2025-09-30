"use client";

import { useEffect, useState } from "react";
import VideoLoading from "./video-loading";

export default function AppEntrance() {
  const [showEntrance, setShowEntrance] = useState(true);
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if this is the first visit (only on client side)
    const visited = localStorage.getItem("hasVisited");
    setHasVisited(!!visited);

    if (visited) {
      // If user has visited before, show shorter loading
      const timer = setTimeout(() => {
        setShowEntrance(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // First visit - show full video loading
      const timer = setTimeout(() => {
        setShowEntrance(false);
        localStorage.setItem("hasVisited", "true");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Development reset function
  const resetEntrance = () => {
    setShowEntrance(true);
    setHasVisited(false);
    localStorage.removeItem("hasVisited");
  };

  if (!showEntrance) return null;

  return (
    <>
      <VideoLoading
        onComplete={() => setShowEntrance(false)}
        autoHide={true}
        hideDelay={hasVisited ? 2000 : 4000}
      />
    </>
  );
}
