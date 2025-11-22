import React, { useRef, useEffect, useState } from "react";

const LazyVideo = ({ src }) => {
  const videoRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && videoRef.current) {
          videoRef.current.load();
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={videoRef} className="w-[450px] lg:w-auto object-cover h-[330px] lg:h-[380px] rounded-md" autoPlay muted loop playsInline preload="none">
      {loaded && <source src={src} type="video/mp4" />}
    </video>
  );
};

export default LazyVideo;
