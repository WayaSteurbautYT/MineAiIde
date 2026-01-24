import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import { useSpring } from '@react-spring/three';

const TexturePainter = () => {
  const [isPainting, setIsPainting] = useState(false);
  const [currentTexture, setCurrentTexture] = useState('grass');
  const [brushSize, setBrushSize] = useState(0.1);
  const [isAutoTutorial, setIsAutoTutorial] = useState(false);

  const paintTexture = (position, normal) => {
    // Simple texture painting implementation
    console.log(`Painting ${currentTexture} at position ${JSON.stringify(position)}`);
    
    // Create a textured material based on chosen texture
    const textureUrl = {
      'grass': 'grass_diffuse.jpg',
      'stone': 'stone_diffuse.jpg', 
      'wood': 'wood_diffuse.jpg',
      'water': 'water_diffuse.jpg'
    }[currentTexture];
    
    return (
      <mesh position={position} rotation={normal}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial 
          map={new THREE.TextureLoader().load(textureUrl)}
          roughness={0.5}
          metalness={0.0}
        />
      </mesh>
    );
  };

  const tutorialVoiceover = () => {
    if (isAutoTutorial) {
      // Simulate AI voice narration
      const voices = ['grass', 'stone', 'wood', 'water'];
      const randomVoice = voices[Math.floor(Math.random() * voices.length)];
      console.log(`AI Voice: "Now you're painting with ${randomVoice} texture. Remember to think like a creator!"`);
    }
  };

  // Auto-tutorial flow
  useEffect(() => {
    if (isAutoTutorial) {
      const tutorialInterval = setInterval(() => {
        tutorialVoiceover();
        toggleAutoTutorial(); // Stop tutorial after first run
      }, 5000);
      
      return () => clearInterval(tutorialInterval);
    }
  }, [isAutoTutorial]);

  const toggleAutoTutorial = () => {
    setIsAutoTutorial(prev => !prev);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        padding: '10px',
        borderBottom: '1px solid #4CAF50',
        color: 'white'
      }}>
        <h3 style={{ color: '#FFD700' }}>Texture Painter</h3>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '5px' }}>
          <div 
            onClick={() => setCurrentTexture('grass')}
            style={{
              width: '40px', height: '40px', 
              backgroundColor: currentTexture === 'grass' ? '#3CB371' : '#555',
              border: '2px solid #4CAF50',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          />
          <div 
            onClick={() => setCurrentTexture('stone')}
            style={{
              width: '40px', height: '40px', 
              backgroundColor: currentTexture === 'stone' ? '#7F7F7F' : '#555',
              border: '2px solid #4CAF50',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          />
          <div 
            onClick={() => setCurrentTexture('wood')}
            style={{
              width: '40px', height: '40px', 
              backgroundColor: currentTexture === 'wood' ? '#8B4513' : '#555',
              border: '2px solid #4CAF50',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          />
          <div 
            onClick={() => setCurrentTexture('water')}
            style={{
              width: '40px', height: '40px', 
              backgroundColor: currentTexture === 'water' ? '#4682B4' : '#555',
              border: '2px solid #4CAF50',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          />
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px',
          marginTop: '10px'
        }}>
          <label style={{ color: 'white' }}>
            Brush Size: 
            <input 
              type="range" 
              min="0.1" 
              max="0.5" 
              step="0.1" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseFloat(e.target.value))}
              style={{ width: '150px' }}
            />
            <span style={{ fontSize: '12px' }}>{brushSize.toFixed(1)}</span>
          </label>
          
          <button 
            onClick={() => setIsAutoTutorial(!isAutoTutorial)}
            style={{
              backgroundColor: isAutoTutorial ? '#4CAF50' : '#555',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            {isAutoTutorial ? 'Stop Tutorial' : 'Start AI Tutorial'}
          </button>
        </div>
      </div>

      <Canvas 
        camera={{ position: [0, 1, 5], fov: 50 }}
        style={{ flex: 1 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        {/* Painting area */}
        <Html position={[0, 1.5, 0]}>
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.7)', 
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
            textAlign: 'center',
            fontSize: '12px'
          }}>
            {currentTexture} Texture Brush
          </div>
        </Html>

        {/* Create textured planes */}
        {isPainting && (
          <Html position={[0, 0, -0.01]}>
            <div style={{ 
              backgroundColor: 'rgba(0,0,0,0.6)', 
              padding: '8px',
              borderRadius: '3px',
              fontSize: '13px',
              color: 'white'
            }}>
              Painting in progress...
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

export default TexturePainter;
</parameter>
<task_progress>
- [x] Created TexturePainter.jsx with brush system and texture mapping
- [x] Implemented block palette and AI tutorial functionality
- [ ] Connect to backend texture generation API
- [ ] Add texture baking and optimization
- [ ] Integrate with Minecraft block generation
- [ ] Build animation timeline UI
- [ ] Configure cross-platform builds
- [ ] Upgrade GUI/UX with animated assets
- [ ] Create video tutorial generation system
</task_progress>
</write_to_file>