import {
  SkillListing,
  SkillCategory,
  AIMessage,
  AISuggestionAction,
  UserProfile,
  BAIModelId,
  BAIModelInfo,
  AIToolCall,
} from '../types';

export interface AIChatResponse {
  reply: string;
  thinking?: string;
  thinkingDurationMs?: number;
  model: BAIModelId;
  toolCalls?: AIToolCall[];
  suggestedSkillIds: string[];
  actions: AISuggestionAction[];
  proposedSkill?: Partial<SkillListing>;
}

export const BAI_MODELS: BAIModelInfo[] = [
  {
    id: 'hy3',
    name: 'Penguin',
    engineName: 'Penguin',
    codename: 'Aurora Penguin',
    persona: 'Community Mentor',
    tag: 'Conversational',
    iconName: 'Sparkles',
    description: 'Warm conversational dialogue, peer etiquette, and empathetic craft guidance.',
    supportsThinking: true,
    statusBadge: {
      type: 'recommended',
      label: 'Recommended',
    },
  },
  {
    id: 'mimo-v2.5',
    name: 'Cyber Rabbit',
    engineName: 'Cyber Rabbit',
    codename: 'Matrix Bunny',
    persona: 'Creative Artisan',
    tag: 'Crafts & Culinary',
    iconName: 'Palette',
    description: 'Specialized in culinary arts, pottery, woodworking, music, and tactile workshops.',
    supportsThinking: true,
    statusBadge: {
      type: 'creative',
      label: 'Creative',
    },
  },
  {
    id: 'glm-5.3-flash',
    name: 'Sage Owl',
    engineName: 'Sage Owl',
    codename: 'Wisdom Owl',
    persona: 'Agentic Navigator',
    tag: 'Fast Agentic',
    iconName: 'Zap',
    description: 'Swift goal resolution, instant shortcut dispatch, and active platform orchestration.',
    supportsThinking: true,
    statusBadge: {
      type: 'heavy_usage',
      label: 'Heavy Usage',
    },
  },
  {
    id: 'qwen3.8-flash',
    name: 'Cloud Falcon',
    engineName: 'Cloud Falcon',
    codename: 'Nimbus Falcon',
    persona: 'High-Speed Matcher',
    tag: 'Lightning Indexer',
    iconName: 'Compass',
    description: 'High-velocity token processing, dense skill indexing, and rapid query matching.',
    supportsThinking: true,
    statusBadge: {
      type: 'heavy_usage',
      label: 'Heavy Usage',
    },
  },
];

export const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'ai-msg-1',
    sender: 'assistant',
    model: 'hy3',
    text: "Hello! I'm your SwapCraft AI Concierge ✨ I can help you discover exciting skill swaps, find reciprocal learning partners, navigate the app, or explain zero-fee Karma banking. You can switch between Penguin, Cyber Rabbit, Sage Owl, and Cloud Falcon anytime above!",
    thinking: '• Initialized SwapCraft Concierge reasoning engine (Penguin).\n• Calibrated reciprocity matching algorithm across active listings.\n• Ready for multi-turn conversational exchange.',
    thinkingDurationMs: 420,
    timestamp: 'Just now',
    suggestedSkillIds: [],
    actions: [
      { label: '🍳 Explore Culinary Swaps', type: 'filter', payload: { category: 'Culinary Arts' } },
      { label: '💻 Browse Tech & Code', type: 'filter', payload: { category: 'Technology' } },
      { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
      { label: '✨ Post My Skill Offer', type: 'open_modal', payload: 'post_skill' },
    ],
  },
];

export interface StreamEvent {
  type: 'thinking' | 'thinking_done' | 'tool_call' | 'tool_result' | 'content' | 'done' | 'error';
  text?: string;
  durationMs?: number;
  model?: BAIModelId;
  toolCall?: AIToolCall;
  toolCalls?: AIToolCall[];
  suggestedSkillIds?: string[];
  actions?: AISuggestionAction[];
  proposedSkill?: Partial<SkillListing>;
  error?: string;
}

export async function streamAIChatMessage(
  userQuery: string,
  history: AIMessage[],
  currentUser: UserProfile,
  listings: SkillListing[],
  model: BAIModelId = 'hy3',
  onEvent: (event: StreamEvent) => void
): Promise<void> {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userQuery,
        model,
        history: history.map((m) => ({ sender: m.sender, text: m.text })),
        currentUserName: currentUser.name,
        availableSkills: listings.map((l) => ({
          id: l.id,
          title: l.title,
          category: l.category,
          user: { name: l.user.name },
          offerSkill: l.offerSkill,
          wantSkill: l.wantSkill,
          format: l.format,
          level: l.level,
        })),
      }),
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const dataStr = trimmed.replace(/^data:\s*/, '');
          try {
            const parsed = JSON.parse(dataStr) as StreamEvent;
            onEvent(parsed);
          } catch {
            // Ignore malformed event
          }
        }
      }
      return;
    }
  } catch (err) {
    console.warn('Backend streaming unreachable, executing client-side progressive stream:', err);
  }

  // Client-side resilient fallback stream with live progressive reveal and tools
  const fallback = generateClientFallbackResponse(userQuery, listings, model, startTime);
  const thinkingLines = (fallback.thinking || '').split('\n').filter(Boolean);

  for (const line of thinkingLines) {
    onEvent({ type: 'thinking', text: line + '\n' });
    await new Promise((r) => setTimeout(r, 160));
  }

  // If fallback has tool calls, emit them progressively
  if (fallback.toolCalls && fallback.toolCalls.length > 0) {
    for (const tc of fallback.toolCalls) {
      onEvent({
        type: 'tool_call',
        toolCall: { ...tc, status: 'calling' },
      });
      await new Promise((r) => setTimeout(r, 260));
      onEvent({
        type: 'tool_result',
        toolCall: tc,
      });
      await new Promise((r) => setTimeout(r, 120));
    }
  }

  onEvent({ type: 'thinking_done', durationMs: Date.now() - startTime });
  await new Promise((r) => setTimeout(r, 100));

  const words = fallback.reply.split(' ');
  for (let i = 0; i < words.length; i++) {
    const chunk = (i === 0 ? '' : ' ') + words[i];
    onEvent({ type: 'content', text: chunk });
    await new Promise((r) => setTimeout(r, 18));
  }

  onEvent({
    type: 'done',
    model,
    toolCalls: fallback.toolCalls,
    suggestedSkillIds: fallback.suggestedSkillIds,
    actions: fallback.actions,
    proposedSkill: fallback.proposedSkill,
    durationMs: Date.now() - startTime,
  });
}

export async function sendAIChatMessage(
  userQuery: string,
  history: AIMessage[],
  currentUser: UserProfile,
  listings: SkillListing[],
  model: BAIModelId = 'hy3'
): Promise<AIChatResponse> {
  const startTime = Date.now();
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userQuery,
        model,
        history: history.map((m) => ({ sender: m.sender, text: m.text })),
        currentUserName: currentUser.name,
        availableSkills: listings.map((l) => ({
          id: l.id,
          title: l.title,
          category: l.category,
          user: { name: l.user.name },
          offerSkill: l.offerSkill,
          wantSkill: l.wantSkill,
          format: l.format,
          level: l.level,
        })),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          reply: data.reply,
          thinking: data.thinking || '',
          thinkingDurationMs: data.thinkingDurationMs || Date.now() - startTime,
          model: (data.model as BAIModelId) || model,
          toolCalls: Array.isArray(data.toolCalls) ? data.toolCalls : undefined,
          suggestedSkillIds: Array.isArray(data.suggestedSkillIds) ? data.suggestedSkillIds : [],
          actions: Array.isArray(data.actions) ? data.actions : [],
          proposedSkill: data.proposedSkill,
        };
      }
    }
  } catch (err) {
    console.warn('Backend assistant unreachable, using smart client-side assistant logic', err);
  }

  // Resilient fallback logic with semantic matching & realistic model thinking traces
  return generateClientFallbackResponse(userQuery, listings, model, startTime);
}

function generateClientFallbackResponse(
  query: string,
  listings: SkillListing[],
  model: BAIModelId,
  startTime: number
): AIChatResponse {
  const q = query.toLowerCase().trim();

  // Model-specific thinking process traces with cool persona identities
  const modelInfo = BAI_MODELS.find((m) => m.id === model) || BAI_MODELS[0];
  let thinkingSteps: string[] = [];
  if (model === 'hy3') {
    thinkingSteps = [
      `• [${modelInfo.name} — ${modelInfo.persona}]: Processing query "${query.slice(0, 45)}"`,
      `• Parsing multi-turn context and community craft interests.`,
      `• Scanning active workshop circles, local meetups, and artisan listings.`,
      `• Formulating community-first exchange recommendations with zero fees.`,
    ];
  } else if (model === 'mimo-v2.5') {
    thinkingSteps = [
      `• [${modelInfo.name} — ${modelInfo.persona}]: Deconstructing craft topics and skill format requirements.`,
      `• Evaluating visual & tactile crafts against culinary, tech, and artistic categories.`,
      `• Formulating tailored next steps for reciprocal exchange.`,
    ];
  } else if (model === 'glm-5.3-flash') {
    thinkingSteps = [
      `• [${modelInfo.name} — ${modelInfo.persona}]: Parsing user goal and resolving active platform action routes.`,
      `• Matching intent against available skill listings and filter categories.`,
      `• Generating verified action payload with navigation paths.`,
    ];
  } else {
    // qwen3.8-flash
    thinkingSteps = [
      `• [${modelInfo.name} — ${modelInfo.persona}]: Evaluating query semantics at high throughput.`,
      `• Filtering listings for highest similarity and reciprocal match scores.`,
      `• Compiling final output with structured recommendation actions.`,
    ];
  }

  // 0. Tool intent detection: create skill for user
  const isCreateSkill =
    q.includes('create skill') ||
    q.includes('create a skill') ||
    q.includes('upload a skill') ||
    q.includes('upload skill') ||
    q.includes('make a skill') ||
    q.includes('add a skill') ||
    q.includes('post a skill') ||
    q.includes('create for my account') ||
    q.includes('list a skill') ||
    (q.includes('teach') && (q.includes('can you') || q.includes('create') || q.includes('help me') || q.includes('want to teach')));

  if (isCreateSkill) {
    let title = 'Hands-on Skill Exchange Session';
    let category: SkillCategory = 'Technology';
    let emoji = '⚡';
    let offerSkill = 'Practical Knowledge Sharing';

    if (q.includes('sourdough') || q.includes('bread') || q.includes('baking') || q.includes('cook') || q.includes('chef') || q.includes('culinary')) {
      title = 'Artisan Sourdough Baking & Fermentation';
      category = 'Culinary Arts';
      emoji = '🍞';
      offerSkill = 'Sourdough Starter Culture, Scoring & Crust Optimization';
    } else if (q.includes('pottery') || q.includes('ceramic') || q.includes('clay') || q.includes('wood') || q.includes('craft')) {
      title = 'Ceramic Wheel Throwing & Handbuilding';
      category = 'Crafts & DIY';
      emoji = '🏺';
      offerSkill = 'Centering Clay, Wall Pulling & Glazing Basics';
    } else if (q.includes('react') || q.includes('typescript') || q.includes('code') || q.includes('javascript') || q.includes('web') || q.includes('python')) {
      title = 'Full-Stack React & TypeScript Architecture';
      category = 'Technology';
      emoji = '💻';
      offerSkill = 'Modern React State Management, Hooks & Clean Architecture';
    } else if (q.includes('guitar') || q.includes('piano') || q.includes('music') || q.includes('audio') || q.includes('singing')) {
      title = 'Fingerstyle Acoustic Guitar & Harmonic Theory';
      category = 'Music & Audio';
      emoji = '🎸';
      offerSkill = 'Fingerpicking Patterns, Open Tunings & Ear Training';
    } else if (q.includes('japanese') || q.includes('spanish') || q.includes('french') || q.includes('language') || q.includes('german')) {
      title = 'Conversational Japanese & Natural Pronunciation';
      category = 'Languages';
      emoji = '🗣️';
      offerSkill = 'Natural Everyday Dialogue, Slang & Kanji Mnemonics';
    } else if (q.includes('photo') || q.includes('camera') || q.includes('lightroom') || q.includes('film')) {
      title = 'Manual 35mm Film Photography & Composition';
      category = 'Visual Arts';
      emoji = '📷';
      offerSkill = 'Exposure Triangle, Film Stocks & Natural Lighting';
    } else if (q.includes('yoga') || q.includes('meditation') || q.includes('breath') || q.includes('fitness')) {
      title = 'Mindful Breathwork & Vinyasa Flow';
      category = 'Wellness & Fitness';
      emoji = '🧘';
      offerSkill = 'Pranayama Breathing, Mobility Alignments & Mindful Focus';
    } else if (q.includes('write') || q.includes('novel') || q.includes('copy') || q.includes('business')) {
      title = 'Creative Nonfiction & Longform Storytelling';
      category = 'Business & Writing';
      emoji = '✍️';
      offerSkill = 'Narrative Arc, Sensory Imagery & Pitch Decks';
    }

    const proposedSkill: Partial<SkillListing> = {
      id: `skill-draft-${Date.now()}`,
      title,
      category,
      emoji,
      accentBg: '#EAE0D5',
      offerSkill,
      offerDescription: `Interactive 1-on-1 practical session focused on mastering ${offerSkill}. Tailored to your pace with hands-on practice.`,
      offerTopics: [
        `${offerSkill} Core Fundamentals`,
        'Hands-on Practical Techniques & Workflows',
        'Troubleshooting, Tooling & Real-World Q&A',
      ],
      wantSkill: 'Any creative craft or 1 Karma Credit',
      wantDescription: 'Curious to learn from any passionate maker or exchange for Karma credits.',
      wantCategory: 'All',
      level: 'Beginner Friendly',
      format: q.includes('in person') ? 'In-Person' : 'Online',
      sessionDuration: '60 mins',
      availability: 'Flexible (Weekdays or Weekends)',
      createdAt: 'Just now',
    };

    thinkingSteps.push(
      `• Detected skill creation intent for: "${title}".`,
      `• Auto-drafted complete listing schema (Category: ${category}, Format: ${proposedSkill.format}).`,
      `• Attached 1-click publishing action for user account.`
    );

    const reply = `### 🛠️ Skill Draft Created For Your Account

I've crafted a complete skill listing ready for your account:

* **Title:** ${emoji} **${title}**
* **Category:** \`${category}\` • **Format:** *${proposedSkill.format}* • **Level:** *Beginner Friendly*
* **Session Length:** *60 mins*
* **What You Teach:** ${proposedSkill.offerDescription}
* **Syllabus Topics:**
  * 🔹 *${proposedSkill.offerTopics?.[0]}*
  * 🔹 *${proposedSkill.offerTopics?.[1]}*
  * 🔹 *${proposedSkill.offerTopics?.[2]}*
* **What You Seek:** ${proposedSkill.wantSkill}

Click **"Approve & Publish to Profile"** below to make it live immediately on SwapCraft!`;

    const toolCall: AIToolCall = {
      id: `tool_client_${Date.now()}`,
      name: 'create_skill_for_user',
      arguments: { title, category, offerSkill },
      status: 'completed',
      resultSummary: `Drafted skill listing "${title}"`,
      data: proposedSkill,
    };

    return {
      reply,
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 500),
      model,
      toolCalls: [toolCall],
      suggestedSkillIds: [],
      proposedSkill,
      actions: [
        { label: '🚀 Approve & Publish to Profile', type: 'create_skill', payload: proposedSkill },
        { label: '✏️ Customize in Post Modal', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  // 1. Tool intent detection: find active skills
  const isFindingSkills =
    q.includes('active skill') ||
    q.includes('take part') ||
    q.includes('find skill') ||
    q.includes('find some skill') ||
    q.includes('skills for me') ||
    q.includes('skills out there') ||
    q.includes('search skill') ||
    q.includes('look for skill') ||
    q.includes('available skill') ||
    q.includes('what skills') ||
    q.includes('learn sourdough') ||
    q.includes('learn react') ||
    q.includes('learn pottery') ||
    q.includes('learn guitar') ||
    q.includes('learn japanese') ||
    q.includes('learn cooking');

  if (isFindingSkills) {
    let category: string | undefined;
    if (q.includes('cook') || q.includes('baking') || q.includes('sourdough')) category = 'Culinary Arts';
    else if (q.includes('react') || q.includes('code') || q.includes('tech') || q.includes('typescript')) category = 'Technology';
    else if (q.includes('pottery') || q.includes('craft') || q.includes('wood')) category = 'Crafts & DIY';
    else if (q.includes('language') || q.includes('japanese') || q.includes('spanish')) category = 'Languages';
    else if (q.includes('music') || q.includes('guitar')) category = 'Music & Audio';
    else if (q.includes('photo') || q.includes('visual')) category = 'Visual Arts';
    else if (q.includes('wellness') || q.includes('yoga')) category = 'Wellness & Fitness';
    else if (q.includes('business') || q.includes('write')) category = 'Business & Writing';

    let filtered = listings;
    if (category) {
      filtered = listings.filter((l) => l.category === category);
    }
    if (filtered.length === 0) filtered = listings;

    const matchedIds = filtered.slice(0, 3).map((l) => l.id);
    const toolCall: AIToolCall = {
      id: `tool_client_${Date.now()}`,
      name: 'find_active_skills',
      arguments: {
        query,
        category,
        format: q.includes('online') ? 'Online' : q.includes('in-person') ? 'In-Person' : undefined,
      },
      status: 'completed',
      resultSummary: `Found ${filtered.length} active craft listings available for swap.`,
      data: filtered.slice(0, 5).map((l) => ({
        id: l.id,
        title: l.title,
        category: l.category,
        format: l.format,
        level: l.level,
        mentor: l.user.name,
        offering: l.offerSkill,
        seeking: l.wantSkill,
      })),
    };

    const skillListMarkdown = filtered
      .slice(0, 3)
      .map(
        (s) =>
          `* **${s.title}** (${s.category} • *${s.format}*)\n  * Mentor: **${s.user.name}**\n  * Offering: *${s.offerSkill}* ⇄ Wants: *${s.wantSkill}*`
      )
      .join('\n\n');

    thinkingSteps.push(
      `• Detected tool trigger: \`find_active_skills\` for query "${query.slice(0, 35)}".`,
      `• Executed tool against community registry: Filtered ${filtered.length} active swaps.`,
      `• Formatted structured Markdown response with reciprocal barter recommendations.`
    );

    const reply = `### Active Skills You Can Take Part In

I executed the **\`find_active_skills\`** tool across our live craft directory and found **${filtered.length} active listings** ready for peer exchange:

${skillListMarkdown}

---
* **Zero Currency:** All swaps are based on reciprocal trades or **Karma Credits** (1 hr taught = 1 credit).
* **Next Step:** Click any listing card below to propose an exchange or message the artisan directly!`;

    return {
      reply,
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 600),
      model,
      toolCalls: [toolCall],
      suggestedSkillIds: matchedIds,
      actions: [
        { label: '🔍 Browse All in Discover', type: 'navigate', path: '/discover' },
        { label: '🎯 Run Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
        { label: '✨ Offer Your Skill', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  // Navigation requests
  if (q.includes('match') || q.includes('compatibility') || q.includes('partner')) {
    thinkingSteps.push('• User query mapped to Matchmaker tool with dual-sided compatibility.');
    return {
      reply:
        'The Smart Matchmaker analyzes what skills you offer against what other crafters want to learn, calculating mutual compatibility percentages in real time!',
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 580),
      model,
      suggestedSkillIds: listings.slice(0, 2).map((l) => l.id),
      actions: [
        { label: '🎯 Open Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
        { label: '🔍 Browse All Listings', type: 'navigate', path: '/discover' },
      ],
    };
  }

  if (q.includes('circle') || q.includes('group') || q.includes('workshop') || q.includes('event')) {
    thinkingSteps.push('• Community Circles workshop query classified.');
    return {
      reply:
        'Community Circles are collaborative group sessions—like weekend sourdough baking or live React code reviews—where peers swap skills together.',
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 620),
      model,
      suggestedSkillIds: ['skill-1', 'skill-5'],
      actions: [
        { label: '👥 View Community Circles', type: 'navigate', path: '/circles' },
        { label: '✨ Host a New Circle', type: 'navigate', path: '/circles' },
      ],
    };
  }

  if (q.includes('credit') || q.includes('karma') || q.includes('coin') || q.includes('free') || q.includes('money')) {
    thinkingSteps.push('• Karma credit reciprocity ledger logic resolved (1 hr taught = 1 Karma).');
    return {
      reply:
        'SwapCraft is 100% money-free! Every hour you spend teaching someone earns you 1 Karma Credit, which you can spend learning any craft from anyone in the community.',
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 490),
      model,
      suggestedSkillIds: [],
      actions: [
        { label: '🪙 View Karma Economics', type: 'navigate', path: '/credits' },
        { label: '✨ Post a Skill to Earn Karma', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  if (q.includes('post') || q.includes('offer') || q.includes('create') || q.includes('share')) {
    thinkingSteps.push('• Post Skill listing workflow action dispatched.');
    return {
      reply:
        'Ready to teach something you love? Publishing a skill listing takes under 60 seconds and instantly lists your craft in the community directory.',
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 450),
      model,
      suggestedSkillIds: [],
      actions: [
        { label: '✨ Open Post Skill Modal', type: 'open_modal', payload: 'post_skill' },
        { label: '👤 View My Profile', type: 'navigate', path: '/profile' },
      ],
    };
  }

  if (q.includes('my swap') || q.includes('proposal') || q.includes('trade') || q.includes('schedule')) {
    thinkingSteps.push('• Proposal dashboard & video schedule management located.');
    return {
      reply:
        'You can manage all incoming proposals, pending requests, active scheduled sessions, and exchange history in the My Swaps dashboard.',
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 520),
      model,
      suggestedSkillIds: [],
      actions: [
        { label: '🔄 Open My Swaps', type: 'navigate', path: '/swaps' },
        { label: '💬 Check Messages & Video Calls', type: 'navigate', path: '/messages' },
      ],
    };
  }

  // Category & Skill specific searches
  const matched = listings.filter((l) => {
    const text = `${l.title} ${l.category} ${l.offerSkill} ${l.wantSkill} ${l.offerTopics.join(' ')}`.toLowerCase();
    const words = q.split(/\s+/);
    return words.some((w) => w.length > 2 && text.includes(w));
  });

  if (matched.length > 0) {
    const topMatches = matched.slice(0, 3);
    const primaryCat = topMatches[0].category;
    thinkingSteps.push(`• Filtered listings: Found ${matched.length} semantic matches under "${primaryCat}".`);

    return {
      reply: `I found ${matched.length} great skill listing${matched.length > 1 ? 's' : ''} related to "${query}"! You can click on any card below to view their proposal or message the instructor directly.`,
      thinking: thinkingSteps.join('\n'),
      thinkingDurationMs: Math.max(Date.now() - startTime, 650),
      model,
      suggestedSkillIds: topMatches.map((m) => m.id),
      actions: [
        { label: `🔍 Filter by ${primaryCat}`, type: 'filter', payload: { category: primaryCat } },
        { label: '🎯 Match with this topic', type: 'navigate', path: '/matchmaker' },
      ],
    };
  }

  // Default helpful response
  thinkingSteps.push('• Default concierge prompt synthesized with multi-model capability highlights.');
  return {
    reply:
      `I'm here to guide you across SwapCraft using ${modelInfo.name}! You can ask me to find skills (e.g., 'cooking', 'React coding', 'Spanish', 'pottery'), help you post an offer, navigate to group circles, or explain Karma credits.`,
    thinking: thinkingSteps.join('\n'),
    thinkingDurationMs: Math.max(Date.now() - startTime, 510),
    model,
    suggestedSkillIds: listings.slice(0, 2).map((l) => l.id),
    actions: [
      { label: '🔍 Explore All Crafts', type: 'navigate', path: '/discover' },
      { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
      { label: '✨ Post a Skill Offer', type: 'open_modal', payload: 'post_skill' },
    ],
  };
}
