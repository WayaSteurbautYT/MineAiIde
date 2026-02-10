import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Box,
  Code2,
  Cpu,
  HardDrive,
  MessageSquare,
  Settings,
  Play,
  Monitor,
  FolderOpen,
  Search,
  Maximize2,
  Minus,
  X,
  Sparkles,
  BookOpen,
  Wand2,
  Palette,
} from 'lucide-react';
import { mineAI } from '../lib/ai-service';

const tutorialTracks = [
  {
    id: 'quickstart',
    title: 'Quickstart for Beginners',
    level: 'Beginner',
    duration: '10 min',
    steps: ['Create your first project', 'Generate a custom item', 'Run local Minecraft test'],
  },
  {
    id: 'multiagent',
    title: 'Multi-Agent Build Flow',
    level: 'Intermediate',
    duration: '14 min',
    steps: ['Architect prompt', 'Generator output review', 'Verifier build loop'],
  },
  {
    id: 'assets',
    title: 'Blockbench + GeckoLib Pipeline',
    level: 'Intermediate',
    duration: '18 min',
    steps: ['Import model', 'Bind animations', 'Generate controller stubs'],
  },
];

const multiAgentModes = [
  {
    id: 'world-builder',
    name: 'World Builder Squad',
    description: 'Plans structures, terrain rules, and datapack hooks for immersive worlds.',
  },
  {
    id: 'plugin-ops',
    name: 'Plugin Ops Squad',
    description: 'Scaffolds commands/events and keeps Paper server plugins stable.',
  },
  {
    id: 'asset-studio',
    name: 'Asset Studio Squad',
    description: 'Coordinates textures, models, and GeckoLib animation outputs.',
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    disk: 'Calculating...',
    cpu: '0%',
    gpu: 'N/A',
    memory: 'Loading...',
  });
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('workspace');
  const [currentProject, setCurrentProject] = useState('Untitled Project');
  const [selectedTheme, setSelectedTheme] = useState('Obsidian');
  const [selectedAgentMode, setSelectedAgentMode] = useState('world-builder');

  useEffect(() => {
    loadSystemInfo();

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
          memory: `${info.memory}GB RAM`,
        });
      }
    } catch (err) {
      setStats({
        disk: '42GB Free',
        cpu: 'AMD Athlon / Intel Core i3',
        gpu: 'GTX 750 Ti',
        memory: '8GB RAM',
      });
    }
  };

  const handleWindowControl = async (action) => {
    if (window.windowControls) {
      await window.windowControls[action]();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, timestamp: new Date() };
    setChat((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const response = await mineAI.generateModElement(input, {
        project: currentProject,
        agentMode: selectedAgentMode,
      });
      setChat((prev) => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Error connecting to AI service. Using local fallback guidance...',
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleBuildMod = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.buildMod({
          project: currentProject,
          version: '1.0.0',
        });
      }
    } catch (err) {
      console.error('Build failed:', err);
    }
  };

  const renderWorkspace = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 border-dashed flex flex-col items-center justify-center text-slate-500 gap-3 p-8">
          <Box size={48} className="mb-2 opacity-20" />
          <p className="text-sm font-medium text-center">3D Model Preview</p>
          <p className="text-xs text-center">Import .bbmodel files from Blockbench and preview mappings.</p>
          <button className="mt-2 bg-slate-800 hover:bg-slate-700 px-4 py-1.5 rounded text-xs transition-colors">
            Import Model
          </button>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-xs font-mono text-indigo-400 mb-4">// world_builder_plan.json</p>
          <div className="text-sm font-mono opacity-80 bg-slate-950 p-4 rounded border border-slate-800">
            {`{
  "theme": "${selectedTheme}",
  "pipeline": "${selectedAgentMode}",
  "target": "Minecraft 1.20.1",
  "systems": ["structures", "loot", "geckolib", "scripts"],
  "status": "ready"
}`}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-black font-mono text-xs text-green-500 h-40 overflow-y-auto">
        <div className="p-4 space-y-1">
          <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Multi-agent profile loaded: {selectedAgentMode}</div>
          <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Theme profile active: {selectedTheme}</div>
          <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Project '{currentProject}' loaded.</div>
          <div className="flex gap-2"><span className="text-indigo-500">[MineAI-CLI]</span> Ready for world-building commands.</div>
        </div>
      </div>
    </div>
  );

  const renderTutorials = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold flex items-center gap-2"><BookOpen size={18} className="text-cyan-400" /> Beginner Tutorial Hub</h2>
        <p className="text-sm text-slate-400 mt-1">Step-by-step training for first-time Minecraft creators.</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {tutorialTracks.map((track) => (
          <div key={track.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{track.title}</h3>
              <span className="text-xs text-slate-400">{track.duration}</span>
            </div>
            <p className="text-xs text-indigo-300 mb-2">{track.level}</p>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              {track.steps.map((step) => <li key={step}>{step}</li>)}
            </ul>
            <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 rounded">Start Tutorial</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Palette size={18} className="text-pink-400" /> Interface Customization</h2>
        <p className="text-sm text-slate-400 mt-1">Tune the workspace to your learning style and workflow.</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {['Obsidian', 'Forest', 'Sunset', 'Classic VS'].map((theme) => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`p-3 rounded border text-sm ${selectedTheme === theme ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900'}`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Wand2 size={18} className="text-amber-400" /> Multi-Agent Presets</h2>
        <p className="text-sm text-slate-400 mt-1">Select specialized AI squads for coding + world building tasks.</p>
        <div className="mt-4 space-y-3">
          {multiAgentModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedAgentMode(mode.id)}
              className={`w-full text-left p-3 rounded border ${selectedAgentMode === mode.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-900'}`}
            >
              <h3 className="text-sm font-medium">{mode.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{mode.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMainPanel = () => {
    if (activeTab === 'terminal') {
      return renderTutorials();
    }
    if (activeTab === 'assets') {
      return renderCustomization();
    }
    if (activeTab === 'settings') {
      return renderCustomization();
    }
    return renderWorkspace();
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans select-none">
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 drag-region flex-shrink-0">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-indigo-400" />
            <span className="font-semibold">{currentProject}</span>
            <span className="text-xs text-slate-500 px-2 bg-slate-800 rounded">Minecraft 1.20.1</span>
          </div>
        </div>

        <div className="flex items-center gap-1 no-drag-region">
          <button onClick={() => handleWindowControl('minimize')} className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 transition-colors"><Minus size={14} /></button>
          <button onClick={() => handleWindowControl('maximize')} className="w-8 h-8 flex items-center justify-center hover:bg-slate-700 transition-colors"><Maximize2 size={12} /></button>
          <button onClick={() => handleWindowControl('close')} className="w-8 h-8 flex items-center justify-center hover:bg-red-500 transition-colors"><X size={14} /></button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-16 border-r border-slate-800 flex flex-col items-center py-4 gap-6 bg-slate-900/50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Box className="text-white" size={24} />
          </div>
          <div className="flex flex-col gap-4 mt-8 text-slate-400">
            <button onClick={() => setActiveTab('workspace')} className={`p-2 rounded-lg transition-all ${activeTab === 'workspace' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Code2 size={20} /></button>
            <button onClick={() => setActiveTab('terminal')} className={`p-2 rounded-lg transition-all ${activeTab === 'terminal' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><BookOpen size={20} /></button>
            <button onClick={() => setActiveTab('assets')} className={`p-2 rounded-lg transition-all ${activeTab === 'assets' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><FolderOpen size={20} /></button>
            <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}><Settings size={20} /></button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-12 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/20 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                MineAI Desktop <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 rounded text-slate-500 ml-2">v1.1.0-preview</span>
              </h1>
              <div className="relative">
                <Search className="absolute left-3 top-2 text-slate-500" size={16} />
                <input placeholder="Search tutorials, files, and commands..." className="bg-slate-800/50 border border-slate-700 rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all w-72" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700"><Cpu size={14} className="text-emerald-500" /><span>{stats.cpu}</span></div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700"><HardDrive size={14} className="text-blue-500" /><span>{stats.disk}</span></div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700"><Monitor size={14} className="text-purple-500" /><span>{stats.memory}</span></div>
              </div>
              <button onClick={handleBuildMod} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/10"><Play size={14} fill="currentColor" /> Build & Run</button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto p-6 bg-slate-950">
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider">
                <Sparkles size={14} className="text-indigo-400" />
                Friendly Mode: tutorials + guided prompts + one-click actions
              </div>
              {renderMainPanel()}
            </div>

            <div className="w-96 border-l border-slate-800 bg-slate-900/40 flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider text-slate-300">MineAI Assistant</span>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{selectedAgentMode}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-300 border border-slate-700/50">
                  <p className="mb-2">Need help? I can explain everything step-by-step for beginners.</p>
                  <p className="text-xs text-slate-500">Ask for guided mod/plugin/datapack instructions, model setup, or troubleshooting.</p>
                </div>
                {chat.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-indigo-600/20 ml-4 border border-indigo-500/30' : 'bg-slate-800/50 mr-4 border border-slate-700/50'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs text-slate-500 mt-1 block">{msg.timestamp?.toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-900/80 border-t border-slate-800">
                <div className="relative">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask MineAI for tutorials, code, assets, or world-building plans..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                  <MessageSquare className="absolute right-3 top-3 text-slate-600" size={18} />
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center uppercase tracking-widest">AI Help • Beginner Friendly • Multi-Agent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
