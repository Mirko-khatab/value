import { EventSlide } from "@/app/ui/event/event-slide";

export default function Page() {
  return (
    <div>
      <EventSlide autoPlay={true} interval={8000} />
    </div>
  );
}
