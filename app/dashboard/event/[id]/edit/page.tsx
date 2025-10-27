import Form from "@/app/ui/event/form";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { fetchEventById, fetchEventGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [event, galleries] = await Promise.all([
    fetchEventById(id),
    fetchEventGalleries(id),
  ]);

  if (!event || event.length === 0) {
    notFound();
  }

  const eventData = event[0];

  // Convert galleries to the format expected by the form
  const initialGalleryImages = galleries.map((gallery) => ({
    url: gallery.image_url,
    altText: gallery.alt_text,
    orderIndex: parseInt(gallery.order_index) || 1,
  }));

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Events", href: "/dashboard/event" },
          {
            label: "Edit Event",
            href: `/dashboard/event/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Event
        </h1>
        <Form
          mode="edit"
          event={eventData}
          initialGalleryImages={initialGalleryImages}
        />
      </div>
    </main>
  );
}
