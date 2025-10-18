import Form from "@/app/ui/products/create-form";
import Breadcrumbs from "@/app/ui/products/breadcrumbs";
import { fetchProductById, fetchProductGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [product, galleries] = await Promise.all([
    fetchProductById(id),
    fetchProductGalleries(id),
  ]);

  if (!product || product.length === 0) {
    notFound();
  }

  const productData = product[0];

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
          { label: "Products", href: "/dashboard/products" },
          {
            label: "Edit Product",
            href: `/dashboard/products/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form
        mode="edit"
        product={productData}
        initialGalleryImages={initialGalleryImages}
      />
    </main>
  );
}
