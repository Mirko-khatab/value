"use client";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import {
  createSocialMedia,
  updateSocialMedia,
  SocialMediaState,
} from "@/app/lib/actions";
import { SocialMedia, SocialMediaType } from "@/app/lib/definitions";

export default function Form({
  mode,
  socialMedia,
}: {
  mode: "create" | "edit";
  socialMedia?: SocialMedia;
}) {
  const isEditMode = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    type: isEditMode && socialMedia ? socialMedia.type.toString() : "",
    url: isEditMode && socialMedia ? socialMedia.url : "",
  });

  // Update form data when socialMedia prop changes
  useEffect(() => {
    if (isEditMode && socialMedia) {
      console.log("Setting form data:", socialMedia);
      setFormData({
        type: socialMedia.type.toString(),
        url: socialMedia.url,
      });
    }
  }, [isEditMode, socialMedia]);

  const handleInputChange = (field: "type" | "url", value: string) => {
    console.log("Input change:", field, value);
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

      console.log("Submitting form with data:", formData);

      setIsSubmitting(true);
      setSuccess(false);
      setError(null);

      try {
        // Create FormData object from our state
        const formDataObj = new FormData();
        formDataObj.append("type", formData.type.toString());
        formDataObj.append("url", formData.url);

        console.log("FormData created:", {
          type: formDataObj.get("type"),
          url: formDataObj.get("url"),
        });

        if (isEditMode && socialMedia) {
          // Update existing social media
          await updateSocialMedia(socialMedia.id, formDataObj);
        } else {
          // Create new social media
          await createSocialMedia({ message: null, errors: {} }, formDataObj);
        }

        // If we reach here, the operation was successful
        setSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = "/dashboard/social-media";
        }, 1000);
      } catch (error) {
        console.error(`Failed to ${mode} social media:`, error);
        setError(
          error instanceof Error
            ? error.message
            : `Failed to ${mode} social media. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, mode, isEditMode, socialMedia, formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
            Social Media {isEditMode ? "updated" : "created"} successfully!
            Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Platform Selection */}
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium">
            Platform <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
          >
            <option value="">Select a platform...</option>
            <option value={SocialMediaType.Instagram}>Instagram</option>
            <option value={SocialMediaType.Facebook}>Facebook</option>
            <option value={SocialMediaType.X}>X (Twitter)</option>
          </select>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            id="url"
            name="url"
            type="url"
            required
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            placeholder="https://example.com/your-profile"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the full URL to your social media profile
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/social-media"
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
            ? "Update Social Media"
            : "Add Social Media"}
        </Button>
      </div>
    </form>
  );
}
