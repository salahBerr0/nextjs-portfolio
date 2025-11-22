import React, { useRef, useEffect, useState, useCallback } from "react";

const OptimizedLazyVideo = ({ 
  src, 
  className = "", 
  poster, // Thumbnail image
  quality = "auto",
  maxSize = "10MB", // Warning for large files
  ...props 
}) => {
  const videoRef = useRef(null);
  const observerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  // Video optimization recommendations
  const checkVideoOptimization = useCallback((videoSrc) => {
    const warnings = [];
    
    // Check file extension
    if (!videoSrc.match(/\.(mp4|webm|ogg)$/i)) {
      warnings.push("Consider using MP4 (H.264) for best compatibility");
    }
    
    // Check if likely large file (basic heuristic)
    if (videoSrc.includes('large') || videoSrc.includes('hd')) {
      warnings.push("Large video detected. Consider compressing to under 5MB");
    }
    
    return warnings;
  }, []);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Handle video load events with performance monitoring
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setLoadTime(performance.now());
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
    setIsLoading(false);
    const loadDuration = performance.now() - loadTime;
    console.log(`Video loaded in ${loadDuration.toFixed(2)}ms`);
    
    // Warn for slow loads
    if (loadDuration > 3000) {
      console.warn("Slow video load detected. Consider optimizing:", src);
    }
  }, [loadTime, src]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!src) return;

    // Check for optimization issues
    const warnings = checkVideoOptimization(src);
    if (warnings.length > 0) {
      console.warn("Video optimization suggestions:", warnings);
    }

    const options = {
      threshold: 0.05, // More aggressive
      rootMargin: '200px' // Start loading earlier
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && videoRef.current && !isLoaded) {
          const startTime = performance.now();
          
          const video = videoRef.current;
          const source = document.createElement('source');
          source.src = src;
          source.type = 'video/mp4';
          video.appendChild(source);
          video.load();
          
          setIsLoading(true);
          cleanup();
        }
      });
    }, options);

    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return cleanup;
  }, [src, isLoaded, cleanup, checkVideoOptimization]);

  // Event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplaythrough', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplaythrough', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [handleLoadStart, handleLoadedData, handleError]);

  const defaultClasses = "w-[450px] lg:w-auto object-cover h-[330px] lg:h-[380px] rounded-md";
  const finalClasses = `${defaultClasses} ${className}`.trim();

  return (
    <div className="relative">
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className={`${finalClasses} bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center`}>
          <div className="text-white text-sm flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-xs opacity-75">Loading video...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className={`${finalClasses} bg-red-100 flex items-center justify-center`}>
          <div className="text-red-600 text-sm text-center p-4">
            <div className="font-semibold">Video failed to load</div>
            <div className="text-xs mt-1">Check your connection or try refreshing</div>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`${finalClasses} ${!isLoaded ? 'hidden' : ''}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster={poster} // Use poster for immediate visual
        {...props}
      />
    </div>
  );
};

export default React.memo(OptimizedLazyVideo);