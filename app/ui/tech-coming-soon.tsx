'use client';

import { useState } from 'react';
import { bahnschrift, bahnschriftBold } from '@/app/ui/fonts';

/**
 * VALUE TECH - Coming Soon Landing Page
 * 
 * High-end, architectural design for tech.valuearch.com subdomain
 * Features:
 * - Full-screen responsive layout
 * - Elegant typography with large letter-spacing
 * - Subtle wireframe grid background
 * - Email notification signup
 * - Perfectly centered with flexbox
 * - Matches existing brand identity
 */

interface ComingSoonFormData {
  email: string;
}

export default function TechComingSoon() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call (replace with actual endpoint later)
    try {
      // TODO: Replace with actual API endpoint
      // await fetch('/api/notify-me', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // For now, just simulate success
      setTimeout(() => {
        setIsSubmitted(true);
        setIsSubmitting(false);
        setEmail('');
      }, 1000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Architectural Wireframe Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="wireframe-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Main grid */}
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary dark:text-tertiary"
              />
              {/* Diagonal accent */}
              <path
                d="M 0 0 L 60 60 M 60 0 L 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.25"
                className="text-tertiary dark:text-primary"
                opacity="0.3"
              />
              {/* Corner dots */}
              <circle cx="0" cy="0" r="1" fill="currentColor" className="text-tertiary" />
              <circle cx="60" cy="0" r="1" fill="currentColor" className="text-tertiary" />
              <circle cx="0" cy="60" r="1" fill="currentColor" className="text-tertiary" />
              <circle cx="60" cy="60" r="1" fill="currentColor" className="text-tertiary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wireframe-grid)" />
        </svg>
      </div>

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.02] dark:to-tertiary/[0.03]" />

      {/* Main Content - Perfectly Centered */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl text-center">
          
          {/* Coming Soon Badge */}
          <div className="mb-8 flex justify-center animate-fade-in-up sm:mb-12">
            <span className="inline-flex items-center rounded-full border-2 border-primary/20 dark:border-tertiary/30 px-6 py-2 text-sm font-medium tracking-wider text-primary dark:text-tertiary backdrop-blur-sm bg-white/50 dark:bg-black/50 shadow-lg">
              COMING SOON
            </span>
          </div>

          {/* Main Hero Text - VALUE TECH */}
          <div className="mb-6 sm:mb-8 animation-delay-200 animate-fade-in-up">
            <h1
              className={`${bahnschriftBold.className} text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-primary dark:text-tertiary leading-none mb-2`}
              style={{
                textShadow: '0 2px 40px rgba(46, 90, 122, 0.1)',
              }}
            >
              VALUE
            </h1>
            <h1
              className={`${bahnschriftBold.className} text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-secondary dark:text-gray-400 leading-none`}
              style={{
                textShadow: '0 2px 40px rgba(79, 186, 219, 0.1)',
              }}
            >
              TECH
            </h1>
          </div>

          {/* Decorative Line */}
          <div className="mx-auto mb-8 h-[2px] w-24 bg-gradient-to-r from-transparent via-tertiary to-transparent opacity-60 animation-delay-300 animate-fade-in-up sm:mb-10" />

          {/* Subtitle */}
          <div className="animation-delay-400 animate-fade-in-up">
            <p
              className={`${bahnschrift.className} mx-auto max-w-2xl text-xl sm:text-2xl md:text-3xl text-secondary dark:text-gray-300 tracking-wide leading-relaxed mb-4`}
            >
              Constructing the Future of Architecture
            </p>
            <p
              className={`${bahnschrift.className} mx-auto max-w-xl text-base sm:text-lg text-gray-500 dark:text-gray-500 tracking-wide leading-relaxed`}
            >
              Where innovative technology meets architectural excellence
            </p>
          </div>

          {/* Email Notification Form */}
          <div className="mt-12 animation-delay-500 animate-fade-in-up sm:mt-16">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className={`${bahnschrift.className} flex-1 rounded-lg sm:rounded-r-none border-2 border-primary/20 dark:border-tertiary/30 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-6 py-4 text-base text-primary dark:text-tertiary placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:border-primary dark:focus:border-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-tertiary/20 transition-all duration-300 disabled:opacity-50`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${bahnschrift.className} rounded-lg sm:rounded-l-none bg-primary dark:bg-tertiary px-8 py-4 text-base font-medium tracking-wider text-white hover:bg-primary/90 dark:hover:bg-tertiary/90 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-tertiary focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'NOTIFY ME'}
                  </button>
                </div>
                {error && (
                  <p className="mt-3 text-sm text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-600 tracking-wide">
                  Be the first to know when we launch. We respect your privacy.
                </p>
              </form>
            ) : (
              <div className="mx-auto max-w-md animate-bounce-in">
                <div className="rounded-lg border-2 border-tertiary/30 bg-tertiary/5 dark:bg-tertiary/10 backdrop-blur-sm px-6 py-4">
                  <div className="flex items-center justify-center gap-2 text-tertiary dark:text-tertiary">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className={`${bahnschrift.className} text-base font-medium tracking-wide`}>
                      Thank you! We'll notify you when we launch.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Accent Line */}
          <div className="mt-16 animation-delay-1000 animate-fade-in-up sm:mt-20">
            <div className="mx-auto h-[1px] w-full max-w-xs bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent opacity-50" />
          </div>
        </div>
      </div>

      {/* Corner Architectural Accents */}
      <div className="pointer-events-none absolute top-0 left-0 h-32 w-32 border-t-2 border-l-2 border-primary/10 dark:border-tertiary/10" />
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 border-t-2 border-r-2 border-primary/10 dark:border-tertiary/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 border-b-2 border-l-2 border-primary/10 dark:border-tertiary/10" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 border-b-2 border-r-2 border-primary/10 dark:border-tertiary/10" />
    </div>
  );
}
