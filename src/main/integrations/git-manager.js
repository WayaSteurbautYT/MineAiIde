/**
 * MineAI IDE - Git Integration Manager
 * Handles version control operations for mod projects
 * Supports GitHub integration, auto-commits, and release generation
 */

import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs/promises';

/**
 * Git Manager Class
 * Manages Git operations for MineAI projects
 */
export class GitManager {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.git = simpleGit(projectPath);
    this.isInitialized = false;
    this.remoteUrl = null;
  }

  /**
   * Initialize a new Git repository
   */
  async init() {
    try {
      await this.git.init();
      this.isInitialized = true;
      
      // Create default .gitignore
      await this.createGitignore();
      
      // Initial commit
      await this.git.add('.gitignore');
      await this.git.commit('Initial commit - MineAI IDE Project');
      
      return { success: true, message: 'Git repository initialized' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if project is a Git repository
   */
  async checkIsRepo() {
    try {
      this.isInitialized = await this.git.checkIsRepo();
      return this.isInitialized;
    } catch {
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Create default .gitignore for Minecraft mods
   */
  async createGitignore() {
    const gitignore = `# MineAI IDE
.mineai/
*.mineai-cache

# Build outputs
build/
out/
run/
libs/

# IDE files
.idea/
*.iml
.vscode/
*.code-workspace

# Gradle
.gradle/
gradle.properties
!gradle/wrapper/gradle-wrapper.jar

# Eclipse
.classpath
.project
.settings/

# OS files
.DS_Store
Thumbs.db
desktop.ini

# Logs
logs/
*.log

# Temporary files
*.tmp
*.temp
*.swp
*~

# Compiled files
*.class
*.jar
!libs/*.jar

# Node modules (for web components)
node_modules/

# Environment files
.env
.env.local
`;

    const gitignorePath = path.join(this.projectPath, '.gitignore');
    await fs.writeFile(gitignorePath, gitignore, 'utf8');
  }

  /**
   * Get repository status
   */
  async getStatus() {
    try {
      const status = await this.git.status();
      return {
        success: true,
        branch: status.current,
        staged: status.staged,
        modified: status.modified,
        created: status.created,
        deleted: status.deleted,
        renamed: status.renamed,
        untracked: status.not_added,
        conflicted: status.conflicted,
        ahead: status.ahead,
        behind: status.behind,
        isClean: status.isClean()
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Stage files
   */
  async add(files = '.') {
    try {
      await this.git.add(files);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Commit changes
   */
  async commit(message, options = {}) {
    try {
      // Auto-generate commit message if not provided
      if (!message) {
        message = await this.generateCommitMessage();
      }

      const result = await this.git.commit(message, options);
      return {
        success: true,
        commit: result.commit,
        summary: result.summary
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate smart commit message based on changes
   */
  async generateCommitMessage() {
    const status = await this.getStatus();
    if (!status.success) return 'Update project files';

    const parts = [];
    
    if (status.created.length > 0) {
      parts.push(`Add ${this.summarizeFiles(status.created)}`);
    }
    if (status.modified.length > 0) {
      parts.push(`Update ${this.summarizeFiles(status.modified)}`);
    }
    if (status.deleted.length > 0) {
      parts.push(`Remove ${this.summarizeFiles(status.deleted)}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Update project files';
  }

  /**
   * Summarize file changes for commit message
   */
  summarizeFiles(files) {
    if (files.length === 1) return path.basename(files[0]);
    if (files.length <= 3) return files.map(f => path.basename(f)).join(', ');
    return `${files.length} files`;
  }

  /**
   * Push to remote
   */
  async push(remote = 'origin', branch = 'main') {
    try {
      await this.git.push(remote, branch);
      return { success: true };
    } catch (error) {
      // If push fails due to no upstream, set it
      if (error.message.includes('no upstream')) {
        try {
          await this.git.push(['-u', remote, branch]);
          return { success: true };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Pull from remote
   */
  async pull(remote = 'origin', branch = 'main') {
    try {
      const result = await this.git.pull(remote, branch);
      return {
        success: true,
        summary: result.summary
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Add remote repository
   */
  async addRemote(name, url) {
    try {
      await this.git.addRemote(name, url);
      this.remoteUrl = url;
      return { success: true };
    } catch (error) {
      // If remote exists, update it
      if (error.message.includes('already exists')) {
        try {
          await this.git.remote(['set-url', name, url]);
          this.remoteUrl = url;
          return { success: true };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
      return { success: false, error: error.message };
    }
  }

  /**
   * Get remote URL
   */
  async getRemoteUrl(name = 'origin') {
    try {
      const remotes = await this.git.getRemotes(true);
      const remote = remotes.find(r => r.name === name);
      return remote ? remote.refs.fetch : null;
    } catch {
      return null;
    }
  }

  /**
   * Create a new branch
   */
  async createBranch(branchName) {
    try {
      await this.git.checkoutLocalBranch(branchName);
      return { success: true, branch: branchName };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Switch branch
   */
  async switchBranch(branchName) {
    try {
      await this.git.checkout(branchName);
      return { success: true, branch: branchName };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all branches
   */
  async getBranches() {
    try {
      const branches = await this.git.branchLocal();
      return {
        success: true,
        current: branches.current,
        all: branches.all
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get commit log
   */
  async getLog(options = { maxCount: 20 }) {
    try {
      const log = await this.git.log(options);
      return {
        success: true,
        commits: log.all.map(c => ({
          hash: c.hash,
          shortHash: c.hash.substring(0, 7),
          message: c.message,
          author: c.author_name,
          email: c.author_email,
          date: c.date
        }))
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a tag (for releases)
   */
  async createTag(tagName, message = '') {
    try {
      if (message) {
        await this.git.addAnnotatedTag(tagName, message);
      } else {
        await this.git.addTag(tagName);
      }
      return { success: true, tag: tagName };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all tags
   */
  async getTags() {
    try {
      const tags = await this.git.tags();
      return { success: true, tags: tags.all };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset changes (soft, mixed, or hard)
   */
  async reset(mode = 'soft', ref = 'HEAD~1') {
    try {
      await this.git.reset([`--${mode}`, ref]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Stash changes
   */
  async stash(message = '') {
    try {
      if (message) {
        await this.git.stash(['push', '-m', message]);
      } else {
        await this.git.stash();
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Pop stash
   */
  async stashPop() {
    try {
      await this.git.stash(['pop']);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Quick save (add all + commit + push)
   */
  async quickSave(message) {
    try {
      await this.add('.');
      const commitResult = await this.commit(message || await this.generateCommitMessage());
      
      if (!commitResult.success) {
        return commitResult;
      }

      // Try to push if remote exists
      const remoteUrl = await this.getRemoteUrl();
      if (remoteUrl) {
        const pushResult = await this.push();
        return {
          success: true,
          commit: commitResult.commit,
          pushed: pushResult.success
        };
      }

      return {
        success: true,
        commit: commitResult.commit,
        pushed: false,
        message: 'Committed locally. Add a remote to push.'
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create release (tag + push tag)
   */
  async createRelease(version, notes = '') {
    try {
      // Create annotated tag
      await this.createTag(`v${version}`, notes || `Release version ${version}`);
      
      // Push tag if remote exists
      const remoteUrl = await this.getRemoteUrl();
      if (remoteUrl) {
        await this.git.pushTags('origin');
      }

      return {
        success: true,
        version,
        tag: `v${version}`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Clone a repository
   */
  static async clone(url, targetPath) {
    try {
      await simpleGit().clone(url, targetPath);
      return { success: true, path: targetPath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

/**
 * Create GitManager instance for a project
 */
export function createGitManager(projectPath) {
  return new GitManager(projectPath);
}

export default GitManager;