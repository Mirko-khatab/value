import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { socialFormFields } from "@/app/ui/dashboard/config";
import { createQuote } from "@/app/lib/actions";

export default async function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createQuote({ message: null, errors: {} }, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Social", href: "/dashboard/social" },
          {
            label: "Create Social",
            href: "/dashboard/social/create",
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Social
        </h1>
        <DashboardForm
          fields={socialFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/social"
          entityName="Social"
          mode="create"
        />
      </div>
    </main>
  );
}
