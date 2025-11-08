"use client";
import React, { useState, useMemo, useCallback, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
const ExpandedProjectCard = lazy(() => import("./ExpandedProjectCard"));

const ProjectClient = ({ projects, toolsMap }) => {
  const [positions, setPositions] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);

  const expandedIndex = useMemo(
    () => projects.findIndex((p) => p._id === expandedProjectId),
    [projects, expandedProjectId]
  );

  const loadMoreProjects = useCallback(() => {
    setVisibleCount((c) => Math.min(c + 5, projects.length));
  }, [projects.length]);

  const onCardMove = useCallback((id, data) => {
    setPositions((pos) => ({
      ...pos,
      [id]: { 
        x: data.offset.x, 
        y: data.offset.y, 
        rotate: data.transform?.rotate || 0
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
    console.log(`Swiped ${dir} on ${id}`);
  }, []);

  const closeExpanded = useCallback(() => {
    setExpandedProjectId(null);
  }, []);

  return (
    <>
      {expandedIndex !== -1 ? (
        <>
          <div className="projCardsMere flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
            {projects.slice(0, expandedIndex).map((project) => {
              const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project._id;
              return (
                <motion.div key={project._id} layout transition={{ duration: 0.5, type: "spring" }} className="w-[400px]">
                  <ProjectCard
                    project={project}
                    pos={pos}
                    isDragged={isDragged}
                    onCardMove={onCardMove}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onSwipe={onSwipe}
                    setExpandedProjectId={setExpandedProjectId}
                  />
                </motion.div>
              );
            })}
          </div>

          <Suspense fallback={<div className="text-white text-center py-10">Loading project...</div>}>
            <ExpandedProjectCard
              project={projects[expandedIndex]}
              toolsMap={toolsMap}
              closeExpanded={closeExpanded}
            />
          </Suspense>

          <div className="flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
            {projects.slice(expandedIndex + 1, visibleCount).map((project) => {
              const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project._id;
              return (
                <motion.div key={project._id} layout transition={{ duration: 0.5, type: "spring" }} className="w-[400px]">
                  <ProjectCard
                    project={project}
                    pos={pos}
                    isDragged={isDragged}
                    onCardMove={onCardMove}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onSwipe={onSwipe}
                    setExpandedProjectId={setExpandedProjectId}
                  />
                </motion.div>
              );
            })}
          </div>
          {visibleCount < projects.length && (
            <button onClick={loadMoreProjects} className="px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Load More Projects
            </button>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-center gap-6 w-full overflow-visible">
            {projects.slice(0, visibleCount).map((project) => {
              const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
              const isDragged = draggedId === project._id;
              return (
                <motion.div key={project._id} layout transition={{ duration: 0.5, type: "spring" }} className="w-[400px]">
                  <ProjectCard
                    project={project}
                    pos={pos}
                    isDragged={isDragged}
                    onCardMove={onCardMove}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onSwipe={onSwipe}
                    setExpandedProjectId={setExpandedProjectId}
                  />
                </motion.div>
              );
            })}
          </div>
          {visibleCount < projects.length && (
            <button onClick={loadMoreProjects} className="px-6 py-3 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Load More Projects
            </button>
          )}
        </>
      )}
    </>
  );
};

export default ProjectClient;
