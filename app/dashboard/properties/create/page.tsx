import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { propertiesFormFields } from "@/app/ui/dashboard/config";
import { createProperty } from "@/app/lib/actions";

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createProperty(formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties" },
          {
            label: "Create Property",
            href: "/dashboard/properties/create",
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={propertiesFormFields}
        mode="create"
        onSubmit={handleSubmit}
        cancelPath="/dashboard/properties"
        entityName="Property"
      />
    </main>
  );
}
