import React, { memo } from 'react';
import { SkillListing } from '../types';
import { Bookmark, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { SafeEmoji } from './SafeEmoji';

interface SkillCardProps {
  listing: SkillListing;
  onSelect: (listing: SkillListing) => void;
  onQuickPropose: (listing: SkillListing) => void;
  onQuickMessage: (listing: SkillListing) => void;
  onToggleSave: (listingId: string, e: React.MouseEvent) => void;
}

export const SkillCard: React.FC<SkillCardProps> = memo(({
  listing,
  onSelect,
  onQuickPropose,
  onQuickMessage,
  onToggleSave,
}) => {
  return (
    <div className="swap-card-elevated group rounded-2xl p-5 border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      {/* Top row with clean spacing */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform dark:brightness-[0.85] dark:saturate-[0.9]"
              style={{ backgroundColor: listing.accentBg || '#E5D9B6' }}
            >
              <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="lg" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 title={listing.title} className="font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5] text-base leading-snug group-hover:text-[var(--theme-primary)] dark:group-hover:text-[var(--theme-primary-dark)] transition-colors line-clamp-1">
                {listing.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-[#5A5953] dark:text-[#A8A7A0] truncate">
                <span className="font-semibold text-[#383834] dark:text-[#D5D4CE]">{listing.user.name}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  {listing.user.rating}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline truncate text-[11px] font-mono">{listing.user.distance || listing.user.location}</span>
              </div>
            </div>
          </div>

          {/* Cleanly aligned Bookmark & Status Badge */}
          <div className="flex items-center gap-1.5 shrink-0 pl-1">
            <button
              onClick={(e) => onToggleSave(listing.id, e)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                listing.saved
                  ? 'text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] bg-[var(--theme-accent)]/15'
                  : 'text-[#6B6A64] dark:text-[#8E8D86] hover:text-[#20201D] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              title={listing.saved ? 'Remove from wishlist' : 'Save to wishlist'}
              aria-label={listing.saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={listing.saved}
            >
              <Bookmark className={`w-3.5 h-3.5 ${listing.saved ? 'fill-current' : ''}`} />
            </button>

            {/* Active Status Pill */}
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[9px] font-mono font-bold rounded-md uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </div>
          </div>
        </div>

        {/* 2-Column Offers vs Wants Grid */}
        <div className="grid grid-cols-2 gap-2 p-2 bg-[#F7F6F2] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-xl my-3">
          {/* Offers Container */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-lg p-2.5 border border-[#EAE7E1]/80 dark:border-[var(--theme-border-dark)] space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] dark:bg-[var(--theme-primary-dark)]"></span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                Offers
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] line-clamp-2 leading-relaxed">
              {listing.offerSkill}
            </p>
          </div>

          {/* Wants Container */}
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-lg p-2.5 border border-[#EAE7E1]/80 dark:border-[var(--theme-border-dark)] space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] dark:bg-[var(--theme-accent-dark)]"></span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
                Wants
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] line-clamp-2 leading-relaxed">
              {listing.wantSkill}
            </p>
          </div>
        </div>

        {/* Refined Meta Badges */}
        <div className="flex items-center gap-1.5 flex-wrap my-3 text-[11px] font-mono text-[#52524D] dark:text-[#C5C4BE]">
          <span className="px-2 py-0.5 bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-md">
            {listing.category}
          </span>
          <span className="px-2 py-0.5 bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-md">
            {listing.format}
          </span>
          <span className="px-2 py-0.5 bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-md">
            {listing.level}
          </span>
        </div>
      </div>

      {/* Action buttons with clean minimalist hover */}
      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
        <button
          onClick={() => onSelect(listing)}
          className="flex-1 py-2 px-3 rounded-lg bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold text-xs hover:bg-[var(--theme-primary)] hover:text-white dark:hover:bg-[var(--theme-primary)] dark:hover:text-white transition-all text-center flex items-center justify-center gap-1.5 border border-[var(--theme-primary)]/30 active:scale-[0.98] cursor-pointer"
        >
          <span>View Proposal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onQuickMessage(listing)}
          className="p-2 rounded-lg bg-white dark:bg-[var(--theme-card-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:text-[var(--theme-primary)] dark:hover:text-[var(--theme-primary-dark)] hover:bg-[#F7F6F2] dark:hover:bg-[var(--theme-border-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] transition-colors cursor-pointer"
          title={"Message " + listing.user.name}
          aria-label={"Message " + listing.user.name}
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
SkillCard.displayName = 'SkillCard';
