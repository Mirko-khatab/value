/**
 * Skeleton Loader Components
 * Used to show loading placeholders while content is being fetched
 */

export function ImageSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] ${className}`}
      style={{
        animation: "shimmer 2s infinite",
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
}

export function ProjectGallerySkeleton() {
  return (
    <div className="flex flex-col lg:relative lg:w-full lg:h-screen">
      {/* Mobile: Image Skeleton */}
      <div className="lg:hidden h-[60vh] w-full relative">
        <ImageSkeleton className="w-full h-full rounded-none" />
        {/* Dots skeleton */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-white/30" />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Image Skeleton */}
      <div className="hidden lg:block absolute inset-0">
        <ImageSkeleton className="w-full h-full rounded-none" />
      </div>

      {/* Info Section Skeleton - Mobile */}
      <div className="lg:hidden bg-white dark:bg-black min-h-[40vh] p-6 space-y-6">
        <div className="space-y-4">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
          <div className="w-24 h-0.5 bg-gray-300 dark:bg-gray-600" />
        </div>
        {/* Status skeleton */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-32 animate-pulse" />
        </div>
        {/* Meta skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            </div>
          ))}
        </div>
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
        </div>
      </div>

      {/* Info Section Skeleton - Desktop */}
      <div className="hidden lg:flex absolute inset-0 justify-start items-center z-20">
        <div className="w-1/2 h-full relative -ml-8">
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent dark:from-gray-900/95 dark:via-gray-900/70 dark:to-transparent" />
          <div className="h-full overflow-y-auto relative z-10 pt-16 lg:pt-24 px-6 lg:px-12 pb-8 space-y-6">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="w-24 h-0.5 bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full w-40 animate-pulse" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-11/12 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-b-2",
    lg: "h-16 w-16 border-b-4",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-600 dark:border-blue-400`}
    />
  );
}
