import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

// Tech icon
const FloatingIcon: React.FC<{ position: [number, number, number], icon: string }> = ({ position, icon }) => {
  const { theme } = useTheme();
  
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]}/>
      <meshStandardMaterial color={theme === 'dark' ? '#8352FD' : '#6d28d9'} />
    </mesh>
  );
};

const TechCloud: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="h-[400px] w-full">
      <Canvas>
        <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8}/>
        <pointLight position={[10, 10, 10]} intensity={1.5}/>
        <OrbitControls autoRotate enableZoom={false}/>
        <FloatingIcon position={[3, 0, 0]} icon="react"/>
        <FloatingIcon position={[-3, 0, 0]} icon="node"/>
        <FloatingIcon position={[0, 3, 0]} icon="three"/>
        <FloatingIcon position={[0, -3, 0]} icon="ts"/>
        <FloatingIcon position={[0, 0, 3]} icon="postgres"/>
        <FloatingIcon position={[0, 0, -3]} icon="docker"/>
      </Canvas>
    </div>
  );
};

const SkillCategory: React.FC<{ title: string, skills: Skill[], theme: string }> = ({ title, skills, theme }) => {
  return (
    <div className={`p-6 rounded-xl transition-all ${
      theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
    } shadow hover:shadow-lg hover-effect`}>
      <h4 className={`text-xl font-bold mb-4 ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>{title}</h4>
      <ul className="space-y-2">
        {skills.map((skill) => (
          <li key={skill.id} className="mb-2">
            <div className="flex justify-between mb-1">
              <span className={theme === 'dark' ? 'text-secondary' : 'text-gray-600'}>{skill.name}</span>
              <span className={theme === 'dark' ? 'text-accent' : 'text-accent-light'}>{skill.level}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${
              theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
            }`}>
              <div className={`h-full rounded-full ${
                theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
              }`} 
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const About: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
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
  
  return (
    <section className="min-h-screen w-full pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className={`text-4xl font-bold mb-10 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          } relative`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          About Me
          <motion.span 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
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
            className={`p-6 rounded-xl transition-all ${
              theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
            } shadow hover:shadow-lg hover-effect animated-border-gradient`}>
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>Who am I?</h3>
            <p className={`${
              theme === 'dark' ? 'text-secondary' : 'text-gray-600'
            } mb-6`}>
              I'm currently a Computer Science student at UMass Amherst and a full-stack developer with experience in building scalable web applications, HR systems, and e-commerce platforms, focused on delivering seamless and interactive user experiences. In my free time, I enjoy playing soccer and chess.
            </p>
            
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>My Journey</h3>
            <p className={theme === 'dark' ? 'text-secondary' : 'text-gray-600'}>
              From building scalable HR systems and e-commerce platforms to developing advanced image processing and semantic search pipelines, my journey as a software developer has been driven by a passion for creating efficient, user-centric solutions that solve real-world problems.
            </p>
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
          }`}>My Skills</h3>
          
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}>
                  <h4 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Programming Languages</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {languageSkills.map(skill => (
                      <div 
                        key={skill.id} 
                        className={`rounded-lg px-3 py-2 flex items-center justify-between ${
                          theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
                        } hover-effect`}>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{skill.name}</span>
                        <div className={`w-24 h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                            }`} 
                            style={{ width: `${skill.level}%` }}>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Backend */}
              {backendSkills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}>
                  <h4 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Backend Technologies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {backendSkills.map(skill => (
                      <div 
                        key={skill.id} 
                        className={`rounded-lg px-3 py-2 flex items-center justify-between ${
                          theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
                        } hover-effect`}>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{skill.name}</span>
                        <div className={`w-24 h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                            }`} 
                            style={{ width: `${skill.level}%` }}>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Frontend */}
              {frontendSkills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}>
                  <h4 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Frontend Technologies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {frontendSkills.map(skill => (
                      <div 
                        key={skill.id} 
                        className={`rounded-lg px-3 py-2 flex items-center justify-between ${
                          theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
                        } hover-effect`}>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{skill.name}</span>
                        <div className={`w-24 h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                            }`} 
                            style={{ width: `${skill.level}%` }}>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Database */}
              {databaseSkills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}>
                  <h4 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Database Technologies</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {databaseSkills.map(skill => (
                      <div 
                        key={skill.id} 
                        className={`rounded-lg px-3 py-2 flex items-center justify-between ${
                          theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
                        } hover-effect`}>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{skill.name}</span>
                        <div className={`w-24 h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                            }`} 
                            style={{ width: `${skill.level}%` }}>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* DevOps */}
              {devopsSkills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}>
                  <h4 className={`text-xl font-bold mb-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>Cloud & DevOps</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {devopsSkills.map(skill => (
                      <div 
                        key={skill.id} 
                        className={`rounded-lg px-3 py-2 flex items-center justify-between ${
                          theme === 'dark' ? 'bg-tertiary/60' : 'bg-white'
                        } hover-effect`}>
                        <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>{skill.name}</span>
                        <div className={`w-24 h-2 rounded-full overflow-hidden ${
                          theme === 'dark' ? 'bg-black-100' : 'bg-gray-200'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${
                              theme === 'dark' ? 'bg-accent' : 'bg-accent-light'
                            }`} 
                            style={{ width: `${skill.level}%` }}>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default About;