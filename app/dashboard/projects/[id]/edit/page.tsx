import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { projectsFormFields } from "@/app/ui/dashboard/config";
import {
  fetchProjectById,
  fetchProjectCategories,
  fetchProjectGalleriesData,
  fetchLocations,
} from "@/app/lib/data";
import { notFound } from "next/navigation";
import EditProjectForm from "@/app/ui/project/edit-project-form";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [projectResult, categories, galleries, locations] = await Promise.all([
    fetchProjectById(id),
    fetchProjectCategories(),
    fetchProjectGalleriesData(id),
    fetchLocations(),
  ]);

  if (!projectResult || projectResult.length === 0) {
    notFound();
  }

  const project = projectResult[0];

  // Format the date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateValue: string | Date) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  // Prepare project data with formatted date
  const projectData = {
    ...project,
    date: formatDateForInput(project.date),
  };

  // Convert galleries to the format expected by the upload component
  const initialGalleryImages = galleries.map((gallery) => ({
    url: gallery.image_url,
    altText: gallery.alt_text,
    orderIndex: parseInt(gallery.order_index) || 1,
  }));

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
      <EditProjectForm
        projectId={id}
        initialData={projectData}
        categories={categories}
        locations={locations}
        initialGalleryImages={initialGalleryImages}
      />
    </main>
  );
}
