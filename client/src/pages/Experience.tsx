import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { getExperiences } from '../api/portfolio';
import { useTheme } from '../context/ThemeContext';

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

const ExperienceCard: React.FC<{ experience: Experience; index: number }> = ({ experience, index }) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: "-100px 0px" });
  
  // Parse the description into bullet points
  const bulletPoints = experience.description.split('\n').filter(point => point.trim() !== '');
  
  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }
        }
      }}
      className={`card-base mb-8 transition-all duration-500 ${
        theme === 'dark' ? 'hover:bg-black-100/60' : 'hover:bg-white'
      } hover:shadow-xl`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {experience.logo && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : { scale: 0.8, opacity: 0, rotate: -5 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className={`w-16 h-16 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-black-100' : 'bg-gray-100'
            } flex-shrink-0 flex items-center justify-center shadow-md`}>
            <img 
              src={experience.logo} 
              alt={experience.company}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/company-placeholder.png';
              }}/>
          </motion.div>
        )}
        
        <div>
          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
            {experience.position}
          </motion.h3>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <span className="text-accent font-medium">{experience.company}</span>
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
            } mt-1`}>
            {formatDate(experience.startDate)} - {experience.current ? 'Present' : (experience.endDate ? formatDate(experience.endDate) : '')}
          </motion.div>
        </div>
      </div>
      
      {/* Description with animated bullet points */}
      <div className={`mb-6 text-gray-600 ${
        theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
      }`}>
        {bulletPoints.map((point, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ 
              delay: 0.4 + (i * 0.1), // Stagger each bullet point
              duration: 0.5
            }}
            className="mb-2 flex">
            <span className="text-accent mr-2 mt-0.5">•</span>
            <span>{point.replace(/^•\s*/, '')}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {experience.skills.map((skill, skillIndex) => (
          <motion.span 
            key={skillIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ 
              delay: 0.5 + skillIndex * 0.05,
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.05, backgroundColor: theme === 'dark' ? '#8352FD20' : '#6d28d920' }}
            className={`px-2 py-1 text-xs rounded-full ${
              theme === 'dark' 
                ? 'bg-black-100 text-secondary hover:text-white' 
                : 'bg-gray-100 text-secondary-light hover:text-gray-700'
            } transition-colors`}>
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const Experience: React.FC = () => {
  const { theme } = useTheme();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);
  
  return (
    <section className="min-h-screen w-full pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          className={`text-4xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } relative`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}>
          Work Experience
          <motion.span 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
            className="absolute left-1/2 bottom-0 h-1 w-24 bg-accent -translate-x-1/2 rounded-full origin-center"
          />
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`text-center mb-10 max-w-xl mx-auto ${
            theme === 'dark' ? 'text-secondary' : 'text-secondary-light'
          }`}
        >
          My professional journey as a software engineer, building innovative solutions and gaining hands-on experience.
        </motion.p>
        
        {loading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 0.8, loop: Infinity, ease: "linear" }}>
            <div className={`h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 ${
              theme === 'dark' ? 'border-accent' : 'border-accent-light'
            }`}></div>
          </motion.div>
        ) : (
          <div ref={containerRef} className="relative">
            {/* Animated timeline line that follows scroll */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 dark:bg-gray-700/30 bg-gray-200 hidden md:block">
              <motion.div 
                className="absolute top-0 left-0 w-full bg-accent"
                style={{ 
                  height: scrollYProgress, 
                  scaleY: pathLength
                }}
              />
            </div>
            
            {/* Experiences */}
            <div className="space-y-12 relative">
              {experiences.map((experience, index) => (
                <div key={experience.id} className="md:ml-12 relative">
                  {/* Animated timeline dot */}
                  <motion.div 
                    initial={{ scale: 0, boxShadow: '0 0 0 rgba(131, 82, 253, 0)' }}
                    whileInView={{ 
                      scale: 1, 
                      boxShadow: theme === 'dark' 
                        ? '0 0 10px rgba(131, 82, 253, 0.5)' 
                        : '0 0 10px rgba(109, 40, 217, 0.3)'
                    }}
                    viewport={{ once: true, margin: "-100px 0px" }}
                    transition={{ 
                      delay: 0.2,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 300,
                      bounce: 0.4
                    }}
                    className={`absolute -left-14 top-5 w-4 h-4 rounded-full ${
                      theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                    } hidden md:block z-10`}>
                    <motion.div
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ 
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeOut",
                        delay: index * 0.2
                      }}
                      className={`absolute inset-0 rounded-full ${
                        theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                      }`}
                    />
                  </motion.div>
                  
                  {/* Experience card with index */}
                  <ExperienceCard experience={experience} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;