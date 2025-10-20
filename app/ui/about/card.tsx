import Image from "next/image";
import React from "react";

type CardProps = {
  src: string;
  title: string;
  description: string;
};
export const Card = ({ src, title, description }: CardProps) => {
  return (
    <div className="flex flex-col cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105 hover:shadow-xl">
      <div className="relative overflow-hidden rounded-t-md">
        <Image
          src={src}
          alt="card"
          className="sm:w-[400px] sm:h-[500px] w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          width={1000}
          height={1000}
        />
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <div className="flex flex-col bg-primary p-4 rounded-b-md justify-center items-center gap-2 transition-colors duration-300 hover:bg-opacity-90">
        <h1 className="text-white text-2xl font-bold transition-all duration-300">
          {title}
        </h1>
        <p className="text-white text-sm transition-all duration-300">
          {description}
        </p>
      </div>
    </div>
  );
};
