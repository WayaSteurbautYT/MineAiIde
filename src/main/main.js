/**
 * MineAI IDE - Main Process
 * Electron main process with enhanced features for Minecraft modding
 */

import { app, BrowserWindow, ipcMain, screen, dialog, shell, Menu, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { spawn, exec } from 'child_process';
import os from 'os';

// Import our services
import { ProjectManager, projectManager } from './project-manager.js';
import { createGitManager } from './integrations/git-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

/**
 * Create the main application window
 */
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: Math.min(width, 1600),
    height: Math.min(height, 900),
    minWidth: 1024,
    minHeight: 768,
    title: "MineAI IDE",
    backgroundColor: '#020617',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
    },
    titleBarStyle: process.platform === 'win32' ? 'default' : 'hiddenInset',
    frame: true,
    show: false,
    icon: path.join(__dirname, '../../public/icons/icon.svg')
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Load content based on environment
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3004');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createAppMenu();
}

/**
 * Create application menu
 */
function createAppMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow?.webContents.send('menu-new-project')
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow?.webContents.send('menu-open-project')
        },
        { type: 'separator' },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-save')
        },
        {
          label: 'Save All',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => mainWindow?.webContents.send('menu-save-all')
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Project',
      submenu: [
        {
          label: 'Build',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow?.webContents.send('menu-build')
        },
        {
          label: 'Run Client',
          accelerator: 'F5',
          click: () => mainWindow?.webContents.send('menu-run-client')
        },
        {
          label: 'Run Server',
          accelerator: 'Shift+F5',
          click: () => mainWindow?.webContents.send('menu-run-server')
        },
        { type: 'separator' },
        {
          label: 'Export...',
          click: () => mainWindow?.webContents.send('menu-export')
        }
      ]
    },
    {
      label: 'AI',
      submenu: [
        {
          label: 'Ask MineAI',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow?.webContents.send('menu-ai-ask')
        },
        {
          label: 'Generate Code',
          accelerator: 'CmdOrCtrl+G',
          click: () => mainWindow?.webContents.send('menu-ai-generate')
        },
        { type: 'separator' },
        {
          label: 'AI Settings',
          click: () => mainWindow?.webContents.send('menu-ai-settings')
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://mineai.dev/docs')
        },
        {
          label: 'Tutorials',
          click: () => mainWindow?.webContents.send('menu-tutorials')
        },
        { type: 'separator' },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/mineai/mineai-ide/issues')
        },
        { type: 'separator' },
        {
          label: 'About MineAI IDE',
          click: () => mainWindow?.webContents.send('menu-about')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ============================================
// IPC Handlers - File Operations
// ============================================

ipcMain.handle('read-file', async (event, { filePath }) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, { filePath, content }) => {
  try {
    await fs.writeFile(filePath, content, 'utf8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-directory', async (event, { dirPath }) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = entries.map(entry => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile()
    }));
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-directory', async (event, { dirPath }) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-file', async (event, { filePath }) => {
  try {
    await fs.rm(filePath, { recursive: true, force: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('rename-file', async (event, { oldPath, newPath }) => {
  try {
    await fs.rename(oldPath, newPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============================================
// IPC Handlers - Dialogs
// ============================================

ipcMain.handle('open-file-dialog', async (event, options = {}) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: options.directory ? ['openDirectory'] : ['openFile'],
    filters: options.filters || [
      { name: 'Minecraft Files', extensions: ['json', 'bbmodel', 'java', 'png', 'mcfunction'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    ...options
  });
  return result;
});

ipcMain.handle('save-file-dialog', async (event, options = {}) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    filters: options.filters || [
      { name: 'All Files', extensions: ['*'] }
    ],
    ...options
  });
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  return await dialog.showMessageBox(mainWindow, options);
});

// ============================================
// IPC Handlers - System Info
// ============================================

ipcMain.handle('get-system-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    electronVersion: process.versions.electron,
    cpus: os.cpus().length,
    memory: Math.round(os.totalmem() / (1024 * 1024 * 1024)),
    freeMemory: Math.round(os.freemem() / (1024 * 1024 * 1024)),
    homeDir: os.homedir(),
    tempDir: os.tmpdir()
  };
});

ipcMain.handle('get-app-paths', () => {
  return {
    userData: app.getPath('userData'),
    documents: app.getPath('documents'),
    downloads: app.getPath('downloads'),
    temp: app.getPath('temp'),
    appData: app.getPath('appData')
  };
});

// ============================================
// IPC Handlers - Window Controls
// ============================================

ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
  return mainWindow?.isMaximized();
});

ipcMain.handle('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow?.isMaximized();
});

// ============================================
// IPC Handlers - Project Management
// ============================================

ipcMain.handle('project-create', async (event, options) => {
  try {
    await projectManager.init();
    const result = await projectManager.createProject(options);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project-load', async (event, { projectPath }) => {
  try {
    const result = await projectManager.loadProject(projectPath);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project-get-all', async () => {
  try {
    await projectManager.init();
    const result = await projectManager.getAllProjects();
    return result;
  } catch (error) {
    return { success: false, error: error.message, projects: [] };
  }
});

ipcMain.handle('project-delete', async (event, { projectPath }) => {
  try {
    const result = await projectManager.deleteProject(projectPath);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project-export', async (event, { projectPath, outputPath }) => {
  try {
    const result = await projectManager.exportProject(projectPath, outputPath);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project-import', async (event, { zipPath, name }) => {
  try {
    const result = await projectManager.importProject(zipPath, name);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('project-get-types', () => {
  return projectManager.getProjectTypes();
});

// ============================================
// IPC Handlers - Git Operations
// ============================================

ipcMain.handle('git-init', async (event, { projectPath }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.init();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-status', async (event, { projectPath }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.getStatus();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-commit', async (event, { projectPath, message }) => {
  try {
    const git = createGitManager(projectPath);
    await git.add('.');
    const result = await git.commit(message);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-push', async (event, { projectPath }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.push();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-pull', async (event, { projectPath }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.pull();
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-add-remote', async (event, { projectPath, name, url }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.addRemote(name, url);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-log', async (event, { projectPath, limit }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.getLog({ maxCount: limit || 20 });
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-quick-save', async (event, { projectPath, message }) => {
  try {
    const git = createGitManager(projectPath);
    const result = await git.quickSave(message);
    return result;
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============================================
// IPC Handlers - Build Operations
// ============================================

ipcMain.handle('build-mod', async (event, { projectPath, config }) => {
  try {
    // Determine build tool based on project config
    const configPath = path.join(projectPath, 'mineai.config.json');
    const projectConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
    
    let buildCommand;
    let buildArgs;
    
    if (projectConfig.type === 'spigot' || projectConfig.type === 'paper') {
      // Maven build
      buildCommand = process.platform === 'win32' ? 'mvn.cmd' : 'mvn';
      buildArgs = ['clean', 'package'];
    } else if (['forge', 'fabric', 'neoforge', 'quilt'].includes(projectConfig.type)) {
      // Gradle build
      buildCommand = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
      buildArgs = ['build'];
    } else {
      // No build needed for datapacks/resourcepacks
      return { success: true, message: 'No build required for this project type' };
    }
    
    return new Promise((resolve) => {
      const buildProcess = spawn(buildCommand, buildArgs, {
        cwd: projectPath,
        shell: true
      });
      
      let output = '';
      let errorOutput = '';
      
      buildProcess.stdout.on('data', (data) => {
        output += data.toString();
        mainWindow?.webContents.send('build-output', data.toString());
      });
      
      buildProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        mainWindow?.webContents.send('build-output', data.toString());
      });
      
      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          resolve({ success: false, error: errorOutput || 'Build failed', output });
        }
      });
      
      buildProcess.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });
    });
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('run-minecraft', async (event, { projectPath, side }) => {
  try {
    const configPath = path.join(projectPath, 'mineai.config.json');
    const projectConfig = JSON.parse(await fs.readFile(configPath, 'utf8'));
    
    if (!['forge', 'fabric', 'neoforge', 'quilt'].includes(projectConfig.type)) {
      return { success: false, error: 'Only mod projects can run Minecraft directly' };
    }
    
    const gradleCommand = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
    const task = side === 'server' ? 'runServer' : 'runClient';
    
    const process = spawn(gradleCommand, [task], {
      cwd: projectPath,
      shell: true,
      detached: true
    });
    
    process.unref();
    
    return { success: true, message: `Started Minecraft ${side}` };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ============================================
// IPC Handlers - Shell Operations
// ============================================

ipcMain.handle('shell-open-external', async (event, { url }) => {
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.handle('shell-open-path', async (event, { filePath }) => {
  await shell.openPath(filePath);
  return { success: true };
});

ipcMain.handle('shell-show-item', async (event, { filePath }) => {
  shell.showItemInFolder(filePath);
  return { success: true };
});

// ============================================
// App Lifecycle
// ============================================

app.whenReady().then(async () => {
  // Initialize project manager
  await projectManager.init();
  
  // Create window
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (navigationEvent, navigationUrl) => {
    navigationEvent.preventDefault();
    shell.openExternal(navigationUrl);
  });
  
  // Prevent navigation to external URLs
  contents.on('will-navigate', (navigationEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.origin !== 'http://localhost:3004' && !navigationUrl.startsWith('file://')) {
      navigationEvent.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});