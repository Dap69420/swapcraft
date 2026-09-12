import { GoogleGenAI } from '@google/genai';
import {
  sanitizeModel,
  MODEL_PERSONAS,
  executeLocalTool,
  detectToolIntent,
  buildKeywordFallback,
  findActiveSkillsTool,
  getSkillDetailsTool,
  createSkillForUserTool,
  navigatePlatformTool,
} from '../../_lib/swapAI';

function getGemini(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const startTime = Date.now();
  try {
    const {
      message,
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

    const gemini = getGemini();
    if (gemini) {
      try {
        const chat = gemini.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction:
              `You are the SwapCraft AI Concierge (${persona.name}), an intelligent assistant specialized in ${persona.focus}.\n` +
              `SwapCraft is a zero-money, community-driven skill swap and knowledge exchange platform.\n` +
              `Identify purely as the SwapCraft AI Concierge (${persona.name}).\n` +
              `Current user: "${currentUserName}".\n` +
              `Use Markdown formatting with headings (###), bullet points, and bold text for recommendations.\n` +
              `Always prioritize using the find_active_skills tool whenever the user asks about available skills, learning opportunities, or taking part in crafts.\n` +
              `Use create_skill_for_user when the user wants to upload, create, or add a skill to their account.\n` +
              `Use navigate_platform to guide them to pages like /discover, /matchmaker, /community, /messages, /my-swaps, /credits, /profile.`,
            tools: [{ functionDeclarations: [findActiveSkillsTool, getSkillDetailsTool, createSkillForUserTool, navigatePlatformTool] }],
          },
        });

        const geminiRes = await chat.sendMessage({ message });
        const functionCalls = geminiRes.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          const toolExec = executeLocalTool(call.name, call.args, availableSkills);

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

          res.json({
            reply: turn2.text || toolExec.markdownReply,
            thinking:
              `• [${persona.name}]: Executed function \`${call.name}\`\n` +
              `• Scanned platform database for active listings\n` +
              `• Generated structured Markdown guidance`,
            thinkingDurationMs: Date.now() - startTime,
            model: selectedModel,
            toolCalls: [toolExec.toolCall],
            suggestedSkillIds: toolExec.matchedSkillIds,
            actions: [
              { label: '🔍 Browse All Skills', type: 'navigate', path: '/discover' },
              { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
            ],
          });
          return;
        }

        if (geminiRes.text) {
          res.json({
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
          return;
        }
      } catch (geminiErr: any) {
        console.warn('Gemini chat execution fallback:', geminiErr?.message);
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
