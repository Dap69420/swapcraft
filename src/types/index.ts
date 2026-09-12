export type SkillCategory =
  | 'All'
  | 'Technology'
  | 'Culinary Arts'
  | 'Visual Arts'
  | 'Languages'
  | 'Wellness & Fitness'
  | 'Music & Audio'
  | 'Crafts & DIY'
  | 'Business & Writing';

export type ExperienceLevel = 'Beginner Friendly' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Beginner';
export type SwapFormat = 'Online' | 'In-Person' | 'Flexible' | 'Hybrid';
export type SwapStatus = 'pending' | 'accepted' | 'active' | 'completed' | 'declined';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  location: string;
  distance?: string;
  rating: number;
  reviewCount: number;
  completedSwaps: number;
  responseTime: string;
  verified: boolean;
  memberSince: string;
  bio: string;
  topBadges: string[];
  credits: number;
}

export interface SkillListing {
  id: string;
  title: string;
  category: SkillCategory;
  user: UserProfile;
  emoji: string;
  accentBg: string; // Hex or tailwind bg
  offerSkill: string;
  offerDescription: string;
  offerTopics: string[];
  wantSkill: string;
  wantDescription: string;
  wantCategory: SkillCategory;
  level: ExperienceLevel;
  format: SwapFormat;
  sessionDuration: string;
  availability: string;
  saved?: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface SwapProposal {
  id: string;
  listingId: string;
  listingTitle: string;
  sender: UserProfile;
  recipient: UserProfile;
  offeredSkill: string;
  requestedSkill: string;
  message: string;
  format: SwapFormat;
  frequency: string;
  preferredTime: string;
  status: SwapStatus;
  createdAt: string;
  scheduledDate?: string;
  meetingLink?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type?: 'text' | 'proposal' | 'session_invite';
  proposalDetails?: Partial<SwapProposal>;
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isAiAssistant?: boolean;
  listingContext?: {
    id: string;
    title: string;
  };
  messages: ChatMessage[];
}

export type BAIModelId =
  | 'hy3'
  | 'mimo-v2.5'
  | 'glm-5.3-flash'
  | 'qwen3.8-flash';

export interface BAIModelInfo {
  id: BAIModelId;
  name: string;
  engineName: string;
  codename: string;
  tag: string;
  description: string;
  persona: string;
  iconName: string;
  supportsThinking: boolean;
  statusBadge: {
    type: 'recommended' | 'heavy_usage' | 'creative';
    label: string;
  };
}

export interface AISuggestionAction {
  label: string;
  type: 'navigate' | 'filter' | 'view_skill' | 'open_modal' | 'create_skill';
  path?: string;
  payload?: any;
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
  status: 'calling' | 'executing' | 'completed' | 'failed';
  resultSummary?: string;
  data?: any;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model?: BAIModelId | string;
  thinking?: string;
  thinkingDurationMs?: number;
  isThinkingStreaming?: boolean;
  isContentStreaming?: boolean;
  isComplete?: boolean;
  suggestedSkillIds?: string[];
  actions?: AISuggestionAction[];
  toolCalls?: AIToolCall[];
  proposedSkill?: Partial<SkillListing>;
  proposedSkillStatus?: 'pending' | 'created' | 'cancelled';
}

export interface CircleDiscussionMessage {
  id: string;
  circleId: string;
  author: UserProfile;
  text: string;
  timestamp: string;
}

export interface CommunityCircle {
  id: string;
  title: string;
  host: UserProfile;
  category: SkillCategory;
  date: string;
  time: string;
  attendeesCount: number;
  maxAttendees: number;
  format: SwapFormat;
  description: string;
  tags: string[];
  joined?: boolean;
  locationOrLink?: string;
  materials?: string[];
  attendees?: UserProfile[];
  discussion?: CircleDiscussionMessage[];
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  skillLearned: string;
  endorsements: string[];
}

export type NotificationType = 'swap_proposal' | 'swap_accepted' | 'circle_reminder' | 'credit_earned' | 'review_received' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
  category: 'swaps' | 'circles' | 'credits' | 'all';
  actionLabel?: string;
  actionTab?: string;
  actionPayload?: any;
}
