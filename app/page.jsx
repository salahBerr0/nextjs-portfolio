import dynamic from "next/dynamic";
const Hero = dynamic(() => import("@/components/sections/Hero"));
const About = dynamic(() => import("@/components/sections/About"));
const Skill = dynamic(() => import("@/components/sections/Skill"));
const Project = dynamic(() => import("@/components/project/Project"));
const Experience = dynamic(() => import("@/components/sections/Experience"));
import ErrorBoundary from "@/components/fallbacks/ErrorBoundary";
import MediumPriorityFallback from "@/components/fallbacks/MediumPriorityFallback";
export default function Home() {
  return (
    <main className="relative min-h-screen pt-20 z-10 overflow-hidden grid content-center justify-items-center gap-10">
      <ErrorBoundary componentName="Hero" fallback={<MediumPriorityFallback componentName="Hero Section"/>}>
        <Hero/>
      </ErrorBoundary>
      <ErrorBoundary componentName="About Section" fallback={<MediumPriorityFallback componentName="About Section"/>}>
        <About />
      </ErrorBoundary>
      <ErrorBoundary componentName='Skill Section' fallback={<MediumPriorityFallback componentName="Skill Section"/>}>
        <Skill/>
      </ErrorBoundary>
      <ErrorBoundary componentName='Project Section' fallback={<MediumPriorityFallback componentName="Project Section"/>}>
        <Project />
      </ErrorBoundary>
      <ErrorBoundary componentName='Experience Section' fallback={<MediumPriorityFallback componentName="Experiene Section"/>}>
        <Experience />
      </ErrorBoundary>
    </main>
  );
}