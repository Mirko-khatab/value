"use client";
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";

interface SimpleImageUploadProps {
  onUploadComplete: (imageUrl: string) => void;
  onUploadError: (error: string) => void;
}

export default function SimpleImageUpload({
  onUploadComplete,
  onUploadError,
}: SimpleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = async (file: File): Promise<File> => {
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        quality: 0.8,
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
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onUploadError("Please select an image file");
      return;
    }

    // Validate file size (before compression)
    if (file.size > 10 * 1024 * 1024) {
      onUploadError("File size must be less than 10MB");
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Compress image
      const compressedFile = await compressImage(file);

      // For now, we'll use a simple placeholder URL
      // In production, this would be the actual S3 URL
      const timestamp = Date.now();
      const placeholderUrl = `/customers/uploaded-${timestamp}.jpg`;

      onUploadComplete(placeholderUrl);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError(error instanceof Error ? error.message : "Upload failed");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="simple-image-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
            uploading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                disabled={uploading}
              >
                ×
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              <p className="text-xs text-gray-400 mt-1">
                (Placeholder URL - Ready for AWS S3)
              </p>
            </div>
          )}
        </label>
        <input
          ref={fileInputRef}
          id="simple-image-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processing image...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}
