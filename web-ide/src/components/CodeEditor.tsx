import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Save, Settings, FileText, FolderTree } from 'lucide-react';
import { useStore } from '../store/useStore';

export const CodeEditor: React.FC = () => {
  const { 
    currentProject, 
    currentFile, 
    fileTree, 
    setCurrentFile, 
    updateFileContent,
    theme,
    fontSize,
    tabSize,
    wordWrap
  } = useStore();
  
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (currentFile?.content) {
      setCode(currentFile.content);
      setLanguage(currentFile.language || 'java');
    } else {
      // Default template for new projects
      if (currentProject) {
        const template = getDefaultTemplate(currentProject.type);
        setCode(template);
        setLanguage('java');
      }
    }
  }, [currentFile, currentProject]);

  const getDefaultTemplate = (type: string) => {
    const templates = {
      forge: `package com.example.mod;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod("${currentProject?.name || 'mymod'}")
public class ${currentProject?.name || 'MyMod'} {
    public static final String MOD_ID = "${currentProject?.name || 'mymod'}";

    public ${currentProject?.name || 'MyMod'}() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        
        // Register mod event bus listeners here
        modEventBus.addListener(this::commonSetup);
    }

    private void commonSetup(final net.minecraftforge.event.entity.EntityAttributeCreationEvent event) {
        // Common setup logic
    }
}`,
      fabric: `package com.example.mod;

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ${currentProject?.name || 'MyMod'} implements ModInitializer {
    public static final String MOD_ID = "${currentProject?.name || 'mymod'}";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("Initializing {} mod", MOD_ID);
        
        // Mod initialization logic here
    }
}`,
      spigot: `package com.example.plugin;

import org.bukkit.plugin.java.JavaPlugin;

public class ${currentProject?.name || 'MyPlugin'} extends JavaPlugin {
    @Override
    public void onEnable() {
        getLogger().info("${currentProject?.name || 'MyPlugin'} has been enabled!");
        
        // Plugin enable logic here
    }

    @Override
    public void onDisable() {
        getLogger().info("${currentProject?.name || 'MyPlugin'} has been disabled!");
        
        // Plugin disable logic here
    }
}`
    };

    return templates[type as keyof typeof templates] || templates.forge;
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize,
      tabSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    });
  };

  const handleSave = () => {
    if (currentFile) {
      updateFileContent(currentFile.path, code);
    }
    // Show save notification
    console.log('Code saved!');
  };

  const handleRun = async () => {
    if (!currentProject) return;
    
    console.log('Building and running project...');
    // This would integrate with your build system
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-800 rounded-t-lg p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Code Editor</h2>
            {currentFile && (
              <span className="text-sm text-slate-400">
                {currentFile.name}
              </span>
            )}
            {currentProject && !currentFile && (
              <span className="text-sm text-slate-400">
                {currentProject.name} - Main Class
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-slate-700 rounded transition-colors"
              title="Editor Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors flex items-center space-x-1"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleRun}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors flex items-center space-x-1"
              title="Build & Run"
            >
              <Play className="w-4 h-4" />
              <span>Run</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Settings */}
      {showSettings && (
        <div className="bg-slate-700 p-4 border-b border-slate-600">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Font Size</label>
              <input
                type="number"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  if (editorRef.current) {
                    editorRef.current.updateOptions({ fontSize: newSize });
                  }
                }}
                className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white"
                aria-label="Font Size"
                placeholder="Font size"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tab Size</label>
              <input
                type="number"
                min="2"
                max="8"
                value={tabSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  if (editorRef.current) {
                    editorRef.current.updateOptions({ tabSize: newSize });
                  }
                }}
                className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white"
                aria-label="Tab Size"
                placeholder="Tab size"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Word Wrap</label>
              <select
                value={wordWrap ? 'on' : 'off'}
                onChange={(e) => {
                  const enabled = e.target.value === 'on';
                  if (editorRef.current) {
                    editorRef.current.updateOptions({ wordWrap: enabled ? 'on' : 'off' });
                  }
                }}
                className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white"
                aria-label="Word Wrap"
              >
                <option value="off">Off</option>
                <option value="on">On</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-2 py-1 bg-slate-600 border border-slate-500 rounded text-white"
                aria-label="Language"
              >
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 flex">
        {/* File Tree (placeholder) */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <FolderTree className="w-4 h-4" />
            <h3 className="font-medium">File Explorer</h3>
          </div>
          <div className="text-sm text-slate-400">
            {currentProject ? (
              <div>
                <div className="font-medium text-white mb-2">{currentProject.name}</div>
                <div className="space-y-1">
                  <div className="ml-2">📁 src</div>
                  <div className="ml-4">📁 main</div>
                  <div className="ml-6">📁 java</div>
                  <div className="ml-8">📄 {currentProject.name}Mod.java</div>
                  <div className="ml-6">📁 resources</div>
                  <div className="ml-8">📄 mods.toml</div>
                  <div className="ml-2">📄 build.gradle</div>
                  <div className="ml-2">📄 gradle.properties</div>
                </div>
              </div>
            ) : (
              <p>No project selected</p>
            )}
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              fontSize,
              tabSize,
              wordWrap: wordWrap ? 'on' : 'off',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};
