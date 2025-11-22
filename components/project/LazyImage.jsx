import React, { useRef, useEffect, useState, useCallback } from "react";

const LazyImage = ({ src, alt, className = "", ...props }) => {
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Memoized cleanup function
  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!src) return;

    const options = {
      threshold: 0.05, // More sensitive threshold
      rootMargin: '100px' // Start loading 100px before entering viewport
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoaded && !isLoading) {
          setIsLoading(true);
          
          // Preload image
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setIsLoaded(true);
            setIsLoading(false);
            cleanup();
          };
          img.onerror = () => {
            setHasError(true);
            setIsLoading(false);
            cleanup();
          };
        }
      });
    }, options);

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return cleanup;
  }, [src, isLoaded, isLoading, cleanup]);

  const defaultClasses = "w-[450px] lg:w-auto object-cover h-[330px] lg:h-[380px] rounded-md";
  const finalClasses = `${defaultClasses} ${className}`.trim();

  return (
    <div ref={imgRef} className={`relative ${finalClasses}`}>
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 rounded-md flex items-center justify-center">
          <div className="text-white text-sm flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading image...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-red-100 rounded-md flex items-center justify-center">
          <div className="text-red-600 text-sm text-center">
            Failed to load image
          </div>
        </div>
      )}

      {/* Actual image */}
      {isLoaded && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`${finalClasses} transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
    </div>
  );
};

export default React.memo(LazyImage);