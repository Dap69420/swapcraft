import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  sanitizeModel,
  MODEL_PERSONAS,
  getBAIKey,
  executeLocalTool,
  detectToolIntent,
  buildKeywordFallback,
  buildSystemPrompt,
  historyToMessages,
  matchSkillsForQuery,
  runBAIAssistant,
  streamBAIChat,
  callBAIChat,
  BAI_TOOLS,
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

    // B.AI with function calling
    const baiKey = getBAIKey();
    if (baiKey) {
      try {
        const result = await runBAIAssistant(baiKey, {
          model: selectedModel,
          message,
          history,
          currentUserName,
          availableSkills,
        });
        return res.json({
          reply: result.reply,
          thinking:
            `• [${persona.name} — ${persona.persona}]: Answered via B.AI (${selectedModel})\n` +
            (result.toolCalls.length > 0
              ? `• Executed ${result.toolCalls.map((tc) => `\`${tc.name}\``).join(', ')}\n`
              : `• Direct answer, no tool call needed\n`) +
            `• Scanned platform database for active listings`,
          thinkingDurationMs: Date.now() - startTime,
          model: selectedModel,
          toolCalls: result.toolCalls,
          suggestedSkillIds: result.suggestedSkillIds,
          proposedSkill: result.proposedSkill,
          actions: result.actions,
        });
      } catch (baiErr: any) {
        console.warn('B.AI chat execution fallback:', baiErr?.message);
      }
    }

    // Keyword fallback when B.AI is unavailable
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
      history = [],
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

    const streamBaiKey = getBAIKey();
    if (streamBaiKey) {
      try {
        const system = buildSystemPrompt(persona.name, persona.focus, currentUserName, availableSkills);
        const baiMessages = [
          { role: 'system' as const, content: system },
          ...historyToMessages(history),
          { role: 'user' as const, content: message },
        ];

        sendEvent({
          type: 'thinking',
          text: `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"\n`,
        });
        sendEvent({
          type: 'thinking',
          text: `• Asking B.AI (${selectedModel}) for a community exchange answer\n`,
        });

        const paced = async (text: string) => {
          const w = text.split(' ');
          for (let i = 0; i < w.length; i++) {
            sendEvent({ type: 'content', text: (i === 0 ? '' : ' ') + w[i] });
            await new Promise((r) => setTimeout(r, 18));
          }
        };

        const streamed = await streamBAIChat(streamBaiKey, {
          model: selectedModel,
          messages: baiMessages,
          tools: BAI_TOOLS,
          onDelta: (text) => sendEvent({ type: 'content', text }),
        });

        const completedToolCalls: any[] = [];
        let matchedSkillIds: string[] = [];
        let proposedSkill: any;
        let streamActions: any[] | undefined;

        if (streamed.toolCalls.length > 0) {
          for (const tc of streamed.toolCalls) {
            sendEvent({
              type: 'tool_call',
              toolCall: { id: tc.id, name: tc.name, arguments: tc.args, status: 'calling' },
            });
            const exec = executeLocalTool(tc.name, tc.args, availableSkills);
            completedToolCalls.push(exec.toolCall);
            matchedSkillIds = [...matchedSkillIds, ...exec.matchedSkillIds];
            if ((exec as any).proposedSkill) proposedSkill = (exec as any).proposedSkill;
            if ((exec as any).actions) streamActions = (exec as any).actions;
            sendEvent({ type: 'tool_result', toolCall: exec.toolCall });
          }

          sendEvent({ type: 'thinking', text: `• Synthesizing tool results into a final answer...\n` });

          const toolMessages: any[] = [];
          for (const tc of streamed.toolCalls) {
            const exec = completedToolCalls.find((c) => c.id === tc.id) ?? completedToolCalls[0];
            toolMessages.push({
              role: 'assistant',
              content: '',
              tool_calls: [{ id: tc.id, type: 'function', function: { name: tc.name, arguments: JSON.stringify(tc.args) } }],
            });
            toolMessages.push({
              role: 'tool',
              content: JSON.stringify({ summary: exec?.resultSummary, data: exec?.data }).slice(0, 4000),
              tool_call_id: tc.id,
            });
          }

          const followUp = await callBAIChat(streamBaiKey, {
            model: selectedModel,
            messages: [...baiMessages, ...toolMessages],
          });
          if (followUp.text) await paced(followUp.text);
        }

        sendEvent({
          type: 'done',
          model: selectedModel,
          toolCalls: completedToolCalls,
          suggestedSkillIds:
            matchedSkillIds.length > 0 ? [...new Set(matchedSkillIds)] : matchSkillsForQuery(message, availableSkills),
          proposedSkill,
          actions: streamActions || [
            { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
            { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
            { label: '✨ Post Your Own Skill', type: 'open_modal', payload: 'post_skill' },
          ],
          durationMs: Date.now() - startTime,
        });
        return res.end();
      } catch (baiErr: any) {
        console.warn('B.AI stream execution fallback:', baiErr?.message);
        sendEvent({ type: 'thinking', text: `• B.AI unreachable, answering from the offline engine\n` });
      }
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

