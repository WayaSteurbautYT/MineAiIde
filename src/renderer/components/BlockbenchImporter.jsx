import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const BlockbenchImporter = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Simple placeholder for 3D model preview
    const sky = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: 0x87ceeb })
    );
    sky.rotation.x = -Math.PI / 2;
    containerRef.current.add(sky);

    // Add some basic objects
    const model = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xffd700 })
    );
    model.position.set(0, 0.5, 0);
    containerRef.current.add(model);

    // Simple camera orbit controls
    const camera = containerRef.current.scene.camera;
    camera.position.set(0, 1, 5);
    camera.lookAt(0, 0.5, 0);

    return () => {
      // Cleanup
      containerRef.current.remove(sky);
      containerRef.current.remove(model);
    };
  }, []);

  return (
    <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Html position={[0, 1.5, 0]}>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', borderRadius: '5px' }}>
          <h3>Minecraft Block IDE</h3>
          <p>Drag & drop blocks to create custom items</p>
        </div>
      </Html>
    </Canvas>
  );
};

export default BlockbenchImporter;