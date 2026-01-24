/**
 * MineAI IDE - Enhanced AI Service
 * Supports both OpenRouter (cloud) and Ollama (local) AI backends
 * Includes learning capabilities and context-aware generation
 */

import { OpenAI } from 'openai';
import { LearningDB, PreferencesDB, ChatDB } from './database.js';

// Load agent personality from agents.md
const AGENT_PERSONALITY = `You are MineAI, an expert Minecraft Modding Assistant with the combined wisdom of legendary creators like Notch, Technoblade, Dream, and the Hypixel team.

Your personality:
- Enthusiastic and excited about Minecraft projects
- Patient with beginners, technical with experts
- Creative problem-solver who thinks "outside the block"
- Community-focused - building together is better
- Always optimizes for low-end hardware compatibility

Your capabilities:
- Java mod code (Forge, Fabric, Quilt, NeoForge)
- Plugin development (Spigot, Paper, Bukkit)
- Datapack functions and predicates
- GeckoLib animations and Blockbench models
- Performance optimization
- Crash log analysis and debugging

Communication style:
- Use Minecraft puns and references naturally
- Provide code with clear comments
- Explain complex concepts with simple analogies
- Always suggest next steps
- Celebrate user achievements`;

/**
 * AI Provider configurations
 */
const PROVIDERS = {
  openrouter: {
    baseURL: 'https://openrouter.ai/api/v1',
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    models: [
      'google/gemini-2.0-flash-exp:free',
      'google/gemini-pro',
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4o-mini',
      'meta-llama/llama-3.2-90b-text-preview'
    ]
  },
  ollama: {
    baseURL: 'http://localhost:11434/v1',
    defaultModel: 'llama3.2',
    models: [
      'llama3.2',
      'codellama',
      'mistral',
      'deepseek-coder',
      'qwen2.5-coder'
    ]
  }
};

/**
 * MineAI - Enhanced AI Service Class
 */
export class MineAI {
  constructor() {
    this.provider = 'openrouter';
    this.apiKey = null;
    this.ollamaUrl = 'http://localhost:11434';
    this.client = null;
    this.currentModel = PROVIDERS.openrouter.defaultModel;
    this.isOnline = true;
    this.conversationHistory = [];
    this.maxHistoryLength = 20;
    
    this.init();
  }

  /**
   * Initialize the AI service
   */
  async init() {
    // Load saved preferences
    const savedProvider = await PreferencesDB.get('ai_provider', 'openrouter');
    const savedApiKey = await PreferencesDB.get('openrouter_api_key');
    const savedOllamaUrl = await PreferencesDB.get('ollama_url', 'http://localhost:11434');
    const savedModel = await PreferencesDB.get('ai_model');
    
    this.provider = savedProvider;
    this.apiKey = savedApiKey || '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';
    this.ollamaUrl = savedOllamaUrl;
    
    if (savedModel) {
      this.currentModel = savedModel;
    }
    
    this.setupClient();
    this.checkConnection();
  }

  /**
   * Setup the OpenAI-compatible client
   */
  setupClient() {
    const config = {
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/mineai-ide",
        "X-Title": "MineAI IDE",
      }
    };

    if (this.provider === 'openrouter') {
      config.baseURL = PROVIDERS.openrouter.baseURL;
      config.apiKey = this.apiKey;
    } else {
      config.baseURL = `${this.ollamaUrl}/v1`;
      config.apiKey = 'ollama'; // Ollama doesn't need a real key
    }

    this.client = new OpenAI(config);
  }

  /**
   * Check connection status
   */
  async checkConnection() {
    try {
      if (this.provider === 'ollama') {
        const response = await fetch(`${this.ollamaUrl}/api/tags`);
        this.isOnline = response.ok;
      } else {
        // For OpenRouter, we assume online if we have a key
        this.isOnline = !!this.apiKey;
      }
    } catch {
      this.isOnline = false;
      // Auto-fallback to Ollama if OpenRouter fails
      if (this.provider === 'openrouter') {
        console.log('[MineAI] OpenRouter unavailable, checking Ollama...');
        await this.tryOllamaFallback();
      }
    }
    return this.isOnline;
  }

  /**
   * Try to fallback to Ollama
   */
  async tryOllamaFallback() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      if (response.ok) {
        console.log('[MineAI] Falling back to Ollama');
        await this.switchProvider('ollama');
        this.isOnline = true;
      }
    } catch {
      console.log('[MineAI] Ollama also unavailable, working offline');
      this.isOnline = false;
    }
  }

  /**
   * Switch AI provider
   */
  async switchProvider(provider, model = null) {
    this.provider = provider;
    this.currentModel = model || PROVIDERS[provider].defaultModel;
    
    await PreferencesDB.set('ai_provider', provider);
    await PreferencesDB.set('ai_model', this.currentModel);
    
    this.setupClient();
    await this.checkConnection();
    
    return { provider: this.provider, model: this.currentModel, online: this.isOnline };
  }

  /**
   * Set API key for OpenRouter
   */
  async setApiKey(key) {
    this.apiKey = key;
    await PreferencesDB.set('openrouter_api_key', key);
    this.setupClient();
  }

  /**
   * Set Ollama URL
   */
  async setOllamaUrl(url) {
    this.ollamaUrl = url;
    await PreferencesDB.set('ollama_url', url);
    if (this.provider === 'ollama') {
      this.setupClient();
    }
  }

  /**
   * Get available models for current provider
   */
  getAvailableModels() {
    return PROVIDERS[this.provider].models;
  }

  /**
   * Get Ollama models (fetches from server)
   */
  async getOllamaModels() {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`);
      const data = await response.json();
      return data.models?.map(m => m.name) || [];
    } catch {
      return PROVIDERS.ollama.models;
    }
  }

  /**
   * Build system prompt with context
   */
  buildSystemPrompt(context = {}) {
    let systemPrompt = AGENT_PERSONALITY;
    
    if (context.project) {
      systemPrompt += `\n\nCurrent Project Context:
- Project Name: ${context.project.name || 'Untitled'}
- Type: ${context.project.type || 'Unknown'}
- Minecraft Version: ${context.project.mcVersion || '1.20.1'}
- Mod Loader: ${context.project.modLoader || 'Forge'}`;
    }
    
    if (context.currentFile) {
      systemPrompt += `\n\nCurrently editing: ${context.currentFile}`;
    }
    
    if (context.learningContext) {
      systemPrompt += `\n\nRelevant patterns from previous successful generations:\n${context.learningContext}`;
    }
    
    return systemPrompt;
  }

  /**
   * Main chat/generation method
   */
  async chat(userMessage, context = {}) {
    if (!this.isOnline) {
      return {
        success: false,
        content: "I'm currently offline. Please check your connection or switch to a local Ollama model.",
        offline: true
      };
    }

    try {
      // Add user message to history
      this.conversationHistory.push({ role: 'user', content: userMessage });
      
      // Trim history if too long
      if (this.conversationHistory.length > this.maxHistoryLength) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
      }

      // Try to find relevant learning patterns
      const keywords = userMessage.split(' ').filter(w => w.length > 3);
      const category = this.categorizeMessage(userMessage);
      const patterns = await LearningDB.findSimilar(category, keywords);
      
      let learningContext = '';
      if (patterns.length > 0) {
        learningContext = patterns.slice(0, 3).map(p => 
          `Previous successful prompt: "${p.prompt.substring(0, 100)}..."`
        ).join('\n');
      }

      const systemPrompt = this.buildSystemPrompt({ ...context, learningContext });

      const response = await this.client.chat.completions.create({
        model: this.currentModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory
        ],
        temperature: 0.7,
        max_tokens: 4096
      });

      const assistantMessage = response.choices[0].message.content;
      
      // Add to history
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });
      
      // Store in chat database if we have a project
      if (context.projectId) {
        await ChatDB.addMessage(context.projectId, 'user', userMessage);
        await ChatDB.addMessage(context.projectId, 'assistant', assistantMessage);
      }

      return {
        success: true,
        content: assistantMessage,
        model: this.currentModel,
        provider: this.provider
      };
    } catch (error) {
      console.error('[MineAI] Chat error:', error);
      
      // Try fallback
      if (this.provider === 'openrouter') {
        await this.tryOllamaFallback();
        if (this.isOnline) {
          return this.chat(userMessage, context);
        }
      }
      
      return {
        success: false,
        content: `Error: ${error.message}. Try switching to a different model or provider.`,
        error: error.message
      };
    }
  }

  /**
   * Categorize message for learning
   */
  categorizeMessage(message) {
    const lower = message.toLowerCase();
    if (lower.includes('item') || lower.includes('tool') || lower.includes('weapon')) return 'items';
    if (lower.includes('block')) return 'blocks';
    if (lower.includes('entity') || lower.includes('mob') || lower.includes('creature')) return 'entities';
    if (lower.includes('model') || lower.includes('blockbench')) return 'models';
    if (lower.includes('texture') || lower.includes('sprite')) return 'textures';
    if (lower.includes('animation') || lower.includes('geckolib')) return 'animations';
    if (lower.includes('recipe') || lower.includes('craft')) return 'recipes';
    if (lower.includes('world') || lower.includes('biome') || lower.includes('structure')) return 'worldgen';
    if (lower.includes('server') || lower.includes('plugin')) return 'server';
    if (lower.includes('error') || lower.includes('crash') || lower.includes('bug')) return 'debugging';
    return 'general';
  }

  /**
   * Generate mod element (item, block, entity, etc.)
   */
  async generateModElement(type, description, context = {}) {
    const prompts = {
      item: `Create a complete Minecraft ${context.modLoader || 'Forge'} mod item with the following description: ${description}

Include:
1. The main Item class
2. Registration code
3. Model JSON
4. Language entry
5. Any necessary textures description`,

      block: `Create a complete Minecraft ${context.modLoader || 'Forge'} mod block: ${description}

Include:
1. The Block class
2. Registration code
3. Blockstate JSON
4. Block model JSON
5. Item model JSON
6. Loot table
7. Language entry`,

      entity: `Create a complete Minecraft ${context.modLoader || 'Forge'} entity: ${description}

Include:
1. The Entity class with AI goals
2. Renderer class
3. Model class (or GeckoLib model JSON)
4. Registration code
5. Spawn rules
6. Loot table`,

      recipe: `Create Minecraft recipes for: ${description}

Include all relevant recipe types (shaped, shapeless, smelting, etc.)`,

      datapack: `Create a Minecraft datapack for: ${description}

Include:
1. pack.mcmeta
2. Relevant function files
3. Any needed predicates or tags`
    };

    const prompt = prompts[type] || `Generate Minecraft code for: ${description}`;
    return this.chat(prompt, context);
  }

  /**
   * Analyze and fix crash log
   */
  async analyzeCrashLog(crashLog, context = {}) {
    const prompt = `Analyze this Minecraft crash log and provide:
1. The root cause of the crash
2. Which mod/plugin is responsible (if identifiable)
3. Step-by-step fix instructions
4. Code fix if applicable

Crash Log:
\`\`\`
${crashLog.substring(0, 3000)}
\`\`\``;

    return this.chat(prompt, context);
  }

  /**
   * Provide feedback on AI response (for learning)
   */
  async provideFeedback(messageIndex, rating, category) {
    const message = this.conversationHistory[messageIndex];
    if (message && message.role === 'assistant') {
      const userMessage = this.conversationHistory[messageIndex - 1];
      if (userMessage) {
        await LearningDB.storePattern(
          category,
          userMessage.content,
          message.content,
          rating
        );
        return true;
      }
    }
    return false;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      provider: this.provider,
      model: this.currentModel,
      isOnline: this.isOnline,
      historyLength: this.conversationHistory.length,
      availableModels: this.getAvailableModels()
    };
  }
}

// Export singleton instance
export const mineAI = new MineAI();

// Export class for custom instances
export default MineAI;