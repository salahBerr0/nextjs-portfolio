"use client";
import React, { useMemo, memo } from "react";
import { motion } from "framer-motion";
import LazyImage from "./LazyImage";
import LazyVideo from "./LazyVideo";
import Image from "next/image";

// Lazy loaded media content for expanded card
const LazyMediaContent = memo(({ project }) => {
  const allMedia = useMemo(() => {
    const images = (project.projImageUrls || []).map(img => ({ ...img, type: 'image' }));
    const videos = (project.projVideosUrls || []).map(vid => ({
      ...(typeof vid === 'string' ? { priority: 1, url: vid } : vid),
      type: 'video'
    }));
    
    return [...images, ...videos].sort((a, b) => a.priority - b.priority);
  }, [project.projImageUrls, project.projVideosUrls]);

  if (allMedia.length === 0) {
    return <p className="text-gray-400 text-center py-8">No media available</p>;
  }

  return (
    <div className="grid md:grid-cols-2 content-center justify-items-center w-full gap-3">
      {allMedia.map((media, i) => {
        if (media.type === 'image') {
          return (
            <div key={`img-${media.priority}-${i}`} className=" flex items-center justify-center">
              <LazyImage  src={media.url}  alt={`${project.projTitle} image ${i + 1}`}/>
            </div>
          );
        } else {
          return (
            <div key={`video-${media.priority}-${i}`} className=" flex items-center justify-center">
              <LazyVideo src={media.url} />
            </div>
          );
        }
      })}
    </div>
  );
});

LazyMediaContent.displayName = 'LazyMediaContent';

/* ---------------- EXPANDED CARD ---------------- */
const ExpandedProjectCard = memo(({ project, toolsMap, onClose }) => {
  const techStack = useMemo(() => {
    if (!project.projTechStack || !toolsMap) return null;
    
    return project.projTechStack.map((techId, idx) => {
      const tool = toolsMap[techId];
      if (!tool) return null;

      return (
        <li key={`${techId}-${idx}`} className="relative grid content-center justify-items-center gap-2 group">
          <Image src={tool.toolImageUrl}  alt={tool.toolName} width={28} height={28} className="object-contain bg-gray-400/50 p-0 w-7 h-7 rounded-lg border border-gray-200 hover:scale-[1.1] duration-300 transition-transform"/>
          <span className="hidden group-hover:block absolute -bottom-8 p-1 text-xs font-bold text-emerald-800 bg-indigo-100 rounded-sm whitespace-nowrap z-10">
            {tool.toolName}
          </span>
        </li>
      );
    }).filter(Boolean);
  }, [project.projTechStack, toolsMap]);

  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {
      return project.projCategory.map((category, index) => (
        <span  key={`category-${index}`} className="bg-emerald-500/30 px-3 py-1 text-sm text-white rounded-lg"  style={{boxShadow:'0 0 2px #ffffff'}}>
          {category}
        </span>
      ));
    }
    return (
      <span  className="bg-emerald-500/30 px-3 py-1 text-sm text-white rounded-lg"  style={{boxShadow:'0 0 2px #ffffff'}}>
        {project.projCategory}
      </span>
    );
  }, [project.projCategory]);

  const hasLiveDemo = project.projLiveDemoLink && project.projLiveDemoLink !== 'demoLink1';
  const hasSourceCode = project.projSourceCodeLink && project.projSourceCodeLink !== 'sourcelink1';

  return (
    <motion.div  className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex items-center justify-center" style={{ paddingTop: '80px', paddingBottom: '20px' }} initial={{ opacity: 0 }}   animate={{ opacity: 1 }}   exit={{ opacity: 0 }}  transition={{ duration: 0.3 }}  onClick={onClose}>
      <motion.div className="relative w-full mx-5 sm:mx-16 max-w-6xl bg-black border-2 border-white rounded-t-xl text-white flex flex-col " style={{  maxHeight: 'calc(100vh - 100px)',}} initial={{ y: 100 }}  animate={{ y: 0 }}  exit={{ y: 100 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <header className="sticky top-0 z-10 bg-black border-b-2 border-gray-700 rounded-t-3xl md:rounded-t-3xl px-4 py-4 md:px-6 md:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-0">
            <article className="flex-1 w-full gap-2 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold">{project.projTitle}</h1>
              <p className="text-emerald-400 text-sm md:text-base font-semibold mb-2">"{project.projTagLine}"</p>
              <div className="flex flex-wrap gap-2">
                {categories}
                {techStack && techStack.length > 0 && (<ul className="flex items-center gap-1 flex-wrap">{techStack}</ul>)}
              </div>
              <div className="flex flex-wrap gap-2">
                {hasLiveDemo && (
                  <a  href={project.projLiveDemoLink}  target="_blank"  rel="noopener noreferrer"  className="text-sm w-max h-7  text-emerald-500 underline flex items-center justify-center rounded-lg hover:opacity-70 hover:px-10 transition-all duration-200">
                    Live Demo
                  </a>
                )}
                  
                {hasSourceCode && (
                  <a  href={project.projSourceCodeLink}  target="_blank"  rel="noopener noreferrer"  className="text-sm w-max h-7 text-white underline flex items-center justify-center rounded-lg hover:opacity-70 hover:px-10 transition-all duration-200">
                    Source Code
                  </a>
                )}
              </div>
            </article>
            
            <article className="flex items-center justify-center lg:justify-end w-full lg:w-auto min-w-[200px]">
                <button  onClick={onClose}  className="bg-red-800 text-white w-full h-7 rounded-lg text-xs font-semibold hover:bg-red-300 hover:text-black transition-colors"  >
                  Close
                </button>
            </article>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-scroll overflow-x-hidden px-4 py-6 md:px-6 custom-scrollbar">
          {/* Description */}
          <div className="mb-6">
            <p className="bg-white text-black p-4 rounded-md text-sm md:text-base leading-relaxed">
              {project.projDescription}
            </p>
          </div>
          
          {/* Media Content */}
          <LazyMediaContent project={project} />
        </div>
      </motion.div>
    </motion.div>
  );
});

ExpandedProjectCard.displayName = 'ExpandedProjectCard';

export default ExpandedProjectCard;