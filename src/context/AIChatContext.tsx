import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AIMessage, AISuggestionAction, SkillListing, UserProfile, BAIModelId, BAIModelInfo } from '../types';
import { BAI_MODELS, INITIAL_AI_MESSAGES, streamAIChatMessage } from '../services/aiAssistantService';
import { useNavigate } from 'react-router-dom';

interface AIChatContextType {
  messages: AIMessage[];
  selectedModel: BAIModelId;
  setSelectedModel: (model: BAIModelId) => void;
  availableModels: BAIModelInfo[];
  isTyping: boolean;
  isOpen: boolean;
  isExpanded: boolean;
  unreadCount: number;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  toggleExpand: () => void;
  sendMessage: (text: string) => Promise<void>;
  handleAction: (action: AISuggestionAction) => void;
  createSkillFromProposed: (proposed: Partial<SkillListing>, messageId?: string) => void;
  clearChat: () => void;
}

const AIChatContext = createContext<AIChatContextType | null>(null);

interface AIChatProviderProps {
  children: React.ReactNode;
  currentUser: UserProfile;
  listings: SkillListing[];
  onOpenPostSkillModal?: () => void;
  onSelectListing?: (listing: SkillListing) => void;
  onFilterCategory?: (category: string) => void;
  onAddListing?: (listing: SkillListing) => void;
  addToast?: (message: string) => void;
}

export const AIChatProvider: React.FC<AIChatProviderProps> = ({
  children,
  currentUser,
  listings,
  onOpenPostSkillModal,
  onSelectListing,
  onFilterCategory,
  onAddListing,
  addToast,
}) => {
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState<BAIModelId>(() => {
    try {
      const saved = localStorage.getItem('swapcraft_bai_model');
      if (
        saved &&
        ['hy3', 'mimo-v2.5', 'glm-5.3-flash', 'qwen3.8-flash'].includes(saved)
      ) {
        return saved as BAIModelId;
      }
    } catch {}
    return 'hy3';
  });

  const [messages, setMessages] = useState<AIMessage[]>(() => {
    try {
      const saved = localStorage.getItem('swapcraft_ai_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Cleanse legacy b.ai text references
          return parsed.map((m: AIMessage) => ({
            ...m,
            text: m.text?.replace(/powered by B\.AI/gi, 'AI Concierge')
              .replace(/B\.AI/gi, 'SwapCraft AI') || '',
            thinking: m.thinking?.replace(/B\.AI/gi, 'SwapCraft') || '',
          }));
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_AI_MESSAGES;
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isTypingRef = useRef(false);
  const isOpenRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);
  const sendGuard = useRef(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Sync model with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('swapcraft_bai_model', selectedModel);
    } catch {}
  }, [selectedModel]);

  // Sync messages with localStorage (debounced + capped; streaming writes per-token otherwise)
  const chatTimer = useRef<number | null>(null);
  useEffect(() => {
    if (chatTimer.current) window.clearTimeout(chatTimer.current);
    chatTimer.current = window.setTimeout(() => {
      try { localStorage.setItem('swapcraft_ai_chat', JSON.stringify(messages.slice(-50))); } catch {}
    }, 2000);
    return () => { if (chatTimer.current) window.clearTimeout(chatTimer.current); };
  }, [messages]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const clearChat = useCallback(() => {
    setMessages(INITIAL_AI_MESSAGES);
    try {
      localStorage.removeItem('swapcraft_ai_chat');
    } catch {
      // ignore
    }
  }, []);

  const createSkillFromProposed = useCallback(
    (proposed: Partial<SkillListing>, messageId?: string) => {
      if (!onAddListing) return;

      const fullListing: SkillListing = {
        id: proposed.id || `skill-${Date.now()}`,
        title: proposed.title || 'Peer Skill Exchange',
        category: (proposed.category as any) || 'Technology',
        user: currentUser,
        emoji: proposed.emoji || '✨',
        accentBg: proposed.accentBg || '#EAE0D5',
        offerSkill: proposed.offerSkill || proposed.title || 'Knowledge Exchange',
        offerDescription:
          proposed.offerDescription || 'Hands-on 1-on-1 collaborative skill exchange session.',
        offerTopics: proposed.offerTopics || ['Fundamentals', 'Hands-on Practice'],
        wantSkill: proposed.wantSkill || 'Any creative craft or 1 Karma Credit',
        wantDescription:
          proposed.wantDescription || 'Interested in learning from curious practitioners.',
        wantCategory: (proposed.wantCategory as any) || 'All',
        level: (proposed.level as any) || 'Beginner Friendly',
        format: (proposed.format as any) || 'Online',
        sessionDuration: proposed.sessionDuration || '60 mins',
        availability: proposed.availability || 'Evenings & Weekends',
        createdAt: 'Just now',
      };

      onAddListing(fullListing);
      if (addToast) {
        addToast(`✨ Skill "${fullListing.title}" published to your profile!`);
      }

      // Mark the message's proposedSkillStatus as 'created'
      setMessages((prev) =>
        prev.map((msg) => {
          if (messageId && msg.id === messageId) {
            return {
              ...msg,
              proposedSkillStatus: 'created' as const,
            };
          }
          if (msg.proposedSkill && msg.proposedSkill.title === proposed.title) {
            return {
              ...msg,
              proposedSkillStatus: 'created' as const,
            };
          }
          return msg;
        })
      );
    },
    [onAddListing, currentUser, addToast]
  );

  const handleAction = useCallback(
    (action: AISuggestionAction) => {
      if (action.type === 'navigate' && action.path) {
        navigate(action.path);
        // On mobile or small screen we can close if needed
      } else if (action.type === 'open_modal') {
        if (action.payload === 'post_skill' && onOpenPostSkillModal) {
          onOpenPostSkillModal();
        }
      } else if (action.type === 'create_skill' && action.payload) {
        createSkillFromProposed(action.payload);
      } else if (action.type === 'filter' && action.payload?.category) {
        if (onFilterCategory) {
          onFilterCategory(action.payload.category);
        }
        navigate('/discover');
      } else if (action.type === 'view_skill' && action.payload?.skillId) {
        const found = listings.find((l) => l.id === action.payload.skillId);
        if (found && onSelectListing) {
          onSelectListing(found);
        }
      }
    },
    [navigate, onOpenPostSkillModal, onFilterCategory, onSelectListing, listings, createSkillFromProposed]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTypingRef.current || sendGuard.current) return;
      sendGuard.current = true;
      isTypingRef.current = true;

      const userMsg: AIMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const aiMsgId = `ai-${Date.now()}`;
      const placeholderAiMsg: AIMessage = {
        id: aiMsgId,
        sender: 'assistant',
        model: selectedModel,
        text: '',
        thinking: '',
        isThinkingStreaming: true,
        isContentStreaming: false,
        isComplete: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSkillIds: [],
        actions: [],
      };

      setMessages((prev) => [...prev, userMsg, placeholderAiMsg]);
      setIsTyping(true);

      try {
        await streamAIChatMessage(
          trimmed,
          [...messagesRef.current, userMsg],
          currentUser,
          listings,
          selectedModel,
          (event) => {
            setMessages((prev) =>
              prev.map((msg) => {
                if (msg.id !== aiMsgId) return msg;

                if (event.type === 'thinking') {
                  return {
                    ...msg,
                    thinking: (msg.thinking || '') + (event.text || ''),
                    isThinkingStreaming: true,
                  };
                }

                if (event.type === 'thinking_done') {
                  return {
                    ...msg,
                    thinkingDurationMs: event.durationMs || msg.thinkingDurationMs,
                    isThinkingStreaming: false,
                  };
                }

                if (event.type === 'tool_call' && event.toolCall) {
                  const currentTools = msg.toolCalls ? [...msg.toolCalls] : [];
                  const existingIdx = currentTools.findIndex((t) => t.id === event.toolCall!.id);
                  if (existingIdx >= 0) {
                    currentTools[existingIdx] = event.toolCall;
                  } else {
                    currentTools.push(event.toolCall);
                  }
                  return {
                    ...msg,
                    toolCalls: currentTools,
                  };
                }

                if (event.type === 'tool_result' && event.toolCall) {
                  const currentTools = msg.toolCalls ? [...msg.toolCalls] : [];
                  const existingIdx = currentTools.findIndex((t) => t.id === event.toolCall!.id);
                  if (existingIdx >= 0) {
                    currentTools[existingIdx] = event.toolCall;
                  } else {
                    currentTools.push(event.toolCall);
                  }
                  const isSkillCreation = event.toolCall.name === 'create_skill_for_user' && event.toolCall.data;
                  return {
                    ...msg,
                    toolCalls: currentTools,
                    proposedSkill: isSkillCreation ? event.toolCall.data : msg.proposedSkill,
                    proposedSkillStatus: isSkillCreation ? 'pending' : msg.proposedSkillStatus,
                  };
                }

                if (event.type === 'content') {
                  return {
                    ...msg,
                    text: (msg.text || '') + (event.text || ''),
                    isThinkingStreaming: false,
                    isContentStreaming: true,
                  };
                }

                if (event.type === 'done') {
                  const proposedSkillFromEvent = (event as any).proposedSkill || msg.proposedSkill;
                  return {
                    ...msg,
                    model: event.model || msg.model,
                    toolCalls: event.toolCalls || msg.toolCalls,
                    suggestedSkillIds: event.suggestedSkillIds || msg.suggestedSkillIds,
                    actions: event.actions || msg.actions,
                    thinkingDurationMs: event.durationMs || msg.thinkingDurationMs,
                    proposedSkill: proposedSkillFromEvent,
                    proposedSkillStatus: proposedSkillFromEvent ? (msg.proposedSkillStatus || 'pending') : msg.proposedSkillStatus,
                    isThinkingStreaming: false,
                    isContentStreaming: false,
                    isComplete: true,
                  };
                }

                if (event.type === 'error') {
                  return {
                    ...msg,
                    text: msg.text || event.error || "I'm here to help you navigate SwapCraft and find great skills to swap!",
                    isThinkingStreaming: false,
                    isContentStreaming: false,
                    isComplete: true,
                  };
                }

                return msg;
              })
            );
          }
        );

        if (!isOpenRef.current) {
          setUnreadCount((c) => c + 1);
        }
      } catch (err) {
        console.error('Failed to stream AI message', err);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  text: msg.text || "I'm here to help you explore SwapCraft skills and partners!",
                  isThinkingStreaming: false,
                  isContentStreaming: false,
                  isComplete: true,
                }
              : msg
          )
        );
      } finally {
        setIsTyping(false);
        isTypingRef.current = false;
        sendGuard.current = false;
      }
    },
    [currentUser, listings, selectedModel]
  );

  return (
    <AIChatContext.Provider
      value={{
        messages,
        selectedModel,
        setSelectedModel,
        availableModels: BAI_MODELS,
        isTyping,
        isOpen,
        isExpanded,
        unreadCount,
        openChat,
        closeChat,
        toggleChat,
        toggleExpand,
        sendMessage,
        handleAction,
        createSkillFromProposed,
        clearChat,
      }}
    >
      {children}
    </AIChatContext.Provider>
  );
};

export const useAIChat = () => {
  const context = useContext(AIChatContext);
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider');
  }
  return context;
};

