'use client';
import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Suspense } from 'react';
import { Html, useProgress } from '@react-three/drei';

const SECTION_CONFIG = {
  hero: {
    position: [0, -0.75, 0],
    positionLg: [3, -0.2, 0],
    rotation: [0, 0, 0],
    rotationLg: [0, 0, 0],
    scale: 20,
    scaleLg: 33,
  },
  about: {
    position: [2, 0.5, 0],
    positionLg: [3, 0.5, 0],
    rotation: [0, Math.PI / 5, 0],
    rotationLg: [0, Math.PI / 5, 0],
    scale: 1,
    scaleLg: 1,
  },
  skill: {
    position: [-1.5, 1, 0],
    positionLg: [0.5, 1, 0],
    rotation: [0, -Math.PI / 4, 0],
    rotationLg: [0, -Math.PI / 4, 0],
    scale: 0.8,
    scaleLg: 1.0,
  },
  project: {
    position: [2.5, -1, 0],
    positionLg: [4.5, -1, 0],
    rotation: [0, Math.PI / 3, 0],
    rotationLg: [0, Math.PI / 3, 0],
    scale: 0.85,
    scaleLg: 1.0,
  },
  experience: {
    position: [0, 0, 0],
    positionLg: [2, 0, 0],
    rotation: [0, 0, 0],
    rotationLg: [0, 0, 0],
    scale: 1,
    scaleLg: 1.2,
  }
};

function Model({ scrollPosition }) {
    try {
//RUN FIRST (DECLARATIONS):
    const { scene } = useGLTF('/gltfmodels/bs3d.gltf');
    const modelRef = useRef();
    const { size } = useThree();
    
    // Memoize calculations for performance
    const sectionData = useMemo(() => {
        const sections = Object.keys(SECTION_CONFIG);
        const totalSections = sections.length;
        return { sections, totalSections };
    }, []);

    // Check if screen is large
    const isLargeScreen = size.width >= 1007;

//RUN FORTH (USEFRAME()):
    useFrame(() => {
        if (!modelRef.current) return;
        const { sections, totalSections } = sectionData;
        
        // Calculate current section based on scroll
        const currentSectionIndex = scrollPosition * (totalSections - 1);
        const fromIndex = Math.floor(currentSectionIndex);
        const toIndex = Math.min(fromIndex + 1, totalSections - 1);
        const progress = currentSectionIndex - fromIndex;

        // Get configurations
        const fromSection = sections[fromIndex];
        const toSection = sections[toIndex];
        const fromConfig = SECTION_CONFIG[fromSection];
        const toConfig = SECTION_CONFIG[toSection];

        // Choose the appropriate values based on screen size
        const fromPosition = isLargeScreen ? (fromConfig.positionLg || fromConfig.position) : fromConfig.position;
        const toPosition = isLargeScreen ? (toConfig.positionLg || toConfig.position) : toConfig.position;
        const fromRotation = isLargeScreen ? (fromConfig.rotationLg || fromConfig.rotation) : fromConfig.rotation;
        const toRotation = isLargeScreen ? (toConfig.rotationLg || toConfig.rotation) : toConfig.rotation;
        const fromScale = isLargeScreen ? (fromConfig.scaleLg || fromConfig.scale) : fromConfig.scale;
        const toScale = isLargeScreen ? (toConfig.scaleLg || toConfig.scale) : toConfig.scale;

        // Smooth interpolation
        const easedProgress = THREE.MathUtils.smoothstep(progress, 0, 1);

        // Position interpolation
        modelRef.current.position.lerp(
            new THREE.Vector3(
                fromPosition[0] + (toPosition[0] - fromPosition[0]) * easedProgress,
                fromPosition[1] + (toPosition[1] - fromPosition[1]) * easedProgress,
                fromPosition[2] + (toPosition[2] - fromPosition[2]) * easedProgress
            ),
            0.1 // Smoothing factor
        );

        // Rotation interpolation
        modelRef.current.rotation.x = THREE.MathUtils.lerp(fromRotation[0], toRotation[0], easedProgress);
        modelRef.current.rotation.y = THREE.MathUtils.lerp(fromRotation[1], toRotation[1], easedProgress);
        modelRef.current.rotation.z = THREE.MathUtils.lerp(fromRotation[2], toRotation[2], easedProgress);

        // Scale interpolation - using the screen-size appropriate scale values
        const currentScale = THREE.MathUtils.lerp(fromScale, toScale, easedProgress);
        modelRef.current.scale.setScalar(currentScale);
    });



//RUN SECOND(USEEFFECT()):
    useEffect(() => {
        // Optimize the model on load
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



//RUN THIRD(PRIMITIVE):
    return <primitive ref={modelRef} object={scene} />;
    } catch(error){
        console.log('3D Model error:', error);
        return null;
    }
}

// Preload the model
useGLTF.preload('/gltfmodels/bs3d.gltf');

function Loader() {
  const { progress } = useProgress();
  return (<Html center><div className="text-white text-sm bg-black bg-opacity-50 p-4 rounded-lg">Loading 3D Model... {Math.round(progress)}%</div></Html>);
}

export default function Scene3D({ scrollPosition }) {
  const { gl } = useThree();

  // Performance optimizations
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return (
    <Suspense fallback={<Loader />}>
        <ambientLight intensity={1} />
        <directionalLight position={[1000, -1500, 0]} intensity={10} castShadow shadow-mapSize={[512, 512]}/>
        <Model scrollPosition={scrollPosition} />
    </Suspense>
  );
}