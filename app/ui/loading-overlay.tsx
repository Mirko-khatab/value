"use client";

import { useLoading } from "@/app/lib/loading-context";
import { useEffect } from "react";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({
  isLoading,
  message,
}: LoadingOverlayProps) {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoading) {
      showLoading(message);
    } else {
      hideLoading();
    }

    // Cleanup on unmount
    return () => {
      hideLoading();
    };
  }, [isLoading, message, showLoading, hideLoading]);

  return null;
}

// Hook for easy loading state management
export function useLoadingState() {
  const { showLoading, hideLoading, isLoading } = useLoading();

  const withLoading = async <T,>(
    asyncFunction: () => Promise<T>,
    message = "Loading..."
  ): Promise<T> => {
    try {
      showLoading(message);
      const result = await asyncFunction();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
  };
}

