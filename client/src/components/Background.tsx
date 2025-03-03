import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

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
  const pointsRef = useRef<THREE.Points>(null);
  const points = useMemo(() => generatePoints(POINT_COUNT), []);
  
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
        size={0.05}
        color="#8352FD"
        sizeAttenuation
        transparent
        depthWrite={false}/>
    </points>
  );
}

interface ParticleBackgroundProps {
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ className }) => {
  return (
    <div className={`h-full w-full ${className || ''}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5}/>
        <ParticleField/>
      </Canvas>
    </div>
  );
};

export default ParticleBackground;