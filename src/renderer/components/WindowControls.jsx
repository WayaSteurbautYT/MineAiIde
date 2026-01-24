import React from 'react';
import { Minus, Square, X } from 'lucide-react';

const WindowControls = ({ onMinimize, onMaximize, onClose }) => {
  return (
    <div className="flex items-center gap-1 no-drag-region">
      <button 
        onClick={onMinimize}
        className="w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 transition-colors rounded-sm"
        title="Minimize"
      >
        <Minus size={12} className="text-slate-300" />
      </button>
      <button 
        onClick={onMaximize}
        className="w-8 h-8 flex items-center justify-center hover:bg-slate-700/50 transition-colors rounded-sm"
        title="Maximize"
      >
        <Square size={10} className="text-slate-300" />
      </button>
      <button 
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center hover:bg-red-500/80 transition-colors rounded-sm"
        title="Close"
      >
        <X size={12} className="text-slate-300" />
      </button>
    </div>
  );
};

export default WindowControls;