import { Tools } from "@/data/Tools";
import { Projects } from "@/data/Projects";
import ProjectClient from "./Project.client";

export default function Project() {
  // Pre-process data on the server
  const projectsData = Projects.map(project => ({
    _id: project._id,
    projTitle: project.projTitle,
    projTagLine: project.projTagLine,
    projCategory: project.projCategory,
    projDescription: project.projDescription,
    projLikesCount: project.projLikesCount,
    projLiveDemoLink: project.projLiveDemoLink,
    projSourceCodeLink: project.projSourceCodeLink,
    projImageUrls: project.projImageUrls,
    projVideosUrls: project.projVideosUrls,
    projTechStack: project.projTechStack
  }));

  const toolsMap = Tools.reduce((map, tool) => {
    map[tool._id] = {
      toolName: tool.toolName,
      toolImageUrl: tool.toolImageUrl
    };
    return map;
  }, {});

  return (
    <section 
      id="project" 
      className="relative px-5 sm:px-8 md:px-16 w-full flex flex-col items-center justify-center mb-5 overflow-visible"
      style={{ userSelect: "none" }}
    >
      <div role="textbox" className="grid content-center justify-items-start w-full max-w-4xl">
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]">
          What I have done so far
        </p>
        <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Recently Projects
        </h2>
      </div>
      
      {projectsData.length === 0 ? (
        <p className="text-gray-500">No projects available</p>
      ) : (
        <ProjectClient 
          projects={projectsData} 
          toolsMap={toolsMap} 
        />
      )}
    </section>
  );
}