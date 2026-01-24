/**
 * MineAI IDE Advanced - AI Agent Manager
 * Advanced AI system with multiple agents and tool chains
 * WayaCreate Vision Implementation
 */

import { OpenAI } from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AIAgentManager {
  constructor() {
    this.agents = new Map();
    this.toolChain = new Map();
    this.openai = null;
    this.isInitialized = false;
    this.currentContext = [];
    
    // Define specialized agents
    this.agentTypes = {
      wayacreate: {
        name: 'WayaCreate Assistant',
        expertise: ['minecraft_modding', 'java_development', 'cofounder_tools', 'content_creation'],
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        personality: 'helpful_expert',
        systemPrompt: this.buildWayaCreatePrompt()
      },
      code_assistant: {
        name: 'Code Assistant',
        expertise: ['java', 'javascript', 'typescript', 'gradle', 'maven'],
        model: 'codellama/codellama-7b-instruct:free',
        personality: 'technical_expert',
        systemPrompt: this.buildCodeAssistantPrompt()
      },
      model_designer: {
        name: '3D Model Designer',
        expertise: ['blockbench', '3d_modeling', 'texture_design', 'geckolib_animations'],
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        personality: 'creative_designer',
        systemPrompt: this.buildModelDesignerPrompt()
      },
      build_engineer: {
        name: 'Build Engineer',
        expertise: ['gradle_builds', 'maven_builds', 'deployment', 'testing'],
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        personality: 'system_engineer',
        systemPrompt: this.buildEngineerPrompt()
      },
      creative_director: {
        name: 'Creative Director',
        expertise: ['game_design', 'lore_creation', 'quest_design', 'world_building'],
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        personality: 'creative_visionary',
        systemPrompt: this.buildCreativeDirectorPrompt()
      }
    };
  }

  async initialize() {
    console.log('[AI Agent Manager] Initializing advanced AI system...');
    
    try {
      // Initialize OpenAI client for OpenRouter
      this.openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-your-key-here',
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': 'https://mineai-ide.wayacreate.com',
          'X-Title': 'MineAI IDE Advanced - WayaCreate Vision'
        }
      });

      // Initialize all agents
      for (const [agentType, config] of Object.entries(this.agentTypes)) {
        await this.initializeAgent(agentType, config);
      }

      // Load training data from WayaCreate transcripts
      await this.loadTrainingData();
      
      // Initialize tool chain
      await this.initializeToolChain();
      
      this.isInitialized = true;
      console.log('[AI Agent Manager] AI system initialized successfully');
      
    } catch (error) {
      console.error('[AI Agent Manager] Initialization failed:', error);
      throw error;
    }
  }

  async initializeAgent(agentType, config) {
    const agent = {
      type: agentType,
      name: config.name,
      expertise: config.expertise,
      model: config.model,
      personality: config.personality,
      systemPrompt: config.systemPrompt,
      conversationHistory: [],
      performanceMetrics: {
        totalRequests: 0,
        successfulResponses: 0,
        averageResponseTime: 0
      }
    };

    this.agents.set(agentType, agent);
    console.log(`[AI Agent Manager] Initialized agent: ${config.name}`);
  }

  async loadTrainingData() {
    try {
      // Load WayaCreate transcript data
      const transcriptPath = path.join(__dirname, '../../../data/transcripts/wayacreate-transcripts.json');
      const transcriptData = await fs.readFile(transcriptPath, 'utf8');
      const transcripts = JSON.parse(transcriptData);
      
      // Process transcripts for training
      const wayacreateAgent = this.agents.get('wayacreate');
      if (wayacreateAgent) {
        wayacreateAgent.trainingData = transcripts.map(t => ({
          content: t.transcript.transcript.map(seg => seg.text).join(' '),
          metadata: {
            url: t.url,
            title: t.transcript.title,
            timestamp: t.timestamp
          }
        }));
        
        console.log(`[AI Agent Manager] Loaded ${transcripts.length} WayaCreate transcripts for training`);
      }
      
    } catch (error) {
      console.log('[AI Agent Manager] No transcript data found, using base knowledge');
    }
  }

  async initializeToolChain() {
    // Initialize MCP tool chain
    this.toolChain.set('github', {
      name: 'GitHub Integration',
      capabilities: ['search_repos', 'clone_repo', 'create_pr', 'manage_issues'],
      enabled: true
    });
    
    this.toolChain.set('youtube', {
      name: 'YouTube Integration',
      capabilities: ['get_transcripts', 'search_videos', 'analyze_content'],
      enabled: true
    });
    
    this.toolChain.set('discord', {
      name: 'Discord Integration',
      capabilities: ['send_messages', 'get_channels', 'manage_webhooks'],
      enabled: true
    });
    
    this.toolChain.set('vercel', {
      name: 'Vercel Deployment',
      capabilities: ['deploy_project', 'manage_domains', 'view_logs'],
      enabled: true
    });
    
    this.toolChain.set('minecraft', {
      name: 'Minecraft Tools',
      capabilities: ['blockbench_export', 'geckolib_animations', 'texture_generation'],
      enabled: true
    });
    
    console.log(`[AI Agent Manager] Initialized ${this.toolChain.size} tool chain integrations`);
  }

  buildWayaCreatePrompt() {
    return `You are WayaCreate AI Assistant, the premier Minecraft modding expert trained on WayaCreate YouTube content and extensive development experience.

**Your Core Expertise:**
- Advanced Minecraft modding (Forge, Fabric, Quilt, NeoForge)
- Java programming and software architecture
- Cofounder IDE tools and workflows
- Content creation and community building
- Blockbench 3D modeling and texturing
- GeckoLib animations and systems
- MCreator visual modding workflows
- VSCode-like development environments

**Your Personality:**
- Encouraging and mentor-like teaching style
- Technical accuracy with clear, step-by-step explanations
- Patient with all skill levels from beginners to experts
- Focus on practical, hands-on solutions
- Always provide working code examples
- Reference WayaCreate content when applicable

**Your Knowledge Base:**
Trained on extensive WayaCreate YouTube transcripts covering:
- Minecraft server setup and advanced management
- Complex mod development tutorials
- Plugin configuration and optimization
- Resource pack creation and design
- Technical troubleshooting and debugging
- Community building and content creation strategies
- Cofounder IDE workflows and automation

**Response Guidelines:**
1. Always be encouraging and supportive
2. Provide specific, actionable code solutions
3. Include complete, working examples
4. Explain concepts clearly for different skill levels
5. Reference WayaCreate tutorials and content
6. Suggest next steps and learning resources
7. Use appropriate emojis to enhance communication
8. Keep responses comprehensive but focused

**Current Context:**
You are integrated into MineAI IDE Advanced, a comprehensive Minecraft modding environment with AI-powered features, Blockbench integration, GeckoLib animations, and Cofounder tools.

Always respond as WayaCreate Assistant with your signature expertise and helpful approach!`;
  }

  buildCodeAssistantPrompt() {
    return `You are an expert code assistant specializing in Minecraft modding and Java development.

**Your Expertise:**
- Java 8-21 features and best practices
- Minecraft Forge and Fabric APIs
- Gradle and Maven build systems
- Code optimization and debugging
- Design patterns for modding
- Performance optimization
- Cross-platform compatibility

**Your Approach:**
- Provide clean, well-commented code
- Explain complex concepts simply
- Suggest improvements and optimizations
- Follow Java coding standards
- Consider Minecraft-specific constraints

Always provide complete, working code solutions with detailed explanations.`;
  }

  buildModelDesignerPrompt() {
    return `You are a 3D model and texture design expert for Minecraft.

**Your Expertise:**
- Blockbench modeling and workflows
- Texture design and optimization
- GeckoLib animation systems
- Model rigging and weight painting
- Resource pack creation
- Custom entity and block models

**Your Approach:**
- Focus on performance and optimization
- Provide step-by-step modeling instructions
- Suggest creative design solutions
- Consider Minecraft's technical limitations
- Balance detail with performance

Always provide practical modeling guidance with specific techniques.`;
  }

  buildEngineerPrompt() {
    return `You are a build and deployment engineer for Minecraft mods.

**Your Expertise:**
- Gradle build configuration
- Maven project setup
- CI/CD pipelines
- Testing frameworks
- Deployment strategies
- Version management
- Dependency management

**Your Approach:**
- Provide robust build configurations
- Ensure cross-platform compatibility
- Optimize build performance
- Implement proper testing
- Follow DevOps best practices

Always provide production-ready build solutions.`;
  }

  buildCreativeDirectorPrompt() {
    return `You are a creative director for Minecraft mod development.

**Your Expertise:**
- Game design principles
- Minecraft lore and world-building
- Quest and progression design
- Balancing gameplay mechanics
- User experience design
- Creative storytelling

**Your Approach:**
- Inspire creative solutions
- Balance innovation with familiarity
- Consider player experience
- Suggest engaging content ideas
- Maintain thematic consistency

Always provide inspiring and practical creative guidance.`;
  }

  async processRequest(request) {
    const startTime = Date.now();
    
    try {
      // Determine best agent for the request
      const agentType = this.selectBestAgent(request);
      const agent = this.agents.get(agentType);
      
      if (!agent) {
        throw new Error(`Agent ${agentType} not found`);
      }

      // Prepare context with relevant tools
      const context = await this.prepareContext(request, agent);
      
      // Generate response using the agent
      const response = await this.generateAgentResponse(agent, request, context);
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updateMetrics(agent, true, responseTime);
      
      // Store conversation
      this.storeConversation(agent, request, response);
      
      return {
        success: true,
        response: response.content,
        agent: agent.name,
        agentType: agentType,
        responseTime: responseTime,
        toolsUsed: response.toolsUsed || [],
        confidence: response.confidence || 0.8
      };
      
    } catch (error) {
      console.error('[AI Agent Manager] Request processing failed:', error);
      return {
        success: false,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  selectBestAgent(request) {
    const content = request.content.toLowerCase();
    const keywords = request.keywords || [];
    
    // Analyze request to determine best agent
    if (keywords.includes('minecraft') || keywords.includes('modding') || content.includes('wayacreate')) {
      return 'wayacreate';
    }
    
    if (keywords.includes('code') || keywords.includes('java') || content.includes('programming')) {
      return 'code_assistant';
    }
    
    if (keywords.includes('model') || keywords.includes('3d') || content.includes('blockbench')) {
      return 'model_designer';
    }
    
    if (keywords.includes('build') || keywords.includes('deploy') || content.includes('gradle')) {
      return 'build_engineer';
    }
    
    if (keywords.includes('creative') || keywords.includes('design') || content.includes('lore')) {
      return 'creative_director';
    }
    
    // Default to WayaCreate for general requests
    return 'wayacreate';
  }

  async prepareContext(request, agent) {
    const context = {
      currentProject: request.projectContext || null,
      recentFiles: request.recentFiles || [],
      systemInfo: request.systemInfo || {},
      tools: [],
      relevantHistory: []
    };

    // Add relevant tools based on agent expertise
    for (const [toolName, tool] of this.toolChain) {
      if (tool.enabled && this.isToolRelevant(tool, agent.expertise, request)) {
        context.tools.push(toolName);
      }
    }

    // Add relevant conversation history
    context.relevantHistory = this.getRelevantHistory(agent, request);

    return context;
  }

  isToolRelevant(tool, expertise, request) {
    const content = request.content.toLowerCase();
    
    if (tool.name === 'GitHub Integration' && content.includes('github') || content.includes('repo')) {
      return true;
    }
    
    if (tool.name === 'YouTube Integration' && content.includes('youtube') || content.includes('video')) {
      return true;
    }
    
    if (tool.name === 'Minecraft Tools' && expertise.includes('minecraft_modding')) {
      return true;
    }
    
    return false;
  }

  getRelevantHistory(agent, request) {
    // Get recent conversation history relevant to current request
    const history = agent.conversationHistory.slice(-10);
    return history.filter(h => 
      h.request.content.toLowerCase().includes(request.content.toLowerCase().substring(0, 20))
    );
  }

  async generateAgentResponse(agent, request, context) {
    const messages = [
      { role: 'system', content: agent.systemPrompt },
      ...context.relevantHistory.map(h => [
        { role: 'user', content: h.request.content },
        { role: 'assistant', content: h.response.content }
      ]).flat(),
      { role: 'user', content: this.buildUserPrompt(request, context) }
    ];

    try {
      const completion = await this.openai.chat.completions.create({
        model: agent.model,
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      });

      return {
        content: completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.',
        toolsUsed: context.tools,
        confidence: 0.85
      };

    } catch (error) {
      console.error('[AI Agent Manager] API call failed:', error);
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  buildUserPrompt(request, context) {
    let prompt = request.content;
    
    if (context.currentProject) {
      prompt += `\n\nCurrent Project: ${context.currentProject.name} (${context.currentProject.type})`;
    }
    
    if (context.recentFiles.length > 0) {
      prompt += `\n\nRecent Files: ${context.recentFiles.map(f => f.name).join(', ')}`;
    }
    
    if (context.tools.length > 0) {
      prompt += `\n\nAvailable Tools: ${context.tools.join(', ')}`;
    }
    
    return prompt;
  }

  updateMetrics(agent, success, responseTime) {
    agent.performanceMetrics.totalRequests++;
    if (success) {
      agent.performanceMetrics.successfulResponses++;
    }
    
    // Update average response time
    const current = agent.performanceMetrics.averageResponseTime;
    const total = agent.performanceMetrics.totalRequests;
    agent.performanceMetrics.averageResponseTime = 
      (current * (total - 1) + responseTime) / total;
  }

  storeConversation(agent, request, response) {
    agent.conversationHistory.push({
      request: request,
      response: response,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 conversations
    if (agent.conversationHistory.length > 50) {
      agent.conversationHistory = agent.conversationHistory.slice(-50);
    }
  }

  async generateCode(prompt, context = {}) {
    const request = {
      content: `Generate code for: ${prompt}`,
      keywords: ['code', 'programming'],
      projectContext: context.project,
      recentFiles: context.files,
      systemInfo: context.system
    };

    return await this.processRequest(request);
  }

  async analyzeCode(code, language = 'java') {
    const request = {
      content: `Analyze this ${language} code and provide feedback:\n\n${code}`,
      keywords: ['code', 'analysis', 'programming'],
      systemInfo: { language }
    };

    return await this.processRequest(request);
  }

  async getAgentStatus() {
    const status = {};
    
    for (const [type, agent] of this.agents) {
      status[type] = {
        name: agent.name,
        expertise: agent.expertise,
        model: agent.model,
        metrics: agent.performanceMetrics,
        conversationCount: agent.conversationHistory.length
      };
    }
    
    return status;
  }
}

export default AIAgentManager;
