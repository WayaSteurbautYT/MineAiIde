import React, { useState } from 'react';
import { Settings as SettingsIcon, Monitor, Cpu, HardDrive, GitBranch, Shield, Palette, Zap, X } from 'lucide-react';

const Settings = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    theme: 'dark',
    font: 'JetBrains Mono',
    fontSize: 14,
    autoSave: true,
    aiEnabled: true,
    legacyMode: true,
    aiProvider: 'openrouter',
    minecraftVersion: '1.20.1',
    buildOptimization: true,
    localModels: true,
    externalTools: true,
    wifiMonitoring: false
  });

  if (!isOpen) return null;

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'editor', label: 'Editor', icon: Monitor },
    { id: 'ai', label: 'AI Assistant', icon: Zap },
    { id: 'performance', label: 'Performance', icon: Cpu },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl h-[600px] flex overflow-hidden shadow-2xl shadow-black/30">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-r border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-6 p-2">
            <SettingsIcon className="text-indigo-400" size={20} />
            <h2 className="font-bold text-lg text-slate-100">Settings</h2>
          </div>
          
          <div className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon size={16} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-700 p-6 bg-slate-800/30">
            <div>
              <h3 className="font-bold text-xl text-slate-100">
                {sections.find(s => s.id === activeSection)?.label} Settings
              </h3>
              <p className="text-slate-400 text-sm">Configure your IDE preferences</p>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Project Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">Auto Save</span>
                        <p className="text-slate-500 text-xs">Automatically save your work</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.autoSave}
                        onChange={(checked) => handleSettingChange('autoSave', checked)}
                        color="indigo"
                      />
                    </div>
                    
                    <div>
                      <label className="text-slate-300 text-sm font-medium block mb-2">Minecraft Version</label>
                      <select 
                        value={settings.minecraftVersion}
                        onChange={(e) => handleSettingChange('minecraftVersion', e.target.value)}
                        className="bg-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm w-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="1.20.1">1.20.1</option>
                        <option value="1.19.4">1.19.4</option>
                        <option value="1.18.2">1.18.2</option>
                        <option value="1.17.1">1.17.1</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Settings */}
            {activeSection === 'ai' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">AI Assistant</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">Enable AI Assistant</span>
                        <p className="text-slate-500 text-xs">Use AI for code generation</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.aiEnabled}
                        onChange={(checked) => handleSettingChange('aiEnabled', checked)}
                        color="indigo"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">Local AI Models</span>
                        <p className="text-slate-500 text-xs">Use offline models for privacy</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.localModels}
                        onChange={(checked) => handleSettingChange('localModels', checked)}
                        color="green"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 text-sm font-medium block mb-2">AI Provider</label>
                      <select 
                        value={settings.aiProvider}
                        onChange={(e) => handleSettingChange('aiProvider', e.target.value)}
                        className="bg-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm w-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="openrouter">OpenRouter (Recommended)</option>
                        <option value="ollama">Ollama Local</option>
                        <option value="both">Hybrid Mode</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeSection === 'performance' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Optimization</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">Legacy GPU Mode</span>
                        <p className="text-slate-500 text-xs">Optimize for older NVIDIA GPUs</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.legacyMode}
                        onChange={(checked) => handleSettingChange('legacyMode', checked)}
                        color="blue"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">Build Optimization</span>
                        <p className="text-slate-500 text-xs">Automatically optimize builds</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.buildOptimization}
                        onChange={(checked) => handleSettingChange('buildOptimization', checked)}
                        color="emerald"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Settings */}
            {activeSection === 'editor' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Editor Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm font-medium block mb-2">Font Family</label>
                      <select 
                        value={settings.font}
                        onChange={(e) => handleSettingChange('font', e.target.value)}
                        className="bg-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm w-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="JetBrains Mono">JetBrains Mono</option>
                        <option value="Fira Code">Fira Code</option>
                        <option value="Consolas">Consolas</option>
                        <option value="Monaco">Monaco</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-slate-300 text-sm font-medium block mb-2">Font Size</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="10"
                          max="24"
                          value={settings.fontSize}
                          onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-slate-300 text-sm font-mono">{settings.fontSize}px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Theme Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-300 text-sm font-medium block mb-2">Color Theme</label>
                      <select 
                        value={settings.theme}
                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                        className="bg-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm w-full border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="high-contrast">High Contrast</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">External Tools & Security</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">External Tools Integration</span>
                        <p className="text-slate-500 text-xs">Allow external tool connections</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.externalTools}
                        onChange={(checked) => handleSettingChange('externalTools', checked)}
                        color="emerald"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-300 text-sm font-medium">WiFi Monitoring</span>
                        <p className="text-slate-500 text-xs">Monitor network connections</p>
                      </div>
                      <ToggleSwitch 
                        checked={settings.wifiMonitoring}
                        onChange={(checked) => handleSettingChange('wifiMonitoring', checked)}
                        color="purple"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-700 p-4 bg-slate-800/30">
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'peer-checked:bg-indigo-600',
    blue: 'peer-checked:bg-blue-600',
    green: 'peer-checked:bg-green-600',
    emerald: 'peer-checked:bg-emerald-600',
    purple: 'peer-checked:bg-purple-600'
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer" 
      />
      <div className={`w-11 h-6 bg-slate-600 peer-focus:ring-2 peer-focus:ring-indigo-500/50 rounded-full peer ${colorClasses[color]} transition-colors`}></div>
      <div className="absolute left-1 top-1 bg-white border border-slate-200 rounded-full h-4 w-4 transition-transform peer-checked:translate-x-5"></div>
    </label>
  );
};

export default Settings;