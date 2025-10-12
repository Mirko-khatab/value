import Form from "@/app/ui/banner/form";
import Breadcrumbs from "@/app/ui/banner/breadcrumbs";
import { fetchBannerById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const banner = await fetchBannerById(id);

  if (!banner || banner.length === 0) {
    notFound();
  }

  const bannerData = banner[0];

  // Convert to plain object to ensure proper serialization
  const serializedBanner = {
    id: bannerData.id,
    title_ku: bannerData.title_ku,
    title_ar: bannerData.title_ar,
    title_en: bannerData.title_en,
    image_url: bannerData.image_url,
    video_url: bannerData.video_url,
    type: bannerData.type,
    is_active: bannerData.is_active,
    sort_order: bannerData.sort_order,
  };

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
      <Form mode="edit" banner={serializedBanner} />
    </main>
  );
}
