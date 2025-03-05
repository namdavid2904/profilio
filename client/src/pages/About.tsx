import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { getSkills } from '../api/portfolio';
import { useTheme } from '../context/ThemeContext';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

const fallbackSkills: Skill[] = [
  // Languages
  { id: "l1", name: 'C#', category: 'Language', level: 90 },
  { id: "l2", name: 'TypeScript', category: 'Language', level: 92 },
  { id: "l3", name: 'JavaScript', category: 'Language', level: 95 },
  { id: "l4", name: 'Python', category: 'Language', level: 85 },
  { id: "l5", name: 'Java', category: 'Language', level: 80 },
  { id: "l6", name: 'SQL', category: 'Language', level: 88 },
  { id: "l7", name: 'HTML', category: 'Language', level: 95 },
  { id: "l8", name: 'CSS', category: 'Language', level: 90 },
  { id: "l9", name: 'C', category: 'Language', level: 72 },
  
  // Backend
  { id: "b1", name: '.NET Core', category: 'Backend', level: 85 },
  { id: "b2", name: 'Node.js', category: 'Backend', level: 90 },
  { id: "b3", name: 'Express', category: 'Backend', level: 88 },
  { id: "b4", name: 'Flask', category: 'Backend', level: 78 },
  
  // Frontend
  { id: "f1", name: 'React', category: 'Frontend', level: 87 },
  { id: "f2", name: 'Three.js', category: 'Frontend', level: 78 },
  { id: "f3", name: 'Framer Motion', category: 'Frontend', level: 80 },
  { id: "f4", name: 'Tailwind CSS', category: 'Frontend', level: 84 },
  
  // Database
  { id: "d1", name: 'MS SQL Server', category: 'Database', level: 85 },
  { id: "d2", name: 'PostgreSQL', category: 'Database', level: 88 },
  { id: "d3", name: 'Prisma ORM', category: 'Database', level: 85 },
  
  // DevOps
  { id: "dv1", name: 'Docker', category: 'DevOps', level: 80 },
  { id: "dv2", name: 'GitHub Actions', category: 'DevOps', level: 75 },
  { id: "dv3", name: 'Azure', category: 'DevOps', level: 70 },
];

// Convert skill level to width class
const getWidthClass = (level: number): string => {
  return `w-[${level}%]`;
};

// Tech icon with interactive hover effect
const FloatingIcon: React.FC<{ position: [number, number, number], icon: string, color: string }> = ({ position, icon, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]}/>
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Lines connecting tech spheres
const ConnectionLines: React.FC<{ positions: [number, number, number][], color: string }> = ({ positions, color }) => {
  return (
    <>
      {positions.map((position, index) => {
        if (index < positions.length - 1) {
          const nextPosition = positions[index + 1];
          return (
            <line key={index}>
              <bufferGeometry attach="geometry" 
                setFromPoints={[
                  { x: position[0], y: position[1], z: position[2] },
                  { x: nextPosition[0], y: nextPosition[1], z: nextPosition[2] }
                ]} 
              />
              <lineBasicMaterial attach="material" color={color} linewidth={1} opacity={0.5} transparent />
            </line>
          );
        }
        return null;
      })}
    </>
  );
};

const TechCloud: React.FC = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
  const iconPositions: [number, number, number][] = [
    [3, 0, 0],    // React
    [-3, 0, 0],   // Node
    [0, 3, 0],    // Three.js
    [0, -3, 0],   // TypeScript
    [0, 0, 3],    // PostgreSQL
    [0, 0, -3],   // Docker
    [2, 2, 2],    // AWS
    [-2, -2, -2]  // Git
  ];
  
  const iconColor = theme === 'dark' ? '#8352FD' : '#6d28d9';
  const lineColor = theme === 'dark' ? '#8352FD33' : '#6d28d933';

  return (
    <div ref={containerRef} className="h-[400px] w-full relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <Canvas>
          <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8}/>
          <pointLight position={[10, 10, 10]} intensity={1.5}/>
          <ConnectionLines positions={iconPositions} color={lineColor} />
          
          {iconPositions.map((position, index) => (
            <FloatingIcon 
              key={index}
              position={position} 
              icon={`tech-${index}`} 
              color={iconColor}
            />
          ))}
          
          <OrbitControls 
            autoRotate 
            autoRotateSpeed={0.5} 
            enableZoom={false}
            enablePan={false}
          />
        </Canvas>
      </motion.div>
      
      {/* Tech keywords floating in background */}
      <div className="absolute inset-0 pointer-events-none">
        {['React', 'Node.js', 'TypeScript', 'Three.js', 'PostgreSQL', 'Docker', 'AWS', 'Git'].map((tech, i) => (
          <motion.div 
            key={i}
            className={`absolute text-sm ${theme === 'dark' ? 'text-white/30' : 'text-gray-500/30'} font-bold`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
            animate={{
              y: [20, -20, 20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {tech}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SkillCategory: React.FC<{ title: string, skills: Skill[], theme: string }> = ({ title, skills, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.7 }}
      className={`p-6 rounded-xl transition-all ${
        theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
      } shadow hover:shadow-lg hover-effect`}>
      <h4 className={`text-xl font-bold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</h4>
      <ul className="space-y-2">
        {skills.map((skill, idx) => (
          <li key={skill.id} className="mb-2">
            <div className="flex justify-between mb-1">
              <span className={theme === 'dark' ? 'text-secondary' : 'text-gray-600'}>{skill.name}</span>
              <span className={theme === 'dark' ? 'text-accent' : 'text-accent-light'}>{skill.level}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
            }`}>
              <motion.div 
                className={`h-full rounded-full ${
                  theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                }`}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * idx, ease: "easeOut" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

const About: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const aboutRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });
  
  const opacityValue = useTransform(scrollYProgress, [0, 0.2], [0.3, 1]);
  const yValue = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        if (data && Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSkills();
  }, []);

  // Group skills by category
  const languageSkills = skills.filter(skill => skill.category === 'Language');
  const backendSkills = skills.filter(skill => skill.category === 'Backend');
  const frontendSkills = skills.filter(skill => skill.category === 'Frontend');
  const databaseSkills = skills.filter(skill => skill.category === 'Database');
  const devopsSkills = skills.filter(skill => skill.category === 'DevOps');
  
  // Scroll-triggered animation for section title
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true });
  
  return (
    <motion.section
      ref={aboutRef}
      className="min-h-screen w-full pt-20 pb-10 px-4 md:px-8"
      style={{ 
        opacity: opacityValue,
        y: yValue,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          ref={titleRef}
          className={`text-4xl font-bold mb-10 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } relative`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          About Me
          <motion.span 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={titleInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "circOut" }}
            className={`absolute left-1/2 bottom-0 h-1 w-24 -translate-x-1/2 rounded-full origin-center ${
              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
            }`}
          />
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`p-8 rounded-xl transition-all ${
              theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
            } shadow-lg hover:shadow-xl hover-effect animated-border-gradient`}>
            <div className="space-y-6">
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>Who am I?</h3>
                <p className={`${
                  theme === 'dark' ? 'text-secondary' : 'text-gray-600'
                } mb-6 leading-relaxed`}>
                  I'm currently a Computer Science student at UMass Amherst and a full-stack developer with experience in building scalable web applications, HR systems, and e-commerce platforms, focused on delivering seamless and interactive user experiences. In my free time, I enjoy playing soccer and chess.
                </p>
              </div>
              
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>My Journey</h3>
                <p className={`${
                  theme === 'dark' ? 'text-secondary' : 'text-gray-600'
                } leading-relaxed`}>
                  From building scalable HR systems and e-commerce platforms to developing advanced image processing and semantic search pipelines, my journey as a software developer has been driven by a passion for creating efficient, user-centric solutions that solve real-world problems.
                </p>
              </div>
              
              <div>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>What I Do</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Web Development", icon: "💻" },
                    { title: "UI/UX Design", icon: "🎨" },
                    { title: "Database Design", icon: "🗄️" },
                    { title: "Cloud Solutions", icon: "☁️" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      className={`p-4 rounded-lg ${
                        theme === 'dark' ? 'bg-black-100/40' : 'bg-gray-50'
                      } flex items-center gap-3`}
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{item.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-tertiary/40' : 'bg-gray-50'
            }`}>
            <TechCloud />
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}>
          <h3 className={`text-2xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            <motion.span 
              initial={{ backgroundSize: "0% 3px" }}
              animate={{ backgroundSize: "100% 3px" }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className={`bg-gradient-to-r ${
                theme === 'dark' ? 'from-accent to-purple-500' : 'from-accent-light to-purple-400'
              } bg-no-repeat bg-bottom pb-2`}
            >
              My Skills
            </motion.span>
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className={`h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 ${
                theme === 'dark' ? 'border-accent' : 'border-accent-light'
              }`}></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Languages */}
              {languageSkills.length > 0 && (
                <div className="skill-section-container">
                  <motion.h4 
                    className={`text-xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    } inline-block relative`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    Programming Languages
                    <motion.span
                      className={`absolute -bottom-1 left-0 h-0.5 ${
                        theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    />
                  </motion.h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {languageSkills.map((skill, idx) => (
                      <motion.div 
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1, duration: 0.5 }}
                        className={`rounded-lg px-3 py-3 flex items-center justify-between ${
                          theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
                        } hover-effect`}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: theme === 'dark' 
                            ? '0 4px 12px rgba(131, 82, 253, 0.15)'
                            : '0 4px 12px rgba(109, 40, 217, 0.1)'
                        }}
                      >
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{skill.name}</span>
                        <div className={`w-28 h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                        }`}>
                          <motion.div 
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                            }`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.1 * idx, ease: "easeOut" }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Using the same pattern for other skill categories */}
              {backendSkills.length > 0 && (
                <SkillCategory 
                  title="Backend Technologies" 
                  skills={backendSkills} 
                  theme={theme}
                />
              )}

              {frontendSkills.length > 0 && (
                <SkillCategory 
                  title="Frontend Technologies" 
                  skills={frontendSkills} 
                  theme={theme}
                />
              )}

              {databaseSkills.length > 0 && (
                <SkillCategory 
                  title="Database Technologies" 
                  skills={databaseSkills} 
                  theme={theme}
                />
              )}

              {devopsSkills.length > 0 && (
                <SkillCategory 
                  title="Cloud & DevOps" 
                  skills={devopsSkills} 
                  theme={theme}
                />
              )}
            </div>
          )}
          
          {/* Summary CTA section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`mt-12 p-6 rounded-xl text-center ${
              theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
            } shadow-lg`}
          >
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Let's Work Together</h3>
            <p className={`max-w-2xl mx-auto mb-6 ${
              theme === 'dark' ? 'text-secondary' : 'text-gray-600'
            }`}>
              I'm currently available for freelance work and open to new opportunities.
              If you'd like to discuss a project or position, feel free to get in touch!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-primary-filled"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Me
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
