import React, { useEffect, useState, useRef } from 'react';
import { motion, Variants, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const CustomCursor = () => {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 1.2 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [stickyElement, setStickyElement] = useState<Element | null>(null);
  const [breakingFree, setBreakingFree] = useState(false);
  const [breakFreeDirection, setBreakFreeDirection] = useState({ x: 0, y: 0 });
  
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
        const stickyRadius = 600;
        const breakingPoint = 400;
        
        if (distance < stickyRadius) {
          // Calculate strength of "pull" based on distance with a much stronger attraction
          let pullStrength;
          
          if (distance > breakingPoint) {
            // When cursor tries to break free
            const breakingRatio = (distance - breakingPoint) / (stickyRadius - breakingPoint);
            
            pullStrength = 0.9 * (1 - Math.pow(breakingRatio, 1/3));
            
            if (!breakingFree && distance > stickyRadius * 0.9) {
              setBreakingFree(true);
              setBreakFreeDirection({ 
                x: distX / distance, 
                y: distY / distance 
              });
            }
          } else {
            // Pull when close to element
            pullStrength = 0.95 * (1 - Math.pow(distance / breakingPoint, 1/2));
            setBreakingFree(false);
          }
          
          // Calculate new position
          const newX = e.clientX - (distX * pullStrength);
          const newY = e.clientY - (distY * pullStrength);
          
          mouseX.set(newX);
          mouseY.set(newY);
          return;
        } else if (breakingFree) {
          // Spring effect when breaking free
          const recoilStrength = 30; 
          setBreakingFree(false);
          
          // "Slingshot" effect away from the sticky element when breaking free
          mouseX.set(e.clientX + breakFreeDirection.x * recoilStrength);
          mouseY.set(e.clientY + breakFreeDirection.y * recoilStrength);
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
      
      // "Snap" effect when first hovering
      if (!stickyElement && cursorRef.current) {
        const rect = (e.target as Element).getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Create a dramatic pull toward the element center
        const pullX = (elementCenterX - e.clientX) * 0.5; 
        const pullY = (elementCenterY - e.clientY) * 0.5; 
        
        mouseX.set(e.clientX + pullX);
        mouseY.set(e.clientY + pullY);
      }
    };
    
    const handleLinkHoverEnd = () => {
      setLinkHovered(false);
      setStickyElement(null);
      
      // "Release" effect when leaving a sticky element
      if (cursorRef.current) {
        const currentX = mouseX.get();
        const currentY = mouseY.get();
        
        // Random deflection when leaving an element
        const deflectionStrength = 20;
        const angle = Math.random() * Math.PI * 2;
        
        mouseX.set(currentX + Math.cos(angle) * deflectionStrength);
        mouseY.set(currentY + Math.sin(angle) * deflectionStrength);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Find all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], .nav-item, h1, h2, h3, .interactive, input, select, textarea, .card-base, .hover-effect'
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
  }, [mouseX, mouseY, stickyElement, clicked, breakingFree, breakFreeDirection]);
  
  // Visual effects for the cursor
  const variants: Variants = {
    default: {
      height: 32,
      width: 32,
      borderWidth: '2px',
      borderColor: cursorColor,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      boxShadow: theme === 'dark' ? '0 0 10px rgba(131, 82, 253, 0.3)' : 'none',
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 1.2
      }
    },
    clicked: {
      height: 28,
      width: 28, 
      borderWidth: '2px',
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}4D`,
      boxShadow: theme === 'dark' ? '0 0 15px rgba(131, 82, 253, 0.5)' : '0 0 10px rgba(109, 40, 217, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 10
      }
    },
    hovered: {
      height: 64, 
      width: 64, 
      borderWidth: '1px', 
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}1A`, 
      mixBlendMode: "difference" as const,
      boxShadow: theme === 'dark' ? '0 0 30px rgba(131, 82, 253, 0.4)' : '0 0 20px rgba(109, 40, 217, 0.2)',
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      }
    },
    breakingFree: {
      height: 45,
      width: 45,
      borderWidth: '1.5px',
      borderColor: cursorColor,
      backgroundColor: `${cursorColor}33`, 
      scale: 1.2, 
      rotate: 25, 
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
        damping: 5 
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
        stiffness: 150, 
        damping: 15,
        mass: 1.2
      }}
    >
      {/* Inner pulse for interactive states */}
      {(linkHovered || breakingFree) && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ 
            scale: [0.7, 1.2, 0.7], 
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          style={{
            backgroundColor: cursorColor,
          }}
        />
      )}
    </motion.div>
  );
};

export default CustomCursor;