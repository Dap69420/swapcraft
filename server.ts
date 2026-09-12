import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  findActiveSkillsTool,
  getSkillDetailsTool,
  createSkillForUserTool,
  navigatePlatformTool,
  sanitizeModel,
  MODEL_PERSONAS,
  executeLocalTool,
  detectToolIntent,
  buildKeywordFallback,
} from './api/_lib/swapAI';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Lazy Gemini client initialization
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: key });
  }
  return geminiClient;
}

// Chat assistant endpoint
app.post('/api/ai/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      message,
      history = [],
      currentUserName = 'Artisan',
      availableSkills = [],
      model = 'hy3',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const selectedModel = sanitizeModel(model);
    const persona = MODEL_PERSONAS[selectedModel] || MODEL_PERSONAS['hy3'];

    // Tool intent takes priority
    const toolIntent = detectToolIntent(message);
    if (toolIntent) {
      const toolExec = executeLocalTool(toolIntent.toolName, toolIntent.args, availableSkills);
      const duration = Math.max(Date.now() - startTime, 460);

      return res.json({
        reply: toolExec.markdownReply,
        thinking: `• [${persona.name} — ${persona.persona}]: Identified tool intent for "${message.slice(0, 40)}"
• Calling tool: \`${toolIntent.toolName}\` with parameters: ${JSON.stringify(toolIntent.args)}
• Scanning ${availableSkills.length} active platform exchange listings
• Tool execution completed: ${toolExec.toolCall.resultSummary}
• Formatting structured Markdown response with reciprocal exchange paths`,
        thinkingDurationMs: duration,
        model: selectedModel,
        toolCalls: [toolExec.toolCall],
        suggestedSkillIds: toolExec.matchedSkillIds,
        proposedSkill: (toolExec as any).proposedSkill,
        actions: (toolExec as any).actions || [
          { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
          { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
          { label: '✨ Post Your Own Skill', type: 'open_modal', payload: 'post_skill' },
        ],
      });
    }

    // Gemini with function calling
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const chat = gemini.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: `You are the SwapCraft AI Concierge (${persona.name}), an intelligent assistant specialized in ${persona.focus}.
SwapCraft is a zero-money, community-driven skill swap and knowledge exchange platform.
Never mention backend platform providers (B.AI, OpenAI, Google, etc.). Identify purely as the SwapCraft AI Concierge (${persona.name}).
Current user: "${currentUserName}".
Use Markdown formatting with headings (###), bullet points, and bold text for recommendations.
Always prioritize using the find_active_skills tool whenever the user asks about available skills, learning opportunities, or taking part in crafts.
Use create_skill_for_user when the user wants to upload, create, or add a skill to their account.
Use navigate_platform to guide them to pages like /discover, /matchmaker, /community, /messages, /my-swaps, /credits, /profile.`,
            tools: [{ functionDeclarations: [findActiveSkillsTool, getSkillDetailsTool, createSkillForUserTool, navigatePlatformTool] }],
          },
        });

        const geminiRes = await chat.sendMessage({ message });
        const functionCalls = geminiRes.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          const toolExec = executeLocalTool(call.name, call.args, availableSkills);

          // Return tool result to Gemini to synthesize response
          const turn2 = await chat.sendMessage({
            message: [
              {
                functionResponse: {
                  name: call.name,
                  response: { result: toolExec.toolCall.data, summary: toolExec.toolCall.resultSummary },
                },
              },
            ],
          });

          return res.json({
            reply: turn2.text || toolExec.markdownReply,
            thinking: `• [${persona.name}]: Executed function \`${call.name}\`
• Scanned platform database for active listings
• Generated structured Markdown guidance`,
            thinkingDurationMs: Date.now() - startTime,
            model: selectedModel,
            toolCalls: [toolExec.toolCall],
            suggestedSkillIds: toolExec.matchedSkillIds,
            actions: [
              { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
              { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
            ],
          });
        }

        if (geminiRes.text) {
          return res.json({
            reply: geminiRes.text,
            thinking: `• [${persona.name}]: Analyzed query and crafted community exchange response.`,
            thinkingDurationMs: Date.now() - startTime,
            model: selectedModel,
            suggestedSkillIds: [],
            actions: [
              { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
              { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
            ],
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini chat execution fallback:', geminiErr?.message);
      }
    }

    // Keyword fallback when Gemini is unavailable
    const fallback = buildKeywordFallback(message, currentUserName, availableSkills);
    return res.json({
      reply: fallback.reply,
      thinking: `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"
• Contextualized community peer guidance for ${currentUserName}.
• Synthesized zero-money exchange guidance and quick action pathways.`,
      thinkingDurationMs: Math.max(Date.now() - startTime, 420),
      model: selectedModel,
      suggestedSkillIds: fallback.suggestedSkillIds,
      actions: fallback.actions,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat handler:', error);
    return res.json({
      reply: "I'm here to help you navigate SwapCraft and discover incredible skills to trade! What would you like to explore?",
      thinking: 'Fallback reasoning execution: Restoring basic navigation routes.',
      thinkingDurationMs: 350,
      model: 'hy3',
      suggestedSkillIds: [],
      actions: [
        { label: '🔍 Explore All Crafts', type: 'navigate', path: '/discover' },
        { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
        { label: '✨ Post a Skill Offer', type: 'open_modal', payload: 'post_skill' },
      ],
    });
  }
});

// Streaming assistant endpoint (SSE)
app.post('/api/ai/chat/stream', async (req, res) => {
  const startTime = Date.now();
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (eventData: any) => {
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  };

  try {
    const {
      message,
      currentUserName = 'Artisan',
      availableSkills = [],
      model = 'hy3',
    } = req.body;

    if (!message || typeof message !== 'string') {
      sendEvent({ type: 'error', error: 'Message text is required' });
      return res.end();
    }

    const selectedModel = sanitizeModel(model);
    const persona = MODEL_PERSONAS[selectedModel] || MODEL_PERSONAS['hy3'];

    // Tool intent
    const toolIntent = detectToolIntent(message);

    if (toolIntent) {
      // Step A: Stream thinking tokens showing tool resolution
      sendEvent({
        type: 'thinking',
        text: `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"\n`,
      });
      await new Promise((r) => setTimeout(r, 160));

      sendEvent({
        type: 'thinking',
        text: `• Identified user intent: Search community directory for active skill swaps\n`,
      });
      await new Promise((r) => setTimeout(r, 140));

      sendEvent({
        type: 'thinking',
        text: `• Invoking tool: \`${toolIntent.toolName}\` (${JSON.stringify(toolIntent.args)})\n`,
      });
      await new Promise((r) => setTimeout(r, 120));

      // Step B: Send live tool_call event (status: 'calling')
      const initialToolCall = {
        id: `tool_${Date.now()}`,
        name: toolIntent.toolName,
        arguments: toolIntent.args,
        status: 'calling' as const,
      };
      sendEvent({ type: 'tool_call', toolCall: initialToolCall });

      // Step C: Execute tool with a realistic execution pause
      await new Promise((r) => setTimeout(r, 260));
      const toolExec = executeLocalTool(toolIntent.toolName, toolIntent.args, availableSkills);

      // Step D: Send live tool_result event (status: 'completed')
      sendEvent({
        type: 'tool_result',
        toolCall: toolExec.toolCall,
      });

      sendEvent({
        type: 'thinking',
        text: `• Tool result: ${toolExec.toolCall.resultSummary}\n• Synthesizing structured Markdown presentation...\n`,
      });
      await new Promise((r) => setTimeout(r, 150));

      // Step E: Thinking finished
      sendEvent({ type: 'thinking_done', durationMs: Date.now() - startTime });
      await new Promise((r) => setTimeout(r, 100));

      // Step F: Stream Markdown content words
      const words = toolExec.markdownReply.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        sendEvent({ type: 'content', text: chunk });
        await new Promise((r) => setTimeout(r, 18));
      }

      // Step G: Send done event with toolCalls, suggestedSkillIds, and actions
      sendEvent({
        type: 'done',
        model: selectedModel,
        toolCalls: [toolExec.toolCall],
        suggestedSkillIds: toolExec.matchedSkillIds,
        proposedSkill: (toolExec as any).proposedSkill,
        actions: (toolExec as any).actions || [
          { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
          { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
          { label: '✨ Post Your Own Skill', type: 'open_modal', payload: 'post_skill' },
        ],
        durationMs: Date.now() - startTime,
      });

      return res.end();
    }

    // Standard dialogue stream
    const thinkingSteps = [
      `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"`,
      `• Evaluating multi-turn context and community craft interests for ${currentUserName}.`,
      `• Formulating community-first peer exchange response with zero fees.`,
    ];

    for (const step of thinkingSteps) {
      sendEvent({ type: 'thinking', text: step + '\n' });
      await new Promise((r) => setTimeout(r, 160));
    }

    sendEvent({ type: 'thinking_done', durationMs: Date.now() - startTime });
    await new Promise((r) => setTimeout(r, 100));

    const reply = `Hello **${currentUserName}**! I'm your SwapCraft AI Concierge (**${persona.name}**).

I'm here to help you exchange knowledge without money. You can ask me to:
* **"Find active skills out there I can take part in"** to search our live artisan registry.
* **"Find a sourdough baking partner"** or **"Show React and TypeScript mentoring"**.
* Explore **Community Circles** or explain **Karma Credits**.`;

    const words = reply.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      sendEvent({ type: 'content', text: chunk });
      await new Promise((r) => setTimeout(r, 18));
    }

    sendEvent({
      type: 'done',
      model: selectedModel,
      suggestedSkillIds: availableSkills.slice(0, 2).map((s: any) => s.id),
      actions: [
        { label: '🔍 Explore All Crafts', type: 'navigate', path: '/discover' },
        { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
        { label: '✨ Post a Skill Offer', type: 'open_modal', payload: 'post_skill' },
      ],
      durationMs: Date.now() - startTime,
    });

    res.end();
  } catch (err: any) {
    console.error('Error in /api/ai/chat/stream:', err);
    sendEvent({ type: 'error', error: err?.message });
    res.end();
  }
});

// Vite middleware for local development
let viteMiddlewareReady: any = null;
const viteInitPromise = (async () => {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    return vite.middlewares;
  }
  return null;
})();

app.use(async (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      if (!viteMiddlewareReady) {
        viteMiddlewareReady = await viteInitPromise;
      }
      if (viteMiddlewareReady) {
        return viteMiddlewareReady(req, res, next);
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Local dev server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SwapCraft Server running on http://0.0.0.0:${PORT}`);
});

