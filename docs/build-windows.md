# Building MineAI IDE for Windows

This guide covers building MineAI IDE from source on Windows.

---

## Prerequisites

Before building, ensure you have the following installed:

### Required Software

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0+ | Comes with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **Python** | 3.10+ | [python.org](https://www.python.org/) |
| **Visual Studio Build Tools** | 2019+ | See below |

### Installing Visual Studio Build Tools

Native modules (`canvas`, `sharp`, etc.) require Visual Studio Build Tools:

1. Download [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
2. Run the installer
3. Select **"Desktop development with C++"** workload
4. Ensure these components are checked:
   - MSVC v143 (or latest)
   - Windows 10/11 SDK
   - C++ CMake tools (optional but recommended)
5. Install and restart your terminal

Alternatively, run this in an **admin** PowerShell:
```powershell
npm install -g windows-build-tools
```

### Verify Prerequisites

```bash
node -v   # Should print v18.x or higher
npm -v    # Should print 9.x or higher
git --version
python --version  # Should print Python 3.10+
```

---

## Build Steps

### 1. Clone the Repository

```bash
git clone https://github.com/WayaSteurbautYT/MineAiIde.git
cd MineAiIde
```

### 2. Install Dependencies

```bash
npm install
```

> **Troubleshooting:** If native modules fail, ensure Python and VS Build Tools are installed. Then run:
> ```bash
> npm cache clean --force
> npm install
> ```

### 3. Build for Windows

```bash
npm run build:win
```

This command:
1. Builds the renderer (Vite/React) into `src/renderer/dist/`
2. Packages the Electron app via `electron-builder`
3. Outputs installers to the `release/` folder

### 4. Locate Build Artifacts

After a successful build, find installers in:
```
release/
├── mineai-ide-1.0.0-x64-setup.exe   # NSIS installer
└── mineai-ide-1.0.0.exe             # Portable executable
```

---

## Common Errors & Fixes

### Error: `node-gyp` or native module build failure
**Cause:** Missing Visual Studio Build Tools or Python.  
**Fix:** Install VS Build Tools with C++ workload and Python 3.10+.

### Error: `ENOENT: no such file or directory` for icon
**Cause:** Icon file path mismatch.  
**Fix:** Ensure `public/icons/icon.svg` exists (already configured).

### Error: `npm ERR! code EPERM`
**Cause:** Permission issue.  
**Fix:** Run Command Prompt as Administrator, or delete `node_modules` and reinstall.

### Build completes but app won't launch
**Cause:** Missing renderer build.  
**Fix:** Ensure `npm run build:renderer` completes before packaging. If the `dist/` folder is empty, check Vite config.

---

## Development Mode

To run in development mode without building:
```bash
npm run dev
```
This starts Vite dev server + Electron concurrently.

---

## Full Release Checklist

- [ ] Prerequisites installed (Node, npm, Git, Python, VS Build Tools)
- [ ] `npm install` succeeds without errors
- [ ] `npm run build:win` produces artifacts in `release/`
- [ ] NSIS installer runs and installs correctly
- [ ] Portable `.exe` launches without installer

---

## Need Help?

- Open an issue: [GitHub Issues](https://github.com/WayaSteurbautYT/MineAiIde/issues)
- Check the main [README](../README.md) for general info
