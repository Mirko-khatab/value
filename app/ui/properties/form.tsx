"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createProperty, updateProperty } from "@/app/lib/actions";
import { Property } from "@/app/lib/definitions";

export default function Form({
  property,
  mode,
}: {
  property?: Property;
  mode: "create" | "edit";
}) {
  const isEditMode = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    key: isEditMode && property ? property.key : "",
    value_ku: isEditMode && property ? property.value_ku : "",
    value_en: isEditMode && property ? property.value_en : "",
    value_ar: isEditMode && property ? property.value_ar : "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
        // Create FormData object from our state
        const formDataObj = new FormData();
        formDataObj.append("key", formData.key);
        formDataObj.append("value_ku", formData.value_ku);
        formDataObj.append("value_en", formData.value_en);
        formDataObj.append("value_ar", formData.value_ar);

        if (isEditMode && property) {
          // Update existing property
          await updateProperty(property.id, formDataObj);
        } else {
          // Create new property
          await createProperty(formDataObj);
        }

        // If we reach here, the operation was successful
        setSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = "/dashboard/properties";
        }, 1000);
      } catch (error) {
        console.error(`Failed to ${mode} property:`, error);
        setError(
          error instanceof Error
            ? error.message
            : `Failed to ${mode} property. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, mode, isEditMode, property, formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
            Property {isEditMode ? "updated" : "created"} successfully!
            Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {/* Property Fields - 2x2 Grid */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
          <div className="mb-4">
            <label htmlFor="key" className="mb-2 block text-sm font-medium">
              Property Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="key"
              name="key"
              required
              value={formData.key}
              onChange={(e) => handleInputChange("key", e.target.value)}
              placeholder="Enter property key (e.g., company_name)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Unique identifier for this property
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="value_en"
              className="mb-2 block text-sm font-medium"
            >
              Value (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="value_en"
              name="value_en"
              required
              value={formData.value_en}
              onChange={(e) => handleInputChange("value_en", e.target.value)}
              placeholder="Enter property value in English"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
          <div className="mb-4">
            <label
              htmlFor="value_ku"
              className="mb-2 block text-sm font-medium"
            >
              Value (Kurdish) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="value_ku"
              name="value_ku"
              required
              value={formData.value_ku}
              onChange={(e) => handleInputChange("value_ku", e.target.value)}
              placeholder="Enter property value in Kurdish"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="value_ar"
              className="mb-2 block text-sm font-medium"
            >
              Value (Arabic) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="value_ar"
              name="value_ar"
              required
              value={formData.value_ar}
              onChange={(e) => handleInputChange("value_ar", e.target.value)}
              placeholder="Enter property value in Arabic"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Required fields note */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/properties"
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
            ? "Update Property"
            : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
