import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/Background';

const Home: React.FC = () => {
  return (
    <section className="relative h-screen w-full">
      {/* 3D background scene */}
      <ParticleBackground className="absolute inset-0"/>
      
      {/* Content with some cool animations */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center">

          <h1 className="text-5xl md:text-7xl font-bold dark:text-white text-gray-800 mb-6">
            <span className="block">Hello World, I'm</span>
            <span className="text-accent">Nam</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl dark:text-secondary text-secondary-light max-w-md mx-auto mb-8">
            A Full-stack Developer and Part-time Designer
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex gap-4 justify-center">
            <Link 
              to="/projects" 
              className="button-primary-filled">
              View Projects
            </Link>
            <Link 
              to="/experience" 
              className="button-primary-outline">
              My Experience
            </Link>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}>
        <div className="w-[30px] h-[50px] rounded-full border-2 dark:border-secondary border-secondary-light flex justify-center">
          <motion.div 
            className="w-2 h-2 rounded-full dark:bg-secondary bg-secondary-light mt-2"
            animate={{ y: [0, 24, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}/>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;