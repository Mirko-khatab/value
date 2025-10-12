"use client";
import Image from "next/image";
import { Quote } from "@/app/lib/definitions";

interface QuoteBannerProps {
  quote: Quote;
  className?: string;
}

export default function QuoteBanner({
  quote,
  className = "",
}: QuoteBannerProps) {
  return (
    <div
      className={`relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={quote.image_url}
          alt={quote.title_en}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
        <div className="max-w-4xl mx-auto">
          {/* English Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            {quote.title_en}
          </h1>

          {/* Kurdish Title */}
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-200 mb-3">
            {quote.title_ku}
          </h2>

          {/* Arabic Title */}
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-200">
            {quote.title_ar}
          </h3>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
