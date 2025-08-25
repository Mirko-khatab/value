"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createQuote, updateQuote, QuoteState } from "@/app/lib/actions";
import { Quote } from "@/app/lib/definitions";

export default function Form({
  quote,
  mode,
}: {
  quote?: Quote;
  mode: "create" | "edit";
}) {
  const isEditMode = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state for controlled inputs
  const [formData, setFormData] = useState({
    title_ku: isEditMode && quote ? quote.title_ku : "",
    title_en: isEditMode && quote ? quote.title_en : "",
    title_ar: isEditMode && quote ? quote.title_ar : "",
    description_ku: isEditMode && quote ? quote.description_ku : "",
    description_en: isEditMode && quote ? quote.description_en : "",
    description_ar: isEditMode && quote ? quote.description_ar : "",
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
        formDataObj.append("title_ku", formData.title_ku);
        formDataObj.append("title_en", formData.title_en);
        formDataObj.append("title_ar", formData.title_ar);
        formDataObj.append("description_ku", formData.description_ku);
        formDataObj.append("description_en", formData.description_en);
        formDataObj.append("description_ar", formData.description_ar);

        if (isEditMode && quote) {
          // Update existing quote
          await updateQuote(quote.id, formDataObj);
        } else {
          // Create new quote
          await createQuote({ message: null, errors: {} }, formDataObj);
        }

        // If we reach here, the operation was successful
        setSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = "/dashboard/quote";
        }, 1000);
      } catch (error) {
        console.error(`Failed to ${mode} quote:`, error);
        setError(
          error instanceof Error
            ? error.message
            : `Failed to ${mode} quote. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, mode, isEditMode, quote, formData]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded">
            Quote {isEditMode ? "updated" : "created"} successfully!
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
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
          <div className="mb-4">
            <label
              htmlFor="title_ku"
              className="mb-2 block text-sm font-medium"
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
              placeholder="Enter quote title in Kurdish"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="title_ar"
              className="mb-2 block text-sm font-medium"
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
              placeholder="Enter quote title in Arabic"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="title_en"
              className="mb-2 block text-sm font-medium"
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
              placeholder="Enter quote title in English"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Description Fields */}
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mb-4">
          <div className="mb-4">
            <label
              htmlFor="description_ku"
              className="mb-2 block text-sm font-medium"
            >
              Description (Kurdish) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description_ku"
              name="description_ku"
              required
              value={formData.description_ku}
              onChange={(e) =>
                handleInputChange("description_ku", e.target.value)
              }
              placeholder="Enter quote description in Kurdish"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description_ar"
              className="mb-2 block text-sm font-medium"
            >
              Description (Arabic) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description_ar"
              name="description_ar"
              required
              value={formData.description_ar}
              onChange={(e) =>
                handleInputChange("description_ar", e.target.value)
              }
              placeholder="Enter quote description in Arabic"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description_en"
              className="mb-2 block text-sm font-medium"
            >
              Description (English) <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description_en"
              name="description_en"
              required
              value={formData.description_en}
              onChange={(e) =>
                handleInputChange("description_en", e.target.value)
              }
              placeholder="Enter quote description in English"
              rows={4}
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
          href="/dashboard/quote"
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
            ? "Update Quote"
            : "Create Quote"}
        </Button>
      </div>
    </form>
  );
}
