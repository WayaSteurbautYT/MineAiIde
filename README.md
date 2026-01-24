# 🎮 MineAI IDE

<div align="center">

![MineAI IDE Banner](public/assets/banner.png)

**The Ultimate AI-Powered Minecraft Development Environment**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen.svg)](https://github.com/mineai/mineai-ide/releases)
[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da.svg)](https://discord.gg/mineai)

*Create Minecraft mods, plugins, datapacks, and more with AI assistance — no coding experience required!*

[🚀 Download](#-installation) • [📖 Documentation](#-documentation) • [💬 Community](#-community) • [🤝 Contributing](#-contributing)

</div>

---

## ✨ Features

### 🤖 AI-Powered Development
- **Smart Code Generation** - Describe what you want, and AI creates the code
- **Natural Language Commands** - "Create a diamond sword that shoots fireballs"
- **Crash Log Analysis** - AI analyzes errors and provides fixes
- **Learning System** - AI improves based on your preferences

### 🎨 Visual Creation Suite
- **3D Model Editor** - Blockbench-style model creation
- **Texture Editor** - Pixel art textures with AI assistance
- **Animation Editor** - GeckoLib animation support
- **Drag & Drop** - Import .bbmodel, textures, and more

### 📦 All Project Types Supported
| Type | Description | Versions |
|------|-------------|----------|
| **Forge Mod** | Classic Minecraft Forge modding | 1.12.2 - 1.20.4 |
| **Fabric Mod** | Lightweight modern modding | 1.14 - 1.20.4 |
| **NeoForge Mod** | Next-gen Forge fork | 1.20.1 - 1.21 |
| **Spigot Plugin** | Server plugins | 1.8.8 - 1.20.4 |
| **Paper Plugin** | High-performance plugins | 1.19.4 - 1.20.4 |
| **Datapack** | Vanilla data-driven content | 1.13 - 1.20.4 |
| **Resource Pack** | Textures, models, sounds | All versions |
| **Modpack** | Curated collections | All versions |

### 🔧 Built-in Tools
- **Project Wizard** - Step-by-step project creation
- **Code Editor** - Syntax highlighting, autocomplete
- **Terminal** - Integrated command line
- **Git Integration** - Version control built-in
- **One-Click Build** - Compile and package instantly

### 🌐 Online + Offline
- **Cloud AI** - Powerful models via OpenRouter
- **Local AI** - Ollama support for offline work
- **Auto-Sync** - Seamless transition between modes
- **Team Collaboration** - Real-time editing (coming soon)

---

## 🖼️ Screenshots

<div align="center">
<img src="public/assets/screenshot-dashboard.gif" alt="Dashboard" width="80%">
<p><em>Project Dashboard with AI Assistant</em></p>

<img src="public/assets/screenshot-wizard.gif" alt="Project Wizard" width="80%">
<p><em>Step-by-Step Project Creation</em></p>

<img src="public/assets/screenshot-editor.gif" alt="Code Editor" width="80%">
<p><em>AI-Powered Code Editor</em></p>
</div>

---

## 📥 Installation

### Download Pre-built Binaries

| Platform | Download |
|----------|----------|
| Windows (x64) | [MineAI-IDE-1.0.0-win-x64.exe](https://github.com/mineai/mineai-ide/releases/latest) |
| Windows (ARM64) | [MineAI-IDE-1.0.0-win-arm64.exe](https://github.com/mineai/mineai-ide/releases/latest) |
| macOS (Intel) | [MineAI-IDE-1.0.0-mac-x64.dmg](https://github.com/mineai/mineai-ide/releases/latest) |
| macOS (Apple Silicon) | [MineAI-IDE-1.0.0-mac-arm64.dmg](https://github.com/mineai/mineai-ide/releases/latest) |
| Linux (AppImage) | [MineAI-IDE-1.0.0-linux.AppImage](https://github.com/mineai/mineai-ide/releases/latest) |
| Linux (deb) | [MineAI-IDE-1.0.0-linux.deb](https://github.com/mineai/mineai-ide/releases/latest) |

### Build from Source

```bash
# Clone the repository
git clone https://github.com/mineai/mineai-ide.git
cd mineai-ide

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for your platform
npm run build           # Current platform
npm run build:win       # Windows
npm run build:mac       # macOS
npm run build:linux     # Linux
npm run build:all       # All platforms
```

### Requirements
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **JDK**: 17+ (for mod building)
- **Gradle/Maven**: Auto-downloaded per project

---

## 🚀 Quick Start

### 1. Create Your First Mod

1. Open MineAI IDE
2. Click **"New Project"**
3. Select **Forge Mod** (or your preferred type)
4. Enter your mod name: `My Awesome Mod`
5. Select Minecraft version: `1.20.1`
6. Click **"Create Project"**

### 2. Add Content with AI

In the AI chat, type:
```
Create a ruby sword that deals 15 damage and has a special ability 
to shoot fireballs when right-clicked
```

MineAI will generate:
- Item class with custom damage
- Fireball shooting logic
- Model JSON
- Texture placeholder
- Recipe

### 3. Build & Test

1. Click **"Build Mod"** button (or press `Ctrl+B`)
2. Click **"Run Client"** (or press `F5`)
3. Test your mod in Minecraft!

---

## 🤖 AI Configuration

### Cloud AI (OpenRouter)
MineAI uses OpenRouter for cloud AI, which provides access to multiple models:
- Google Gemini 2.0 Flash (free tier)
- Claude 3.5 Sonnet
- GPT-4o
- Llama 3.2

A default API key is included for getting started. For heavy usage, get your own key at [openrouter.ai](https://openrouter.ai).

### Local AI (Ollama)
For offline development or privacy:

1. Install [Ollama](https://ollama.ai)
2. Pull a model: `ollama pull llama3.2` or `ollama pull codellama`
3. In MineAI settings, switch to "Local AI"
4. Select your model

Recommended local models:
- `llama3.2` - General purpose
- `codellama` - Code focused
- `deepseek-coder` - Code optimized
- `qwen2.5-coder` - Fast code generation

---

## 📖 Documentation

- [**Windows Build Guide**](docs/build-windows.md) ← Build from source on Windows
- [Getting Started Guide](docs/getting-started.md)
- [Project Types Overview](docs/project-types.md)
- [AI Commands Reference](docs/ai-commands.md)
- [GeckoLib Animation Guide](docs/geckolib-guide.md)
- [Blockbench Integration](docs/blockbench-guide.md)
- [CLI Reference](docs/cli-reference.md)
- [API Documentation](docs/api-reference.md)

---

## 🎯 Roadmap

### ✅ Version 1.0 (Current)
- [x] Core IDE functionality
- [x] AI code generation
- [x] Project wizard
- [x] All major mod types
- [x] Git integration
- [x] Windows/macOS/Linux builds

### 🚧 Version 1.1 (In Progress)
- [ ] Full 3D model editor
- [ ] Texture painting
- [ ] Animation timeline
- [ ] Team collaboration

### 📋 Version 1.2 (Planned)
- [ ] Community marketplace
- [ ] Plugin system
- [ ] Discord bot integration
- [ ] Live player maps

### 🔮 Future
- [ ] AI model training
- [ ] Mod analytics
- [ ] Automated testing
- [ ] One-click deployment

---

## 💬 Community

Join our community to get help, share creations, and contribute:

- **Discord**: [discord.gg/mineai](https://discord.gg/mineai)
- **Twitter/X**: [@MineAI_IDE](https://twitter.com/MineAI_IDE)
- **Reddit**: [r/MineAI](https://reddit.com/r/MineAI)
- **GitHub Discussions**: [Discussions](https://github.com/mineai/mineai-ide/discussions)

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Other Ways to Help
- 🐛 Report bugs via [Issues](https://github.com/mineai/mineai-ide/issues)
- 💡 Suggest features
- 📝 Improve documentation
- 🌍 Translate to other languages
- ⭐ Star the repository

### Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mineai-ide.git

# Install dependencies
npm install

# Start development
npm run dev
```

---

## 🏗️ Architecture

```
MineAIIDE/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.js
│   │   ├── project-manager.js
│   │   ├── agents/     # AI agent system
│   │   └── integrations/
│   ├── preload/        # Preload scripts
│   └── renderer/       # React frontend
│       ├── components/
│       ├── pages/
│       ├── services/   # AI, Database, etc.
│       └── stores/     # State management
├── agents/             # AI agent definitions
├── templates/          # Project templates
├── config/             # Configuration files
└── public/             # Static assets
```

---

## 📄 License

MineAI IDE is open source software licensed under the [MIT License](LICENSE).

---

## 🙏 Credits

MineAI IDE is built on the shoulders of giants:

- [Electron](https://electronjs.org/) - Cross-platform desktop apps
- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tooling
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Three.js](https://threejs.org/) - 3D rendering
- [OpenRouter](https://openrouter.ai/) - AI model access
- [Ollama](https://ollama.ai/) - Local AI

Special thanks to the Minecraft modding community and content creators who inspired this project:
- Notch & Jeb - For creating Minecraft
- Technoblade - For the never-give-up spirit 👑
- Dream - For creative problem solving
- Hypixel Team - For server innovation
- All the amazing mod developers

---

<div align="center">

**Made with ❤️ for the Minecraft Community**

*"Every great build starts with a single block."*

⭐ Star this repo if MineAI helps you create something awesome! ⭐

</div>