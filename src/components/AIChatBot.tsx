import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  X,
  Send,
  Minimize2,
  Maximize2,
  Trash2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useAIChat } from '../context/AIChatContext';
import { BAIModelId, SkillListing } from '../types';
import { SafeEmoji } from './SafeEmoji';
import {
  ModelSwitcherBar,
  LiveThinkingBlock,
  LiveReasoningProgress,
  ModelStatusBadge,
  getModelIcon,
  QUICK_PROMPTS,
  AIToolCallBlock,
} from './AIComponents';

interface AIChatBotProps {
  listings: SkillListing[];
  onSelectListing: (listing: SkillListing) => void;
  onQuickPropose?: (listing: SkillListing) => void;
  onQuickMessage?: (listing: SkillListing) => void;
}

export const AIChatBot: React.FC<AIChatBotProps> = ({
  listings,
  onSelectListing,
}) => {
  const {
    messages,
    selectedModel,
    setSelectedModel,
    availableModels,
    isTyping,
    isOpen,
    isExpanded,
    unreadCount,
    toggleChat,
    toggleExpand,
    closeChat,
    sendMessage,
    handleAction,
    clearChat,
  } = useAIChat();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listingById = useMemo(() => new Map(listings.map((l) => [l.id, l])), [listings]);

  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (!el) { messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); return; }
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 220;
    if (nearBottom) messagesEndRef.current?.scrollIntoView({ behavior: isTyping ? 'auto' : 'smooth', block: 'end' });
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  const currentModelInfo = availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`flex flex-col bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] rounded-3xl shadow-2xl overflow-hidden mb-3.5 transition-all duration-300 ${
              isExpanded
                ? 'w-[calc(100vw-2rem)] sm:w-[580px] md:w-[680px] h-[calc(100vh-6rem)] max-h-[760px]'
                : 'w-[calc(100vw-2rem)] sm:w-[420px] md:w-[460px] h-[580px] max-h-[calc(100vh-6rem)]'
            }`}
          >
            {/* Header */}
            <div className="p-3 sm:p-3.5 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[var(--theme-primary)] text-white flex items-center justify-center shadow-xs shrink-0 relative">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[var(--theme-card-dark)]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs sm:text-sm text-[#1F1F1C] dark:text-[#FAF9F5] font-serif truncate">
                      SwapCraft AI Concierge
                    </h3>
                    <span className="px-1.5 py-[3px] rounded-full text-[9px] font-bold bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0">
                      Neural Concierge
                    </span>
                  </div>
                  <p className="text-[10px] text-[#7D7D76] dark:text-[#A8A7A0] truncate">
                    Reciprocal Matchmaking & Craft Guidance
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear chat history"
                  className="p-1.5 text-[#7D7D76] dark:text-[#A8A7A0] hover:text-red-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Clear chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleExpand}
                  title={isExpanded ? 'Collapse size' : 'Expand window'}
                  className="p-1.5 text-[#7D7D76] dark:text-[#A8A7A0] hover:text-[#1F1F1C] dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block cursor-pointer"
                  aria-label="Toggle window size"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  title="Minimize assistant"
                  className="p-1.5 text-[#7D7D76] dark:text-[#A8A7A0] hover:text-[#1F1F1C] dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Switcher Bar */}
            <ModelSwitcherBar
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
              availableModels={availableModels}
            />

            {/* Message Stream */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-white dark:bg-[var(--theme-card-dark)]">
              {messages.map((msg, index) => {
                const isUser = msg.sender === 'user';
                const isLatest = index === messages.length - 1 && !isUser;
                const msgModelInfo =
                  availableModels.find((m) => m.id === msg.model) || currentModelInfo;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                  >
                    {/* Model Tag for Assistant */}
                    {!isUser && (
                      <div className="flex items-center gap-1.5 px-1 flex-wrap">
                        <span className="text-[9px] font-bold text-[var(--theme-primary)] dark:text-[var(--theme-accent-dark)] uppercase tracking-wider flex items-center gap-1">
                          {getModelIcon(msgModelInfo.id, 'w-2.5 h-2.5')}
                          {msgModelInfo.name}
                        </span>
                        <ModelStatusBadge badge={msgModelInfo.statusBadge} size="sm" />
                        {msg.thinkingDurationMs && (
                          <span className="text-[9px] text-[#A8A7A0] dark:text-[#7D7D76]">
                            • {(msg.thinkingDurationMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progressive Live Thinking Block */}
                    {!isUser && msg.thinking && msg.thinking.trim().length > 0 && (
                      <LiveThinkingBlock
                        thinking={msg.thinking}
                        durationMs={msg.thinkingDurationMs}
                        modelInfo={msgModelInfo}
                        isLatest={isLatest}
                        isThinkingStreaming={msg.isThinkingStreaming}
                        isContentStreaming={msg.isContentStreaming}
                        isComplete={msg.isComplete}
                      />
                    )}

                    {/* Tool Calling Execution Blocks */}
                    {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                      <div className="w-full space-y-1 my-0.5">
                        {msg.toolCalls.map((tc) => (
                          <AIToolCallBlock key={tc.id} toolCall={tc} />
                        ))}
                      </div>
                    )}

                    {/* Main Message Bubble with Proper Markdown Formatting */}
                    {(isUser || (msg.text && msg.text.trim().length > 0)) && (
                      <div
                        className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isUser
                            ? 'bg-[var(--theme-primary)] text-white rounded-br-xs shadow-2xs'
                            : 'bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] rounded-bl-xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        ) : (
                          <div className="markdown-body text-xs leading-relaxed space-y-2 [&>h1]:text-sm [&>h1]:font-bold [&>h1]:mt-2 [&>h1]:mb-1 [&>h2]:text-xs [&>h2]:font-bold [&>h2]:mt-2 [&>h2]:mb-1 [&>h3]:text-xs [&>h3]:font-bold [&>h3]:mt-1.5 [&>h3]:mb-0.5 [&>h3]:text-[var(--theme-primary)] dark:[&>h3]:text-[var(--theme-accent-dark)] [&>p]:leading-relaxed [&>p]:mb-1.5 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:space-y-1 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:space-y-1 [&>li]:leading-normal [&>strong]:font-bold [&>strong]:text-[#111110] dark:[&>strong]:text-white [&>code]:bg-black/5 dark:[&>code]:bg-white/10 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>code]:text-[11px] [&>hr]:my-2 [&>hr]:border-[#EAE7E1] dark:[&>hr]:border-[var(--theme-border-dark)] [&>blockquote]:border-l-2 [&>blockquote]:border-[var(--theme-accent)] [&>blockquote]:pl-2 [&>blockquote]:italic">
                            <Markdown>{msg.text}</Markdown>
                            {msg.isContentStreaming && (
                              <span className="inline-block w-1.5 h-3 ml-0.5 bg-[var(--theme-primary)] dark:bg-[var(--theme-accent-dark)] animate-pulse align-middle" />
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Rich Suggested Skill Cards */}
                    {!isUser && msg.suggestedSkillIds && msg.suggestedSkillIds.length > 0 && (
                      <div className="w-full max-w-full space-y-2 pt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] uppercase tracking-wider">
                          <Sparkles className="w-3 h-3" />
                          <span>Suggested Matches</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {msg.suggestedSkillIds.map((id) => {
                            const listing = listingById.get(id);
                            if (!listing) return null;
                            return (
                              <div
                                key={listing.id}
                                className="p-2.5 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)]/50 transition-all flex items-center justify-between gap-2 shadow-2xs group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs"
                                    style={{ backgroundColor: listing.accentBg || '#E5D9B6' }}
                                  >
                                    <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="sm" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-xs text-[#1F1F1C] dark:text-[#FAF9F5] truncate group-hover:text-[var(--theme-primary)]">
                                      {listing.title}
                                    </h5>
                                    <p className="text-[10px] text-[#7D7D76] dark:text-[#A8A7A0] truncate">
                                      By {listing.user.name} • {listing.category}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectListing(listing);
                                  }}
                                  className="px-2.5 py-1 text-[11px] font-bold bg-[var(--theme-primary)] text-white rounded-lg hover:opacity-90 shrink-0 flex items-center gap-1 shadow-2xs cursor-pointer"
                                >
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Chips */}
                    {!isUser && msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleAction(act)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 hover:bg-[var(--theme-accent)]/25 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] border border-[var(--theme-accent)]/30 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-[#A8A7A0] dark:text-[#7D7D76] px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {/* Active Thinking Radar while waiting for initial response chunks */}
              {isTyping && !messages.some((m) => m.isThinkingStreaming || m.isContentStreaming) && (
                <LiveReasoningProgress modelInfo={currentModelInfo} />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-[var(--theme-bg-light)]/80 dark:bg-[var(--theme-bg-dark)]/80 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap bg-white dark:bg-[var(--theme-card-dark)] text-[#52524D] dark:text-[#D5D4CE] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] hover:text-[var(--theme-primary)] transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white dark:bg-[var(--theme-card-dark)] border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${currentModelInfo.name} for skill matches, tips...`}
                disabled={isTyping}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 rounded-xl bg-[var(--theme-primary)] text-white hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-2xs shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={toggleChat}
        title="Open SwapCraft AI Concierge"
        aria-label="Toggle SwapCraft AI Assistant"
        className="group relative flex items-center justify-center p-3.5 sm:p-4 rounded-full bg-[var(--theme-primary)] hover:opacity-95 text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />

        {/* Unread Message Badge */}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-[var(--theme-accent)] text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-[var(--theme-card-dark)] shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
