import React, { useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  Plus,
  ArrowDown,
  Repeat,
  ShieldCheck,
  Star,
  Coins,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, SwapProposal, SkillCategory } from '../types';

interface MinimalHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalListingsCount: number;
  currentUser: UserProfile;
  activeProposals?: SwapProposal[];
  onOpenMatchmaker: () => void;
  onPostSkillClick: () => void;
  onCirclesClick?: () => void;
  onCreditsClick?: () => void;
  onViewSwaps?: () => void;
  onScrollToListings?: () => void;
  selectedCategory?: SkillCategory;
  onSelectCategory?: (category: SkillCategory) => void;
  listings?: { offerSkill: string; category: string }[];
  inApp?: boolean;
  isLoggedIn?: boolean;
  onGetStarted?: () => void;
}

const FALLBACK_TRENDING = ['React', 'Ceramics', 'Guitar', 'Sourdough', 'Spanish', 'Photography', 'Yoga'];

export const MinimalHero: React.FC<MinimalHeroProps> = ({
  searchQuery,
  setSearchQuery,
  totalListingsCount,
  currentUser,
  activeProposals = [],
  onOpenMatchmaker,
  onPostSkillClick,
  onCirclesClick,
  onCreditsClick,
  onViewSwaps,
  onScrollToListings,
  inApp = false,
  isLoggedIn = false,
  onGetStarted,
  listings = [],
}) => {
  const ongoingProposal = activeProposals[0];
  const otherUser = ongoingProposal
    ? ongoingProposal.sender.id === currentUser.id
      ? ongoingProposal.recipient
      : ongoingProposal.sender
    : null;

  const derivedTrending = useMemo(() => {
    const src = (listings || []).flatMap((l) => [l.offerSkill, l.category]);
    const uniq: string[] = [];
    for (const s of src) { const v = String(s || '').trim(); if (v && !uniq.includes(v) && uniq.length < 7) uniq.push(v); }
    return uniq.length ? uniq : FALLBACK_TRENDING;
  }, [listings]);

  // In-App View (Clean, productive, no marketing hero or cards)
  if (inApp) {
    return (
      <section className="relative pt-2 pb-2 text-left transition-colors">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* User Quick Status Strip if Active Swap Underway */}
          {ongoingProposal && otherUser && (
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)] shrink-0">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <div className="truncate text-xs">
                  <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
                    Active Exchange with {otherUser.name}:
                  </span>{' '}
                  <span className="text-[#52524D] dark:text-[#B5B4AC] truncate">
                    {ongoingProposal.offeredSkill} ⇄ {ongoingProposal.requestedSkill}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onViewSwaps}
                className="text-xs font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>View Swaps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clean In-App Search Bar with Quick Action Buttons */}
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search community skills (e.g. React, Ceramics, Audio, Sourdough, Languages)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-sm text-[#1F1F1C] dark:text-[#FAF9F5] placeholder-[#7D7D76] dark:placeholder-[#8E8D86] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] shadow-2xs transition-all font-sans"
                />
                <div className="absolute left-3.5 top-3 text-[#7D7D76] dark:text-[#8E8D86]">
                  <Search className="w-4 h-4" />
                </div>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-[#7D7D76] hover:text-[#1F1F1C] dark:hover:text-white p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onPostSkillClick}
                  className="px-4 py-2.5 rounded-2xl bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post a Skill</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenMatchmaker}
                  className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-xs sm:text-sm font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] hover:border-[var(--theme-accent)] active:scale-[0.98] transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Matchmaker</span>
                </button>
              </div>
            </div>

            {/* Trending tags row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#52524D] dark:text-[#C5C4BE] scrollbar-none">
              <span className="shrink-0 font-mono text-[11px] text-[#7D7D76] dark:text-[#8E8D86] flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
                <span>Trending:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-nowrap">
                {derivedTrending.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchQuery(item)}
                    className={`shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      searchQuery === item
                        ? 'bg-[var(--theme-primary)] text-white font-bold'
                        : 'bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:border-[var(--theme-primary)]/60'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full Landing Page Hero Mode (with headline, narrative, and 4 cards)
  return (
    <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 text-left transition-colors">
      <div className="max-w-5xl mx-auto space-y-7 sm:space-y-9">
        {/* 1. Top Metadata & Status Pills Row (Developer Portfolio Style) */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-mono">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#3D3D38] dark:text-[#D8D7D0] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Online & In-Person • Peer Network</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#3D3D38] dark:text-[#D8D7D0] shadow-2xs">
            <Coins className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
            <span>100% Cashless • Powered by Karma</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#3D3D38] dark:text-[#D8D7D0] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
            <span>{totalListingsCount} Active Listings</span>
          </div>
        </div>

        {/* 2. Eyebrow + Huge Minimalist Display Headline */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#7D7D76] dark:text-[#8E8D86] tracking-wider uppercase">
            <span>Hey, welcome to</span>
            <span className="px-2 py-0.5 rounded bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold font-mono">
              @swapcraft-community
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5] tracking-tight leading-none">
            SwapCraft<span className="text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">.</span>
          </h1>

          <p className="font-mono text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE] flex items-center gap-2 flex-wrap pt-1">
            <span className="font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
              &lt;/&gt;
            </span>
            <span>Peer Skill Exchange</span>
            <span>•</span>
            <span>Knowledge Barter</span>
            <span>•</span>
            <span>Real-World Mastery</span>
            <span>•</span>
            <span>Zero Money</span>
          </p>
        </div>

        {/* 3. Narrative Lead Description */}
        <div className="space-y-3 max-w-3xl">
          <p className="text-base sm:text-lg md:text-xl text-[#2D2D28] dark:text-[#E8E7E0] leading-relaxed font-normal">
            A minimalist peer platform to exchange real-world skills, find matching mentors, and master new craft through 1-on-1 collaboration.
          </p>
          <p className="text-sm sm:text-base text-[#52524D] dark:text-[#B5B4AC] leading-relaxed font-normal">
            Trade what you know for what you crave to learn. From coding, UI design, and audio engineering to ceramics, sourdough baking, and conversational languages — connect with verified practitioners with zero monetary cost.
          </p>
        </div>

        {/* 4. Action Buttons (Enhanced for Landing Page with Discord-style Open App / Get Started) */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={onGetStarted}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Open SwapCraft</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onGetStarted}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onScrollToListings) {
                onScrollToListings();
              } else {
                const el = document.getElementById('skills-feed');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-xs sm:text-sm font-bold text-[#1F1F1C] dark:text-[#FAF9F5] hover:border-[var(--theme-primary)] active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
          >
            <span>Explore Skills</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenMatchmaker}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-xs sm:text-sm font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] hover:border-[var(--theme-accent)] active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
            <span>AI Matchmaker</span>
          </button>

          <div className="h-5 w-[1px] bg-black/10 dark:bg-white/15 hidden sm:block mx-1" />

          {/* Quick links */}
          <button
            type="button"
            onClick={onCirclesClick}
            className="text-xs font-mono text-[#52524D] dark:text-[#C5C4BE] hover:text-[var(--theme-primary)] dark:hover:text-[var(--theme-primary-dark)] underline-offset-4 hover:underline cursor-pointer"
          >
            #CommunityCircles
          </button>
          <span className="text-black/20 dark:text-white/20 hidden sm:inline">•</span>
          <button
            type="button"
            onClick={onCreditsClick}
            className="text-xs font-mono text-[#52524D] dark:text-[#C5C4BE] hover:text-[var(--theme-primary)] dark:hover:text-[var(--theme-primary-dark)] underline-offset-4 hover:underline cursor-pointer"
          >
            #KarmaLedger
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {/* Card 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-1 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5] block">
              {totalListingsCount}+
            </span>
            <span className="text-xs font-bold text-[#3D3D38] dark:text-[#D8D7D0] block">
              Completed Swaps
            </span>
            <span className="text-[11px] font-mono text-[#7D7D76] dark:text-[#8E8D86] block">
              100% peer barter
            </span>
          </div>

          {/* Card 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-1 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5] block">
              8+
            </span>
            <span className="text-xs font-bold text-[#3D3D38] dark:text-[#D8D7D0] block">
              Skill Categories
            </span>
            <span className="text-[11px] font-mono text-[#7D7D76] dark:text-[#8E8D86] block">
              Across live categories
            </span>
          </div>

          {/* Card 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-1 shadow-2xs">
            <div className="flex items-center gap-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                4.9
              </span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline mb-0.5" />
            </div>
            <span className="text-xs font-bold text-[#3D3D38] dark:text-[#D8D7D0] block">
              Satisfaction Rate
            </span>
            <span className="text-[11px] font-mono text-[#7D7D76] dark:text-[#8E8D86] block">
              Verified reviews
            </span>
          </div>

          {/* Card 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-1 shadow-2xs">
            <span className="text-2xl sm:text-3xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5] block">
              $0
            </span>
            <span className="text-xs font-bold text-[#3D3D38] dark:text-[#D8D7D0] block">
              Cost to Learn
            </span>
            <span className="text-[11px] font-mono text-[#7D7D76] dark:text-[#8E8D86] block">
              Karma & mutual trade
            </span>
          </div>
        </div>

        {/* 6. Minimal Search & Filter Bar Container */}
        <div className="space-y-3 pt-2">
          <div className="p-1.5 sm:p-2 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-2xs">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills (e.g. React & Tailwind, Sourdough, Ceramics, Spanish, Ableton)..."
                  className="w-full pl-11 pr-10 py-3 rounded-xl bg-transparent border-none text-sm sm:text-base text-[#1F1F1C] dark:text-[#FAF9F5] placeholder-[#7D7D76] dark:placeholder-[#8E8D86] focus:outline-none focus:ring-1 focus:ring-[var(--theme-primary)] transition-all font-sans"
                />
                <div className="absolute left-3.5 top-3.5 text-[#7D7D76] dark:text-[#8E8D86]">
                  <Search className="w-4 h-4" />
                </div>

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-[#7D7D76] hover:text-[#1F1F1C] dark:hover:text-white p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('skills-feed');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[var(--theme-primary)] hover:opacity-90 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-2xs active:scale-[0.98] whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Trending suggestions tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#52524D] dark:text-[#C5C4BE] scrollbar-none">
            <span className="shrink-0 font-mono text-[11px] text-[#7D7D76] dark:text-[#8E8D86] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
              <span>Trending:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {derivedTrending.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSearchQuery(item)}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    searchQuery === item
                      ? 'bg-[var(--theme-primary)] text-white font-bold'
                      : 'bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:border-[var(--theme-primary)]/60'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
