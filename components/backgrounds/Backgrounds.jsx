'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ErrorBoundary from '../fallbacks/ErrorBoundary';
import BgFallback from '../fallbacks/BgFallback';

const StarsBackground = dynamic(() => import('@/components/backgrounds/StarsBackground'), {
  ssr: false
});

const ThreeBackground = dynamic(() => import('@/components/backgrounds/ThreeBackground'), {
  ssr: false
});

export default function Backgrounds() {
  const [show3D, setShow3D] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Only run once on mount
  useEffect(() => {
    setHasMounted(true);
    const timer = setTimeout(() => {
      setShow3D(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs once

  if (!hasMounted) {
    return <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black to-gray-900" />;
  }

  return (
    <main className="fixed inset-0 z-[-1]">
      <ErrorBoundary componentName="Backgrounds" fallback={<BgFallback />}>
        <StarsBackground />
      </ErrorBoundary>
      {show3D && 
        <ErrorBoundary componentName="Backgrounds" fallback={<BgFallback />}>
          <ThreeBackground />
        </ErrorBoundary>}
    </main>
  );
}