import React, { useMemo, useState } from 'react';
import { Search, Play, Wand2 } from 'lucide-react';

interface CommandTask {
  id: string;
  category: 'Mods' | 'Plugins' | 'Datapacks' | 'Assets' | 'Ops';
  label: string;
  prompt: string;
}

interface MinecraftCommandPaletteProps {
  onRunTask: (prompt: string) => void;
}

const COMMAND_TASKS: CommandTask[] = [
  {
    id: 'forge-item',
    category: 'Mods',
    label: 'Generate Forge custom item + recipe',
    prompt: 'Create a Forge 1.20.1 custom item called ruby_wand with crafting recipe, lang entry, and item model JSON.'
  },
  {
    id: 'fabric-block',
    category: 'Mods',
    label: 'Generate Fabric custom block',
    prompt: 'Create a Fabric custom block with blockstate, loot table, and registry setup. Explain each file briefly.'
  },
  {
    id: 'paper-command',
    category: 'Plugins',
    label: 'Scaffold Paper command + permissions',
    prompt: 'Create a Paper plugin command /healall with permission nodes, plugin.yml registration, and tab completion.'
  },
  {
    id: 'paper-events',
    category: 'Plugins',
    label: 'Create event listener class',
    prompt: 'Generate a Paper listener for PlayerJoinEvent and PlayerQuitEvent with configurable join/quit messages.'
  },
  {
    id: 'datapack-ability',
    category: 'Datapacks',
    label: 'Build datapack ability system',
    prompt: 'Create a datapack ability activated by carrot_on_a_stick using scoreboards, cooldown, and actionbar feedback.'
  },
  {
    id: 'advancement',
    category: 'Datapacks',
    label: 'Create advancement + reward function',
    prompt: 'Add an advancement triggered by obtaining nether star and run a reward function with title + loot give.'
  },
  {
    id: 'geckolib',
    category: 'Assets',
    label: 'Generate GeckoLib entity animation stubs',
    prompt: 'Create GeckoLib animation controller and renderer stubs for a custom mob with idle, walk, and attack animations.'
  },
  {
    id: 'textures',
    category: 'Assets',
    label: 'Texture checklist for a new item set',
    prompt: 'Give me a texture production checklist for a 16x item set with naming, atlas layout, and export steps.'
  },
  {
    id: 'fix-build',
    category: 'Ops',
    label: 'Diagnose and fix build failures',
    prompt: 'Given a Gradle build error, propose root cause, exact fix steps, and a minimal patch plan.'
  },
  {
    id: 'mcp-context',
    category: 'Ops',
    label: 'Use MCP context for better recommendations',
    prompt: 'How should I wire MCP sources like Context7 and Storm for Minecraft project-aware recommendations?'
  },
];

export const MinecraftCommandPalette: React.FC<MinecraftCommandPaletteProps> = ({ onRunTask }) => {
  const [query, setQuery] = useState('');

  const filteredCommands = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return COMMAND_TASKS;
    }

    return COMMAND_TASKS.filter((command) => {
      return (
        command.label.toLowerCase().includes(search) ||
        command.category.toLowerCase().includes(search) ||
        command.prompt.toLowerCase().includes(search)
      );
    });
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-5 border border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <Wand2 className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg font-semibold">Minecraft Command Palette</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Pick a high-impact Minecraft task and send it directly to the WayaCreate Agent.
        </p>

        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks: Forge item, GeckoLib, datapack..."
            className="w-full pl-10 pr-3 py-2 rounded-md bg-slate-900 border border-slate-600 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Search command palette"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredCommands.map((command) => (
          <div key={command.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-violet-300">{command.category}</span>
              <button
                onClick={() => onRunTask(command.prompt)}
                className="inline-flex items-center gap-1 text-xs bg-violet-600 hover:bg-violet-500 px-2 py-1 rounded"
              >
                <Play className="w-3 h-3" />
                Run
              </button>
            </div>
            <h3 className="font-medium mb-1">{command.label}</h3>
            <p className="text-xs text-slate-400">{command.prompt}</p>
          </div>
        ))}
      </div>

      {filteredCommands.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-slate-400 text-sm">
          No tasks found. Try searching "plugin", "datapack", or "geckolib".
        </div>
      )}
    </div>
  );
};
