import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import DashboardForm from "@/app/ui/dashboard/form";
import { bannersFormFields } from "@/app/ui/dashboard/config";
import { fetchBannerById } from "@/app/lib/data";
import { updateBanner } from "@/app/lib/actions";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const banner = await fetchBannerById(id);

  if (!banner || banner.length === 0) {
    notFound();
  }

  const bannerData = banner[0];

  async function handleSubmit(formData: FormData) {
    "use server";
    await updateBanner(id, formData);
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Banners", href: "/dashboard/banners" },
          {
            label: "Edit Banner",
            href: `/dashboard/banners/${id}/edit`,
            active: true,
          },
        ]}
      />
      <div className="mt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Banner
        </h1>
        <DashboardForm
          fields={bannersFormFields}
          onSubmit={handleSubmit}
          cancelPath="/dashboard/banners"
          entityName="Banner"
          mode="edit"
          initialData={bannerData}
        />
      </div>
    </main>
  );
}
