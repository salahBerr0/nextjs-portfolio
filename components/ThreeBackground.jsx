'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Scene3D from './Scene3D';

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export default function ThreeBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef(0);
  const rafRef = useRef();
  const sectionHeightsRef = useRef([]);

  // Set client-side flag - runs only in browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate section heights and positions
  const calculateSectionData = useCallback(() => {
    if (!isClient) return;
    
    const sections = ['hero', 'about', 'skill', 'project', 'experience'];
    const heights = [];
    let totalHeight = 0;

    sections.forEach(sectionId => {
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

    sectionHeightsRef.current = heights;
    return totalHeight;
  }, [isClient]);

  // Calculate scroll position based on actual section heights
  const updateScrollPosition = useCallback(() => {
    if (!isClient) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const sections = sectionHeightsRef.current;
    
    if (sections.length === 0) {
      scrollRef.current = 0;
      return;
    }

    const totalHeight = sections[sections.length - 1].end;
    
    // Find current section and progress within it
    let currentSectionIndex = 0;
    let progressInSection = 0;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (scrollTop >= section.start && scrollTop <= section.end) {
        currentSectionIndex = i;
        progressInSection = (scrollTop - section.start) / section.height;
        break;
      }
    }

    // Convert to overall progress (0 to 1 across all sections)
    const sectionProgress = (currentSectionIndex + progressInSection) / (sections.length - 1);
    scrollRef.current = Math.min(sectionProgress, 1);
  }, [isClient]);

  // RAF-based scroll handler for smooth performance
  const handleScroll = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setScrollProgress(scrollRef.current);
        rafRef.current = null;
      });
    }
  }, []);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(throttle(handleScroll, 16), [handleScroll]);

  // Main effect - setup event listeners
  useEffect(() => {
    if (!isClient) return;
    
    // Initial calculation
    calculateSectionData();
    updateScrollPosition();

    const scrollListener = () => {
      updateScrollPosition();
      throttledScrollHandler();
    };

    // Recalculate on resize (for responsive design)
    const resizeListener = () => {
      calculateSectionData();
      updateScrollPosition();
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    window.addEventListener('resize', resizeListener, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', resizeListener);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [calculateSectionData, updateScrollPosition, throttledScrollHandler, isClient]);

  // Performance analytics
  useEffect(() => {
    if (!isClient) return;
    
    const startTime = performance.now();
    
    const trackLoad = () => {
      const loadTime = performance.now() - startTime;
      console.log(`🎯 3D Portfolio loaded in ${loadTime.toFixed(0)}ms`);
    };

    // Track after components are likely loaded
    const timer = setTimeout(trackLoad, 1500);
    return () => clearTimeout(timer);
  }, [isClient]);

  // Don't render Canvas on server-side to avoid errors
  if (!isClient) {
    return (
      <div className="fixed inset-0 -z-10 bg-black" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 50,
          near: 0.1,
          far: 100 
        }}
        gl={{ 
          alpha: true,           // Transparent background
          antialias: true,       // Smooth edges
          powerPreference: "high-performance" // Use GPU
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Maintain 50%+ framerate
        style={{ 
          background: 'transparent',
          transform: 'translate3d(0,0,0)' // Force GPU acceleration
        }}
      >
        <Scene3D scrollPosition={scrollProgress} />
        <Preload all /> {/* Preload all 3D assets */}
      </Canvas>
    </div>
  );
}