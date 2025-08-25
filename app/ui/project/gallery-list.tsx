"use client";
import Image from "next/image";
import { Gallery } from "@/app/lib/definitions";

interface GalleryListProps {
  galleries: Gallery[];
  parentId: string;
  parentType: number;
}

export default function GalleryList({
  galleries,
  parentId,
  parentType,
}: GalleryListProps) {
  if (!galleries || galleries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No gallery images found for this project.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Gallery Images</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleries.map((gallery) => (
          <div key={gallery.id} className="relative group">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={gallery.image_url}
                alt={gallery.alt_text}
                width={300}
                height={300}
                className="h-full w-full object-cover object-center group-hover:opacity-75"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-700">{gallery.alt_text}</p>
              <p className="text-xs text-gray-500">
                Order: {gallery.order_index}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


