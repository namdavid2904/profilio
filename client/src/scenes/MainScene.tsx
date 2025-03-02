import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// Animated cube component
const AnimatedCube: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8352FD" />
    </mesh>
  );
};

// Scene configuration
const SceneSetup: React.FC = () => {
  const { theme } = useTheme();
  const { scene } = useThree();
  
  useEffect(() => {
    // Change background color based on theme
    scene.background = new THREE.Color(theme === 'dark' ? '#050816' : '#f0f0f0');
  }, [theme, scene]);
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="city" />
    </>
  );
};

interface MainSceneProps {
  className?: string;
}

const MainScene: React.FC<MainSceneProps> = ({ className }) => {
  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas>
        <SceneSetup />
        <AnimatedCube />
      </Canvas>
    </div>
  );
};

export default MainScene;