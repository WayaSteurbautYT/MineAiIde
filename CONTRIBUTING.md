# 🤝 Contributing to MineAI IDE

Thank you for your interest in contributing to MineAI IDE! We welcome all contributions, whether you're fixing bugs, adding features, improving documentation, or spreading the word.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Making Changes](#-making-changes)
- [Pull Request Process](#-pull-request-process)
- [Coding Standards](#-coding-standards)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)

---

## 📜 Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher
- **Git**
- **Python** 3.10+ (for native modules)
- **Visual Studio Build Tools** (Windows only)

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/MineAiIde.git
   cd MineAiIde
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/WayaSteurbautYT/MineAiIde.git
   ```

---

## 🛠️ Development Setup

### Install Dependencies

```bash
npm install
```

If you encounter native module errors on Windows:
```bash
npm install -g windows-build-tools
npm cache clean --force
npm install
```

### Start Development Server

```bash
npm run dev
```

This starts:
- Vite dev server for the renderer (React frontend)
- Electron main process with hot reload

### Project Structure

```
MineAIIDE/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.js     # App entry point
│   │   ├── project-manager.js
│   │   └── integrations/
│   ├── preload/        # Preload scripts (IPC bridge)
│   └── renderer/       # React frontend
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── stores/
├── public/             # Static assets
├── docs/               # Documentation
├── templates/          # Project templates (Forge, Fabric, etc.)
├── examples/           # Example mods created with MineAI
└── config/             # Configuration files
```

---

## ✏️ Making Changes

### Branch Naming

Create a branch for your work:

```bash
git checkout -b type/short-description
```

Types:
- `feat/` — New feature
- `fix/` — Bug fix
- `docs/` — Documentation only
- `refactor/` — Code refactoring
- `style/` — Formatting, no code change
- `test/` — Adding tests

Examples:
- `feat/add-texture-editor`
- `fix/build-error-windows`
- `docs/improve-api-reference`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Longer description if needed.

Fixes #123
```

Examples:
```
feat(ai): add support for Claude 3.5 Sonnet
fix(build): resolve Windows icon path issue
docs(readme): add quick install section
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests/linting:**
   ```bash
   npm run lint        # If available
   npm run build:win   # Ensure build works
   ```

3. **Test your changes manually**

### Submitting

1. Push your branch:
   ```bash
   git push origin feat/your-feature
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template:
   - What does this PR do?
   - Screenshots/GIFs if UI changes
   - Related issues

4. Wait for review — maintainers will respond within 48 hours

### After Review

- Address feedback by pushing new commits
- Once approved, a maintainer will merge

---

## 📝 Coding Standards

### JavaScript/React

```javascript
// Use arrow functions for components
const MyComponent = ({ prop }) => {
  return <div>{prop}</div>;
};

// Use async/await over .then()
const fetchData = async () => {
  const response = await api.getData();
  return response;
};

// Destructure props
const Button = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {label}
  </button>
);
```

### File Naming

- Components: `PascalCase.jsx` (e.g., `ProjectWizard.jsx`)
- Utilities: `kebab-case.js` (e.g., `ai-service.js`)
- Stores: `useCamelCase.js` (e.g., `useStore.js`)

### CSS/Tailwind

- Use Tailwind utility classes when possible
- Keep custom CSS minimal
- Group related utilities logically

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing [Issues](https://github.com/WayaSteurbautYT/MineAiIde/issues)
2. Try latest version
3. Reproduce consistently

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable.

**Environment:**
- OS: Windows 11
- MineAI Version: 1.0.0
- Node.js Version: 18.19.0

**Additional context**
Any other info.
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. "I'm frustrated when..."

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or other info.
```

---

## 🏆 Recognition

Contributors are recognized in:
- README credits section
- GitHub contributors page
- Release notes

---

## 📧 Questions?

- Open a [Discussion](https://github.com/WayaSteurbautYT/MineAiIde/discussions)
- Join our [Discord](https://discord.gg/mineai)
- Email: contribute@mineai.dev

---

**Thank you for making MineAI IDE better! ❤️**
