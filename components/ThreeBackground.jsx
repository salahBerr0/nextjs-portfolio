'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Scene3D from './Scene3D';

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

export default function ThreeBackground() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef(0);
  const sectionDataRef = useRef({ heights: [], total: 0 });
  const rafRef = useRef();

  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized section calculation
  const calculateSectionData = useCallback(() => {
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

    sectionDataRef.current = { heights, total: totalHeight };
  }, []);

  // Optimized scroll position calculation
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const { heights, total } = sectionDataRef.current;
    
    if (!heights.length) {
      scrollRef.current = 0;
      return;
    }

    // Binary search for current section (more efficient for many sections)
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

  // Main effect setup
  useEffect(() => {
    if (!isClient) return;

    // Initial setup
    calculateSectionData();
    updateScrollPosition();

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
    ['hero', 'about', 'skill', 'project', 'experience'].forEach(id => {
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
  }, [isClient, calculateSectionData, updateScrollPosition, throttledScroll]);

  // Performance monitoring
  useEffect(() => {
    if (!isClient) return;
    
    const startTime = performance.now();
    const timer = setTimeout(() => {
      const loadTime = performance.now() - startTime;
      if (loadTime > 1000) {
        console.warn(`3D Scene loaded in ${loadTime.toFixed(0)}ms - Consider optimization`);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isClient]);

  if (!isClient) {
    return <div className="fixed inset-0 -z-10 bg-black" />;
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
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        performance={{ min: 0.8 }}
        frameloop="always"
        style={{ 
          background: 'transparent',
        }}
      >
        <Scene3D scrollPosition={scrollProgress} />
        <Preload all />
      </Canvas>
    </div>
  );
}