import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <>
      <nav className="fixed top-0 z-20 flex w-full items-center px-6 py-5 backdrop-blur-sm transition-theme dark:bg-primary/80 bg-primary-light/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold dark:text-white text-gray-800">
              Profilio
            </span>
          </Link>
          
          <ul className="hidden md:flex list-none flex-row gap-10">
            <NavLinks/>
          </ul>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-2xl dark:text-white text-gray-800"
              aria-label="Toggle mobile menu">
              {mobileMenuOpen ? '✕' : '☰'}
            </button>

            {/* Theme toggle */}
            <motion.button 
              onClick={toggleTheme} 
              className="rounded-full p-2 dark:bg-tertiary/50 bg-gray-100 dark:text-white text-gray-800 transition-colors"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden fixed top-[72px] left-0 right-0 z-20 dark:bg-primary bg-white p-5 border-t dark:border-gray-800 border-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}>
            <ul className="flex flex-col space-y-4">
              <NavLinks onClick={() => setMobileMenuOpen(false)}/>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const NavLinks: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/experience', label: 'Experience' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];
  
  return (
    <>
      {links.map((link) => (
        <li 
          key={link.to} 
          className="nav-item dark:text-secondary text-secondary-light hover:dark:text-white hover:text-gray-900 transition-colors"
          onClick={onClick}>
          <Link to={link.to}>{link.label}</Link>
        </li>
      ))}
    </>
  );
};

export default Navbar;