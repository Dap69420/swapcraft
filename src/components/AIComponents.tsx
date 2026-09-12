import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Waves,
  Sparkles,
  Palette,
  Zap,
  Compass,
  FastForward,
  Layers,
  Check,
  Cpu,
  Star,
  Flame,
  Wrench,
  Loader2,
  Terminal,
} from 'lucide-react';
import { BAIModelId, BAIModelInfo, AIToolCall } from '../types';

export const QUICK_PROMPTS = [
  'Find active skills out there I can take part in',
  'Show me coding & tech swaps',
  'How do Karma credits work?',
  'Find me a sourdough baking partner',
  'Take me to Community Circles',
];

// Helper component for model status badge (Recommended, Heavy Usage, Creative)
export const ModelStatusBadge: React.FC<{
  badge?: BAIModelInfo['statusBadge'];
  size?: 'sm' | 'md';
}> = ({ badge, size = 'sm' }) => {
  if (!badge) return null;

  if (badge.type === 'recommended') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ${
          size === 'md' ? 'text-[10.5px] px-2 py-0.5' : 'text-[9.5px] px-1.5 py-[3px]'
        }`}
      >
        <Star className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 shrink-0" />
        <span>{badge.label}</span>
      </span>
    );
  }

  if (badge.type === 'heavy_usage') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border border-amber-500/30 bg-amber-500/15 text-amber-800 dark:text-amber-300 ${
          size === 'md' ? 'text-[10.5px] px-2 py-0.5' : 'text-[9.5px] px-1.5 py-[3px]'
        }`}
      >
        <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500 shrink-0" />
        <span>{badge.label}</span>
      </span>
    );
  }

  if (badge.type === 'creative') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-md border border-violet-500/30 bg-violet-500/15 text-violet-700 dark:text-violet-300 ${
          size === 'md' ? 'text-[10.5px] px-2 py-0.5' : 'text-[9.5px] px-1.5 py-[3px]'
        }`}
      >
        <Palette className="w-2.5 h-2.5 text-violet-600 dark:text-violet-400 shrink-0" />
        <span>{badge.label}</span>
      </span>
    );
  }

  return null;
};

// Helper to get matching icon for each model persona
export const getModelIcon = (id: BAIModelId, className = 'w-3.5 h-3.5') => {
  switch (id) {
    case 'hy3':
      return <Sparkles className={className} />;
    case 'mimo-v2.5':
      return <Palette className={className} />;
    case 'glm-5.3-flash':
      return <Zap className={className} />;
    case 'qwen3.8-flash':
      return <Compass className={className} />;
    default:
      return <Brain className={className} />;
  }
};

// Component for live progressive thinking reveal with automatic collapse upon AI reply
export interface LiveThinkingBlockProps {
  thinking: string;
  durationMs?: number;
  modelInfo: BAIModelInfo;
  isLatest: boolean;
  isThinkingStreaming?: boolean;
  isContentStreaming?: boolean;
  isComplete?: boolean;
}

export const LiveThinkingBlock: React.FC<LiveThinkingBlockProps> = ({
  thinking,
  durationMs = 800,
  isLatest,
  isThinkingStreaming = false,
  isContentStreaming = false,
  isComplete = true,
}) => {
  // If this message is actively streaming thinking, keep it OPEN
  // Once the AI replies (isContentStreaming = true, or isComplete = true), collapse automatically
  const [isOpen, setIsOpen] = useState<boolean>(() => isThinkingStreaming);
  const [hasAutoCollapsed, setHasAutoCollapsed] = useState<boolean>(false);

  const lines = useMemo(() => {
    return thinking
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  }, [thinking]);

  // While thinking is actively streaming, keep open so user watches reasoning live
  useEffect(() => {
    if (isThinkingStreaming) {
      setIsOpen(true);
      setHasAutoCollapsed(false);
    }
  }, [isThinkingStreaming]);

  // When AI replies (isContentStreaming turns true or isComplete turns true while not streaming thinking)
  // automatically collapse the thinking block as requested!
  useEffect(() => {
    if (!isThinkingStreaming && (isContentStreaming || isComplete) && !hasAutoCollapsed) {
      setIsOpen(false);
      setHasAutoCollapsed(true);
    }
  }, [isThinkingStreaming, isContentStreaming, isComplete, hasAutoCollapsed]);

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  if (lines.length === 0) return null;

  return (
    <div className="w-full max-w-[94%]">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 overflow-hidden transition-all shadow-2xs">
        {/* Accordion Bar */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          role="button"
          tabIndex={0}
          className="w-full flex items-center justify-between p-2 text-amber-900 dark:text-amber-200 hover:bg-amber-500/10 transition-colors cursor-pointer text-left gap-2 select-none"
          aria-label="Toggle thinking chain"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`p-1 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0 ${isThinkingStreaming ? 'animate-pulse' : ''}`}>
              <Brain className="w-3 h-3" />
            </div>
            <span className="text-[11px] font-semibold truncate">
              {isThinkingStreaming ? (
                <span className="flex items-center gap-1">
                  <span>Reasoning live</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                </span>
              ) : (
                <span>Thinking Process</span>
              )}
            </span>
            <span className="text-[9px] px-1.5 py-[3px] rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono shrink-0">
              {(durationMs / 1000).toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300 shrink-0">
            {isThinkingStreaming && (
              <button
                type="button"
                onClick={handleSkip}
                title="Collapse thinking process"
                className="px-1.5 py-0.5 rounded bg-amber-600/20 hover:bg-amber-600/30 text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <FastForward className="w-2.5 h-2.5" />
                <span>Collapse</span>
              </button>
            )}
            <span>{isOpen ? 'Hide' : 'View Chain'}</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </div>
        </div>

        {/* Thinking Steps View */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-amber-500/20 bg-[#FAF8F5] dark:bg-[#1A1A18] p-2.5 space-y-1.5"
            >
              {lines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-start gap-1.5 text-[10.5px] font-mono leading-relaxed text-[#52524D] dark:text-[#D5D4CE]"
                >
                  <span className="text-amber-600 dark:text-amber-400 select-none shrink-0 font-bold">›</span>
                  <span className="break-words">{line}</span>
                </motion.div>
              ))}

              {isThinkingStreaming && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-700 dark:text-amber-300 pt-1 font-mono animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>Synthesizing next reasoning branch...</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Live Radar Progress Card while waiting for server
export const LiveReasoningProgress: React.FC<{ modelInfo: BAIModelInfo }> = ({ modelInfo }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [seconds, setSeconds] = useState(0.4);

  const steps = [
    'Parsing user intent & skill taxonomy...',
    'Analyzing dual-sided reciprocity graph...',
    'Evaluating match scores & active circles...',
    'Synthesizing personalized craft guidance...',
  ];

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 550);

    const secTimer = setInterval(() => {
      setSeconds((prev) => Number((prev + 0.1).toFixed(1)));
    }, 100);

    return () => {
      clearInterval(stepTimer);
      clearInterval(secTimer);
    };
  }, [steps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 max-w-[92%] space-y-2 shadow-2xs"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-300 animate-spin" style={{ animationDuration: '3s' }}>
            {getModelIcon(modelInfo.id, 'w-3.5 h-3.5')}
          </div>
          <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 truncate">
            {modelInfo.name} ({modelInfo.persona})
          </span>
        </div>
        <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 bg-amber-500/20 px-1.5 py-[3px] rounded font-bold shrink-0">
          {seconds.toFixed(1)}s
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
        <p className="text-[11px] font-mono text-amber-800 dark:text-amber-300 leading-tight truncate">
          {steps[stepIndex]}
        </p>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-amber-500/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-[var(--theme-accent)] rounded-full"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

// Model Switcher Header Component
interface ModelSwitcherBarProps {
  selectedModel: BAIModelId;
  onSelectModel: (id: BAIModelId) => void;
  availableModels: BAIModelInfo[];
}

export const ModelSwitcherBar: React.FC<ModelSwitcherBarProps> = ({
  selectedModel,
  onSelectModel,
  availableModels,
}) => {
  const [showModelPicker, setShowModelPicker] = useState(false);
  const currentModelInfo = availableModels.find((m) => m.id === selectedModel) || availableModels[0];

  return (
    <div className="relative z-10">
      {/* Model Switcher Bar */}
      <div className="bg-[#FAF8F5] dark:bg-[#232320] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[10px] font-semibold text-[#7D7D76] dark:text-[#A8A7A0] shrink-0 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[var(--theme-primary)]" />
            Engine:
          </span>
          <button
            type="button"
            onClick={() => setShowModelPicker((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white dark:bg-[var(--theme-card-dark)] text-[var(--theme-primary)] dark:text-[var(--theme-accent-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] transition-all cursor-pointer shadow-2xs"
          >
            <span className="text-[var(--theme-primary)] dark:text-[var(--theme-accent-dark)]">
              {getModelIcon(currentModelInfo.id, 'w-3 h-3')}
            </span>
            <span>{currentModelInfo.name}</span>
            <ModelStatusBadge badge={currentModelInfo.statusBadge} size="sm" />
            <ChevronDown className={`w-3 h-3 transition-transform ${showModelPicker ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium hidden sm:inline">
            Engines Ready
          </span>
        </div>
      </div>

      {/* Model Selector Dropdown Drawer */}
      <AnimatePresence>
        {showModelPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-[var(--theme-card-dark)] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-2.5 space-y-1.5 shadow-inner shrink-0 overflow-hidden"
          >
            <div className="flex items-center justify-between pb-1">
              <span className="text-[10px] font-bold text-[#52524D] dark:text-[#D5D4CE] uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-[var(--theme-primary)]" />
                Select Intelligence Engine
              </span>
              <span className="text-[9px] text-[#7D7D76] dark:text-[#A8A7A0]">
                Instant Switch
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {availableModels.map((m) => {
                const isSelected = m.id === selectedModel;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(m.id as BAIModelId);
                      setShowModelPicker(false);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 border-[var(--theme-accent)] shadow-2xs'
                        : 'bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)]/40'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-[var(--theme-accent)] text-white' : 'bg-black/5 dark:bg-white/10 text-[var(--theme-primary)]'}`}>
                        {getModelIcon(m.id, 'w-3.5 h-3.5')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-[#1F1F1C] dark:text-[#FAF9F5]">
                            {m.name}
                          </span>
                          <ModelStatusBadge badge={m.statusBadge} size="sm" />
                        </div>
                        <p className="text-[10px] text-[#7D7D76] dark:text-[#A8A7A0] line-clamp-1 mt-0.5">
                          {m.description}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Tool Calling display card showing real-time tool execution state and summary
export const AIToolCallBlock: React.FC<{ toolCall: AIToolCall }> = ({ toolCall }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCalling = toolCall.status === 'calling';

  return (
    <div className="w-full max-w-[92%] rounded-xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] bg-white/80 dark:bg-[var(--theme-card-dark)]/90 overflow-hidden shadow-2xs text-xs my-1">
      <div className="flex items-center justify-between p-2.5 bg-[var(--theme-bg-light)]/60 dark:bg-black/20 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1 rounded-md shrink-0 ${isCalling ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'}`}>
            {isCalling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">
                {toolCall.name}()
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-[3px] rounded-full uppercase tracking-wider ${
                  isCalling
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {isCalling ? 'Executing...' : 'Tool Complete'}
              </span>
            </div>
            {toolCall.resultSummary && !isCalling && (
              <p className="text-[10px] text-[#7D7D76] dark:text-[#A8A7A0] truncate mt-0.5">
                {toolCall.resultSummary}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 text-[#7D7D76] dark:text-[#A8A7A0] hover:text-[#1F1F1C] dark:hover:text-white rounded transition-colors cursor-pointer shrink-0"
          aria-label="Toggle tool call parameters"
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-2.5 bg-black/[0.02] dark:bg-black/40 space-y-2 text-[10.5px]"
          >
            {toolCall.arguments && (
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#7D7D76] dark:text-[#A8A7A0] block mb-1">
                  Parameters Passed:
                </span>
                <pre className="p-1.5 rounded bg-black/5 dark:bg-black/60 font-mono text-[10px] text-[#1F1F1C] dark:text-[#FAF9F5] overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(toolCall.arguments, null, 2)}
                </pre>
              </div>
            )}

            {toolCall.data && (
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#7D7D76] dark:text-[#A8A7A0] block mb-1">
                  Result Payload ({Array.isArray(toolCall.data) ? `${toolCall.data.length} items` : 'Object'}):
                </span>
                <pre className="p-1.5 rounded bg-black/5 dark:bg-black/60 font-mono text-[10px] text-[#1F1F1C] dark:text-[#FAF9F5] overflow-x-auto max-h-36 whitespace-pre-wrap">
                  {JSON.stringify(toolCall.data, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
