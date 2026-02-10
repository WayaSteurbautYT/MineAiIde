import React from 'react';
import { Cpu, Cloud, SlidersHorizontal, Wallet } from 'lucide-react';
import { useStore } from '../store/useStore';

const OPENROUTER_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
  'anthropic/claude-3.5-sonnet',
  'openai/gpt-4o-mini',
];

const OLLAMA_MODELS = ['llama3.2', 'codellama', 'mistral', 'deepseek-coder'];

export const AIProviderSettings: React.FC = () => {
  const { aiConfig, updateAIConfig } = useStore();

  const activeModelList = aiConfig.provider === 'openrouter' ? OPENROUTER_MODELS : OLLAMA_MODELS;

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          AI Provider Settings
        </h2>
        <p className="text-sm text-slate-400">
          Configure free/paid routing for Minecraft coding, content generation, and debugging workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => updateAIConfig({ provider: 'openrouter', model: OPENROUTER_MODELS[0] })}
          className={`rounded-lg border p-4 text-left transition-colors ${
            aiConfig.provider === 'openrouter'
              ? 'border-cyan-500 bg-slate-800'
              : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold">OpenRouter (Cloud)</h3>
          </div>
          <p className="text-xs text-slate-400">Best for high quality reasoning and paid/hosted models.</p>
        </button>

        <button
          onClick={() => updateAIConfig({ provider: 'ollama', model: OLLAMA_MODELS[0] })}
          className={`rounded-lg border p-4 text-left transition-colors ${
            aiConfig.provider === 'ollama'
              ? 'border-cyan-500 bg-slate-800'
              : 'border-slate-700 bg-slate-900 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold">Ollama (Local / Free)</h3>
          </div>
          <p className="text-xs text-slate-400">Run offline for private projects and zero-token-cost usage.</p>
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-5 space-y-4">
        <div>
          <label className="block text-sm text-slate-300 mb-1">Model</label>
          <select
            value={aiConfig.model}
            onChange={(event) => updateAIConfig({ model: event.target.value })}
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-600 text-sm"
            aria-label="Model"
          >
            {activeModelList.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {aiConfig.provider === 'ollama' && (
          <div>
            <label className="block text-sm text-slate-300 mb-1">Ollama URL</label>
            <input
              value={aiConfig.ollamaUrl}
              onChange={(event) => updateAIConfig({ ollamaUrl: event.target.value })}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-600 text-sm"
              placeholder="http://localhost:11434"
              aria-label="Ollama URL"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Temperature ({aiConfig.temperature.toFixed(1)})</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={aiConfig.temperature}
              onChange={(event) => updateAIConfig({ temperature: Number(event.target.value) })}
              className="w-full"
              aria-label="Temperature"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Max Tokens</label>
            <input
              type="number"
              min={200}
              max={4000}
              step={100}
              value={aiConfig.maxTokens}
              onChange={(event) => updateAIConfig({ maxTokens: Number(event.target.value) })}
              className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-600 text-sm"
              aria-label="Max Tokens"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-1 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-amber-400" />
            Monthly Budget (USD)
          </label>
          <input
            type="number"
            min={0}
            max={500}
            step={1}
            value={aiConfig.monthlyBudgetUsd}
            onChange={(event) => updateAIConfig({ monthlyBudgetUsd: Number(event.target.value) })}
            className="w-full px-3 py-2 rounded-md bg-slate-900 border border-slate-600 text-sm"
            aria-label="Monthly Budget"
          />
          <p className="text-xs text-slate-500 mt-2">Use free models for drafts and paid models for final generation.</p>
        </div>
      </div>
    </div>
  );
};
