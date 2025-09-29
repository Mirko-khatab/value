"use client";

import { useState } from "react";
import VideoLoading from "@/app/ui/video-loading";

export default function TestVideoPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Video Loading Test
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => setShowVideo(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Video Loading
          </button>

          <p className="text-gray-600 dark:text-gray-300">
            Click the button above to test the video loading component
          </p>

          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Video Status
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Video files available:
            </p>
            <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <li>✅ /video/loading.mp4</li>
              <li>✅ /video/loading.MOV</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Video Loading Overlay */}
      {showVideo && (
        <VideoLoading
          onComplete={() => setShowVideo(false)}
          autoHide={true}
          hideDelay={3000}
        />
      )}
    </div>
  );
}
