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

    if (!visited) {
      // Mark as visited for first-time users
      localStorage.setItem("hasVisited", "true");
    }

    // Let VideoLoading component control when to hide via onComplete callback
    // No timers here!
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
