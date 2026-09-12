import { FunctionDeclaration, Type } from '@google/genai';

export interface PlatformSkill {
  id: string;
  title: string;
  category: string;
  offerSkill: string;
  wantSkill: string;
  offerDescription?: string;
  offerTopics?: string[];
  format: string;
  level: string;
  sessionDuration?: string;
  user?: { name?: string; rating?: number };
}

export interface ToolCallRecord {
  id: string;
  name: string;
  arguments: Record<string, any>;
  status: 'calling' | 'completed';
  resultSummary: string;
  data: any;
}

export interface ToolExecResult {
  toolCall: ToolCallRecord;
  matchedSkillIds: string[];
  markdownReply: string;
  proposedSkill?: any;
  actions?: any[];
}

export const SUPPORTED_MODELS = ['hy3', 'mimo-v2.5', 'glm-5.3-flash', 'qwen3.8-flash'] as const;

export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

export function sanitizeModel(modelName?: string): SupportedModel {
  if (modelName && (SUPPORTED_MODELS as readonly string[]).includes(modelName)) {
    return modelName as SupportedModel;
  }
  return 'hy3';
}

export const MODEL_PERSONAS: Record<SupportedModel, { name: string; persona: string; focus: string }> = {
  hy3: {
    name: 'Penguin',
    persona: 'Community Mentor',
    focus: 'empathetic artisan dialogue, warm etiquette, and circle matching',
  },
  'mimo-v2.5': {
    name: 'Cyber Rabbit',
    persona: 'Creative Artisan',
    focus: 'multimodal intuition for culinary, visual, and tactile crafts',
  },
  'glm-5.3-flash': {
    name: 'Sage Owl',
    persona: 'Agentic Navigator',
    focus: 'swift goal resolution and immediate platform action dispatch',
  },
  'qwen3.8-flash': {
    name: 'Cloud Falcon',
    persona: 'High-Speed Matcher',
    focus: 'high-velocity token indexing and lightning skill search',
  },
};

export const findActiveSkillsTool: FunctionDeclaration = {
  name: 'find_active_skills',
  description:
    'Search and find active skill listings on SwapCraft that the user can take part in, learn, or swap with. Filters by query, category, format (Online/In-Person/Hybrid), and experience level.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'Keywords to search across skills (e.g. "cooking", "sourdough", "react", "pottery", "japanese", "guitar")',
      },
      category: {
        type: Type.STRING,
        description:
          'Optional category filter: Technology, Culinary Arts, Visual Arts, Languages, Wellness & Fitness, Music & Audio, Crafts & DIY, Business & Writing',
      },
      format: {
        type: Type.STRING,
        description: 'Optional format filter: In-Person, Online, Hybrid, Flexible',
      },
      level: {
        type: Type.STRING,
        description: 'Optional experience level filter: All Levels, Beginner, Intermediate, Advanced',
      },
    },
  },
};

export const getSkillDetailsTool: FunctionDeclaration = {
  name: 'get_skill_details',
  description: 'Retrieve full details, syllabus, and artisan profile for a specific skill listing ID.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      skillId: {
        type: Type.STRING,
        description: 'The unique skill ID (e.g. "skill-1")',
      },
    },
    required: ['skillId'],
  },
};

export const createSkillForUserTool: FunctionDeclaration = {
  name: 'create_skill_for_user',
  description: 'Draft and create a complete skill listing for the user account so they can publish it with one click.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: 'Clear title of the skill (e.g. "Hands-on Sourdough Bread Baking")' },
      category: {
        type: Type.STRING,
        description:
          'Category: Technology, Culinary Arts, Visual Arts, Languages, Wellness & Fitness, Music & Audio, Crafts & DIY, Business & Writing',
      },
      offerSkill: { type: Type.STRING, description: 'Specific craft or skill offered' },
      offerDescription: { type: Type.STRING, description: 'Detailed description of what the user will teach' },
      wantSkill: { type: Type.STRING, description: 'What skill the user wants in return' },
      level: { type: Type.STRING, description: 'Beginner Friendly, Intermediate, or Advanced' },
      format: { type: Type.STRING, description: 'Online, In-Person, or Hybrid' },
      sessionDuration: { type: Type.STRING, description: 'e.g. "45 mins", "60 mins", "90 mins"' },
      emoji: { type: Type.STRING, description: 'A single relevant emoji for the skill' },
    },
    required: ['title', 'category', 'offerSkill', 'offerDescription', 'wantSkill'],
  },
};

export const navigatePlatformTool: FunctionDeclaration = {
  name: 'navigate_platform',
  description:
    'Help the user navigate to specific sections of SwapCraft (discover, matchmaker, circles, messages, swaps, credits, profile).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      destination: {
        type: Type.STRING,
        description: 'Destination route: /discover, /matchmaker, /community, /messages, /my-swaps, /credits, /profile',
      },
      reason: { type: Type.STRING, description: 'Explanation of why this page helps the user' },
    },
    required: ['destination'],
  },
};

export function executeLocalTool(toolName: string, args: any, availableSkills: PlatformSkill[]): ToolExecResult {
  const toolId = `tool_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (toolName === 'find_active_skills') {
    const rawQuery = (args?.query || '').toLowerCase().trim();
    const category = args?.category;
    const format = args?.format;
    const level = args?.level;

    let matches = availableSkills.filter((s) => {
      if (category && category !== 'All' && s.category?.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (format && format !== 'All' && s.format?.toLowerCase() !== format.toLowerCase()) {
        return false;
      }
      if (level && level !== 'All Levels' && s.level?.toLowerCase() !== level.toLowerCase()) {
        return false;
      }

      const isGeneric =
        !rawQuery ||
        rawQuery.includes('active skill') ||
        rawQuery.includes('take part') ||
        rawQuery.includes('out there') ||
        rawQuery.includes('skills for me');

      if (!isGeneric) {
        const text =
          `${s.title} ${s.category} ${s.offerSkill} ${s.wantSkill} ${s.offerDescription || ''} ${(s.offerTopics || []).join(' ')}`.toLowerCase();
        const words = rawQuery
          .split(/\s+/)
          .filter((w: string) => w.length > 2 && !['and', 'the', 'for', 'can', 'some', 'out'].includes(w));
        if (words.length > 0) {
          return words.some((w: string) => text.includes(w));
        }
      }
      return true;
    });

    if (matches.length === 0) {
      matches = availableSkills.slice(0, 4);
    }

    const topSkills = matches.slice(0, 4);
    const matchedSkillIds = topSkills.map((s) => s.id);
    const summary = `Found ${matches.length} active skill${matches.length === 1 ? '' : 's'} available to take part in right now.`;

    const skillListItems = topSkills
      .map((s) => {
        const teacher = s.user?.name || 'Artisan Mentor';
        const rating = s.user?.rating ? `★ ${s.user.rating}` : '';
        const levelBadge = s.level || 'All Levels';
        const formatBadge = s.format || 'Flexible';
        const duration = s.sessionDuration || '60 min';

        return `* **${s.title}** with **${teacher}** ${rating ? `(${rating})` : ''}
  * \`${s.category}\` • *${formatBadge}* • *${levelBadge}* • *${duration}*
  * **Teaches:** ${s.offerDescription || s.offerSkill}
  * **Seeks in Exchange:** ${s.wantSkill}`;
      })
      .join('\n\n');

    const markdownReply = `### Active Skills You Can Take Part In

I searched the SwapCraft directory and found **${matches.length} active, community-verified skill exchanges** open for participation:

${skillListItems}

> 💡 **Exchange Note:** SwapCraft is **100% money-free**. If you don't offer the exact skill the mentor is looking for, you can exchange **1 Karma Credit** earned by teaching or sharing your own knowledge!

Click on any listing card below to inspect the full syllabus, verify availability, or propose a swap!`;

    return {
      toolCall: {
        id: toolId,
        name: 'find_active_skills',
        arguments: args || {},
        status: 'completed',
        resultSummary: summary,
        data: topSkills.map((s) => ({
          id: s.id,
          title: s.title,
          category: s.category,
          instructor: s.user?.name,
          teaches: s.offerSkill,
          wants: s.wantSkill,
          format: s.format,
          level: s.level,
        })),
      },
      matchedSkillIds,
      markdownReply,
    };
  }

  if (toolName === 'create_skill_for_user') {
    const title = args?.title || 'Creative Craft & Knowledge Exchange';
    const category = args?.category || 'Technology';
    const offerSkill = args?.offerSkill || title;
    const offerDescription =
      args?.offerDescription ||
      `Interactive 1-on-1 practical session focused on mastering ${offerSkill}. Tailored to your pace with hands-on practice.`;
    const wantSkill = args?.wantSkill || 'Any creative craft or 1 Karma Credit';
    const level = args?.level || 'Beginner Friendly';
    const format = args?.format || 'Online';
    const sessionDuration = args?.sessionDuration || '60 mins';
    const emoji = args?.emoji || '✨';

    const proposedSkill = {
      id: `skill-draft-${Date.now()}`,
      title,
      category,
      emoji,
      accentBg: '#EAE0D5',
      offerSkill,
      offerDescription,
      offerTopics: [
        `${offerSkill} Core Fundamentals`,
        'Hands-on Practical Techniques & Workflows',
        'Troubleshooting, Tooling & Real-World Q&A',
      ],
      wantSkill,
      wantDescription: 'Excited to trade skills with curious artisans and learners, or exchange for 1 Karma Credit.',
      wantCategory: 'All',
      level,
      format,
      sessionDuration,
      availability: 'Flexible (Weekdays or Weekends)',
      createdAt: 'Just now',
    };

    const summary = `Generated skill draft: "${title}" in ${category} (${format})`;

    const markdownReply = `### 🛠️ Skill Draft Created For Your Account

I've crafted a complete skill listing ready for your account:

* **Title:** ${emoji} **${title}**
* **Category:** \`${category}\` • **Format:** *${format}* • **Level:** *${level}*
* **Session Length:** *${sessionDuration}*
* **What You Teach:** ${offerDescription}
* **Syllabus Topics:**
  * 🔹 *${proposedSkill.offerTopics[0]}*
  * 🔹 *${proposedSkill.offerTopics[1]}*
  * 🔹 *${proposedSkill.offerTopics[2]}*
* **What You Seek:** ${wantSkill}

Click **"Approve & Publish to Profile"** below to make it live instantly, or click customize to adjust details.`;

    return {
      toolCall: {
        id: toolId,
        name: 'create_skill_for_user',
        arguments: args || {},
        status: 'completed',
        resultSummary: summary,
        data: proposedSkill,
      },
      matchedSkillIds: [],
      markdownReply,
      proposedSkill,
      actions: [
        { label: '🚀 Approve & Publish to Profile', type: 'create_skill', payload: proposedSkill },
        { label: '✏️ Customize in Post Modal', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  if (toolName === 'navigate_platform') {
    const dest = args?.destination || '/discover';
    const routesMap: Record<string, string> = {
      '/discover': 'Discover Skills Directory',
      '/matchmaker': 'AI Matchmaker & Complementary Swaps',
      '/community': 'Community Circles & Workshops',
      '/messages': 'Direct Message Inbox',
      '/my-swaps': 'My Swaps & Active Proposals',
      '/credits': 'Karma Economics Ledger',
      '/profile': 'My Profile & My Skills',
    };
    const title = routesMap[dest] || 'Platform View';
    const summary = `Navigated to ${title}`;

    const markdownReply = `### 🧭 ${title}

${args?.reason || `I've prepared the direct link to **${title}**.`}

Click below to navigate directly there!`;

    return {
      toolCall: {
        id: toolId,
        name: 'navigate_platform',
        arguments: args || {},
        status: 'completed',
        resultSummary: summary,
        data: { destination: dest, title },
      },
      matchedSkillIds: [],
      markdownReply,
      actions: [
        { label: `Go to ${title}`, type: 'navigate', path: dest },
        { label: '✨ Create Skill for My Account', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  const skill = availableSkills[0];
  return {
    toolCall: {
      id: toolId,
      name: toolName,
      arguments: args || {},
      status: 'completed',
      resultSummary: `Executed ${toolName}`,
      data: { status: 'success' },
    },
    matchedSkillIds: skill ? [skill.id] : [],
    markdownReply: `Executed tool **\`${toolName}\`** successfully.`,
  };
}

export function detectToolIntent(query: string): { toolName: string; args: any } | null {
  const q = query.toLowerCase().trim();

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
    let category = 'Technology';
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

    return {
      toolName: 'create_skill_for_user',
      args: {
        title,
        category,
        offerSkill,
        offerDescription: `Interactive 1-on-1 practical session focused on mastering ${offerSkill}. Tailored to your pace with hands-on exercises and live review.`,
        wantSkill: 'Any creative craft, language practice, or 1 Karma Credit',
        level: 'Beginner Friendly',
        format: q.includes('in person') ? 'In-Person' : 'Online',
        sessionDuration: '60 mins',
        emoji,
      },
    };
  }

  if (
    q.includes('take me to') ||
    q.includes('navigate to') ||
    q.includes('go to') ||
    q.includes('open my messages') ||
    q.includes('open inbox') ||
    q.includes('open matchmaker') ||
    q.includes('open circles') ||
    q.includes('open community') ||
    q.includes('open credits') ||
    q.includes('open profile')
  ) {
    let dest = '/discover';
    let reason = 'Direct platform navigation shortcut.';
    if (q.includes('message') || q.includes('inbox') || q.includes('chat')) {
      dest = '/messages';
      reason = 'You can view all incoming inquiries and peer discussions here.';
    } else if (q.includes('match') || q.includes('recommend')) {
      dest = '/matchmaker';
      reason = 'The AI Matchmaker finds reciprocal swaps based on what you teach and seek.';
    } else if (q.includes('circle') || q.includes('community') || q.includes('workshop')) {
      dest = '/community';
      reason = 'Join group circles and live collaborative workshops here.';
    } else if (q.includes('credit') || q.includes('karma') || q.includes('token') || q.includes('ledger')) {
      dest = '/credits';
      reason = 'Check your Karma balance and transparent barter ledger.';
    } else if (q.includes('profile') || q.includes('my skill') || q.includes('account')) {
      dest = '/profile';
      reason = 'Manage your profile, active listings, reviews, and avatar here.';
    } else if (q.includes('swap') || q.includes('proposal')) {
      dest = '/my-swaps';
      reason = 'Review pending, accepted, and completed swap proposals.';
    }
    return {
      toolName: 'navigate_platform',
      args: { destination: dest, reason },
    };
  }

  const isFindingSkills =
    q.includes('active skill') ||
    q.includes('take part') ||
    q.includes('find skill') ||
    q.includes('find some skill') ||
    q.includes('skills for me') ||
    q.includes('skills out there') ||
    q.includes('search skill') ||
    q.includes('look for skill') ||
    q.includes('what skills can i') ||
    q.includes('available skill') ||
    q.includes('learn sourdough') ||
    q.includes('learn react') ||
    q.includes('learn pottery') ||
    q.includes('learn guitar') ||
    q.includes('learn japanese') ||
    q.includes('learn cooking');

  if (isFindingSkills) {
    let category: string | undefined;
    if (q.includes('cook') || q.includes('baking') || q.includes('sourdough')) category = 'Culinary Arts';
    else if (q.includes('react') || q.includes('code') || q.includes('typescript') || q.includes('tech')) category = 'Technology';
    else if (q.includes('pottery') || q.includes('ceramic') || q.includes('wood')) category = 'Crafts & DIY';
    else if (q.includes('japanese') || q.includes('spanish') || q.includes('language')) category = 'Languages';
    else if (q.includes('guitar') || q.includes('music') || q.includes('audio')) category = 'Music & Audio';
    else if (q.includes('photo') || q.includes('camera') || q.includes('visual')) category = 'Visual Arts';
    else if (q.includes('yoga') || q.includes('breath') || q.includes('wellness')) category = 'Wellness & Fitness';
    else if (q.includes('write') || q.includes('story') || q.includes('business')) category = 'Business & Writing';

    return {
      toolName: 'find_active_skills',
      args: {
        query,
        category,
        format: q.includes('online') ? 'Online' : q.includes('in-person') ? 'In-Person' : undefined,
      },
    };
  }

  return null;
}

export function buildKeywordFallback(
  message: string,
  currentUserName: string,
  availableSkills: PlatformSkill[]
): { reply: string; suggestedSkillIds: string[]; actions: any[] } {
  const q = message.toLowerCase().trim();

  const defaultActions = [
    { label: '🔍 Explore All Crafts', type: 'navigate', path: '/discover' },
    { label: '🎯 Try Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
    { label: '✨ Post a Skill Offer', type: 'open_modal', payload: 'post_skill' },
  ];

  if (q.includes('match') || q.includes('partner') || q.includes('trade') || q.includes('compatible')) {
    return {
      reply: `### Smart Matchmaker

The **Smart Matchmaker** pairs what you can teach with what other crafters want to learn, calculating mutual compatibility percentages in real time!

* **Two-Way Barter:** Direct 1-on-1 swaps when your skills align.
* **Karma Fallback:** If skills don't match directly, spend 1 Karma Credit earned by teaching!`,
      suggestedSkillIds: availableSkills.slice(0, 2).map((s) => s.id),
      actions: [
        { label: '🎯 Open Smart Matchmaker', type: 'navigate', path: '/matchmaker' },
        { label: '✨ Post a Skill Offer', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  if (q.includes('circle') || q.includes('workshop') || q.includes('group')) {
    return {
      reply: `### Community Circles

**Community Circles** are live, collaborative group exchanges—like weekend sourdough baking or live React code reviews—where anyone can join and learn together for free.`,
      suggestedSkillIds: [],
      actions: [
        { label: '👥 View Community Circles', type: 'navigate', path: '/circles' },
        { label: '✨ Host a Circle', type: 'navigate', path: '/circles' },
      ],
    };
  }

  if (q.includes('credit') || q.includes('karma') || q.includes('money') || q.includes('cost') || q.includes('free')) {
    return {
      reply: `### Zero-Money Karma Economics

SwapCraft is **100% money-free**!
* **1 Hour Taught = 1 Karma Credit Earned**
* **1 Karma Credit = 1 Hour of Learning** with any mentor on the platform.

No subscription fees, no platform cuts, and no cash transactions ever.`,
      suggestedSkillIds: [],
      actions: [
        { label: '🪙 Learn Karma Economics', type: 'navigate', path: '/credits' },
        { label: '✨ Offer a Skill to Earn Karma', type: 'open_modal', payload: 'post_skill' },
      ],
    };
  }

  return {
    reply: `Hello **${currentUserName}**! I'm your SwapCraft AI Concierge.

I can help you:
* **Discover active skills** to take part in across Culinary Arts, Tech, Pottery, Languages, and more.
* **Find reciprocal partners** using our smart compatibility matchmaker.
* **Join Community Circles** for live group workshops.
* **Explain Karma Credits** (our zero-money barter reciprocity system).

What craft or skill would you love to learn today?`,
    suggestedSkillIds: [],
    actions: defaultActions,
  };
}
