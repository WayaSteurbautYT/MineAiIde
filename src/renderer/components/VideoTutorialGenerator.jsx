import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {Html} from '@react-three/drei';
import * as THREE from 'three';
import { useSpring } from '@react-spring/three';
import axios from 'axios';

const VideoTutorialGenerator = () => {
  const [tutorialSteps, setTutorialSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceNarration, setVoiceNarration] = useState('');
  const [imagePaths, setImagePaths] = useState([]);
  const [aiPersona, setAiPersona] = useState(null);
  const [isAutoTutorial, setIsAutoTutorial] = useState(false);

  // Initialize tutorial flow with AI persona integration
  useEffect(() => {
    const initialSteps = [
      {
        step: 1,
        title: 'Welcome to Minecraft Block IDE',
        description: `Create custom blocks with ${aiPersona?.personality || 'intuitive AI guidance'}`,
        action: 'Create your first block',
        tip: 'Drag a grass block from the palette to the scene',
      },
      {
        step: 2,
        title: 'Texture Painting',
        description: 'Apply textures to your blocks using AI-guided tools',
        action: 'Paint your block surface',
        tip: 'Select a texture and brush size to customize',
      },
      {
        step: 3,
        title: 'Animation Timeline',
        description: 'Bring your blocks to life with motion',
        action: 'Add keyframes to your animation',
        tip: 'Use the timeline to control movement and rotation',
      },
      {
        step: 4,
        title: 'Export & Share',
        description: 'Package your creation for different platforms',
        action: 'Build your project for Windows/Mac/Linux',
        tip: 'Click export when ready to generate installers',
      }
    ];
    
    setTutorialSteps(initialSteps);
  }, [aiPersona]);

  // Load AI persona from user data
  useEffect(() => {
    const loadAiPersona = async () => {
      const samplePersona = {
        name: 'Your AI Assistant',
        style: 'helpful',
        voice: 'calm and supportive',
        preferences: {
          complexity: 'beginner-friendly',
          tone: 'warm and motivating'
        }
      };
      setAiPersona(samplePersona);
    };
    loadAiPersona();
  }, []);

  // Generate personalized AI response
  const generatePersonalizedResponse = async (title, description) => {
    const persona = aiPersona;
    if (!persona) return 'Welcome to your AI-powered Minecraft Block IDE!';
    
    const responses = {
      'Welcome to Minecraft Block IDE': 
        `Welcome ${persona.name}! ${persona.preferences.tone.toLowerCase()} ${persona.style} AI here to help you create amazing blocks. Let's dive in together!`,
      'Texture Painting': 
        `Now let's paint your block surfaces. Choose textures that match your creative vision. ${persona.name} suggests starting with grass for natural-looking blocks.`,
      'Animation Timeline': 
        `Time to animate! Add keyframes to bring your blocks to life. ${persona.name} recommends trying simple movements first - maybe a gentle bounce?`,
      'Export & Share': 
        `Finally, let's export your creation. ${persona.name} is excited to see you share your work! Click build to generate installers for Windows, Mac, or Linux platforms.`,
    };
    
    return responses[title] || 
      `Ready for the next step in your creative journey with ${persona.name}?`;
  };

  // Mock image generation
  const generateMockImage = async (action) => {
    const mockImages = {
      'Create your first block': '/images/block-creation.png',
      'Paint your block surface': '/images/texture-painting.png',
      'Add keyframes to your animation': '/images/animation-timeline.png',
      'Build your project for Windows/Mac/Linux': '/images/export-dialog.png',
    };
    
    return mockImages[action] || '/images/default-tutorial.png';
  };

  // Generate tutorial flow
  const generateTutorial = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    const steps = [...tutorialSteps];
    
    try {
      for (let i = currentStep; i < steps.length; i++) {
        const step = steps[i];
        
        const aiDescription = await generatePersonalizedResponse(step.title, step.description);
        setVoiceNarration(aiDescription);
        
        const imagePath = await generateMockImage(step.action);
        setImagePaths(prev => [...prev, imagePath]);
        
        setCurrentStep(i + 1);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      const finalMessage = `Your Minecraft IDE journey is complete! ${aiPersona?.style.toLowerCase() === 'warm' ? 'Let\'s create amazing things together!' : 'Build something incredible!'}`;
      setVoiceNarration(finalMessage);
      
    } catch (error) {
      console.error('Tutorial generation failed:', error);
      setVoiceNarration('Tutorial generation encountered an error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // UI controllers
  const toggleTutorial = () => {
    if (!isGenerating) {
      generateTutorial();
    }
  };

  // Render tutorial content
  const tutorialContent = () => {
    if (currentStep >= tutorialSteps.length) {
      return (
        <div style={{ 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: '10px',
          borderRadius: '5px',
          color: 'white',
          textAlign: 'center'
        }}>
          Complete! Ready to build your masterpiece with {aiPersona?.name || 'your AI assistant'}!
        </div>
      );
    }
    
    const step = tutorialSteps[currentStep];
    return (
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        padding: '15px',
        borderRadius: '5px',
        color: 'white',
        marginTop: '20px'
      }}>
        <h4>{step.title}</h4>
        <p>{step.description}</p>
        <p style={{ fontStyle: 'italic', marginTop: '5px' }}>{step.tip}</p>
        <p style={{ marginTop: '10px', fontSize: '1.2em' }}>{step.action}</p>
      </div>
    );
  };

  // 3D scene rendering
  const tutorialScene = () => {
    const step = tutorialSteps[currentStep] || {};
    
    return (
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        
        {imagePaths[currentStep] && (
          <Html position={[0, 1.5, 0]}>
            <img 
              src={imagePaths[currentStep]} 
              style={{ 
                width: '300px', 
                height: 'auto',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)'
              }} 
            />
          </Html>
        )}
        
        <Html position={[0, 1, 0]}>
          <div style={{ 
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '8px',
            borderRadius: '3px',
            color: 'white',
            textAlign: 'center'
          }}>
            {step.action}
          </div>
        </Html>
      </Canvas>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '10px' }}>
      <div style={{ 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        padding: '10px',
        borderBottom: '1px solid #4CAF50',
        color: 'white'
      }}>
        <h2 style={{ color: '#FFD700', textAlign: 'center' }}>Video Tutorial System</h2>
        
        <div style={{ 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          padding: '8px',
          borderRadius: '4px',
          marginBottom: '10px',
          border: '1px solid #4CAF50'
        }}>
          <strong>AI Personality:</strong> {aiPersona?.name || 'Not loaded'}
          <button 
            onClick={() => console.log('Configure AI personality')}
            style={{
              backgroundColor: '#555',
              color: 'white',
              border: 'none',
              padding: '3px 6px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {aiPersona ? 'Edit' : 'Load'}
          </button>
        </div>
        
        <button 
          onClick={toggleTutorial}
          disabled={isGenerating}
          style={{
            backgroundColor: isGenerating ? '#555' : '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            marginBottom: '10px'
          }}
        >
          {isGenerating ? 'Generating Tutorial...' : 'Start AI Tutorial'}
        </button>
        
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '10px'
        }}>
          <label style={{ color: 'white' }}>
            Tutorial Style: 
            <select 
              value={aiPersona?.style || 'helpful'}
              onChange={(e) => setAiPersona(prev => ({...prev, style: e.target.value}))}
              style={{
                backgroundColor: '#555', 
                color: 'white', 
                border: 'none', 
                padding: '3px 5px',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              <option value="helpful">Helpful</option>
              <option value="warm">Warm</option>
              <option value="encouraging">Encouraging</option>
              <option value="technical">Technical</option>
            </select>
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
            {isAutoTutorial ? 'Pause Tutorial' : 'AI Voice'}
          </button>
        </div>
      </div>

      <Canvas 
        camera={{ position: [0, 1, 5], fov: 50 }}
        style={{ flex: 1 }}
      >
        {tutorialScene()}
        
        {voiceNarration && (
          <Html position={[0, 0.5, 0]}>
            <div style={{ 
              backgroundColor: 'rgba(0,0,0,0.7)', 
              padding: '8px',
              borderRadius: '3px',
              color: '#4CAF50',
              fontSize: '14px',
              textAlign: 'center',
              borderLeft: `4px solid ${aiPersona?.style === 'warm' ? '#FFD700' : '#2196F3'}`
            }}>
              {voiceNarration}
            </div>
          </Html>
        )}
        
        {tutorialContent()}
      </Canvas>
    </div>
  );
};

export default VideoTutorialGenerator;