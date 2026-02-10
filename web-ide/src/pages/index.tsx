import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { WayaCreateAgent } from '../components/WayaCreateAgent';
import { ProjectManager } from '../components/ProjectManager';
import { CodeEditor } from '../components/CodeEditor';
import { MinecraftTools } from '../components/MinecraftTools';
import { TabNavigation } from '../components/TabNavigation';
import { MinecraftCommandPalette } from '../components/MinecraftCommandPalette';
import { AIProviderSettings } from '../components/AIProviderSettings';
import { BeginnerTutorials } from '../components/BeginnerTutorials';
import { useStore } from '../store/useStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState('agent');
  const { projects, currentProject, setCurrentProject } = useStore();

  useEffect(() => {
    // Initialize the IDE
    document.title = 'MineAI IDE - WayaCreate Agent';
  }, []);

  const tabs = [
    { id: 'agent', label: 'WayaCreate Agent', icon: '🤖' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'editor', label: 'Code Editor', icon: '💻' },
    { id: 'tools', label: 'Minecraft Tools', icon: '⛏️' },
    { id: 'commands', label: 'Command Palette', icon: '🧠' },
    { id: 'ai-settings', label: 'AI Settings', icon: '⚙️' },
    { id: 'learn', label: 'Tutorials', icon: '📚' },
  ];


  const handleRunCommandTask = (prompt: string) => {
    setActiveTab('agent');
    localStorage.setItem('mineai.quickPrompt', prompt);
    window.dispatchEvent(new CustomEvent('mineai:quickPrompt', { detail: prompt }));
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'agent':
        return <WayaCreateAgent />;
      case 'projects':
        return <ProjectManager />;
      case 'editor':
        return <CodeEditor />;
      case 'tools':
        return <MinecraftTools />;
      case 'commands':
        return <MinecraftCommandPalette onRunTask={handleRunCommandTask} />;
      case 'ai-settings':
        return <AIProviderSettings />;
      case 'learn':
        return <BeginnerTutorials />;
      default:
        return <WayaCreateAgent />;
    }
  };

  return (
    <>
      <Head>
        <title>MineAI IDE - WayaCreate Agent</title>
        <meta name="description" content="Web-based Minecraft AI IDE with WayaCreate Agent" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">⛏️</span>
                  <h1 className="text-xl font-bold">MineAI IDE</h1>
                </div>
                <span className="text-sm text-slate-400">Powered by WayaCreate Agent</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {currentProject && (
                  <div className="text-sm">
                    <span className="text-slate-400">Current Project:</span>
                    <span className="ml-2 font-medium">{currentProject.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderActiveTab()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-800 border-t border-slate-700 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <div>
                © 2024 MineAI IDE - Built with WayaCreate Agent
              </div>
              <div className="flex items-center space-x-4">
                <a href="https://youtube.com/@wayacreate" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  YouTube
                </a>
                <a href="https://github.com/WayaSteurbautYT" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  GitHub
                </a>
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Deployed on Vercel
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
