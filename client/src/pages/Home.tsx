import React from 'react';
import MainScene from '../scenes/MainScene';
const Home: React.FC = () => {
  return (
    <section className="relative h-screen w-full">
      <MainScene className="absolute inset-0"/>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-white">Welcome to My Portfolio</h1>
        <p className="text-xl text-secondary max-w-md text-center">
          Explore my 3D project gallery
        </p>
      </div>
    </section>
  );
};

export default Home;