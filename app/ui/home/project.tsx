import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Project({
  title,
  description,
  image_url,
  screen,
  type,
}: {
  title: string;
  description: string;
  image_url: string;
  screen: string;
  type: number;
}) {
  //short description
  const shortDescription = description.slice(0, 30) + "...";
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <div
        className={` rounded-md flex   border  flex-col justify-center items-center ${
          type === 1
            ? "w-[300px] h-[450px] md:w-[392px] md:h-[549px]"
            : "w-[300px] h-[300px] md:w-[392px] md:h-[400px]"
        }`}
      >
        <Image
          src={image_url}
          alt="project"
          className={`rounded-md border border-gray-200 w-[300px] h-[450px] md:w-[392px] md:h-[549px]  object-cover ${
            type === 1
              ? "w-[300px] h-[450px] md:w-[392px] md:h-[549px]"
              : "w-[300px] h-[300px] md:w-[392px] md:h-[400px]"
          }`}
          width={1000}
          height={1000}
        />
      </div>
      <div className="flex flex-col gap-2 justify-center items-center">
        <h3 className="text-2xl text-text">{title}</h3>
        <p>{shortDescription}</p>
      </div>
    </div>
  );
}
