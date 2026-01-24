import React from 'react';
import { Terminal as TerminalIcon, Sparkles, AlertCircle } from 'lucide-react';

const AdvancedCLI = () => {
  const [logs, setLogs] = React.useState([
    { type: 'info', msg: 'MineAI Advanced CLI Initialized' },
    { type: 'success', msg: 'GPU Acceleration: Legacy NVIDIA Optimization Active' },
    { type: 'warning', msg: 'Low Disk Space Warning threshold set to 5GB' }
  ]);

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm">
      <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Terminal Mod Context</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
            <span className={
              log.type === 'success' ? 'text-emerald-400' : 
              log.type === 'warning' ? 'text-amber-400' : 
              'text-indigo-400'
            }>{`>> ${log.msg}`}</span>
          </div>
        ))}
        <div className="flex gap-2 text-white">
          <span>mineai@user:~$</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>

      <div className="p-4 bg-slate-900/30 border-t border-slate-800">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <Sparkles size={14} className="text-indigo-500" />
          <span>AI will assist with complex CLI commands based on your modding history.</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCLI;