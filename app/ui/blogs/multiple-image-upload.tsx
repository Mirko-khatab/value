"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/app/ui/button";
import { uploadToCloud } from "@/app/lib/cloud-upload-client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

interface ImageFile {
  file: File;
  preview: string;
  altText: string;
  orderIndex: number;
}

interface MultipleImageUploadProps {
  onImagesChange: (
    images: { url: string; altText: string; orderIndex: number }[]
  ) => void;
  initialImages?: { url: string; altText: string; orderIndex: number }[];
  currentImages?: { url: string; altText: string; orderIndex: number }[];
  title?: string;
}

export default function MultipleImageUpload({
  onImagesChange,
  initialImages = [],
  currentImages = [],
  title = "Project Images",
}: MultipleImageUploadProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState(initialImages);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use currentImages if provided, otherwise use existingImages
  const displayImages = useMemo(() => {
    return currentImages.length > 0 ? currentImages : existingImages;
  }, [currentImages, existingImages]);

  // Show message and auto-hide after 3 seconds
  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  // Call onImagesChange when component mounts with initial images
  useEffect(() => {
    if (initialImages.length > 0) {
      const finalImages = initialImages.map((img) => ({
        url: img.url,
        altText: img.altText,
        orderIndex: img.orderIndex,
      }));
      onImagesChange(finalImages);
    }
  }, []); // Only run on mount

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    const newImages: ImageFile[] = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      altText: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for default alt text
      orderIndex: existingImages.length + images.length + index + 1,
    }));

    setImages((prev) => [...prev, ...newImages]);
    showMessage("success", `${files.length} image(s) selected`);
  };

  const removeImage = useCallback(
    async (index: number) => {
      const imageToDelete = images[index];

      // Try to delete the image from cloud storage if it has a URL (was uploaded)
      if (imageToDelete?.file) {
        try {
          const response = await fetch("/api/delete-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl: imageToDelete.file.name }),
          });

          const result = await response.json();
          if (!response.ok || !result.success) {
            console.error(
              "Failed to delete uploaded image from cloud storage:",
              result
            );
            // Continue with removal from UI even if cloud storage deletion fails for uploaded images
            // since they're not saved to the project yet
          } else {
          }
        } catch (error) {
          console.error(
            "Error deleting uploaded image from cloud storage:",
            error
          );
          // Continue with removal from UI even if cloud storage deletion fails
        }
      }

      setImages((prev) => {
        const newImages = prev.filter((_, i) => i !== index);
        // Update order indices
        const updatedImages = newImages.map((img, i) => ({
          ...img,
          orderIndex: existingImages.length + i + 1,
        }));

        showMessage("success", "Image removed from upload queue");
        return updatedImages;
      });

      // Call onImagesChange with existing images after state update
      // Use setTimeout to defer the call until after the current render cycle
      setTimeout(() => onImagesChange(existingImages), 0);
    },
    [images, existingImages, showMessage]
  );

  const removeExistingImage = useCallback(
    async (index: number) => {
      const imageToDelete = existingImages[index];
      let updatedImages: typeof existingImages = [];

      // First, try to delete the image from cloud storage
      if (imageToDelete?.url) {
        try {
          const response = await fetch("/api/delete-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl: imageToDelete.url }),
          });

          const result = await response.json();
          if (!response.ok || !result.success) {
            console.error("Failed to delete image from cloud storage:", result);
            showMessage("error", "Failed to delete image from storage");
            return; // Don't remove from UI if cloud storage deletion failed
          }
        } catch (error) {
          console.error("Error deleting image from cloud storage:", error);
          showMessage("error", "Network error while deleting image");
          return; // Don't remove from UI if cloud storage deletion failed
        }
      }

      // Only update local state if cloud storage deletion was successful
      setExistingImages((prev) => {
        const newImages = prev.filter((_, i) => i !== index);
        // Update order indices for remaining images
        updatedImages = newImages.map((img, i) => ({
          ...img,
          orderIndex: i + 1,
        }));

        showMessage("success", "Image removed from project and storage");
        return updatedImages;
      });

      // Call onImagesChange after state update using setTimeout to defer
      setTimeout(() => onImagesChange(updatedImages), 0);
    },
    [existingImages, showMessage]
  );

  const updateAltText = (index: number, altText: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, altText } : img))
    );
  };

  const updateOrderIndex = (index: number, orderIndex: number) => {
    // Ensure orderIndex is a valid number, default to 1 if invalid
    const validOrderIndex =
      isNaN(orderIndex) || orderIndex < 1 ? 1 : orderIndex;
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, orderIndex: validOrderIndex } : img
      )
    );
  };

  const updateExistingAltText = (index: number, altText: string) => {
    setExistingImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, altText } : img))
    );
  };

  const updateExistingOrderIndex = (index: number, orderIndex: number) => {
    // Ensure orderIndex is a valid number, default to 1 if invalid
    const validOrderIndex =
      isNaN(orderIndex) || orderIndex < 1 ? 1 : orderIndex;
    setExistingImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, orderIndex: validOrderIndex } : img
      )
    );
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      // Just update with existing images
      onImagesChange(existingImages);
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = images.map(async (image) => {
        // Upload to cloud storage
        const response = await uploadToCloud(image.file);

        return {
          url: response.publicUrl,
          altText: image.altText,
          orderIndex: image.orderIndex,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const allImages = [...existingImages, ...uploadedImages];

      // Sort by order index
      allImages.sort((a, b) => a.orderIndex - b.orderIndex);

      onImagesChange(allImages);
      setImages([]);
      setExistingImages(allImages);
      showMessage(
        "success",
        `${uploadedImages.length} image(s) uploaded successfully!`
      );
    } catch (error) {
      console.error("Failed to upload images:", error);
      showMessage("error", "Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Message Display */}
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <Button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Images
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Existing Images</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingImages.map((image, index) => (
              <div
                key={`existing-${index}`}
                className="relative border rounded-lg p-3"
              >
                <img
                  src={image.url}
                  alt={image.altText}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <div className="space-y-2">
                  <input
                    type="text"
                    value={image.altText || ""}
                    onChange={(e) =>
                      updateExistingAltText(index, e.target.value)
                    }
                    placeholder="Alt text"
                    className="w-full text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    value={isNaN(image.orderIndex) ? 1 : image.orderIndex}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      updateExistingOrderIndex(index, value);
                    }}
                    min="1"
                    className="w-full text-sm border rounded px-2 py-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            New Images to Upload
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative border rounded-lg p-3">
                <img
                  src={image.preview}
                  alt={image.altText}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <div className="space-y-2">
                  <input
                    type="text"
                    value={image.altText || ""}
                    onChange={(e) => updateAltText(index, e.target.value)}
                    placeholder="Alt text"
                    className="w-full text-sm border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    value={isNaN(image.orderIndex) ? 1 : image.orderIndex}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      updateOrderIndex(index, value);
                    }}
                    min="1"
                    className="w-full text-sm border rounded px-2 py-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            onClick={uploadImages}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </Button>
        </div>
      )}

      {/* Hidden inputs for form submission - these will be dynamically updated */}
      {displayImages.map((image, index) => (
        <input
          key={`hidden-url-${index}`}
          type="hidden"
          name={`gallery_url_${index}`}
          value={image.url}
        />
      ))}
      {displayImages.map((image, index) => (
        <input
          key={`hidden-alt-${index}`}
          type="hidden"
          name={`gallery_alt_${index}`}
          value={image.altText || ""}
        />
      ))}
      {displayImages.map((image, index) => (
        <input
          key={`hidden-order-${index}`}
          type="hidden"
          name={`gallery_order_${index}`}
          value={isNaN(image.orderIndex) ? 1 : image.orderIndex}
        />
      ))}
    </div>
  );
}
