"use client";
import { useEffect, useRef } from "react";

const loggedComponents = new Set();

export default function usePerformanceMonitor(componentName, options = {}) {
  const { 
    logAlways = true, 
    warnThreshold = 100, 
    errorThreshold = 500,
    measureRenderTime = true,
    measureLoadTime = true,
    preventDuplicates = true,
    trackResources = false // New option to track resource loading
  } = options;
  
  const startTime = useRef(performance.now());
  const mountTime = useRef(null);
  const resourcesLoaded = useRef(false);
  const hasLogged = useRef(false);
  const isMounted = useRef(false);

  // Track when resources are loaded (call this from your component)
  const markResourcesLoaded = () => {
    if (!resourcesLoaded.current) {
      resourcesLoaded.current = true;
      const resourceLoadTime = performance.now() - startTime.current;
      console.log(`📦 ${componentName} resources loaded in: ${resourceLoadTime.toFixed(2)}ms`);
    }
  };

  useEffect(() => {
    if (preventDuplicates && loggedComponents.has(componentName)) {
      return;
    }

    // Component mounted
    const mountEndTime = performance.now();
    const mountDuration = mountEndTime - startTime.current;
    mountTime.current = mountDuration;
    isMounted.current = true;

    if (measureRenderTime) {
      if (logAlways && !hasLogged.current) {
        console.log(`⚡ ${componentName} mounted in: ${mountDuration.toFixed(2)}ms`);
        hasLogged.current = true;
        loggedComponents.add(componentName);
      }
      
      if (mountDuration > warnThreshold) {
        const level = mountDuration > errorThreshold ? 'error' : 'warn';
        console[level](`${level === 'error' ? '🚨' : '⚠️'} ${componentName} slow mount: ${mountDuration.toFixed(2)}ms`);
      }
    }

    return () => {
      // Component unmounted - calculate total lifecycle time
      if (measureLoadTime && isMounted.current) {
        const unmountTime = performance.now();
        const totalLifecycle = unmountTime - startTime.current;
        const renderTime = mountTime.current;
        
        console.log(`📊 ${componentName} Summary:
  ├── Mount: ${renderTime.toFixed(2)}ms
  ├── Resources: ${resourcesLoaded.current ? 'Loaded' : 'Not loaded'}
  └── Total Lifecycle: ${totalLifecycle.toFixed(2)}ms`);
        
        if (totalLifecycle > warnThreshold) {
          const level = totalLifecycle > errorThreshold ? 'error' : 'warn';
          console[level](`${level === 'error' ? '🚨' : '⚠️'} ${componentName} slow lifecycle: ${totalLifecycle.toFixed(2)}ms`);
        }
      }
    };
  }, [componentName, logAlways, warnThreshold, errorThreshold, measureRenderTime, measureLoadTime, preventDuplicates]);

  return { markResourcesLoaded };
}