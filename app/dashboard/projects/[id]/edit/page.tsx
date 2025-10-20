import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { projectsFormFields } from "@/app/ui/dashboard/config";
import {
  fetchProjectById,
  fetchProjectCategories,
  fetchProjectGalleries,
} from "@/app/lib/data";
import { updateProject } from "@/app/lib/actions";
import { notFound } from "next/navigation";
import MultipleImageUpload from "@/app/ui/project/multiple-image-upload";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [project, categories, galleries] = await Promise.all([
    fetchProjectById(id),
    fetchProjectCategories(),
    fetchProjectGalleries(id),
  ]);

  if (!project || project.length === 0) {
    notFound();
  }

  const projectData = project[0];

  // Convert galleries to the format expected by the upload component
  const initialGalleryImages = galleries.map((gallery) => ({
    url: gallery.image_url,
    altText: gallery.alt_text,
    orderIndex: parseInt(gallery.order_index) || 1,
  }));

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateProject(id, formData);
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
            label: "Edit Project",
            href: `/dashboard/projects/${id}/edit`,
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={formFields}
        mode="edit"
        initialData={projectData}
        onSubmit={handleSubmit}
        cancelPath="/dashboard/projects"
        entityName="Project"
        customContent={
          <div className="mb-4">
            <label className="mb-3 block text-sm font-medium">
              Project Images
            </label>
            <MultipleImageUpload
              initialImages={initialGalleryImages}
              title="Upload project images"
            />
          </div>
        }
      />
    </main>
  );
}
