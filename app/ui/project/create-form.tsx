"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createProject, updateProject, ProjectState } from "@/app/lib/actions";
import { Project } from "@/app/lib/definitions";
import MultipleImageUpload from "./multiple-image-upload";

export default function Form({
  mode,
  project,
  initialGalleryImages = [],
}: {
  mode: "create" | "edit";
  project?: Project;
  initialGalleryImages?: { url: string; altText: string; orderIndex: number }[];
}) {
  const isEditMode = mode === "edit";

  const [galleryImages, setGalleryImages] =
    useState<{ url: string; altText: string; orderIndex: number }[]>(
      initialGalleryImages
    );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update gallery images when project data changes
  useEffect(() => {
    if (isEditMode && initialGalleryImages.length > 0) {
      setGalleryImages(initialGalleryImages);
    }
  }, [isEditMode, initialGalleryImages]);

  const handleImagesChange = useCallback(
    (images: { url: string; altText: string; orderIndex: number }[]) => {
      console.log("Gallery images updated:", images.length, "images");
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

      console.log(
        "Submitting project form:",
        mode,
        "mode with",
        galleryImages.length,
        "images"
      );

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
        if (isEditMode && project) {
          // Update existing project
          await updateProject(project.id, formData);
        } else {
          // Create new project
          await createProject({ message: null, errors: {} }, formData);
        }

        // If we reach here, the operation was successful
        setSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = "/dashboard/projects";
        }, 1000);
      } catch (error) {
        console.error(`Failed to ${mode} project:`, error);
        setError(
          error instanceof Error
            ? error.message
            : `Failed to ${mode} project. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [galleryImages, isSubmitting, mode, isEditMode, project]
  );

  return (
    <form action={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
            Project {isEditMode ? "updated" : "created"} successfully!
            Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Title Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label
              htmlFor="title_ku"
              className="mb-2  dark:text-gray-900  block text-sm font-medium"
            >
              Title (Kurdish) <span className="text-red-500">*</span>
            </label>
            <input
              id="title_ku"
              name="title_ku"
              type="text"
              required
              defaultValue={isEditMode ? project?.title_ku : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
              placeholder="Enter Kurdish title"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="title_ar"
              className="mb-2  dark:text-gray-900  block text-sm font-medium"
            >
              Title (Arabic) <span className="text-red-500">*</span>
            </label>
            <input
              id="title_ar"
              name="title_ar"
              type="text"
              required
              defaultValue={isEditMode ? project?.title_ar : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
              placeholder="Enter Arabic title"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="title_en"
              className="mb-2  dark:text-gray-900  block text-sm font-medium"
            >
              Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              id="title_en"
              name="title_en"
              type="text"
              required
              defaultValue={isEditMode ? project?.title_en : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
              placeholder="Enter English title"
            />
          </div>
        </div>

        {/* Description Fields */}
        <div className="mb-4">
          <label
            htmlFor="description_ku"
            className="mb-2  dark:text-gray-900  block text-sm font-medium"
          >
            Description (Kurdish) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description_ku"
            name="description_ku"
            required
            rows={3}
            defaultValue={isEditMode ? project?.description_ku : ""}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
            placeholder="Enter Kurdish description"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description_ar"
            className="mb-2  dark:text-gray-900  block text-sm font-medium"
          >
            Description (Arabic) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description_ar"
            name="description_ar"
            required
            rows={3}
            defaultValue={isEditMode ? project?.description_ar : ""}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
            placeholder="Enter Arabic description"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description_en"
            className="mb-2  dark:text-gray-900  block text-sm font-medium"
          >
            Description (English) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description_en"
            name="description_en"
            required
            rows={3}
            defaultValue={isEditMode ? project?.description_en : ""}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
            placeholder="Enter English description"
          />
        </div>

        {/* Date Field */}
        <div className="mb-4">
          <label
            htmlFor="date"
            className="mb-2  dark:text-gray-900 block text-sm font-medium"
          >
            Date <span className="text-red-500">*</span>
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={
              isEditMode
                ? typeof project?.date === "string"
                  ? project.date
                  : project?.date?.toISOString().split("T")[0]
                : ""
            }
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-900  dark:text-gray-900"
          />
        </div>

        {/* Multiple Image Upload */}
        <div className="mb-6">
          <MultipleImageUpload
            onImagesChange={handleImagesChange}
            currentImages={galleryImages}
            initialImages={isEditMode ? initialGalleryImages : []}
            title="Project Images"
          />
        </div>

        {/* Hidden fields for main image (will be set by handleSubmit) */}
        <input type="hidden" name="image_url"  />
        <input type="hidden" name="alt_text" />
        <input type="hidden" name="order_index" />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/projects"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Project"
            : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
