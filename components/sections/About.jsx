"use client";
import { Langues } from "@/data/Langues";
import Image from "next/image";
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Link as ScrollLink } from "react-scroll";

// Constants for better maintainability and performance
const VIDEO_SRC = "/vds/bsVd2.webm";
const VIDEO_POSTER = "/imgs/video-poster.webp";
const PROFILE_IMAGE = '/imgs/profileIMG.JPG';

// Custom hook for intersection observer
const useIntersectionObserver = (threshold = 0.5, rootMargin = '0px') => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isIntersecting];
};

// Custom hook for video management
const useVideoPlayer = (videoRef, shouldPlay) => {
  const [videoState, setVideoState] = useState({
    isLoaded: false,
    hasError: false,
    isPlaying: false
  });

  // Memoized event handlers
  const handleCanPlay = useCallback(() => {
    setVideoState(prev => ({ ...prev, isLoaded: true }));
  }, []);

  const handleError = useCallback(() => {
    setVideoState(prev => ({ ...prev, hasError: true }));
  }, []);

  const handlePlaying = useCallback(() => {
    setVideoState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const handlePause = useCallback(() => {
    setVideoState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);

    // Preload video
    video.preload = "auto";
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef, handleCanPlay, handleError, handlePlaying, handlePause]);

  // Handle video play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoState.isLoaded) return;

    const manageVideoPlayback = async () => {
      try {
        if (shouldPlay && !videoState.isPlaying) {
          video.muted = true;
          video.playsInline = true;
          await video.play();
        } else if (!shouldPlay && videoState.isPlaying) {
          video.pause();
          video.currentTime = 0;
        }
      } catch (error) {
        setVideoState(prev => ({ ...prev, hasError: true }));
      }
    };

    manageVideoPlayback();
  }, [shouldPlay, videoState.isLoaded, videoState.isPlaying, videoRef]);

  return videoState;
};

// Optimized LanguageItem component to prevent re-renders
const LanguageItem = React.memo(({ lang }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const style = useMemo(() => ({
    backgroundColor: isHovered ? lang.color : '#e5e7eb',
    color: isHovered ? 'white' : 'black'
  }), [isHovered, lang.color]);

  return (
    <li className="grid content-center justify-items-center">
      <span 
        className="flex items-center justify-center px-3 py-1 rounded-full text-sm w-max duration-300 transition-all hover:px-6 hover:shadow-[0_0_5px_white]"
        style={style}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {lang.langName}
      </span>
    </li>
  );
});

LanguageItem.displayName = 'LanguageItem';

// VideoPlayer component for better separation
const VideoPlayer = React.memo(({ videoRef, isInView, onError }) => {
  const { isLoaded, hasError } = useVideoPlayer(videoRef, isInView);

  if (hasError) {
    return (
      <Image 
        src={PROFILE_IMAGE} 
        alt="Video content" 
        width={300} 
        height={300} 
        className="object-cover w-full h-full rounded-md"
        priority
      />
    );
  }

  return (
    <>
      <video 
        ref={videoRef}
        className="w-full h-full object-cover rounded-md"
        muted
        playsInline
        preload="auto"
        onError={onError}
        poster={VIDEO_POSTER}
        loop
      >
        <source src={VIDEO_SRC} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      {!isLoaded && <VideoLoadingIndicator />}
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

// Separate loading component
const VideoLoadingIndicator = React.memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
    <div className="text-white text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
      <span className="text-sm">Loading video...</span>
    </div>
  </div>
));

VideoLoadingIndicator.displayName = 'VideoLoadingIndicator';

// ProfileImage component
const ProfileImage = React.memo(() => (
  <Image  src={PROFILE_IMAGE}  alt='my profile image'  width={300}  height={300}  className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] object-cover hover:shadow-[0_0_5px_#ffffff] duration-300 transition-all hover:scale-[1.01] rounded-md"  priority/>
));

ProfileImage.displayName = 'ProfileImage';

// Main component
export default function About() {
  const videoRef = useRef(null);
  const [aboutSectionRef, isInView] = useIntersectionObserver(0.5, '0px');

  const handleVideoError = useCallback(() => {
    // Video error handling without console.log
  }, []);

  // Memoize languages list to prevent unnecessary re-renders
  const languageItems = useMemo(() => 
    Langues.map(lang => (
      <LanguageItem key={lang._id} lang={lang} />
    )), 
    []
  );

  return (
    <main ref={aboutSectionRef} id="about" className="h-max grid content-start justify-items-center px-5 sm:px-8 md:px-16">
      <div role="textbox" className="grid content-center justify-items-start w-full max-w-4xl">
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mb-2">Who am I</p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] mb-6">About</h2>
      </div>
      <section className="flex items-center justify-center w-full">
        <div role="banner" aria-label="aside shape circle+vertical line" className="relative z-10 flex flex-col justify-center items-center h-full">
          <div className="w-5 h-5 bg-[#ffffff] rounded-full" style={{boxShadow:'0 0 10px #ffffff'}}></div>
          <div className="h-[250px] sm:h-[300px] md:h-[350px] w-[2px] heroLine"></div>
        </div>
        <article className="grid content-center justify-items-center gap-1">
          <span className='text-[#ffffff] w-full flex items-center justify-center rounded-lg text-[15px] md:text-[18px]'>"Where Every Detail is important"</span>
          <div role="img" aria-label="profile image + logo video" className="flex items-between justify-center gap-2">
            <ProfileImage />
            <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] overflow-hidden hover:shadow-[0_0_5px_#ffffff] duration-300 transition-all hover:scale-[1.01]">
              <VideoPlayer  videoRef={videoRef}  isInView={isInView}  onError={handleVideoError} />
            </div>
          </div>
        </article>
      </section>
      
      <section className="w-full grid content-center justify-items-center px-16 gap-10 mb-5">           
        <span className='text-[35px] w-full font-bold text-center' style={{textShadow:'0 0 10px #fff'}}>Web Frontend Developer & Graphic Designer</span>
        <article className="grid content-center justify-items-center w-full gap-2">
          <p className="text-[#dfd9ff] w-full font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] text-center">What languages i can speak</p>
          <ul className="flex space-x-3 h-full flex-wrap items-center justify-center gap-2">{languageItems}</ul>
        </article>
      </section>
      
      <section className='border-2 h-max border-white rounded-md p-3 relative grid content-center justify-items-center gap-2 backdrop-blur-md max-w-4xl' style={{boxShadow:'0 0 5px #ffffff'}}>
        <p className="text-gray-200 text-[18px] text-center">I deliver end-to-end branding solutions, from visual identity and logo design to front-end website development. Discover my capabilities through the projects featured in my portfolio.</p>
        <ScrollLink  to="project"  smooth={true}  duration={600}  offset={-100}  className="flex items-center gap-2 cursor-pointer hover:opacity-70 duration-300">
          <span className="text-[#0db988] w-full py-1 px-2 rounded-md font-semibold transition-all border-[1px] duration-300 hover:no-underline hover:bg-white hover:text-black hover:tracking-widest" style={{boxShadow:'0 0 5px #ffffff'}}><i className="fas fa-hand-pointer duration-300 hover:scale-125"></i>Browse to my Projects</span>
        </ScrollLink>
      </section>
    </main>
  );
}