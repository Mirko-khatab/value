"use client";

import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createBlog, updateBlog, BlogState } from "@/app/lib/actions";
import { Blog } from "@/app/lib/definitions";
import { useState, useCallback, useEffect } from "react";
import MultipleImageUpload from "@/app/ui/project/multiple-image-upload";

interface BlogFormProps {
  mode: "create" | "edit";
  blog?: Blog;
  initialGalleryImages?: { url: string; altText: string; orderIndex: number }[];
}

export default function Form({
  mode,
  blog,
  initialGalleryImages = [],
}: BlogFormProps) {
  const isEditMode = mode === "edit";

  const [galleryImages, setGalleryImages] =
    useState<{ url: string; altText: string; orderIndex: number }[]>(
      initialGalleryImages
    );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync gallery images with initial data in edit mode
  useEffect(() => {
    if (isEditMode && initialGalleryImages.length > 0) {
      setGalleryImages(initialGalleryImages);
    }
  }, [isEditMode, initialGalleryImages]);

  const handleImagesChange = useCallback(
    (images: { url: string; altText: string; orderIndex: number }[]) => {
      setGalleryImages(images);
    },
    []
  );

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setSuccess(false);
      setError(null);

      // Clear any existing gallery data from form (for edit mode)
      if (isEditMode) {
        const entries = Array.from(formData.entries());
        entries.forEach(([key]) => {
          if (key.startsWith("gallery_")) {
            formData.delete(key);
          }
        });
      }

      // Add gallery images to form data
      galleryImages.forEach((image, index) => {
        formData.append(`gallery_url_${index}`, image.url);
        formData.append(`gallery_alt_${index}`, image.altText);
        formData.append(`gallery_order_${index}`, image.orderIndex.toString());
      });

      // Add a main image (first gallery image or placeholder)
      if (galleryImages.length > 0) {
        formData.set("image_url", galleryImages[0].url);
        formData.set("alt_text", galleryImages[0].altText);
        formData.set("order_index", galleryImages[0].orderIndex.toString());
      } else {
        // Set default values if no images
        formData.set("image_url", "");
        formData.set("alt_text", "");
        formData.set("order_index", "1");
      }

      try {
        if (isEditMode && blog) {
          // Update existing blog
          await updateBlog(blog.id, formData);
          setSuccess(true);
          setTimeout(() => {
            window.location.href = "/dashboard/event";
          }, 1500);
        } else {
          // Create new blog
          const result = await createBlog(
            { errors: {}, message: null },
            formData
          );
          if (result?.errors && Object.keys(result.errors).length > 0) {
            // Handle validation errors
            const errorMessages = Object.values(result.errors).flat();
            setError(errorMessages.join(", "));
          } else if (result?.message) {
            setError(result.message);
          } else {
            setSuccess(true);
            setTimeout(() => {
              window.location.href = "/dashboard/event";
            }, 1500);
          }
        }
      } catch (err) {
        console.error("Form submission error:", err);
        setError(
          isEditMode
            ? "Failed to update blog. Please try again."
            : "Failed to create blog. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, isEditMode, blog, galleryImages, mode]
  );

  return (
    <form action={handleSubmit} className="space-y-6 dark:text-white">
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 dark:text-red-400 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 dark:text-green-400 bg-green-100 border border-green-400 rounded">
            Blog {isEditMode ? "updated" : "created"} successfully!
            Redirecting...
          </div>
        )}

        {/* Kurdish Title */}
        <div className="mb-4">
          <label htmlFor="title_ku" className="mb-2 block text-sm font-medium">
            Kurdish Title
          </label>
          <input
            id="title_ku"
            name="title_ku"
            type="text"
            required
            defaultValue={isEditMode ? blog?.title_ku : ""}
            className="peer block w-full rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-700 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
          />
        </div>

        {/* Arabic Title */}
        <div className="mb-4">
          <label htmlFor="title_ar" className="mb-2 block text-sm font-medium">
            Arabic Title
          </label>
          <input
            id="title_ar"
            name="title_ar"
            type="text"
            required
            defaultValue={isEditMode ? blog?.title_ar : ""}
            className="peer block w-full rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-700 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
          />
        </div>

        {/* English Title */}
        <div className="mb-4">
          <label htmlFor="title_en" className="mb-2 block text-sm font-medium">
            English Title
          </label>
          <input
            id="title_en"
            name="title_en"
            type="text"
            required
            defaultValue={isEditMode ? blog?.title_en : ""}
            className="peer block w-full rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-700 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
          />
        </div>

        {/* Kurdish Description */}
        <div className="mb-4">
          <label
            htmlFor="description_ku"
            className="mb-2 block text-sm font-medium"
          >
            Kurdish Description
          </label>
          <textarea
            id="description_ku"
            name="description_ku"
            required
            rows={4}
            defaultValue={isEditMode ? blog?.description_ku : ""}
            className="peer block w-full rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-700 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
          />
        </div>

        {/* Arabic Description */}
        <div className="mb-4">
          <label
            htmlFor="description_ar"
            className="mb-2 block text-sm font-medium"
          >
            Arabic Description
          </label>
          <textarea
            id="description_ar"
            name="description_ar"
            required
            rows={4}
            defaultValue={isEditMode ? blog?.description_ar : ""}
            className="peer block w-full rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-700 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
          />
        </div>

        {/* English Description */}
        <div className="mb-4">
          <label
            htmlFor="description_en"
            className="mb-2 block text-sm font-medium"
          >
            English Description
          </label>
          <textarea
            id="description_en"
            name="description_en"
            required
            rows={4}
            defaultValue={isEditMode ? blog?.description_en : ""}
            className="peer block w-full rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 bg-white dark:bg-gray-700 py-2 px-3 text-sm outline-2 placeholder:text-gray-500 dark:placeholder:text-gray-400 "
          />
        </div>

        {/* Gallery Images */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            Gallery Images
          </label>
          <MultipleImageUpload
            onImagesChange={handleImagesChange}
            initialImages={isEditMode ? initialGalleryImages : []}
            title="Blog Images"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/event"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Blog"
            : "Create Blog"}
        </Button>
      </div>
    </form>
  );
}
