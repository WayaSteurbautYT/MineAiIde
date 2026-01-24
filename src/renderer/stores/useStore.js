/**
 * MineAI IDE - Global State Store
 * Zustand store for managing application state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Main Application Store
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // ============================================
      // Project State
      // ============================================
      currentProject: null,
      projects: [],
      recentProjects: [],
      
      setCurrentProject: (project) => {
        set({ currentProject: project });
        // Add to recent projects
        const { recentProjects } = get();
        if (project) {
          const filtered = recentProjects.filter(p => p.path !== project.path);
          set({ recentProjects: [project, ...filtered].slice(0, 10) });
        }
      },
      
      setProjects: (projects) => set({ projects }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      removeProject: (projectPath) => set((state) => ({
        projects: state.projects.filter(p => p.path !== projectPath),
        recentProjects: state.recentProjects.filter(p => p.path !== projectPath),
        currentProject: state.currentProject?.path === projectPath ? null : state.currentProject
      })),
      
      // ============================================
      // UI State
      // ============================================
      sidebarCollapsed: false,
      activeTab: 'editor',
      showProjectWizard: false,
      showSettings: false,
      showTutorials: false,
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setShowProjectWizard: (show) => set({ showProjectWizard: show }),
      setShowSettings: (show) => set({ showSettings: show }),
      setShowTutorials: (show) => set({ showTutorials: show }),
      
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // ============================================
      // Editor State
      // ============================================
      openFiles: [],
      activeFile: null,
      unsavedFiles: new Set(),
      
      openFile: (file) => set((state) => {
        const exists = state.openFiles.find(f => f.path === file.path);
        if (exists) {
          return { activeFile: file };
        }
        return {
          openFiles: [...state.openFiles, file],
          activeFile: file
        };
      }),
      
      closeFile: (filePath) => set((state) => {
        const newOpenFiles = state.openFiles.filter(f => f.path !== filePath);
        const newUnsaved = new Set(state.unsavedFiles);
        newUnsaved.delete(filePath);
        return {
          openFiles: newOpenFiles,
          unsavedFiles: newUnsaved,
          activeFile: state.activeFile?.path === filePath
            ? newOpenFiles[newOpenFiles.length - 1] || null
            : state.activeFile
        };
      }),
      
      setActiveFile: (file) => set({ activeFile: file }),
      
      markFileUnsaved: (filePath) => set((state) => {
        const newUnsaved = new Set(state.unsavedFiles);
        newUnsaved.add(filePath);
        return { unsavedFiles: newUnsaved };
      }),
      
      markFileSaved: (filePath) => set((state) => {
        const newUnsaved = new Set(state.unsavedFiles);
        newUnsaved.delete(filePath);
        return { unsavedFiles: newUnsaved };
      }),
      
      // ============================================
      // AI State
      // ============================================
      aiProvider: 'openrouter',  // 'openrouter' or 'ollama'
      aiModel: 'google/gemini-2.0-flash-exp:free',
      aiOnline: true,
      aiChat: [],
      
      setAiProvider: (provider) => set({ aiProvider: provider }),
      setAiModel: (model) => set({ aiModel: model }),
      setAiOnline: (online) => set({ aiOnline: online }),
      
      addAiMessage: (message) => set((state) => ({
        aiChat: [...state.aiChat, { ...message, timestamp: new Date().toISOString() }]
      })),
      
      clearAiChat: () => set({ aiChat: [] }),
      
      // ============================================
      // Terminal State
      // ============================================
      terminalOutput: [],
      terminalVisible: true,
      
      addTerminalLine: (line) => set((state) => ({
        terminalOutput: [...state.terminalOutput, { text: line, timestamp: new Date().toISOString() }].slice(-500)
      })),
      
      clearTerminal: () => set({ terminalOutput: [] }),
      setTerminalVisible: (visible) => set({ terminalVisible: visible }),
      
      // ============================================
      // Build State  
      // ============================================
      isBuilding: false,
      lastBuildStatus: null,
      buildOutput: [],
      
      setIsBuilding: (building) => set({ isBuilding: building }),
      setLastBuildStatus: (status) => set({ lastBuildStatus: status }),
      addBuildOutput: (output) => set((state) => ({
        buildOutput: [...state.buildOutput, output]
      })),
      clearBuildOutput: () => set({ buildOutput: [] }),
      
      // ============================================
      // Git State
      // ============================================
      gitStatus: null,
      gitBranch: 'main',
      
      setGitStatus: (status) => set({ gitStatus: status }),
      setGitBranch: (branch) => set({ gitBranch: branch }),
      
      // ============================================
      // Notification State
      // ============================================
      notifications: [],
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            ...notification,
            timestamp: new Date().toISOString()
          }
        ]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      clearNotifications: () => set({ notifications: [] }),
      
      // ============================================
      // Settings
      // ============================================
      settings: {
        theme: 'dark',
        fontSize: 14,
        fontFamily: 'JetBrains Mono, monospace',
        tabSize: 2,
        autoSave: true,
        autoSaveDelay: 1000,
        showMinimap: true,
        wordWrap: true,
        lineNumbers: true,
        openRouterApiKey: '',
        ollamaUrl: 'http://localhost:11434',
        preferredAiProvider: 'openrouter',
        preferredAiModel: 'google/gemini-2.0-flash-exp:free'
      },
      
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      resetSettings: () => set((state) => ({
        settings: {
          theme: 'dark',
          fontSize: 14,
          fontFamily: 'JetBrains Mono, monospace',
          tabSize: 2,
          autoSave: true,
          autoSaveDelay: 1000,
          showMinimap: true,
          wordWrap: true,
          lineNumbers: true,
          openRouterApiKey: state.settings.openRouterApiKey,
          ollamaUrl: 'http://localhost:11434',
          preferredAiProvider: 'openrouter',
          preferredAiModel: 'google/gemini-2.0-flash-exp:free'
        }
      })),
      
      // ============================================
      // System Stats
      // ============================================
      systemStats: {
        cpu: '0%',
        memory: '0GB',
        disk: 'N/A'
      },
      
      setSystemStats: (stats) => set({ systemStats: stats })
    }),
    {
      name: 'mineai-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these values
        recentProjects: state.recentProjects,
        settings: state.settings,
        aiProvider: state.aiProvider,
        aiModel: state.aiModel,
        sidebarCollapsed: state.sidebarCollapsed
      })
    }
  )
);

// Selector hooks for better performance
export const useCurrentProject = () => useStore((state) => state.currentProject);
export const useProjects = () => useStore((state) => state.projects);
export const useRecentProjects = () => useStore((state) => state.recentProjects);
export const useActiveTab = () => useStore((state) => state.activeTab);
export const useShowProjectWizard = () => useStore((state) => state.showProjectWizard);
export const useSettings = () => useStore((state) => state.settings);
export const useAiChat = () => useStore((state) => state.aiChat);
export const useNotifications = () => useStore((state) => state.notifications);
export const useIsBuilding = () => useStore((state) => state.isBuilding);
export const useGitStatus = () => useStore((state) => state.gitStatus);

export default useStore;