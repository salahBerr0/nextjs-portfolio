import { Tools } from "@/data/Tools.js";
import { Skills } from "@/data/Skills";
import Image from "next/image";

export default function Skill() {
  const duplicatedTools = [...Tools, ...Tools];
  const duplicatedSkills = [...Skills, ...Skills];

  return (
    <main 
      id="skill" 
      className="grid content-center justify-items-center w-full overflow-hidden px-4 sm:px-8 md:px-16 py-1"
      tabIndex={-1}
      aria-label="Skills and Tools section"
    >
      <section aria-labelledby="skills-heading" role="region" className="grid content-center justify-items-start w-full max-w-4xl mb-6">
        <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px] mb-2">
          What I have mastered so far
        </p>
        <h2 id="skills-heading" className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">
          Skills
        </h2>
      </section>

      <section 
        className="overflow-visible grid content-center justify-items-start border-[2px] border-white rounded-md w-full max-w-4xl bg-black/20 backdrop-blur-sm"
        style={{boxShadow:'0 0 5px #ffffff'}}
        aria-label="Skills and tools marquees"
      >

        {/* Skills Marquee */}
        <article className="overflow-hidden whitespace-nowrap w-full py-3" aria-label="List of skills" role="list">
          <div className="inline-flex animate-scroll gap-4 bigSkillDiv" style={{ animationDuration: `${Skills.length * 2}s` }}>
            {duplicatedSkills.map((skill, index) => (
              <article
                role="listitem"
                tabIndex={0}
                key={`${skill._id}-${index}`}
                className="inline-flex skillDiv cursor-auto flex-col items-center justify-center flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-white"
              >
                <div 
                  role="img" 
                  aria-label={`${skill.skillName} icon`} 
                  className="rounded-lg skillImg w-[60px] h-[60px] bg-white/50 border-[1px] border-white flex items-center justify-center p-1 transition-all duration-300 group-hover:scale-105" 
                  style={{boxShadow:'0 0 5px #ffffff'}}
                >
                  <Image 
                    src={skill.skillImageUrl} 
                    alt={`${skill.skillName} icon`} 
                    width={50} 
                    height={50} 
                    className="h-auto w-auto object-cover" 
                    loading="lazy" 
                    placeholder="blur" 
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." 
                  />
                </div>
                <span className="sr-only">{skill.skillName}</span>
              </article>
            ))}
          </div>
        </article>

        {/* Tools Marquee */}
        <article className="overflow-hidden whitespace-nowrap w-full py-3 border-t border-white/30" aria-label="List of tools" role="list">
          <div className="inline-flex animate-scroll-reverse gap-4" style={{ animationDuration: `${Tools.length * 1.5}s` }}>
            {duplicatedTools.map((tool, index) => (
              <article
                role="listitem"
                tabIndex={0}
                key={`${tool._id}-${index}`}
                className="inline-flex hover:opacity-100 cursor-auto flex-col items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <div 
                  role="img" 
                  aria-label={`${tool.toolName} icon`} 
                  className="rounded-lg w-[40px] h-[40px] bg-white border-[1px] border-white flex items-center justify-center p-1" 
                  style={{ boxShadow:'0 0 5px #ffffff' }}
                >
                  <Image 
                    src={tool.toolImageUrl} 
                    alt={`${tool.toolName} icon`} 
                    width={40} 
                    height={40} 
                    className="h-auto w-auto object-cover" 
                    loading="lazy" 
                    placeholder="blur" 
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..." 
                  />
                </div>
                <span className="sr-only">{tool.toolName}</span>
              </article>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
