import React, { useRef, useEffect, useState } from "react";

const LazyImage = ({ src, alt, className = "" }) => {
  const imgRef = useRef(null);
  const [loadedSrc, setLoadedSrc] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedSrc) {
          setLoadedSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src, loadedSrc]);

  return (
    <div ref={imgRef} className={` ${className}`}>
      {loadedSrc ? (
        <img src={loadedSrc} alt={alt} className="w-[450px] lg:w-auto object-cover h-[330px] lg:h-[380px] rounded-md transition-opacity duration-500 opacity-100" loading="lazy"/>
      ) : (
        <div className="w-auto  aspect-video bg-gray-800 rounded-md animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;