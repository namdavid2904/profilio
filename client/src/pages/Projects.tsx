import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRepos } from '../api/github.ts';
import Card from '../components/3DCard.tsx';

interface Project {
  id: number;
  name: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const username = 'namdavid2904';
      const repos = await getRepos(username);
      
      // Turn repos into project format
      const formattedProjects = repos
        .filter(repo => !repo.fork && repo.description)
        .map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || '',
          technologies: [repo.language, ...(repo.topics || [])].filter(Boolean),
          githubUrl: repo.html_url,
          image: `/assets/projects/${repo.name}.png`,
        }));
      
      setProjects(formattedProjects);
      setLoading(false);
    }
    
    loadProjects();
  }, []);

  return (
    <section className="min-h-screen w-full pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          My Projects
        </motion.h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#8352FD]"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="show">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project}/>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}>
      <Card className="bg-tertiary rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="h-48 bg-gray-600 relative overflow-hidden">
          {project.image ? (
            <img 
              src={project.image} 
              alt={project.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/project-placeholder.png';
              }}/>
          ) : (
            <div className="flex items-center justify-center h-full bg-black-100">
              <span className="text-2xl font-bold">{project.name.substring(0, 2).toUpperCase()}</span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
          <p className="text-secondary mb-4 line-clamp-2">{project.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span 
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-black-100 text-secondary">
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 text-xs rounded-full bg-black-100 text-secondary">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
          
          <div className="flex gap-4">
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-white hover:text-[#8352FD] transition-colors">
              GitHub
            </a>
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-white hover:text-[#8352FD] transition-colors">
                Live Demo
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Projects;