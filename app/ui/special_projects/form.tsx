"use client";
import {
  handleSpecialProject,
  SpecialProjectState,
  getNextAvailableSortOrder,
} from "@/app/lib/actions";
import { useActionState } from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../button";
import ImageUpload from "./image-upload";
import { SpecialProjects } from "@/app/lib/definitions";
import Link from "next/link";

interface FormProps {
  specialProject?: SpecialProjects;
  mode: "create" | "edit";
}

export default function Form({ specialProject, mode }: FormProps) {
  const initialState: SpecialProjectState = { errors: {}, message: null };
  const [specialProjectState, formAction] = useActionState(
    handleSpecialProject,
    initialState
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [canSubmit, setCanSubmit] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [oldImageDeleted, setOldImageDeleted] = useState(false);
  const [deletionError, setDeletionError] = useState<string | null>(null);
  const [isDeletingOldImage, setIsDeletingOldImage] = useState(false);
  const [showImageReplacementConfirm, setShowImageReplacementConfirm] =
    useState(false);

  const isEditMode = mode === "edit";

  useEffect(() => {
    if (specialProject) {
      setImageUrl(specialProject.image_url);
      setSortOrder(specialProject.sort_order);
      setHasImageChanged(false);
      setOldImageDeleted(false);
      setDeletionError(null);
      setIsDeletingOldImage(false);
      setShowImageReplacementConfirm(false);
    } else {
      // For create mode, start with sort order 0
      setSortOrder(0);
    }
  }, [specialProject]);

  useEffect(() => {
    setCanSubmit(!!imageUrl);
  }, [imageUrl]);

  // Handle image upload completion
  const handleImageUploadComplete = useCallback(
    async (url: string) => {
      setImageUrl(url);
      if (
        isEditMode &&
        url !== specialProject?.image_url &&
        specialProject?.image_url
      ) {
        setHasImageChanged(true);
        setDeletionError(null);

        // Immediately delete the old image from S3 when new image is uploaded
        try {
          setIsDeletingOldImage(true);
          setDeletionError(null);

          const response = await fetch("/api/delete-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl: specialProject.image_url }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            setOldImageDeleted(true);
            setDeletionError(null);
          } else {
            console.error("Failed to delete old image from S3:", result);
            setOldImageDeleted(false);
            setDeletionError(result.error || "Failed to delete old image");
          }
        } catch (error) {
          console.error("Error deleting old image:", error);
          setOldImageDeleted(false);
          setDeletionError("Network error while deleting old image");
        } finally {
          setIsDeletingOldImage(false);
        }
      }
    },
    [isEditMode, specialProject?.image_url]
  );

  // Handle image removal
  const handleImageRemove = useCallback(() => {
    setImageUrl("");
    if (isEditMode) {
      setHasImageChanged(true);
    }
  }, [isEditMode]);

  // Retry deleting the old image
  const retryDeleteOldImage = useCallback(async () => {
    if (!specialProject?.image_url) return;

    try {
      setIsDeletingOldImage(true);
      setDeletionError(null);

      const response = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: specialProject.image_url }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setOldImageDeleted(true);
        setDeletionError(null);
      } else {
        setOldImageDeleted(false);
        setDeletionError(result.error || "Failed to delete old image");
      }
    } catch (error) {
      setOldImageDeleted(false);
      setDeletionError("Network error while deleting old image");
    } finally {
      setIsDeletingOldImage(false);
    }
  }, [specialProject?.image_url]);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Sort Order */}
        <div className="mb-4">
          <label
            htmlFor="sort_order"
            className="mb-2 block text-sm font-medium"
          >
            Sort Order <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              required
              min="0"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="Enter sort order (0 or greater)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={async () => {
                const nextOrder = await getNextAvailableSortOrder();
                setSortOrder(nextOrder);
              }}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
            >
              Suggest
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Sort order must be unique. Lower numbers appear first. Click
            "Suggest" to get the next available number.
          </p>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
            Image <span className="text-red-500">*</span>
          </label>

          {/* Show current image in edit mode */}
          {isEditMode && specialProject?.image_url && !hasImageChanged && (
            <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Current Image:
                </span>
                <button
                  type="button"
                  onClick={() => setShowImageReplacementConfirm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Change Image
                </button>
              </div>
              <img
                src={specialProject.image_url}
                alt="Current special project image"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Image Replacement Confirmation Dialog */}
          {showImageReplacementConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Image Replacement
                </h3>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to replace the current image? The old
                  image will be permanently deleted from storage.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowImageReplacementConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageReplacementConfirm(false);
                      setHasImageChanged(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Replace Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show image upload when creating new or changing existing */}
          {(!isEditMode || hasImageChanged) && (
            <div className="space-y-3">
              {/* Warning about image replacement in edit mode */}
              {isEditMode && hasImageChanged && specialProject?.image_url && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-amber-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800">
                        Image Replacement Warning
                      </h3>
                      <div className="mt-1 text-sm text-amber-700">
                        <p>
                          You are about to replace the current image. The old
                          image will be permanently deleted from storage
                          <strong>
                            {" "}
                            immediately when you upload a new image
                          </strong>
                          .
                        </p>
                        <p className="mt-1 text-xs text-amber-600">
                          This action cannot be undone. Make sure you want to
                          replace the current image.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ImageUpload
                onUploadComplete={handleImageUploadComplete}
                onUploadError={(error) => {}}
              />

              {/* Show option to keep current image in edit mode */}
              {isEditMode && hasImageChanged && specialProject?.image_url && (
                <div className="flex items-center justify-center">
                  {oldImageDeleted ? (
                    <div className="text-sm text-red-600 text-center">
                      ⚠ Old image has been deleted from storage
                      <br />
                      <span className="text-xs text-gray-500">
                        You must upload a new image or cancel this edit
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setHasImageChanged(false);
                        setImageUrl(specialProject.image_url);
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      ← Keep current image instead
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Hidden inputs */}
          <input type="hidden" name="image_url" value={imageUrl} />
          <input type="hidden" name="mode" value={mode} />
          {isEditMode && specialProject?.id && (
            <input type="hidden" name="id" value={specialProject.id} />
          )}

          {/* Show image change status in edit mode */}
          {isEditMode && hasImageChanged && (
            <div className="mt-2 text-sm">
              {imageUrl ? (
                <div className="text-blue-600">
                  ✓ New image uploaded - old image will be replaced
                  {isDeletingOldImage && (
                    <span className="ml-2 text-blue-600">
                      🔄 Deleting old image...
                    </span>
                  )}
                  {oldImageDeleted && !isDeletingOldImage && (
                    <span className="ml-2 text-green-600">
                      ✓ Old image deleted from storage
                    </span>
                  )}
                  {deletionError && !isDeletingOldImage && (
                    <span className="ml-2 text-red-600">
                      ⚠ Failed to delete old image: {deletionError}
                      <button
                        type="button"
                        onClick={retryDeleteOldImage}
                        className="ml-2 text-blue-600 hover:text-blue-800 underline text-xs"
                        disabled={isDeletingOldImage}
                      >
                        {isDeletingOldImage ? "Retrying..." : "Retry"}
                      </button>
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-amber-600">
                  ⚠ No image selected - old image will be removed
                </div>
              )}
            </div>
          )}

          {/* Show current image status in edit mode */}
          {isEditMode && !hasImageChanged && specialProject?.image_url && (
            <div className="mt-2 text-sm text-gray-600">
              ✓ Using current image: {specialProject.image_url.split("/").pop()}
            </div>
          )}
        </div>

        {/* Show errors for both modes */}
        {specialProjectState.message && (
          <div className="mb-4 rounded-md bg-red-50 p-2 text-sm text-red-500">
            {specialProjectState.message}
          </div>
        )}

        {/* Display specific field errors for both modes */}
        {specialProjectState.errors && (
          <div className="space-y-2">
            {specialProjectState.errors.image_url && (
              <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                Image: {specialProjectState.errors.image_url.join(", ")}
              </div>
            )}
            {specialProjectState.errors.sort_order && (
              <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                Sort Order: {specialProjectState.errors.sort_order.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Required fields note */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>
      <div className="mt-6 border-t border-gray-200 pt-10">
        {isEditMode ? (
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/special-projects"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={!canSubmit}
              className={!canSubmit ? "opacity-50 cursor-not-allowed" : ""}
            >
              {!canSubmit
                ? "Please ensure an image is available"
                : "Update Special Project"}
            </Button>
          </div>
        ) : (
          <Button
            type="submit"
            disabled={!canSubmit}
            className={!canSubmit ? "opacity-50 cursor-not-allowed" : ""}
          >
            {!canSubmit
              ? "Please upload an image first"
              : "Create Special Project"}
          </Button>
        )}
      </div>
    </form>
  );
}
