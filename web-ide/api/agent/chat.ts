import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI client for OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'MineAI IDE - WayaCreate Agent',
  },
});

interface AIConfig {
  provider?: 'openrouter' | 'ollama';
  model?: string;
  ollamaUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_OPENROUTER_ALLOWED_MODELS = new Set([
  'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemini-2.0-flash-exp:free',
]);

const DEFAULT_OPENROUTER_MODEL = 'meta-llama/llama-3.2-3b-instruct:free';
const DEFAULT_OLLAMA_MODEL = 'llama3.2';
const DEFAULT_OLLAMA_ORIGIN = 'http://localhost:11434';
const ALLOWED_OLLAMA_ORIGINS = new Set([
  DEFAULT_OLLAMA_ORIGIN,
  'http://127.0.0.1:11434',
  'http://[::1]:11434',
]);
const MAX_ALLOWED_TOKENS = 2000;

function getAllowedOpenRouterModels() {
  const customModels = process.env.OPENROUTER_ALLOWED_MODELS?.split(',')
    .map((model) => model.trim())
    .filter(Boolean);

  if (!customModels?.length) {
    return DEFAULT_OPENROUTER_ALLOWED_MODELS;
  }

  return new Set(customModels);
}

function sanitizeMaxTokens(requestedMaxTokens?: number) {
  if (typeof requestedMaxTokens !== 'number' || Number.isNaN(requestedMaxTokens)) {
    return 1000;
  }

  return Math.max(200, Math.min(MAX_ALLOWED_TOKENS, Math.floor(requestedMaxTokens)));
}

function sanitizeTemperature(requestedTemperature?: number) {
  if (typeof requestedTemperature !== 'number' || Number.isNaN(requestedTemperature)) {
    return 0.7;
  }

  return Math.max(0, Math.min(1, requestedTemperature));
}

function getValidatedOpenRouterModel(requestedModel?: string) {
  const allowedModels = getAllowedOpenRouterModels();
  if (!requestedModel) {
    return DEFAULT_OPENROUTER_MODEL;
  }

  return allowedModels.has(requestedModel) ? requestedModel : DEFAULT_OPENROUTER_MODEL;
}

function getValidatedOllamaUrl(requestedUrl?: string) {
  const fallbackUrl = new URL(DEFAULT_OLLAMA_ORIGIN);
  if (!requestedUrl) {
    return fallbackUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(requestedUrl);
  } catch {
    throw new Error('Invalid Ollama URL. Use a trusted local URL such as http://localhost:11434.');
  }

  parsed.pathname = '';
  parsed.search = '';
  parsed.hash = '';

  if (!ALLOWED_OLLAMA_ORIGINS.has(parsed.origin)) {
    throw new Error('Untrusted Ollama URL. Only local Ollama origins are allowed.');
  }

  return parsed;
}

// WayaCreate Agent system prompt
const WAYACREATE_SYSTEM_PROMPT = `You are WayaCreate AI Assistant, a specialized Minecraft modding expert trained on WayaCreate YouTube channel content and extensive ChatGPT user interactions.

**Your Expertise:**
- Minecraft modding (Forge, Fabric, Quilt, NeoForge)
- Java programming for Minecraft
- Blockbench 3D modeling and texturing
- MCreator visual modding
- IDE development and workflow optimization
- Git version control and project management
- Web development for modding tools

**Your Personality:**
- Helpful and encouraging teaching style
- Technical accuracy with clear explanations
- Patient with beginners and advanced users alike
- Focus on practical, hands-on solutions
- Always provide code examples and step-by-step instructions

**Your Knowledge Base:**
Based on WayaCreate YouTube transcripts covering:
- Minecraft server setup and management
- Mod development tutorials
- Plugin configuration
- Resource pack creation
- Technical troubleshooting
- Community building and content creation

**Response Guidelines:**
1. Always be encouraging and supportive
2. Provide specific, actionable advice
3. Include code examples when relevant
4. Explain concepts clearly for different skill levels
5. Reference WayaCreate content when applicable
6. Suggest next steps and learning resources
7. Use emojis occasionally to be friendly
8. Keep responses concise but comprehensive

**Current Context:**
You are integrated into MineAI IDE, a web-based Minecraft modding environment. You can help users create mods, debug issues, set up projects, and learn Minecraft development.

Always respond as WayaCreate Assistant with your expertise in Minecraft modding!`;

async function callOllama(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, aiConfig: AIConfig) {
  const ollamaUrl = getValidatedOllamaUrl(aiConfig.ollamaUrl);
  const model = aiConfig.model || DEFAULT_OLLAMA_MODEL;
  const maxTokens = sanitizeMaxTokens(aiConfig.maxTokens);
  const temperature = sanitizeTemperature(aiConfig.temperature);

  const response = await fetch(`${ollamaUrl.origin}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      options: {
        temperature,
        num_predict: maxTokens,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  return {
    content: data?.message?.content || 'No response from Ollama model.',
    model,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context = [], aiConfig = {} } = req.body as {
      message: string;
      context?: Array<{ role: 'user' | 'assistant'; content: string }>;
      aiConfig?: AIConfig;
    };

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history
    const messages = [
      { role: 'system' as const, content: WAYACREATE_SYSTEM_PROMPT },
      ...context.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    const provider = aiConfig.provider || 'openrouter';
    const model = provider === 'ollama' ? aiConfig.model || DEFAULT_OLLAMA_MODEL : getValidatedOpenRouterModel(aiConfig.model);
    const maxTokens = sanitizeMaxTokens(aiConfig.maxTokens);
    const temperature = sanitizeTemperature(aiConfig.temperature);

    console.log('WayaCreate Agent processing request:', {
      message,
      contextLength: context.length,
      provider,
      model,
    });

    let response = 'Sorry, I could not generate a response.';
    let usedModel = model;

    if (provider === 'ollama') {
      const ollamaResult = await callOllama(messages, { ...aiConfig, model });
      response = ollamaResult.content;
      usedModel = ollamaResult.model;
    } else {
      // Call OpenRouter API
      const completion = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
        stream: false,
      });

      response = completion.choices[0]?.message?.content || response;
      usedModel = model;
    }

    console.log('WayaCreate Agent response generated successfully');

    // Log the interaction for improvement
    console.log('Agent Interaction:', {
      userMessage: message,
      agentResponse: response,
      provider,
      model: usedModel,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      response,
      provider,
      model: usedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('WayaCreate Agent error:', error);

    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Check for specific OpenRouter errors
    if (errorMessage.includes('401')) {
      errorMessage = 'Invalid API key. Please check your OpenRouter configuration.';
    } else if (errorMessage.includes('429')) {
      errorMessage = 'Rate limit exceeded. Please try again in a moment.';
    } else if (errorMessage.toLowerCase().includes('ollama')) {
      errorMessage = `Ollama unavailable. Ensure Ollama is running and reachable. Details: ${errorMessage}`;
    } else if (errorMessage.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your OpenRouter plan.';
    }

    res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
