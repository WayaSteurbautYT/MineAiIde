'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Square, 
  Settings, 
  Terminal, 
  FileText, 
  FolderOpen, 
  GitBranch,
  Bot,
  Code2,
  Package,
  Layers,
  Monitor,
  Mic,
  MicOff,
  Search,
  Bell,
  User,
  Plus,
  Save,
  FolderTree,
  Braces,
  Cpu,
  Zap,
  Database,
  Palette,
  Video,
  Upload,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Globe,
  Lock,
  Unlock,
  Sparkles,
  Command,
  Layers3,
  Box,
  Cube,
  Move3d,
  Wrench,
  Rocket,
  Cloud,
  Server,
  Network,
  PackageOpen
} from 'lucide-react'

export function AdvancedIDELayout() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isAIOpen, setIsAIOpen] = useState(true)
  const [isToolsOpen, setIsToolsOpen] = useState(true)
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isBlockbenchOpen, setIsBlockbenchOpen] = useState(false)
  const [isNovaSkinOpen, setIsNovaSkinOpen] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const codeContent = `package com.example.mymod;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.event.entity.EntityAttributeCreationEvent;
import net.minecraftforge.common.MinecraftForge;

@Mod("mymod")
public class MainMod {
    public static final String MOD_ID = "mymod";
    
    public MainMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        
        // Register mod contents
        modEventBus.addListener(this::commonSetup);
        MinecraftForge.EVENT_BUS.register(this);
    }
    
    private void commonSetup(final EntityAttributeCreationEvent event) {
        // Common setup logic here
        System.out.println("MyMod initialized!");
    }
}`

  useEffect(() => {
    // Initialize MCP servers
    const initializeMCPServers = async () => {
      console.log('Initializing MCP servers...')
      // Initialize GitHub MCP
      // Initialize Discord MCP
      // Initialize Vercel MCP
      // Initialize YouTube MCP
    }

    // Initialize database connection
    const initializeDatabase = async () => {
      console.log('Initializing Minecraft mod database...')
      // Connect to IndexedDB for local storage
      // Sync with remote database if available
    }

    initializeMCPServers()
    initializeDatabase()
  }, [])

  const handleTerminalCommand = async (command: string) => {
    if (!terminalRef.current) return
    
    const terminal = terminalRef.current
    const output = terminal.querySelector('.terminal-output')
    
    if (output) {
      // Add command to terminal
      const commandLine = document.createElement('div')
      commandLine.className = 'text-green-400'
      commandLine.textContent = `$ ${command}`
      output.appendChild(commandLine)
      
      // Process command
      if (command.startsWith('./gradlew')) {
        // Simulate build process
        setTimeout(() => {
          const buildLine = document.createElement('div')
          buildLine.className = 'text-gray-300'
          buildLine.textContent = '> Task :compileJava'
          output.appendChild(buildLine)
          
          setTimeout(() => {
            const successLine = document.createElement('div')
            successLine.className = 'text-green-400'
            successLine.textContent = 'BUILD SUCCESSFUL in 2s'
            output.appendChild(successLine)
            
            // Auto-scroll to bottom
            terminal.scrollTop = terminal.scrollHeight
          }, 1000)
        }, 500)
      }
      
      // Auto-scroll to bottom
      terminal.scrollTop = terminal.scrollHeight
    }
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} font-mono text-sm`}>
      {/* Header */}
      <header className={`h-12 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border-b flex items-center justify-between px-4`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MineAI IDE Pro</span>
            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Advanced</span>
          </div>
          
          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          
          <div className="flex items-center space-x-2">
            <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}>
              <FileText className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}>
              <FolderOpen className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}>
              <Save className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}>
              <Search className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded transition-colors`}>
              <Database className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-md p-1`}>
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'editor' 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </button>
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'designer' 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('designer')}
            >
              Designer
            </button>
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'animator' 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('animator')}
            >
              Animator
            </button>
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'database' 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('database')}
            >
              Database
            </button>
          </div>

          <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded transition-colors ${
                isRecording ? 'text-red-500 hover:bg-red-900/20' : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Stop Recording' : 'Start Voice Commands'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              className={`p-2 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              onClick={() => setIsDarkMode(!isDarkMode)}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button className={`p-2 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Bell className="w-4 h-4" />
            </button>

            <button className={`p-2 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Settings className="w-4 h-4" />
            </button>

            <button className={`p-2 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-r flex flex-col`}>
          <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Explorer</h3>
              <button className={`p-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded`}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <div className={`flex items-center space-x-2 p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded cursor-pointer`}>
                <FolderTree className="w-4 h-4 text-yellow-500" />
                <span>MyMod</span>
              </div>
              <div className="ml-4 space-y-1">
                <div className={`flex items-center space-x-2 p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded cursor-pointer`}>
                  <Braces className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">src/main/java</span>
                </div>
                <div className={`ml-4 flex items-center space-x-2 p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded cursor-pointer`}>
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-sm">build.gradle</span>
                </div>
                <div className={`ml-4 flex items-center space-x-2 p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded cursor-pointer`}>
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">mods.toml</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <h3 className="font-semibold text-sm mb-3">AI Assistant</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white">
                <Bot className="w-4 h-4" />
                <span className="text-sm">WayaCreate Agent</span>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Code2 className="w-4 h-4" />
                <span className="text-sm">Code Assistant</span>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Package className="w-4 h-4" />
                <span className="text-sm">Model Designer</span>
              </button>
            </div>
          </div>

          <div className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
            <h3 className="font-semibold text-sm mb-3">MCP Servers</h3>
            <div className="space-y-2">
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Video className="w-4 h-4" />
                <span className="text-sm">YouTube</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Globe className="w-4 h-4" />
                <span className="text-sm">Discord</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full ml-auto"></div>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Cloud className="w-4 h-4" />
                <span className="text-sm">Vercel</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              </button>
            </div>
          </div>

          <div className="p-4 flex-1">
            <h3 className="font-semibold text-sm mb-3">Tools</h3>
            <div className="space-y-2">
              <button 
                className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}
                onClick={() => setIsBlockbenchOpen(!isBlockbenchOpen)}
              >
                <Box className="w-4 h-4" />
                <span className="text-sm">Blockbench</span>
              </button>
              <button 
                className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}
                onClick={() => setIsNovaSkinOpen(!isNovaSkinOpen)}
              >
                <Palette className="w-4 h-4" />
                <span className="text-sm">Nova Skin</span>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Zap className="w-4 h-4" />
                <span className="text-sm">GeckoLib</span>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Cpu className="w-4 h-4" />
                <span className="text-sm">Ollama</span>
              </button>
              <button className={`w-full flex items-center space-x-2 p-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded transition-colors`}>
                <Server className="w-4 h-4" />
                <span className="text-sm">Auto Updates</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className={`h-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border-b flex items-center px-4`}>
            <div className="flex items-center space-x-1">
              <div className={`px-3 py-1 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border-t flex items-center space-x-2`}>
                <FileText className="w-3 h-3" />
                <span>MainMod.java</span>
                <button className={`ml-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>×</button>
              </div>
              <div className={`px-3 py-1 ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-gray-50 border-gray-300'} border-t flex items-center space-x-2`}>
                <FileText className="w-3 h-3" />
                <span>build.gradle</span>
                <button className={`ml-2 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>×</button>
              </div>
            </div>
          </div>

          {/* Editor Content based on active tab */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'editor' && (
              <div className={`p-4 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
                <pre className="text-sm">
                  <code>{codeContent}</code>
                </pre>
              </div>
            )}
            
            {activeTab === 'designer' && (
              <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center py-20">
                  <Move3d className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-xl font-semibold mb-2">3D Model Designer</h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Design 3D models for Minecraft blocks, items, and entities</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Open Blockbench
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'animator' && (
              <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center py-20">
                  <Layers3 className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                  <h3 className="text-xl font-semibold mb-2">Animation Editor</h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Create GeckoLib animations with timeline editor</p>
                  <div className="mt-4 space-x-2">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                      Create Animation
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                      Import Timeline
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'database' && (
              <div className={`p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Database className="w-8 h-8 mb-2 text-blue-500" />
                    <h4 className="font-semibold mb-2">Mod Database</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Store and manage all your mod data</p>
                    <button className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      View Database
                    </button>
                  </div>
                  
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <RefreshCw className="w-8 h-8 mb-2 text-green-500" />
                    <h4 className="font-semibold mb-2">Auto Updates</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Automated dependency updates</p>
                    <button className="w-full px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                      Configure
                    </button>
                  </div>
                  
                  <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Network className="w-8 h-8 mb-2 text-purple-500" />
                    <h4 className="font-semibold mb-2">MCP Network</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Connected MCP servers</p>
                    <button className="w-full px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal */}
          {isTerminalOpen && (
            <div className={`h-48 ${isDarkMode ? 'bg-black border-gray-700' : 'bg-gray-900 border-gray-300'} border-t flex flex-col`}>
              <div className={`h-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-800 border-gray-600'} flex items-center justify-between px-4`}>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-white">Terminal</span>
                  <div className="flex items-center space-x-2">
                    <button className="px-2 py-1 bg-green-600 text-xs rounded text-white">Problems</button>
                    <button className="px-2 py-1 bg-gray-600 text-xs rounded text-white">Output</button>
                    <button className="px-2 py-1 bg-gray-600 text-xs rounded text-white">Debug Console</button>
                    <button className="px-2 py-1 bg-blue-600 text-xs rounded text-white">Terminal</button>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsTerminalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-sm terminal-output" ref={terminalRef}>
                <div className="text-green-400">$ ./gradlew build</div>
                <div className="text-gray-300">> Task :compileJava</div>
                <div className="text-gray-300">> Task :processResources</div>
                <div className="text-gray-300">> Task :classes</div>
                <div className="text-gray-300">> Task :jar</div>
                <div className="text-green-400">BUILD SUCCESSFUL in 2s</div>
                <div className="text-green-400">3 actionable tasks: 3 executed</div>
                <div className="text-gray-400 mt-2">$</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - AI Assistant */}
        {isAIOpen && (
          <div className={`w-80 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-l flex flex-col`}>
            <div className={`h-10 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'} border-b flex items-center justify-between px-4`}>
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">WayaCreate Agent</span>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsAIOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 flex flex-col p-4">
              <div className="flex-1 space-y-4 mb-4 overflow-auto">
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="text-xs text-gray-400 mb-1">WayaCreate Agent</div>
                  <div className="text-sm">
                    Hello! I'm WayaCreate AI Assistant with advanced MCP integrations. I can help you with:
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Minecraft modding (Forge, Fabric, NeoForge)</li>
                      <li>• 3D modeling with Blockbench</li>
                      <li>• GeckoLib animations</li>
                      <li>• GitHub repository management</li>
                      <li>• YouTube transcript analysis</li>
                      <li>• Discord community integration</li>
                      <li>• Auto updates and database management</li>
                    </ul>
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-600/20 border-blue-600/50' : 'bg-blue-50 border-blue-200'}`}>
                  <div className="text-xs text-gray-400 mb-1">You</div>
                  <div className="text-sm">
                    Create a custom block with special properties and auto-update dependencies
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="text-xs text-gray-400 mb-1">WayaCreate Agent</div>
                  <div className="text-sm">
                    I'll help you create a custom block with special properties! Let me:
                    <ol className="mt-2 space-y-1 text-xs list-decimal list-inside">
                      <li>Generate the block class with custom properties</li>
                      <li>Set up auto-update for dependencies</li>
                      <li>Create Blockbench model integration</li>
                      <li>Add GeckoLib animation support</li>
                      <li>Configure database storage</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Ask WayaCreate anything about Minecraft modding..."
                  className={`flex-1 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500`}
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors text-white">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className={`h-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border-t flex items-center justify-between px-4 text-xs`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ready</span>
          </div>
          <span>Java 17</span>
          <span>Forge 1.20.1</span>
          <div className="flex items-center space-x-1">
            <Database className="w-3 h-3" />
            <span>Connected</span>
          </div>
          <div className="flex items-center space-x-1">
            <Network className="w-3 h-3" />
            <span>4 MCP</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Ln 42, Col 18</span>
          <span>UTF-8</span>
          <button className={`flex items-center space-x-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} px-2 py-1 rounded`}>
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>
          <button className={`flex items-center space-x-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} px-2 py-1 rounded`}>
            <Square className="w-3 h-3" />
            <span>Build</span>
          </button>
          <button className={`flex items-center space-x-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} px-2 py-1 rounded`}>
            <Rocket className="w-3 h-3" />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      {/* Blockbench Modal */}
      {isBlockbenchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Blockbench Integration</h3>
              <button onClick={() => setIsBlockbenchOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p>Create and edit 3D models for Minecraft blocks, items, and entities.</p>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Box className="w-8 h-8 mx-auto mb-2" />
                  <span>New Block Model</span>
                </button>
                <button className="p-4 bg-green-600 text-white rounded hover:bg-green-700">
                  <Package className="w-8 h-8 mx-auto mb-2" />
                  <span>New Item Model</span>
                </button>
                <button className="p-4 bg-purple-600 text-white rounded hover:bg-purple-700">
                  <PackageOpen className="w-8 h-8 mx-auto mb-2" />
                  <span>New Entity Model</span>
                </button>
                <button className="p-4 bg-orange-600 text-white rounded hover:bg-orange-700">
                  <Upload className="w-8 h-8 mx-auto mb-2" />
                  <span>Import Model</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nova Skin Modal */}
      {isNovaSkinOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Nova Skin Designer</h3>
              <button onClick={() => setIsNovaSkinOpen(false)} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p>Design custom Minecraft skins with AI assistance and advanced tools.</p>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 bg-pink-600 text-white rounded hover:bg-pink-700">
                  <Palette className="w-8 h-8 mx-auto mb-2" />
                  <span>Skin Editor</span>
                </button>
                <button className="p-4 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  <Eye className="w-8 h-8 mx-auto mb-2" />
                  <span>Preview</span>
                </button>
                <button className="p-4 bg-teal-600 text-white rounded hover:bg-teal-700">
                  <Download className="w-8 h-8 mx-auto mb-2" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
