"use client";
import Image from "next/image";
import { Quote } from "@/app/lib/definitions";

interface QuoteDisplayProps {
  quote: Quote;
  className?: string;
  showImage?: boolean;
}

export default function QuoteDisplay({
  quote,
  className = "",
  showImage = true,
}: QuoteDisplayProps) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {showImage && quote.image_url && (
        <div className="relative h-48 w-full">
          <Image
            src={quote.image_url}
            alt={quote.title_en}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {quote.title_en}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-1">
          {quote.title_ku}
        </p>
        <p className="text-gray-600 dark:text-gray-300">{quote.title_ar}</p>
      </div>
    </div>
  );
}
