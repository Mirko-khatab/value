"use client";

import { useState, useEffect } from "react";
import AcmeLogo from "@/app/ui/value-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import Image from "next/image";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import Text from "@/app/ui/text";
import CustomCard from "./ui/home/custom-card";
import Quote from "./ui/home/quote";
import { Space } from "./ui/utils/space";
import { Card } from "./ui/home/card";
import { Slide } from "./ui/home/slide";
import Intro from "@/app/ui/intro";
import QuoteGallery from "./ui/home/quote-gallery";
import { QouteData } from "./ui/home/qoute-data";
import VideoLoading from "@/app/ui/video-loading";
import TechNotificationBar from "@/app/ui/tech-notification-bar";
import TechHeroSection from "@/app/ui/tech-hero-section";
import { 
  getOrganizationStructuredData, 
  getWebsiteStructuredData, 
  getProfessionalServiceStructuredData 
} from "./page-metadata";

export default function Page() {
  const [showIntro, setShowIntro] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [userClicked, setUserClicked] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before (stored permanently)
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");

    if (
      !hasSeenIntro ||
      hasSeenIntro === "null" ||
      hasSeenIntro === "undefined"
    ) {
      setShowLoading(true);
      setShowIntro(true);
    } else {
    }
  }, []);

  const handleLoadingComplete = () => {
    // Try to start intro automatically
    setUserClicked(true); // Pretend user clicked
    setShowLoading(false);
    setLoadingComplete(false); // Don't show touch indicator
  };

  const forceReset = () => {
    localStorage.removeItem("hasSeenIntro");
    setShowIntro(true);
    setShowLoading(true);
    setLoadingComplete(false);
    setUserClicked(false);
  };

  const handleTouchClick = () => {
    // User clicked, now we can start audio with sound!
    setUserClicked(true);
    setLoadingComplete(false);
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getOrganizationStructuredData()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getWebsiteStructuredData()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getProfessionalServiceStructuredData()),
        }}
      />

      {/* TOP NOTIFICATION BAR - Always visible at top */}
      <TechNotificationBar />

      {/* Show loading video */}
      {showLoading && (
        <div className="fixed inset-0 z-[60] bg-black">
          <VideoLoading autoHide={true} onComplete={handleLoadingComplete} />
        </div>
      )}

      {/* After loading completes, show beautiful touch indicator */}
      {loadingComplete && !userClicked && (
        <div
          onClick={handleTouchClick}
          className="fixed inset-0 z-[60] cursor-pointer  flex items-center justify-center"
          title="Tap anywhere"
        >
          {/* Beautiful touch indicator animation */}
          <div className="relative">
            {/* Center glowing dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.8)]"></div>
            </div>

            {/* Elegant expanding rings */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-24 h-24 rounded-full border-2 border-white/60 animate-ping"
                style={{ animationDuration: "2s" }}
              ></div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-40 h-40 rounded-full border-2 border-white/40 animate-ping"
                style={{ animationDuration: "2.5s", animationDelay: "0.3s" }}
              ></div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-56 h-56 rounded-full border-2 border-white/20 animate-ping"
                style={{ animationDuration: "3s", animationDelay: "0.6s" }}
              ></div>
            </div>

            {/* Subtle rotating ring for extra elegance */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-32 h-32 rounded-full border-2 border-dashed border-white/30 animate-spin"
                style={{ animationDuration: "8s" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Start intro only after user clicks */}
      {showIntro && userClicked && <Intro onComplete={handleIntroComplete} />}

      <div
        className={`transition-all duration-1000 ease-out ${
          showIntro
            ? "opacity-0 translate-y-12 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{ transitionDelay: showIntro ? "0ms" : "300ms" }}
      >
        {/* Hero Section - Full Screen at Top */}
        <ShowcaseLayout>
          <Slide />
        </ShowcaseLayout>

        {/* PROMINENT VALUE TECH HERO SECTION - Impossible to miss! */}
        <TechHeroSection />
      </div>
    </>
  );
}
