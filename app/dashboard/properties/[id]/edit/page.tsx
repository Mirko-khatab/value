import Form from "@/app/ui/properties/form";
import Breadcrumbs from "@/app/ui/properties/breadcrumbs";
import { fetchPropertyById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const property = await fetchPropertyById(id);

  if (!property || property.length === 0) {
    notFound();
  }

  const propertyData = property[0];

  // Convert to plain object to ensure proper serialization
  const serializedProperty = {
    id: propertyData.id,
    key: propertyData.key,
    value_ku: propertyData.value_ku,
    value_ar: propertyData.value_ar,
    value_en: propertyData.value_en,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties" },
          {
            label: "Edit Property",
            href: `/dashboard/properties/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form mode="edit" property={serializedProperty} />
    </main>
  );
}
