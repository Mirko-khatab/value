"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";

interface Language {
  text: string;
  dir: "ltr" | "rtl";
  name: string;
}

interface IntroProps {
  onComplete?: () => void;
}

export default function Intro({ onComplete }: IntroProps) {
  const [currentSketch, setCurrentSketch] = useState(0);
  const [showSlogan, setShowSlogan] = useState(true); // Show immediately
  const [fadeOut, setFadeOut] = useState(false);
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasUnmutedRef = useRef(false);

  const languages: Language[] = [
    { text: "We value your work", dir: "ltr", name: "English" },
    { text: "بەها ئەدەین بەکارەکانتان", dir: "rtl", name: "کوردی" },
    { text: "نحن نقدر عملك", dir: "rtl", name: "العربية" },
  ];

  const totalSketches = 12;
  const sketchDuration = 600; // ms per sketch (slower to see each sketch better)
  const sloganDuration = 2200; // ms to show each language (slower to read comfortably)
  const totalDuration = totalSketches * sketchDuration; // Total time for all sketches

  // Fetch and play audio immediately and more aggressively
  useEffect(() => {
    const fetchAndPlayAudio = async () => {
      try {
        console.log("🎵 Fetching intro audio...");
        const response = await fetch("/api/audios?use_for=intro");

        if (response.ok) {
          const data = await response.json();
          console.log("📦 Audio data:", data);

          if (data && data.length > 0 && data[0].audio_url) {
            setAudioUrl(data[0].audio_url);

            // Very short delay
            await new Promise((resolve) => setTimeout(resolve, 50));

            if (audioRef.current) {
              audioRef.current.src = data[0].audio_url;
              audioRef.current.loop = true;
              audioRef.current.preload = "auto";
              audioRef.current.load();

              // Try to play immediately AND when ready
              const attemptPlay = async () => {
                if (!audioRef.current) return;

                console.log("🎵 Attempting to play intro audio...");

                try {
                  // Try playing with sound first
                  await audioRef.current.play();
                  console.log("✅ Intro audio playing with sound!");
                } catch (error) {
                  console.log("❌ Intro audio blocked, trying muted...", error);

                  // If blocked, try muted
                  try {
                    audioRef.current.muted = true;
                    setIsMuted(true);
                    await audioRef.current.play();
                    console.log(
                      "✅ Intro audio playing muted - click to unmute"
                    );
                    setShowUnmuteHint(true);
                    setTimeout(() => setShowUnmuteHint(false), 5000);
                  } catch (mutedError) {
                    console.log("❌ Even muted playback blocked:", mutedError);
                  }
                }
              };

              // Try multiple times to maximize chances
              attemptPlay(); // Try immediately

              audioRef.current.addEventListener("loadeddata", attemptPlay, {
                once: true,
              });
              audioRef.current.addEventListener("canplay", attemptPlay, {
                once: true,
              });
              audioRef.current.addEventListener("canplaythrough", attemptPlay, {
                once: true,
              });
            }
          } else {
            console.log("⚠️ No audio found in database");
          }
        } else {
          console.log("⚠️ API error");
        }
      } catch (error) {
        console.error("❌ Failed to fetch intro audio:", error);
      }
    };

    fetchAndPlayAudio();
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setShowUnmuteHint(false);
    }
  };

  // Handle click anywhere to unmute audio
  const handleIntroClick = () => {
    if (isMuted && audioRef.current && !hasUnmutedRef.current) {
      audioRef.current.muted = false;
      setIsMuted(false);
      setShowUnmuteHint(false);
      hasUnmutedRef.current = true;
      console.log("Audio unmuted on user interaction");
    }
  };

  // Cycle through sketches - start immediately
  useEffect(() => {
    if (currentSketch < totalSketches) {
      const timer = setTimeout(() => {
        setCurrentSketch((prev) => prev + 1);
      }, sketchDuration);
      return () => clearTimeout(timer);
    }
  }, [currentSketch]);

  // Cycle through languages
  useEffect(() => {
    if (showSlogan && !fadeOut) {
      if (currentLangIndex < languages.length - 1) {
        const timer = setTimeout(() => {
          setCurrentLangIndex((prev) => prev + 1);
        }, sloganDuration);
        return () => clearTimeout(timer);
      } else {
        // After all languages, wait a bit then fade out
        const fadeTimer = setTimeout(() => {
          setFadeOut(true);
        }, sloganDuration);
        return () => clearTimeout(fadeTimer);
      }
    }
  }, [showSlogan, currentLangIndex, fadeOut, languages.length]);

  // Complete intro after fade out
  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, onComplete]);

  return (
    <>
      {/* Hidden audio element - always render so ref is available */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        style={{ display: "none" }}
      />

      {/* Show intro immediately */}
      <>
        {/* Unmute hint - shows when audio is muted */}
        {showUnmuteHint && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2">
              <SpeakerWaveIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                Click anywhere for sound
              </span>
            </div>
          </div>
        )}

        {/* Mute button for intro audio */}
        {audioUrl && (
          <button
            onClick={toggleMute}
            className="fixed bottom-6 right-6 z-[60] p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:scale-110 group"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-6 h-6 text-red-500 group-hover:text-red-600" />
            ) : (
              <SpeakerWaveIcon className="w-6 h-6 text-blue-500 group-hover:text-blue-600" />
            )}
          </button>
        )}

        <div
          onClick={handleIntroClick}
          className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-[1200ms] ${
            fadeOut
              ? "opacity-0 -translate-y-full scale-90"
              : "opacity-100 translate-y-0 scale-100"
          }`}
          style={{
            backgroundColor: "#2E5A7A",
            transitionTimingFunction: fadeOut
              ? "cubic-bezier(0.4, 0, 1, 1)"
              : "ease-out",
          }}
        >
          {/* Sketch Animation Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Animated Sketches Grid */}
            <div className="absolute inset-0 grid grid-cols-4 gap-4 p-8 opacity-20">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-500 ${
                    index <= currentSketch
                      ? "opacity-100 scale-100 blur-0"
                      : "opacity-0 scale-95 blur-sm"
                  }`}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={`/sketch/${index + 1}.png`}
                      alt={`Sketch ${index + 1}`}
                      fill
                      className="object-contain"
                      priority={index < 4}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Center Focal Point - Everything shows together */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-12">
              {/* Current Sketch Spotlight - Always visible */}
              {currentSketch > 0 && currentSketch <= totalSketches && (
                <div className="relative w-48 h-48 md:w-64 md:h-64 transition-all duration-500 opacity-100 scale-100">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full animate-pulse" />
                  <div className="relative w-full h-full p-6">
                    <Image
                      src={`/sketch/${currentSketch}.png`}
                      alt={`Main Sketch ${currentSketch}`}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Multi-Language Slogan - Shows immediately with sketches */}
              <div className="text-center">
                {/* Slogan Text with Language Transitions - NO language label */}
                <div className="relative min-h-[100px] md:min-h-[120px] flex items-center justify-center mb-8">
                  <h1
                    key={`text-${currentLangIndex}`}
                    className={`text-3xl md:text-5xl lg:text-6xl font-bold text-white animate-slide-up px-4 ${
                      languages[currentLangIndex].dir === "rtl"
                        ? "font-arabic"
                        : ""
                    }`}
                    dir={languages[currentLangIndex].dir}
                    style={{
                      fontFamily:
                        languages[currentLangIndex].dir === "rtl"
                          ? "'Arial', 'Tahoma', sans-serif"
                          : "inherit",
                    }}
                  >
                    {languages[currentLangIndex].text}
                  </h1>
                </div>

                {/* Logo at the bottom */}
                <div className="flex justify-center animate-logo-appear">
                  <div className="relative w-20 h-20 md:w-28 md:h-28">
                    <Image
                      src="/image/value.png"
                      alt="Value Logo"
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </div>

                {/* Language Progress Dots */}
                <div className="flex gap-3 justify-center mt-8">
                  {languages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentLangIndex
                          ? "w-8 bg-white shadow-lg shadow-white/50"
                          : index < currentLangIndex
                          ? "w-2 bg-white/60"
                          : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Sketch Elements for Extra Polish */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[3, 7, 11].map((sketchNum, index) => (
                <div
                  key={sketchNum}
                  className={`absolute transition-all duration-1000 ${
                    currentSketch >= sketchNum ? "opacity-30" : "opacity-0"
                  }`}
                  style={{
                    top: `${20 + index * 30}%`,
                    left: index % 2 === 0 ? "5%" : "auto",
                    right: index % 2 === 1 ? "5%" : "auto",
                    width: "120px",
                    height: "120px",
                    animation: `float-${index + 1} ${
                      6 + index * 2
                    }s ease-in-out infinite`,
                  }}
                >
                  <Image
                    src={`/sketch/${sketchNum}.png`}
                    alt=""
                    fill
                    className="object-contain opacity-50 blur-[1px]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add custom animations */}
          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes slide-up {
              from {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes logo-appear {
              0% {
                opacity: 0;
                transform: scale(0.5) rotate(-10deg);
              }
              60% {
                transform: scale(1.1) rotate(2deg);
              }
              100% {
                opacity: 1;
                transform: scale(1) rotate(0deg);
              }
            }

            @keyframes float-1 {
              0%,
              100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-20px) rotate(5deg);
              }
            }

            @keyframes float-2 {
              0%,
              100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-30px) rotate(-5deg);
              }
            }

            @keyframes float-3 {
              0%,
              100% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-25px) rotate(3deg);
              }
            }

            .animate-fade-in {
              animation: fade-in 0.6s ease-out;
            }

            .animate-slide-up {
              animation: slide-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .animate-logo-appear {
              animation: logo-appear 1s cubic-bezier(0.34, 1.56, 0.64, 1);
            }

            .font-arabic {
              letter-spacing: 0.05em;
            }
          `}</style>
        </div>
      </>
    </>
  );
}
