import { sanitizeModel, MODEL_PERSONAS, executeLocalTool, detectToolIntent } from '../../../_lib/swapAI';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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
    } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      sendEvent({ type: 'error', error: 'Message text is required' });
      res.end();
      return;
    }

    const selectedModel = sanitizeModel(model);
    const persona = MODEL_PERSONAS[selectedModel];

    const toolIntent = detectToolIntent(message);

    if (toolIntent) {
      sendEvent({
        type: 'thinking',
        text: `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"\n`,
      });
      await wait(160);

      sendEvent({
        type: 'thinking',
        text: `• Identified user intent: Search community directory for active skill swaps\n`,
      });
      await wait(140);

      sendEvent({
        type: 'thinking',
        text: `• Invoking tool: \`${toolIntent.toolName}\` (${JSON.stringify(toolIntent.args)})\n`,
      });
      await wait(120);

      sendEvent({
        type: 'tool_call',
        toolCall: {
          id: `tool_${Date.now()}`,
          name: toolIntent.toolName,
          arguments: toolIntent.args,
          status: 'calling' as const,
        },
      });

      await wait(260);
      const toolExec = executeLocalTool(toolIntent.toolName, toolIntent.args, availableSkills);

      sendEvent({ type: 'tool_result', toolCall: toolExec.toolCall });

      sendEvent({
        type: 'thinking',
        text: `• Tool result: ${toolExec.toolCall.resultSummary}\n• Synthesizing structured Markdown presentation...\n`,
      });
      await wait(150);

      sendEvent({ type: 'thinking_done', durationMs: Date.now() - startTime });
      await wait(100);

      const words = toolExec.markdownReply.split(' ');
      for (let i = 0; i < words.length; i++) {
        sendEvent({ type: 'content', text: (i === 0 ? '' : ' ') + words[i] });
        await wait(18);
      }

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

      res.end();
      return;
    }

    const thinkingSteps = [
      `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"`,
      `• Evaluating multi-turn context and community craft interests for ${currentUserName}.`,
      `• Formulating community-first peer exchange response with zero fees.`,
    ];

    for (const step of thinkingSteps) {
      sendEvent({ type: 'thinking', text: step + '\n' });
      await wait(160);
    }

    sendEvent({ type: 'thinking_done', durationMs: Date.now() - startTime });
    await wait(100);

    const reply =
      `Hello **${currentUserName}**! I'm your SwapCraft AI Concierge (**${persona.name}**).\n\n` +
      `I'm here to help you exchange knowledge without money. You can ask me to:\n` +
      `* **"Find active skills out there I can take part in"** to search our live artisan registry.\n` +
      `* **"Find a sourdough baking partner"** or **"Show React and TypeScript mentoring"**.\n` +
      `* Explore **Community Circles** or explain **Karma Credits**.`;

    for (const [i, word] of reply.split(' ').entries()) {
      sendEvent({ type: 'content', text: (i === 0 ? '' : ' ') + word });
      await wait(18);
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
}
