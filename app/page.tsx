import AcmeLogo from "@/app/ui/value-logo";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import styles from "@/app/ui/home.module.css";
import Image from "next/image";
import ShowcaseLayout from "@/app/ui/showcase-layout";
import Text from "@/app/ui/text";
import Project from "./ui/home/project";

export default function Page() {
  return (
    <ShowcaseLayout>
      {/* Hero Section */}
      <div className=" mb-16 flex flex-col md:flex-row gap-8 justify-start items-start">
        <div className="flex flex-col gap-4">
          <Project
            title="Project 1"
            description="Description 1 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 1"
            type={1}
          />
          <Project
            title="Project 2"
            description="Description 2 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 2"
            type={2}
          />
        </div>
        <div className="flex flex-col gap-4">
          <Project
            title="Project 2"
            description="Description 2 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 2"
            type={2}
          />
          <Project
            title="Project 2"
            description="Description 2 aksjd;fkasjd;flk asdf;kjsd;flk asdkljf;sldjf lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
            image_url="/image/2.jpg"
            screen="screen 2"
            type={2}
          />
        </div>
      </div>
    </ShowcaseLayout>
  );
}
