import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/Hero"));
const About = dynamic(() => import("@/components/About"));
const Skill = dynamic(() => import("@/components/Skill"));
const Project = dynamic(() => import("@/components/Project"));
const Experience = dynamic(() => import("@/components/Experience"));

export default function Home() {

  return (
    <main className="relative min-h-screen grid content-center justify-items-center py-32"> {/* Added relative and min-h-screen */}
      <div className="relative z-10">
        <section id="hero">
          <Hero/>
        </section>
        <section id="about">
          <About />
        </section>
        <section id="skill">
          <Skill/>
        </section>
        <section id="project">
          <Project />
        </section>
        <section id="experience">
          <Experience />
        </section>
      </div>
    </main>
  );
}