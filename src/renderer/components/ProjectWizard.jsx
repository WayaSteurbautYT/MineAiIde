/**
 * MineAI IDE - Project Wizard Component
 * Step-by-step wizard for creating new Minecraft mod projects
 */

import React, { useState } from 'react';
import { 
  ChevronRight, ChevronLeft, Check, Box, Hammer, Server, 
  Package, FileCode, Palette, Layers, Zap, Sparkles,
  FolderOpen, Github, AlertCircle
} from 'lucide-react';

// Project type configurations
const PROJECT_TYPES = [
  {
    id: 'forge',
    name: 'Forge Mod',
    description: 'Classic modding with Minecraft Forge',
    icon: Hammer,
    color: 'from-orange-500 to-red-600',
    popular: true
  },
  {
    id: 'fabric',
    name: 'Fabric Mod',
    description: 'Lightweight and modern modding',
    icon: Zap,
    color: 'from-blue-500 to-cyan-600',
    popular: true
  },
  {
    id: 'neoforge',
    name: 'NeoForge Mod',
    description: 'Next-gen Forge for modern Minecraft',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600',
    new: true
  },
  {
    id: 'spigot',
    name: 'Spigot Plugin',
    description: 'Server plugins for Spigot/Bukkit',
    icon: Server,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'paper',
    name: 'Paper Plugin',
    description: 'High-performance Paper server plugins',
    icon: Server,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'datapack',
    name: 'Datapack',
    description: 'Vanilla datapacks with functions',
    icon: FileCode,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'resourcepack',
    name: 'Resource Pack',
    description: 'Textures, models, and sounds',
    icon: Palette,
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'modpack',
    name: 'Modpack',
    description: 'Curated mod collections',
    icon: Layers,
    color: 'from-indigo-500 to-violet-600'
  }
];

// Minecraft versions by type
const MC_VERSIONS = {
  forge: ['1.20.4', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.16.5', '1.12.2'],
  fabric: ['1.20.4', '1.20.1', '1.19.4', '1.19.2', '1.18.2', '1.17.1', '1.16.5'],
  neoforge: ['1.21', '1.20.4', '1.20.1'],
  spigot: ['1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.16.5', '1.12.2', '1.8.8'],
  paper: ['1.20.4', '1.20.1', '1.19.4'],
  datapack: ['1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.17.1', '1.16.5'],
  resourcepack: ['1.20.4', '1.20.1', '1.19.4', '1.18.2', '1.16.5'],
  modpack: ['1.20.4', '1.20.1', '1.19.2', '1.18.2', '1.16.5', '1.12.2']
};

// Optional features
const FEATURES = [
  { id: 'geckolib', name: 'GeckoLib', description: 'Advanced entity animations', types: ['forge', 'fabric', 'neoforge'] },
  { id: 'config', name: 'Config System', description: 'User-configurable settings', types: ['forge', 'fabric', 'neoforge', 'spigot', 'paper'] },
  { id: 'networking', name: 'Networking', description: 'Client-server communication', types: ['forge', 'fabric', 'neoforge'] },
  { id: 'commands', name: 'Commands', description: 'Custom command framework', types: ['spigot', 'paper', 'datapack'] },
  { id: 'gui', name: 'Custom GUIs', description: 'Inventory-based interfaces', types: ['forge', 'fabric', 'neoforge', 'spigot', 'paper'] },
  { id: 'worldgen', name: 'World Generation', description: 'Custom biomes and structures', types: ['forge', 'fabric', 'neoforge', 'datapack'] },
  { id: 'reieijei', name: 'REI/JEI Support', description: 'Recipe viewer integration', types: ['forge', 'fabric', 'neoforge'] },
  { id: 'permissions', name: 'Permissions', description: 'Permission system integration', types: ['spigot', 'paper'] }
];

const ProjectWizard = ({ onClose, onProjectCreated }) => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    type: '',
    mcVersion: '',
    modId: '',
    author: '',
    description: '',
    features: [],
    initGit: true,
    location: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = 4;

  // Update project data
  const updateData = (key, value) => {
    setProjectData(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  // Toggle feature
  const toggleFeature = (featureId) => {
    setProjectData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  // Get available features for current type
  const getAvailableFeatures = () => {
    return FEATURES.filter(f => f.types.includes(projectData.type));
  };

  // Validate current step
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!projectData.type) {
          setError('Please select a project type');
          return false;
        }
        break;
      case 2:
        if (!projectData.name.trim()) {
          setError('Please enter a project name');
          return false;
        }
        if (!projectData.mcVersion) {
          setError('Please select a Minecraft version');
          return false;
        }
        break;
    }
    return true;
  };

  // Navigate steps
  const nextStep = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    setError('');
  };

  // Create project
  const createProject = async () => {
    if (!validateStep()) return;

    setIsCreating(true);
    setError('');

    try {
      // Call the electron API to create the project
      if (window.electronAPI?.createProject) {
        const result = await window.electronAPI.createProject(projectData);
        if (result.success) {
          onProjectCreated?.(result);
          onClose?.();
        } else {
          setError(result.error || 'Failed to create project');
        }
      } else {
        // For development/preview, simulate success
        console.log('Creating project:', projectData);
        setTimeout(() => {
          onProjectCreated?.({ success: true, ...projectData });
          onClose?.();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  // Render project type selection (Step 1)
  const renderTypeSelection = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">Choose Project Type</h2>
      <p className="text-slate-400 text-sm mb-6">What kind of Minecraft project do you want to create?</p>
      
      <div className="grid grid-cols-2 gap-3">
        {PROJECT_TYPES.map(type => {
          const Icon = type.icon;
          const isSelected = projectData.type === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => updateData('type', type.id)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                isSelected 
                  ? 'border-indigo-500 bg-indigo-500/10' 
                  : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
              }`}
            >
              {type.popular && (
                <span className="absolute top-2 right-2 text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-medium">
                  Popular
                </span>
              )}
              {type.new && (
                <span className="absolute top-2 right-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full font-medium">
                  New
                </span>
              )}
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white">{type.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{type.description}</p>
              {isSelected && (
                <div className="absolute top-2 left-2">
                  <Check size={16} className="text-indigo-400" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Render project details (Step 2)
  const renderProjectDetails = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">Project Details</h2>
      <p className="text-slate-400 text-sm mb-6">Configure your {PROJECT_TYPES.find(t => t.id === projectData.type)?.name || 'project'}</p>
      
      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Project Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={projectData.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="My Awesome Mod"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Mod ID */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Mod ID <span className="text-slate-500">(auto-generated if empty)</span>
          </label>
          <input
            type="text"
            value={projectData.modId}
            onChange={(e) => updateData('modId', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
            placeholder={projectData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'my_awesome_mod'}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Minecraft Version */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Minecraft Version <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {MC_VERSIONS[projectData.type]?.map(version => (
              <button
                key={version}
                onClick={() => updateData('mcVersion', version)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  projectData.mcVersion === version
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {version}
              </button>
            ))}
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Author Name
          </label>
          <input
            type="text"
            value={projectData.author}
            onChange={(e) => updateData('author', e.target.value)}
            placeholder="Your name or username"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            value={projectData.description}
            onChange={(e) => updateData('description', e.target.value)}
            placeholder="A brief description of your project..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
          />
        </div>
      </div>
    </div>
  );

  // Render feature selection (Step 3)
  const renderFeatureSelection = () => {
    const availableFeatures = getAvailableFeatures();
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-2">Add Features</h2>
        <p className="text-slate-400 text-sm mb-6">
          Select optional features to include in your project
          <span className="text-slate-500"> (you can add more later)</span>
        </p>
        
        {availableFeatures.length > 0 ? (
          <div className="space-y-2">
            {availableFeatures.map(feature => (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                  projectData.features.includes(feature.id)
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  projectData.features.includes(feature.id)
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-slate-600'
                }`}>
                  {projectData.features.includes(feature.id) && (
                    <Check size={12} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{feature.name}</h3>
                  <p className="text-xs text-slate-400">{feature.description}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Package size={32} className="mx-auto mb-2 opacity-50" />
            <p>No optional features available for this project type</p>
          </div>
        )}

        {/* Git initialization */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => updateData('initGit', !projectData.initGit)}
            className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
              projectData.initGit
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              projectData.initGit
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-slate-600'
            }`}>
              {projectData.initGit && (
                <Check size={12} className="text-white" />
              )}
            </div>
            <Github size={20} className="text-slate-400" />
            <div className="flex-1">
              <h3 className="font-medium text-white">Initialize Git Repository</h3>
              <p className="text-xs text-slate-400">Enable version control for your project</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  // Render summary (Step 4)
  const renderSummary = () => {
    const selectedType = PROJECT_TYPES.find(t => t.id === projectData.type);
    const TypeIcon = selectedType?.icon || Box;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-2">Ready to Create!</h2>
        <p className="text-slate-400 text-sm mb-6">Review your project settings before creating</p>
        
        <div className="bg-slate-800/50 rounded-xl p-6 space-y-4">
          {/* Project header */}
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedType?.color || 'from-slate-500 to-slate-600'} flex items-center justify-center`}>
              <TypeIcon size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{projectData.name || 'Untitled Project'}</h3>
              <p className="text-sm text-slate-400">{selectedType?.name} • Minecraft {projectData.mcVersion}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Mod ID</p>
              <p className="text-white font-mono text-sm">
                {projectData.modId || projectData.name.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'untitled'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Author</p>
              <p className="text-white text-sm">{projectData.author || 'Not specified'}</p>
            </div>
            {projectData.description && (
              <div className="col-span-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Description</p>
                <p className="text-white text-sm">{projectData.description}</p>
              </div>
            )}
          </div>

          {/* Features */}
          {projectData.features.length > 0 && (
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {projectData.features.map(featureId => {
                  const feature = FEATURES.find(f => f.id === featureId);
                  return (
                    <span key={featureId} className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                      {feature?.name || featureId}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Git */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
            <Github size={16} className={projectData.initGit ? 'text-emerald-400' : 'text-slate-500'} />
            <span className={`text-sm ${projectData.initGit ? 'text-emerald-400' : 'text-slate-500'}`}>
              {projectData.initGit ? 'Git repository will be initialized' : 'No Git repository'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 1: return renderTypeSelection();
      case 2: return renderProjectDetails();
      case 3: return renderFeatureSelection();
      case 4: return renderSummary();
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Box className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Create New Project</h1>
                <p className="text-xs text-slate-400">Step {step} of {totalSteps}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i < step ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
          
          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between">
          <button
            onClick={step === 1 ? onClose : prevStep}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={createProject}
              disabled={isCreating}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Create Project
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;