import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="fixed top-0 z-20 flex w-full items-center px-6 py-5 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Profilio</span>
        </Link>
        
        <ul className="flex list-none flex-row gap-10">
          <li className="text-secondary hover:text-white">
            <Link to="/">Home</Link>
          </li>
          <li className="text-secondary hover:text-white">
            <Link to="/about">About</Link>
          </li>
          <li className="text-secondary hover:text-white">
            <Link to="/projects">Projects</Link>
          </li>
          <li className="text-secondary hover:text-white">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        
        <button onClick={toggleTheme} className="rounded-full p-2 text-white">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;