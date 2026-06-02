'use client';

import { useEffect } from 'react';

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-3xl">⚠️</p>
      <h2 className="font-display text-xl font-bold text-stone-900">Something went wrong</h2>
      <p className="text-stone-500 text-sm max-w-xs">An error occurred loading this page. Try again or refresh.</p>
      <button
        onClick={reset}
        className="bg-amber-700 hover:bg-amber-800 text-white font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
      >
        Try Again
      </button>
    </div>
  );
}
