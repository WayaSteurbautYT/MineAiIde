/**
 * MineAI IDE MVP Web Server
 * Free tools only - No API keys required initially
 * Uses MCP tools for integrations
 */

const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs-extra');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for MVP
let projects = [];
let codeFiles = new Map();
let aiConversations = new Map();
let buildHistory = [];

// MCP Tool Integrations (Free)
const mcpTools = {
  // GitHub MCP (Free tier)
  github: {
    searchRepos: async (query) => {
      try {
        // Use GitHub API without auth (public repos only)
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`);
        return await response.json();
      } catch (error) {
        console.log('GitHub MCP fallback:', error.message);
        return { items: [] };
      }
    },
    getFileContent: async (repo, filePath) => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`);
        return await response.json();
      } catch (error) {
        console.log('GitHub file fetch error:', error.message);
        return null;
      }
    }
  },

  // YouTube MCP (Free via transcripts)
  youtube: {
    getTranscript: async (videoUrl) => {
      // Simulate transcript extraction for MVP
      const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return {
        videoId,
        transcript: [
          { start: '0:00', text: 'Welcome to this Minecraft tutorial' },
          { start: '0:05', text: 'Today we will learn about modding' },
          { start: '0:10', text: 'Let me show you how to create a simple block' }
        ]
      };
    }
  },

  // Discord MCP (Free tier)
  discord: {
    sendMessage: async (channelId, message) => {
      // Simulate Discord message for MVP
      console.log(`Discord simulation: Sending to ${channelId}: ${message}`);
      return { success: true, messageId: uuidv4() };
    }
  },

  // Vercel MCP (Free tier)
  vercel: {
    deployProject: async (projectData) => {
      // Simulate Vercel deployment for MVP
      console.log('Vercel simulation: Deploying project');
      return { 
        success: true, 
        url: `https://${projectData.name}-vercel.app`,
        deploymentId: uuidv4()
      };
    }
  }
};

// WebSocket for real-time communication
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'ai_request':
          await handleAIRequest(ws, data);
          break;
        case 'code_generation':
          await handleCodeGeneration(ws, data);
          break;
        case 'mcp_tool':
          await handleMCPTool(ws, data);
          break;
        case 'project_action':
          await handleProjectAction(ws, data);
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown request type' }));
      }
    } catch (error) {
      console.error('WebSocket error:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// AI Request Handler (Free OpenRouter models)
async function handleAIRequest(ws, data) {
  const { message, context, agentType = 'wayacreate' } = data;
  
  try {
    // Use free OpenRouter model or local simulation
    let response;
    
    if (process.env.OPENROUTER_API_KEY) {
      // Real AI call
      response = await callOpenRouter(message, context, agentType);
    } else {
      // Simulated AI response for MVP
      response = generateSimulatedResponse(message, context, agentType);
    }
    
    // Store conversation
    const conversationId = data.conversationId || uuidv4();
    if (!aiConversations.has(conversationId)) {
      aiConversations.set(conversationId, []);
    }
    aiConversations.get(conversationId).push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    aiConversations.get(conversationId).push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    });
    
    ws.send(JSON.stringify({
      type: 'ai_response',
      response,
      conversationId,
      agentType
    }));
    
  } catch (error) {
    console.error('AI request error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'AI service unavailable'
    }));
  }
}

// Code Generation Handler
async function handleCodeGeneration(ws, data) {
  const { prompt, language = 'java', framework = 'forge' } = data;
  
  try {
    let code;
    
    if (process.env.OPENROUTER_API_KEY) {
      // Real code generation
      code = await generateCodeWithAI(prompt, language, framework);
    } else {
      // Template-based generation for MVP
      code = generateCodeTemplate(prompt, language, framework);
    }
    
    // Store code file
    const fileId = uuidv4();
    codeFiles.set(fileId, {
      id: fileId,
      language,
      framework,
      code,
      prompt,
      timestamp: new Date().toISOString()
    });
    
    ws.send(JSON.stringify({
      type: 'code_generated',
      fileId,
      code,
      language,
      framework
    }));
    
  } catch (error) {
    console.error('Code generation error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: 'Code generation failed'
    }));
  }
}

// MCP Tool Handler
async function handleMCPTool(ws, data) {
  const { tool, action, params } = data;
  
  try {
    let result;
    
    if (mcpTools[tool] && mcpTools[tool][action]) {
      result = await mcpTools[tool][action](params);
    } else {
      result = { error: 'Tool or action not found' };
    }
    
    ws.send(JSON.stringify({
      type: 'mcp_result',
      tool,
      action,
      result
    }));
    
  } catch (error) {
    console.error('MCP tool error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: `MCP tool ${tool}.${action} failed`
    }));
  }
}

// Project Action Handler
async function handleProjectAction(ws, data) {
  const { action, projectData } = data;
  
  try {
    let result;
    
    switch (action) {
      case 'create':
        const project = {
          id: uuidv4(),
          ...projectData,
          created: new Date().toISOString(),
          modified: new Date().toISOString()
        };
        projects.push(project);
        result = { success: true, project };
        break;
        
      case 'list':
        result = { success: true, projects };
        break;
        
      case 'build':
        const buildResult = await simulateBuild(projectData);
        buildHistory.push(buildResult);
        result = buildResult;
        break;
        
      default:
        result = { error: 'Unknown project action' };
    }
    
    ws.send(JSON.stringify({
      type: 'project_result',
      action,
      result
    }));
    
  } catch (error) {
    console.error('Project action error:', error);
    ws.send(JSON.stringify({
      type: 'error',
      message: `Project action ${action} failed`
    }));
  }
}

// Helper Functions

async function callOpenRouter(message, context, agentType) {
  // Real OpenRouter API call
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mineai-mvp.wayacreate.com',
      'X-Title': 'MineAI MVP - WayaCreate Agent'
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(agentType)
        },
        {
          role: 'user',
          content: buildContextualPrompt(message, context)
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return data.choices[0]?.message?.content || 'AI response unavailable';
}

function generateSimulatedResponse(message, context, agentType) {
  // Simulated AI responses for MVP
  const responses = {
    wayacreate: `👋 Hello! I'm WayaCreate AI Assistant. Based on your request "${message}", I suggest:\n\n1. Start with a basic Forge mod structure\n2. Create your main mod class with @Mod annotation\n3. Add event handlers for your custom content\n4. Test in a development environment\n\nWould you like me to generate the code for you?`,
    code_assistant: `💻 For your coding request "${message}", here's what I recommend:\n\n- Use proper Java conventions\n- Include necessary imports\n- Add error handling\n- Follow Minecraft modding best practices\n\nLet me generate the code template for you!`,
    model_designer: `🎨 For your modeling request "${message}", I suggest:\n\n1. Start with basic block shape in Blockbench\n2. Define UV mapping for textures\n3. Add animation bones if needed\n4. Export to Minecraft format\n\nWant me to help you create the model?`
  };
  
  return responses[agentType] || responses.wayacreate;
}

function generateCodeTemplate(prompt, language, framework) {
  const templates = {
    'java-forge': `package com.example.mod;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.eventbus.api.IEventBus;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod("examplemod")
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    
    public ExampleMod() {
        IEventBus modEventBus = FMLJavaModLoadingContext.get().getModEventBus();
        
        // Register mod contents here
        modEventBus.addListener(this::commonSetup);
    }
    
    private void commonSetup(final net.minecraftforge.event.entity.EntityAttributeCreationEvent event) {
        // Common setup logic
    }
}`,
    'java-fabric': `package com.example.mod;

import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExampleMod implements ModInitializer {
    public static final String MOD_ID = "examplemod";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);
    
    @Override
    public void onInitialize() {
        LOGGER.info("Initializing Example Mod");
        
        // Mod initialization logic here
    }
}`
  };
  
  const key = `${language}-${framework}`;
  return templates[key] || templates['java-forge'];
}

function getSystemPrompt(agentType) {
  const prompts = {
    wayacreate: "You are WayaCreate AI Assistant, expert Minecraft modder with extensive YouTube content experience.",
    code_assistant: "You are a code assistant specializing in Minecraft modding and Java development.",
    model_designer: "You are a 3D modeling expert for Minecraft, specializing in Blockbench and creative design."
  };
  
  return prompts[agentType] || prompts.wayacreate;
}

function buildContextualPrompt(message, context) {
  let prompt = message;
  
  if (context && context.currentProject) {
    prompt += `\n\nCurrent Project: ${context.currentProject.name} (${context.currentProject.type})`;
  }
  
  if (context && context.recentFiles) {
    prompt += `\n\nRecent Files: ${context.recentFiles.map(f => f.name).join(', ')}`;
  }
  
  return prompt;
}

async function simulateBuild(projectData) {
  // Simulate build process
  return {
    success: true,
    buildId: uuidv4(),
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 30000).toISOString(),
    output: `Build completed successfully for ${projectData.name}`,
    artifacts: [
      { name: `${projectData.name}-1.0.0.jar`, size: '2.3MB' }
    ]
  };
}

// REST API Routes
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    version: '1.0.0',
    tools: Object.keys(mcpTools),
    projects: projects.length,
    conversations: aiConversations.size
  });
});

app.get('/api/projects', (req, res) => {
  res.json({ projects });
});

app.post('/api/projects', (req, res) => {
  const project = {
    id: uuidv4(),
    ...req.body,
    created: new Date().toISOString(),
    modified: new Date().toISOString()
  };
  projects.push(project);
  res.json({ success: true, project });
});

app.get('/api/mcp-tools', (req, res) => {
  res.json({ 
    tools: Object.keys(mcpTools),
    capabilities: Object.keys(mcpTools).map(tool => ({
      name: tool,
      actions: Object.keys(mcpTools[tool])
    }))
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3006;
server.listen(PORT, () => {
  console.log(`🚀 MineAI MVP Web Server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to start building!`);
  console.log(`🔧 Available MCP Tools: ${Object.keys(mcpTools).join(', ')}`);
  console.log(`🤖 AI: ${process.env.OPENROUTER_API_KEY ? 'OpenRouter Connected' : 'Simulation Mode'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down MineAI MVP server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});
