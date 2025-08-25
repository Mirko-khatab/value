import Breadcrumbs from "@/app/ui/project/breadcrumbs";
import { fetchSpecialProjects } from "@/app/lib/data";
import Form from "@/app/ui/special_projects/form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Special Projects", href: "/dashboard/special-projects" },
          {
            label: "Create Special Project",
            href: "/dashboard/special-projects/create",
            active: true,
          },
        ]}
      />
      <Form mode="create" />
    </main>
  );
}
