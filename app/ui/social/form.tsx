"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { createQuote, updateQuote, QuoteState } from "@/app/lib/actions";
import { Quote } from "@/app/lib/definitions";

export default function Form({
  mode,
  quote,
}: {
  mode: "create" | "edit";
  quote?: Quote;
}) {
  const isEditMode = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      if (isSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setSuccess(false);
      setError(null);

      try {
        if (isEditMode && quote) {
          // Update existing quote
          await updateQuote(quote.id, formData);
        } else {
          // Create new quote
          await createQuote({ message: null, errors: {} }, formData);
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
    [isSubmitting, mode, isEditMode, quote]
  );

  return (
    <form action={handleSubmit}>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="mb-4">
            <label
              htmlFor="title_ku"
              className="mb-2 block text-sm font-medium"
            >
              Title (Kurdish) <span className="text-red-500">*</span>
            </label>
            <input
              id="title_ku"
              name="title_ku"
              type="text"
              required
              defaultValue={isEditMode ? quote?.title_ku : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter Kurdish title"
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
              id="title_ar"
              name="title_ar"
              type="text"
              required
              defaultValue={isEditMode ? quote?.title_ar : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter Arabic title"
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
              id="title_en"
              name="title_en"
              type="text"
              required
              defaultValue={isEditMode ? quote?.title_en : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter English title"
            />
          </div>
        </div>

        {/* Description Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              rows={3}
              defaultValue={isEditMode ? quote?.description_ku : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter Kurdish description"
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
              rows={3}
              defaultValue={isEditMode ? quote?.description_ar : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter Arabic description"
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
              rows={3}
              defaultValue={isEditMode ? quote?.description_en : ""}
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              placeholder="Enter English description"
            />
          </div>
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
