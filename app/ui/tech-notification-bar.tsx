'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bahnschrift } from '@/app/ui/fonts';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * VALUE TECH Top Notification Bar
 * 
 * Sticky notification bar at the very top of the page
 * ALWAYS VISIBLE - Cannot be missed
 * Features:
 * - Sticky to top of viewport
 * - Eye-catching gradient background
 * - Clear, concise message
 * - Strong CTA button
 * - Dismissible but prominent
 * - Smooth slide-down animation
 */

export default function TechNotificationBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user dismissed
    const isDismissed = sessionStorage.getItem('techNotificationDismissed');
    
    if (!isDismissed) {
      // Show immediately with animation
      setTimeout(() => setIsVisible(true), 300);
    }
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('techNotificationDismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] transform transition-all duration-300 ${
        isClosing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Main notification bar */}
      <div className="relative bg-gradient-to-r from-primary via-tertiary to-primary dark:from-primary/90 dark:via-tertiary/90 dark:to-primary/90 shadow-lg border-b-2 border-white/20">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        
        {/* Content */}
        <div className="relative px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
            
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Sparkle Icon */}
              <div className="flex-shrink-0 hidden sm:block">
                <SparklesIcon className="h-6 w-6 text-white animate-pulse" />
              </div>
              
              {/* Message */}
              <div className={`${bahnschrift.className} flex-1 min-w-0`}>
                <p className="text-sm sm:text-base text-white font-medium truncate sm:whitespace-normal">
                  <span className="font-bold">🚀 NEW!</span> Introducing <span className="font-bold">VALUE TECH</span> - Advanced Technology Solutions for Architecture
                </p>
              </div>
            </div>

            {/* Right: CTA Button + Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* CTA Button */}
              <Link
                href="/tech-preview"
                className={`${bahnschrift.className} inline-flex items-center gap-1.5 rounded-lg bg-white text-primary dark:bg-gray-900 dark:text-tertiary px-4 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap`}
              >
                <span>Learn More</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Dismiss notification"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>
    </div>
  );
}
