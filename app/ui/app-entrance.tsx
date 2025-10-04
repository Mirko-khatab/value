"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import VideoLoading from "./video-loading";

export default function AppEntrance() {
  const [showEntrance, setShowEntrance] = useState(true);
  const [hasVisited, setHasVisited] = useState<boolean | null>(null);
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if this is the first visit (only on client side)
    const visited = localStorage.getItem("hasVisited");
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    const isHomepage = pathname === "/";

    setHasVisited(!!visited);

    // Show video loading ONLY if:
    // 1. NOT on homepage OR
    // 2. On homepage but intro has already been seen
    const shouldShowVideo = !isHomepage || !!hasSeenIntro;

    if (shouldShowVideo && !visited) {
      setShouldShow(true);
      localStorage.setItem("hasVisited", "true");
    } else {
      setShouldShow(false);
      setShowEntrance(false);
      if (!visited) {
        localStorage.setItem("hasVisited", "true");
      }
    }
  }, [pathname]);

  if (!showEntrance || !shouldShow) return null;

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
