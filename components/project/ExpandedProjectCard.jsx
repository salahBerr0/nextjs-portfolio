import React, { useCallback, useMemo, lazy, Suspense } from "react";
import LazyImage from "./LazyImage";
import { useInView } from "react-intersection-observer";

// Lazy load MediaItem to reduce initial bundle and improve scroll performance
const MediaItem = lazy(() => import("./MediaItem")); // Assume MediaItem is a separate file optimized similarly

const MediaContent = React.memo(({ project }) => {
  const allMedia = useMemo(
    () => [
      ...project.projImageUrls.map((img) => ({ ...img, type: "image" })),
      ...(project.projVideosUrls
        ? project.projVideosUrls.map((vid) =>
            typeof vid === "string" ? { priority: 1, url: vid, type: "video" } : { ...vid, type: "video" }
          )
        : []),
    ].sort((a, b) => a.priority - b.priority),
    [project.projImageUrls, project.projVideosUrls]
  );

  // Suspense handles lazy loaded media
  return (
    <section
      className="grid content-center justify-items-center w-full gap-4"
      aria-label={`Media content of project ${project.projTitle}`}
    >
      <Suspense fallback={<div className="animate-pulse w-full h-[400px] bg-gray-800 rounded-lg" aria-hidden="true" />}>
        {allMedia.map((media, i) => (
          <MediaItem key={`${media.type}-${i}`} media={media} index={i} projectTitle={project.projTitle} />
        ))}
      </Suspense>
    </section>
  );
});

const ExpandedProjectCard = ({
  project,
  toolsMap,
  closeExpanded,
}) => {
  const techStack = useMemo(
    () =>
      project.projTechStack
        .map((techId, idx) => {
          const tool = toolsMap[techId];
          if (!tool) return null;
          return (
            <li
              key={`${techId}-${idx}`}
              className="bigLinksDiv grid content-center justify-items-center gap-2"
              tabIndex={0}
              aria-label={`Technology tool: ${tool.toolName}`}
            >
              <LazyImage
                src={tool.toolImageUrl}
                alt={tool.toolName}
                width={40}
                height={40}
                className="object-contain w-10 h-10 bg-gray-800 p-1 rounded-lg flex items-center justify-center border border-gray-600 hover:scale-110 duration-300 transition-transform focus:outline-none focus:ring-2 focus:ring-indigo-400"
                priority={idx < 8}
                index={idx}
              />
              <span className="linkText hidden absolute translate-y-12 p-1 text-xs font-bold text-indigo-800 bg-indigo-100 rounded-sm">{tool.toolName}</span>
            </li>
          );
        })
        .filter(Boolean),
    [project.projTechStack, toolsMap]
  );

  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {
      return project.projCategory.map((category, index) => (
        <span
          key={index}
          className="bg-indigo-600/40 px-3 py-1 text-sm text-white rounded-full border border-indigo-400/30"
          style={{ boxShadow: "0 0 8px rgba(99, 102, 241, 0.3)" }}
        >
          {category}
        </span>
      ));
    }
    return (
      <span
        className="bg-indigo-600/40 px-3 py-1 text-sm text-white rounded-full border border-indigo-400/30"
        style={{ boxShadow: "0 0 8px rgba(99, 102, 241, 0.3)" }}
      >
        {project.projCategory}
      </span>
    );
  }, [project.projCategory]);

  const handleClose = useCallback(() => {
    closeExpanded();
  }, [closeExpanded]);

  return (
    <section
      className="w-full bg-black/90 backdrop-blur-sm border border-white/20 rounded-3xl text-white py-8 px-4 shadow-2xl max-h-[calc(100vh-40px)] overflow-auto"
      style={{ position: "relative", top: 0, left: 0, zIndex: 100 }}
      aria-labelledby="project-title"
      role="dialog"
    >
      <header
        id="project-title"
        className="sticky top-0 z-20 mb-8 border-b border-white/20 pb-6 bg-black/95 backdrop-blur-md w-full grid content-center justify-items-center xl:flex xl:items-center xl:justify-between px-3"
      >
        <article
          className="w-full grid content-between gap-3 justify-items-start"
          aria-label={`Information about project titled ${project.projTitle}`}
        >
          <h1 className="text-3xl font-bold w-full bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {project.projTitle}
          </h1>
          <p className="text-indigo-400 text-lg font-semibold">"{project.projTagLine}"</p>
          <div className="flex flex-wrap gap-2 mb-2" aria-label="Project categories">
            {categories}
          </div>
        </article>
        <article
          className="flex items-center w-full justify-center xl:justify-end gap-8 mt-4 xl:mt-0"
          aria-label="Project interaction buttons and appreciation count"
        >
          <span
            className="text-[15px] text-white/90 font-semibold px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm"
            aria-live="polite"
          >
            Appreciations: {project.projLikesCount}
            <i
              className="fas fa-clover text-indigo-400 ml-2 hover:scale-110 duration-300 transition-transform cursor-pointer"
              aria-hidden="true"
            ></i>
          </span>
          <div className="flex w-max h-16 gap-4 p-3 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
            {project.projLiveDemoLink && (
              <div className="bigLinksDiv grid content-center justify-items-center hover:scale-110 transition-all duration-300 group">
                <span
                  className="linkText absolute hidden -translate-y-8 bg-indigo-600 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                >
                  Live Demo
                </span>
                <a
                  href={project.projLiveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:bg-indigo-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label={`Open live demo of ${project.projTitle} in new tab`}
                >
                  <i className="fas fa-link text-white" aria-hidden="true"></i>
                </a>
              </div>
            )}
            {project.projSourceCodeLink && (
              <div className="bigLinksDiv grid content-center justify-items-center hover:scale-110 transition-all duration-300 group">
                <span
                  className="linkText absolute hidden -translate-y-8 bg-gray-800 px-2 py-1 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-hidden="true"
                >
                  Source Code
                </span>
                <a
                  href={project.projSourceCodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white w-10 h-10 flex items-center justify-center p-1 rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-label={`Open source code repository of ${project.projTitle} in new tab`}
                >
                  <i className="fas fa-link text-gray-800" aria-hidden="true"></i>
                </a>
              </div>
            )}
            <button
              onClick={handleClose}
              className="bg-white text-gray-900 hover:bg-gray-200 w-max px-6 rounded-2xl cursor-pointer text-sm font-medium py-2 hover:px-8 transition-all duration-300 shadow-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Close project details"
            >
              See Less
            </button>
          </div>
        </article>
      </header>

      <article
        className="mb-6 grid content-center justify-items-center gap-8"
        aria-label="Project technology stack and description"
      >
        <div className="w-full flex items-start justify-start gap-6">
          <p className="font-bold text-white/90 w-[180px] flex-shrink-0 text-lg">Tech Stack:</p>
          <ul className="flex items-center justify-start gap-3 flex-wrap">{techStack}</ul>
        </div>
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 w-full">
          <p className="text-white/90 text-lg leading-relaxed">{project.projDescription}</p>
        </div>
      </article>

      <article
        className="grid content-center justify-items-center gap-4"
        aria-label="Project media content"
      >
        <MediaContent project={project} />
      </article>
    </section>
  );
};

export default ExpandedProjectCard;
