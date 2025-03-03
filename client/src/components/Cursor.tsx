import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);
    
    const handleLinkHoverStart = () => setLinkHovered(true);
    const handleLinkHoverEnd = () => setLinkHovered(false);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    const links = document.querySelectorAll('a, button, [role="button"]');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleLinkHoverStart);
      link.addEventListener('mouseleave', handleLinkHoverEnd);
    });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleLinkHoverStart);
        link.removeEventListener('mouseleave', handleLinkHoverEnd);
      });
    };
  }, []);
  
  const variants = {
    default: {
      x: position.x - 16,
      y: position.y - 16,
      height: 32,
      width: 32,
    },
    clicked: {
      height: 28,
      width: 28,
      x: position.x - 14,
      y: position.y - 14,
    },
    hovered: {
      height: 48,
      width: 48,
      x: position.x - 24,
      y: position.y - 24,
      mixBlendMode: 'difference',
    }
  };
  
  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full border-2 border-[#8352FD] z-50 pointer-events-none hidden md:block"
      variants={variants}
      animate={linkHovered ? 'hovered' : clicked ? 'clicked' : 'default'}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}/>
  );
};

export default CustomCursor;