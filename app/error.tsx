'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-6">
      <div className="p-4 bg-red-500/10 rounded-full">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground max-w-md">
          The engine encountered an unexpected error. Our team has been notified.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8"
      >
        Try Again
      </Button>
    </div>
  );
}
