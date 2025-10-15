"use client";

import Image from "next/image";
import Link from "next/link";

interface CustomCardProps {
  title: string;
  image_url: string;
  className?: string;
  width?: number;
  height?: number;
  link: string;
  size?: "small" | "medium" | "large" | "xlarge";
}

export default function CustomCard({
  title,
  image_url,
  className,
  width = 1000,
  height = 1000,
  link,
  size = "medium",
}: CustomCardProps) {
  // Define size classes
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-32 md:h-40 lg:h-48";
      case "medium":
        return "h-40 md:h-48 lg:h-56";
      case "large":
        return "h-48 md:h-56 lg:h-64";
      case "xlarge":
        return "h-56 md:h-64 lg:h-72";
      default:
        return "h-40 md:h-48 lg:h-56";
    }
  };

  // Define text size classes based on card size
  const getTextSizeClasses = () => {
    switch (size) {
      case "small":
        return "text-sm md:text-base lg:text-lg";
      case "medium":
        return "text-base md:text-lg lg:text-xl";
      case "large":
        return "text-lg md:text-xl lg:text-2xl";
      case "xlarge":
        return "text-xl md:text-2xl lg:text-3xl";
      default:
        return "text-base md:text-lg lg:text-xl";
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-card {
          animation: fadeInUp linear;
          animation-timeline: view();
          animation-range: entry 0% cover 40%;
        }

        @supports not (animation-timeline: view()) {
          .custom-card {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Link
        href={link}
        className={`custom-card relative group overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 ${getSizeClasses()} ${
          className || ""
        }`}
      >
        <Image
          src={image_url}
          alt={title}
          width={width}
          height={height}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Black opacity overlay at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Title with better positioning and styling */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1
            className={`text-white font-bold ${getTextSizeClasses()} drop-shadow-lg`}
          >
            {title}
          </h1>
        </div>
      </Link>
    </>
  );
}
