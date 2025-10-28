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
  const introRef = useRef<HTMLDivElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationTriggerRef = useRef<HTMLDivElement | null>(null);

  const languages: Language[] = [
    { text: "We value your work", dir: "ltr", name: "English" },
    { text: "بەها ئەدەین بەکارەکانتان", dir: "rtl", name: "کوردی" },
    { text: "نحن نقدر عملك", dir: "rtl", name: "العربية" },
  ];

  const totalSketches = 12;
  const sketchDuration = 800; // ms per sketch (slower for better viewing)
  const sloganDuration = 3000; // ms to show each language (slower to read comfortably)
  const totalDuration = totalSketches * sketchDuration; // Total time for all sketches

  // Fetch and play audio immediately and more aggressively
  useEffect(() => {
    // Web Audio API - bypasses autoplay restrictions
    const playWithWebAudio = async (audioUrl: string) => {
      try {
        // Create AudioContext (this often works without user interaction)
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();

        // Fetch audio data
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );

        // Create source node
        sourceRef.current = audioContextRef.current.createBufferSource();
        sourceRef.current.buffer = audioBuffer;
        sourceRef.current.loop = true;

        // Create gain node for volume control
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.setValueAtTime(0.7, audioContextRef.current.currentTime);

        // Connect nodes
        sourceRef.current.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        // Start playback
        sourceRef.current.start(0);

        return true;
      } catch (error) {
        return false;
      }
    };

    // Iframe-based autoplay - sometimes bypasses restrictions
    const playWithIframe = async (audioUrl: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!iframeRef.current) {
          resolve(false);
          return;
        }

        // Set up message listener for iframe responses
        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === "AUDIO_STARTED") {
            window.removeEventListener("message", messageHandler);
            resolve(true);
          } else if (event.data.type === "AUDIO_BLOCKED") {
            // eslint-disable-line
            window.removeEventListener("message", messageHandler);
            resolve(false);
          }
        };

        window.addEventListener("message", messageHandler);

        // Send commands to iframe
        iframeRef.current.contentWindow?.postMessage(
          {
            action: "LOAD_AUDIO",
            audioUrl: audioUrl,
            volume: 0.7,
          },
          "*"
        );

        setTimeout(() => {
          iframeRef.current?.contentWindow?.postMessage(
            {
              action: "PLAY_AUDIO",
            },
            "*"
          );
        }, 500);

        // Timeout after 3 seconds
        setTimeout(() => {
          window.removeEventListener("message", messageHandler);
          resolve(false);
        }, 3000);
      });
    };

    // Programmatic interaction simulation - creates synthetic events
    const simulateUserInteraction = async (
      audioUrl: string
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        try {
          // Create synthetic events to "trick" the browser
          const events = [
            new MouseEvent("click", { bubbles: true, cancelable: true }),
            new TouchEvent("touchstart", { bubbles: true, cancelable: true }),
            new KeyboardEvent("keydown", {
              bubbles: true,
              cancelable: true,
              key: "Space",
            }),
            new Event("focus", { bubbles: true }),
            new Event("mousedown", { bubbles: true }),
            new Event("pointerdown", { bubbles: true }),
          ];

          // Dispatch multiple synthetic events
          events.forEach((event) => {
            try {
              document.dispatchEvent(event);
              document.body.dispatchEvent(event);
            } catch (e) {
              // Some events might fail, that's okay
            }
          });

          // Try to play audio after synthetic interaction
          setTimeout(async () => {
            if (audioRef.current) {
              try {
                audioRef.current.src = audioUrl;
                audioRef.current.volume = 0.7;
                audioRef.current.muted = false;

                await audioRef.current.play();
                resolve(true);
              } catch (error) {
                resolve(false);
              }
            } else {
              resolve(false);
            }
          }, 100);
        } catch (error) {
          resolve(false);
        }
      });
    };

    // Video-based autoplay - browsers allow video autoplay more easily
    const playWithSilentVideo = async (audioUrl: string): Promise<boolean> => {
      return new Promise(async (resolve) => {
        if (!videoRef.current) {
          resolve(false);
          return;
        }

        try {
          // Create a silent video with audio track
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, 1, 1);
          }

          // Convert canvas to video stream
          const stream = canvas.captureStream(1); // 1 FPS

          // Add audio track to the stream
          const audioResponse = await fetch(audioUrl);
          const audioBlob = await audioResponse.blob();
          const audioObjectUrl = URL.createObjectURL(audioBlob);

          // Create audio element to get audio stream
          const tempAudio = document.createElement("audio");
          tempAudio.src = audioObjectUrl;
          tempAudio.crossOrigin = "anonymous";

          // Wait for audio to load
          await new Promise((audioResolve) => {
            tempAudio.addEventListener("loadeddata", () => audioResolve(true));
            tempAudio.load();
          });

          // Try to get audio stream (this might not work due to CORS)
          try {
            const audioContext = new (window.AudioContext ||
              (window as any).webkitAudioContext)();
            const source = audioContext.createMediaElementSource(tempAudio);
            const destination = audioContext.createMediaStreamDestination();
            source.connect(destination);

            // Add audio track to video stream
            destination.stream.getAudioTracks().forEach((track) => {
              stream.addTrack(track);
            });
          } catch (audioStreamError) {}

          // Set video source
          videoRef.current.srcObject = stream;
          videoRef.current.muted = false; // Try unmuted first
          videoRef.current.loop = true;

          // Try to play video (browsers are more lenient with video autoplay)
          await videoRef.current.play();

          // Start audio separately
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.loop = true;
            audioRef.current.volume = 0.7;
            await audioRef.current.play();
          }

          resolve(true);
        } catch (error) {
          resolve(false);
        }
      });
    };

    // CSS Animation triggered audio - uses animation events to trigger playback
    const playWithCSSAnimation = async (audioUrl: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!animationTriggerRef.current || !audioRef.current) {
          resolve(false);
          return;
        }

        try {
          // Set up audio
          audioRef.current.src = audioUrl;
          audioRef.current.loop = true;
          audioRef.current.volume = 0.7;
          audioRef.current.muted = false;

          // Create animation event listener
          const animationHandler = async (event: AnimationEvent) => {
            if (event.animationName === "audioTrigger") {
              try {
                if (audioRef.current) {
                  await audioRef.current.play();
                  resolve(true);
                }
              } catch (error) {
                resolve(false);
              }

              // Clean up
              animationTriggerRef.current?.removeEventListener(
                "animationstart",
                animationHandler
              );
            }
          };

          // Add animation listener
          animationTriggerRef.current.addEventListener(
            "animationstart",
            animationHandler
          );

          // Trigger animation by adding class
          animationTriggerRef.current.classList.add("trigger-audio-animation");

          // Timeout after 2 seconds
          setTimeout(() => {
            animationTriggerRef.current?.removeEventListener(
              "animationstart",
              animationHandler
            );
            resolve(false);
          }, 2000);
        } catch (error) {
          resolve(false);
        }
      });
    };

    const fetchAndPlayAudio = async () => {
      try {
        let audioUrl = "/music/intro.mp3"; // Default fallback to static file

        // Try to fetch from API first
        try {
          const response = await fetch("/api/audios?use_for=intro");
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0 && data[0].audio_url) {
              audioUrl = data[0].audio_url;
            }
          }
        } catch (apiError) {
          console.log("Using fallback audio file");
        }

        // Always set audio URL (either from API or fallback)
        setAudioUrl(audioUrl);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.loop = true;
          audioRef.current.preload = "auto";

          // ✅ Start muted with volume 0 (browsers allow this)
          audioRef.current.muted = true;
          audioRef.current.volume = 0;

          const tryAutoplay = async () => {
            // Strategy 1: Try muted autoplay first
            try {
              await audioRef.current!.play();

              // Now try to unmute automatically after a short delay
              setTimeout(async () => {
                if (audioRef.current) {
                  audioRef.current.muted = false;
                  audioRef.current.volume = 0.7;
                  setIsMuted(false);
                }
              }, 1000);
            } catch (error) {
              // Strategy 2: Try with very low volume instead of muted
              try {
                audioRef.current!.muted = false;
                audioRef.current!.volume = 0.01; // Very low but not muted
                await audioRef.current!.play();

                // Gradually increase volume
                const increaseVolume = () => {
                  if (audioRef.current && audioRef.current.volume < 0.7) {
                    audioRef.current.volume = Math.min(
                      audioRef.current.volume + 0.05,
                      0.7
                    );
                    setTimeout(increaseVolume, 200);
                  }
                };
                setTimeout(increaseVolume, 500);

                setIsMuted(false);
              } catch (lowVolumeError) {
                setShowUnmuteHint(true);
              }
            }
          };

          // Try autoplay when audio is ready
          audioRef.current.addEventListener("canplay", tryAutoplay, {
            once: true,
          });
          audioRef.current.load();

          // Additional automatic attempts
          setTimeout(() => {
            if (audioRef.current) {
              // Try direct play with sound
              audioRef.current.muted = false;
              audioRef.current.volume = 0.7;
              audioRef.current
                .play()
                .then(() => {
                  setIsMuted(false);
                  setShowUnmuteHint(false);
                })
                .catch(() => {});
            }
          }, 100);

          // Try again after page fully loads
          setTimeout(() => {
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.muted = false;
              audioRef.current.volume = 0.7;
              audioRef.current
                .play()
                .then(() => {
                  setIsMuted(false);
                  setShowUnmuteHint(false);
                })
                .catch(() => {});
            }
          }, 2000);

          // Try programmatic focus trick
          setTimeout(() => {
            // Create invisible element and focus it
            const hiddenInput = document.createElement("input");
            hiddenInput.style.position = "absolute";
            hiddenInput.style.left = "-9999px";
            hiddenInput.style.opacity = "0";
            hiddenInput.style.pointerEvents = "none";

            document.body.appendChild(hiddenInput);
            hiddenInput.focus();

            // Try to play after focus
            setTimeout(() => {
              if (audioRef.current && audioRef.current.paused) {
                audioRef.current.muted = false;
                audioRef.current.volume = 0.7;
                audioRef.current
                  .play()
                  .then(() => {
                    setIsMuted(false);
                    setShowUnmuteHint(false);
                  })
                  .catch(() => {});
              }

              // Clean up
              document.body.removeChild(hiddenInput);
            }, 100);
          }, 3000);

          // ✅ Clean user interaction handler
          const unmuteAndPlay = async () => {
            if (audioRef.current) {
              // Unmute and set volume with smooth fade-in
              audioRef.current.muted = false;
              audioRef.current.volume = 0;
              setIsMuted(false);
              setShowUnmuteHint(false);

              try {
                await audioRef.current.play();

                // Smooth volume fade-in
                const fadeIn = () => {
                  if (audioRef.current && audioRef.current.volume < 0.7) {
                    audioRef.current.volume = Math.min(
                      audioRef.current.volume + 0.7,
                      0.7
                    );
                    setTimeout(fadeIn, 50);
                  }
                };
                fadeIn();
              } catch (error) {}
            }
          };

          // Listen for user interactions
          document.addEventListener("click", unmuteAndPlay, { once: true });
          document.addEventListener("keydown", unmuteAndPlay, {
            once: true,
          });
          document.addEventListener("touchstart", unmuteAndPlay, {
            once: true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch or play audio:", error);
        // Fallback is already handled at the top of fetchAndPlayAudio
      }
    };

    fetchAndPlayAudio();

    // Set up intersection observer for better autoplay timing
    if (introRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && audioRef.current) {
              // Try to play audio when intro becomes visible
              if (audioRef.current.paused) {
                // Try muted first for better success rate
                audioRef.current.muted = true;
                setIsMuted(true);
                audioRef.current
                  .play()
                  .then(() => {
                    setShowUnmuteHint(true);
                    setTimeout(() => setShowUnmuteHint(false), 10000);
                  })
                  .catch((error) => {});
              }
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of intro is visible
      );

      observer.observe(introRef.current);

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Unmuting - use smooth fade-in
        audioRef.current.muted = false;
        audioRef.current.volume = 0;
        setIsMuted(false);
        setShowUnmuteHint(false);

        // Smooth volume fade-in
        const fadeIn = () => {
          if (audioRef.current && audioRef.current.volume < 0.7) {
            audioRef.current.volume = Math.min(
              audioRef.current.volume + 0.05,
              0.7
            );
            setTimeout(fadeIn, 50); // Fade in over ~0.7 seconds
          }
        };
        fadeIn();
      } else {
        // Muting - instant
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  // Handle click anywhere to start/unmute audio
  const handleIntroClick = async () => {
    if (audioRef.current) {
      // Unmute and set volume with smooth fade-in
      audioRef.current.muted = false;
      audioRef.current.volume = 0;
      setIsMuted(false);
      setShowUnmuteHint(false);
      hasUnmutedRef.current = true;

      try {
        await audioRef.current.play();

        // Smooth volume fade-in
        const fadeIn = () => {
          if (audioRef.current && audioRef.current.volume < 0.7) {
            audioRef.current.volume = Math.min(
              audioRef.current.volume + 0.05,
              0.7
            );
            setTimeout(fadeIn, 50);
          }
        };
        fadeIn();
      } catch (error) {}
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
        // Scroll to top before completing intro (especially important on mobile)
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Small delay to ensure scroll happens before transition
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
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
        autoPlay
        loop
        style={{ display: "none" }}
      />

      {/* Hidden video element for autoplay bypass */}
      <video
        ref={videoRef}
        muted={false}
        playsInline
        autoPlay
        loop
        style={{
          display: "none",
          width: "1px",
          height: "1px",
          position: "absolute",
          left: "-9999px",
        }}
      />

      {/* Hidden iframe for autoplay bypass */}
      <iframe
        ref={iframeRef}
        src="/audio-player-iframe.html"
        style={{
          display: "none",
          width: "1px",
          height: "1px",
          border: "none",
          position: "absolute",
          left: "-9999px",
        }}
        title="Audio Player Iframe"
      />

      {/* Hidden CSS animation trigger */}
      <div
        ref={animationTriggerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          opacity: 0,
        }}
      />

      {/* Show intro immediately */}
      <>
        {/* Unmute hint - shows when audio is ready but blocked */}
        {showUnmuteHint && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] animate-bounce">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 border-2 border-white/20">
              <SpeakerWaveIcon className="w-6 h-6 animate-pulse" />
              <span className="text-base font-semibold">
                🎵 Click anywhere to start music
              </span>
            </div>
          </div>
        )}

        {/* Mute button for intro audio */}
        {audioUrl && (
          <button
            onClick={toggleMute}
            className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[60] p-1.5 sm:p-3 rounded-full bg-white dark:bg-gray-800 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 active:scale-95 sm:hover:scale-110 group"
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <SpeakerXMarkIcon className="w-4 h-4 sm:w-6 sm:h-6 text-red-500 group-hover:text-red-600" />
            ) : (
              <SpeakerWaveIcon className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500 group-hover:text-blue-600" />
            )}
          </button>
        )}

        <div
          ref={introRef}
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

            @keyframes audioTrigger {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(1px);
              }
            }

            .trigger-audio-animation {
              animation: audioTrigger 0.1s ease-in-out;
            }
          `}</style>
        </div>
      </>
    </>
  );
}
