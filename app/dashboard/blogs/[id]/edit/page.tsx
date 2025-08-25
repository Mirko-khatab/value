import Form from "@/app/ui/blog/form";
import Breadcrumbs from "@/app/ui/blog/breadcrumbs";
import { fetchBlogById, fetchBlogGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [blog, galleries] = await Promise.all([
    fetchBlogById(id),
    fetchBlogGalleries(id),
  ]);

  if (!blog || blog.length === 0) {
    notFound();
  }

  const blogData = blog[0];

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
          { label: "Blogs", href: "/dashboard/blogs" },
          {
            label: "Edit Blog",
            href: `/dashboard/blogs/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        mode="edit"
        blog={blogData}
        initialGalleryImages={initialGalleryImages}
      />
    </main>
  );
}
