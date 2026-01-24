import React, { useState } from 'react';
import { 
  Box, 
  Palette, 
  Code, 
  Package, 
  Download, 
  Upload,
  Settings,
  Sparkles,
  Hammer
} from 'lucide-react';
import '../styles/color-swatch.css';

export const MinecraftTools: React.FC = () => {
  const [activeTool, setActiveTool] = useState('blockbench');

  const tools = [
    {
      id: 'blockbench',
      name: 'Blockbench',
      icon: Box,
      description: '3D modeling and texturing for Minecraft',
      features: ['Block models', 'Item models', 'Entity models', 'Texture creation']
    },
    {
      id: 'mcreator',
      name: 'MCreator',
      icon: Sparkles,
      description: 'Visual modding without coding',
      features: ['Drag & drop interface', 'Procedure system', 'GUI designer', 'No coding required']
    },
    {
      id: 'texturepack',
      name: 'Texture Tools',
      icon: Palette,
      description: 'Create and edit textures',
      features: ['Texture editor', 'Color schemes', 'Texture templates', 'Export tools']
    },
    {
      id: 'buildtools',
      name: 'Build Tools',
      icon: Hammer,
      description: 'Build and package your mods',
      features: ['Gradle integration', 'Build automation', 'Package management', 'Deployment']
    }
  ];

  const renderToolContent = () => {
    switch (activeTool) {
      case 'blockbench':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Box className="w-5 h-5 text-blue-500" />
                <span>Blockbench Integration</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Model Library</h4>
                  <p className="text-sm text-slate-400 mb-3">Browse and import existing models</p>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                    Browse Models
                  </button>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Texture Templates</h4>
                  <p className="text-sm text-slate-400 mb-3">Pre-made texture templates</p>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors">
                    View Templates
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-600 pt-4">
                <h4 className="font-medium mb-3">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                    <Upload className="w-4 h-4 inline mr-1" />
                    Import Model
                  </button>
                  <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                    <Download className="w-4 h-4 inline mr-1" />
                    Export Model
                  </button>
                  <button className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors">
                    <Settings className="w-4 h-4 inline mr-1" />
                    Model Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mcreator':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>MCreator Workspace</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🧱</div>
                  <h4 className="font-medium">Blocks</h4>
                  <p className="text-sm text-slate-400">Create custom blocks</p>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">⚔️</div>
                  <h4 className="font-medium">Items</h4>
                  <p className="text-sm text-slate-400">Design custom items</p>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👾</div>
                  <h4 className="font-medium">Entities</h4>
                  <p className="text-sm text-slate-400">Add new entities</p>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-medium mb-3">Procedure Builder</h4>
                <div className="bg-slate-800 rounded p-3 text-sm text-slate-400">
                  <p>Drag and drop interface to create mod logic without writing code</p>
                  <button className="mt-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors">
                    Open Procedure Builder
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'texturepack':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Palette className="w-5 h-5 text-green-500" />
                <span>Texture Editor</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Color Palette</h4>
                  <div className="grid grid-cols-8 gap-1 mb-4">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded color-swatch"
                      />
                    ))}
                  </div>
                  <button className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors">
                    Create Custom Palette
                  </button>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Texture Templates</h4>
                  <div className="space-y-2">
                    {['Block Texture 16x16', 'Item Texture 16x16', 'Entity Texture 64x32', 'GUI Element'].map((template) => (
                      <div key={template} className="flex items-center justify-between bg-slate-700 rounded p-2">
                        <span className="text-sm">{template}</span>
                        <button className="px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs transition-colors">
                          Use
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'buildtools':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Hammer className="w-5 h-5 text-orange-500" />
                <span>Build & Deploy</span>
              </h3>
              
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Build Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Build Type</span>
                      <select className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm" aria-label="Build Type">
                        <option>Development</option>
                        <option>Production</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Target Version</span>
                      <select className="px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white text-sm" aria-label="Target Version">
                        <option>1.20.1</option>
                        <option>1.19.4</option>
                        <option>1.18.2</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Build Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors">
                      <Code className="w-4 h-4 inline mr-1" />
                      Build Mod
                    </button>
                    <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors">
                      <Package className="w-4 h-4 inline mr-1" />
                      Package JAR
                    </button>
                    <button className="px-3 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm transition-colors">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Deploy to Server
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-800 rounded-t-lg p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-blue-500" />
          <h2 className="text-lg font-semibold">Minecraft Tools</h2>
        </div>
      </div>

      {/* Tool Selection */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="flex space-x-1 p-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                ${
                  activeTool === tool.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }
              `}
            >
              <tool.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tool Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
        {renderToolContent()}
      </div>

      {/* Tool Info Footer */}
      <div className="bg-slate-800 rounded-b-lg p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">{tools.find(t => t.id === activeTool)?.name}</h4>
            <p className="text-sm text-slate-400">
              {tools.find(t => t.id === activeTool)?.description}
            </p>
          </div>
          <div className="flex space-x-2">
            {tools.find(t => t.id === activeTool)?.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
