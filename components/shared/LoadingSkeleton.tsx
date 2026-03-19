/**
 * LoadingSkeleton Component
 * Displays animated skeleton loaders while data is being fetched
 * Used for better perceived performance and UX
 */

'use client';

interface SkeletonProps {
  variant?: 'card' | 'line' | 'circle' | 'product' | 'order';
  count?: number;
  className?: string;
}

export default function LoadingSkeleton({
  variant = 'line',
  count = 1,
  className = ''
}: SkeletonProps) {
  // Line skeleton (for text)
  if (variant === 'line') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded"
            />
          ))}
      </div>
    );
  }

  // Circle skeleton (for avatars)
  if (variant === 'circle') {
    return (
      <div className={`space-y-4 flex gap-4 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded-full"
            />
          ))}
      </div>
    );
  }

  // Card skeleton (for list items)
  if (variant === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-border/40 bg-card/40 space-y-3"
            >
              <div className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-1/2" />
              <div className="h-3 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-4/5" />
            </div>
          ))}
      </div>
    );
  }

  // Product skeleton (for grid items)
  if (variant === 'product') {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden bg-card/40 border border-border/40"
            >
              {/* Image */}
              <div className="aspect-square bg-gradient-to-r from-muted via-card to-muted animate-pulse" />
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-full" />
                <div className="flex justify-between pt-2">
                  <div className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-1/3" />
                  <div className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Order skeleton
  if (variant === 'order') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border border-border/40 bg-card/40 space-y-4"
            >
              <div className="flex gap-4 items-start">
                {/* Badge */}
                <div className="h-6 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded-full w-20" />
                {/* Details */}
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-1/3" />
                  <div className="h-3 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-gradient-to-r from-muted via-card to-muted animate-pulse rounded w-full" />
            </div>
          ))}
      </div>
    );
  }

  return null;
}
