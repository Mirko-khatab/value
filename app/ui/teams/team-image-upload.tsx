"use client";
import { useState } from "react";
import SimpleImageUpload from "./simple-image-upload";

interface TeamImageUploadProps {
  initialImageUrl?: string;
}

export default function TeamImageUpload({
  initialImageUrl = "",
}: TeamImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [error, setError] = useState<string>("");

  const handleUploadComplete = (url: string) => {
    setImageUrl(url);
    setError("");
  };

  const handleUploadError = (err: string) => {
    setError(err);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Team Member Image <span className="text-red-500">*</span>
      </label>

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="Current team member"
            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
          />
        </div>
      )}

      <SimpleImageUpload
        onUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      <input type="hidden" name="image_url" value={imageUrl} />
    </div>
  );
}
