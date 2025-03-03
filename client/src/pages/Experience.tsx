import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getExperiences } from '../api/portfolio';

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
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.2
          }
        }
      }}
      className="card-base mb-8 hover-effect">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {experience.logo && (
          <div className="w-16 h-16 rounded-full overflow-hidden dark:bg-black-100 bg-gray-100 flex-shrink-0 flex items-center justify-center">
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
              src={experience.logo} 
              alt={experience.company}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/company-placeholder.png';
              }}/>
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-bold dark:text-white text-gray-800">{experience.position}</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <span className="text-accent font-medium">{experience.company}</span>
            {experience.location && (
              <>
                <span className="hidden md:inline dark:text-secondary text-secondary-light">•</span>
                <span className="dark:text-secondary text-secondary-light">{experience.location}</span>
              </>
            )}
          </div>
          <div className="text-sm dark:text-secondary text-secondary-light mt-1">
            {formatDate(experience.startDate)} - {experience.current ? 'Present' : (experience.endDate ? formatDate(experience.endDate) : '')}
          </div>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.2 + 0.4, duration: 0.8 }}
        className="dark:text-secondary text-secondary-light mb-4 whitespace-pre-line">
        {experience.description}
      </motion.div>
      
      <div className="flex flex-wrap gap-2">
        {experience.skills.map((skill, skillIndex) => (
          <motion.span 
            key={skillIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: index * 0.2 + 0.5 + skillIndex * 0.05,
              duration: 0.5
            }}
            className="px-2 py-1 text-xs rounded-full dark:bg-black-100 bg-gray-100 dark:text-secondary text-secondary-light">
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

const Experience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  
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
          className="text-4xl font-bold mb-10 text-center dark:text-white text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}>
          Work Experience
        </motion.h2>
        
        {loading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-accent"></div>
          </motion.div>
        ) : (
          <AnimatePresence>
            <motion.div 
              className="relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}>
              
              {/* Timeline line */}
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute left-4 top-0 bottom-0 w-0.5 dark:bg-gray-700 bg-gray-200 hidden md:block">
              </motion.div>
              
              {/* Experiences */}
              <div className="space-y-12 relative">
                {experiences.map((experience, index) => (
                  <div key={experience.id} className="md:ml-12 relative">
                    {/* Timeline dot */}
                    <motion.div 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: index * 0.2 + 0.2,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300
                      }}
                      className="absolute -left-14 top-5 w-4 h-4 rounded-full bg-accent hidden md:block">
                    </motion.div>
                    
                    {/* Experience card with index */}
                    <ExperienceCard experience={experience} index={index} />
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default Experience;