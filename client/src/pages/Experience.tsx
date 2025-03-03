import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform, Variants } from 'framer-motion';
import { getExperiences } from '../api/portfolio';
import { useTheme } from '../context/ThemeContext';
import useMediaQuery from '../hooks/useMediaQuery';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  skills: string[];
  location?: string;
  logo?: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Interactive decorative elements
const FloatingParticle: React.FC<{ delay: number, x: number, size: number, color: string }> = ({ delay, x, size, color }) => {
  return (
    <motion.div
      className="absolute rounded-full z-0 pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        left: `${x}%`,
      }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0, 0.7, 0],
        y: [-50, -200],
      }}
      transition={{
        duration: 15,
        ease: "easeInOut",
        delay: delay,
        repeat: Infinity,
        repeatType: "loop"
      }}
    />
  );
};

const decorativeParticles = [
  { delay: 0, x: 10, size: 8, color: 'rgba(131, 82, 253, 0.3)' },
  { delay: 5, x: 20, size: 12, color: 'rgba(131, 82, 253, 0.2)' },
  { delay: 2, x: 45, size: 16, color: 'rgba(131, 82, 253, 0.1)' },
  { delay: 8, x: 70, size: 10, color: 'rgba(131, 82, 253, 0.2)' },
  { delay: 4, x: 90, size: 14, color: 'rgba(131, 82, 253, 0.15)' },
];

// 3D floating skill icons
const SkillIcon: React.FC<{ 
  skill: string; 
  position: [number, number, number]; 
  color: string;
}> = ({ skill, position, color }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    mesh.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
  });
  
  return (
    <mesh ref={mesh} position={position}>
      <RoundedBox args={[1, 0.4, 0.1]} radius={0.1}>
        <meshStandardMaterial 
          color={color} 
          metalness={0.5}
          roughness={0.2}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.06]}
        color="white"
        fontSize={0.15}
        font=""
        anchorX="center"
        anchorY="middle"
      >
        {skill}
      </Text>
    </mesh>
  );
};

// 3D skills visualization
/*const SkillsVisualization: React.FC<{ skills: string[]; theme: string }> = ({ skills, theme }) => {
  const [hasError, setHasError] = useState(false);
  try {
    if (hasError) {
      // Fallback to a simpler visualization when 3D rendering fails
      return (
        <div className="h-[200px] flex flex-wrap gap-2 items-center justify-center p-4">
          {skills.slice(0, 5).map((skill, i) => (
            <span 
              key={i}
              className={`px-3 py-1.5 rounded-full text-sm ${
                theme === 'dark' ? 'bg-accent/20 text-white' : 'bg-accent-light/20 text-gray-800'
              }`}
            >
              {skill}
            </span>
          ))}
        </div>
      );
    }
    return (
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {skills.slice(0, 5).map((skill, i) => (
          <SkillIcon 
            key={i}
            skill={skill}
            position={[
              (i - 2) * 1.2, 
              Math.sin(i * 1.5) * 0.3,
              Math.cos(i * 0.5) * -0.2
            ]}
            color={theme === 'dark' ? '#8352FD' : '#6d28d9'}
          />
        ))}
        
        <fog attach="fog" args={[theme === 'dark' ? '#050816' : '#ffffff', 8, 15]} />
      </Canvas>
    );
  } catch (error) {
    console.error("Error rendering 3D skills visualization:", error);
    setHasError(true);
    return (
      <div className="h-[200px] flex flex-wrap gap-2 items-center justify-center p-4">
        {skills.slice(0, 5).map((skill, i) => (
          <span 
            key={i}
            className={`px-3 py-1.5 rounded-full text-sm ${
              theme === 'dark' ? 'bg-accent/20 text-white' : 'bg-accent-light/20 text-gray-800'
            }`}
          >
            {skill}
          </span>
        ))}
      </div>
    );
  }
};*/

// Confetti effect
const createConfetti = (x: number, y: number, theme: string) => {
  const colors = theme === 'dark' 
    ? ['#8352FD', '#9e78fd', '#b29dfd', '#6033d1', '#4b29a6'] 
    : ['#6d28d9', '#8b5cf6', '#a78bfa', '#4c1d95', '#5b21b6'];
    
  const confettiCount = 60;
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 10 + 5;
    confetti.style.position = 'absolute';
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.opacity = '1';
    confetti.style.pointerEvents = 'none';
    container.appendChild(confetti);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 6 + 2;
    const vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 2;
    let rotation = 0;
    const rotationSpeed = Math.random() * 0.3 - 0.15;
    
    const animateConfetti = () => {
      const currentLeft = parseFloat(confetti.style.left);
      const currentTop = parseFloat(confetti.style.top);
      
      // Apply gravity and move
      confetti.style.left = `${currentLeft + vx}px`;
      confetti.style.top = `${currentTop + vy}px`;
      confetti.style.transform = `rotate(${rotation}deg)`;
      rotation += rotationSpeed;
      
      // Apply gravity
      vy += 0.1;
      
      // Fade out
      const currentOpacity = parseFloat(confetti.style.opacity);
      confetti.style.opacity = `${currentOpacity - 0.01}`;
      
      if (currentOpacity > 0.1) {
        requestAnimationFrame(animateConfetti);
      } else {
        confetti.remove();
        if (container.childElementCount === 0) {
          container.remove();
        }
      }
    };
    
    requestAnimationFrame(animateConfetti);
  }
};

// Skill badge with hover animation
const SkillBadge: React.FC<{ skill: string; theme: string; index: number }> = ({ skill, theme, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const badgeVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.05 * index,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: theme === 'dark' ? 'rgba(131, 82, 253, 0.2)' : 'rgba(109, 40, 217, 0.15)',
      boxShadow: theme === 'dark' 
        ? '0 0 10px rgba(131, 82, 253, 0.5)' 
        : '0 0 10px rgba(109, 40, 217, 0.3)',
      color: theme === 'dark' ? '#ffffff' : '#4a2b8c',
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.span
      variants={badgeVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`px-3 py-1.5 text-xs rounded-full flex items-center ${
        theme === 'dark' 
          ? 'bg-black-100 text-secondary hover:text-white' 
          : 'bg-gray-100 text-secondary-light hover:text-gray-700'
      } transition-colors`}
    >
      {isHovered && (
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`inline-block mr-1.5 w-1.5 h-1.5 rounded-full ${
            theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
          }`}
        />
      )}
      {skill}
    </motion.span>
  );
};

// Company logo with hover effects
const CompanyLogo: React.FC<{ logo: string; company: string; theme: string; isInView: boolean }> = 
  ({ logo, company, theme, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
      animate={isInView ? { 
        scale: isHovered ? 1.05 : 1, 
        opacity: 1, 
        rotate: 0,
        boxShadow: isHovered 
          ? theme === 'dark' 
            ? '0 0 20px rgba(131, 82, 253, 0.5)' 
            : '0 0 20px rgba(109, 40, 217, 0.3)'
          : theme === 'dark'
            ? '0 0 10px rgba(0, 0, 0, 0.3)'
            : '0 0 10px rgba(0, 0, 0, 0.1)'
      } : { scale: 0.8, opacity: 0, rotate: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ 
        delay: isHovered ? 0 : 0.2, 
        duration: isHovered ? 0.2 : 0.5, 
        type: "spring" 
      }}
      className={`w-16 h-16 rounded-full overflow-hidden ${
        theme === 'dark' ? 'bg-black-100' : 'bg-gray-100'
      } flex-shrink-0 flex items-center justify-center cursor-pointer`}
    >
      <img 
        src={logo} 
        alt={company}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/assets/company-placeholder.png';
        }}
      />
    </motion.div>
  );
};

// Timeline dot with pulse effect
const TimelineDot: React.FC<{ theme: string; isActive: boolean }> = ({ theme, isActive }) => {
  return (
    <div className="relative">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isActive ? 1 : 0.7, 
          opacity: isActive ? 1 : 0.5,
          boxShadow: isActive 
            ? theme === 'dark' 
              ? '0 0 10px rgba(131, 82, 253, 0.5)' 
              : '0 0 10px rgba(109, 40, 217, 0.3)'
            : 'none'
        }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 300,
          bounce: 0.4
        }}
        className={`w-4 h-4 rounded-full z-10 ${
          isActive 
            ? theme === 'dark' ? 'bg-accent' : 'bg-accent-light' 
            : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
        }`}
      >
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
            style={{
              backgroundColor: theme === 'dark' ? '#8352FD' : '#6d28d9',
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

// Bullet point with special styling
const BulletPoint: React.FC<{ text: string; isInView: boolean; delay: number; theme: string }> = 
  ({ text, isInView, delay, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ 
        delay: delay,
        duration: 0.5
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-3 flex items-start group"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.2 : 1,
          backgroundColor: isHovered 
            ? theme === 'dark' ? '#8352FD' : '#6d28d9'
            : 'transparent',
        }}
        className={`mt-1.5 mr-3 w-2 h-2 rounded-full border-2 flex-shrink-0 ${
          theme === 'dark' ? 'border-accent' : 'border-accent-light'
        }`}
      />
      <motion.span
        animate={{
          color: isHovered 
            ? theme === 'dark' ? '#ffffff' : '#4a2b8c'
            : theme === 'dark' ? '#aaa6c3' : '#334155',
        }}
        className="text-sm md:text-base"
      >
        {text.replace(/^•\s*/, '')}
      </motion.span>
    </motion.div>
  );
};

// Main experience card component
const ExperienceCard: React.FC<{ 
  experience: Experience; 
  index: number; 
  isActive: boolean;
  onActivate: () => void;
}> = ({ experience, index, isActive, onActivate }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-10%" });
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Get bullet points from description
  const bulletPoints = experience.description.split('\n').filter(point => point.trim() !== '');
  
  // Handle card click with confetti effect
  const handleCardClick = (e: React.MouseEvent) => {
    onActivate();
    createConfetti(e.clientX, e.clientY, theme);
  };

  // Card motion variants
  const cardVariants: Variants = {
    hidden: { 
      opacity: 0.2, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    active: {
      scale: 1.02,
      boxShadow: theme === 'dark' 
        ? '0 10px 30px rgba(0, 0, 0, 0.3)' 
        : '0 10px 30px rgba(0, 0, 0, 0.1)',
      backgroundColor: theme === 'dark' ? 'rgba(21, 16, 48, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    }
  };
  
  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isActive ? "active" : isInView ? "visible" : "hidden"}
      onClick={handleCardClick}
      style={{ perspective: "1000px" }}
      whileHover={!isActive ? { rotateY: 2, rotateX: -2, scale: 1.01 } : undefined}
      className={`card-base mb-8 transition-all duration-500 cursor-pointer border-2 ${
        isActive 
          ? theme === 'dark' ? 'border-accent/30' : 'border-accent-light/30' 
          : 'border-transparent'
      } ${
        theme === 'dark' ? 'hover:bg-black-100/60' : 'hover:bg-white'
      } hover:shadow-xl relative overflow-hidden`}>

      {/* Background pattern for active card */}
      {isActive && (
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-5 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: theme === 'dark' ? 0.05 : 0.03 }}
          transition={{ duration: 0.5 }}
          style={{
            backgroundImage: `linear-gradient(45deg, ${theme === 'dark' ? '#8352FD' : '#6d28d9'} 25%, transparent 25%, transparent 50%, ${theme === 'dark' ? '#8352FD' : '#6d28d9'} 50%, ${theme === 'dark' ? '#8352FD' : '#6d28d9'} 75%, transparent 75%, transparent)`,
            backgroundSize: '20px 20px',
          }}/>
      )}
      
      {/* Card header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6 relative z-10">
        {/* Company logo */}
        {experience.logo && (
          <CompanyLogo 
            logo={experience.logo} 
            company={experience.company} 
            theme={theme} 
            isInView={isInView} />
        )}
        
        {/* Role details */}
        <div>
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            } relative group`}>
            {experience.position}
            <motion.span 
              initial={{ scaleX: 0 }}
              animate={isActive ? { scaleX: 1 } : { scaleX: 0 }}
              className={`absolute left-0 -bottom-0.5 h-0.5 w-full origin-left ${
                theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
              }`}
              transition={{ delay: 0.3, duration: 0.5 }}/>
          </motion.h3>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <span className={`${
              isActive 
                ? theme === 'dark' ? 'text-accent' : 'text-accent-light' 
                : theme === 'dark' ? 'text-accent/80' : 'text-accent-light/80'
            } font-medium`}>{experience.company}</span>
            {experience.location && (
              <>
                <span className={`hidden md:inline ${
                  theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
                }`}>•</span>
                <span className={`${
                  theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
                }`}>{experience.location}</span>
              </>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`text-sm ${
              theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
            } mt-1 flex items-center gap-2`}>
            <motion.div 
              animate={{ rotate: isActive ? 360 : 0 }}
              transition={{ duration: 0.5 }}
              className={`w-3 h-3 rounded-full ${
                theme === 'dark' ? 'bg-accent/30' : 'bg-accent-light/30'
              }`}
            />
            {formatDate(experience.startDate)} - {experience.current ? 'Present' : (experience.endDate ? formatDate(experience.endDate) : '')}
          </motion.div>
        </div>
      </div>
      
      {/* Description with animated bullet points */}
      <div className={`mb-8 ${
        theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
      } relative z-10`}>
        {bulletPoints.map((point, i) => (
          <BulletPoint 
            key={i}
            text={point}
            isInView={isInView && isActive}
            delay={0.4 + (i * 0.1)}
            theme={theme}/>
        ))}
      </div>
      
      {/* Skills */}
      <div className="flex flex-wrap gap-2 relative z-10">
        {experience.skills.map((skill, skillIndex) => (
          <SkillBadge 
            key={skillIndex}
            skill={skill}
            theme={theme}
            index={skillIndex}/>
        ))}
      </div>
      
      {/* View details button for mobile - appears on inactive cards */}
      {isMobile && !isActive && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-6 px-4 py-2 rounded-full text-sm ${
            theme === 'dark' 
              ? 'bg-accent/20 text-white hover:bg-accent/40' 
              : 'bg-accent-light/20 text-gray-800 hover:bg-accent-light/30'
          } transition-colors mx-auto block`}
          onClick={onActivate}
        >
          View Details
        </motion.button>
      )}    
    </motion.div>
  );
};

const Experience: React.FC = () => {
  const { theme } = useTheme();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeExperienceId, setActiveExperienceId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // Force styles to make cards visible
    const style = document.createElement('style');
    style.innerHTML = `
      .card-base {
        opacity: 1 !important;
        transform: none !important;
        display: block !important;
        visibility: visible !important;
        position: relative !important;
        min-height: 200px !important;
        background-color: ${theme === 'dark' ? 'rgba(21, 16, 48, 0.9)' : 'rgba(255, 255, 255, 0.9)'} !important;
        padding: 1.5rem !important;
        border-radius: 0.75rem !important;
        overflow: visible !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  const mockData = [
    {
      id: "1",
      company: "FPT Corporation",
      position: "Software Engineer Intern",
      startDate: "2024-05-27T00:00:00.000Z",
      endDate: "2024-08-28T00:00:00.000Z",
      current: false,
      description: "• Built Asset Allocation module of a Human Resource Management System for 5000+ employees, containerizing with Docker, automating deployment with GitLab CI/CD, and hosting the server on Microsoft Azure.\n• Created 6 REST APIs for inventory management, allocation history, and utilization reports with .NET Core, establishing a real-time alert system with WebSocket to streamline inventory updates.\n• Boosted data retrieval 1.5x by replacing CTEs with indexed temp tables and analyzing execution in SQL Server.\n• Wrote comprehensive unit and integration tests following Test-Driven Development principles with xUnit and Swagger, boosting code quality and minimizing production incidents by 20%.",
      skills: [".NET Core", "SQL Server", "Docker", "Azure", "GitLab CI/CD", "WebSocket", "xUnit", "Swagger"],
      location: "Vietnam",
      logo: "/assets/companies/fpt.png"
    },
    {
      id: "2",
      company: "CodSoft",
      position: "Software Engineer Intern",
      startDate: "2024-03-01T00:00:00.000Z",
      endDate: "2024-04-30T00:00:00.000Z",
      current: false,
      description: "• Developed a bookstore e-commerce website in MVC architecture with Node.js and Express, using MongoDB Atlas for data management, and handling 1000+ concurrent users through request queuing.\n• Reduced payment processing failures by 10% through implementing robust handling and retry mechanisms in Stripe integration, utilizing JWT authentication for secure transactions.\n• Integrated Cloudinary to store 2300+ books, enhancing storage cost through automated image compression.\n• Collaborated with a cross-functional team to design responsive web components with React.js and Bootstrap.",
      skills: ["Node.js", "Express", "MongoDB", "React.js", "Bootstrap", "Stripe", "JWT", "Cloudinary"],
      location: "United States",
      logo: "/assets/companies/codsoft.png"
    }
  ];
  
  // Define useMockData function before using it
  const useMockData = () => {
    console.log("Using mock data");
    setExperiences(mockData);
    if (!isMobile && !activeExperienceId) {
      setActiveExperienceId(mockData[0].id);
    }
  };

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const pathLength = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001 
  });
  
  // Load experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        console.log("Fetching experiences...");
        const data = await getExperiences();
        
        // Check if data is valid and has items
        if (data && Array.isArray(data) && data.length > 0) {
          console.log("Got API data:", data);
          setExperiences(data);
          if (!isMobile && !activeExperienceId) {
            setActiveExperienceId(data[0].id);
          }
        } else {
          console.warn("API returned empty data - using mock data");
          useMockData();
        }
      } catch (error) {
        console.error("Failed to fetch experiences:", error);
        useMockData();
      } finally {
        // Always set loading to false regardless of outcome
        setLoading(false);
      }
    };
    
    const useMockData = () => {
      console.log("Using mock data");
      const mockData = [
        {
          id: "1",
          company: "FPT Corporation",
          position: "Software Engineer Intern",
          startDate: "2024-05-27T00:00:00.000Z",
          endDate: "2024-08-28T00:00:00.000Z",
          current: false,
          description: "• Built Asset Allocation module of a Human Resource Management System for 5000+ employees, containerizing with Docker, automating deployment with GitLab CI/CD, and hosting the server on Microsoft Azure.\n• Created 6 REST APIs for inventory management, allocation history, and utilization reports with .NET Core, establishing a real-time alert system with WebSocket to streamline inventory updates.\n• Boosted data retrieval 1.5x by replacing CTEs with indexed temp tables and analyzing execution in SQL Server.\n• Wrote comprehensive unit and integration tests following Test-Driven Development principles with xUnit and Swagger, boosting code quality and minimizing production incidents by 20%.",
          skills: [".NET Core", "SQL Server", "Docker", "Azure", "GitLab CI/CD", "WebSocket", "xUnit", "Swagger"],
          location: "Vietnam",
          logo: "/assets/companies/fpt.png"
        },
        {
          id: "2",
          company: "CodSoft",
          position: "Software Engineer Intern",
          startDate: "2024-03-01T00:00:00.000Z",
          endDate: "2024-04-30T00:00:00.000Z",
          current: false,
          description: "• Developed a bookstore e-commerce website in MVC architecture with Node.js and Express, using MongoDB Atlas for data management, and handling 1000+ concurrent users through request queuing.\n• Reduced payment processing failures by 10% through implementing robust handling and retry mechanisms in Stripe integration, utilizing JWT authentication for secure transactions.\n• Integrated Cloudinary to store 2300+ books, enhancing storage cost through automated image compression.\n• Collaborated with a cross-functional team to design responsive web components with React.js and Bootstrap.",
          skills: ["Node.js", "Express", "MongoDB", "React.js", "Bootstrap", "Stripe", "JWT", "Cloudinary"],
          location: "United States",
          logo: "/assets/companies/codsoft.png"
        }
      ];
      
      setExperiences(mockData);
      if (!isMobile && !activeExperienceId) {
        setActiveExperienceId(mockData[0].id);
      }
    };
    
    fetchExperiences();
  }, [isMobile, activeExperienceId]);

  
  // Reset active experience when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setActiveExperienceId(null);
    } else if (experiences.length > 0 && !activeExperienceId) {
      setActiveExperienceId(experiences[0].id);
    }
  }, [isMobile, experiences, activeExperienceId]);
  
  // Create path for curved timeline
  const curvedPath = `M 0,0 Q 50,${experiences.length * 100} 0,${experiences.length * 200}`;
  
  // Page title animations
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true });
  const title = "Work Experience";
  const letters = title.split("");

  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
      
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section className="min-h-screen w-full pt-20 pb-16 px-4 relative overflow-hidden">
      {/* Parallax background */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-30 z-0"
          animate={{
            backgroundPositionX: mousePosition.x * 20,
            backgroundPositionY: mousePosition.y * 20,
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, ${
              theme === 'dark' ? 'rgba(131, 82, 253, 0.15)' : 'rgba(109, 40, 217, 0.1)'
            } 0%, transparent 50%)`,
            backgroundSize: '100% 100%',
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        />

      {/* Background decorative particles */}
      {decorativeParticles.map((particle, i) => (
        <FloatingParticle 
          key={i} 
          delay={particle.delay} 
          x={particle.x} 
          size={particle.size} 
          color={theme === 'dark' ? particle.color : particle.color.replace('253', '217')} 
        />
      ))}
      
      <div className="max-w-4xl mx-auto relative">
        {/* Page title with letter animation */}
        <motion.h2 
          ref={titleRef}
          className={`text-4xl font-bold mb-2 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } relative`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index, duration: 0.5 }}
              className={letter === " " ? "mr-2" : ""}
            >
              {letter}
            </motion.span>
          ))}
          <motion.span 
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 1.2, duration: 0.8, ease: "circOut" }}
            className={`absolute left-1/2 -bottom-2 h-1 w-24 -translate-x-1/2 rounded-full origin-center ${
              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
            }`}
          />
        </motion.h2>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className={`text-center mb-12 max-w-xl mx-auto ${
            theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
          }`}
        >
          My professional journey as a software engineer,{' '}
          <motion.span
            initial={{ color: theme === 'dark' ? '#aaa6c3' : '#334155' }}
            animate={{ 
              color: theme === 'dark' ? '#8352FD' : '#6d28d9',
              y: [0, -2, 0]
            }}
            transition={{ 
              color: { duration: 1.2, delay: 1.5 },
              y: { repeat: Infinity, repeatType: "reverse", duration: 1, delay: 2 }
            }}
            className="font-medium"
          >
            building innovative solutions
          </motion.span>{' '}
          and gaining hands-on experience.
        </motion.p>
        
        {/* Loading state */}
        {loading ? (
          <div className="relative">
            <motion.div 
              className="flex flex-col items-center justify-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className={`h-16 w-16 rounded-full border-4 ${
                  theme === 'dark' ? 'border-accent/30' : 'border-accent-light/30'
                }`}
                style={{ 
                  borderTopColor: theme === 'dark' ? '#8352FD' : '#6d28d9',
                  borderRightColor: theme === 'dark' ? '#8352FD' : '#6d28d9',
                }}
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear",
                }}
              />
              
              <motion.p 
                className={`mt-6 ${
                  theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading experience...
              </motion.p>
              
              <motion.div
                className={`mt-8 h-2 w-48 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                }`}
              >
                <motion.div
                  className={`h-full ${
                    theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <div ref={containerRef} className="relative">
            {/* Enhanced timeline with gradient and animation */}
            {!isMobile && (
              <div className="absolute left-4 top-0 bottom-0 w-1 hidden md:block">
                <div className={`absolute inset-0 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-200'
                }`} />
                
                <motion.div 
                  className={`absolute top-0 left-0 w-full rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-b from-accent via-purple-500 to-accent' 
                      : 'bg-gradient-to-b from-accent-light via-purple-400 to-accent-light'
                  }`}
                  style={{ 
                    height: scrollYProgress, 
                    scaleY: pathLength
                  }}
                />
                
                {/* Animated glow effect */}
                <motion.div 
                  className="absolute top-0 left-0 w-full h-20 blur-md"
                  style={{
                    background: theme === 'dark' 
                      ? 'linear-gradient(to bottom, rgba(131, 82, 253, 0.5), transparent)' 
                      : 'linear-gradient(to bottom, rgba(109, 40, 217, 0.3), transparent)',
                    y: scrollYProgress.get() * (containerRef.current?.scrollHeight || 0) - 10,
                  }}
                />
              </div>
            )}
            
            {/* Experiences list */}
            <div className="space-y-12 relative">
              {experiences.map((experience, index) => (
                <div key={experience.id} className="md:ml-12 relative">
                  {/* Timeline dot */}
                  {!isMobile && (
                    <div className="absolute -left-14 top-5 hidden md:block z-10">
                      <TimelineDot 
                        theme={theme}
                        isActive={activeExperienceId === experience.id}
                      />
                    </div>
                  )}
                  
                  {/* Experience card */}
                  <ExperienceCard 
                    experience={experience} 
                    index={index} 
                    isActive={isMobile ? activeExperienceId === experience.id : true}
                    onActivate={() => setActiveExperienceId(experience.id)}
                  />
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <motion.div 
                className={`inline-block px-6 py-3 rounded-full cursor-pointer ${
                  theme === 'dark' 
                    ? 'bg-accent/20 hover:bg-accent/40' 
                    : 'bg-accent-light/20 hover:bg-accent-light/30'
                } transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/projects'}
              >
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                  Check out my projects
                  <span className="ml-2 inline-block">→</span>
                </span>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;