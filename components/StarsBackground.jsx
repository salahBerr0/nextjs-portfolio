"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function StarsBackground() {
  const [isVisible, setIsVisible] = useState(false);
  
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

  const particlesOptions = useMemo(() => ({
    background: { 
      color: { 
        value: "transparent" 
      } 
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab",
          parallax: { 
            enable: false 
          }
        },
        onClick: {
          enable: true,
          mode: "push"
        },
        resize: {
          enable: false
        }
      },
      modes: {
        grab: {
          distance: 150,
          links: {
            blink: false,
            consent: false,
            opacity: 1
          }
        },
        push: {
          quantity: 1
        }
      }
    },
    particles: {
      color: { 
        value: "#669bbc" 
      },
      move: {
        enable: true,
        speed: 0.1,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        }
      },
      number: {
        value: 80, 
        density: {
          enable: true,
          area: 1000
        }
      },
      opacity: {
        value: { 
          min: 0.01, 
          max: 0.5 
        }
      },
      shape: {
        type: "circle"
      },
      size: {
        value: { 
          min: 0.5, 
          max: 15 
        }
      }
    },
    detectRetina: false
  }), []);

  if (!isVisible) {
    return <div className="fixed inset-0 -z-10 bg-black" />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-black">        
      <Particles 
        id="tsparticles" 
        init={particlesInit} 
        options={particlesOptions}
        className="opacity-100"
      />
    </div>
  );
}