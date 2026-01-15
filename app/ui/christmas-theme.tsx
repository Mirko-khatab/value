'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ChristmasTheme Component
 * 
 * Features:
 * - Smooth snowfall animation using Canvas
 * - Christmas lights decoration at top
 * - Optimized with requestAnimationFrame
 * - pointer-events: none to avoid blocking interactions
 * - Easy to add/remove
 */

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  drift: number;
}

export default function ChristmasTheme() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if theme should be active
  useEffect(() => {
    async function checkThemeStatus() {
      try {
        const response = await fetch('/api/theme-settings');
        const data = await response.json();
        setIsEnabled(data.enabled || false);
      } catch (error) {
        console.error('Failed to fetch theme settings:', error);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkThemeStatus();
  }, []);

  // Don't render anything while loading or if disabled
  if (isLoading || !isEnabled) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    // Create snowflakes
    const snowflakes: Snowflake[] = [];
    const numberOfSnowflakes = Math.min(Math.floor(window.innerWidth / 10), 150);

    for (let i = 0; i < numberOfSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1, // 1-4px
        speed: Math.random() * 1 + 0.5, // 0.5-1.5px per frame
        opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
        drift: Math.random() * 0.5 - 0.25, // Horizontal drift
      });
    }

    // Animation loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw snowflakes
      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        // Update position
        flake.y += flake.speed;
        flake.x += flake.drift;

        // Reset snowflake when it goes off screen
        if (flake.y > canvas.height) {
          flake.y = -10;
          flake.x = Math.random() * canvas.width;
        }

        // Wrap horizontal drift
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize();
      // Adjust number of snowflakes on resize
      const newCount = Math.min(Math.floor(window.innerWidth / 10), 150);
      if (newCount > snowflakes.length) {
        const diff = newCount - snowflakes.length;
        for (let i = 0; i < diff; i++) {
          snowflakes.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            drift: Math.random() * 0.5 - 0.25,
          });
        }
      } else if (newCount < snowflakes.length) {
        snowflakes.splice(newCount);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Christmas Lights */}
      <div className="christmas-lights">
        <div className="light red"></div>
        <div className="light gold"></div>
        <div className="light green"></div>
        <div className="light red"></div>
        <div className="light gold"></div>
        <div className="light green"></div>
        <div className="light red"></div>
        <div className="light gold"></div>
        <div className="light green"></div>
        <div className="light red"></div>
        <div className="light gold"></div>
        <div className="light green"></div>
        <div className="light red"></div>
        <div className="light gold"></div>
        <div className="light green"></div>
      </div>

      {/* Snowfall Canvas */}
      <canvas
        ref={canvasRef}
        className="snowfall-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
        aria-hidden="true"
      />

      {/* Styles */}
      <style jsx global>{`
        .christmas-lights {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: linear-gradient(to bottom, rgba(15, 73, 40, 0.3), transparent);
          pointer-events: none;
          z-index: 9998;
          padding: 4px 0;
        }

        .light {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
          animation: twinkle 1.5s ease-in-out infinite;
        }

        .light.red {
          background-color: #B01B2E;
          color: #B01B2E;
          animation-delay: 0s;
        }

        .light.gold {
          background-color: #D4AF37;
          color: #D4AF37;
          animation-delay: 0.5s;
        }

        .light.green {
          background-color: #0F4928;
          color: #0F4928;
          animation-delay: 1s;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }

        /* Ensure snowfall doesn't block interactions */
        .snowfall-canvas {
          pointer-events: none !important;
        }

        /* Optional: Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .light {
            animation: none;
          }
          .snowfall-canvas {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
