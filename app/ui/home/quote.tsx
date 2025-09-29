import Image from "next/image";
import React from "react";

export default function Quote() {
  return (
    <div className="flex flex-col w-full border-2 border-gray-300 bg-gray-100 p-4 px-10 md:h-[364px] dark:bg-[#181818] rounded-md ">
      {/* circle */}
      <div className="flex  justify-between  items-center w-full">
        <div className=" hidden sm:block">
          <Image
            src="/icons/quote.svg"
            alt="quote"
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </div>
        <div className="w-[163.08px] h-[163.08px] rounded-full bg-primary"></div>
      </div>
      {/* quote */}
      <div className="text-2xl   font-bold flex flex-col gap-4 justify-start items-start">
        <h1 className="text-xl md:text-2xl p-4 dark:text-white text-gray-600">
          <q>
            We specialize in bespoke outcomes for projects of all sizes and
            complexities. .
          </q>
        </h1>
        <p className="text-sm md:text-base px-4 text-primary">
          value.architects{" "}
        </p>
      </div>
      {/* author */}
    </div>
  );
}
