import React from 'react';
import {
  Sparkles,
  Plus,
  Coins,
  Star,
  Repeat,
  Zap,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Palette,
} from 'lucide-react';
import { UserProfile, SkillListing, SwapProposal, CommunityCircle } from '../types';
import { GeometricAvatar } from './GeometricAvatar';

interface RobloxHomeHeaderProps {
  currentUser: UserProfile;
  activeProposals: SwapProposal[];
  recommendedSkills: SkillListing[];
  trendingCircles: CommunityCircle[];
  onPostSkillClick: () => void;
  onMatchmakerClick: () => void;
  onCirclesClick: () => void;
  onCreditsClick: () => void;
  onProfileClick: () => void;
  onSelectSkill: (skill: SkillListing) => void;
  onViewSwaps: () => void;
}

export const RobloxHomeHeader: React.FC<RobloxHomeHeaderProps> = ({
  currentUser,
  activeProposals,
  recommendedSkills,
  trendingCircles,
  onPostSkillClick,
  onMatchmakerClick,
  onCirclesClick,
  onCreditsClick,
  onProfileClick,
  onSelectSkill,
  onViewSwaps,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Profile banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-sm text-left relative overflow-hidden">
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-primary)]/5 dark:bg-[var(--theme-primary)]/10 rounded-full blur-3xl z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar + Greeting & Identity */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <GeometricAvatar avatar={currentUser.avatar} name={currentUser.name} size="lg" />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[var(--theme-card-dark)]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  Welcome back, {currentUser.name}!
                </h1>
                {currentUser.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Artisan</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE]">
                {currentUser.tagline} • <span className="text-[#7D7D76]">{currentUser.location}</span>
              </p>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {currentUser.topBadges.slice(0, 2).map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F3F2EE] dark:bg-[var(--theme-bg-dark)] text-[#5A5953] dark:text-[#B8B7B0] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]"
                  >
                    ★ {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={onPostSkillClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Skill</span>
            </button>

            <button
              onClick={onMatchmakerClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--theme-accent)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Matchmaker</span>
            </button>

            <button
              onClick={onProfileClick}
              className="px-3.5 py-2.5 rounded-2xl bg-[#F6F5F0] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] hover:border-[var(--theme-primary)] transition-all cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Bottom Stat Strip (Roblox Profile Bar) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
          {/* Karma Credits */}
          <button
            type="button"
            onClick={onCreditsClick}
            className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-3 cursor-pointer hover:border-[var(--theme-primary)] transition-all text-left w-full"
          >
            <div className="p-2 rounded-xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] block">
                Karma Balance
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {currentUser.credits}
                </span>
                <span className="text-[10px] text-[#7D7D76]">Credits</span>
              </div>
            </div>
          </button>

          {/* Swaps Completed */}
          <button
            type="button"
            onClick={onViewSwaps}
            className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-3 cursor-pointer hover:border-[var(--theme-primary)] transition-all text-left w-full"
          >
            <div className="p-2 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] shrink-0">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] block">
                Swaps Done
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {currentUser.completedSwaps}
                </span>
                <span className="text-[10px] text-[#7D7D76]">Trades</span>
              </div>
            </div>
          </button>

          {/* Rating */}
          <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] block">
                Peer Rating
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {currentUser.rating}
                </span>
                <span className="text-[10px] text-[#7D7D76]">({currentUser.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Response Speed */}
          <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7D7D76] dark:text-[#8E8D86] block">
                Response Speed
              </span>
              <span className="text-sm font-bold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                {currentUser.responseTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active swaps */}
      {activeProposals.length > 0 && (
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-[var(--theme-primary)]" />
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                Continue Swapping
              </h2>
              <span className="text-xs font-bold px-2 py-[3px] rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                {activeProposals.length} active
              </span>
            </div>
            <button
              onClick={onViewSwaps}
              className="text-xs font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all swaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeProposals.slice(0, 3).map((proposal) => {
              const otherUser =
                proposal.sender.id === currentUser.id ? proposal.recipient : proposal.sender;
              return (
                <button
                  type="button"
                  key={proposal.id}
                  onClick={onViewSwaps}
                  className="p-4 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs hover:border-[var(--theme-primary)] transition-all cursor-pointer space-y-2.5 text-left w-full"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <GeometricAvatar avatar={otherUser.avatar} name={otherUser.name} size="sm" />
                      <div className="truncate">
                        <span className="font-bold text-xs block truncate">{otherUser.name}</span>
                        <span className="text-[10px] text-[#7D7D76]">{proposal.format}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        proposal.status === 'accepted' || proposal.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] text-xs text-[#52524D] dark:text-[#C5C4BE]">
                    <div className="font-semibold truncate text-[#1F1F1C] dark:text-[#FAF9F5]">
                      {proposal.offeredSkill} ↔ {proposal.requestedSkill}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended */}
      {recommendedSkills.length > 0 && (
        <div className="space-y-3 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                Recommended for You
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recommendedSkills.slice(0, 3).map((skill) => (
              <button
                type="button"
                key={skill.id}
                onClick={() => onSelectSkill(skill)}
                className="p-4 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xs hover:border-[var(--theme-primary)] hover:shadow-sm transition-all cursor-pointer space-y-2.5 text-left w-full"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <GeometricAvatar avatar={skill.user.avatar} name={skill.user.name} size="sm" />
                    <div className="truncate">
                      <span className="font-bold text-xs block truncate">{skill.user.name}</span>
                      <span className="text-[10px] text-[#7D7D76]">{skill.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]">
                    {skill.format}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs font-serif line-clamp-1">{skill.title}</h4>
                  <p className="text-[11px] text-[#52524D] dark:text-[#C5C4BE] line-clamp-2 mt-0.5">
                    {skill.offerDescription}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-2 text-[10px] font-semibold text-[var(--theme-primary)] min-w-0">
                  <span className="truncate min-w-0">Wants: {skill.wantSkill}</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
