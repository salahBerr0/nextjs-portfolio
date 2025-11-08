// components/PreloadResources.jsx
export default function PreloadResources() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://kit.fontawesome.com" crossOrigin="anonymous" />
      
      {/* Only preload the main model that actually exists */}
      <link 
        rel="preload" 
        href="/gltfmodels/bs3d-draco.glb" 
        as="fetch" 
        crossOrigin="anonymous"
        type="model/gltf-binary"
        fetchPriority="high"
      />
    </>
  );
}