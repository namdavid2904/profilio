import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="fixed top-0 z-20 flex w-full items-center px-6 py-5 backdrop-blur-sm transition-theme dark:bg-primary/80 bg-white/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold dark:text-white text-gray-800">Profilio</span>
        </Link>
        
        <ul className="hidden md:flex list-none flex-row gap-10">
          <li className="dark:text-secondary text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors">
            <Link to="/">Home</Link>
          </li>
          <li className="dark:text-secondary text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors">
            <Link to="/about">About</Link>
          </li>
          <li className="dark:text-secondary text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors">
            <Link to="/experience">Experience</Link>
          </li>
          <li className="dark:text-secondary text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors">
            <Link to="/projects">Projects</Link>
          </li>
          <li className="dark:text-secondary text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-2xl dark:text-white text-gray-800"
            aria-label="Toggle mobile menu">
            ☰
          </button>

          {/* Theme toggle */}
          <button 
            onClick={toggleTheme} 
            className="rounded-full p-2 dark:bg-tertiary/50 bg-gray-100 dark:text-white text-gray-800 transition-colors"
            aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;