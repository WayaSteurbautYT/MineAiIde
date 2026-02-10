import React, { useState, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const WayaCreateAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { aiConfig } = useStore();

  useEffect(() => {
    // Welcome message from WayaCreate Agent
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `👋 Hello! I'm WayaCreate AI Assistant, your specialized Minecraft modding expert!

I'm trained on WayaCreate YouTube content and can help you with:
🔧 Minecraft modding (Forge, Fabric, Quilt, NeoForge)
☕ Java programming for Minecraft
🎨 Blockbench 3D modeling and texturing
🛠️ MCreator visual modding
📚 IDE development and workflows
🔍 Git version control and project management

What would you like to work on today? Feel free to ask me anything about Minecraft modding!`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);


  useEffect(() => {
    const applyPrompt = (prompt: string | null) => {
      if (prompt && prompt.trim()) {
        setInput(prompt);
      }
    };

    const pendingPrompt = localStorage.getItem('mineai.quickPrompt');
    if (pendingPrompt) {
      applyPrompt(pendingPrompt);
      localStorage.removeItem('mineai.quickPrompt');
    }

    const handleQuickPrompt = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      applyPrompt(customEvent.detail);
    };

    window.addEventListener('mineai:quickPrompt', handleQuickPrompt);
    return () => {
      window.removeEventListener('mineai:quickPrompt', handleQuickPrompt);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: messages.slice(-5),
          aiConfig,
        })
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'Create Forge Mod', prompt: 'Help me create a new Forge mod with basic functionality' },
    { label: 'Setup Fabric Project', prompt: 'Guide me through setting up a Fabric modding project' },
    { label: 'Blockbench Model', prompt: 'How do I create a custom block model in Blockbench?' },
    { label: 'Debug Mod Issues', prompt: 'My mod is crashing, help me debug the error' }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-800 rounded-t-lg p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bot className="w-8 h-8 text-blue-500" />
            <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">WayaCreate Agent</h2>
            <p className="text-sm text-slate-400">Minecraft Modding Assistant</p>
            <p className="text-xs text-slate-500">{aiConfig.provider} • {aiConfig.model}</p>
          </div>
          {isTyping && (
            <div className="ml-auto flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-slate-400">Typing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setInput(action.prompt)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-sm transition-colors"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <Bot className="w-6 h-6 text-blue-500" />
              </div>
            )}
            
            <div
              className={`max-w-2xl rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-white border border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className="mt-2 text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <User className="w-6 h-6 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3 justify-start">
            <Bot className="w-6 h-6 text-blue-500" />
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-slate-800 rounded-b-lg p-4 border-t border-slate-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Minecraft modding..."
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
