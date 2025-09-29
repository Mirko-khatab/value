import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Space } from "../ui/utils/space";
import { Card } from "../ui/about/card";
import Image from "next/image";

export default function Page() {
  return (
    <ShowcaseLayout>
      <Space className="flex w-full justify-center items-center flex-col  gap-4">
        {/* circle */}
        <div className="flex flex-row gap-4 justify-between  w-full sm:flex-row flex-col">
          <div>
            <h1 className="text-3xl text-primary font-bold mb-4">About Us</h1>
            <p className="text-sm text-gray-600 dark:text-white leading-5">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quisquam, quos.
              Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Quisquam, quos.
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Image
              src="/image/2.jpg"
              alt="quote"
              width={500}
              height={500}
              className=" rounded-md sm:w-[392px] sm:h-[271px] w-full h-full"
            />
            <div className="flex justify-between  w-full flex-row gap-4">
              <div className="sm:w-[183.08px] sm:h-[183.08px] w-[140px] h-[140px] text-4xl rounded-full flex justify-center items-center text-white bg-primary">
                <p className="text-2xl font-bold">+10</p>
              </div>
              <div className="sm:w-[183.08px] sm:h-[183.08px] w-[140px] h-[140px] text-4xl rounded-full flex justify-center items-center text-white bg-primary">
                <p className="text-2xl font-bold">+100</p>
              </div>
            </div>
          </div>
        </div>
      </Space>
      <Space>
        <div className="flex w-full justify-between  sm:flex-row flex-col gap-4">
          <Image
            src="/image/2.jpg"
            alt="quote"
            width={500}
            height={500}
            className=" rounded-md sm:w-[392px] sm:h-[271px] w-full h-full"
          />
          <Image
            src="/image/2.jpg"
            alt="quote"
            width={500}
            height={500}
            className=" rounded-md sm:w-[392px] sm:h-[271px] w-full h-full"
          />
        </div>
      </Space>

      <Space className="flex sm:flex-row flex-col w-full  gap-8 justify-center items-center">
        <Card
          src="/image/barham.jpg"
          title="Barham Aziz"
          description="Founder & CEO"
        />
        <Card
          src="/image/barham.jpg"
          title="Barham Al-Khatib"
          description="Founder & CEO"
        />
      </Space>
    </ShowcaseLayout>
  );
}
