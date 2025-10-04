"use client";

import { useState, useEffect } from "react";
import AcmeLogo from "@/app/ui/value-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import Image from "next/image";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import Text from "@/app/ui/text";
import CustomCard from "./ui/home/custom-card";
import Quote from "./ui/home/quote";
import { Space } from "./ui/utils/space";
import { Card } from "./ui/home/card";
import { Slide } from "./ui/home/slide";
import Intro from "@/app/ui/intro";

export default function Page() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before (stored permanently)
    const hasSeenIntro = localStorage.getItem("hasSeenIntro");
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    localStorage.setItem("hasSeenIntro", "true");
  };

  return (
    <>
      {showIntro && <Intro onComplete={handleIntroComplete} />}

      <div
        className={`transition-all duration-1000 ease-out ${
          showIntro
            ? "opacity-0 translate-y-12 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        style={{ transitionDelay: showIntro ? "0ms" : "300ms" }}
      >
        {/* Hero Section - Full Screen at Top */}
        <Slide />

        <ShowcaseLayout>
          {/* Services Section */}
          <section className="mx-2 py-12 md:py-16 lg:py-20">
            <div className="grid grid-cols-2 gap-4">
              <CustomCard
                title="Engineering Services"
                link="#"
                image_url="/image/2.jpg"
                width={1000}
                height={200}
              />

              <CustomCard
                title="Interior Design"
                link="#"
                image_url="/image/barham.jpg"
                width={1000}
                height={200}
              />
            </div>

            {/* Bottom row: three regular cards each span 4/12 */}
            <CustomCard
              title="Infrastructure Services"
              link="#"
              image_url="/image/barham.jpg"
            />

            <CustomCard
              title="Architecture Design"
              link="#"
              image_url="/image/2.jpg"
            />

            <CustomCard
              title="Construction & Project Management"
              link="#"
              image_url="/image/barham.jpg"
            />
          </section>
          {/* end of services section */}

          {/* quote section */}
          {/* <Space>
        <Quote />
      </Space> */}
          {/* <Space className="grid grid-cols-2 sm:grid-cols-3 w-full  lg:grid-cols-4 gap-4 justify-items-center">
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
        <Card src="/image/2.jpg" />
      </Space>
      <Space className="  flex flex-col sm:flex-row gap-8 justify-start ">
        <div className="flex flex-col gap-4">
          <CustomCard
            title="Project 1"
            description="Description 1 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 1"
            type={1}
          />
          <CustomCard
            title="Project 2"
            description="Description 2 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 2"
            type={2}
          />
        </div>
        <div className="flex flex-col gap-4">
          <CustomCard
            title="Project 2"
            description="Description 2 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 2"
            type={2}
          />
          <CustomCard
            title="Project 2"
            description="Description 2 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 2"
            type={2}
          />
        </div>
      </Space> */}
          {/* end of quote section */}
        </ShowcaseLayout>
      </div>
    </>
  );
}
