"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createProject, ProjectState } from "@/app/lib/actions";
import MultipleImageUpload from "./multiple-image-upload";
import { ProjectCategory, Location, SubCategory } from "@/app/lib/definitions";

interface CreateProjectFormProps {
  categories: ProjectCategory[];
  locations: Location[];
}

export default function CreateProjectForm({
  categories,
  locations,
}: CreateProjectFormProps) {
  const [galleryImages, setGalleryImages] = useState<
    { url: string; altText: string; orderIndex: number }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);

  const handleImagesChange = useCallback(
    (images: { url: string; altText: string; orderIndex: number }[]) => {
      setGalleryImages(images);
    },
    []
  );

  // Fetch sub-categories when category changes
  useEffect(() => {
    if (selectedCategory) {
      setLoadingSubCategories(true);
      fetch(`/api/sub-categorys/by-category/${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          setSubCategories(data);
          setLoadingSubCategories(false);
        })
        .catch((err) => {
          console.error("Failed to fetch sub-categories:", err);
          setSubCategories([]);
          setLoadingSubCategories(false);
        });
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      const nativeFormData = new FormData(e.currentTarget);

      // Add gallery images to form data  
      galleryImages.forEach((image, index) => {
        nativeFormData.append(`image_url_${index}`, image.url);
        nativeFormData.append(`alt_text_${index}`, image.altText);
        nativeFormData.append(
          `order_index_${index}`,
          image.orderIndex.toString()
        );
      });

      const result = await createProject(
        { message: null, errors: {} },
        nativeFormData
      );

      if (result && result.errors && Object.keys(result.errors).length > 0) {
        setError(result.message || "Please fix the errors in the form");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard/projects";
      }, 1000);
    } catch (err) {
      console.error("Failed to create project:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-gray-900 dark:text-gray-200">
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6 transition-colors duration-200">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            <p className="text-gray-900 dark:text-gray-200">
              Project created successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-700">
            <p className="text-gray-900 dark:text-gray-200">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 grid-cols-1 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-4 md:p-6 gap-4 mb-4">
          {/* Title English */}
          <div className="mb-4">
            <label
              htmlFor="title_en"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_en"
              name="title_en"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Title Kurdish */}
          <div className="mb-4">
            <label
              htmlFor="title_ku"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Title (Kurdish) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_ku"
              name="title_ku"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Title Arabic */}
          <div className="mb-4">
            <label
              htmlFor="title_ar"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Title (Arabic) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_ar"
              name="title_ar"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Description English */}
          <div className="mb-4 md:col-span-2">
            <label
              htmlFor="description_en"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Description (English) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description_en"
              name="description_en"
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Description Kurdish */}
          <div className="mb-4 md:col-span-2">
            <label
              htmlFor="description_ku"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Description (Kurdish) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description_ku"
              name="description_ku"
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Description Arabic */}
          <div className="mb-4 md:col-span-2">
            <label
              htmlFor="description_ar"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Description (Arabic) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description_ar"
              name="description_ar"
              required
              rows={3}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700  "
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Project Date{" "}
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              htmlFor="project_category"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Category <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              id="project_category"
              name="project_category"
              required
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title_en}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category (conditional) */}
          {selectedCategory && (
            <div className="mb-4">
              <label
                htmlFor="project_sub_category"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Sub-Category {subCategories.length > 0 && "(Optional)"}
              </label>
              <select
                id="project_sub_category"
                name="project_sub_category"
                disabled={loadingSubCategories}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700 disabled:opacity-50"
              >
                <option value="">
                  {loadingSubCategories
                    ? "Loading..."
                    : subCategories.length > 0
                    ? "Select Sub-Category (Optional)"
                    : "No sub-categories available"}
                </option>
                {subCategories.map((subCat) => (
                  <option key={subCat.id} value={subCat.id}>
                    {subCat.title_en}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location */}
          <div className="mb-4">
            <label
              htmlFor="location_id"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Location <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              id="location_id"
              name="location_id"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            >
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.city_en}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label
              htmlFor="project_status"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Status <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              id="project_status"
              name="project_status"
              required
              defaultValue="0"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            >
              <option value="0">In Progress</option>
              <option value="1">Finished</option>
            </select>
          </div>

          {/* Project Type */}
          <div className="mb-4">
            <label
              htmlFor="project_type"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-200"
            >
              Project Type <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              id="project_type"
              name="project_type"
              required
              defaultValue="0"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-200 dark:bg-gray-700"
            >
              <option value="0">Design</option>
              <option value="1">Implement</option>
              <option value="2">Design & Implement</option>
            </select>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="mb-4">
          <label className="mb-3 block text-sm font-medium text-gray-900 dark:text-gray-200">
            Project Images
          </label>
          <MultipleImageUpload
            title="Upload project images"
            onImagesChange={handleImagesChange}
          />
        </div>

        {/* Required fields note */}
        <div className="mb-4 text-sm font-medium text-gray-900 dark:text-gray-200">
          <span className="text-red-500 dark:text-red-400 dark:bg-gray-700">
            *
          </span>{" "}
          Required fields
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/projects"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
