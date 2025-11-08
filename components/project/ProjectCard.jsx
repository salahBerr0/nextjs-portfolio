"use client";
import React, { useCallback, useMemo, memo } from "react";
import TinderCard from "react-tinder-card";
import { motion } from "framer-motion";

const ProjectCard = memo(({ project, pos, isDragged, onCardMove, onDragStart, onDragEnd, onSwipe, setExpandedProjectId }) => {
  const sortedImages = useMemo(() => 
    [...project.projImageUrls].sort((a, b) => a.priority - b.priority), // avoid mutating original array
    [project.projImageUrls]
  );

  const backgroundImage = useMemo(() => 
    sortedImages.length > 0 ? `url(${sortedImages[0].url})` : null,
    [sortedImages]
  );

  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {
      return project.projCategory.map((category, index) => (
        <span 
          key={`${category}-${index}`} 
          className="bg-indigo-600/30 px-2 py-1 text-sm text-white rounded-full" 
          style={{boxShadow:'0 0 2px #ffffff'}}
        >
          {category}
        </span>
      ));
    }
    return (
      <span className="bg-indigo-600/30 px-2 py-1 text-sm text-white rounded-full">
        {project.projCategory}
      </span>
    );
  }, [project.projCategory]);

  const handleDrag = useCallback((x, y) => {
    onCardMove(project._id, { offset: { x, y }, transform: { rotate: 0 } });
  }, [project._id, onCardMove]);

  const handleSwipe = useCallback((dir) => {
    onSwipe(dir, project._id);
  }, [project._id, onSwipe]);

  const handleDragStart = useCallback(() => {
    onDragStart(project._id);
  }, [project._id, onDragStart]);

  const handleExpand = useCallback(() => {
    setExpandedProjectId(project._id);
  }, [project._id, setExpandedProjectId]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') {
      handleSwipe('right');
    } else if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    }
  }, [handleSwipe]);

  return (
    <TinderCard
      onSwipe={handleSwipe}
      preventSwipe={["up", "down"]}
      flickOnSwipe={false}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className="cursor-grab"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`Project card for ${project.projTitle}, swipe left or right`}
    >
      <motion.div
        role="region"
        aria-label={`Project card: ${project.projTitle}`}
        tabIndex={-1}
        className="w-full overflow-hidden h-[500px] relative py-[4px] shadow-xl bg-cover bg-center text-white flex flex-col rounded-lg"
        animate={!isDragged ? { x: [0, 5, -5, 5, 0], y: [0, -5, -5, 5, 0] } : {}}
        transition={{ duration: 1.5, repeat: !isDragged ? Infinity : 0, ease: "easeInOut" }}
        style={{
          userSelect: "none",
          transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,
          transition: isDragged ? "none" : "transform 0.3s ease",
          backgroundImage,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
          willChange: isDragged ? "transform" : "auto",
        }}
      >
        <article className="projectCard hover:bg-black/80 rounded-lg transition-all duration-300 bg-black/50 overflow-hidden p-5 border-[2px] w-full h-[400px] flex-grow flex flex-col justify-between">
          <div className="grid content-center justify-items-start gap-2">
            <h3 className="text-2xl text-start font-bold">{project.projTitle}</h3>
            <span className="flex flex-wrap gap-2" aria-label="Project categories">{categories}</span>
            <span 
              className="text-[20px] mt-4 text-center flex items-center font-bold text-white/80"
              style={{ textShadow: "0 0 5px #000000" }}
              aria-label={`${project.projLikesCount} likes`}
            >
              <i className="fas fa-clover text-[30px] cursor-pointer hover:scale-[1.3] hover:text-indigo-300 transition-all duration-300 active:text-indigo-700" aria-hidden="true"></i>
              {project.projLikesCount}
            </span>
          </div>

          <span
            className="dragText transition-all duration-300 text-gray-200 right-36 top-56 absolute text-[22px] bg-black/30 px-1"
            style={{ textShadow: "0 0 5px #fff", boxShadow: "0 0 25px #000000" }}
            aria-hidden="true"
          >
            <i className="fas fa-hand text-[20px]"></i>Drag Me
          </span>

          <div className="flex gap-3 p-3 border-2 border-white rounded-3xl" style={{ boxShadow: "0 0 5px #ffffff" }}>
            {project.projLiveDemoLink && (
              <div className="bigLinksDiv grid content-center justify-items-center hover:scale-[1.1] transition-all duration-300">
                <span className="linkText absolute hidden -translate-y-7 bg-indigo-700 p-1 opacity-100 text-white w-max h-max rounded-2xl text-[11px]" aria-hidden="true">Live Demo</span>
                <a
                  href={project.projLiveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:opacity-60"
                  style={{ boxShadow: "0 0 5px #8c86ff" }}
                  aria-label={`Live demo of ${project.projTitle}`}
                >
                  <i className="fas fa-link"></i>
                </a>
              </div>
            )}

            {project.projSourceCodeLink && (
              <div className="bigLinksDiv grid content-center justify-items-center linkDiv hover:scale-[1.1] transition-all duration-300">
                <span className="linkText absolute hidden -translate-y-7 bg-gray-200 p-1 text-black w-max h-max rounded-2xl text-[11px]" aria-hidden="true">Source Code</span>
                <a
                  href={project.projSourceCodeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:opacity-70 text-black w-10 h-10 flex items-center justify-center p-1 rounded-full"
                  style={{ boxShadow: "0 0 5px #ffffff" }}
                  aria-label={`Source code repository for ${project.projTitle}`}
                >
                  <i className="fas fa-link text-gray-800"></i>
                </a>
              </div>
            )}

            <button
              onClick={handleExpand}
              className="bg-white w-full h-10 rounded-3xl cursor-pointer text-[13px] text-indigo-950 hover:opacity-70 hover:mx-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label={`See more details about ${project.projTitle}`}
            >
              See More..
            </button>
          </div>
        </article>
      </motion.div>
    </TinderCard>
  );
}, (prevProps, nextProps) => prevProps.project._id === nextProps.project._id && prevProps.pos.x === nextProps.pos.x && prevProps.pos.y === nextProps.pos.y && prevProps.pos.rotate === nextProps.pos.rotate && prevProps.isDragged === nextProps.isDragged);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
