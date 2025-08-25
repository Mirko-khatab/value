import Breadcrumbs from "@/app/ui/properties/breadcrumbs";
import Form from "@/app/ui/properties/form";

export default async function Page() {
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
      <Form mode="create" />
    </main>
  );
}
