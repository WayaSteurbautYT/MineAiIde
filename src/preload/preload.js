/**
 * MineAI IDE - Preload Script
 * Exposes secure APIs to the renderer process
 */

const { contextBridge, ipcRenderer } = require('electron');

// ============================================
// Window Controls
// ============================================
contextBridge.exposeInMainWorld('windowControls', {
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized')
});

// ============================================
// File System Operations
// ============================================
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  readFile: (filePath) => ipcRenderer.invoke('read-file', { filePath }),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', { filePath, content }),
  readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', { dirPath }),
  createDirectory: (dirPath) => ipcRenderer.invoke('create-directory', { dirPath }),
  deleteFile: (filePath) => ipcRenderer.invoke('delete-file', { filePath }),
  renameFile: (oldPath, newPath) => ipcRenderer.invoke('rename-file', { oldPath, newPath }),
  
  // Dialogs
  openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
  saveFileDialog: (options) => ipcRenderer.invoke('save-file-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // System info
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  getAppPaths: () => ipcRenderer.invoke('get-app-paths'),
  
  // Shell operations
  openExternal: (url) => ipcRenderer.invoke('shell-open-external', { url }),
  openPath: (filePath) => ipcRenderer.invoke('shell-open-path', { filePath }),
  showItemInFolder: (filePath) => ipcRenderer.invoke('shell-show-item', { filePath }),
  
  // Build operations (legacy)
  buildMod: (config) => ipcRenderer.invoke('build-mod', config),
  generateCode: ({ prompt }) => ipcRenderer.invoke('generate-code', { prompt })
});

// ============================================
// Project Management
// ============================================
contextBridge.exposeInMainWorld('projectAPI', {
  create: (options) => ipcRenderer.invoke('project-create', options),
  load: (projectPath) => ipcRenderer.invoke('project-load', { projectPath }),
  getAll: () => ipcRenderer.invoke('project-get-all'),
  delete: (projectPath) => ipcRenderer.invoke('project-delete', { projectPath }),
  export: (projectPath, outputPath) => ipcRenderer.invoke('project-export', { projectPath, outputPath }),
  import: (zipPath, name) => ipcRenderer.invoke('project-import', { zipPath, name }),
  getTypes: () => ipcRenderer.invoke('project-get-types'),
  
  // Build
  build: (projectPath, config) => ipcRenderer.invoke('build-mod', { projectPath, config }),
  runMinecraft: (projectPath, side) => ipcRenderer.invoke('run-minecraft', { projectPath, side })
});

// ============================================
// Git Operations
// ============================================
contextBridge.exposeInMainWorld('gitAPI', {
  init: (projectPath) => ipcRenderer.invoke('git-init', { projectPath }),
  status: (projectPath) => ipcRenderer.invoke('git-status', { projectPath }),
  commit: (projectPath, message) => ipcRenderer.invoke('git-commit', { projectPath, message }),
  push: (projectPath) => ipcRenderer.invoke('git-push', { projectPath }),
  pull: (projectPath) => ipcRenderer.invoke('git-pull', { projectPath }),
  addRemote: (projectPath, name, url) => ipcRenderer.invoke('git-add-remote', { projectPath, name, url }),
  log: (projectPath, limit) => ipcRenderer.invoke('git-log', { projectPath, limit }),
  quickSave: (projectPath, message) => ipcRenderer.invoke('git-quick-save', { projectPath, message })
});

// ============================================
// Menu Event Listeners
// ============================================
contextBridge.exposeInMainWorld('menuEvents', {
  onNewProject: (callback) => ipcRenderer.on('menu-new-project', callback),
  onOpenProject: (callback) => ipcRenderer.on('menu-open-project', callback),
  onSave: (callback) => ipcRenderer.on('menu-save', callback),
  onSaveAll: (callback) => ipcRenderer.on('menu-save-all', callback),
  onBuild: (callback) => ipcRenderer.on('menu-build', callback),
  onRunClient: (callback) => ipcRenderer.on('menu-run-client', callback),
  onRunServer: (callback) => ipcRenderer.on('menu-run-server', callback),
  onExport: (callback) => ipcRenderer.on('menu-export', callback),
  onAiAsk: (callback) => ipcRenderer.on('menu-ai-ask', callback),
  onAiGenerate: (callback) => ipcRenderer.on('menu-ai-generate', callback),
  onAiSettings: (callback) => ipcRenderer.on('menu-ai-settings', callback),
  onTutorials: (callback) => ipcRenderer.on('menu-tutorials', callback),
  onAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // Build output listener
  onBuildOutput: (callback) => ipcRenderer.on('build-output', (event, data) => callback(data)),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// ============================================
// App Info
// ============================================
contextBridge.exposeInMainWorld('appInfo', {
  version: '1.0.0',
  name: 'MineAI IDE',
  platform: process.platform,
  arch: process.arch
});

// Log that preload is ready
console.log('[MineAI Preload] APIs exposed to renderer');