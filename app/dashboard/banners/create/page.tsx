import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { bannersFormFields } from "@/app/ui/dashboard/config";
import { createBanner } from "@/app/lib/actions";

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createBanner({ message: null, errors: {} }, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Banners", href: "/dashboard/banners" },
          {
            label: "Create Banner",
            href: "/dashboard/banners/create",
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Banner
        </h1>
        <DashboardForm
          fields={bannersFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/banners"
          entityName="Banner"
          mode="create"
        />
      </div>
    </main>
  );
}
