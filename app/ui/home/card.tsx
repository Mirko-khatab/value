import Image from "next/image";
import React from "react";

export const Card = ({ src }: { src: string }) => {
  return (
    <div className=" xs:w-[200px]  w-[130px] h-[130px] rounded-md xs:h-[200px] dark:bg-[#181818] rounded-md ">
      <Image
        src={src}
        alt="quote"
        width={200}
        height={200}
        className="w-full h-full rounded-md object-cover"
      />
    </div>
  );
};
