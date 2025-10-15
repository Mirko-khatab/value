import { fetchMachineById, fetchMachineGalleries } from "@/app/lib/data";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/app/ui/products/breadcrumbs";
import { UpdateMachine, DeleteMachine } from "@/app/ui/products/buttons";
import GalleryList from "@/app/ui/products/gallery-list";
import Image from "next/image";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [machine, galleries] = await Promise.all([
    fetchMachineById(id),
    fetchMachineGalleries(id),
  ]);

  if (!machine || machine.length === 0) {
    notFound();
  }

  const machineData = machine[0];
  const mainImage = galleries.length > 0 ? galleries[0] : null;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Machines", href: "/dashboard/machines" },
          {
            label: machineData.title_en,
            href: `/dashboard/machines/${id}`,
            active: true,
          },
        ]}
      />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {machineData.title_en}
          </h1>
          <div className="flex gap-2">
            <UpdateMachine id={id} />
            <DeleteMachine id={id} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Machine Details */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Machine Details
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Titles</h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Kurdish:</span>{" "}
                      {machineData.title_ku}
                    </p>
                    <p>
                      <span className="font-medium">Arabic:</span>{" "}
                      {machineData.title_ar}
                    </p>
                    <p>
                      <span className="font-medium">English:</span>{" "}
                      {machineData.title_en}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Descriptions
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-medium">Kurdish:</span>{" "}
                      {machineData.description_ku}
                    </p>
                    <p>
                      <span className="font-medium">Arabic:</span>{" "}
                      {machineData.description_ar}
                    </p>
                    <p>
                      <span className="font-medium">English:</span>{" "}
                      {machineData.description_en}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-2">{machineData.gallery_order_index}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Machine Main Image */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Main Image
            </h2>
            {mainImage ? (
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={mainImage.image_url}
                  alt={mainImage.alt_text}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="aspect-square w-full rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">No main image</p>
              </div>
            )}
            {mainImage && (
              <p className="mt-2 text-sm text-gray-600">{mainImage.alt_text}</p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-12">
          <GalleryList galleries={galleries} parentId={id} parentType={2} />
        </div>
      </div>
    </main>
  );
}
