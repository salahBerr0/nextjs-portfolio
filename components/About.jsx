"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function About(){
    const videoRef = useRef(null);
    const aboutSectionRef = useRef(null);
    const [videoError, setVideoError] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const aboutSection = aboutSectionRef.current;
        if (!video || !aboutSection) return;
        const observer = new IntersectionObserver(
            ([entry]) => {if (entry.isIntersecting) {setIsInView(true);} else {setIsInView(false);}},
            { threshold: 0.5,rootMargin: '0px' }
        );
        observer.observe(aboutSection);
        return () => {observer.disconnect();};
    }, []);

    // Handle video play/pause based on viewport and loaded state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleVideoPlay = async () => {
            if (isInView && isVideoLoaded) {
                try {
                    // Ensure video is muted (required for autoplay)
                    video.muted = true;
                    video.playsInline = true;
                    
                    // Attempt to play
                    await video.play();
                    console.log("Video started playing");
                } catch (error) {
                    console.error("Video play failed:", error);
                    setVideoError(true);
                }
            } else if (!isInView) {
                // Pause and reset when out of view
                video.pause();
                video.currentTime = 0;
            }
        };

        handleVideoPlay();
    }, [isInView, isVideoLoaded]);

    // Handle video load and metadata
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const handleCanPlay = () => {console.log("Video can play");setIsVideoLoaded(true);};
        const handleLoadStart = () => {console.log("Video loading started");};
        const handleWaiting = () => {console.log("Video waiting for data");};
        const handlePlaying = () => {console.log("Video is now playing");};
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.preload = "auto";
        video.load();

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('loadstart', handleLoadStart);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
        };
    }, []);

    const handleVideoError = (e) => {console.error("Video failed to load:", e);setVideoError(true);};
    // Add a manual play button for mobile devices
    const handleManualPlay = async () => {
        const video = videoRef.current;
        if (!video) return;

        try {await video.play();console.log("Manual play successful");
        } catch (error) {console.error("Manual play failed:", error);alert("Please tap the video to play it. Some devices require direct interaction.");
        }
    };

    return(
        <main ref={aboutSectionRef} id="about" className="h-max grid content-start justify-items-start px-5 mb-5 gap-5">
            <section className="grid content-center justify-items-center gap-5 w-full">
                    <article className="flex items-center justify-center gap-2 w-max">
                        <div role="banner" aria-label="aside shape circle+vertical line" className="relative z-10 flex flex-col justify-center items-center h-full">
                            <div className="w-5 h-5 bg-[#ffffff] rounded-full" style={{boxShadow:'0 0 10px #ffffff'}}></div>
                            <div className="h-[250px] sm:h-[300px] md:h-[350px] w-[2px] heroLine"></div>
                        </div>
                        <div role="img" aria-label="profile image + logo video" className="grid content-center justify-items-center gap-1">
                            <span className='text-[#ffffff] w-full flex items-center justify-center rounded-lg text-[15px] md:text-[18px]'>"Where Every Detail is important"</span>
                            <div className="flex items-between justify-center gap-16">
                                <Image   src='/imgs/profileIMG.JPG'   alt='my profile image'   width={200}   height={200}   className="w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] object-cover hover:shadow-[0_0_5px_#ffffff] duration-300 transition-all hover:scale-[1.01]"  priority/>
                                <div className="relative w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] overflow-hidden hover:shadow-[0_0_5px_#ffffff] duration-300 transition-all hover:scale-[1.01]">
                                    {videoError ? (
                                        <Image src="/imgs/profileIMG.JPG" alt="Video content"  width={250} height={250} className="object-cover w-full h-full"/>
                                    ) : (
                                        <>
                                            <video ref={videoRef}  className="w-full h-full object-cover"  muted  playsInline preload="auto"onError={handleVideoError}poster="/imgs/video-poster.jpg"loop>
                                                <source src="/vds/bsVd2.webm" type="video/webm" />
                                                <source src="/vds/bsVd2.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            {!isVideoLoaded && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                                    <div className="text-white text-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                                        <span className="text-sm">Loading video...</span>
                                                    </div>
                                                </div>
                                            )}
                                            {isVideoLoaded && !isInView && (<button onClick={handleManualPlay} className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-20 transition-all"><div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"><svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div></button>)}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>
                    <article className="w-max grid content-center justify-items-center font-bold ">
                        <span className='text-[20px] w-max' style={{textShadow:'0 0 10px #fff'}}>Web Frontend Developer & Graphic Designer</span>
                    </article>
                
            </section>
            <section className='border-2 h-max border-white rounded-sm p-3 relative grid content-center justify-items-center gap-2' style={{boxShadow:'0 0 5px #ffffff'}}>
                <p className="text-gray-200 text-[18px]">I deliver end-to-end branding solutions, from visual identity and logo design to front-end website development. Discover my capabilities through the projects featured in my portfolio.</p>
                <button className="text-[#0db988] w-full py-1 px-2 rounded-sm font-semibold transition-all border-[1px] duration-300 hover:no-underline hover:bg-white hover:text-black hover:tracking-widest" style={{boxShadow:'0 0 5px #ffffff'}}>
                    <i className="fas fa-hand-pointer duration-300 hover:scale-125"></i>Browse to my Projects
                </button>
            </section>
        </main>
    )
}