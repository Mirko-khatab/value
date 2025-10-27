import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { fetchProjectCategories, fetchLocations } from "@/app/lib/data";
import CreateProjectForm from "@/app/ui/project/create-project-form";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function Page() {
  const [categories, locations] = await Promise.all([
    fetchProjectCategories(),
    fetchLocations(),
  ]);

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
      <CreateProjectForm categories={categories} locations={locations} />
    </main>
  );
}
