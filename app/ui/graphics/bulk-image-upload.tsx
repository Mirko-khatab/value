"use client";
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { uploadToCloud } from "@/app/lib/cloud-upload-client";
import Image from "next/image";

interface BulkImageUploadProps {
  onImagesChange: (urls: string[]) => void;
}

interface ImagePreview {
  id: string;
  file: File;
  preview: string;
  url?: string;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
}

export default function BulkImageUpload({
  onImagesChange,
}: BulkImageUploadProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<File> => {
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Failed to compress image");
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) {
      alert("Please select valid image files");
      return;
    }

    // Create preview entries
    const newImages: ImagePreview[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const uploadAllImages = async () => {
    setUploading(true);
    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].uploaded) continue; // Skip already uploaded

      // Mark as uploading
      updatedImages[i].uploading = true;
      setImages([...updatedImages]);

      try {
        // Compress image
        const compressedFile = await compressImage(updatedImages[i].file);

        // Upload to cloud
        const uploadResponse = await uploadToCloud(compressedFile);

        // Mark as uploaded
        updatedImages[i].url = uploadResponse.publicUrl;
        updatedImages[i].uploaded = true;
        updatedImages[i].uploading = false;
        setImages([...updatedImages]);
      } catch (error) {
        console.error("Upload error:", error);
        updatedImages[i].error =
          error instanceof Error ? error.message : "Upload failed";
        updatedImages[i].uploading = false;
        setImages([...updatedImages]);
      }
    }

    setUploading(false);

    // Get all successfully uploaded URLs
    const uploadedUrls = updatedImages
      .filter((img) => img.uploaded && img.url)
      .map((img) => img.url!);

    onImagesChange(uploadedUrls);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const clearAll = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImagesChange([]);
  };

  const uploadedCount = images.filter((img) => img.uploaded).length;
  const hasErrors = images.some((img) => img.error);

  return (
    <div className="space-y-4">
      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Select Images
        </button>

        {images.length > 0 && !uploading && uploadedCount < images.length && (
          <button
            type="button"
            onClick={uploadAllImages}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Upload All ({images.length - uploadedCount})
          </button>
        )}

        {images.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Progress summary */}
      {images.length > 0 && (
        <div className="rounded-md bg-blue-50 p-3 text-sm">
          <p className="font-medium text-blue-900">
            {uploadedCount} of {images.length} images uploaded
          </p>
          {hasErrors && (
            <p className="mt-1 text-red-600">Some images failed to upload</p>
          )}
        </div>
      )}

      {/* Image grid preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative rounded-lg border-2 border-gray-200 overflow-hidden"
            >
              {/* Image preview */}
              <div className="relative aspect-square">
                <Image
                  src={image.preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />

                {/* Upload status overlay */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}

                {/* Success indicator */}
                {image.uploaded && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white rounded-full p-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Error indicator */}
                {image.error && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center p-2">
                    <p className="text-white text-xs text-center">
                      {image.error}
                    </p>
                  </div>
                )}
              </div>

              {/* Remove button */}
              {!image.uploading && (
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
