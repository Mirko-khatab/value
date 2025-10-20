import { fetchGraphics } from "@/app/lib/data";
import { CreateGraphic, DeleteGraphic } from "@/app/ui/graphics/buttons";
import Image from "next/image";

export default async function Page() {
  const graphics = await fetchGraphics();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl">Graphics</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <CreateGraphic />
      </div>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {graphics?.map((graphic) => (
          <div
            key={graphic.id}
            className="relative group rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-sm hover:shadow-lg hover:border-gray-300 transition-all"
          >
            <div className="relative aspect-square">
              <Image
                src={graphic.image_url}
                alt="Graphic"
                fill
                className="object-cover"
              />
              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>
            {/* Delete button - always visible on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <DeleteGraphic id={graphic.id} />
            </div>
          </div>
        ))}
      </div>
      {(!graphics || graphics.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No graphics available yet.</p>
        </div>
      )}
    </div>
  );
}
