import React from 'react';
import { BookOpen, Clock, Star, ChevronRight } from 'lucide-react';

const TutorialPanel = ({ isOpen, onClose }) => {
  const [selectedTutorial, setSelectedTutorial] = React.useState(null);
  
  // Import tutorials from config
  const tutorials = {
    beginner: [
      {
        id: 'welcome',
        title: 'Welcome to MineAI IDE',
        description: 'Learn the basics of Minecraft modding with AI assistance',
        difficulty: 'Beginner'
      },
      {
        id: 'first-item',
        title: 'Create Your First Custom Item',
        description: 'Learn to create a simple custom item with texture',
        difficulty: 'Beginner'
      }
    ],
    intermediate: [
      {
        id: 'blockbench-intro',
        title: 'Blockbench Model Creation',
        description: 'Create 3D models using Blockbench integration',
        difficulty: 'Intermediate'
      }
    ],
    advanced: [
      {
        id: 'cli-mastery',
        title: 'Advanced CLI Usage',
        description: 'Master the command line interface for power users',
        difficulty: 'Advanced'
      }
    ]
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <BookOpen className="text-indigo-400" size={24} />
            <h2 className="text-xl font-bold text-white">MineAI Tutorials</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex h-96">
          {/* Tutorial List */}
          <div className="w-80 border-r border-slate-800 overflow-y-auto">
            {Object.entries(tutorials).map(([level, items]) => (
              <div key={level} className="p-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {level} Tutorials
                </h3>
                {items.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    onClick={() => setSelectedTutorial(tutorial)}
                    className={`p-3 rounded-lg cursor-pointer transition-all mb-2 ${
                      selectedTutorial?.id === tutorial.id 
                        ? 'bg-indigo-500/20 border border-indigo-500/30' 
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">{tutorial.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{tutorial.description}</p>
                      </div>
                      <ChevronRight className="text-slate-600" size={16} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="text-yellow-500" size={12} />
                      <span className="text-xs text-slate-500">{tutorial.difficulty}</span>
                      <Clock className="text-slate-500 ml-2" size={12} />
                      <span className="text-xs text-slate-500">30min</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Tutorial Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTutorial ? (
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedTutorial.title}</h3>
                <p className="text-slate-400 mb-6">{selectedTutorial.description}</p>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Steps:</h4>
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">
                        {step}
                      </div>
                      <p className="text-slate-300 flex-1">
                        Step {step}: Complete the tutorial tasks with AI assistance
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <BookOpen size={16} />
                    Start This Tutorial
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Select a tutorial to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPanel;