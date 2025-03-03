import React, { useEffect, useState, useRef } from 'react';
import { motion, Variants, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [stickyElement, setStickyElement] = useState<Element | null>(null);
  
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
      
        const stickyRadius = 100;
        
        if (distance < stickyRadius) {
          const pullStrength = 1 - (distance / stickyRadius);
          const newX = e.clientX - (distX * pullStrength * 0.3);
          const newY = e.clientY - (distY * pullStrength * 0.3);
          
          mouseX.set(newX);
          mouseY.set(newY);
          return;
        }
      }
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleLinkHoverStart = (e: MouseEvent) => {
      setLinkHovered(true);
      setStickyElement(e.target as Element);
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
  }, [mouseX, mouseY, stickyElement, clicked]);
  
  const variants: Variants = {
    default: {
      height: 32,
      width: 32,
      borderWidth: '2px',
      borderColor: cursorColor,
      backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    clicked: {
      height: 28,
      width: 28, 
      borderWidth: '2px',
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}4D`, // 30% opacity
    },
    hovered: {
      height: 60,
      width: 60,
      borderWidth: '1px', 
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}1A`, // 10% opacity
      mixBlendMode: "difference" as const,
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
      animate={linkHovered ? 'hovered' : clicked ? 'clicked' : 'default'}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        mass: 0.5
      }}
    />
  );
};

export default CustomCursor;