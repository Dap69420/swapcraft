import React, { useState, useRef, useEffect } from 'react';
import { Conversation, SkillListing, UserProfile } from '../types';
import {
  Send,
  Calendar,
  Video,
  Sparkles,
  X,
  Bot,
  ArrowRight,
  Trash2,
  Cpu,
} from 'lucide-react';
import { GeometricAvatar } from './GeometricAvatar';
import { useAIChat } from '../context/AIChatContext';
import { SafeEmoji } from './SafeEmoji';
import {
  ModelSwitcherBar,
  LiveThinkingBlock,
  LiveReasoningProgress,
  ModelStatusBadge,
  getModelIcon,
  QUICK_PROMPTS,
} from './AIComponents';

interface MessagesViewProps {
  conversations: Conversation[];
  currentUser: UserProfile;
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, text: string) => void;
  listings?: SkillListing[];
  onSelectListing?: (listing: SkillListing) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  conversations,
  currentUser,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  listings = [],
  onSelectListing,
}) => {
  const {
    messages: aiMessages,
    isTyping: isAiTyping,
    sendMessage: sendAiMessage,
    handleAction: handleAiAction,
    clearChat: clearAiChat,
    selectedModel,
    setSelectedModel,
    availableModels,
  } = useAIChat();

  const [inputText, setInputText] = useState('');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState('2026-08-28T14:00');
  const [sessionNotes, setSessionNotes] = useState('First swap session: 45 min Thai curry paste + 45 min ukulele chords');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAiActive = activeConversationId === 'conv-ai';

  const activeConversation = isAiActive
    ? null
    : conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const currentModelInfo =
    availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, aiMessages, isAiTyping, activeConversationId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isAiActive) {
      sendAiMessage(inputText.trim());
      setInputText('');
    } else if (activeConversation) {
      onSendMessage(activeConversation.id, inputText.trim());
      setInputText('');
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation) return;

    const scheduleMsg = `📅 Swap Session Scheduled for ${new Date(sessionDate).toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })} • Notes: ${sessionNotes}`;

    onSendMessage(activeConversation.id, scheduleMsg);
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs overflow-hidden h-[700px] max-h-[calc(100vh-130px)] min-h-[580px] flex flex-col md:flex-row transition-colors">
        {/* Conversations Sidebar */}
        <aside className="w-full md:w-80 border-r border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex flex-col bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 shrink-0 h-full">
          <div className="p-4 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-card-dark)] shrink-0 h-[69px] flex flex-col justify-center">
            <h2 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] leading-tight">
              SwapCraft Messages
            </h2>
            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] truncate">
              Peer exchanges & AI skill concierge
            </p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#FAF9F6] dark:divide-[var(--theme-border-dark)]">
            {/* Pinned AI Assistant Conversation */}
            <button
              onClick={() => onSelectConversation('conv-ai')}
              className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer relative ${
                isAiActive
                  ? 'bg-[var(--theme-primary)]/15 dark:bg-[var(--theme-primary)]/25'
                  : 'hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[var(--theme-card-dark)] flex items-center justify-center">
                  <Bot className="w-2 h-2 text-white" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center gap-1.5 truncate">
                    <span>SwapCraft AI Concierge</span>
                    <span className="text-[9px] px-1.5 py-[3px] rounded-full font-bold bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0">
                      AI
                    </span>
                  </h4>
                  <span className="text-[10px] text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-semibold">
                    Always On
                  </span>
                </div>

                <p className="text-[10px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold truncate mt-0.5">
                  Skill recommendations & navigation
                </p>

                <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] truncate mt-0.5">
                  {aiMessages[aiMessages.length - 1]?.text || 'Ask me to find swaps or explain Karma credits!'}
                </p>
              </div>
            </button>

            {/* Peer User Conversations */}
            {conversations.map((conv) => {
              const isActive = !isAiActive && conv.id === activeConversation?.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20'
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="relative shrink-0">
                    <GeometricAvatar avatar={conv.participant.avatar} name={conv.participant.name} size="md" />
                    {conv.unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-[var(--theme-accent)] rounded-full border-2 border-white dark:border-[var(--theme-card-dark)]"></span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] truncate">
                        {conv.participant.name}
                      </h4>
                      <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">{conv.lastMessageTime}</span>
                    </div>

                    {conv.listingContext && (
                      <span className="text-[10px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold block truncate">
                        Re: {conv.listingContext.title}
                      </span>
                    )}

                    <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Chat Window */}
        {isAiActive ? (
          /* AI Assistant Chat Stream with Model Switching & Rich Reasoning */
          <div className="flex-1 flex flex-col bg-white dark:bg-[var(--theme-card-dark)] h-full overflow-hidden">
            {/* AI Header */}
            <div className="p-4 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-3 bg-white dark:bg-[var(--theme-card-dark)] shrink-0 h-[69px]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center gap-2 truncate">
                    <span>SwapCraft AI Concierge</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full font-bold">
                      Multi-Model
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] truncate">
                    Reciprocal matching, community barter guidance & live reasoning
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={clearAiChat}
                  title="Reset conversation"
                  className="p-2 text-[#7D7D76] dark:text-[#A8A7A0] hover:text-red-500 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            {/* Model Switching Bar with Persona Selector */}
            <ModelSwitcherBar
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              availableModels={availableModels}
            />

            {/* AI Message Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[var(--theme-bg-light)]/40 dark:bg-[var(--theme-bg-dark)]/40">
              {/* Context Banner */}
              <div className="p-3 bg-[var(--theme-accent)]/10 rounded-2xl border border-[var(--theme-accent)]/25 text-xs text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
                  <span>
                    Need a match, want to host a circle, or need help creating a listing? Just ask!
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] bg-white dark:bg-[var(--theme-card-dark)] px-2.5 py-0.5 rounded-md shrink-0">
                  Zero Fees
                </span>
              </div>

              {aiMessages.map((msg, index) => {
                const isMe = msg.sender === 'user';
                const isLatestAssistant = !isMe && index === aiMessages.length - 1;
                const msgModelInfo =
                  availableModels.find((m) => m.id === msg.model) || currentModelInfo;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-2`}
                  >
                    {/* Model Tag for Assistant Messages */}
                    {!isMe && (
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-accent-dark)] flex-wrap">
                        <span className="p-1 rounded bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] dark:text-[var(--theme-accent-dark)] flex items-center justify-center">
                          {getModelIcon(msgModelInfo.id, 'w-3 h-3')}
                        </span>
                        <span>{msgModelInfo.name}</span>
                        <ModelStatusBadge badge={msgModelInfo.statusBadge} size="sm" />
                        {msg.thinkingDurationMs && (
                          <span className="text-[9px] px-1.5 py-[3px] rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono">
                            {(msg.thinkingDurationMs / 1000).toFixed(1)}s reasoning
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progressive Thinking Block */}
                    {!isMe && msg.thinking && (
                      <LiveThinkingBlock
                        thinking={msg.thinking}
                        durationMs={msg.thinkingDurationMs || 800}
                        modelInfo={msgModelInfo}
                        isLatest={isLatestAssistant}
                      />
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[var(--theme-primary)] text-white rounded-br-xs shadow-2xs'
                          : 'bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Rich Suggested Skill Cards in Message View */}
                    {!isMe && msg.suggestedSkillIds && msg.suggestedSkillIds.length > 0 && (
                      <div className="w-full max-w-xl space-y-2 pt-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Matching Skills on SwapCraft</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.suggestedSkillIds.map((id) => {
                            const listing = listings.find((l) => l.id === id);
                            if (!listing) return null;
                            return (
                              <div
                                key={listing.id}
                                className="p-3 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] transition-all flex flex-col justify-between space-y-2 shadow-2xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                                    style={{ backgroundColor: listing.accentBg || '#E5D9B6' }}
                                  >
                                    <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="md" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-xs text-[#1F1F1C] dark:text-[#FAF9F5] truncate">
                                      {listing.title}
                                    </h5>
                                    <p className="text-[10px] text-[#7D7D76] dark:text-[#A8A7A0] truncate">
                                      {listing.user.name} • {listing.category}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] line-clamp-1">
                                  Offers: <strong>{listing.offerSkill}</strong>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onSelectListing && onSelectListing(listing)}
                                  className="w-full py-1.5 px-3 rounded-xl bg-[var(--theme-primary)] hover:opacity-90 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <span>View Swap Details</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Chips */}
                    {!isMe && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1 max-w-xl">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAiAction(act)}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--theme-accent)]/10 hover:bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] border border-[var(--theme-accent)]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86] px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Live Reasoning Progress when assistant is responding */}
              {isAiTyping && <LiveReasoningProgress modelInfo={currentModelInfo} />}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-2.5 bg-[#FAF8F5] dark:bg-[#1F1F1C] border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] overflow-x-auto flex items-center gap-1.5 shrink-0 no-scrollbar">
              <span className="text-[10px] font-bold text-[#7D7D76] dark:text-[#A8A7A0] uppercase tracking-wider shrink-0 pl-1">
                Suggested:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendAiMessage(prompt)}
                  disabled={isAiTyping}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white dark:bg-[var(--theme-card-dark)] hover:bg-[var(--theme-primary)] hover:text-white border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#D5D4CE] whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-card-dark)] flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask ${currentModelInfo.name} for skill matches, barter tips, or Karma explanations...`}
                disabled={isAiTyping}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isAiTyping}
                className="p-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white transition-colors shadow-2xs cursor-pointer disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : activeConversation ? (
          /* Peer Chat Stream */
          <div className="flex-1 flex flex-col bg-white dark:bg-[var(--theme-card-dark)] h-full overflow-hidden">
            {/* Peer Header */}
            <div className="p-4 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-3 bg-white dark:bg-[var(--theme-card-dark)] shrink-0 h-[69px]">
              <div className="flex items-center gap-3 min-w-0">
                <GeometricAvatar avatar={activeConversation.participant.avatar} name={activeConversation.participant.name} size="md" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center gap-1.5 truncate">
                    <span className="truncate">{activeConversation.participant.name}</span>
                    <span className="text-[10px] px-1.5 py-[3px] bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] rounded font-bold shrink-0">
                      ★ {activeConversation.participant.rating}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] truncate">
                    {activeConversation.participant.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Schedule Session</span>
                </button>

                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Live Video Swap</span>
                </button>
              </div>
            </div>

            {/* Peer Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[var(--theme-bg-light)]/40 dark:bg-[var(--theme-bg-dark)]/40">
              {/* Context Banner */}
              {activeConversation.listingContext && (
                <div className="p-3 bg-[var(--theme-accent)]/10 rounded-2xl border border-[var(--theme-accent)]/25 text-xs text-[#1F1F1C] dark:text-[#FAF9F5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
                    <span>
                      Discussing exchange: <strong>{activeConversation.listingContext.title}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] bg-white dark:bg-[var(--theme-card-dark)] px-2 py-0.5 rounded-md">
                    Zero-Fee Swap
                  </span>
                </div>
              )}

              {activeConversation.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                const isScheduled = msg.text.startsWith('📅');

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isScheduled
                          ? 'bg-[var(--theme-primary)]/15 border border-[var(--theme-primary)]/30 text-[#1F1F1C] dark:text-[#FAF9F5] font-medium'
                          : isMe
                          ? 'bg-[var(--theme-primary)] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] rounded-bl-xs shadow-2xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Peer Input Footer */}
            <form
              onSubmit={handleSend}
              className="p-3 sm:p-4 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-white dark:bg-[var(--theme-card-dark)] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation.participant.name.split(' ')[0]}...`}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
              />

              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white transition-colors shadow-2xs cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#52524D] dark:text-[#C5C4BE] space-y-3 bg-[var(--theme-bg-light)]/20 dark:bg-[var(--theme-bg-dark)]/20">
            <div className="w-12 h-12 rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
              No Peer Conversation Selected
            </h4>
            <p className="text-xs text-[#7D7D76] dark:text-[#8E8D86] max-w-sm">
              Message an artisan from the Discover page, propose a skill swap, or chat 24/7 with the SwapCraft AI Concierge.
            </p>
            <button
              onClick={() => onSelectConversation('conv-ai')}
              className="px-4 py-2 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-xl shadow-2xs hover:opacity-90 transition-all cursor-pointer"
            >
              Open AI Concierge
            </button>
          </div>
        )}
      </div>

      {/* Schedule Session Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 max-w-md w-full border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-xl space-y-4 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                Schedule Swap Session
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-[#7D7D76] dark:text-[#8E8D86] hover:text-[#1F1F1C] dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                  Proposed Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5]"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                  Session Outline / Location
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white font-bold cursor-pointer"
                >
                  Confirm & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Call Simulator Modal */}
      {isVideoModalOpen && activeConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[var(--theme-card-dark)] text-white rounded-3xl max-w-2xl w-full p-6 border border-[var(--theme-primary)]/40 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  SwapCraft Live Peer Swap Room
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 h-64 sm:h-80">
              {/* Partner View */}
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex flex-col items-center justify-center p-4">
                <GeometricAvatar avatar={activeConversation.participant.avatar} name={activeConversation.participant.name} size="2xl" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-medium">
                  {activeConversation.participant.name} (Teaching)
                </div>
              </div>

              {/* Self View */}
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex flex-col items-center justify-center p-4">
                <GeometricAvatar avatar={currentUser.avatar} name={currentUser.name} size="2xl" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-medium">
                  You ({currentUser.name})
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer"
              >
                End Session & Log Karma Credits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
