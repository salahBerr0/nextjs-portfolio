import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/Hero"));
const About = dynamic(() => import("@/components/About"));
const Skill = dynamic(() => import("@/components/Skill"));
const Project = dynamic(() => import("@/components/Project"));
const Experience = dynamic(() => import("@/components/Experience"));

export default function Home() {
  return (
    <main className="relative min-h-screen z-10">
          <Hero/>
          <About />
          <Skill/>
          <Project />
          <Experience />
    </main>
  );
}