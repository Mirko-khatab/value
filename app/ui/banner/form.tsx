"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createBanner, updateBanner, BannerState } from "@/app/lib/actions";
import { Banner } from "@/app/lib/definitions";
import ImageUpload from "@/app/ui/quote/image-upload";
import VideoUpload from "@/app/ui/banner/video-upload";

export default function Form({
  banner,
  mode,
}: {
  banner?: Banner;
  mode: "create" | "edit";
}) {
  const isEditMode = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    title_ku: isEditMode && banner ? banner.title_ku : "",
    title_en: isEditMode && banner ? banner.title_en : "",
    title_ar: isEditMode && banner ? banner.title_ar : "",
    image_url: isEditMode && banner ? banner.image_url || "" : "",
    video_url: isEditMode && banner ? banner.video_url || "" : "",
    type: isEditMode && banner ? banner.type : ("image" as "image" | "video"),
    is_active: isEditMode && banner ? banner.is_active : true,
    sort_order: isEditMode && banner ? banner.sort_order : 0,
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setSuccess(false);
      setError(null);

      try {
        // Validate based on type
        if (formData.type === "image" && !formData.image_url) {
          setError("Please upload an image for the banner");
          return;
        }
        if (formData.type === "video" && !formData.video_url) {
          setError("Please upload a video for the banner");
          return;
        }

        // Create FormData object from our state
        const formDataObj = new FormData();
        formDataObj.append("title_ku", formData.title_ku);
        formDataObj.append("title_en", formData.title_en);
        formDataObj.append("title_ar", formData.title_ar);
        formDataObj.append("image_url", formData.image_url);
        formDataObj.append("video_url", formData.video_url);
        formDataObj.append("type", formData.type);
        formDataObj.append("is_active", formData.is_active.toString());
        formDataObj.append("sort_order", formData.sort_order.toString());

        if (isEditMode && banner) {
          // Update existing banner
          await updateBanner(banner.id, formDataObj);
        } else {
          // Create new banner
          await createBanner({ message: null, errors: {} }, formDataObj);
        }

        // If we reach here, the operation was successful
        setSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = "/dashboard/banners";
        }, 1000);
      } catch (error) {
        console.error(`Failed to ${mode} banner:`, error);
        setError(
          error instanceof Error
            ? error.message
            : `Failed to ${mode} banner. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, mode, isEditMode, banner, formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded">
            Banner {isEditMode ? "updated" : "created"} successfully!
            Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 rounded">
            {error}
          </div>
        )}

        {/* Title Fields */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
          <div className="mb-4">
            <label
              htmlFor="title_ku"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title (Kurdish) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_ku"
              name="title_ku"
              required
              value={formData.title_ku}
              onChange={(e) => handleInputChange("title_ku", e.target.value)}
              placeholder="Enter banner title in Kurdish"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="title_ar"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title (Arabic) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_ar"
              name="title_ar"
              required
              value={formData.title_ar}
              onChange={(e) => handleInputChange("title_ar", e.target.value)}
              placeholder="Enter banner title in Arabic"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="title_en"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title_en"
              name="title_en"
              required
              value={formData.title_en}
              onChange={(e) => handleInputChange("title_en", e.target.value)}
              placeholder="Enter banner title in English"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Banner Type */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Banner Type <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="image"
                checked={formData.type === "image"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-900 dark:text-white">Image</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="video"
                checked={formData.type === "video"}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="mr-2"
              />
              <span className="text-gray-900 dark:text-white">Video</span>
            </label>
          </div>
        </div>

        {/* Image Upload (only for image type) */}
        {formData.type === "image" && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Banner Image <span className="text-red-500">*</span>
            </label>
            <ImageUpload
              onUploadComplete={(imageUrl) =>
                handleInputChange("image_url", imageUrl)
              }
              onUploadError={(error) => setError(error)}
            />
            <input type="hidden" name="image_url" value={formData.image_url} />
            {!formData.image_url && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please upload an image for the banner
              </p>
            )}
          </div>
        )}

        {/* Video Upload (only for video type) */}
        {formData.type === "video" && (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Banner Video <span className="text-red-500">*</span>
            </label>
            <VideoUpload
              onUploadComplete={(videoUrl) => {
                handleInputChange("video_url", videoUrl);
                // Also set image_url as the video thumbnail or same URL
                if (videoUrl) {
                  handleInputChange("image_url", videoUrl);
                }
              }}
              onUploadError={(error) => setError(error)}
              initialVideoUrl={formData.video_url}
            />
            <input type="hidden" name="video_url" value={formData.video_url} />
            {!formData.video_url && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Please upload a video for the banner
              </p>
            )}
          </div>
        )}

        {/* Sort Order */}
        <div className="mb-4">
          <label
            htmlFor="sort_order"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Sort Order
          </label>
          <input
            type="number"
            id="sort_order"
            name="sort_order"
            value={formData.sort_order}
            onChange={(e) =>
              handleInputChange("sort_order", parseInt(e.target.value) || 0)
            }
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Active Status */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange("is_active", e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-900 dark:text-white">Active</span>
          </label>
        </div>

        {/* Required fields note */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/banners"
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? "Update Banner"
            : "Create Banner"}
        </Button>
      </div>
    </form>
  );
}
