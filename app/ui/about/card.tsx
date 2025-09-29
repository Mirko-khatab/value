import Image from "next/image";
import React from "react";

type CardProps = {
  src: string;
  title: string;
  description: string;
};
export const Card = ({ src, title, description }: CardProps) => {
  return (
    <div className="flex flex-col  ">
      <Image
        src={src}
        alt="card"
        className="sm:w-[400px] sm:h-[500px] w-full h-full rounded-t-md object-cover"
        width={1000}
        height={1000}
      />
      <div className="flex flex-col bg-primary p-4 rounded-b-md justify-center items-center gap-2">
        <h1 className="text-white text-2xl font-bold">{title}</h1>
        <p className="text-white text-sm">{description}</p>
      </div>
    </div>
  );
};
