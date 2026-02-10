import React from 'react';
import { BookOpenCheck, Rocket, Sparkles, ClipboardList } from 'lucide-react';

const tracks = [
  {
    title: 'First Mod in 15 Minutes',
    level: 'Beginner',
    outcomes: ['Create project', 'Generate custom item', 'Test in Minecraft'],
  },
  {
    title: 'Plugin Starter (Paper)',
    level: 'Beginner',
    outcomes: ['Create command', 'Register listener', 'Package JAR'],
  },
  {
    title: 'Blockbench to GeckoLib',
    level: 'Intermediate',
    outcomes: ['Import model', 'Add animation', 'Connect renderer code'],
  },
];

const checklist = [
  'Pick project type (Forge/Fabric/Paper/Datapack)',
  'Use Command Palette to generate baseline files',
  'Review generated code and run build checks',
  'Open AI chat for fixes and improvements',
  'Export and test inside your Minecraft instance',
];

export const BeginnerTutorials: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpenCheck className="w-5 h-5 text-emerald-400" />
          Beginner Learning Center
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Learn MineAI step-by-step with guided tracks inspired by MCreator, Cursor, and VS Code workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tracks.map((track) => (
          <div key={track.title} className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{track.title}</h3>
              <span className="text-xs text-slate-400">{track.level}</span>
            </div>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
              {track.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
            <button className="w-full mt-3 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-sm transition-colors">
              Start Track
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-cyan-400" />
          Recommended Build Flow
        </h3>
        <ol className="space-y-2 text-sm text-slate-300">
          {checklist.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span className="w-5 h-5 rounded-full bg-slate-700 text-xs flex items-center justify-center">{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h4 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-400" /> AI Help Tips</h4>
          <p className="text-xs text-slate-400 mt-2">Ask for "beginner mode" explanations to get smaller steps and file-by-file guidance.</p>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <h4 className="font-semibold flex items-center gap-2"><Rocket className="w-4 h-4 text-amber-400" /> Launch Ready</h4>
          <p className="text-xs text-slate-400 mt-2">Use AI Settings to switch between free local Ollama drafts and premium OpenRouter final output.</p>
        </div>
      </div>
    </div>
  );
};
