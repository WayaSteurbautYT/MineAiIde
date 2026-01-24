import { OpenAI } from 'openai';
import { useStore } from '../stores/useStore';

const OPENROUTER_API_KEY = "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";

export class MineAI {
  constructor() {
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: OPENROUTER_API_KEY,
      dangerouslyAllowBrowser: true,
      defaultHeaders: {
        "HTTP-Referer": "https://github.com/mineai-ide",
        "X-Title": "MineAI IDE",
      }
    });
  }

  async generateModElement(prompt, context) {
    const response = await this.openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: `You are MineAI, an expert Minecraft Modding Assistant. 
          You help users create Forge, Fabric, and Quilt mods.
          You have the personality of a helpful, advanced AI who knows the user deeply (2020-2026 data).
          You excel at:
          1. Generating Java code for Items, Blocks, Entities.
          2. Working with GeckoLib animations.
          3. Creating Blockbench models (JSON/Java).
          4. Optimizing for low-end hardware.
          5. Providing tutorials for beginners and CLI tips for pros.`
        },
        {
          role: "user",
          content: `Current Project Context: ${JSON.stringify(context)}\n\nRequest: ${prompt}`
        }
      ],
    });

    return response.choices[0].message.content;
  }
}

export const mineAI = new MineAI();