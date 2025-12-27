"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Gallery } from "@/app/lib/definitions";
import OptimizedImage from "@/app/ui/optimized-image";
import {
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
} from "@heroicons/react/24/outline";

interface ProductGalleryClientProps {
  galleries: Gallery[];
}

export default function ProductGalleryClient({
  galleries,
}: ProductGalleryClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use galleries for images, fall back to sample images if no galleries
  const images =
    galleries.length > 0
      ? galleries.map((gallery) => gallery.image_url)
      : ["/image/2.jpg", "/image/logo.png"];

  // Preload all gallery images for faster switching
  useEffect(() => {
    images.forEach((imageSrc) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = imageSrc;
      document.head.appendChild(link);
    });
  }, [images]);

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center sm:items-end items-center gap-4 w-full md:w-1/2">
      <OptimizedImage
        src={images[selectedImageIndex]}
        alt="product"
        width={500}
        height={500}
        className="rounded-md w-[400px] h-[271px]"
        objectFit="cover"
        priority={selectedImageIndex === 0}
        quality={90}
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <div className="flex flex-row justify-center items-center gap-4">
        <button
          onClick={scrollLeft}
          className="hover:bg-gray-100 p-1 rounded-full transition-colors"
        >
          <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto w-full scrollbar-hide flex-row gap-4 scroll-smooth"
        >
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`transition-all duration-200 flex-shrink-0 ${
                index === selectedImageIndex
                  ? "ring-2 ring-blue-500 scale-105"
                  : "hover:scale-105"
              }`}
            >
              <OptimizedImage
                src={image}
                alt={`product ${index + 1}`}
                width={100}
                height={100}
                className={`rounded-md ${
                  index === selectedImageIndex
                    ? "opacity-100"
                    : "opacity-70 hover:opacity-90"
                }`}
                objectFit="cover"
                priority={index <= 2}
                quality={70}
                sizes="100px"
              />
            </button>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="hover:bg-gray-100 p-1 rounded-full transition-colors"
        >
          <ChevronDoubleRightIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
