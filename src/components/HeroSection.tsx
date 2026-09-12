import React, { useMemo } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { BorderBeam } from './magicui/BorderBeam';
import type { SkillListing } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: any) => void;
  totalListingsCount: number;
  listings?: SkillListing[];
  onOpenMatchmaker: () => void;
}

const FALLBACK_TRENDING = ['Sourdough', 'React', 'Ceramics', 'Japanese', 'Guitar', 'Photography', 'Yoga', 'Writing'];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  totalListingsCount,
  listings = [],
  onOpenMatchmaker,
}) => {
  const trending = useMemo(() => {
    const fromData = listings.flatMap((l) => [l.offerSkill, l.category]).filter(Boolean) as string[];
    const uniq: string[] = [];
    for (const s of fromData) { if (!uniq.includes(s) && uniq.length < 8) uniq.push(s); }
    return uniq.length > 0 ? uniq : FALLBACK_TRENDING;
  }, [listings]);
  return (
    <section className="relative overflow-hidden bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)] py-14 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 transition-colors">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:block w-[700px] sm:w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_center,var(--theme-primary)_0%,var(--theme-accent)_40%,transparent_70%)] opacity-15 dark:opacity-20 blur-[110px] -z-0" />

      {/* Corner glows */}
      <div className="pointer-events-none absolute -top-24 right-0 hidden sm:block w-[450px] h-[450px] bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/15 rounded-full blur-[100px] -z-0" />
      <div className="pointer-events-none absolute -bottom-24 left-4 hidden sm:block w-96 h-96 bg-[var(--theme-accent)]/12 dark:bg-[var(--theme-accent)]/15 rounded-full blur-[100px] -z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-wrap items-center justify-between gap-3 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 dark:bg-[var(--theme-card-dark)]/90 backdrop-blur-xs border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] rounded-full text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[var(--theme-primary)] dark:bg-[var(--theme-primary-dark)] animate-pulse" />
            <span>Community Peer Network • Online & In-Person</span>
          </div>

          <button
            onClick={onOpenMatchmaker}
            className="relative overflow-hidden inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] hover:border-[var(--theme-accent)] transition-all shadow-2xs cursor-pointer group"
          >
            <BorderBeam size={100} duration={8} colorFrom="var(--theme-accent)" colorTo="var(--theme-primary)" />
            <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] group-hover:scale-110 transition-transform" />
            <span>Try 2-Way Match Algorithm</span>
            <span className="text-[10px] bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] px-1.5 py-[3px] rounded font-bold">
              AI
            </span>
          </button>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="my-6 sm:my-8 space-y-3 sm:space-y-4 text-center sm:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1F1F1C] dark:text-[#FAF9F5] tracking-tight font-normal leading-[1.14]">
            What would you like to{' '}
            <span className="relative inline-block italic font-normal text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
              learn
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[var(--theme-primary)]/30 dark:bg-[var(--theme-primary-dark)]/40 rounded-full" />
            </span>{' '}
            today?
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#3D3D38] dark:text-[#D1D0C9] max-w-2xl font-normal leading-relaxed">
            Explore {totalListingsCount} community skill listings exchanging real-world knowledge. No money changes hands — trade what you know for what you crave to master.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-8 space-y-3"
        >
          <div className="p-2 sm:p-2.5 rounded-3xl backdrop-blur-md bg-white/80 dark:bg-[var(--theme-card-dark)]/85 border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-lg">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills (e.g. Pottery, React, Sourdough, Spanish, Ableton)..."
                  className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white/90 dark:bg-[var(--theme-bg-dark)]/90 border border-transparent text-sm sm:text-base text-[#1F1F1C] dark:text-[#FAF9F5] placeholder-[#8A8982] dark:placeholder-[#9E9E98] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] focus:bg-white dark:focus:bg-[var(--theme-card-dark)] transition-all"
                />
                <div className="absolute left-4 top-3.5 sm:top-4 text-[#8A8982] dark:text-[#9E9E98]">
                  <Search className="w-5 h-5" />
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 sm:top-3.5 text-[#8A8982] dark:text-[#9E9E98] hover:text-[#1F1F1C] dark:hover:text-white p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                className="px-7 py-3.5 sm:py-4 bg-[var(--theme-primary)] hover:opacity-95 text-white text-sm sm:text-base font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Browse Swaps</span>
              </button>
            </div>
          </div>

          {/* Suggestions */}
          <div className="pt-1 flex items-center gap-2 overflow-x-auto pb-1 text-xs text-[#52524D] dark:text-[#D1D0C9] scrollbar-none">
            <span className="shrink-0 font-bold flex items-center gap-1 text-[#5A5953] dark:text-[#B8B7B0]">
              <TrendingUp className="w-3.5 h-3.5 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]" />
              <span>Popular:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {trending.map((item) => (
                <button
                  key={item}
                  onClick={() => setSearchQuery(item)}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs transition-all cursor-pointer ${
                    searchQuery === item
                      ? 'bg-[var(--theme-primary)] text-white font-bold shadow-2xs'
                      : 'bg-white/90 dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#3D3D38] dark:text-[#D8D7D0] hover:bg-white dark:hover:bg-[var(--theme-bg-dark)] hover:border-[var(--theme-primary)]/50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
