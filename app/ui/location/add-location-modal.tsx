"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { createLocation } from "@/app/lib/actions";
import { Country } from "@/app/lib/definitions";
import { useRouter } from "next/navigation";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  onLocationAdded?: () => void;
}

export default function AddLocationModal({
  isOpen,
  onClose,
  countries,
  onLocationAdded,
}: AddLocationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setMessage("");
    }
  }, [isOpen]);

  // Handle portal mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await createLocation(
        { errors: {}, message: null },
        formData
      );

      if (result.errors && Object.keys(result.errors).length > 0) {
        setErrors(result.errors);
        setMessage(result.message || "");
      } else if (result.message) {
        setMessage(result.message);
      } else {
        // Success - location was created
        router.refresh(); // Refresh to get new location
        if (onLocationAdded) {
          onLocationAdded();
        }
        onClose();
      }
    } catch (error) {
      console.error("Error creating location:", error);
      setMessage("Failed to create location");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Add New Location
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* Country Selection */}
            <div>
              <label
                htmlFor="country_id"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2"
              >
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country_id"
                name="country_id"
                required
                className="block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name_en}
                  </option>
                ))}
              </select>
              {errors.country_id && (
                <p className="mt-1 text-sm text-red-500">{errors.country_id}</p>
              )}
            </div>

            {/* City Kurdish */}
            <div>
              <label
                htmlFor="city_ku"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2"
              >
                City (Kurdish) <span className="text-red-500">*</span>
              </label>
              <input
                id="city_ku"
                name="city_ku"
                type="text"
                required
                className="block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100"
                placeholder="e.g., هەولێر"
              />
              {errors.city_ku && (
                <p className="mt-1 text-sm text-red-500">{errors.city_ku}</p>
              )}
            </div>

            {/* City Arabic */}
            <div>
              <label
                htmlFor="city_ar"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2"
              >
                City (Arabic) <span className="text-red-500">*</span>
              </label>
              <input
                id="city_ar"
                name="city_ar"
                type="text"
                required
                dir="rtl"
                className="block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100"
                placeholder="e.g., أربيل"
              />
              {errors.city_ar && (
                <p className="mt-1 text-sm text-red-500">{errors.city_ar}</p>
              )}
            </div>

            {/* City English */}
            <div>
              <label
                htmlFor="city_en"
                className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-2"
              >
                City (English) <span className="text-red-500">*</span>
              </label>
              <input
                id="city_en"
                name="city_en"
                type="text"
                required
                className="block w-full rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-sm text-gray-900 dark:text-gray-100"
                placeholder="e.g., Erbil"
              />
              {errors.city_en && (
                <p className="mt-1 text-sm text-red-500">{errors.city_en}</p>
              )}
            </div>

            {message && <div className="text-sm text-red-500">{message}</div>}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Location"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
