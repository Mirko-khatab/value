'use client';

import Link from 'next/link';
import { bahnschrift, bahnschriftBold } from '@/app/ui/fonts';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * VALUE TECH Prominent Hero Section
 * 
 * Large, impossible-to-miss section on homepage
 * Features:
 * - Full-width prominent placement
 * - Eye-catching design
 * - Large text and visuals
 * - Clear value proposition
 * - Strong call-to-action
 * - Animated elements
 * - Perfect for conversions
 */

export default function TechHeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-primary/95 via-tertiary/95 to-primary/95 dark:from-primary/90 dark:via-tertiary/90 dark:to-primary/90 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="tech-hero-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
              <circle cx="0" cy="0" r="2" fill="white" />
              <circle cx="60" cy="60" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tech-hero-grid)" />
        </svg>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute top-40 right-20 w-3 h-3 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-white/25 rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-white/20 rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            
            {/* Left: Text Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 animate-fade-in-up">
              
              {/* Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 px-5 py-2.5 shadow-lg">
                  <SparklesIcon className="h-5 w-5 text-white animate-pulse" />
                  <span className={`${bahnschrift.className} text-sm font-bold text-white tracking-wider`}>
                    LAUNCHING SOON
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <div>
                <h2 className={`${bahnschriftBold.className} text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4`}>
                  <span className="block">VALUE</span>
                  <span className="block text-white/90">TECH</span>
                </h2>
                <div className="h-1.5 w-24 bg-white/60 rounded-full mx-auto lg:mx-0" />
              </div>

              {/* Description */}
              <div className={`${bahnschrift.className} space-y-4`}>
                <p className="text-xl sm:text-2xl text-white font-semibold leading-relaxed">
                  The Future of Architectural Technology
                </p>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  A new division of Value Architecture bringing innovative technology solutions, smart building systems, and digital transformation to the architectural industry.
                </p>
              </div>

              {/* Features List */}
              <div className={`${bahnschrift.className} grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto lg:mx-0`}>
                {[
                  '🏗️ Smart Building Systems',
                  '💡 Digital Architecture Tools',
                  '🚀 Innovation & Research',
                  '🌐 Coming to tech.valuearch.com'
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-white/95 text-sm sm:text-base animation-delay-200 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100 + 400}ms` }}
                  >
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/60" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                <Link
                  href="/tech-preview"
                  className={`${bahnschrift.className} group inline-flex items-center justify-center gap-2 rounded-xl bg-white text-primary px-8 py-4 text-base sm:text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 transform hover:scale-105 hover:-translate-y-1`}
                >
                  <span>Preview VALUE TECH</span>
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/tech-preview"
                  className={`${bahnschrift.className} inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 text-base sm:text-lg font-semibold hover:bg-white/20 transition-all duration-300`}
                >
                  <span>Learn More</span>
                </Link>
              </div>

              {/* Launch Info */}
              <p className={`${bahnschrift.className} text-sm text-white/80 pt-4`}>
                🎯 Launching at <span className="font-bold text-white">tech.valuearch.com</span>
              </p>
            </div>

            {/* Right: Visual/Mockup */}
            <div className="relative animation-delay-300 animate-fade-in-up">
              {/* Main Card */}
              <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 p-8 sm:p-12 shadow-2xl overflow-hidden">
                
                {/* Glowing effect inside card */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                
                {/* Content */}
                <div className="relative z-10 space-y-8">
                  
                  {/* Browser mockup */}
                  <div className="rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border-4 border-white/20">
                    {/* Browser bar */}
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 ml-4 rounded bg-white dark:bg-gray-700 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 font-mono">
                        https://tech.valuearch.com
                      </div>
                    </div>
                    
                    {/* Content preview */}
                    <div className="bg-white dark:bg-gray-900 p-8 space-y-6">
                      <div className="text-center space-y-3">
                        <div className="inline-block rounded-full border-2 border-tertiary/30 bg-tertiary/10 px-4 py-1.5 text-xs font-bold text-tertiary">
                          COMING SOON
                        </div>
                        
                        <div className={`${bahnschriftBold.className}`}>
                          <div className="text-3xl font-bold tracking-[0.2em] text-primary dark:text-tertiary">
                            VALUE
                          </div>
                          <div className="text-3xl font-bold tracking-[0.2em] text-secondary dark:text-gray-400">
                            TECH
                          </div>
                        </div>

                        <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-tertiary to-transparent" />

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Constructing the Future<br />of Architecture
                        </p>

                        <div className="pt-2">
                          <div className="rounded-lg border-2 border-primary/20 dark:border-tertiary/30 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
                            Get notified when we launch
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats/Features */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                      { label: 'Innovation', value: '100%' },
                      { label: 'Technology', value: 'Next-Gen' },
                      { label: 'Coming', value: 'Soon' }
                    ].map((stat, index) => (
                      <div key={index} className="space-y-1">
                        <div className={`${bahnschriftBold.className} text-2xl text-white font-bold`}>
                          {stat.value}
                        </div>
                        <div className={`${bahnschrift.className} text-xs text-white/80`}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-white/30" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-white/30" />
              </div>

              {/* Floating glow behind card */}
              <div className="absolute -inset-8 -z-10 bg-white/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 80C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-white dark:text-black"
          />
        </svg>
      </div>
    </section>
  );
}
