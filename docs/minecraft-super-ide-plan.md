# Minecraft Super IDE Plan (Cursor + Codex + MCreator + Blockbench)

This plan turns MineAI into a **Minecraft-native AI IDE** focused on mods, plugins, datapacks, resource packs, animations, textures, and models.

## 1) Product Direction

Build a workspace that combines:

- **Cursor/Codex coding flow** (AI-first editor, inline edits, multi-file refactors).
- **MCreator-style visual tools** (non-coders can build content with forms and visual workflows).
- **Blockbench + GeckoLib pipeline** (modeling and animation directly in-IDE).
- **Multi-provider AI** (free + paid, local + cloud).
- **MCP-enhanced context** (server docs, APIs, project files, version-specific data).

## 2) Core Personas

- **No-code creator:** wants item/block/entity generation via guided prompts + forms.
- **Hybrid creator:** mixes visual tooling with generated Java/Kotlin/JS and command files.
- **Advanced coder:** wants full code control, review diffs, and deterministic build tools.

## 3) Scope of Minecraft Workloads

The IDE should have first-class templates and toolchains for:

- Forge / Fabric / NeoForge mods.
- Spigot / Paper / Velocity plugins.
- Datapacks.
- Resource packs.
- GeckoLib entities + animation controllers.
- Texture/model/asset pipelines.

## 4) Experience Pillars

### A. Agentic Coding (Cursor/Codex vibe)

- Inline edit commands: explain, fix, refactor, optimize, convert API versions.
- File-aware and project-aware chat with semantic retrieval.
- Command palette actions for Minecraft tasks ("Add custom item", "Register block", "Generate recipe").
- Multi-agent workflow:
  - **Architect Agent** (design + constraints)
  - **Generator Agent** (code + assets)
  - **Verifier Agent** (compile/test/lint)
  - **Migration Agent** (version upgrades)

### B. Visual Builders (MCreator vibe)

- Item/Block/Entity wizards that generate code and JSON.
- Recipe + loot table editor.
- Datapack function + predicate + advancement editor.
- Plugin command/event scaffolder.

### C. Asset Studio

- Embedded/manual texture painting canvas (layers, palette presets, UV preview).
- Model workspace with Blockbench import/export and live preview.
- GeckoLib animation timeline preview and controller code generation.

### D. AI Providers and Cost Modes

- **Free modes:** Ollama local models, optional low-cost OpenRouter models.
- **Paid modes:** premium models through OpenRouter and direct providers.
- Per-agent model routing (cheap model for drafts, strong model for final generation).
- Token and cost dashboard with strict budget caps.

### E. MCP-Driven Context

Support MCP connectors for project-aware recommendations and retrieval. Priority connectors:

- `Context7` for code/doc context.
- `Storm` and custom Minecraft MCPs for ecosystem intelligence.
- Docs indexers for Bukkit/Paper/Fabric/Forge mappings.
- Workspace MCP for AST + symbol search.

## 5) Architecture Proposal

- **Desktop shell:** Electron + React UI.
- **AI orchestration layer:** provider abstraction + agent runner + tool-call sandbox.
- **Language services:** LSP + tree-sitter parsers for Java, Kotlin, JSON, mcfunction.
- **Build orchestrators:** Gradle/Maven wrappers, Paper build/test runners, datapack validators.
- **Asset services:** texture editor engine, model converter, animation compiler.
- **Persistence:** project metadata, prompts, model routing rules, budget policies.

## 6) Feature Backlog (Ranked)

### Phase 1 — Foundation

1. Unified provider manager (Ollama + OpenRouter + API profiles).
2. Prompt-to-scaffold for all project types (mods/plugins/datapacks/resource packs).
3. MCP manager UI (connect/disconnect/test, scoped permissions).
4. Agent task runner with plan/execute/review loops.

### Phase 2 — Minecraft Specialized Assist

1. Smart generators:
   - Items, blocks, entities, recipes, loot tables, tags, advancements.
2. Plugin helpers:
   - Command registration, event listeners, config generation.
3. Version-aware compatibility suggestions.
4. Build-error auto-fix loops with explanation.

### Phase 3 — Asset + Animation Studio

1. Manual texture painting tool (pen/fill/layers/export atlas).
2. Blockbench bridge (open/import/export, format checks).
3. GeckoLib animation editor + generated controller stubs.
4. Live in-IDE preview panel for models/animations.

### Phase 4 — Multi-Agent "Vibe Build" Mode

1. "Build this idea" pipeline:
   - Prompt → architecture plan → code/assets → compile/test → patch review.
2. Team handoff logs (what each agent changed and why).
3. One-click packaging (JAR/zip) with changelog and publish metadata.

## 7) Safety and Reliability

- Sandboxed tool calls with explicit file/path permissions.
- "AI patch preview" mode before apply.
- Provenance labels for AI-created files and edits.
- Optional local-only mode for privacy-sensitive creators.

## 8) Success Metrics

- Time-to-first-playable artifact (mod/plugin/datapack).
- Build success rate after first AI generation.
- Number of manual edits required after generation.
- Cost per successful generated feature.
- Creator retention in hybrid mode (visual + code + AI).

## 9) Immediate Next Steps

1. Ship provider manager + MCP manager in one settings flow.
2. Add "Minecraft Command Palette" with top 20 common tasks.
3. Implement template-driven generators for item/block/recipe across Forge + Paper.
4. Prototype texture painter and Blockbench bridge in a single asset tab.
5. Add verifier agent that auto-runs build/test and proposes fixes.

---

This plan is intentionally modular: MineAI can deliver value early with coding + scaffolding, then progressively add advanced modeling/animation and multi-agent automation.
