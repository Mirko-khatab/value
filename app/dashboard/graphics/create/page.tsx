"use client";
import { useState } from "react";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { createGraphicsBulk } from "@/app/lib/actions";
import BulkImageUpload from "@/app/ui/graphics/bulk-image-upload";
import { useRouter } from "next/navigation";

export default function Page() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (imageUrls.length === 0) {
      setError("Please upload at least one image before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const result = await createGraphicsBulk(imageUrls);

      if (result.success) {
        setSuccess(result.message || "Graphics created successfully!");
        setTimeout(() => {
          router.push("/dashboard/graphics");
        }, 1500);
      } else {
        setError(result.message || "Failed to create graphics.");
        setIsSubmitting(false);
      }
    } catch (error) {
      setError("Failed to create graphics. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Graphics", href: "/dashboard/graphics" },
          {
            label: "Add Graphics",
            href: "/dashboard/graphics/create",
            active: true,
          },
        ]}
      />
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
            <label className="mb-3 block text-sm font-medium">
              Upload Multiple Graphics
            </label>
            <p className="mb-4 text-xs text-gray-600">
              Select multiple images to upload at once. Each image will create a
              separate graphic entry.
            </p>
            <BulkImageUpload onImagesChange={setImageUrls} />
          </div>
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
              {success}
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <a
            href="/dashboard/graphics"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={isSubmitting || imageUrls.length === 0}
            className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Adding..."
              : `Add ${imageUrls.length || ""} Graphic${
                  imageUrls.length !== 1 ? "s" : ""
                }`}
          </button>
        </div>
      </form>
    </main>
  );
}
