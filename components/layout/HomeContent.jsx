'use client';

import { Suspense, useEffect, useState } from "react";
import ErrorBoundary from "../fallbacks/ErrorBoundary";
import MediumPriorityFallback from "../fallbacks/MediumPriorityFallback";
import About from "../sections/About";
import Hero from "../sections/Hero";
import dynamic from "next/dynamic";
// Only dynamically import heavier, below-fold components
const Skill = dynamic(() => import("@/components/sections/Skill"));
const Project = dynamic(() => import("@/components/project/Project"));
const Experience = dynamic(() => import("@/components/sections/Experience"));

export default function HomeContent() {
  const [visibleSections, setVisibleSections] = useState({
    hero: true,
    about: true, // Load about immediately since it's above fold
    skill: false,
    project: false,
    experience: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight;
      const windowHeight = window.innerHeight;

      // More aggressive loading thresholds for better perceived performance
      if (!visibleSections.skill && scrollPos > windowHeight * 0.3) {
        setVisibleSections((v) => ({ ...v, skill: true }));
      }
      if (!visibleSections.project && scrollPos > windowHeight * 0.6) {
        setVisibleSections((v) => ({ ...v, project: true }));
      }
      if (!visibleSections.experience && scrollPos > windowHeight * 0.9) {
        setVisibleSections((v) => ({ ...v, experience: true }));
      }
    };

    // Use requestAnimationFrame for smoother scroll handling
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    
    // Trigger initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, [visibleSections]);

  return (
    <main className="relative min-h-screen pt-20 z-10 overflow-hidden grid content-center justify-items-center gap-10">
      {/* Critical content - loaded immediately */}
      <ErrorBoundary componentName="Hero" fallback={<MediumPriorityFallback componentName="Hero Section" />}>
        <Hero />
      </ErrorBoundary>

      <ErrorBoundary componentName="About Section" fallback={<MediumPriorityFallback componentName="About Section" />}>
        <About />
      </ErrorBoundary>

      {/* Non-critical content - lazy loaded */}
      <ErrorBoundary componentName="Skill Section" fallback={<MediumPriorityFallback componentName="Skill Section" />}>
        <Suspense fallback={<MediumPriorityFallback componentName="Skill Section" />}>
          {visibleSections.skill && <Skill />}
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary componentName="Project Section" fallback={<MediumPriorityFallback componentName="Project Section" />}>
        <Suspense fallback={<MediumPriorityFallback componentName="Project Section" />}>
          {visibleSections.project && <Project />}
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary componentName="Experience Section" fallback={<MediumPriorityFallback componentName="Experience Section" />}>
        <Suspense fallback={<MediumPriorityFallback componentName="Experience Section" />}>
          {visibleSections.experience && <Experience />}
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}