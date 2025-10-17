"use client";
import { Tools } from "@/data/Tools.js";
import {Skills } from "@/data/Skills";
import Computer3d from "./Computer3d";
import Image from "next/image";

export default function Skill() {
  const duplicatedTools = [...Tools, ...Tools];
  const duplicatedSkills = [...Skills, ...Skills];

  return (
  <main id='skill' className="grid content-center  justify-items-center w-full overflow-hidden px-16 py-1">
    <div role="textbox" className="grid content-center justify-items-start w-full">
      <p className="text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]">What I have mastered so far</p>
      <h2 className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]">Skills</h2>
    </div>
    <section className=" overflow-visible grid content-center justify-items-start border-[2px] border-white rounded-md w-full max-w-2xl" style={{boxShadow:'0 0 5px #ffffff'}}>
      <article className="overflow-hidden whitespace-nowrap w-full py-1" >
        <div className="inline-flex animate-scroll gap-3 bigSkillDiv my-1">
          {duplicatedSkills.map((skill, index) => (
            <article key={`${skill._id}-${index}`} className="inline-flex  skillDiv cursor-auto flex-col items-center justify-center flex-shrink-0">
              <div  role="img" aria-label="skill image" className="rounded-lg skillImg w-[60px] h-[60px] bg-white/50 border-[1px] border-white skillImg flex items-center justify-center p-1" style={{boxShadow:'0 0 5px #ffffff'}}>
                <Image src={skill.skillImageUrl} alt={`${skill.skillName} image`} width={50} height={50} className=" h-auto w-auto object-cover"/>
              </div>
              <span className="bg-black text-center hidden absolute -translate-y-5 duration-300 skillName cursor-none px-1 rounded-sm text-[13px] whitespace-nowrap" style={{boxShadow:'0 0 3px #ffffff'}}>{skill.skillName}</span>
            </article>
          ))}
        </div>
      </article>
      <article className="overflow-hidden whitespace-nowrap w-full py-1">
        <div className="inline-flex animate-scroll gap-3 my-1">
          {duplicatedTools.map((tool, index) => (
            <article key={`${tool._id}-${index}`} className="inline-flex hover:opacity-100 cursor-auto flex-col items-center justify-center flex-shrink-0">
              <div role="img" aria-label="tool image" className="rounded-lg w-[40px] h-[40px] bg-white border-[1px] border-white flex items-center justify-center p-1" style={{boxShadow:'0 0 5px #ffffff'}}>
                <Image src={tool.toolImageUrl} alt={`${tool.toolName} image`} width={40} height={40} className=" h-auto w-auto object-cover"/>
              </div>
            </article>
          ))}
        </div>
      </article>
    </section>
  </main>
  );
}