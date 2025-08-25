import Breadcrumbs from "@/app/ui/machine-groups/breadcrumbs";
import Form from "@/app/ui/machine-groups/form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Machine Groups", href: "/dashboard/machine-groups" },
          {
            label: "Create Machine Group",
            href: "/dashboard/machine-groups/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
