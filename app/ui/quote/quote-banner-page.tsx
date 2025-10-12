"use client";
import { useState, useEffect } from "react";
import QuoteBanner from "./banner";
import { Quote } from "@/app/lib/definitions";

interface QuoteBannerPageProps {
  className?: string;
}

export default function QuoteBannerPage({
  className = "",
}: QuoteBannerPageProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch("/api/quotes");
        if (!response.ok) {
          throw new Error("Failed to fetch quotes");
        }
        const data = await response.json();
        setQuotes(data);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError(err instanceof Error ? err.message : "Failed to load quotes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  // Auto-rotate quotes every 5 seconds
  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  if (loading) {
    return (
      <div
        className={`w-full h-64 md:h-80 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center ${className}`}
      >
        <div className="text-gray-500 dark:text-gray-400">
          Loading quotes...
        </div>
      </div>
    );
  }

  if (error || quotes.length === 0) {
    return (
      <div
        className={`w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-gray-500 dark:text-gray-400 text-center">
          {error || "No quotes available"}
        </div>
      </div>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <QuoteBanner quote={currentQuote} />

      {/* Navigation dots */}
      {quotes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
