import Form from "@/app/ui/special_projects/form";
import Breadcrumbs from "@/app/ui/project/breadcrumbs";
import { fetchSpecialProjectsById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const specialProject = await fetchSpecialProjectsById(id);

  if (!specialProject || specialProject.length === 0) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Special Projects", href: "/dashboard/special-projects" },
          {
            label: "Edit Special Project",
            href: `/dashboard/special-projects/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form specialProject={specialProject[0]} mode="edit" />
    </main>
  );
}
