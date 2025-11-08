"use client";
import React, { useState, memo } from "react";
import Image from "next/image";

const LazyImage = memo(({ src, alt, width, height, className, priority = false, index = 0 }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`${className} bg-gray-800 flex items-center justify-center rounded-lg`}>
        <span className="text-gray-400 text-sm">Failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg animate-pulse z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white/50 text-xs">Loading...</span>
          </div>
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-auto transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority || index < 3 ? "eager" : "lazy"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;