import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { specialProjectsFormFields } from "@/app/ui/dashboard/config";
import { fetchSpecialProjectsById } from "@/app/lib/data";
import { updateSpecialProject } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const specialProject = await fetchSpecialProjectsById(id);

  if (!specialProject || specialProject.length === 0) {
    notFound();
  }

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateSpecialProject(id, formData);
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
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Special Project
        </h1>
        <DashboardForm
          fields={specialProjectsFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/special-projects"
          entityName="Special Project"
          mode="edit"
          initialData={specialProject[0]}
        />
      </div>
    </main>
  );
}
