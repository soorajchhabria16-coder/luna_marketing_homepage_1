"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Sphere, MeshDistortMaterial, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  radius: number;
  speed: number;
  size: number;
  color: string;
  offset?: number;
  distort?: number;
  hasRings?: boolean;
}

const Planet = ({ radius, speed, size, color, offset = 0, distort = 0, hasRings = false }: PlanetProps) => {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const orbitalT = t * speed + offset;
    
    if (ref.current) {
      ref.current.position.set(
        Math.cos(orbitalT) * radius,
        Math.sin(orbitalT * 0.5) * 2,
        Math.sin(orbitalT) * radius
      );
      ref.current.rotation.y += 0.01;
      ref.current.rotation.z += 0.005; // Added rotation on another axis
    }

    // Blink/Glow Effect - Varied by offset to prevent all planets blinking in sync
    if (lightRef.current) {
      const blinkSpeed = 2 + (offset % 2);
      lightRef.current.intensity = 8 + Math.sin(t * blinkSpeed + offset) * 6; 
    }
  });

  return (
    <group ref={ref}>
      <Trail
        width={0.6}
        length={5}
        color={new THREE.Color(color).multiplyScalar(0.2)}
        attenuation={(t) => t * t}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 32, 32]} />
          {/* Layered material for more "proper" planet look */}
          <MeshDistortMaterial
            color={color}
            speed={0.5} // Very slow to look like moving gas/clouds
            distort={0.4}
            roughness={0.8}
            metalness={0.1}
            emissive={color}
            emissiveIntensity={0.1}
          />
          {/* Subtle Atmosphere/Cloud Layer */}
          <mesh scale={[1.02, 1.02, 1.02]}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.1}
              depthWrite={false}
            />
          </mesh>
          <pointLight ref={lightRef} intensity={5} distance={size * 10} color={color} />
        </mesh>
      </Trail>

      {/* Saturn-style Rings - More detailed */}
      {hasRings && (
        <group rotation={[Math.PI / 2.5, 0.2, 0]}>
          <mesh>
            <torusGeometry args={[size * 1.8, size * 0.02, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
          <mesh rotation={[0.1, 0, 0]}>
            <torusGeometry args={[size * 2.1, size * 0.01, 16, 100]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
};

const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group>
      {/* Central Core */}
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#f8cf9c"
          emissiveIntensity={2}
          roughness={0}
          metalness={1}
        />
      </Sphere>
      {/* Primary Glow */}
      <Sphere args={[1.7, 64, 64]}>
        <meshBasicMaterial color="#f8cf9c" transparent opacity={0.3} />
      </Sphere>
      {/* Large Soft Glow */}
      <Sphere args={[2.5, 64, 64]}>
        <meshBasicMaterial color="#f8cf9c" transparent opacity={0.1} />
      </Sphere>
      {/* Intense Lights */}
      <pointLight intensity={50} color="#f8cf9c" distance={100} castShadow />
      <pointLight intensity={30} color="#ffffff" distance={30} />
      <pointLight intensity={20} color="#a78bfa" distance={50} position={[0, -5, 0]} />
    </group>
  );
};

interface OrbitProps {
  radius: number;
  color?: string;
  opacity?: number;
}

const Orbit = ({ radius, color = "#ffffff", opacity = 0.1 }: OrbitProps) => {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        p.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return p;
  }, [radius]);

  return (
    <line>
      <bufferGeometry attach="geometry" setFromPoints={points} />
      <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} linewidth={1} />
    </line>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      {/* Remove Stars from here to prevent them overlapping everything */}
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sun />
      </Float>

      {/* Theme-aligned Planets - Realistic Styles */}
      {/* 1. Purple Planet (Amethyst-like) */}
      <Orbit radius={6} color="#a78bfa" opacity={0.15} />
      <Planet radius={6} speed={0.4} size={0.5} color="#8b5cf6" />

      {/* 2. Saturn-style (Gas Giant) */}
      <Orbit radius={9} color="#f8cf9c" opacity={0.15} />
      <Planet radius={9} speed={0.25} size={0.9} color="#eab308" offset={Math.PI} hasRings={true} />

      {/* 3. Blue Planet (Ocean-like) */}
      <Orbit radius={12} color="#63b3ed" opacity={0.15} />
      <Planet radius={12} speed={0.15} size={0.7} color="#3b82f6" offset={1.5} />

      {/* 4. Pink/Red Planet (Mars-like) */}
      <Orbit radius={15} color="#f472b6" opacity={0.15} />
      <Planet radius={15} speed={0.1} size={0.5} color="#ec4899" offset={4} />
    </>
  );
};

const SolarSystem = () => {
  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 20, 35], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default SolarSystem;
