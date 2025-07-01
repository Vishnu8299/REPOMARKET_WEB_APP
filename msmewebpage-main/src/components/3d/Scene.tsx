import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import ThreeScene from './ThreeScene';

const LoadingFallback = () => (
  <div className="w-full h-[500px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="w-full h-[500px] flex flex-col items-center justify-center text-destructive">
    <p>Something went wrong loading the 3D scene:</p>
    <pre className="text-sm">{error.message}</pre>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Try again
    </button>
  </div>
);

const Scene = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-[500px]"
      >
        <Suspense fallback={<LoadingFallback />}>
          <ThreeScene />
        </Suspense>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Scene;
