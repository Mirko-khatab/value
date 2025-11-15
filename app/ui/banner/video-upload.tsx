"use client";
import { useState, useRef } from "react";
import { uploadToCloud } from "@/app/lib/cloud-upload-client";

interface VideoUploadProps {
  onUploadComplete: (videoUrl: string) => void;
  onUploadError: (error: string) => void;
  initialVideoUrl?: string;
}

export default function VideoUpload({
  onUploadComplete,
  onUploadError,
  initialVideoUrl,
}: VideoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initialVideoUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      onUploadError("Please select a valid video file");
      return;
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      onUploadError("Video file size must be less than 100MB");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      // Upload to cloud storage
      const response = await uploadToCloud(file, (progress) => {
        setProgress(progress);
      });

      // Update state and notify parent
      setVideoUrl(response.publicUrl);
      onUploadComplete(response.publicUrl);
      onUploadError(""); // Clear any previous errors
    } catch (error) {
      console.error("Video upload error:", error);
      onUploadError(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemoveVideo = () => {
    setVideoUrl(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {!videoUrl ? (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="video-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploading... {progress}%
                  </p>
                </>
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload video</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    MP4, MOV, AVI, WEBM up to 100MB
                  </p>
                </>
              )}
            </div>
            <input
              id="video-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className="relative rounded-lg border-2 border-gray-300 dark:border-gray-600 p-4 bg-white dark:bg-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Video Uploaded
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <video
            src={videoUrl}
            controls
            className="w-full max-h-48 rounded-md bg-black"
          >
            Your browser does not support the video tag.
          </video>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
            {videoUrl}
          </p>
        </div>
      )}
    </div>
  );
}
