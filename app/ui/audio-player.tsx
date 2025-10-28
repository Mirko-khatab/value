"use client";

import { useEffect, useRef, useState } from "react";
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  StopIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";

interface AudioPlayerProps {
  useFor?: "landing" | "intro" | "both";
  className?: string;
}

export default function AudioPlayer({
  useFor = "landing",
  className = "",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Fetch audio URL from API
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch(`/api/audios?use_for=${useFor}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0 && data[0].audio_url) {
            setAudioUrl(data[0].audio_url);
          }
        }
      } catch (error) {
        console.error("Failed to fetch audio:", error);
        setHasError(true);
      }
    };

    fetchAudio();
  }, [useFor]);

  // Initialize audio element and auto-play
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.loop = true; // Enable looping
      audioRef.current.preload = "auto"; // Preload the audio file

      // Load the audio immediately
      audioRef.current.load();

      // Try to auto-play as soon as possible
      const attemptPlay = async () => {
        if (!audioRef.current) return;

        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Try muted autoplay
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
      audioRef.current.addEventListener("canplaythrough", attemptPlay, {
        once: true,
      });
    }
  }, [audioUrl]);

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

  // Don't show controls if no audio or error
  if (!audioUrl || hasError) {
    return null;
  }

  return (
    <div className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[60] flex gap-1.5 sm:gap-2 ${className}`}>
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
