"use client";
import { useState, useEffect } from 'react';

export const useScrollDetection = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      const sections = document.querySelectorAll('section[id], footer[id]');
      let current = '';
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        // Regular section detection
        if (sectionId && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          current = sectionId;
        }

        // Footer detection - activate when near bottom
        if (sectionId === 'footer') {
          const distanceFromBottom = documentHeight - (scrollY + windowHeight);
          if (distanceFromBottom < 200) {
            current = 'footer';
          }
        }
      });

      setActiveSection(current || '');
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return activeSection;
};