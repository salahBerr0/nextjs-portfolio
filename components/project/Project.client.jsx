"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ExpandedProjectCard from "./ExpandedProjectCard";

const ProjectClient = ({ projects, toolsMap }) => {
  const [positions, setPositions] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  
  const expandedIndex = useMemo(() => 
    projects.findIndex((p) => p.id === expandedProjectId),
    [projects, expandedProjectId]
  );

  // Initialize positions for all projects
  useEffect(() => {
    const projectIds = new Set(projects.map(p => p.id));
    setPositions(prev => {
      const newPositions = { ...prev };
      // Remove positions for projects that no longer exist
      Object.keys(newPositions).forEach(id => {
        if (!projectIds.has(id)) {
          delete newPositions[id];
        }
      });
      // Initialize positions for new projects
      projects.forEach(project => {
        if (!newPositions[project.id]) {
          newPositions[project.id] = { x: 0, y: 0, rotate: 0 };
        }
      });
      return newPositions;
    });
  }, [projects]);

  const onCardMove = useCallback((id, data) => {
    setPositions(pos => ({
      ...pos,
      [id]: { 
        x: data.offset.x, 
        y: data.offset.y, 
        rotate: data.offset.x * 0.1 // Slight rotation based on x movement
      },
    }));
  }, []);

  const onDragStart = useCallback((id) => {
    setDraggedId(id);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  const onSwipe = useCallback((dir, id) => {
    console.log(`Swiped ${dir} on project ${id}`);
    // Reset position after swipe
    setTimeout(() => {
      setPositions(prev => ({
        ...prev,
        [id]: { x: 0, y: 0, rotate: 0 }
      }));
    }, 300);
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
              const pos = positions[project.id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project.id;
              return (
                <motion.div  key={project.id}   layout  transition={{ duration: 0.5, type: "spring" }}  className="w-[400px]">
                  <ProjectCard   project={project}   pos={pos}   isDragged={isDragged}   onCardMove={onCardMove}   onDragStart={onDragStart}   onDragEnd={onDragEnd}   onSwipe={onSwipe}   setExpandedProjectId={setExpandedProjectIdCallback} />
                </motion.div>
              );
            })}
          </div>

          <motion.div  layout  transition={{ duration: 0.5, type: "spring" }} className="w-full mb-6">
            <ExpandedProjectCard  project={projects[expandedIndex]}  toolsMap={toolsMap} onClose={closeExpanded}/>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
            {afterProjects.map((project) => {
              const pos = positions[project.id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project.id;
              return (
                <motion.div  key={project.id}  layout  transition={{ duration: 0.5, type: "spring" }} className="w-[400px]">
                  <ProjectCard   project={project}  pos={pos}  isDragged={isDragged}  onCardMove={onCardMove}  onDragStart={onDragStart}  onDragEnd={onDragEnd}  onSwipe={onSwipe}  setExpandedProjectId={setExpandedProjectIdCallback}/>
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
          const pos = positions[project.id] || { x: 0, y: 0, rotate: 0 };
          const isDragged = draggedId === project.id;
          return (
            <motion.div  key={project.id}  layout  transition={{ duration: 0.5, type: "spring" }} className="w-max h-max">
              <ProjectCard  project={project}  pos={pos}  isDragged={isDragged}  onCardMove={onCardMove}  onDragStart={onDragStart}  onDragEnd={onDragEnd}  onSwipe={onSwipe}  setExpandedProjectId={setExpandedProjectIdCallback}/>
            </motion.div>
          );
        })}
      </div>
    );
  }, [expandedIndex, projects, positions, draggedId, onCardMove, onDragStart, onDragEnd, onSwipe, closeExpanded, setExpandedProjectIdCallback,toolsMap]);

  return mainContent;
};

export default ProjectClient;