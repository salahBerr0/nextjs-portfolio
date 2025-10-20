'use client';
import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';

// Immutable config with Object.freeze for performance
const SECTION_CONFIG = Object.freeze({
  hero: Object.freeze({
    position: [0, -0.5, 0],
    positionLg: [2.3, -0.2, 0],
    rotation: [0, 0, 0],
    scale: 11,
    scaleLg: 20,
  }),
  about: Object.freeze({
    position: [1, 0.5, 0],
    positionMd: [0.5, 0.2, 3],
    positionLg: [1.25, 0.2, 0],
    rotation: [0, 3, 0],
    scale: 1,
  }),
  skill: Object.freeze({
    position: [0, 0.15, 0],
    positionLg: [0,-0.3, 0],
    rotation: [0, 6, 0],
    scale: 7,
  }),
  project: Object.freeze({
    position: [0, -0.5, 0],
    rotation: [0, 0, 0],
    scale: 13,
  }),
  experience: Object.freeze({
    position: [1.3, 0, 0],
    positionMd: [2, 0, 0],
    positionLg: [2.5, 0, 0],
    rotation: [-0.5, -6, 0],
    rotationLg: [0, -6, 0],
    scale: 8,
    scaleLg: 15,
  }),
});

// Pre-allocate objects to avoid garbage collection
const tempVector = new THREE.Vector3();
const tempEuler = new THREE.Euler();
const tempObject = {};

// Memoized section keys
const SECTIONS = ['hero', 'about', 'skill', 'project', 'experience'];
const TOTAL_SECTIONS = SECTIONS.length;

function ModelComponent({ scrollPosition }) {
  const { scene } = useGLTF('/gltfmodels/bs3d.gltf');
  const modelRef = useRef();
  const { size } = useThree();
  
  // Optimized screen size detection with debouncing
  const screenConfig = useMemo(() => {
    const width = size.width;
    return {
      isLargeScreen: width >= 1007,
      isMediumScreen: width >= 768 && width < 1007,
    };
  }, [size.width]);

  // One-time model optimization
  const optimizedScene = useMemo(() => {
    if (!scene) return null;

    scene.traverse((child) => {
      if (child.isMesh) {
        // Performance optimizations
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = true;
        
        // Material optimizations
        if (child.material) {
          child.material.precision = 'lowp';
          child.material.dithering = false;
          
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.roughness = 1.0;
            child.material.metalness = 0.0;
          }
        }
      }
    });

    return scene;
  }, [scene]);

  // Optimized interpolation function
  const interpolateConfig = useCallback((fromConfig, toConfig, progress, screenConfig) => {
    const getConfigValue = (config, key) => {
      if (screenConfig.isLargeScreen) {
        return config[`${key}Lg`] ?? config[key];
      } else if (screenConfig.isMediumScreen) {
        return config[`${key}Md`] ?? config[key];
      }
      return config[key];
    };

    const easedProgress = THREE.MathUtils.smoothstep(progress, 0, 1);

    // Position
    const fromPos = getConfigValue(fromConfig, 'position');
    const toPos = getConfigValue(toConfig, 'position');
    tempVector.set(
      fromPos[0] + (toPos[0] - fromPos[0]) * easedProgress,
      fromPos[1] + (toPos[1] - fromPos[1]) * easedProgress,
      fromPos[2] + (toPos[2] - fromPos[2]) * easedProgress
    );

    // Rotation
    const fromRot = getConfigValue(fromConfig, 'rotation');
    const toRot = getConfigValue(toConfig, 'rotation');
    tempEuler.set(
      fromRot[0] + (toRot[0] - fromRot[0]) * easedProgress,
      fromRot[1] + (toRot[1] - fromRot[1]) * easedProgress,
      fromRot[2] + (toRot[2] - fromRot[2]) * easedProgress
    );

    // Scale
    const fromScale = getConfigValue(fromConfig, 'scale');
    const toScale = getConfigValue(toConfig, 'scale');
    const scale = fromScale + (toScale - fromScale) * easedProgress;

    return { position: tempVector.clone(), rotation: tempEuler.clone(), scale };
  }, []);

  // Highly optimized frame loop
  useFrame(() => {
    if (!modelRef.current || !optimizedScene) return;
    
    const currentSectionIndex = scrollPosition * (TOTAL_SECTIONS - 1);
    const fromIndex = Math.floor(currentSectionIndex);
    const toIndex = Math.min(fromIndex + 1, TOTAL_SECTIONS - 1);
    const progress = currentSectionIndex - fromIndex;

    const fromSection = SECTIONS[fromIndex];
    const toSection = SECTIONS[toIndex];
    const fromConfig = SECTION_CONFIG[fromSection];
    const toConfig = SECTION_CONFIG[toSection];

    if (!fromConfig || !toConfig) return;

    // Gettting interpolated values
    const { position, rotation, scale } = interpolateConfig(
      fromConfig, 
      toConfig, 
      progress, 
      screenConfig
    );

    // Apply with lerp for smoothness
    modelRef.current.position.lerp(position, 0.1);
    modelRef.current.rotation.copy(rotation);
    modelRef.current.scale.setScalar(scale);
  });

  // Efficient cleanup
  useEffect(() => {
    return () => {
      if (optimizedScene) {
        optimizedScene.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (child.material) {
              Array.isArray(child.material) 
                ? child.material.forEach(m => m.dispose())
                : child.material.dispose();
            }
          }
        });
      }
    };
  }, [optimizedScene]);

  return <primitive ref={modelRef} object={optimizedScene} />;
}

// Memoized model with error boundary
const Model = React.memo(({ scrollPosition }) => {
  try {
    return <ModelComponent scrollPosition={scrollPosition} />;
  } catch (error) {
    console.error('3D Model error:', error);
    return null;
  }
});

Model.displayName = 'Model';

// Optimized loader
function Loader() {
  const { progress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setDisplayProgress(progress), 50);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Html center>
      <div className="text-white text-sm bg-black bg-opacity-50 p-4 rounded-lg backdrop-blur-sm">
        Loading... {Math.round(displayProgress)}%
      </div>
    </Html>
  );
}

// Main scene component
export default function Scene3D({ scrollPosition }) {
  const memoizedScrollPosition = useMemo(() => scrollPosition, [scrollPosition]);

  return (
    <React.Suspense fallback={<Loader />}>
      <ambientLight intensity={1} />
      <directionalLight position={[1000, -1500, 0]} 
        intensity={10} 
        castShadow 
        shadow-mapSize={[512, 512]}
      />
      <Model scrollPosition={memoizedScrollPosition} />
    </React.Suspense>
  );
}