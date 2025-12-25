'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bahnschrift, bahnschriftBold } from '@/app/ui/fonts';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * VALUE TECH Announcement Banner
 * 
 * Beautiful announcement section for homepage to showcase upcoming tech.valuearch.com
 * Features:
 * - Elegant design matching brand identity
 * - Dismissible (remembers user preference)
 * - Smooth animations
 * - Responsive layout
 * - Clear CTA to learn more
 * - Shows VALUE TECH is coming as part of the main site
 */

export default function TechAnnouncement() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the announcement
    const isDismissed = localStorage.getItem('techAnnouncementDismissed');
    
    if (!isDismissed) {
      // Delay appearance for smooth entrance
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('techAnnouncementDismissed', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-primary/5 via-tertiary/5 to-primary/5 dark:from-primary/10 dark:via-tertiary/10 dark:to-primary/10 border-y-2 border-primary/10 dark:border-tertiary/20 transition-all duration-300 ${
        isClosing ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="tech-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary dark:text-tertiary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-pattern)" />
        </svg>
      </div>

      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 transition-all duration-200 backdrop-blur-sm"
        aria-label="Dismiss announcement"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Coming Soon Badge */}
              <div className="flex justify-center lg:justify-start">
                <span className="inline-flex items-center rounded-full border-2 border-tertiary/30 bg-tertiary/5 dark:bg-tertiary/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-tertiary backdrop-blur-sm shadow-sm">
                  🚀 COMING SOON
                </span>
              </div>

              {/* Main Heading */}
              <div>
                <h2
                  className={`${bahnschriftBold.className} text-4xl sm:text-5xl font-bold tracking-wider mb-3`}
                >
                  <span className="text-primary dark:text-tertiary">VALUE</span>{' '}
                  <span className="text-secondary dark:text-gray-400">TECH</span>
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-tertiary to-transparent rounded-full mx-auto lg:mx-0" />
              </div>

              {/* Description */}
              <div className={`${bahnschrift.className} space-y-3`}>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  A new division of Value Architecture focused on innovative technology solutions for the architectural industry
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Launching at <span className="font-semibold text-tertiary">tech.valuearch.com</span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/tech-preview"
                  className={`${bahnschrift.className} inline-flex items-center justify-center gap-2 rounded-lg bg-primary dark:bg-tertiary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 dark:hover:bg-tertiary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                >
                  <span>Preview Now</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                
                <button
                  onClick={handleDismiss}
                  className={`${bahnschrift.className} inline-flex items-center justify-center rounded-lg border-2 border-primary/20 dark:border-tertiary/30 px-6 py-3 text-base font-medium text-primary dark:text-tertiary hover:bg-primary/5 dark:hover:bg-tertiary/10 transition-all duration-300`}
                >
                  Maybe Later
                </button>
              </div>
            </div>

            {/* Right Side - Visual Preview */}
            <div className="relative">
              <div className="relative rounded-2xl border-2 border-primary/20 dark:border-tertiary/30 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 shadow-2xl overflow-hidden">
                {/* Mini Preview of Coming Soon Page */}
                <div className="space-y-6">
                  {/* Simulated Browser Bar */}
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/60" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                      <div className="h-3 w-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 ml-3 rounded bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs text-gray-500 dark:text-gray-400">
                      tech.valuearch.com
                    </div>
                  </div>

                  {/* Mini Hero Preview */}
                  <div className="text-center space-y-3">
                    <div className="inline-block rounded-full border border-tertiary/30 bg-tertiary/5 px-3 py-1 text-[10px] font-semibold tracking-wider text-tertiary">
                      COMING SOON
                    </div>
                    
                    <div className={`${bahnschriftBold.className} space-y-1`}>
                      <div className="text-2xl font-bold tracking-[0.2em] text-primary dark:text-tertiary">
                        VALUE
                      </div>
                      <div className="text-2xl font-bold tracking-[0.2em] text-secondary dark:text-gray-400">
                        TECH
                      </div>
                    </div>

                    <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-tertiary to-transparent" />

                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Constructing the Future<br />of Architecture
                    </p>

                    {/* Mini Form Preview */}
                    <div className="pt-2">
                      <div className="rounded border border-primary/20 dark:border-tertiary/30 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-xs text-gray-400">
                        Email signup form
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner Accents */}
                <div className="pointer-events-none absolute top-0 left-0 h-16 w-16 border-t-2 border-l-2 border-primary/10 dark:border-tertiary/10" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-primary/10 dark:border-tertiary/10" />
              </div>

              {/* Glow Effect Behind Card */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-tertiary/10 to-primary/10 blur-2xl dark:from-primary/20 dark:via-tertiary/20 dark:to-primary/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tertiary/50 to-transparent" />
    </div>
  );
}
