/**
 * ErrorBoundary Component
 * Simple error fallback UI for client components
 * In Next.js 16, use error.tsx files in route folders for server errors
 */

'use client';

import { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Wraps children with error recovery UI
 * For true error boundaries, use Next.js error.tsx route convention
 */
export default function ErrorBoundary({
  children,
  fallback
}: ErrorBoundaryProps) {
  if (fallback) {
    return <>{fallback}</>;
  }

  const handleReset = () => {
    window.location.href = '/';
  };

  return (
    <div className="w-full">
      {children ? (
        <>
          {children}
        </>
      ) : (
        <div className="max-w-2xl mx-auto p-8">
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex gap-4 items-start">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-destructive mb-2">
                  Something went wrong
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  An unexpected error occurred. Please try refreshing the page or returning home.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Return Home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
