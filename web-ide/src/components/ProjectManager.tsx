import React, { useState } from 'react';
import { Plus, Folder, Trash2, Settings, Download, Upload } from 'lucide-react';
import { useStore, Project } from '../store/useStore';

export const ProjectManager: React.FC = () => {
  const { projects, currentProject, setCurrentProject, addProject, deleteProject } = useStore();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    type: 'forge' as const,
    minecraftVersion: '1.20.1',
    description: ''
  });

  const projectTypes = [
    { value: 'forge', label: 'Forge Mod', description: 'Minecraft Forge modding' },
    { value: 'fabric', label: 'Fabric Mod', description: 'Fabric Loader modding' },
    { value: 'quilt', label: 'Quilt Mod', description: 'Quilt Loader modding' },
    { value: 'neoforge', label: 'NeoForge Mod', description: 'NeoForge modding' },
    { value: 'spigot', label: 'Spigot Plugin', description: 'Spigot/Bukkit plugin' },
    { value: 'datapack', label: 'Data Pack', description: 'Minecraft data pack' }
  ];

  const minecraftVersions = [
    '1.20.4', '1.20.3', '1.20.2', '1.20.1', '1.20', 
    '1.19.4', '1.19.3', '1.19.2', '1.19.1', '1.19',
    '1.18.2', '1.18.1', '1.18', '1.17.1', '1.16.5'
  ];

  const createProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      type: newProject.type,
      version: '1.0.0',
      minecraftVersion: newProject.minecraftVersion,
      path: `/projects/${newProject.name.toLowerCase().replace(/\s+/g, '-')}`,
      created: new Date(),
      modified: new Date(),
      description: newProject.description
    };

    addProject(project);
    setCurrentProject(project);
    setShowNewProjectModal(false);
    setNewProject({
      name: '',
      type: 'forge',
      minecraftVersion: '1.20.1',
      description: ''
    });
  };

  const deleteProjectHandler = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-800 rounded-t-lg p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Folder className="w-6 h-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Project Manager</h2>
          </div>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-900">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No projects yet</h3>
            <p className="text-slate-500 mb-4">Create your first Minecraft modding project</p>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`bg-slate-800 rounded-lg p-4 border-2 transition-all cursor-pointer hover:border-blue-500 ${
                  currentProject?.id === project.id ? 'border-blue-500' : 'border-slate-700'
                }`}
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {project.type.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-xs text-slate-400">{project.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProjectHandler(project.id);
                    }}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="Delete project"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Version:</span>
                    <span>{project.minecraftVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created:</span>
                    <span>{project.created.toLocaleDateString()}</span>
                  </div>
                  {project.description && (
                    <p className="text-slate-300 text-xs mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors">
                    <Settings className="w-3 h-3 inline mr-1" />
                    Settings
                  </button>
                  <button className="flex-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors">
                    <Download className="w-3 h-3 inline mr-1" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Awesome Mod"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Type</label>
                <select
                  value={newProject.type}
                  onChange={(e) => setNewProject({ ...newProject, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Project Type"
                >
                  {projectTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Minecraft Version</label>
                <select
                  value={newProject.minecraftVersion}
                  onChange={(e) => setNewProject({ ...newProject, minecraftVersion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Minecraft Version"
                >
                  {minecraftVersions.map((version) => (
                    <option key={version} value={version}>
                      {version}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your project..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newProject.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
