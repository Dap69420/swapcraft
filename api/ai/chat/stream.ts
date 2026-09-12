import {
  sanitizeModel,
  MODEL_PERSONAS,
  getBAIKey,
  executeLocalTool,
  detectToolIntent,
  buildSystemPrompt,
  historyToMessages,
  matchSkillsForQuery,
  streamBAIChat,
  callBAIChat,
  BAI_TOOLS,
} from '../../../_lib/swapAI';

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

  const streamTextPaced = async (text: string) => {
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      sendEvent({ type: 'content', text: (i === 0 ? '' : ' ') + words[i] });
      await wait(18);
    }
  };

  try {
    const {
      message,
      history = [],
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

      await streamTextPaced(toolExec.markdownReply);

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

    const baiKey = getBAIKey();
    if (baiKey) {
      try {
        const system = buildSystemPrompt(persona.name, persona.focus, currentUserName, availableSkills);
        const messages = [
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

        const streamed = await streamBAIChat(baiKey, {
          model: selectedModel,
          messages,
          tools: BAI_TOOLS,
          onDelta: (text) => sendEvent({ type: 'content', text }),
        });

        const completedToolCalls: any[] = [];
        let matchedSkillIds: string[] = [];
        let proposedSkill: any;
        let actions: any[] | undefined;

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
            if ((exec as any).actions) actions = (exec as any).actions;
            sendEvent({ type: 'tool_result', toolCall: exec.toolCall });
          }

          sendEvent({
            type: 'thinking',
            text: `• Synthesizing tool results into a final answer...\n`,
          });

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

          const followUp = await callBAIChat(baiKey, {
            model: selectedModel,
            messages: [...messages, ...toolMessages],
          });
          if (followUp.text) await streamTextPaced(followUp.text);
        }

        sendEvent({
          type: 'done',
          model: selectedModel,
          toolCalls: completedToolCalls,
          suggestedSkillIds:
            matchedSkillIds.length > 0 ? [...new Set(matchedSkillIds)] : matchSkillsForQuery(message, availableSkills),
          proposedSkill,
          actions: actions || [
            { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
            { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
            { label: '✨ Post Your Own Skill', type: 'open_modal', payload: 'post_skill' },
          ],
          durationMs: Date.now() - startTime,
        });
        res.end();
        return;
      } catch (baiErr: any) {
        console.warn('B.AI stream execution fallback:', baiErr?.message);
        sendEvent({
          type: 'thinking',
          text: `• B.AI unreachable, answering from the offline engine\n`,
        });
      }
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

    await streamTextPaced(reply);

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
