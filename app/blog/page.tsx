import ShowcaseLayout from "@/app/ui/showcase-layout";
import Project from "../ui/home/custom-card";
import { Space } from "../ui/utils/space";
import Quote from "../ui/home/quote";

export default function Page() {
  return (
    <ShowcaseLayout>
      <Space>
        <Quote />
      </Space>
      <Space className="  flex flex-col sm:flex-row gap-8 justify-start ">
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
      </Space>
      <Space className="  flex flex-col sm:flex-row gap-8 justify-start ">
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
      </Space>
    </ShowcaseLayout>
  );
}
