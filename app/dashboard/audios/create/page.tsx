import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { audiosFormFields } from "@/app/ui/dashboard/config";
import { createAudio } from "@/app/lib/actions";

export default async function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
    await createAudio({ message: null, errors: {} }, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Audios", href: "/dashboard/audios" },
          {
            label: "Create Audio",
            href: "/dashboard/audios/create",
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Audio
        </h1>
        <DashboardForm
          fields={audiosFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/audios"
          entityName="Audio"
          mode="create"
        />
      </div>
    </main>
  );
}
