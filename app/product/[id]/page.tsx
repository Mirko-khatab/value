import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Space } from "@/app/ui/utils/space";
import { Machine, Gallery } from "@/app/lib/definitions";
import { fetchMachineById, fetchMachineGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";
import ProductGalleryClient from "./product-gallery-client";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id: productId } = await params;

  // Server-side data fetching
  const [machines, galleries] = await Promise.all([
    fetchMachineById(productId),
    fetchMachineGalleries(productId),
  ]);

  if (machines.length === 0) {
    notFound();
  }

  const product = machines[0];

  return (
    <ShowcaseLayout>
      <Space className="flex sm:flex-row justify-between sm:items-start items-center flex-col gap-8">
        <div className="flex flex-col gap-4 w-full sm:w-1/2">
          <h1 className="sm:text-2xl text-xl font-bold">
            {product.title_en || product.title_ar || product.title_ku}
          </h1>
          <p>
            {product.description_en ||
              product.description_ar ||
              product.description_ku}
          </p>
        </div>
        <ProductGalleryClient galleries={galleries} />
      </Space>
    </ShowcaseLayout>
  );
}
