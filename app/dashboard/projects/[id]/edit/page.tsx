import Form from "@/app/ui/project/create-form";
import Breadcrumbs from "@/app/ui/project/breadcrumbs";
import { fetchProjectById, fetchProjectGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [project, galleries] = await Promise.all([
    fetchProjectById(id),
    fetchProjectGalleries(id),
  ]);

  if (!project || project.length === 0) {
    notFound();
  }

  const projectData = project[0];

  // Convert galleries to the format expected by the form
  const initialGalleryImages = galleries.map((gallery) => ({
    url: gallery.image_url,
    altText: gallery.alt_text,
    orderIndex: parseInt(gallery.order_index) || 1, // Handle potential parsing errors
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
      <Form
        mode="edit"
        project={projectData}
        initialGalleryImages={initialGalleryImages}
      />
    </main>
  );
}
