import Form from "@/app/ui/products/create-form";
import Breadcrumbs from "@/app/ui/products/breadcrumbs";
import {
  fetchMachineById,
  fetchMachineGalleries,
  fetchMachineGroups,
} from "@/app/lib/data";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [machine, galleries, machineGroups] = await Promise.all([
    fetchMachineById(id),
    fetchMachineGalleries(id),
    fetchMachineGroups(),
  ]);

  if (!machine || machine.length === 0) {
    notFound();
  }

  const machineData = machine[0];

  // Convert galleries to the format expected by the form
  const initialGalleryImages = galleries.map((gallery) => ({
    url: gallery.image_url,
    altText: gallery.alt_text,
    orderIndex: parseInt(gallery.order_index) || 1, // Handle potential parsing errors
  }));

  // Convert to plain objects to ensure proper serialization
  const serializedMachineGroups = machineGroups.map((group) => ({
    id: group.id,
    title_ku: group.title_ku,
    title_ar: group.title_ar,
    title_en: group.title_en,
  }));

  const serializedMachine = {
    id: machineData.id,
    machine_group_id: machineData.machine_group_id,
    title_ar: machineData.title_ar,
    title_en: machineData.title_en,
    title_ku: machineData.title_ku,
    description_ar: machineData.description_ar,
    description_en: machineData.description_en,
    description_ku: machineData.description_ku,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Machines", href: "/dashboard/machines" },
          {
            label: "Edit Machine",
            href: `/dashboard/machines/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        mode="edit"
        machine={serializedMachine}
        initialGalleryImages={initialGalleryImages}
        machineGroups={serializedMachineGroups}
      />
    </main>
  );
}
