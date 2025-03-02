import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-tertiary px-10 py-8 text-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p>© 2025 Profilio. All rights reserved.</p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a href="https://github.com/namdavid2904" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/namphamphuong" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;