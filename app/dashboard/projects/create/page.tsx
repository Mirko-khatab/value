import Breadcrumbs from "@/app/ui/project/breadcrumbs";
import Form from "@/app/ui/project/create-form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          {
            label: "Create Project",
            href: "/dashboard/projects/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
