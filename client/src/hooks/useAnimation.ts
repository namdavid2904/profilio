import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimationOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
}

export function useAnimation(options?: AnimationOptions) {
  // Scroll animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.fromTo(section, 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
              ...options
            }
          }
        );
      });
    });
    
    return () => ctx.revert();
  }, [options]);

  // Custom animation for elements
  const animateElement = (element: HTMLElement, animation: gsap.TweenVars) => {
    return gsap.to(element, animation);
  };

  return { animateElement };
}