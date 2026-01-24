/**
 * MineAI IDE Advanced - Main Process
 * Enhanced with Cofounder Integration and Advanced AI Features
 * WayaCreate Vision Implementation
 */

import { app, BrowserWindow, ipcMain, screen, dialog, shell, Menu, nativeTheme, autoUpdater } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { spawn, exec } from 'child_process';
import os from 'os';

// Import our advanced services
import { AdvancedProjectManager } from './project-manager.js';
import { AIAgentManager } from './ai-agent-manager.js';
import { BlockbenchIntegration } from './blockbench-integration.js';
import { GeckoLibAnimationSystem } from './geckolib-animations.js';
import { CoquiTTSIntegration } from './coqui-tts-integration.js';
import { CofounderToolsBridge } from '../cofounder-tools-integration/bridge.js';
import { MCPToolChain } from './mcp-toolchain.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let aiAgentWindow;
let blockbenchWindow;
let animationWindow;

// Auto-updater configuration
if (process.env.NODE_ENV === 'production') {
  autoUpdater.checkForUpdatesAndNotify();
}

/**
 * Create the main application window with advanced features
 */
function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: Math.min(width, 1920),
    height: Math.min(height, 1080),
    minWidth: 1200,
    minHeight: 800,
    title: "MineAI IDE Advanced - WayaCreate Vision",
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      experimentalFeatures: true,
    },
    titleBarStyle: process.platform === 'win32' ? 'default' : 'hiddenInset',
    frame: true,
    show: false,
    icon: path.join(__dirname, '../../public/icons/icon.png'),
    vibrancy: 'dark',
    visualEffectState: 'active',
  });

  // Load the advanced IDE
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Initialize all systems
    initializeAdvancedSystems();
  });

  // Handle window state
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (aiAgentWindow) aiAgentWindow.close();
    if (blockbenchWindow) blockbenchWindow.close();
    if (animationWindow) animationWindow.close();
  });

  // Setup advanced menu
  setupAdvancedMenu();
}

/**
 * Initialize all advanced systems
 */
async function initializeAdvancedSystems() {
  console.log('[Main] Initializing advanced systems...');
  
  try {
    // Initialize AI Agent Manager
    const aiManager = new AIAgentManager();
    await aiManager.initialize();
    
    // Initialize Blockbench Integration
    const blockbench = new BlockbenchIntegration();
    await blockbench.initialize();
    
    // Initialize GeckoLib Animation System
    const geckolib = new GeckoLibAnimationSystem();
    await geckolib.initialize();
    
    // Initialize Coqui TTS
    const tts = new CoquiTTSIntegration();
    await tts.initialize();
    
    // Initialize Cofounder Tools Bridge
    const cofounder = new CofounderToolsBridge();
    await cofounder.initialize();
    
    // Initialize MCP Tool Chain
    const mcpChain = new MCPToolChain();
    await mcpChain.initialize();
    
    console.log('[Main] All advanced systems initialized successfully');
    
    // Notify renderer
    mainWindow.webContents.send('systems-initialized', {
      aiAgent: true,
      blockbench: true,
      geckolib: true,
      tts: true,
      cofounder: true,
      mcp: true
    });
    
  } catch (error) {
    console.error('[Main] Failed to initialize advanced systems:', error);
    dialog.showErrorBox('Initialization Error', 'Failed to initialize some advanced features.');
  }
}

/**
 * Setup advanced menu with all features
 */
function setupAdvancedMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-project');
          }
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open-project');
          }
        },
        { type: 'separator' },
        {
          label: 'Import from Cofounder',
          click: () => {
            mainWindow.webContents.send('menu-import-cofounder');
          }
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
        { role: 'selectall' }
      ]
    },
    {
      label: 'AI Tools',
      submenu: [
        {
          label: 'AI Agent Chat',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => {
            createAIAgentWindow();
          }
        },
        {
          label: 'Code Generation',
          accelerator: 'CmdOrCtrl+Shift+G',
          click: () => {
            mainWindow.webContents.send('menu-ai-generate');
          }
        },
        {
          label: 'Voice Commands',
          accelerator: 'CmdOrCtrl+Shift+V',
          click: () => {
            mainWindow.webContents.send('menu-voice-commands');
          }
        }
      ]
    },
    {
      label: 'Minecraft Tools',
      submenu: [
        {
          label: 'Blockbench Studio',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            createBlockbenchWindow();
          }
        },
        {
          label: 'Animation Editor',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => {
            createAnimationWindow();
          }
        },
        {
          label: 'Texture Designer',
          click: () => {
            mainWindow.webContents.send('menu-texture-designer');
          }
        },
        {
          label: 'Sound Designer',
          click: () => {
            mainWindow.webContents.send('menu-sound-designer');
          }
        }
      ]
    },
    {
      label: 'Build',
      submenu: [
        {
          label: 'Build Project',
          accelerator: 'CmdOrCtrl+Shift+B',
          click: () => {
            mainWindow.webContents.send('menu-build');
          }
        },
        {
          label: 'Run Minecraft',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('menu-run-minecraft');
          }
        },
        {
          label: 'Deploy to Server',
          click: () => {
            mainWindow.webContents.send('menu-deploy');
          }
        }
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
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'WayaCreate Documentation',
          click: () => {
            shell.openExternal('https://youtube.com/@wayacreate');
          }
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/WayaSteurbautYT/MineAI-IDE-Advanced/issues');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * Create AI Agent Window
 */
function createAIAgentWindow() {
  if (aiAgentWindow) {
    aiAgentWindow.focus();
    return;
  }

  aiAgentWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    modal: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  aiAgentWindow.loadURL('http://localhost:3000/ai-agent');
  
  aiAgentWindow.once('ready-to-show', () => {
    aiAgentWindow.show();
  });

  aiAgentWindow.on('closed', () => {
    aiAgentWindow = null;
  });
}

/**
 * Create Blockbench Integration Window
 */
function createBlockbenchWindow() {
  if (blockbenchWindow) {
    blockbenchWindow.focus();
    return;
  }

  blockbenchWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    parent: mainWindow,
    modal: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  blockbenchWindow.loadURL('http://localhost:3000/blockbench');
  
  blockbenchWindow.once('ready-to-show', () => {
    blockbenchWindow.show();
  });

  blockbenchWindow.on('closed', () => {
    blockbenchWindow = null;
  });
}

/**
 * Create Animation Editor Window
 */
function createAnimationWindow() {
  if (animationWindow) {
    animationWindow.focus();
    return;
  }

  animationWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    parent: mainWindow,
    modal: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  animationWindow.loadURL('http://localhost:3000/animation-editor');
  
  animationWindow.once('ready-to-show', () => {
    animationWindow.show();
  });

  animationWindow.on('closed', () => {
    animationWindow = null;
  });
}

// IPC Handlers for advanced features
ipcMain.handle('get-system-info', async () => {
  return {
    platform: os.platform(),
    arch: os.arch(),
    version: os.version(),
    cpus: os.cpus(),
    totalmem: os.totalmem(),
    freemem: os.freemem()
  };
});

ipcMain.handle('ai-generate-code', async (event, prompt, context) => {
  const aiManager = new AIAgentManager();
  return await aiManager.generateCode(prompt, context);
});

ipcMain.handle('tts-speak', async (event, text, voice = 'wayacreate') => {
  const tts = new CoquiTTSIntegration();
  return await tts.speak(text, voice);
});

ipcMain.handle('blockbench-export-model', async (event, modelData) => {
  const blockbench = new BlockbenchIntegration();
  return await blockbench.exportModel(modelData);
});

ipcMain.handle('geckolib-create-animation', async (event, animationData) => {
  const geckolib = new GeckoLibAnimationSystem();
  return await geckolib.createAnimation(animationData);
});

ipcMain.handle('cofounder-import-project', async (event, projectPath) => {
  const cofounder = new CofounderToolsBridge();
  return await cofounder.importProject(projectPath);
});

ipcMain.handle('mcp-execute-tool', async (event, toolName, parameters) => {
  const mcpChain = new MCPToolChain();
  return await mcpChain.executeTool(toolName, parameters);
});

// Auto-updater events
autoUpdater.on('update-available', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version of MineAI IDE is available. Downloading now...',
    buttons: ['OK']
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. Restart the application to apply updates.',
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// App event handlers
app.whenReady().then(() => {
  createMainWindow();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
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
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

console.log('[Main] MineAI IDE Advanced - WayaCreate Vision starting...');
