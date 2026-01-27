'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Client Page Error:', error);
    }, [error]);

    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">¡Algo salió mal!</h2>
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-6 max-w-2xl overflow-auto text-left">
                <p className="font-mono text-xs text-red-200 whitespace-pre-wrap">
                    {error.message}
                </p>
                {error.stack && (
                    <details className="mt-2 text-xs text-gray-400">
                        <summary>Ver detalles técnicos</summary>
                        <pre className="mt-2 whitespace-pre-wrap">{error.stack}</pre>
                    </details>
                )}
            </div>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-4 py-2 bg-lime-500 text-black font-bold rounded hover:bg-lime-400 transition-colors"
            >
                Intentar de nuevo
            </button>
        </div>
    );
}
