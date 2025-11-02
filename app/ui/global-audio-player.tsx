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
  const [isPlaying, setIsPlaying] = useState(true); // Default to playing
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const pathname = usePathname();
  const playAttemptCountRef = useRef(0);
  const maxPlayAttempts = 10;
  const userPrefKey = "audioPreference"; // 'autoplay' | 'muted' | 'stopped'

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

  // Load and persist user audio preference
  useEffect(() => {
    try {
      const pref = localStorage.getItem(userPrefKey);
      if (pref === "stopped") {
        setIsPlaying(false);
      }
      if (pref === "muted") {
        setIsMuted(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const pref = isPlaying ? (isMuted ? "muted" : "autoplay") : "stopped";
      localStorage.setItem(userPrefKey, pref);
    } catch {}
  }, [isPlaying, isMuted]);

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

  // Initialize audio element and AGGRESSIVELY auto-play (respecting user intent)
  useEffect(() => {
    if (!showPlayer || !audioUrl || !audioRef.current) return;

    audioRef.current.src = audioUrl;
    audioRef.current.loop = true; // Enable looping
    audioRef.current.preload = "auto"; // Preload the audio file
    audioRef.current.volume = 0.7; // Set volume

    // Load the audio immediately
    audioRef.current.load();

    // Reset play attempt counter
    playAttemptCountRef.current = 0;

    // Aggressive auto-play function with multiple strategies
    const attemptPlay = async () => {
      if (!audioRef.current) return;

      // Respect user preference
      const pref = typeof window !== "undefined" ? localStorage.getItem(userPrefKey) : null;
      if (pref === "stopped") {
        // Do not auto-start if user stopped
        return;
      }

      playAttemptCountRef.current++;

      try {
        // If user prefers muted, keep muted; otherwise try unmuted
        const preferMuted = pref === "muted";
        audioRef.current.muted = preferMuted ? true : false;
        await audioRef.current.play();
        setIsPlaying(true);
        setIsMuted(audioRef.current.muted);
        console.log("✅ Music autoplaying" + (audioRef.current.muted ? " (muted by preference)" : ""));
      } catch (error) {
        // If unmuted fails, try muted autoplay
        try {
          audioRef.current.muted = true;
          setIsMuted(true);
          await audioRef.current.play();
          setIsPlaying(true);
          console.log("✅ Music autoplaying (muted)");
        } catch (mutedError) {
          console.log("⚠️ Autoplay failed, will retry...");
          setIsPlaying(false);

          // Keep retrying if we haven't hit max attempts
          if (playAttemptCountRef.current < maxPlayAttempts) {
            setTimeout(attemptPlay, 500);
          }
        }
      }
    };

    // Try to play immediately
    attemptPlay();

    // Also try when the audio can play through (is loaded enough)
    const handleCanPlayThrough = () => {
      console.log("🎵 Audio can play through, attempting play...");
      attemptPlay();
    };
    audioRef.current.addEventListener("canplaythrough", handleCanPlayThrough);

    // Try again when page becomes visible
    const handleVisibilityChange = () => {
      const pref = typeof window !== "undefined" ? localStorage.getItem(userPrefKey) : null;
      if (pref === "stopped") return; // Respect stop
      if (document.visibilityState === "visible" && audioRef.current?.paused) {
        console.log("👁️ Page visible, attempting play...");
        attemptPlay();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Try on any user interaction (click, touch, keypress)
    const handleUserInteraction = () => {
      const pref = typeof window !== "undefined" ? localStorage.getItem(userPrefKey) : null;
      if (pref === "stopped") return; // Don't override stop on interaction
      if (audioRef.current?.paused) {
        console.log("👆 User interaction detected, attempting play...");
        attemptPlay();
      }
    };
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, { once: true });
    document.addEventListener("keydown", handleUserInteraction, { once: true });

    // Aggressive retry loop
    const retryInterval = setInterval(() => {
      const pref = typeof window !== "undefined" ? localStorage.getItem(userPrefKey) : null;
      if (pref === "stopped") {
        clearInterval(retryInterval);
        return;
      }
      if (audioRef.current && audioRef.current.paused && playAttemptCountRef.current < maxPlayAttempts) {
        console.log(`🔄 Retry attempt ${playAttemptCountRef.current}/${maxPlayAttempts}...`);
        attemptPlay();
      } else if (playAttemptCountRef.current >= maxPlayAttempts) {
        clearInterval(retryInterval);
      }
    }, 1000);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("canplaythrough", handleCanPlayThrough);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      clearInterval(retryInterval);
    };
  }, [showPlayer, audioUrl]);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        try { localStorage.setItem(userPrefKey, "stopped"); } catch {}
        console.log("⏸️ Music paused by user");
      } else {
        try {
          audioRef.current.muted = false;
          await audioRef.current.play();
        setIsPlaying(true);
          setIsMuted(false);
          try { localStorage.setItem(userPrefKey, "autoplay"); } catch {}
          console.log("▶️ Music resumed by user");
        } catch (error) {
          console.error("Error playing audio:", error);
        }
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      try { localStorage.setItem(userPrefKey, !isMuted ? "muted" : (isPlaying ? "autoplay" : "stopped")); } catch {}
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
