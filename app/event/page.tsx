import ShowcaseLayout from "@/app/ui/showcase-layout";
import CustomeCard from "../ui/home/custom-card";
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
          <CustomeCard
            title="Project 1"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/1"
          />
          <CustomeCard
            title="Project 2"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/2"
          />
        </div>
        <div className="flex flex-col gap-4">
          <CustomeCard
            title="Project 3"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/3"
          />
          <CustomeCard
            title="Project 4"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/4"
          />
        </div>
      </Space>
      <Space className="  flex flex-col sm:flex-row gap-8 justify-start ">
        <div className="flex flex-col gap-4">
          <CustomeCard
            title="Project 5"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/5"
          />
          <CustomeCard
            title="Project 6"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/6"
          />
        </div>
        <div className="flex flex-col gap-4">
          <CustomeCard
            title="Project 7"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/7"
          />
          <CustomeCard
            title="Project 8"
            image_url="/image/2.jpg"
            width={400}
            height={300}
            link="/event/8"
          />
        </div>
      </Space>
    </ShowcaseLayout>
  );
}
