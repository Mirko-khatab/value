import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { projectCategoryFormFields } from "@/app/ui/dashboard/config";
import { fetchProjectCategoryById } from "@/app/lib/data";
import { updateProjectCategory } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const categories = await fetchProjectCategoryById(id);

  if (!categories || categories.length === 0) {
    notFound();
  }

  const categoryData = categories[0];

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateProjectCategory(id, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Project Categories", href: "/dashboard/project-category" },
          {
            label: "Edit Project Category",
            href: `/dashboard/project-category/${id}/edit`,
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={projectCategoryFormFields}
        mode="edit"
        initialData={categoryData}
        onSubmit={handleSubmit}
        cancelPath="/dashboard/project-category"
        entityName="Project Category"
      />
    </main>
  );
}
