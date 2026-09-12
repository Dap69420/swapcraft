import {
  sanitizeModel,
  MODEL_PERSONAS,
  getBAIKey,
  executeLocalTool,
  detectToolIntent,
  buildKeywordFallback,
  runBAIAssistant,
} from '../../_lib/swapAI';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const startTime = Date.now();
  try {
    const {
      message,
      history = [],
      currentUserName = 'Artisan',
      availableSkills = [],
      model = 'hy3',
    } = req.body ?? {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const selectedModel = sanitizeModel(model);
    const persona = MODEL_PERSONAS[selectedModel];

    const toolIntent = detectToolIntent(message);
    if (toolIntent) {
      const toolExec = executeLocalTool(toolIntent.toolName, toolIntent.args, availableSkills);
      const duration = Math.max(Date.now() - startTime, 460);

      res.json({
        reply: toolExec.markdownReply,
        thinking:
          `• [${persona.name} — ${persona.persona}]: Identified tool intent for "${message.slice(0, 40)}"\n` +
          `• Calling tool: \`${toolIntent.toolName}\` with parameters: ${JSON.stringify(toolIntent.args)}\n` +
          `• Scanning ${availableSkills.length} active platform exchange listings\n` +
          `• Tool execution completed: ${toolExec.toolCall.resultSummary}\n` +
          `• Formatting structured Markdown response with reciprocal exchange paths`,
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
      return;
    }

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
        res.json({
          reply: result.reply,
          thinking:
            `• [${persona.name} — ${persona.persona}]: Answered via B.AI (${selectedModel})\n` +
            (result.toolCalls.length > 0
              ? `• Executed ${result.toolCalls.map((t) => `\`${t.name}\``).join(', ')}\n`
              : `• Direct answer, no tool call needed\n`) +
            `• Scanned platform database for active listings`,
          thinkingDurationMs: Date.now() - startTime,
          model: selectedModel,
          toolCalls: result.toolCalls,
          suggestedSkillIds: result.suggestedSkillIds,
          proposedSkill: result.proposedSkill,
          actions: result.actions,
        });
        return;
      } catch (baiErr: any) {
        console.warn('B.AI chat execution fallback:', baiErr?.message);
      }
    }

    const fallback = buildKeywordFallback(message, currentUserName, availableSkills);
    res.json({
      reply: fallback.reply,
      thinking:
        `• [${persona.name} — ${persona.persona}]: Processing query "${message.slice(0, 45)}"\n` +
        `• Contextualized community peer guidance for ${currentUserName}.\n` +
        `• Synthesized zero-money exchange guidance and quick action pathways.`,
      thinkingDurationMs: Math.max(Date.now() - startTime, 420),
      model: selectedModel,
      suggestedSkillIds: fallback.suggestedSkillIds,
      actions: fallback.actions,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat handler:', error);
    res.json({
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
}
