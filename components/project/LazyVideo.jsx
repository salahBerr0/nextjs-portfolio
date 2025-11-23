import React, { useRef, useEffect, useState } from "react";

const LazyVideo = ({ src }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && videoRef.current && !isLoaded) {
          setIsLoading(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isLoaded]);

  const handleVideoLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
  };

  return (
    <div className="relative w-[450px] lg:w-auto h-[330px] lg:h-[380px]">
      {/* Loading overlay - appears above video */}
      {!isLoaded && (
        <div className="absolute inset-0 rounded-md flex items-center justify-center">
          <div className="text-white text-sm flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading Video...</span>
          </div>
        </div>
      )}
      
      {/* Video element */}
      <video 
        ref={videoRef}
        className="w-full h-full object-cover rounded-md"
        autoPlay 
        muted 
        loop 
        playsInline 
        preload="none"
        onLoadedData={handleVideoLoad}
      >
        {isLoading && <source src={src} type="video/mp4" />}
      </video>
    </div>
  );
};

export default LazyVideo;