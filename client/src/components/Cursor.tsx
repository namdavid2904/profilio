import React, { useEffect, useState, useRef } from 'react';
import { motion, Variants, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 400, mass: 0.8 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [stickyElement, setStickyElement] = useState<Element | null>(null);
  const [breakingFree, setBreakingFree] = useState(false);
  
  // Colors based on theme
  const cursorColor = theme === 'dark' ? "#8352FD" : "#6d28d9";
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (stickyElement && !clicked) {
        const rect = stickyElement.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        const distX = e.clientX - elementCenterX;
        const distY = e.clientY - elementCenterY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        const stickyRadius = 120;
        const breakingPoint = 80;
        
        if (distance < stickyRadius) {
          // Calculate strength of "pull" based on distance
          let pullStrength;
          
          if (distance > breakingPoint) {
            // reduce the stickiness gradually and faster
            const breakingRatio = (distance - breakingPoint) / (stickyRadius - breakingPoint);
            pullStrength = 0.7 * (1 - breakingRatio * breakingRatio);
            
            if (!breakingFree && distance > stickyRadius * 0.85) {
              setBreakingFree(true);
            }
          } else {
            // Strong pull when close to element
            pullStrength = 0.7 * (1 - (distance / breakingPoint));
            setBreakingFree(false);
          }
          
          // Calculate new position with enhanced pull effect
          const newX = e.clientX - (distX * pullStrength);
          const newY = e.clientY - (distY * pullStrength);
          
          mouseX.set(newX);
          mouseY.set(newY);
          return;
        } else if (breakingFree) {
          // Add a spring effect when breaking free
          setBreakingFree(false);
          mouseX.set(e.clientX + distX * 0.1);
          mouseY.set(e.clientY + distY * 0.1);
          return;
        }
      }
      
      // Normal cursor behavior when not sticky
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleLinkHoverStart = (e: MouseEvent) => {
      setLinkHovered(true);
      setStickyElement(e.target as Element);
      
      // Add subtle "pull-in" effect when first hovering
      if (!stickyElement && cursorRef.current) {
        const rect = (e.target as Element).getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Create a slight pull toward the element center
        const pullX = (elementCenterX - e.clientX) * 0.1;
        const pullY = (elementCenterY - e.clientY) * 0.1;
        
        mouseX.set(e.clientX + pullX);
        mouseY.set(e.clientY + pullY);
      }
    };
    
    const handleLinkHoverEnd = () => {
      setLinkHovered(false);
      setStickyElement(null);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Find all interactive elements 
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], .nav-item, h1, h2, h3, .interactive'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleLinkHoverStart as EventListener);
      element.addEventListener('mouseleave', handleLinkHoverEnd as EventListener);
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleLinkHoverStart as EventListener);
        element.removeEventListener('mouseleave', handleLinkHoverEnd as EventListener);
      });
    };
  }, [mouseX, mouseY, stickyElement, clicked, breakingFree]);
  
  const variants: Variants = {
    default: {
      height: 32,
      width: 32,
      borderWidth: '2px',
      borderColor: cursorColor,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      boxShadow: theme === 'dark' ? '0 0 10px rgba(131, 82, 253, 0.3)' : 'none',
    },
    clicked: {
      height: 28,
      width: 28, 
      borderWidth: '2px',
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}4D`, // 30% opacity
      boxShadow: theme === 'dark' ? '0 0 15px rgba(131, 82, 253, 0.5)' : '0 0 10px rgba(109, 40, 217, 0.3)',
    },
    hovered: {
      height: 60,
      width: 60,
      borderWidth: '1px', 
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}1A`, // 10% opacity
      mixBlendMode: "difference" as const,
      boxShadow: theme === 'dark' ? '0 0 20px rgba(131, 82, 253, 0.4)' : '0 0 15px rgba(109, 40, 217, 0.2)',
    },
    breakingFree: {
      height: 40,
      width: 40,
      borderWidth: '1.5px',
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}33`, // 20% opacity
      scale: 1.1,
      rotate: 15,
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 500,
        damping: 10
      }
    }
  };
  
  return (
    <motion.div
      ref={cursorRef}
      className="fixed top-0 left-0 rounded-full border-solid z-50 pointer-events-none hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      variants={variants}
      animate={
        breakingFree ? 'breakingFree' : 
        linkHovered ? 'hovered' : 
        clicked ? 'clicked' : 'default'
      }
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      }}
    />
  );
};

export default CustomCursor;