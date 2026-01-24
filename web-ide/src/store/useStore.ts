import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  type: 'forge' | 'fabric' | 'quilt' | 'neoforge' | 'spigot' | 'datapack';
  version: string;
  minecraftVersion: string;
  path: string;
  created: Date;
  modified: Date;
  description?: string;
  dependencies?: string[];
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  content?: string;
  children?: FileNode[];
  language?: string;
}

interface StoreState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // File System
  fileTree: FileNode[];
  currentFile: FileNode | null;
  setCurrentFile: (file: FileNode | null) => void;
  updateFileContent: (path: string, content: string) => void;
  setFileTree: (tree: FileNode[]) => void;

  // IDE Settings
  theme: 'dark' | 'light';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setWordWrap: (wrap: boolean) => void;

  // Build & Run
  isBuilding: boolean;
  buildOutput: string;
  setIsBuilding: (building: boolean) => void;
  setBuildOutput: (output: string) => void;
  appendBuildOutput: (output: string) => void;

  // Agent Chat
  agentHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  addToAgentHistory: (message: { role: 'user' | 'assistant'; content: string }) => void;
  clearAgentHistory: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Projects
  projects: [],
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...updates } : state.currentProject,
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  // File System
  fileTree: [],
  currentFile: null,
  setCurrentFile: (file) => set({ currentFile: file }),
  updateFileContent: (path, content) =>
    set((state) => {
      const updateTree = (nodes: FileNode[]): FileNode[] =>
        nodes.map((node) => {
          if (node.path === path) {
            return { ...node, content };
          }
          if (node.children) {
            return { ...node, children: updateTree(node.children) };
          }
          return node;
        });

      return {
        fileTree: updateTree(state.fileTree),
        currentFile: state.currentFile?.path === path ? { ...state.currentFile, content } : state.currentFile,
      };
    }),
  setFileTree: (tree) => set({ fileTree: tree }),

  // IDE Settings
  theme: 'dark',
  fontSize: 14,
  tabSize: 4,
  wordWrap: true,
  setTheme: (theme) => set({ theme }),
  setFontSize: (fontSize) => set({ fontSize }),
  setTabSize: (tabSize) => set({ tabSize }),
  setWordWrap: (wordWrap) => set({ wordWrap }),

  // Build & Run
  isBuilding: false,
  buildOutput: '',
  setIsBuilding: (isBuilding) => set({ isBuilding }),
  setBuildOutput: (buildOutput) => set({ buildOutput }),
  appendBuildOutput: (output) =>
    set((state) => ({ buildOutput: state.buildOutput + output })),

  // Agent Chat
  agentHistory: [],
  addToAgentHistory: (message) =>
    set((state) => ({
      agentHistory: [...state.agentHistory, { ...message, timestamp: new Date() }],
    })),
  clearAgentHistory: () => set({ agentHistory: [] }),
}));
