import DashboardForm from "@/app/ui/dashboard/form";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { propertiesFormFields } from "@/app/ui/dashboard/config";
import { fetchPropertyById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { updateProperty } from "@/app/lib/actions";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const property = await fetchPropertyById(id);

  if (!property || property.length === 0) {
    notFound();
  }

  const propertyData = property[0];

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateProperty(id, formData);
  }

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
      <DashboardForm
        fields={propertiesFormFields}
        mode="edit"
        initialData={propertyData}
        onSubmit={handleSubmit}
        cancelPath="/dashboard/properties"
        entityName="Property"
      />
    </main>
  );
}
