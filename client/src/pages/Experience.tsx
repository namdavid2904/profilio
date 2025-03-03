import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const ExperienceCard: React.FC<{ experience: Experience }> = ({ experience }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-tertiary rounded-xl p-6 relative mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {experience.logo && (
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black-100 flex-shrink-0 flex items-center justify-center">
            <img 
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
            <span className="text-[#8352FD] font-medium">{experience.company}</span>
            {experience.location && (
              <>
                <span className="hidden md:inline text-secondary">•</span>
                <span className="text-secondary">{experience.location}</span>
              </>
            )}
          </div>
          <div className="text-sm dark:text-secondary text-gray-500 mt-1">
            {formatDate(experience.startDate)} - {experience.current ? 'Present' : (experience.endDate ? formatDate(experience.endDate) : '')}
          </div>
        </div>
      </div>
      
      <div className="dark:text-secondary text-gray-600 mb-4 whitespace-pre-line">
        {experience.description}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {experience.skills.map((skill, index) => (
          <span 
            key={index}
            className="px-2 py-1 text-xs rounded-full bg-black-100 dark:text-secondary text-gray-600">
            {skill}
          </span>
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
          transition={{ duration: 0.5 }}>
          Work Experience
        </motion.h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#8352FD]"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
            
            {/* Experiences */}
            <div className="space-y-12 relative">
              {experiences.map((experience) => (
                <div key={experience.id} className="md:ml-12 relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-14 top-5 w-4 h-4 rounded-full bg-[#8352FD] hidden md:block"></div>
                  <ExperienceCard experience={experience} />
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