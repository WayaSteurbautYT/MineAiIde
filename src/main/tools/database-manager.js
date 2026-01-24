/**
 * MineAI IDE - Database Manager
 * Enhanced database support for project management with MCP integration
 */

import Dexie from 'dexie';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbName = 'MineAI_IDE';
    this.isInitialized = false;
  }

  /**
   * Initialize the database
   */
  async initialize() {
    if (this.isInitialized) {
      return this.db;
    }

    console.log('[Database Manager] Initializing database...');

    // Create Dexie database
    this.db = new Dexie(this.dbName);

    // Define database schema
    this.db.version(1).stores({
      projects: '++id, name, type, version, path, created, modified, framework, minecraftVersion',
      templates: '++id, name, type, framework, minecraftVersion, content, created',
      dependencies: '++id, projectId, groupId, artifactId, version, scope, type',
      buildHistory: '++id, projectId, type, status, startTime, endTime, output, logs',
      resources: '++id, type, name, url, content, hash, downloaded, metadata',
      settings: '++id, key, value, category, modified',
      aiPrompts: '++id, name, prompt, category, usage, created, modified',
      codeSnippets: '++id, name, language, code, tags, usage, created, modified',
      modConfigs: '++id, projectId, modId, configType, configData, version',
      javaVersions: '++id, version, path, type, detected, systemInfo'
    });

    await this.db.open();
    this.isInitialized = true;

    console.log('[Database Manager] Database initialized successfully');
    return this.db;
  }

  /**
   * Project Management Operations
   */
  async createProject(projectData) {
    await this.ensureInitialized();
    
    const project = {
      name: projectData.name,
      type: projectData.type || 'forge',
      version: projectData.version || '1.0.0',
      path: projectData.path,
      framework: projectData.framework || 'forge',
      minecraftVersion: projectData.minecraftVersion || '1.20.1',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      ...projectData
    };

    const id = await this.db.projects.add(project);
    console.log(`[Database Manager] Created project: ${project.name} (ID: ${id})`);
    
    return { id, ...project };
  }

  async getProject(id) {
    await this.ensureInitialized();
    return await this.db.projects.get(id);
  }

  async getAllProjects() {
    await this.ensureInitialized();
    return await this.db.projects.toArray();
  }

  async updateProject(id, updates) {
    await this.ensureInitialized();
    updates.modified = new Date().toISOString();
    await this.db.projects.update(id, updates);
    console.log(`[Database Manager] Updated project ID: ${id}`);
    return await this.db.projects.get(id);
  }

  async deleteProject(id) {
    await this.ensureInitialized();
    await this.db.projects.delete(id);
    console.log(`[Database Manager] Deleted project ID: ${id}`);
    
    // Clean up related data
    await this.db.dependencies.where('projectId').equals(id).delete();
    await this.db.buildHistory.where('projectId').equals(id).delete();
    await this.db.modConfigs.where('projectId').equals(id).delete();
  }

  /**
   * Template Management
   */
  async saveTemplate(templateData) {
    await this.ensureInitialized();
    
    const template = {
      name: templateData.name,
      type: templateData.type,
      framework: templateData.framework,
      minecraftVersion: templateData.minecraftVersion,
      content: templateData.content,
      created: new Date().toISOString(),
      ...templateData
    };

    const id = await this.db.templates.add(template);
    console.log(`[Database Manager] Saved template: ${template.name} (ID: ${id})`);
    
    return { id, ...template };
  }

  async getTemplate(id) {
    await this.ensureInitialized();
    return await this.db.templates.get(id);
  }

  async getTemplatesByType(type, framework = null) {
    await this.ensureInitialized();
    
    let collection = this.db.templates.where('type').equals(type);
    if (framework) {
      collection = collection.and(template => template.framework === framework);
    }
    
    return await collection.toArray();
  }

  /**
   * Dependency Management
   */
  async addDependency(projectId, dependencyData) {
    await this.ensureInitialized();
    
    const dependency = {
      projectId,
      groupId: dependencyData.groupId,
      artifactId: dependencyData.artifactId,
      version: dependencyData.version,
      scope: dependencyData.scope || 'compile',
      type: dependencyData.type || 'maven',
      added: new Date().toISOString()
    };

    const id = await this.db.dependencies.add(dependency);
    console.log(`[Database Manager] Added dependency: ${dependency.groupId}:${dependency.artifactId}`);
    
    return { id, ...dependency };
  }

  async getProjectDependencies(projectId) {
    await this.ensureInitialized();
    return await this.db.dependencies.where('projectId').equals(projectId).toArray();
  }

  async removeDependency(id) {
    await this.ensureInitialized();
    await this.db.dependencies.delete(id);
  }

  /**
   * Build History Management
   */
  async recordBuild(buildData) {
    await this.ensureInitialized();
    
    const build = {
      projectId: buildData.projectId,
      type: buildData.type || 'gradle',
      status: buildData.status || 'running',
      startTime: buildData.startTime || new Date().toISOString(),
      endTime: buildData.endTime,
      output: buildData.output,
      logs: buildData.logs || []
    };

    const id = await this.db.buildHistory.add(build);
    console.log(`[Database Manager] Recorded build: ${build.status} (ID: ${id})`);
    
    return { id, ...build };
  }

  async getProjectBuildHistory(projectId) {
    await this.ensureInitialized();
    return await this.db.buildHistory.where('projectId').equals(projectId).reverse().toArray();
  }

  async updateBuildStatus(id, status, endTime = null, output = null) {
    await this.ensureInitialized();
    const updates = { status };
    if (endTime) updates.endTime = endTime;
    if (output) updates.output = output;
    
    await this.db.buildHistory.update(id, updates);
  }

  /**
   * Resource Management
   */
  async saveResource(resourceData) {
    await this.ensureInitialized();
    
    const resource = {
      type: resourceData.type, // 'minecraft_version', 'mod', 'library', etc.
      name: resourceData.name,
      url: resourceData.url,
      content: resourceData.content,
      hash: resourceData.hash,
      downloaded: resourceData.downloaded || false,
      metadata: resourceData.metadata || {},
      saved: new Date().toISOString()
    };

    const id = await this.db.resources.add(resource);
    console.log(`[Database Manager] Saved resource: ${resource.name} (ID: ${id})`);
    
    return { id, ...resource };
  }

  async getResource(id) {
    await this.ensureInitialized();
    return await this.db.resources.get(id);
  }

  async getResourcesByType(type) {
    await this.ensureInitialized();
    return await this.db.resources.where('type').equals(type).toArray();
  }

  /**
   * Settings Management
   */
  async saveSetting(key, value, category = 'general') {
    await this.ensureInitialized();
    
    const setting = {
      key,
      value,
      category,
      modified: new Date().toISOString()
    };

    const existing = await this.db.settings.where('key').equals(key).first();
    if (existing) {
      await this.db.settings.update(existing.id, setting);
      return { id: existing.id, ...setting };
    } else {
      const id = await this.db.settings.add(setting);
      return { id, ...setting };
    }
  }

  async getSetting(key) {
    await this.ensureInitialized();
    const setting = await this.db.settings.where('key').equals(key).first();
    return setting ? setting.value : null;
  }

  async getSettingsByCategory(category) {
    await this.ensureInitialized();
    return await this.db.settings.where('category').equals(category).toArray();
  }

  /**
   * AI Prompts Management
   */
  async saveAIPrompt(promptData) {
    await this.ensureInitialized();
    
    const prompt = {
      name: promptData.name,
      prompt: promptData.prompt,
      category: promptData.category || 'general',
      usage: promptData.usage || 0,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };

    const existing = await this.db.aiPrompts.where('name').equals(prompt.name).first();
    if (existing) {
      await this.db.aiPrompts.update(existing.id, prompt);
      return { id: existing.id, ...prompt };
    } else {
      const id = await this.db.aiPrompts.add(prompt);
      return { id, ...prompt };
    }
  }

  async getAIPrompt(name) {
    await this.ensureInitialized();
    return await this.db.aiPrompts.where('name').equals(name).first();
  }

  async getAIPromptsByCategory(category) {
    await this.ensureInitialized();
    return await this.db.aiPrompts.where('category').equals(category).toArray();
  }

  async incrementPromptUsage(name) {
    await this.ensureInitialized();
    const prompt = await this.getAIPrompt(name);
    if (prompt) {
      await this.db.aiPrompts.update(prompt.id, {
        usage: prompt.usage + 1,
        modified: new Date().toISOString()
      });
    }
  }

  /**
   * Code Snippets Management
   */
  async saveCodeSnippet(snippetData) {
    await this.ensureInitialized();
    
    const snippet = {
      name: snippetData.name,
      language: snippetData.language,
      code: snippetData.code,
      tags: snippetData.tags || [],
      usage: snippetData.usage || 0,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };

    const existing = await this.db.codeSnippets.where('name').equals(snippet.name).first();
    if (existing) {
      await this.db.codeSnippets.update(existing.id, snippet);
      return { id: existing.id, ...snippet };
    } else {
      const id = await this.db.codeSnippets.add(snippet);
      return { id, ...snippet };
    }
  }

  async getCodeSnippet(name) {
    await this.ensureInitialized();
    return await this.db.codeSnippets.where('name').equals(name).first();
  }

  async searchCodeSnippets(query, language = null) {
    await this.ensureInitialized();
    
    let collection = this.db.codeSnippets.toCollection();
    
    if (language) {
      collection = collection.filter(snippet => snippet.language === language);
    }
    
    return await collection.filter(snippet => 
      snippet.name.toLowerCase().includes(query.toLowerCase()) ||
      snippet.code.toLowerCase().includes(query.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    ).toArray();
  }

  /**
   * Mod Configuration Management
   */
  async saveModConfig(projectId, modId, configType, configData, version = '1.0.0') {
    await this.ensureInitialized();
    
    const config = {
      projectId,
      modId,
      configType, // 'forge', 'fabric', 'quilt', etc.
      configData,
      version,
      saved: new Date().toISOString()
    };

    const existing = await this.db.modConfigs
      .where('projectId').equals(projectId)
      .and(config => config.modId === modId && config.configType === configType)
      .first();

    if (existing) {
      await this.db.modConfigs.update(existing.id, config);
      return { id: existing.id, ...config };
    } else {
      const id = await this.db.modConfigs.add(config);
      return { id, ...config };
    }
  }

  async getModConfig(projectId, modId, configType) {
    await this.ensureInitialized();
    return await this.db.modConfigs
      .where('projectId').equals(projectId)
      .and(config => config.modId === modId && config.configType === configType)
      .first();
  }

  /**
   * Java Versions Management
   */
  async saveJavaVersion(versionData) {
    await this.ensureInitialized();
    
    const javaVersion = {
      version: versionData.version,
      path: versionData.path,
      type: versionData.type, // 'JDK', 'JRE'
      detected: versionData.detected || true,
      systemInfo: versionData.systemInfo || {},
      added: new Date().toISOString()
    };

    const existing = await this.db.javaVersions.where('version').equals(javaVersion.version).first();
    if (existing) {
      await this.db.javaVersions.update(existing.id, javaVersion);
      return { id: existing.id, ...javaVersion };
    } else {
      const id = await this.db.javaVersions.add(javaVersion);
      return { id, ...javaVersion };
    }
  }

  async getJavaVersions() {
    await this.ensureInitialized();
    return await this.db.javaVersions.toArray();
  }

  /**
   * Database Utilities
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  async exportDatabase(filePath) {
    await this.ensureInitialized();
    
    const data = {
      projects: await this.db.projects.toArray(),
      templates: await this.db.templates.toArray(),
      dependencies: await this.db.dependencies.toArray(),
      buildHistory: await this.db.buildHistory.toArray(),
      resources: await this.db.resources.toArray(),
      settings: await this.db.settings.toArray(),
      aiPrompts: await this.db.aiPrompts.toArray(),
      codeSnippets: await this.db.codeSnippets.toArray(),
      modConfigs: await this.db.modConfigs.toArray(),
      javaVersions: await this.db.javaVersions.toArray(),
      exported: new Date().toISOString()
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`[Database Manager] Database exported to: ${filePath}`);
  }

  async importDatabase(filePath) {
    const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    await this.ensureInitialized();
    
    // Clear existing data
    await this.db.delete();
    await this.initialize();
    
    // Import data
    for (const [table, records] of Object.entries(data)) {
      if (table !== 'exported' && this.db[table]) {
        await this.db[table].bulkAdd(records);
      }
    }
    
    console.log(`[Database Manager] Database imported from: ${filePath}`);
  }

  async getDatabaseStats() {
    await this.ensureInitialized();
    
    const stats = {
      projects: await this.db.projects.count(),
      templates: await this.db.templates.count(),
      dependencies: await this.db.dependencies.count(),
      buildHistory: await this.db.buildHistory.count(),
      resources: await this.db.resources.count(),
      settings: await this.db.settings.count(),
      aiPrompts: await this.db.aiPrompts.count(),
      codeSnippets: await this.db.codeSnippets.count(),
      modConfigs: await this.db.modConfigs.count(),
      javaVersions: await this.db.javaVersions.count()
    };
    
    return stats;
  }
}

export default DatabaseManager;
