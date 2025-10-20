import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { specialProjectsFormFields } from "@/app/ui/dashboard/config";
import { createSpecialProject } from "@/app/lib/actions";

export default async function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createSpecialProject({ message: null, errors: {} }, formData);
  }

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
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Special Project
        </h1>
        <DashboardForm
          fields={specialProjectsFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/special-projects"
          entityName="Special Project"
          mode="create"
        />
      </div>
    </main>
  );
}
