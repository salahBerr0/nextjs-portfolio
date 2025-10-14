"use client";
import React, { useState, useCallback, useMemo, memo } from "react";
import TinderCard from "react-tinder-card";
import { motion } from "framer-motion";
import { Tools } from "@/data/Tools";
import { Projects } from "@/data/Projects";
import Image from "next/image";

/* ---------------- SMALL CARD ---------------- */
const ProjectCard = memo(({ project, pos, isDragged, onCardMove, onDragStart, onDragEnd, onSwipe, setExpandedProjectId }) => {
  const sortedImages = useMemo(() => 
    project.projImageUrls.sort((a, b) => a.priority - b.priority), 
    [project.projImageUrls]
  );
  const backgroundImage = sortedImages.length > 0 ? `url(${sortedImages[0].url})` : null;  // Memoize categories rendering
  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {
      return project.projCategory.map((category, index) => (<span key={index} className="bg-indigo-600/30 px-2 py-1 text-sm text-white rounded-full" style={{boxShadow:'0 0 2px #ffffff'}}>{category}</span>));
    }
    return (<span className="bg-indigo-600/30 px-2 py-1 text-sm text-white rounded-full">{project.projCategory}</span>);
  }, [project.projCategory]);

  const handleDrag = useCallback((x, y) => {onCardMove(project._id, { offset: { x, y }, transform: { rotate: 0 } });}, [project._id, onCardMove]);
  const handleSwipe = useCallback((dir) => {onSwipe(dir, project._id);}, [project._id, onSwipe]);
  const handleDragStart = useCallback(() => {onDragStart(project._id);}, [project._id, onDragStart]);
  const handleExpand = useCallback(() => {setExpandedProjectId(project._id);}, [project._id, setExpandedProjectId]);

  return (
    <TinderCard  onSwipe={handleSwipe}  preventSwipe={["up", "down"]}  flickOnSwipe={false}   onDrag={handleDrag} onDragStart={handleDragStart}   onDragEnd={onDragEnd}   className="cursor-grab" >
      <motion.div className="w-full overflow-hidden h-[500px] relative rounded-2xl py-[4px] shadow-xl bg-cover bg-center text-white flex flex-col"  animate={!isDragged ? { x: [0, 5, -5, 5,0], y: [0, -5, -5, 5, 0] } : {}} transition={{ duration: 1.5, repeat: !isDragged ? Infinity : 0, ease: "easeInOut" }} style={{userSelect: "none",  transform: `translateX(${pos.x}px) translateY(${pos.y}px) rotate(${pos.rotate}deg)`,  transition: isDragged ? "none" : "transform 0.3s ease",  backgroundImage: backgroundImage,  backgroundRepeat: "no-repeat",  backgroundSize: "cover",  boxShadow: "0 12px 24px rgba(0,0,0,0.3)",}}>
        <article className="projectCard hover:bg-black/80 transition-all duration-300 bg-black/50 overflow-hidden p-5 border-[2px] rounded-2xl w-full h-[400px] flex-grow flex flex-col justify-between">
          <div className="grid content-center justify-items-start gap-2">
            <h3 className="text-2xl text-start font-bold">{project.projTitle}</h3>
            <span className="flex flex-wrap gap-2" >{categories}</span>
            <span className="text-[20px] mt-4 text-center flex items-center font-bold text-white/80" style={{textShadow:'0 0 5px #000000'}}><i className="fas fa-clover text-[30px] text-center cursor:pointer hover:scale-[1.3] hover:text-indigo-300 transition-all duration-300 active:text-indigo-700"></i>{project.projLikesCount}</span>
          </div>
          <span className="dragText transition-all duration-300 text-gray-200 right-36 top-56 absolute text-[22px] bg-black/30 px-1" style={{textShadow:'0 0 5px #fff',boxShadow:'0 0 25px #000000'}}><i className="fas fa-hand text-[20px]"></i>Drag Me</span>
          <div className=" flex gap-3 p-3 border-2 border-white rounded-3xl" style={{boxShadow:'0 0 5px #ffffff'}}>
            {project.projLiveDemoLink && (
              <div className='bigLinksDiv grid content-center justify-items-center hover:scale-[1.1] transition-all duration-300' >
                <span className="linkText absolute hidden -translate-y-7 bg-indigo-700 p-1 opacity-100 text-white w-max h-max rounded-2xl text-[11px]">Live Demo</span>
                <a href={project.projLiveDemoLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:opacity-60" style={{boxShadow:'0 0 5px #8c86ff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            {project.projSourceCodeLink && (
              <div className='bigLinksDiv grid content-center justify-items-center linkDiv hover:scale-[1.1] transition-all duration-300'>
                <span className="linkText absolute hidden -translate-y-7 bg-gray-200 p-1 text-black w-max h-max rounded-2xl text-[11px]">Source Code</span>
                <a href={project.projSourceCodeLink} target="_blank" rel="noopener noreferrer" className="bg-white hover:opacity-70 text-black w-10 h-10 flex items-center justify-center p-1 rounded-full" style={{boxShadow:'0 0 5px #ffffff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            <button  onClick={handleExpand} className="bg-white w-full rounded-3xl cursor-pointer text-[13px] text-indigo-950 hover:opacity-70 hover:scale-[1.1] transition-all duration-300" style={{boxShadow:'0 0 5px #ffffff'}}>See More..</button>
          </div>
        </article>
      </motion.div>
    </TinderCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

/* ---------------- EXPANDED CARD ---------------- */
const ExpandedProjectCard = memo(({ project, closeExpanded }) => {
  // Create a lookup map for tools for O(1) access
  const toolsMap = useMemo(() => {
    const map = {};
    Tools.forEach(tool => {map[tool._id] = tool;});
    return map;
  }, []);

  // Memoize tech stack rendering
  const techStack = useMemo(() => {
    return project.projTechStack.map((techId, idx) => {
      const tool = toolsMap[techId];
      const toolName = tool ? tool.toolName : `Tool ${techId}`;
      const toolImage = tool ? tool.toolImageUrl : '';

      return (
        <li key={`${techId}-${idx}`} className="bigLinksDiv grid content-center justify-items-center gap-2">
          {toolImage && (<Image  src={toolImage}  alt={toolName}  width={40} height={40} className="object-contain bg-gray-200 p-[1px] rounded-lg flex items-center justify-center border border-gray-200 hover:scale-[1.1] duration-300 transition-transform"/>)}
          <span className="linkText hidden absolute translate-y-12 p-1 text-xs font-bold text-indigo-800 bg-indigo-100 rounded-sm">{toolName}</span>
        </li>
      );
    });
  }, [project.projTechStack, toolsMap]);

  // Memoize categories rendering
  const categories = useMemo(() => {
    if (Array.isArray(project.projCategory)) {return project.projCategory.map((category, index) => (<span key={index} className="bg-indigo-600/30 px-2 py-1 text-md text-white rounded-full" style={{boxShadow:'0 0 5px #ffffff'}}>{category}</span>));}
    return (<span className="bg-indigo-600/30 px-2 py-1 text-md text-white rounded-full" style={{boxShadow:'0 0 5px #ffffff'}}>{project.projCategory}</span>);
  }, [project.projCategory]);

  // Memoize media rendering with priority sorting
  const mediaContent = useMemo(() => {
    // Sort and combine all media by priority
    const allMedia = [
      ...project.projImageUrls.map(img => ({ ...img, type: 'image' })),
      ...(project.projVideosUrls ? project.projVideosUrls.map(vid => ({
        ...(typeof vid === 'string' ? { priority: 1, url: vid } : vid),
        type: 'video'
      })) : [])
    ].sort((a, b) => a.priority - b.priority);

    return allMedia.map((media, i) => {
      if (media.type === 'image') {
        return (<Image key={i} src={media.url} alt={`${project.projTitle} image ${i + 1}`} width={800} height={400} className="border-1 border-white object-cover w-full h-auto max-h-screen overflow-auto hover:shadow-[0_0_5px_#ffffff] transition-all duration-300"/>);
      } else {
        return (<video key={`video-${i}`} src={media.url} className="border-1 border-white object-cover w-full h-auto max-h-screen hover:shadow-[0_0_5px_#ffffff] transition-all duration-300" preload="metadata" autoPlay loop muted playsInline/>);
      }
    });
  }, [project.projImageUrls, project.projVideosUrls, project.projTitle]);

  return (
    <motion.div  layout  className="w-full bg-black bg-opacity-95 border-2 border-white rounded-3xl text-white py-8 px-3" style={{ position: "relative", top: 0, left: 0, zIndex: 100 }}>
      <header className="mb-6 border-b pb-4 border-gray-300 w-full grid content-center justify-items-center xl:flex xl:items-center xl:justify-between px-3">
        <article className="w-full grid content-between gap-2 justify-items-start">
          <h1 className="text-3xl font-bold w-full">{project.projTitle}</h1>
          <p className="text-indigo-600 text-md font-bold">"{project.projTagLine}"</p>
          <span className="flex flex-wrap gap-1 mb-2">{categories}</span>      
        </article>
        <article className="flex items-center w-full justify-center xl:justify-end gap-10">
          <span className="text-[15px] text-white font-bold" style={{textShadow:'0 0 5px #000000'}}>Appreciations:{project.projLikesCount} <i className="fas fa-clover text-indigo-600 hover:scale-[1.2] duration-300 transition-transform cursor-pointer active:text-white"></i></span>
          <div className="flex w-max h-16 gap-3 p-3 border-2 border-white rounded-3xl ">
            {project.projLiveDemoLink && (
              <div className='bigLinksDiv grid content-center justify-items-center hover:scale-[1.1] transition-all duration-300' >
                <span className="linkText absolute hidden -translate-y-7 bg-indigo-700 p-1 opacity-100 text-white w-max h-max rounded-2xl text-[11px]">Live Demo</span>
                <a href={project.projLiveDemoLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:opacity-60" style={{boxShadow:'0 0 5px #8c86ff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            {project.projSourceCodeLink && (
              <div className='bigLinksDiv grid content-center justify-items-center linkDiv hover:scale-[1.1] transition-all duration-300'>
                <span className="linkText absolute hidden -translate-y-7 bg-gray-200 p-1 text-black w-max h-max rounded-2xl text-[11px]">Source Code</span>
                <a href={project.projSourceCodeLink} target="_blank" rel="noopener noreferrer" className="bg-white hover:opacity-70 text-black w-10 h-10 flex items-center justify-center p-1 rounded-full" style={{boxShadow:'0 0 5px #ffffff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            <button  onClick={closeExpanded}  className="bg-white hover:bg-gray-400 w-max px-10 rounded-3xl cursor-pointer text-[13px] text-black hover:text-red-700 py-2 hover:scale-[1.1] transition-all duration-300" style={{boxShadow:'0 0 5px #ffffff'}}>See Less</button>
          </div>
        </article>
      </header>
      <article className="mb-2 grid content-center justify-items-center mx-10 gap-10">
        <div className="w-full h-max flex items-center justify-start gap-5">
          <p className="font-bold w-[200px] flex flex-nowrap">Tech Stack used: </p>
          <ul className="flex items-center justify-center gap-2 flex-wrap h-full w-full">{techStack}</ul>
        </div>
        <p className="bg-white text-black p-3 w-full text-lg rounded-lg">{project.projDescription}</p>
      </article>
      <article className="grid content-center justify-items-center gap-2"><div className="grid content-center justify-items-center w-full gap-2">{mediaContent}</div></article>
      <footer className="mt-6 border-t pt-4 border-gray-300 w-full grid content-center justify-items-center xl:flex items-center justify-center px-3">
          <div className="flex items-center justify-between w-full max-w-xl h-16 gap-3 p-3 border-2 border-white rounded-3xl ">
            {project.projLiveDemoLink && (
              <div className='bigLinksDiv grid content-center justify-items-center hover:scale-[1.1] transition-all duration-300' >
                <span className="linkText absolute hidden -translate-y-7 bg-indigo-700 p-1 opacity-100 text-white w-max h-max rounded-2xl text-[11px]">Live Demo</span>
                <a href={project.projLiveDemoLink} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 w-10 h-10 flex items-center justify-center p-1 rounded-full hover:opacity-60" style={{boxShadow:'0 0 5px #8c86ff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            {project.projSourceCodeLink && (
              <div className='bigLinksDiv grid content-center justify-items-center linkDiv hover:scale-[1.1] transition-all duration-300'>
                <span className="linkText absolute hidden -translate-y-7 bg-gray-200 p-1 text-black w-max h-max rounded-2xl text-[11px]">Source Code</span>
                <a href={project.projSourceCodeLink} target="_blank" rel="noopener noreferrer" className="bg-white hover:opacity-70 text-black w-10 h-10 flex items-center justify-center p-1 rounded-full" style={{boxShadow:'0 0 5px #ffffff'}}><i className="fas fa-link"></i></a>
              </div>
            )}
            <button  onClick={closeExpanded}  className="bg-white w-full hover:bg-gray-400 px-10 rounded-3xl cursor-pointer text-[13px] text-black hover:text-red-700 py-2" style={{boxShadow:'0 0 5px #ffffff'}}>See Less</button>
          </div>
      </footer>
    </motion.div>
  );
});

ExpandedProjectCard.displayName = 'ExpandedProjectCard';

/* ---------------- MAIN PROJECT SECTION ---------------- */
const Project = () => {
    const [positions, setPositions] = useState({});
    const [draggedId, setDraggedId] = useState(null);
    const [expandedProjectId, setExpandedProjectId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Memoize callbacks to prevent unnecessary re-renders
    const onCardMove = useCallback((id, data) => {
        setPositions(pos => ({...pos,[id]: { x: data.offset.x, y: data.offset.y, rotate: data.transform?.rotate || 0 },}));
    }, []);

    const onDragStart = useCallback((id) => {setDraggedId(id);}, []);
    const onDragEnd = useCallback(() => {setDraggedId(null);}, []);
    const onSwipe = useCallback((dir, id) => {console.log(`Swiped ${dir} on ${id}`);}, []);
    const closeExpanded = useCallback(() => {setExpandedProjectId(null);}, []);
    const expandedIndex = Projects.findIndex((p) => p._id === expandedProjectId);

    // Memoize the projects array to prevent recreation on every render
    const projects = useMemo(() => Projects, []);

    if (loading) {
        return (
        <section className="relative p-5 w-full mx-2 flex flex-col items-center justify-center mb-5 overflow-hidden">
            <div className="text-white">Loading projects...</div>
        </section>
        );
    }

    // Memoize the main content to prevent unnecessary re-renders
    const mainContent = useMemo(() => {
        //if one of the project is expanded
        if (expandedIndex !== -1) {
        return (
            <>
            <div className="projCardsMere flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
                {projects.slice(0, expandedIndex).map((project) => { //.slice(0,expandedIndex): for showing all the projects until we arrive at the expandedProjectIndex (only show the projects before the expandedproject)
                const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
                const isDragged = draggedId === project._id;
                return (
                    <motion.div key={project._id}  layout  transition={{ duration: 0.5, type: "spring" }} className="w-[400px]">
                    <ProjectCard  project={project}  pos={pos}  isDragged={isDragged}  onCardMove={onCardMove}  onDragStart={onDragStart}  onDragEnd={onDragEnd}  onSwipe={onSwipe}  setExpandedProjectId={setExpandedProjectId} />
                    </motion.div>
                );
                })}
            </div>

            <motion.div layout transition={{ duration: 0.5, type: "spring" }}className="w-full mb-6">
                <ExpandedProjectCard project={projects[expandedIndex]} closeExpanded={closeExpanded}/>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-6 w-full mb-6 overflow-hidden">
                {projects.slice(expandedIndex + 1).map((project) => {
                const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
                const isDragged = draggedId === project._id;
                return (
                    <motion.div key={project._id} layout transition={{ duration: 0.5, type: "spring" }}className="w-[400px]">
                    <ProjectCard  project={project} pos={pos} isDragged={isDragged} onCardMove={onCardMove} onDragStart={onDragStart} onDragEnd={onDragEnd} onSwipe={onSwipe} setExpandedProjectId={setExpandedProjectId}/>
                    </motion.div>
                );
                })}
            </div>
            </>
        );
        }

        //if no project is expanded
        return (
            <div className="flex flex-wrap items-center justify-center gap-6 w-full overflow-visible ">
                {projects.map((project) => {
                const pos = positions[project._id] || { x: 0, y: 0, rotate: 0 };
                const isDragged = draggedId === project._id;
                return (
                    <motion.div key={project._id} layout transition={{ duration: 0.5, type: "spring" }}className="w-[400px]">
                    <ProjectCard project={project} pos={pos} isDragged={isDragged} onCardMove={onCardMove} onDragStart={onDragStart} onDragEnd={onDragEnd} onSwipe={onSwipe} setExpandedProjectId={setExpandedProjectId}/>
                    </motion.div>
                );
                })}
            </div>
            );
        }, [expandedIndex, projects, positions, draggedId, onCardMove, onDragStart, onDragEnd, onSwipe, closeExpanded, setExpandedProjectId]);

    return (
        <section  id="project"  className="relative p-5 w-full flex flex-col items-center justify-center mb-5 overflow-visible" style={{ userSelect: "none" }}>
            <motion.p className="skillTitle text-white text-center font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] my-10" animate={{ x: [0, 5, -5, 5, 0], y: [0, 5, -5, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>Projects</motion.p>
            {projects.length === 0 && (<p className="text-gray-500">No projects available</p>)}
            {mainContent}
        </section>
    );
};

export default Project;