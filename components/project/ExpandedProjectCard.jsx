"use client";
import React, { useState, useMemo, memo, useEffect } from "react";
import { motion } from "framer-motion";
import LazyImage from "./LazyImage";

// Lazy loaded media content for expanded card
const LazyMediaContent = memo(({ project }) => {
  const [loadedMedia, setLoadedMedia] = useState(new Set());
  const [visibleIndex, setVisibleIndex] = useState(0);

  const allMedia = useMemo(() => {
    const media = [
      ...project.projImageUrls.map(img => ({ ...img, type: 'image' })),
      ...(project.projVideosUrls ? project.projVideosUrls.map(vid => ({
        ...(typeof vid === 'string' ? { priority: 1, url: vid } : vid),
        type: 'video'
      })) : [])
    ].sort((a, b) => a.priority - b.priority);
    return media;
  }, [project.projImageUrls, project.projVideosUrls]);

  // Intersection Observer for lazy loading media
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            setVisibleIndex(prev => Math.max(prev, index));
            setLoadedMedia(prev => new Set([...prev, index]));
          }
        });
      },
      { rootMargin: '50px' }
    );

    const mediaElements = document.querySelectorAll('[data-media-index]');
    mediaElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid content-center justify-items-center w-full gap-2">
      {allMedia.map((media, i) => {
        // Only render media that's visible or nearby
        if (i > visibleIndex + 2) {
          return (
            <div  key={i}  data-media-index={i} className="w-full h-64 bg-gray-200 animate-pulse"/>
          );
        }

        if (media.type === 'image') {
          return (
            <div key={`img-${i}`} data-media-index={i} className="w-full ">
              <LazyImage  src={media.url}  alt={`${project.projTitle} image ${i + 1}`}  width={800}  height={400} className="border-1 border-white object-cover w-full h-auto max-h-screen overflow-auto hover:shadow-[0_0_5px_#ffffff] transition-all duration-300" priority={i === 0} index={i}/>
            </div>
          );
        } else {
          return (
            <div key={`video-${i}`} data-media-index={i} className="w-full">
              <video  src={media.url}  className="border-1 border-white object-cover w-full h-auto max-h-screen hover:shadow-[0_0_5px_#ffffff] transition-all duration-300"  preload={i < 2 ? "auto" : "metadata"} loading="lazy" autoPlay loop  muted  playsInline/>
            </div>
          );
        }
      })}
    </div>
  );
});

LazyMediaContent.displayName = 'LazyMediaContent';

/* ---------------- EXPANDED CARD ---------------- */
const ExpandedProjectCard = memo(({ project, toolsMap, closeExpanded }) => {
  const techStack = useMemo(() => {
    return project.projTechStack.map((techId, idx) => {
      const tool = toolsMap[techId];
      if (!tool) return null;

      return (
        <li key={`${techId}-${idx}`} className="bigLinksDiv grid content-center justify-items-center gap-2">
          <LazyImage 
            src={tool.toolImageUrl} 
            alt={tool.toolName}
            width={40}
            height={40}
            className="object-contain w-10 h-10 bg-gray-200 p-[1px] rounded-lg flex items-center justify-center border border-gray-200 hover:scale-[1.1] duration-300 transition-transform"
            priority={idx < 8}
            index={idx}
          />
          <span className="linkText hidden absolute translate-y-12 p-1 text-xs font-bold text-indigo-800 bg-indigo-100 rounded-sm">
            {tool.toolName}
          </span>
        </li>
      );
    }).filter(Boolean);
  }, [project.projTechStack, toolsMap]);

  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {
      return project.projCategory.map((category, index) => (
        <span 
          key={index} 
          className="bg-indigo-600/30 px-2 py-1 text-md text-white rounded-full" 
          style={{boxShadow:'0 0 5px #ffffff'}}
        >
          {category}
        </span>
      ));
    }
    return (
      <span 
        className="bg-indigo-600/30 px-2 py-1 text-md text-white rounded-full" 
        style={{boxShadow:'0 0 5px #ffffff'}}
      >
        {project.projCategory}
      </span>
    );
  }, [project.projCategory]);

  return (
    <motion.div  layout  className="w-full bg-black bg-opacity-95 border-2 border-white rounded-3xl text-white py-8 px-3"  style={{ position: "relative", top: 0, left: 0, zIndex: 100 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <header className="mb-6 border-b pb-4 border-gray-300 w-full grid content-center justify-items-center xl:flex xl:items-center xl:justify-between px-3">
        <article className="w-full grid content-between gap-2 justify-items-start">
          <h1 className="text-3xl font-bold w-full">{project.projTitle}</h1>
          <p className="text-indigo-600 text-md font-bold">"{project.projTagLine}"</p>
          <span className="flex flex-wrap gap-1 mb-2">{categories}</span>      
        </article>
        <article className="flex items-center w-full justify-center xl:justify-end gap-10">
          <span className="text-[15px] text-white font-bold" style={{textShadow:'0 0 5px #000000'}}>Appreciations:{project.projLikesCount} <i className="fas fa-clover text-indigo-600 hover:scale-[1.2] duration-300 transition-transform cursor-pointer active:text-white"></i></span>
          <div className="flex w-max h-16 gap-3 p-3 border-2 border-white rounded-3xl">
            {project.projLiveDemoLink && (
              <div className='bigLinksDiv grid content-center justify-items-center hover:scale-[1.1] transition-all duration-300'>
                <span className="linkText absolute hidden -translate-y-7 bg-indigo-700 p-1 opacity-100 text-white w-max h-max rounded-2xl text-[11px]">Live Demo</span>
                <a  href={project.projLiveDemoLink}  target="_blank"  rel="noopener noreferrer"  className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:opacity-60"  style={{boxShadow:'0 0 5px #8c86ff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            {project.projSourceCodeLink && (
              <div className='bigLinksDiv grid content-center justify-items-center linkDiv hover:scale-[1.1] transition-all duration-300'>
                <span className="linkText absolute hidden -translate-y-7 bg-gray-200 p-1 text-black w-max h-max rounded-2xl text-[11px]">Source Code</span>
                <a  href={project.projSourceCodeLink}  target="_blank"  rel="noopener noreferrer"  className="bg-white hover:opacity-70 text-black w-10 h-10 flex items-center justify-center p-1 rounded-full"  style={{boxShadow:'0 0 5px #ffffff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            <button  onClick={closeExpanded} className="bg-white hover:bg-gray-400 w-max px-10 rounded-3xl cursor-pointer text-[13px] text-black hover:text-red-700 py-2 hover:mx-5 transition-all duration-300"  style={{boxShadow:'0 0 5px #ffffff'}}>See Less
            </button>
          </div>
        </article>
      </header>
      
      <article className="mb-2 grid content-center justify-items-center gap-10">
        <div className="w-full h-max flex items-center justify-start gap-5">
          <p className="font-bold w-[200px] flex flex-nowrap">Tech Stack used: </p>
          <ul className="flex items-center justify-center gap-2 flex-wrap h-full w-full">{techStack}</ul>
        </div>
        <p className="bg-white text-black p-3 w-full text-lg rounded-sm">{project.projDescription}</p>
      </article>
      
      <article className="grid content-center justify-items-center gap-2">
        <LazyMediaContent project={project} />
      </article>
      
      <footer className="mt-6 border-t pt-4 border-gray-300 w-full grid content-center justify-items-center xl:flex items-center justify-center px-3">
        <div className="flex items-center justify-between w-full max-w-xl h-16 gap-3 p-3 border-2 border-white rounded-3xl">
          {project.projLiveDemoLink && (
            <div className='bigLinksDiv grid content-center justify-items-center hover:scale-[1.1] transition-all duration-300'>
              <span className="linkText absolute hidden -translate-y-7 bg-indigo-700 p-1 opacity-100 text-white w-max h-max rounded-2xl text-[11px]">Live Demo</span>
              <a  href={project.projLiveDemoLink}  target="_blank"  rel="noopener noreferrer"  className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:opacity-60"  style={{boxShadow:'0 0 5px #8c86ff'}}><i className="fas fa-link"></i>
              </a>
            </div>
          )}
          {project.projSourceCodeLink && (
            <div className='bigLinksDiv grid content-center justify-items-center linkDiv hover:scale-[1.1] transition-all duration-300'>
              <span className="linkText absolute hidden -translate-y-7 bg-gray-200 p-1 text-black w-max h-max rounded-2xl text-[11px]">Source Code</span>
              <a  href={project.projSourceCodeLink}  target="_blank"  rel="noopener noreferrer"  className="bg-white hover:opacity-70 text-black w-10 h-10 flex items-center justify-center p-1 rounded-full"  style={{boxShadow:'0 0 5px #ffffff'}}><i className="fas fa-link"></i></a>
            </div>
          )}
          <button  onClick={closeExpanded} className="bg-white w-full hover:bg-gray-400 px-10 rounded-3xl cursor-pointer hover:mx-5 text-[13px] text-black hover:text-red-700 py-2"  style={{boxShadow:'0 0 5px #ffffff'}}>See Less
          </button>
        </div>
      </footer>
    </motion.div>
  );
});

ExpandedProjectCard.displayName = 'ExpandedProjectCard';

export default ExpandedProjectCard;