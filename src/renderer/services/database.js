/**
 * MineAI IDE - Offline-First Database Service
 * Uses Dexie.js (IndexedDB wrapper) for local storage
 * Supports offline work with sync when online
 */

import Dexie from 'dexie';

// Create the database
export const db = new Dexie('MineAIDatabase');

// Define database schema
db.version(1).stores({
  // Projects table
  projects: '++id, name, type, mcVersion, createdAt, updatedAt, [type+mcVersion]',
  
  // Project files
  files: '++id, projectId, path, content, type, createdAt, updatedAt',
  
  // AI Learning - stores successful patterns
  learningPatterns: '++id, category, prompt, response, rating, usageCount, createdAt',
  
  // User preferences
  preferences: 'key, value, updatedAt',
  
  // Chat history
  chatHistory: '++id, projectId, role, content, timestamp',
  
  // Templates
  templates: '++id, name, type, mcVersion, files, description, author',
  
  // Content library (user uploads)
  contentLibrary: '++id, name, type, data, thumbnail, tags, createdAt',
  
  // Team data
  teams: '++id, name, members, ownerId, createdAt',
  
  // Sync queue (for offline changes)
  syncQueue: '++id, action, data, timestamp, synced'
});

/**
 * Project Management
 */
export const ProjectDB = {
  // Create a new project
  async create(project) {
    const now = new Date().toISOString();
    return await db.projects.add({
      ...project,
      createdAt: now,
      updatedAt: now
    });
  },

  // Get all projects
  async getAll() {
    return await db.projects.toArray();
  },

  // Get project by ID
  async getById(id) {
    return await db.projects.get(id);
  },

  // Update project
  async update(id, updates) {
    return await db.projects.update(id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  // Delete project
  async delete(id) {
    // Delete project files first
    await db.files.where('projectId').equals(id).delete();
    return await db.projects.delete(id);
  },

  // Get projects by type
  async getByType(type) {
    return await db.projects.where('type').equals(type).toArray();
  }
};

/**
 * File Management
 */
export const FileDB = {
  // Save a file
  async save(projectId, path, content, type = 'text') {
    const existing = await db.files
      .where({ projectId, path })
      .first();
    
    if (existing) {
      return await db.files.update(existing.id, {
        content,
        updatedAt: new Date().toISOString()
      });
    }
    
    return await db.files.add({
      projectId,
      path,
      content,
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  },

  // Get file content
  async get(projectId, path) {
    return await db.files
      .where({ projectId, path })
      .first();
  },

  // Get all files for a project
  async getProjectFiles(projectId) {
    return await db.files
      .where('projectId')
      .equals(projectId)
      .toArray();
  },

  // Delete a file
  async delete(projectId, path) {
    return await db.files
      .where({ projectId, path })
      .delete();
  }
};

/**
 * AI Learning System
 */
export const LearningDB = {
  // Store a successful pattern
  async storePattern(category, prompt, response, rating = 5) {
    return await db.learningPatterns.add({
      category,
      prompt,
      response,
      rating,
      usageCount: 1,
      createdAt: new Date().toISOString()
    });
  },

  // Find similar patterns
  async findSimilar(category, keywords) {
    const patterns = await db.learningPatterns
      .where('category')
      .equals(category)
      .toArray();
    
    // Simple keyword matching (can be enhanced with vector similarity)
    return patterns.filter(p => 
      keywords.some(k => 
        p.prompt.toLowerCase().includes(k.toLowerCase())
      )
    ).sort((a, b) => b.rating - a.rating);
  },

  // Update pattern rating
  async updateRating(id, rating) {
    const pattern = await db.learningPatterns.get(id);
    if (pattern) {
      return await db.learningPatterns.update(id, {
        rating: (pattern.rating + rating) / 2,
        usageCount: pattern.usageCount + 1
      });
    }
  },

  // Get top patterns by category
  async getTopPatterns(category, limit = 10) {
    return await db.learningPatterns
      .where('category')
      .equals(category)
      .reverse()
      .sortBy('rating')
      .then(patterns => patterns.slice(0, limit));
  }
};

/**
 * User Preferences
 */
export const PreferencesDB = {
  // Set a preference
  async set(key, value) {
    const existing = await db.preferences.get(key);
    if (existing) {
      return await db.preferences.update(key, {
        value,
        updatedAt: new Date().toISOString()
      });
    }
    return await db.preferences.add({
      key,
      value,
      updatedAt: new Date().toISOString()
    });
  },

  // Get a preference
  async get(key, defaultValue = null) {
    const pref = await db.preferences.get(key);
    return pref ? pref.value : defaultValue;
  },

  // Get all preferences
  async getAll() {
    const prefs = await db.preferences.toArray();
    return prefs.reduce((acc, p) => {
      acc[p.key] = p.value;
      return acc;
    }, {});
  }
};

/**
 * Chat History
 */
export const ChatDB = {
  // Add message
  async addMessage(projectId, role, content) {
    return await db.chatHistory.add({
      projectId,
      role,
      content,
      timestamp: new Date().toISOString()
    });
  },

  // Get chat history for project
  async getHistory(projectId, limit = 50) {
    return await db.chatHistory
      .where('projectId')
      .equals(projectId)
      .reverse()
      .limit(limit)
      .toArray()
      .then(messages => messages.reverse());
  },

  // Clear chat history
  async clear(projectId) {
    return await db.chatHistory
      .where('projectId')
      .equals(projectId)
      .delete();
  }
};

/**
 * Content Library
 */
export const ContentDB = {
  // Add content
  async add(content) {
    return await db.contentLibrary.add({
      ...content,
      createdAt: new Date().toISOString()
    });
  },

  // Get all content
  async getAll() {
    return await db.contentLibrary.toArray();
  },

  // Get by type
  async getByType(type) {
    return await db.contentLibrary
      .where('type')
      .equals(type)
      .toArray();
  },

  // Search by tags
  async searchByTags(tags) {
    const all = await db.contentLibrary.toArray();
    return all.filter(item => 
      tags.some(tag => item.tags?.includes(tag))
    );
  },

  // Delete content
  async delete(id) {
    return await db.contentLibrary.delete(id);
  }
};

/**
 * Sync Queue (for offline operations)
 */
export const SyncDB = {
  // Add to sync queue
  async queue(action, data) {
    return await db.syncQueue.add({
      action,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    });
  },

  // Get pending sync items
  async getPending() {
    return await db.syncQueue
      .where('synced')
      .equals(false)
      .toArray();
  },

  // Mark as synced
  async markSynced(id) {
    return await db.syncQueue.update(id, { synced: true });
  },

  // Clear synced items
  async clearSynced() {
    return await db.syncQueue
      .where('synced')
      .equals(true)
      .delete();
  }
};

/**
 * Templates
 */
export const TemplateDB = {
  // Add template
  async add(template) {
    return await db.templates.add(template);
  },

  // Get all templates
  async getAll() {
    return await db.templates.toArray();
  },

  // Get by type and version
  async getByTypeAndVersion(type, mcVersion) {
    return await db.templates
      .where({ type, mcVersion })
      .toArray();
  },

  // Delete template
  async delete(id) {
    return await db.templates.delete(id);
  }
};

// Export database instance
export default db;