'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Scene3D from './Scene3D';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

// High-performance throttle with RAF
function throttleRAF(func) {
  let rafId = null;
  return (...args) => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func.apply(this, args);
        rafId = null;
      });
    }
  };
}

// Memoized constants
const SECTIONS = ['hero', 'about', 'skill', 'project', 'experience'];

export default function ThreeBackground() {
// In ThreeBackground.jsx, update the hook call:
usePerformanceMonitor('ThreeBackground', { 
  warnThreshold: 50, 
  errorThreshold: 100,
  preventDuplicates: true 
});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const scrollRef = useRef(0);
  const sectionDataRef = useRef({ heights: [], total: 0 });
  const rafRef = useRef();

  // Single client-side detection with ready state
  useEffect(() => {
    setIsReady(true);
    
    // Small delay to prioritize main content
    const timer = setTimeout(() => {
      calculateSectionData();
      updateScrollPosition();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Memoized section calculation
  const calculateSectionData = useCallback(() => {
    const heights = [];
    let totalHeight = 0;

    SECTIONS.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        const height = element.offsetHeight;
        heights.push({
          id: sectionId,
          height,
          start: totalHeight,
          end: totalHeight + height
        });
        totalHeight += height;
      }
    });

    sectionDataRef.current = { heights, total: totalHeight };
  }, []);

  // Optimized scroll position calculation
  const updateScrollPosition = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { heights } = sectionDataRef.current;
    
    if (!heights.length) {
      scrollRef.current = 0;
      return;
    }

    // Binary search for current section
    let left = 0;
    let right = heights.length - 1;
    let currentIndex = 0;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const section = heights[mid];
      
      if (scrollTop >= section.start && scrollTop <= section.end) {
        currentIndex = mid;
        break;
      } else if (scrollTop < section.start) {
        right = mid - 1;
      } else {
        left = mid + 1;
        currentIndex = mid;
      }
    }

    const currentSection = heights[currentIndex];
    const progressInSection = (scrollTop - currentSection.start) / currentSection.height;
    const sectionProgress = (currentIndex + progressInSection) / (heights.length - 1);
    
    scrollRef.current = Math.min(Math.max(sectionProgress, 0), 1);
  }, []);

  // RAF-optimized scroll handler
  const handleScroll = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setScrollProgress(scrollRef.current);
        rafRef.current = null;
      });
    }
  }, []);

  // Throttled scroll with RAF
  const throttledScroll = useCallback(throttleRAF(() => {
    updateScrollPosition();
    handleScroll();
  }), [updateScrollPosition, handleScroll]);

  // Memoized scroll position to prevent unnecessary re-renders
  const memoizedScrollProgress = useMemo(() => scrollProgress, [scrollProgress]);

  // Main effect setup - only run when ready
  useEffect(() => {
    if (!isReady) return;

    // Event listeners with passive for performance
    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', calculateSectionData, { passive: true });

    // Intersection Observer for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            calculateSectionData();
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    SECTIONS.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', calculateSectionData);
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isReady, calculateSectionData, updateScrollPosition, throttledScroll]);

  // Return simple background until ready to avoid flash
  if (!isReady) {
    return <div className="fixed inset-0 -z-10 bg-gray-700" />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 45,
          near: 0.1,
          far: 50
        }}
        gl={{ 
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)}
        performance={{ min: 0.5 }} // More aggressive performance
        frameloop="demand"
        style={{ 
          background: 'transparent',
        }}
      >
        <Scene3D scrollPosition={memoizedScrollProgress} />
        <Preload all />
      </Canvas>
    </div>
  );
}