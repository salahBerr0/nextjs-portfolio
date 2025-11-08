"use client";
import usePerformanceMonitor from "@/hooks/usePerformanceMonitor";
import { useCallback, useEffect, useState, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function StarsBackground() {
  usePerformanceMonitor('StarsBackground', {
    warnThreshold: 80,
    errorThreshold: 150,
    preventDuplicates: true
  });

  const [isVisible, setIsVisible] = useState(false);
    const [loadTime, setLoadTime] = useState(null);

const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    const handleInteraction = () => {
      setIsVisible(true);
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('mousemove', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  // Enhanced particles for better quality
  const particlesOptions = useMemo(() => ({
    background: { 
      color: { 
        value: "transparent" 
      } 
    },
    fpsLimit: 60, // Higher FPS for smoother animation
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse",
          parallax: { 
            enable: true,
            force: 60,
            smooth: 10 
          }
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: {
          enable: true
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
          factor: 100,
          speed: 1,
          maxSpeed: 50,
          easing: "ease-out-quad"
        },
        push: {
          speed:1,
          factor:1,
          quantity: 4,
        }
      }
    },
    particles: {
      color: { 
        value: "#ffffff"
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        outModes: {default: "out"},
        attract: {
          enable: true,
          rotate: {
            x: 600,
            y: 1200
          }
        }
      },
      number: {
        value: 80, // More particles for richer background
        density: {
          enable: true,
          area: 800
        }
      },
      opacity: {
        value: { 
          min: 0.1, 
          max: 0.6 // Higher opacity for better visibility
        },
        animation: {
          enable: true,
          speed: 0.3,
          sync: false
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { 
          min: 0.5, 
          max: 3.0 // Larger size range for depth
        }
      },
      wobble: {
        enable: true,
        distance: 10,
        speed: 0.1
      }
    },
    detectRetina: true, // Enable retina detection
    motion: {
      reduce: {
        factor: 4,
        value: true
      }
    }
  }), []);

  if (!isVisible) {
    return <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black to-gray-900" />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black to-gray-900">        
      <Particles 
        id="tsparticles" 
        init={particlesInit} 
        options={particlesOptions}
        className="opacity-100"
      />
    </div>
  );
}