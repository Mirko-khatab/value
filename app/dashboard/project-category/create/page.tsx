import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { projectCategoryFormFields } from "@/app/ui/dashboard/config";
import { createProjectCategory } from "@/app/lib/actions";

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createProjectCategory({ message: null, errors: {} }, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Project Categories", href: "/dashboard/project-category" },
          {
            label: "Create Project Category",
            href: "/dashboard/project-category/create",
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={projectCategoryFormFields}
        mode="create"
        onSubmit={handleSubmit}
        cancelPath="/dashboard/project-category"
        entityName="Project Category"
      />
    </main>
  );
}
