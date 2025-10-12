"use client";

import { useState } from "react";
import { getSignedUploadUrl } from "@/app/lib/s3-upload";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

interface AudioUploadProps {
  onUploadComplete: (url: string) => void;
  currentAudio?: string;
}

export default function AudioUpload({
  onUploadComplete,
  currentAudio,
}: AudioUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid audio file (MP3, WAV, or OGG)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      // Get signed URL
      const { signedUrl, publicUrl } = await getSignedUploadUrl(
        file.name,
        file.type
      );

      // Upload to S3
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          onUploadComplete(publicUrl);
          setUploading(false);
          setProgress(100);
        } else {
          setError("Upload failed. Please try again.");
          setUploading(false);
        }
      });

      xhr.addEventListener("error", () => {
        setError("Upload failed. Please try again.");
        setUploading(false);
      });

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    } catch (err) {
      setError("Failed to upload audio. Please try again.");
      setUploading(false);
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="audio-upload"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Audio File
        </label>
        <div className="flex items-center gap-4">
          <label
            htmlFor="audio-upload"
            className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <CloudArrowUpIcon className="w-5 h-5" />
            {uploading ? "Uploading..." : "Choose Audio File"}
          </label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supported formats: MP3, WAV, OGG (Max 10MB)
        </p>
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {error}
        </div>
      )}

      {currentAudio && !uploading && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Current Audio:
          </p>
          <audio controls className="w-full">
            <source src={currentAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
