import React from 'react';
import { motion } from 'framer-motion';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

// Tech icon
const FloatingIcon: React.FC<{ position: [number, number, number], icon: string }> = ({ position, icon }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]}/>
      <meshStandardMaterial color="#8352FD"/>
      {/* Add texture mapping for tech logos */}
    </mesh>
  );
};

const TechCloud: React.FC = () => {
  return (
    <div className="h-[400px] w-full">
      <Canvas>
        <ambientLight intensity={0.5}/>
        <pointLight position={[10, 10, 10]}/>
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

const About: React.FC = () => {
  return (
    <section className="min-h-screen w-full pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          About Me
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            <h3 className="text-2xl font-bold mb-4">Who am I?</h3>
            <p className="text-secondary mb-6">
            I'm a full-stack developer experienced in building scalable web applications, HR systems, and e-commerce platforms, focused on delivering seamless and interactive user experiences.
            </p>
            
            <h3 className="text-2xl font-bold mb-4">My Journey</h3>
            <p className="text-secondary">
            From building scalable HR systems and e-commerce platforms to developing advanced image processing and semantic search pipelines, my journey as a software developer has been driven by a passion for creating efficient, user-centric solutions that solve real-world problems.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <TechCloud />
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-center">My Skills</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Frontend Skills */}
            <div className="bg-tertiary p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4">Frontend</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>React</span>
                  <span className="text-[#8352FD]">90%</span>
                </li>
                <li className="flex justify-between">
                  <span>TypeScript</span>
                  <span className="text-[#8352FD]">85%</span>
                </li>
                <li className="flex justify-between">
                  <span>Three.js</span>
                  <span className="text-[#8352FD]">80%</span>
                </li>
              </ul>
            </div>
            
            {/* Backend Skills */}
            <div className="bg-tertiary p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4">Backend</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Node.js</span>
                  <span className="text-[#8352FD]">85%</span>
                </li>
                <li className="flex justify-between">
                  <span>Express</span>
                  <span className="text-[#8352FD]">80%</span>
                </li>
                <li className="flex justify-between">
                  <span>PostgreSQL</span>
                  <span className="text-[#8352FD]">75%</span>
                </li>
              </ul>
            </div>
            
            {/* Other Skills */}
            <div className="bg-tertiary p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-4">Other</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Docker</span>
                  <span className="text-[#8352FD]">70%</span>
                </li>
                <li className="flex justify-between">
                  <span>CI/CD</span>
                  <span className="text-[#8352FD]">75%</span>
                </li>
                <li className="flex justify-between">
                  <span>UI/UX Design</span>
                  <span className="text-[#8352FD]">65%</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;