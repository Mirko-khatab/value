import Form from "@/app/ui/social-media/form";
import Breadcrumbs from "@/app/ui/social-media/breadcrumbs";
import { fetchSocialMediaById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const socialMedia = await fetchSocialMediaById(id);

  if (!socialMedia || socialMedia.length === 0) {
    notFound();
  }

  const socialMediaData = socialMedia[0];

  // Convert to plain object to ensure proper serialization
  const serializedSocialMedia = {
    id: socialMediaData.id,
    type: socialMediaData.type,
    url: socialMediaData.url,
  };

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
      <Form key={id} mode="edit" socialMedia={serializedSocialMedia} />
    </main>
  );
}
