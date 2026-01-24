import React, { useState, useEffect } from 'react';
import { Terminal, Box, Code2, Cpu, HardDrive, MessageSquare, Settings, Play, 
         Monitor, GitBranch, Zap, Package, FolderOpen, Search, Maximize2, Minus, X } from 'lucide-react';
import { mineAI } from '../lib/ai-service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    disk: 'Calculating...', 
    cpu: '0%', 
    gpu: 'N/A',
    memory: 'Loading...'
  });
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [currentProject, setCurrentProject] = useState('Untitled Project');

  useEffect(() => {
    loadSystemInfo();
    
    // Mock project loading
    setTimeout(() => {
      setCurrentProject('My Minecraft Mod');
    }, 1000);
  }, []);

  const loadSystemInfo = async () => {
    try {
      if (window.electronAPI) {
        const info = await window.electronAPI.getSystemInfo();
        setStats({
          disk: '42GB Free',
          cpu: `${info.cpus} cores`, 
          gpu: 'GTX 750 Ti (Legacy Mode)',
          memory: `${info.memory}GB RAM`
        });
      }
    } catch (err) {
      setStats({
        disk: '42GB Free',
        cpu: 'AMD Athlon / Intel Core i3',
        gpu: 'GTX 750 Ti',
        memory: '8GB RAM'
      });
    }
  };

  const handleWindowControl = async (action) => {
    if (window.windowControls) {
      await window.windowControls[action]();
    }
  };

  const handleSend = async () => {
    if (!input) return;
    const userMsg = { role: 'user', content: input, timestamp: new Date() };
    setChat([...chat, userMsg]);
    setInput('');
    
    try {
      const response = await mineAI.generateModElement(input, { project: currentProject });
      setChat(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        timestamp: new Date() 
      }]);
    } catch (err) {
      setChat(prev => [...prev, { 
        role: 'assistant', 
        content: "Error connecting to AI service. Using local fallback...",
        timestamp: new Date()
      }]);
    }
  };

  const handleBuildMod = async () => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.buildMod({
          project: currentProject,
          version: '1.0.0'
        });
        console.log('Build result:', result);
      }
    } catch (err) {
      console.error('Build failed:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans select-none">
      {/* Custom Title Bar for Windows */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 drag-region">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-indigo-400" />
            <span className="font-semibold">{currentProject}</span>
            <span className="text-xs text-slate-500 px-2 bg-slate-800 rounded">Minecraft 1.20.1</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 no-drag-region">
          <button 
            onClick={() => handleWindowControl('minimize')}
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={() => handleWindowControl('maximize')}
            className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <Maximize2 size={12} />
          </button>
          <button 
            onClick={() => handleWindowControl('close')}
            className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-16 border-r border-slate-800 flex flex-col items-center py-4 gap-6 bg-slate-900/50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Box className="text-white" size={24} />
          </div>
          <div className="flex flex-col gap-4 mt-8 text-slate-400">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`p-2 rounded-lg transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <Code2 size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('terminal')}
              className={`p-2 rounded-lg transition-all ${activeTab === 'terminal' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
            >
              <Terminal size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className="p-2 rounded-lg hover:bg-slate-800 transition-all"
            >
              <FolderOpen size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className="p-2 rounded-lg hover:bg-slate-800 transition-all"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header Toolbar */}
          <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                MineAI IDE <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-500 ml-2">v1.0.0</span>
              </h1>
              <div className="relative">
                <Search className="absolute left-3 top-2 text-slate-500" size={16} />
                <input 
                  placeholder="Search files, code..."
                  className="bg-slate-800/50 border border-slate-700 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                  <Cpu size={14} className="text-emerald-500" />
                  <span>{stats.cpu}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                  <HardDrive size={14} className="text-blue-500" />
                  <span>{stats.disk}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                  <Monitor size={14} className="text-purple-500" />
                  <span>{stats.memory}</span>
                </div>
              </div>
              <button 
                onClick={handleBuildMod}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/10"
              >
                <Play size={14} fill="currentColor" /> Build Mod
              </button>
            </div>
          </div>

          {/* Editor & Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Tab Bar */}
              <div className="h-10 border-b border-slate-800 bg-slate-900/30 flex items-center px-4 gap-2">
                <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md">
                  modinfo.json
                </button>
                <button className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-md">
                  Entity.java
                </button>
                <button className="px-3 py-1.5 text-sm text-slate-400 hover:text-white rounded-md">
                  model.bbmodel
                </button>
              </div>

              {/* Editor Content */}
              <div className="flex-1 bg-slate-950 p-6 overflow-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 border-dashed flex flex-col items-center justify-center text-slate-500 gap-3 p-8">
                    <Box size={48} className="mb-2 opacity-20" />
                    <p className="text-sm font-medium text-center">3D Model Preview</p>
                    <p className="text-xs text-center">Drag & Drop .bbmodel files supported</p>
                    <button className="mt-2 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded text-xs transition-colors">
                      Import Model
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                    <p className="text-xs font-mono text-indigo-400 mb-4">// modinfo.json</p>
                    <div className="text-sm font-mono opacity-80 bg-slate-950 p-4 rounded border border-slate-800">
                      {`{
  "modId": "mineai_generated",
  "version": "1.0.0", 
  "displayName": "AI Generated Mod",
  "description": "Created with MineAI IDE",
  "optimized": true,
  "legacy_gpu_support": "enabled"
}`}
                    </div>
                  </div>
                </div>
                
                {/* Terminal */}
                <div className="mt-6 border border-slate-800 bg-black rounded-xl font-mono text-xs text-green-500 h-40 overflow-y-auto">
                  <div className="p-4 space-y-1">
                    <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Initializing legacy driver support...</div>
                    <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Detecting disk space: 42GB available.</div>
                    <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Project 'My Minecraft Mod' loaded.</div>
                    <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Ready for build commands.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Panel */}
            <div className="w-96 border-l border-slate-800 bg-slate-900/40 flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider text-slate-300">MineAI Assistant</span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Online</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-300 border border-slate-700/50">
                  <p className="mb-2">Hi! I'm ready to help with your Minecraft mod.</p>
                  <p className="text-xs text-slate-500">I can generate code, create 3D models, fix bugs, and optimize performance.</p>
                </div>
                {chat.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600/20 ml-4 border border-indigo-500/30' 
                      : 'bg-slate-800/50 mr-4 border border-slate-700/50'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs text-slate-500 mt-1 block">
                      {msg.timestamp?.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-900/80 border-t border-slate-800">
                <div className="relative">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask MineAI to generate code, entities or fix errors..." 
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  <MessageSquare className="absolute right-3 top-3 text-slate-600" size={18} />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest">
                  AI Powered • Secure • Real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;