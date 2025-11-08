import React from "react";
import LazyImage from "./LazyImage"; // Import the improved LazyImage

// Server component doesn't need hooks - simplified media content
const MediaContent = ({ project }) => {
  const allMedia = [
    ...project.projImageUrls.map(img => ({ ...img, type: 'image' })),
    ...(project.projVideosUrls ? project.projVideosUrls.map(vid => ({
      ...(typeof vid === 'string' ? { priority: 1, url: vid } : vid),
      type: 'video'
    })) : [])
  ].sort((a, b) => a.priority - b.priority);

  return (
    <div className="grid content-center justify-items-center w-full gap-4">
      {allMedia.map((media, i) => {
        if (media.type === 'image') {
          return (
            <div key={`img-${i}`} className="w-full">
              <LazyImage 
                src={media.url} 
                alt={`${project.projTitle} image ${i + 1}`} 
                width={800} 
                height={400}
                className="border border-white/30 overflow-hidden rounded-lg object-cover w-full h-auto max-h-screen hover:shadow-[0_0_10px_#ffffff] transition-all duration-300"
                priority={i === 0}
                index={i}
              />
            </div>
          );
        } else {
          return (
            <div key={`video-${i}`} className="w-full relative">
              {/* Video skeleton loader */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg animate-pulse flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-white/50 text-xs">Loading video...</span>
                </div>
              </div>
              <video 
                src={media.url}
                className="border border-white/30 overflow-hidden rounded-lg object-cover w-full h-auto max-h-screen hover:shadow-[0_0_10px_#ffffff] transition-all duration-300 relative z-10"
                preload={i < 2 ? "auto" : "metadata"}
                autoPlay 
                loop 
                muted 
                playsInline
                onLoadedData={(e) => {
                  // Hide loader when video loads
                  e.target.previousSibling.style.display = 'none';
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          );
        }
      })}
    </div>
  );
};

/* ---------------- EXPANDED CARD ---------------- */
const ExpandedProjectCard = ({ project, toolsMap, closeExpanded }) => {
  const techStack = project.projTechStack.map((techId, idx) => {
    const tool = toolsMap[techId];
    if (!tool) return null;

    return (
      <li key={`${techId}-${idx}`} className="bigLinksDiv grid content-center justify-items-center gap-2">
        <LazyImage 
          src={tool.toolImageUrl} 
          alt={tool.toolName}
          width={40}
          height={40}
          className="object-contain w-10 h-10 bg-gray-800 p-1 rounded-lg flex items-center justify-center border border-gray-600 hover:scale-110 duration-300 transition-transform"
          priority={idx < 8}
          index={idx}
        />
        <span className="linkText hidden absolute translate-y-12 p-1 text-xs font-bold text-indigo-800 bg-indigo-100 rounded-sm">
          {tool.toolName}
        </span>
      </li>
    );
  }).filter(Boolean);

  const categories = Array.isArray(project.projCategory) 
    ? project.projCategory.map((category, index) => (
        <span 
          key={index} 
          className="bg-indigo-600/40 px-3 py-1 text-sm text-white rounded-full border border-indigo-400/30" 
          style={{boxShadow:'0 0 8px rgba(99, 102, 241, 0.3)'}}
        >
          {category}
        </span>
      ))
    : (
      <span 
        className="bg-indigo-600/40 px-3 py-1 text-sm text-white rounded-full border border-indigo-400/30" 
        style={{boxShadow:'0 0 8px rgba(99, 102, 241, 0.3)'}}
      >
        {project.projCategory}
      </span>
    );

  return (
    <div 
      className="w-full bg-black/90 backdrop-blur-sm border border-white/20 rounded-3xl text-white py-8 px-4 shadow-2xl" 
      style={{ position: "relative", top: 0, left: 0, zIndex: 100 }}
    >
      <header className="mb-8 border-b border-white/20 pb-6 w-full grid content-center justify-items-center xl:flex xl:items-center xl:justify-between px-3">
        <article className="w-full grid content-between gap-3 justify-items-start">
          <h1 className="text-3xl font-bold w-full bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {project.projTitle}
          </h1>
          <p className="text-indigo-400 text-lg font-semibold">"{project.projTagLine}"</p>
          <div className="flex flex-wrap gap-2 mb-2">{categories}</div>      
        </article>
        <article className="flex items-center w-full justify-center xl:justify-end gap-8 mt-4 xl:mt-0">
          <span className="text-[15px] text-white/90 font-semibold px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
            Appreciations: {project.projLikesCount} 
            <i className="fas fa-clover text-indigo-400 ml-2 hover:scale-110 duration-300 transition-transform cursor-pointer"></i>
          </span>
          <div className="flex w-max h-16 gap-4 p-3 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
            {project.projLiveDemoLink && (
              <div className='bigLinksDiv grid content-center justify-items-center hover:scale-110 transition-all duration-300 group'>
                <span className="linkText absolute hidden -translate-y-8 bg-indigo-600 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Live Demo
                </span>
                <a 
                  href={project.projLiveDemoLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg" 
                >
                  <i className="fas fa-link text-white"></i>
                </a>
              </div>
            )}
            {project.projSourceCodeLink && (
              <div className='bigLinksDiv grid content-center justify-items-center hover:scale-110 transition-all duration-300 group'>
                <span className="linkText absolute hidden -translate-y-8 bg-gray-800 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Source Code
                </span>
                <a 
                  href={project.projSourceCodeLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-white w-10 h-10 flex items-center justify-center p-1 rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-lg" 
                >
                  <i className="fas fa-link text-gray-800"></i>
                </a>
              </div>
            )}
            <button 
              onClick={closeExpanded} 
              className="bg-white text-gray-900 hover:bg-gray-200 w-max px-6 rounded-2xl cursor-pointer text-sm font-medium py-2 hover:px-8 transition-all duration-300 shadow-lg border border-white/30" 
            >
              See Less
            </button>
          </div>
        </article>
      </header>
      
      <article className="mb-6 grid content-center justify-items-center gap-8">
        <div className="w-full flex items-start justify-start gap-6">
          <p className="font-bold text-white/90 w-[180px] flex-shrink-0 text-lg">Tech Stack:</p>
          <ul className="flex items-center justify-start gap-3 flex-wrap">
            {techStack}
          </ul>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 w-full">
          <p className="text-white/90 text-lg leading-relaxed">
            {project.projDescription}
          </p>
        </div>
      </article>
      
      <article className="grid content-center justify-items-center gap-4">
        <MediaContent project={project} />
      </article>
      
      <footer className="mt-8 border-t border-white/20 pt-6 w-full grid content-center justify-items-center">
        <div className="flex items-center justify-center w-full max-w-md h-16 gap-4 p-4 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
          {project.projLiveDemoLink && (
            <div className='bigLinksDiv grid content-center justify-items-center hover:scale-110 transition-all duration-300 group'>
              <span className="linkText absolute hidden -translate-y-8 bg-indigo-600 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Live Demo
              </span>
              <a 
                href={project.projLiveDemoLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg" 
              >
                <i className="fas fa-link text-white"></i>
              </a>
            </div>
          )}
          {project.projSourceCodeLink && (
            <div className='bigLinksDiv grid content-center justify-items-center hover:scale-110 transition-all duration-300 group'>
              <span className="linkText absolute hidden -translate-y-8 bg-gray-800 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Source Code
              </span>
              <a 
                href={project.projSourceCodeLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-white w-10 h-10 flex items-center justify-center p-1 rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-lg" 
              >
                <i className="fas fa-link text-gray-800"></i>
              </a>
            </div>
          )}
          <button 
            onClick={closeExpanded} 
            className="bg-white text-gray-900 hover:bg-gray-200 flex-1 rounded-2xl cursor-pointer text-sm font-medium py-3 hover:tracking-wide transition-all duration-300 shadow-lg border border-white/30" 
          >
            Close Project
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ExpandedProjectCard;