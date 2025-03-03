import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const POINT_COUNT = 3000;

const generatePoints = (count: number) => {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    points[i3] = (Math.random() - 0.5) * 10;
    points[i3 + 1] = (Math.random() - 0.5) * 10;
    points[i3 + 2] = (Math.random() - 0.5) * 10;
  }
  return points;
};

function ParticleField() {
  const { theme } = useTheme(); 
  const pointsRef = useRef<THREE.Points>(null);
  const points = useMemo(() => generatePoints(POINT_COUNT), []);
  
  // Colors based on theme
  const particleColor = theme === 'dark' ? "#8352FD" : "#6d28d9";
  const particleSize = theme === 'dark' ? 0.05 : 0.04;
  
  useFrame(({ clock, mouse }) => {
    const time = clock.getElapsedTime();
    
    if (!pointsRef.current) return;
    
    // Wave effect
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < POINT_COUNT; i++) {
      const i3 = i * 3;
      positions[i3 + 1] = Math.sin(time + positions[i3 + 0]) * 0.5;
    }
   
    // Rotate based on mouse position
    pointsRef.current.rotation.y = mouse.x * 0.2;
    pointsRef.current.rotation.x = -mouse.y * 0.2;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}/>
      </bufferGeometry>
      <PointMaterial
        size={particleSize}
        color={particleColor}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={theme === 'dark' ? 1 : 0.8}
      />
    </points>
  );
}

interface ParticleBackgroundProps {
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`h-full w-full transition-all duration-700 ${className || ''}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={[theme === 'dark' ? '#050816' : '#ffffff']} />
        <fog attach="fog" args={[theme === 'dark' ? '#050816' : '#ffffff', 3.5, 15]} />
        <ambientLight intensity={theme === 'dark' ? 0.5 : 0.8}/>
        <ParticleField/>
      </Canvas>
    </div>
  );
};

export default ParticleBackground;