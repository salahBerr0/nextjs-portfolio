'use client';
import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
  Suspense
} from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Html, useProgress, Preload } from '@react-three/drei';
import * as THREE from 'three';
import usePerformanceMonitor from '@/hooks/usePerformanceMonitor';

// Preload the model immediately when component is imported
useGLTF.preload('/gltfmodels/bs3d-draco.glb');
// Immutable config
const SECTION_CONFIG = Object.freeze({
  hero: { position: [0, -0.5, 0], positionLg: [1.5, -0.2, 0], rotation: [0, 0, 0], scale: 11, scaleLg: 15 },
  about: { position: [0.5, 0, 0], positionMd: [0.5, -0.2, 3], positionLg: [1.25, -0.5, 0], rotation: [0, 3, 0], scale: 1 },
  skill: { position: [0, 0.45, 0], rotation: [0, 7, 0], scale: 6 },
  project: { position: [0, -0.5, 0], rotation: [0, 0, 0], scale: 13 },
  experience: { position: [0, 0, 0], rotation: [-0.5, -3, 0], scale: 8 }
});

const SECTIONS = ['hero', 'about', 'skill', 'project', 'experience'];
const TOTAL_SECTIONS = SECTIONS.length;

function Model({ scrollPosition, onLoad }) {
  const { scene } = useGLTF('/gltfmodels/bs3d-draco.glb'); // use optimized model
  const modelRef = useRef();
  const { size } = useThree();

  // Screen config
  const screenConfig = useMemo(() => ({
    isLargeScreen: size.width >= 1007,
    isMediumScreen: size.width >= 768 && size.width < 1007,
  }), [size.width]);

  // Optimize scene
  const optimizedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        child.frustumCulled = true;
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
    return clone;
  }, [scene]);

  // Notify parent when loaded
  useEffect(() => {
    if (onLoad) onLoad();
  }, [onLoad]);

  // Frame update with frame skipping
  const lastScroll = useRef(scrollPosition);
  const tempVec = new THREE.Vector3();
  const tempEuler = new THREE.Euler();

useFrame(() => {
  if (!modelRef.current) return;

  const currentSectionIndex = scrollPosition * (TOTAL_SECTIONS - 1);
  const fromIndex = Math.floor(currentSectionIndex);
  const toIndex = Math.min(fromIndex + 1, TOTAL_SECTIONS - 1);
  const progress = currentSectionIndex - fromIndex;

  const from = SECTION_CONFIG[SECTIONS[fromIndex]];
  const to = SECTION_CONFIG[SECTIONS[toIndex]];

  const eased = progress * progress * (3 - 2 * progress);

  const getVal = (cfg, key) =>
    screenConfig.isLargeScreen
      ? cfg[`${key}Lg`] ?? cfg[key]
      : screenConfig.isMediumScreen
      ? cfg[`${key}Md`] ?? cfg[key]
      : cfg[key];

  const fromPos = getVal(from, 'position');
  const toPos = getVal(to, 'position');
  
  const targetPosition = new THREE.Vector3(
    fromPos[0] + (toPos[0] - fromPos[0]) * eased,
    fromPos[1] + (toPos[1] - fromPos[1]) * eased,
    fromPos[2] + (toPos[2] - fromPos[2]) * eased
  );

  const fromRot = getVal(from, 'rotation');
  const toRot = getVal(to, 'rotation');
  
  const targetRotation = new THREE.Euler(
    fromRot[0] + (toRot[0] - fromRot[0]) * eased,
    fromRot[1] + (toRot[1] - fromRot[1]) * eased,
    fromRot[2] + (toRot[2] - fromRot[2]) * eased
  );

  const fromScale = getVal(from, 'scale');
  const toScale = getVal(to, 'scale');
  const targetScale = fromScale + (toScale - fromScale) * eased;

  // Use direct assignment instead of lerp for precise positioning
  modelRef.current.position.copy(targetPosition);
  modelRef.current.rotation.copy(targetRotation);
  modelRef.current.scale.setScalar(targetScale);
});

  // Cleanup
  useEffect(() => {
    return () => optimizedScene.traverse((child) => {
      if (child.isMesh) {
        child.geometry?.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material?.dispose();
        }
      }
    });
  }, [optimizedScene]);

  return <primitive ref={modelRef} object={optimizedScene} />;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-sm bg-gray-700 bg-opacity-50 p-4 rounded-lg backdrop-blur-sm">
        Loading... {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function Scene3D({ scrollPosition }) {
  const { markResourcesLoaded } = usePerformanceMonitor('Scene3D', {
    warnThreshold: 200,
    errorThreshold: 1000,
    preventDuplicates: true,
  });

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const start = useRef(performance.now());

  const handleModelLoad = useCallback(() => {
    if (!isModelLoaded) {
      const loadTime = performance.now() - start.current;
      console.log(`🎯 Scene3D Model loaded in: ${loadTime.toFixed(2)}ms`);
      markResourcesLoaded?.();
      setIsModelLoaded(true);
    }
  }, [markResourcesLoaded, isModelLoaded]);

  const lights = useMemo(() => (
    <>
      <ambientLight intensity={1} />
      <directionalLight
        position={[1000, -1500, 0]}
        intensity={10}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </>
  ), []);

  // Preload GLTF
  useEffect(() => {
    useGLTF.preload('/gltfmodels/bs3d-draco.glb');
  }, []);

  const memoScroll = useMemo(() => scrollPosition, [scrollPosition]);

  return (
    <Suspense fallback={<Loader />}>
      {lights}
      <Model scrollPosition={memoScroll} onLoad={handleModelLoad} />
      <Preload all />
    </Suspense>
  );
}
