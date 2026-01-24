'use client'

import { useState, useEffect } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from 'react-resizable-panels'
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
  Sun,
  Moon,
  Search,
  Bell,
  User
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { Sidebar } from './sidebar'
import { EditorPanel } from './editor-panel'
import { AIPanel } from './ai-panel'
import { TerminalPanel } from './terminal-panel'
import { ToolsPanel } from './tools-panel'
import { StatusBar } from './status-bar'

export function IDELayout() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(true)
  const [isAIOpen, setIsAIOpen] = useState(true)
  const [isToolsOpen, setIsToolsOpen] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">MineAI IDE Pro</span>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <FileText className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <FolderOpen className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted rounded-md p-1">
              <Button
                variant={activeTab === 'editor' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('editor')}
                className="h-6 px-2 text-xs"
              >
                Editor
              </Button>
              <Button
                variant={activeTab === 'designer' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('designer')}
                className="h-6 px-2 text-xs"
              >
                Designer
              </Button>
              <Button
                variant={activeTab === 'animator' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('animator')}
                className="h-6 px-2 text-xs"
              >
                Animator
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? 'Stop Recording' : 'Start Voice Commands'}</p>
                </TooltipContent>
              </Tooltip>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          <ResizableHandle direction="horizontal" className="w-1 bg-border hover:bg-accent" />

          {/* Main Editor Area */}
          <ResizablePanelGroup direction="vertical" className="flex-1">
            <ResizablePanel defaultSize={70} minSize={30}>
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={60} minSize={40}>
                  <EditorPanel activeTab={activeTab} />
                </ResizablePanel>

                <ResizableHandle direction="horizontal" className="w-1 bg-border hover:bg-accent" />

                {/* Right Panels */}
                <ResizablePanel defaultSize={40} minSize={20}>
                  <ResizablePanelGroup direction="vertical">
                    {/* AI Panel */}
                    {isAIOpen && (
                      <ResizablePanel defaultSize={50} minSize={20}>
                        <AIPanel onClose={() => setIsAIOpen(false)} />
                      </ResizablePanel>
                    )}

                    {isAIOpen && isToolsOpen && (
                      <ResizableHandle direction="vertical" className="h-1 bg-border hover:bg-accent" />
                    )}

                    {/* Tools Panel */}
                    {isToolsOpen && (
                      <ResizablePanel defaultSize={50} minSize={20}>
                        <ToolsPanel onClose={() => setIsToolsOpen(false)} />
                      </ResizablePanel>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>

            {/* Terminal */}
            {isTerminalOpen && (
              <>
                <ResizableHandle direction="vertical" className="h-1 bg-border hover:bg-accent" />
                <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
                  <TerminalPanel onClose={() => setIsTerminalOpen(false)} />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Status Bar */}
        <StatusBar />
      </div>
    </TooltipProvider>
  )
}
