"use client";
import React, { useCallback, useMemo, memo } from "react";
import TinderCard from "react-tinder-card";
import { motion } from "framer-motion";

const ProjectCard = memo(({ project, pos, isDragged, onCardMove, onDragStart, onDragEnd, onSwipe, setExpandedProjectId }) => {
  const sortedImages = useMemo(() => 
    project.projImageUrls.sort((a, b) => a.priority - b.priority), 
    [project.projImageUrls]
  );

  const backgroundImage = useMemo(() => 
    sortedImages.length > 0 ? `url(${sortedImages[0].url})` : null,
    [sortedImages]
  );

  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {
      return project.projCategory.map((category, index) => (
        <span  key={`${category}-${index}`}  className="px-2 py-1 text-sm text-white" style={{boxShadow:'0 0 5px #000000'}}>{category}</span>
      ));
    }
    return (
      <span className="px-2 py-1 text-sm text-white" style={{boxShadow:'0 0 5px #000000'}}>
        {project.projCategory}
      </span>
    );
  }, [project.projCategory]);

  const handleDrag = useCallback((x, y) => {
    onCardMove(project.id, { offset: { x, y }, transform: { rotate: 0 } });
  }, [project.id, onCardMove]);

  const handleSwipe = useCallback((dir) => {
    onSwipe(dir, project.id);
  }, [project.id, onSwipe]);

  const handleDragStart = useCallback(() => {
    onDragStart(project.id);
  }, [project.id, onDragStart]);

  const handleExpand = useCallback(() => {
    setExpandedProjectId(project.id);
  }, [project.id, setExpandedProjectId]);

  return (
    <TinderCard   onSwipe={handleSwipe}   preventSwipe={["up", "down"]}   flickOnSwipe={false}    onDrag={handleDrag}  onDragStart={handleDragStart}    onDragEnd={onDragEnd}    className="cursor-grab w-max h-max content-center">
      <div  className="w-[300px] overflow-hidden h-[400px] relative py-[4px] shadow-xl bg-cover bg-center text-white flex flex-col rounded-lg" style={{ userSelect: "none", transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`, transition: isDragged ? "none" : "transform 0.3s ease", backgroundImage: backgroundImage, backgroundRepeat: "no-repeat", backgroundSize: "cover", boxShadow: "0 12px 24px rgba(0,0,0,0.3)", willChange: isDragged ? 'transform' : 'auto',}}>
        <article className="projectCard hover:bg-black/80 rounded-lg transition-all duration-300 bg-black/50 overflow-hidden p-5 border-[2px] w-full h-[400px] flex-grow flex flex-col justify-between">
          <div className="grid content-center justify-items-start gap-2">
              <h3 className="text-2xl text-start font-bold" style={{textShadow:'0 0 15px #000000'}}>{project.projTitle}</h3>
              <span className="flex flex-wrap gap-2 underline" style={{textShadow:'0 0 10px #000000'}}>{categories}</span>
          </div>
          <button  onClick={handleExpand} className="bg-white w-full h-7 rounded-md cursor-pointer text-[13px] text-emerald-950 hover:opacity-70  transition-all duration-200"  style={{boxShadow:'0 0 5px #ffffff'}}>See More..</button>
        </article>
      </div>
    </TinderCard>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.project.id === nextProps.project.id &&
    prevProps.pos.x === nextProps.pos.x &&
    prevProps.pos.y === nextProps.pos.y &&
    prevProps.pos.rotate === nextProps.pos.rotate &&
    prevProps.isDragged === nextProps.isDragged
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;