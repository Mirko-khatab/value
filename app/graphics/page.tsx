import ShowcaseLayout from "@/app/ui/showcase-layout";
import { fetchGraphics } from "@/app/lib/data";
import Image from "next/image";

// Random size configurations for masonry layout
const sizeClasses = [
  "col-span-1 row-span-1", // Small
  "col-span-2 row-span-1", // Wide
  "col-span-1 row-span-2", // Tall
  "col-span-2 row-span-2", // Large
  "col-span-3 row-span-2", // Extra wide
  "col-span-2 row-span-3", // Extra tall
];

// Function to get a random size class
function getRandomSize(index: number): string {
  // Use index-based randomization for consistent layout on refreshes
  const sizeIndex = (index * 7) % sizeClasses.length;
  return sizeClasses[sizeIndex];
}

export default async function GraphicsPage() {
  const graphics = await fetchGraphics();

  return (
    <ShowcaseLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Graphics Showcase
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[200px] gap-4">
          {graphics?.map((graphic, index) => (
            <div
              key={graphic.id}
              className={`${getRandomSize(
                index
              )} relative overflow-hidden rounded-lg group cursor-pointer hover:scale-[1.02] transition-transform duration-300`}
            >
              <Image
                src={graphic.image_url}
                alt={`Graphic ${graphic.id}`}
                fill
                className="object-cover group-hover:brightness-110 transition-all duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {(!graphics || graphics.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No graphics available yet.
            </p>
          </div>
        )}
      </div>
    </ShowcaseLayout>
  );
}
