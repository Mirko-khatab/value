"use client";

import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Space } from "../ui/utils/space";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ShowcaseLayout>
      <Space className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong!
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "An error occurred while loading machines."}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </Space>
    </ShowcaseLayout>
  );
}
