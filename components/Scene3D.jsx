'use client';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';

const SECTION_CONFIG = {
  hero: {
    position: [0, -0.6, 0],
    positionMd: [0, -0.6, 0],
    positionLg: [2, -0.2, 0],
    rotation: [0, 0, 0],
    rotationLg: [0, 0, 0],
    scale: 15,
    scaleLg: 23,
  },
  about: {
    position: [1.25, 0.5, 0],
    positionMd: [1.25, 0, 3],
    positionLg: [1.25, 0.2, 0],
    rotation: [0, Math.PI / 5, 0],
    rotationLg: [0, Math.PI / 5, 0],
    scale: 1,
    scaleLg: 1,
  },
  skill: {
    position: [0, 1.15, 0],
    rotation: [0, 0, 0],
    scale: 7,
  },
  project: {
    position: [0,0, 0],
    positionMd: [0, 0, 0],
    positionLg: [-4, 0, 0],
    rotation: [0, 0, 0],
    rotationLg: [0, 0, 0],
    scale: 13,
    scaleLg: 13,
  },
  experience: {
    position: [0, 0, 0],
    positionMd: [0, 0, 0],
    positionLg: [2, 0, 0],
    rotation: [0, 0, 0],
    rotationLg: [0, 0, 0],
    scale: 1,
    scaleLg: 1.2,
  }
};

function ModelComponent({ scrollPosition }) {
  const { scene } = useGLTF('/gltfmodels/bs3d.gltf');
  const modelRef = useRef();
  const { size } = useThree();
  
  const sectionData = useMemo(() => {
    const sections = Object.keys(SECTION_CONFIG);
    const totalSections = sections.length;
    return { sections, totalSections };
  }, []);

  const isLargeScreen = size.width >= 1007;
  const isMediumScreen = size.width >= 768 && size.width < 1007; // Added medium screen detection

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.frustumCulled = true;
          
          if (child.material) {
            child.material.precision = 'mediump';
            child.material.dithering = true;
          }
        }
      });
    }
  }, [scene]);

  useFrame(() => {
    if (!modelRef.current || !scene) return;
    
    const { sections, totalSections } = sectionData;
    
    const currentSectionIndex = scrollPosition * (totalSections - 1);
    const fromIndex = Math.floor(currentSectionIndex);
    const toIndex = Math.min(fromIndex + 1, totalSections - 1);
    const progress = currentSectionIndex - fromIndex;

    const fromSection = sections[fromIndex];
    const toSection = sections[toIndex];
    const fromConfig = SECTION_CONFIG[fromSection];
    const toConfig = SECTION_CONFIG[toSection];

    if (!fromConfig || !toConfig) return;

    const fromPosition = isLargeScreen 
      ? (fromConfig.positionLg || fromConfig.position)
      : isMediumScreen
      ? (fromConfig.positionMd || fromConfig.position)
      : fromConfig.position;
      
    const toPosition = isLargeScreen 
      ? (toConfig.positionLg || toConfig.position)
      : isMediumScreen
      ? (toConfig.positionMd || toConfig.position)
      : toConfig.position;
      
    const fromRotation = isLargeScreen ? (fromConfig.rotationLg || fromConfig.rotation) : fromConfig.rotation;
    const toRotation = isLargeScreen ? (toConfig.rotationLg || toConfig.rotation) : toConfig.rotation;
    
    const fromScale = isLargeScreen
    ? (fromConfig.scaleLg || fromConfig.scale)
    : isMediumScreen
    ? (fromConfig.scaleMd || fromConfig.scale)
    : fromConfig.scale;
    
    const toScale = isLargeScreen
    ? (toConfig.scaleLg || toConfig.scale)
    : isMediumScreen
    ? (toConfig.scaleMd || toConfig.scale)
    : toConfig.scale;

    const easedProgress = THREE.MathUtils.smoothstep(progress, 0, 1);

    modelRef.current.position.lerp(
      new THREE.Vector3(
        fromPosition[0] + (toPosition[0] - fromPosition[0]) * easedProgress,
        fromPosition[1] + (toPosition[1] - fromPosition[1]) * easedProgress,
        fromPosition[2] + (toPosition[2] - fromPosition[2]) * easedProgress
      ),
      0.1
    );

    modelRef.current.rotation.x = THREE.MathUtils.lerp(fromRotation[0], toRotation[0], easedProgress);
    modelRef.current.rotation.y = THREE.MathUtils.lerp(fromRotation[1], toRotation[1], easedProgress);
    modelRef.current.rotation.z = THREE.MathUtils.lerp(fromRotation[2], toRotation[2], easedProgress);

    const currentScale = THREE.MathUtils.lerp(fromScale, toScale, easedProgress);
    modelRef.current.scale.setScalar(currentScale);
  });

  return <primitive ref={modelRef} object={scene} />;
}

function Model({ scrollPosition }) {
  try {
    return <ModelComponent scrollPosition={scrollPosition} />;
  } catch(error) {
    console.log('3D Model error:', error);
    return null;
  }
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-sm bg-black bg-opacity-50 p-4 rounded-lg">
        Loading 3D Model... {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function Scene3D({ scrollPosition }) {
  return (
    <Suspense fallback={<Loader />}>
      <ambientLight intensity={1} />
      <directionalLight position={[1000, -1500, 0]} 
        intensity={10} 
        castShadow 
        shadow-mapSize={[512, 512]}
      />
      <Model scrollPosition={scrollPosition} />
    </Suspense>
  );
}