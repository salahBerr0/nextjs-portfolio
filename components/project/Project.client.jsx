"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ExpandedProjectCard from "./ExpandedProjectCard";
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback";

const ProjectClient = ({ projects, toolsMap }) => {
  const [positions, setPositions] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  
  const expandedIndex = useMemo(() => 
    projects.findIndex((p) => p._id === expandedProjectId),
    [projects, expandedProjectId]
  );

  useEffect(() => {
    const projectIds = new Set(projects.map(p => p._id));
    setPositions(prev => {
      const newPositions = { ...prev };
      Object.keys(newPositions).forEach(id => {
        if (!projectIds.has(id)) {
          delete newPositions[id];
        }
      });
      return newPositions;
    });
  }, [projects]);

  // Debounced card movement for better performance
  const debouncedCardMove = useDebouncedCallback((id, data) => {
    setPositions(pos => ({
      ...pos,
      [id]: { 
        x: data.offset.x, 
        y: data.offset.y, 
        rotate: data.transform?.rotate || 0 
      },
    }));
  }, 16);

  const onCardMove = useCallback((id, data) => {
    debouncedCardMove(id, data);
  }, [debouncedCardMove]);

  const onDragStart = useCallback((id) => {
    setDraggedId(id);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const onSwipe = useCallback((dir, id) => {
    console.log(`Swiped ${dir} on ${id}`);
  }, []);

  const closeExpanded = useCallback(() => {
    setExpandedProjectId(null);
  }, []);

  const setExpandedProjectIdCallback = useCallback((id) => {
    setExpandedProjectId(id);
  }, []);

  const mainContent = useMemo(() => {
    if (expandedIndex !== -1) {
      const beforeProjects = projects.slice(0, expandedIndex);
      const afterProjects = projects.slice(expandedIndex + 1);

      return (
        <>
          <div className="projCardsMere flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
            {beforeProjects.map((project) => {
              const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project._id;
              return (
                <motion.div 
                  key={project._id}  
                  layout 
                  transition={{ duration: 0.5, type: "spring" }} 
                  className="w-[400px]"
                >
                  <ProjectCard  
                    project={project}  
                    pos={pos}  
                    isDragged={isDragged}  
                    onCardMove={onCardMove}  
                    onDragStart={onDragStart}  
                    onDragEnd={onDragEnd}  
                    onSwipe={onSwipe}  
                    setExpandedProjectId={setExpandedProjectIdCallback} 
                  />
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            layout 
            transition={{ duration: 0.5, type: "spring" }}
            className="w-full mb-6"
          >
            <ExpandedProjectCard 
              project={projects[expandedIndex]} 
              toolsMap={toolsMap}
              closeExpanded={closeExpanded}
            />
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
            {afterProjects.map((project) => {
              const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project._id;
              return (
                <motion.div 
                  key={project._id} 
                  layout 
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-[400px]"
                >
                  <ProjectCard  
                    project={project} 
                    pos={pos} 
                    isDragged={isDragged} 
                    onCardMove={onCardMove} 
                    onDragStart={onDragStart} 
                    onDragEnd={onDragEnd} 
                    onSwipe={onSwipe} 
                    setExpandedProjectId={setExpandedProjectIdCallback}
                  />
                </motion.div>
              );
            })}
          </div>
        </>
      );
    }

    // No project expanded - show all projects
    return (
      <div className="flex flex-wrap items-center justify-center gap-6 w-full overflow-visible">
        {projects.map((project) => {
          const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
          const isDragged = draggedId === project._id;
          return (
            <motion.div 
              key={project._id} 
              layout 
              transition={{ duration: 0.5, type: "spring" }}
              className="w-[400px]"
            >
              <ProjectCard 
                project={project} 
                pos={pos} 
                isDragged={isDragged} 
                onCardMove={onCardMove} 
                onDragStart={onDragStart} 
                onDragEnd={onDragEnd} 
                onSwipe={onSwipe} 
                setExpandedProjectId={setExpandedProjectIdCallback}
              />
            </motion.div>
          );
        })}
      </div>
    );
  }, [
    expandedIndex, 
    projects, 
    positions, 
    draggedId, 
    onCardMove, 
    onDragStart, 
    onDragEnd, 
    onSwipe, 
    closeExpanded, 
    setExpandedProjectIdCallback
  ]);

  return mainContent;
};

export default ProjectClient;