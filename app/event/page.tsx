import { EventSlide } from "@/app/ui/event/event-slide";
import ShowcaseLayout from "@/app/ui/showcase-layout";
export default function Page() {
  return (
    <ShowcaseLayout>
      <div className="min-h-screen w-full">
        <div className="w-full md:pt-60 pt-40">
          <EventSlide autoPlay={true} interval={8000} />
        </div>
      </div>
    </ShowcaseLayout>
  );
}
