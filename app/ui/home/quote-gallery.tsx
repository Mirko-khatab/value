"use client";

import Image from "next/image";
import { useState } from "react";

interface QuoteGraphic {
  src: string;
  alt: string;
}

interface QuoteGalleryProps {
  quotes?: QuoteGraphic[];
}

// Default quotes if not provided
const defaultQuotes: QuoteGraphic[] = [
  { src: "/quote/1.png", alt: "Quote 1" },
  { src: "/quote/2.png", alt: "Quote 2" },
  { src: "/quote/3.png", alt: "Quote 3" },
  { src: "/quote/4.png", alt: "Quote 4" },
  { src: "/quote/5.png", alt: "Quote 5" },
];

export default function QuoteGallery({
  quotes = defaultQuotes,
}: QuoteGalleryProps) {
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);

  return (
    <>
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .quote-item {
          animation: fadeInScale linear;
          animation-timeline: view();
          animation-range: entry 0% cover 30%;
        }

        @supports not (animation-timeline: view()) {
          .quote-item {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* Quote Gallery Section */}
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Masonry/Pinterest-style Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="quote-item break-inside-avoid mb-4 group cursor-pointer"
                onClick={() => setSelectedQuote(index)}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                  {/* Image */}
                  <div className="relative w-full">
                    <Image
                      src={quote.src}
                      alt={quote.alt}
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
                      quality={90}
                    />
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Bottom shine effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedQuote !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedQuote(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors z-50"
            onClick={() => setSelectedQuote(null)}
          >
            ×
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image
              src={quotes[selectedQuote].src}
              alt={quotes[selectedQuote].alt}
              width={1200}
              height={1600}
              className="w-full h-auto object-contain rounded-lg"
              quality={95}
            />
          </div>

          {/* Navigation arrows */}
          {quotes.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedQuote((prev) =>
                    prev === 0 ? quotes.length - 1 : (prev || 1) - 1
                  );
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedQuote((prev) =>
                    (prev || 0) === quotes.length - 1 ? 0 : (prev || 0) + 1
                  );
                }}
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
