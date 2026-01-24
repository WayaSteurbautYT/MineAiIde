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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history
    const messages = [
      { role: 'system' as const, content: WAYACREATE_SYSTEM_PROMPT },
      ...context.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ];

    console.log('WayaCreate Agent processing request:', { message, contextLength: context.length });

    // Call OpenRouter API
    const completion = await openai.chat.completions.create({
      model: 'meta-llama/llama-3.2-3b-instruct:free',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    console.log('WayaCreate Agent response generated successfully');

    // Log the interaction for improvement
    console.log('Agent Interaction:', {
      userMessage: message,
      agentResponse: response,
      timestamp: new Date().toISOString(),
    });

    res.status(200).json({
      response,
      model: 'meta-llama/llama-3.2-3b-instruct:free',
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
    } else if (errorMessage.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your OpenRouter plan.';
    }

    res.status(500).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
