'use client'

import { useState } from 'react'
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
  Zap
} from 'lucide-react'

export function SimpleIDELayout() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isAIOpen, setIsAIOpen] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')

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

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-100 font-mono text-sm">
      {/* Header */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MineAI IDE Pro</span>
          </div>
          
          <div className="w-px h-6 bg-gray-600"></div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <FileText className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <FolderOpen className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <Save className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-700 rounded-md p-1">
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'editor' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('editor')}
            >
              Editor
            </button>
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'designer' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('designer')}
            >
              Designer
            </button>
            <button
              className={`px-3 py-1 rounded text-xs transition-colors ${
                activeTab === 'animator' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
              onClick={() => setActiveTab('animator')}
            >
              Animator
            </button>
          </div>

          <div className="w-px h-6 bg-gray-600"></div>

          <div className="flex items-center space-x-2">
            <button
              className={`p-2 rounded transition-colors ${
                isRecording ? 'text-red-500 hover:bg-red-900/20' : 'hover:bg-gray-700'
              }`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Stop Recording' : 'Start Voice Commands'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <Bell className="w-4 h-4" />
            </button>

            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <Settings className="w-4 h-4" />
            </button>

            <button className="p-2 hover:bg-gray-700 rounded transition-colors">
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Explorer</h3>
              <button className="p-1 hover:bg-gray-700 rounded">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                <FolderTree className="w-4 h-4 text-yellow-500" />
                <span>MyMod</span>
              </div>
              <div className="ml-4 space-y-1">
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <Braces className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">src/main/java</span>
                </div>
                <div className="ml-4 flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-sm">build.gradle</span>
                </div>
                <div className="ml-4 flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">mods.toml</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold text-sm mb-3">AI Assistant</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                <Bot className="w-4 h-4" />
                <span className="text-sm">WayaCreate Agent</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                <Code2 className="w-4 h-4" />
                <span className="text-sm">Code Assistant</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                <Package className="w-4 h-4" />
                <span className="text-sm">Model Designer</span>
              </button>
            </div>
          </div>

          <div className="p-4 flex-1">
            <h3 className="font-semibold text-sm mb-3">Tools</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                <Layers className="w-4 h-4" />
                <span className="text-sm">Blockbench</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                <Zap className="w-4 h-4" />
                <span className="text-sm">GeckoLib</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                <Cpu className="w-4 h-4" />
                <span className="text-sm">Ollama</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
            <div className="flex items-center space-x-1">
              <div className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-t flex items-center space-x-2">
                <FileText className="w-3 h-3" />
                <span>MainMod.java</span>
                <button className="ml-2 text-gray-400 hover:text-white">×</button>
              </div>
              <div className="px-3 py-1 bg-gray-900 border border-gray-600 rounded-t flex items-center space-x-2">
                <FileText className="w-3 h-3" />
                <span>build.gradle</span>
                <button className="ml-2 text-gray-400 hover:text-white">×</button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="flex-1 bg-black p-4 overflow-auto">
            <pre className="text-sm">
              <code>{codeContent}</code>
            </pre>
          </div>

          {/* Terminal */}
          {isTerminalOpen && (
            <div className="h-48 bg-black border-t border-gray-700 flex flex-col">
              <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold">Terminal</span>
                  <div className="flex items-center space-x-2">
                    <button className="px-2 py-1 bg-green-600 text-xs rounded">Problems</button>
                    <button className="px-2 py-1 bg-gray-600 text-xs rounded">Output</button>
                    <button className="px-2 py-1 bg-gray-600 text-xs rounded">Debug Console</button>
                    <button className="px-2 py-1 bg-gray-600 text-xs rounded">Terminal</button>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setIsTerminalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto font-mono text-sm">
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
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="h-10 bg-gray-700 border-b border-gray-600 flex items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">WayaCreate Agent</span>
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
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">WayaCreate Agent</div>
                  <div className="text-sm">
                    Hello! I'm WayaCreate AI Assistant. I can help you with Minecraft modding, Java development, and using the various tools in this IDE. What would you like to work on?
                  </div>
                </div>
                
                <div className="bg-blue-600/20 border border-blue-600/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">You</div>
                  <div className="text-sm">
                    Can you help me create a custom block with special properties?
                  </div>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">WayaCreate Agent</div>
                  <div className="text-sm">
                    Absolutely! I'll help you create a custom block. Let me generate the code for a block with special properties like custom hardness, light emission, and special behaviors.
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Ask WayaCreate anything about Minecraft modding..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Ready</span>
          </div>
          <span>Java 17</span>
          <span>Forge 1.20.1</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Ln 42, Col 18</span>
          <span>UTF-8</span>
          <button className="flex items-center space-x-1 hover:bg-gray-700 px-2 py-1 rounded">
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>
          <button className="flex items-center space-x-1 hover:bg-gray-700 px-2 py-1 rounded">
            <Square className="w-3 h-3" />
            <span>Build</span>
          </button>
        </div>
      </div>
    </div>
  )
}
