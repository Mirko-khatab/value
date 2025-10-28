"use client";

import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  StopIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface GlobalAudioPlayerProps {
  className?: string;
}

export default function GlobalAudioPlayer({
  className = "",
}: GlobalAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const pathname = usePathname();

  // Check if current page should have music
  const shouldShowMusic = () => {
    // Exclude dashboard pages
    if (pathname.startsWith("/dashboard")) {
      return false;
    }

    // Exclude intro-related pages
    if (pathname.includes("intro-preview")) {
      return false;
    }

    // Check if intro is currently showing on main page
    if (pathname === "/") {
      const hasSeenIntro = localStorage.getItem("hasSeenIntro");
      if (
        !hasSeenIntro ||
        hasSeenIntro === "null" ||
        hasSeenIntro === "undefined"
      ) {
        // Intro will be shown, so don't show global music
        return false;
      }
      // If user has seen intro and is on homepage, show music
      return true;
    }

    // Include all other pages (projects, products, etc.)
    return true;
  };

  // Update player visibility based on current route
  useEffect(() => {
    const shouldShow = shouldShowMusic();
    setShowPlayer(shouldShow);

    // If we shouldn't show music on this page, pause any playing audio
    if (!shouldShow && audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [pathname, isPlaying]);

  // Listen for localStorage changes to detect when intro completes
  useEffect(() => {
    const handleStorageChange = () => {
      const shouldShow = shouldShowMusic();
      setShowPlayer(shouldShow);
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for same-tab localStorage changes
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [pathname]);

  // Fetch audio URL from API
  useEffect(() => {
    if (!showPlayer) return;

    const fetchAudio = async () => {
      try {
        let audioUrl = "/music/intro.mp3"; // Default fallback to static file

        // Try to fetch from API first
        const response = await fetch(`/api/audios?use_for=landing`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0 && data[0].audio_url) {
            audioUrl = data[0].audio_url;
          }
        }

        // Always set audio URL (either from API or fallback)
        setAudioUrl(audioUrl);
      } catch (error) {
        console.error("Failed to fetch audio, using fallback:", error);
        // Use fallback on error
        setAudioUrl("/music/intro.mp3");
      }
    };

    fetchAudio();
  }, [showPlayer]);

  // Initialize audio element and auto-play
  useEffect(() => {
    if (!showPlayer || !audioUrl || !audioRef.current) return;

    audioRef.current.src = audioUrl;
    audioRef.current.loop = true; // Enable looping
    audioRef.current.preload = "auto"; // Preload the audio file
    audioRef.current.volume = 0.7; // Set volume

    // Load the audio immediately
    audioRef.current.load();

    // Try to auto-play as soon as possible
    const attemptPlay = async () => {
      if (!audioRef.current) return;

      try {
        // First try unmuted play
        audioRef.current.muted = false;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (error) {
        // If unmuted fails, try muted autoplay
        try {
          audioRef.current.muted = true;
          setIsMuted(true);
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (mutedError) {
          setIsPlaying(false);
        }
      }
    };

    // Try to play immediately
    attemptPlay();

    // Also try when the audio can play through (is loaded enough)
    const handleCanPlayThrough = () => attemptPlay();
    audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough, {
      once: true,
    });

    // Try again after a short delay
    const retryTimeout = setTimeout(() => {
      if (audioRef.current && audioRef.current.paused) {
        attemptPlay();
      }
    }, 1000);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
      }
      clearTimeout(retryTimeout);
    };
  }, [showPlayer, audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Stop and reset to beginning
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Don't show controls if no audio, error, or shouldn't show on this page
  if (!showPlayer || !audioUrl || hasError) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[60] flex gap-1.5 sm:gap-2 ${className}`}
    >
      <audio ref={audioRef} preload="auto" playsInline />

      {/* Mute/Unmute Button */}
      <button
        onClick={toggleMute}
        className="p-1.5 sm:p-3 rounded-full bg-white dark:bg-gray-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 active:scale-95 sm:hover:scale-110 group"
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        title={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 group-hover:text-red-600" />
        ) : (
          <SpeakerWaveIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500 group-hover:text-blue-600" />
        )}
      </button>

      {/* Play/Stop Button */}
      <button
        onClick={togglePlay}
        className="p-1.5 sm:p-3 rounded-full bg-white dark:bg-gray-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 active:scale-95 sm:hover:scale-110 group"
        aria-label={isPlaying ? "Stop audio" : "Play audio"}
        title={isPlaying ? "Stop audio" : "Play audio"}
      >
        {isPlaying ? (
          <StopIcon className="w-4 h-4 sm:w-6 sm:h-6 text-orange-500 group-hover:text-orange-600" />
        ) : (
          <PlayIcon className="w-4 h-4 sm:w-6 sm:h-6 text-green-500 group-hover:text-green-600" />
        )}
      </button>
    </div>
  );
}
