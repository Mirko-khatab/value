import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { projectsFormFields } from "@/app/ui/dashboard/config";
import { createProject } from "@/app/lib/actions";
import { fetchProjectCategories } from "@/app/lib/data";
import MultipleImageUpload from "@/app/ui/project/multiple-image-upload";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  const categories = await fetchProjectCategories();

  async function handleSubmit(formData: FormData) {
    "use server";
    await createProject({ message: null, errors: {} }, formData);
  }

  // Update the project_category field with dynamic options
  const formFields = projectsFormFields.map((field) => {
    if (field.name === "project_category") {
      return {
        ...field,
        type: "select" as const,
        options: categories.map((cat) => ({
          value: cat.id,
          label: cat.title_en,
        })),
      };
    }
    return field;
  });

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
      <DashboardForm
        fields={formFields}
        mode="create"
        onSubmit={handleSubmit}
        cancelPath="/dashboard/projects"
        entityName="Project"
        customContent={
          <div className="mb-4">
            <label className="mb-3 block text-sm font-medium">
              Project Images
            </label>
            <MultipleImageUpload title="Upload project images" />
          </div>
        }
      />
    </main>
  );
}
