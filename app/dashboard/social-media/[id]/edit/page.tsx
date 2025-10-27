import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { socialMediaFormFields } from "@/app/ui/dashboard/config";
import { fetchSocialMediaById } from "@/app/lib/data";
import { updateSocialMedia } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const socialMedia = await fetchSocialMediaById(id);

  if (!socialMedia) {
    notFound();
  }

  const socialMediaData = socialMedia;

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateSocialMedia(id, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Social Media", href: "/dashboard/social-media" },
          {
            label: "Edit Social Media",
            href: `/dashboard/social-media/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Social Media
        </h1>
        <DashboardForm
          key={id}
          fields={socialMediaFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/social-media"
          entityName="Social Media"
          mode="edit"
          initialData={socialMediaData}
        />
      </div>
    </main>
  );
}
