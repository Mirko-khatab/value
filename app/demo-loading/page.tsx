"use client";

import { useState } from "react";
import { useLoadingState } from "@/app/ui/loading-overlay";
import VideoLoading from "@/app/ui/video-loading";

export default function DemoLoadingPage() {
  const { withLoading, showLoading, hideLoading, isLoading } =
    useLoadingState();
  const [showVideo, setShowVideo] = useState(false);

  const simulateAsyncOperation = async (delay: number) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return "Operation completed!";
  };

  const handleQuickLoading = async () => {
    await withLoading(() => simulateAsyncOperation(2000), "Quick loading...");
  };

  const handleLongLoading = async () => {
    await withLoading(
      () => simulateAsyncOperation(5000),
      "Long loading operation..."
    );
  };

  const handleManualLoading = () => {
    showLoading("Manual loading...");
    setTimeout(() => {
      hideLoading();
    }, 3000);
  };

  const handleVideoLoading = () => {
    setShowVideo(true);
    setTimeout(() => {
      setShowVideo(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Video Loading Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Programmatic Loading
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleQuickLoading}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Quick Loading (2s)
              </button>

              <button
                onClick={handleLongLoading}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Long Loading (5s)
              </button>

              <button
                onClick={handleManualLoading}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Manual Loading (3s)
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Direct Video Loading
            </h2>
            <div className="space-y-4">
              <button
                onClick={handleVideoLoading}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Show Video Loading (4s)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-black p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Features
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              ✅ Responsive design for all devices (mobile, tablet, desktop)
            </li>
            <li>✅ Multiple video format support (MOV, MP4, WebM)</li>
            <li>✅ Fallback spinner for unsupported browsers</li>
            <li>✅ Automatic loading state management</li>
            <li>✅ Customizable loading messages</li>
            <li>✅ Development controls for testing</li>
            <li>✅ Smooth transitions and animations</li>
            <li>✅ Dark mode support</li>
          </ul>
        </div>

        <div className="mt-8 bg-white dark:bg-black p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Usage Examples
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                In loading.tsx files:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                {`import VideoLoading from "@/app/ui/video-loading";

export default function Loading() {
  return <VideoLoading autoHide={true} hideDelay={1500} />;
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Programmatic loading:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm overflow-x-auto">
                {`import { useLoadingState } from "@/app/ui/loading-overlay";

const { withLoading } = useLoadingState();

const handleAsyncOperation = async () => {
  await withLoading(
    () => fetchData(),
    "Loading data..."
  );
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Direct video loading overlay */}
      {showVideo && (
        <VideoLoading
          onComplete={() => setShowVideo(false)}
          autoHide={true}
          hideDelay={4000}
        />
      )}
    </div>
  );
}
