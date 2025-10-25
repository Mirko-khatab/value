import Image from "next/image";
import React from "react";

type CardProps = {
  src: string;
  title: string;
  description: string;
};
export const Card = ({ src, title, description }: CardProps) => {
  return (
    <div className="flex flex-col cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105 hover:shadow-xl h-full">
      {/* Fixed aspect ratio image container */}
      <div className="relative overflow-hidden rounded-t-md aspect-[3/4] w-full">
        <Image
          src={src}
          alt="card"
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      </div>

      {/* Fixed height content area */}
      <div className="flex flex-col bg-primary p-4 rounded-b-md justify-center items-center gap-2 transition-colors duration-300 hover:bg-opacity-90 min-h-[120px]">
        <h1 className="text-white text-lg sm:text-xl font-bold transition-all duration-300 text-center line-clamp-2">
          {title}
        </h1>
        <p className="text-white text-sm transition-all duration-300 text-center line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};
