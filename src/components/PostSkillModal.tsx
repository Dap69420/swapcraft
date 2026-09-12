import React, { useState } from 'react';
import { SkillListing, SkillCategory, ExperienceLevel, SwapFormat, UserProfile } from '../types';
import { X, Plus, Sparkles, BookOpen, Clock, MapPin, Smile } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { SafeEmoji } from './SafeEmoji';
const fireConfetti = (opts: Record<string, unknown>) => { void import('canvas-confetti').then((m) => m.default({ particleCount: 40, disableForReducedMotion: true, ...opts })); };

interface PostSkillModalProps {
  currentUser: UserProfile;
  categories: SkillCategory[];
  onClose: () => void;
  onPostSkill: (newSkill: SkillListing) => void;
}

const EMOJI_PRESETS = ['🎨', '🥘', '📸', '☕', '💻', '🌿', '🎸', '🏺', '🎙️', '🍞', '♟️', '🥋', '📚', '🧘‍♀️', '🧵'];
const ACCENT_PRESETS = [
  { label: 'Sand', color: '#E5D9B6' },
  { label: 'Sage', color: '#D6E2D6' },
  { label: 'Linen', color: '#F0E6E1' },
  { label: 'Slate', color: '#E2E6F0' },
  { label: 'Terracotta', color: '#F5E4D7' },
  { label: 'Clay', color: '#E8DFD8' },
];

export const PostSkillModal: React.FC<PostSkillModalProps> = ({
  currentUser,
  categories,
  onClose,
  onPostSkill,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Technology');
  const [emoji, setEmoji] = useState('🎨');
  const [accentBg, setAccentBg] = useState('#E5D9B6');
  const [offerSkill, setOfferSkill] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [topics, setTopics] = useState<string[]>([
    'Core fundamentals & equipment setup',
    'Practical hands-on projects & live feedback',
    'Curated reference toolkit & workflow tips',
  ]);
  const [wantSkill, setWantSkill] = useState('');
  const [wantDescription, setWantDescription] = useState('');
  const [level, setLevel] = useState<ExperienceLevel>('Beginner Friendly');
  const [format, setFormat] = useState<SwapFormat>('Flexible');
  const [sessionDuration, setSessionDuration] = useState('60 mins / session');
  const [availability, setAvailability] = useState('Weekday evenings & weekends');

  const handleAddTopic = () => {
    if (topicInput.trim() && topics.length < 5) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (idx: number) => {
    setTopics(topics.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: SkillListing = {
      id: `skill-${Date.now()}`,
      title: title || offerSkill,
      category,
      wantCategory: 'Culinary Arts',
      user: currentUser,
      emoji,
      accentBg,
      offerSkill,
      offerDescription,
      offerTopics: topics,
      wantSkill,
      wantDescription,
      level,
      format,
      sessionDuration,
      availability,
      saved: false,
      featured: true,
      createdAt: 'Just now',
    };

    try {
      fireConfetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#4A654E', '#B85D3B', '#385A7C'],
      });
    } catch {
      // ignore
    }

    onPostSkill(newListing);
    onClose();
  };

  const filteredCategories = categories.filter((c) => c !== 'All');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl flex flex-col relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-[var(--theme-card-dark)] hover:bg-white text-[#7D7D76] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
              Share Your Craft
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            Post a New Skill Listing
          </h2>
          <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] mt-1">
            Publish what you love to teach and tell the SwapCraft community what you hope to learn in exchange.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Title & Category */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g. Botanical Watercolor & Natural Pigments Workshop"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <CustomSelect
                  label="Primary Category *"
                  value={category}
                  onChange={(val) => setCategory(val as SkillCategory)}
                  options={filteredCategories.map((c) => ({ value: c, label: c }))}
                />
              </div>

              <div>
                <CustomSelect
                  label="Skill Level You Teach"
                  value={level}
                  onChange={(val) => setLevel(val as ExperienceLevel)}
                  options={[
                    { value: 'Beginner Friendly', label: 'Beginner Friendly' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                    { value: 'All Levels', label: 'All Levels' },
                  ]}
                />
              </div>
            </div>

            {/* Icon & Card theme */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1.5">
                Choose Card Emoji & Natural Hue
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {EMOJI_PRESETS.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setEmoji(item)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 border transition-all cursor-pointer ${
                      emoji === item
                        ? 'border-[var(--theme-primary)] dark:border-[var(--theme-primary-dark)] bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] scale-105'
                        : 'border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[var(--theme-bg-light)]/40 dark:bg-[var(--theme-card-dark)] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)]'
                    }`}
                  >
                    <SafeEmoji emoji={item} size="md" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
                {ACCENT_PRESETS.map((accent) => (
                  <button
                    type="button"
                    key={accent.color}
                    onClick={() => setAccentBg(accent.color)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                      accentBg === accent.color
                        ? 'border-[var(--theme-primary)] text-[#1F1F1C] font-bold ring-1 ring-[var(--theme-primary)]'
                        : 'border-[#EAE7E1] text-[#52524D]'
                    }`}
                    style={{ backgroundColor: accent.color }}
                  >
                    {accent.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* What you offer */}
          <div className="space-y-3 p-4 rounded-2xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>What You Will Offer & Teach</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Skill Summary (1-line) *
              </label>
              <input
                type="text"
                value={offerSkill}
                onChange={(e) => setOfferSkill(e.target.value)}
                placeholder="E.g. Botanical illustration, ink lining & pigment washes"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Detailed Teaching Description *
              </label>
              <textarea
                rows={3}
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                placeholder="Explain what a learner will walk away with, your teaching style, and materials provided..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] resize-none"
                required
              />
            </div>

            {/* Key Topics */}
            <div>
              <label className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Key Topics / Syllabus Highlights
              </label>
              <div className="space-y-1.5 mb-2">
                {topics.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs text-[#1F1F1C] dark:text-[#FAF9F5]"
                  >
                    <span className="truncate pr-2">{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(idx)}
                      className="text-[#7D7D76] dark:text-[#8E8D86] hover:text-red-600 dark:hover:text-red-400 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                  placeholder="Add a syllabus topic..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-3 py-1.5 bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-xl text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:bg-white dark:hover:bg-[var(--theme-card-dark)] cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* What you want in return */}
          <div className="space-y-3 p-4 rounded-2xl bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/25">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
              <span>What You Hope to Learn in Exchange</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Wanted Skill *
              </label>
              <input
                type="text"
                value={wantSkill}
                onChange={(e) => setWantSkill(e.target.value)}
                placeholder="E.g. Sourdough baking, conversational French, Portrait lighting..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Why are you eager to learn this?
              </label>
              <textarea
                rows={2}
                value={wantDescription}
                onChange={(e) => setWantDescription(e.target.value)}
                placeholder="Describe your current baseline and what you want to achieve together..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] resize-none"
              />
            </div>
          </div>

          {/* Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <CustomSelect
                label="Format"
                value={format}
                onChange={(val) => setFormat(val as SwapFormat)}
                options={[
                  { value: 'Flexible', label: 'Flexible' },
                  { value: 'In-Person', label: 'In-Person' },
                  { value: 'Online', label: 'Online' },
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Session Length
              </label>
              <input
                type="text"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(e.target.value)}
                placeholder="60 mins / session"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block mb-1">
                Availability
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="Weekends & evenings"
                className="w-full px-3 py-2 text-xs rounded-xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-95 transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Skill Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
