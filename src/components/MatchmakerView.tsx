import React, { useState } from 'react';
import { SkillListing, UserProfile } from '../types';
import { Sparkles, ArrowRight, Repeat, Users, Zap, HeartHandshake } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { GeometricAvatar } from './GeometricAvatar';
import { SafeEmoji } from './SafeEmoji';

interface MatchmakerViewProps {
  listings: SkillListing[];
  currentUser: UserProfile;
  onSelectListing: (listing: SkillListing) => void;
  onProposeSwap: (listing: SkillListing) => void;
}

export const MatchmakerView: React.FC<MatchmakerViewProps> = ({
  listings,
  currentUser,
  onSelectListing,
  onProposeSwap,
}) => {
  const [mySkill, setMySkill] = useState('UI/UX Design & Illustration');
  const [targetCategory, setTargetCategory] = useState('All');
  const [matchMode, setMatchMode] = useState<'two-way' | 'chain'>('two-way');

  // Exclude current user's own listings from suggestions
  const peerListings = listings.filter(
    (l) => l.user.id !== currentUser.id && l.user.name !== currentUser.name
  );

  // Interactive match calculation
  const scoredMatches = peerListings
    .map((listing) => {
      let score = 75; // base compatibility

      const lowerWant = listing.wantSkill.toLowerCase();

      if (
        lowerWant.includes('design') ||
        lowerWant.includes('ui') ||
        lowerWant.includes('figma') ||
        lowerWant.includes('portfolio') ||
        lowerWant.includes('notion') ||
        lowerWant.includes('illustration')
      ) {
        score += 23;
      }

      if (targetCategory !== 'All' && listing.category === targetCategory) {
        score += 15;
      }

      if (listing.user.distance && listing.user.distance.includes('miles')) {
        score += 4;
      }

      score = Math.min(score, 99);

      return {
        listing,
        score,
        matchReason:
          score > 90
            ? 'Perfect 2-Way Reciprocity: They are actively searching for your craft skills!'
            : 'High Affinity: Aligned learning pace, verified mentor status, and flexible schedule.',
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-[var(--theme-bg-light)] dark:bg-[var(--theme-card-dark)] rounded-3xl p-6 sm:p-8 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] relative transition-colors z-20">
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/15 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>

        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-full text-xs font-semibold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
            <span>SwapCraft Reciprocity Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
            Discover Mutual Learning Pairs & Knowledge Chains
          </h2>
          <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#C5C4BE] leading-relaxed">
            Our reciprocity algorithm matches what you teach with people who are looking for exactly that — zero financial transactions, 100% genuine knowledge exchange.
          </p>
        </div>

        {/* Custom Dropdowns Input Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#EAE7E1]/80 dark:border-[var(--theme-border-dark)] relative z-30">
          <div>
            <CustomSelect
              label="What You Can Teach"
              value={mySkill}
              onChange={(val) => setMySkill(val)}
              options={[
                { value: 'UI/UX Design & Illustration', label: 'UI/UX Design & Botanical Illustration' },
                { value: 'React & Tailwind Code Review', label: 'React & Tailwind Architecture' },
                { value: 'Notion Dashboard Systems', label: 'Notion Dashboard & Life Systems' },
                { value: 'Digital Marketing & Copywriting', label: 'Digital Marketing & Storytelling' },
              ]}
            />
          </div>

          <div>
            <CustomSelect
              label="What You Wish to Learn"
              value={targetCategory}
              onChange={(val) => setTargetCategory(val)}
              options={[
                { value: 'All', label: 'All Categories (Best Match Across Everything)' },
                { value: 'Culinary Arts', label: 'Culinary Arts & Food' },
                { value: 'Visual Arts', label: 'Visual Arts & Photography' },
                { value: 'Languages', label: 'Languages & Fluency' },
                { value: 'Crafts & DIY', label: 'Crafts & Ceramics' },
                { value: 'Music & Audio', label: 'Music & Audio Production' },
                { value: 'Wellness & Fitness', label: 'Wellness & Urban Gardening' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 p-1 bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] rounded-2xl">
          <button
            onClick={() => setMatchMode('two-way')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              matchMode === 'two-way'
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'text-[#52524D] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Direct 2-Way Swaps ({scoredMatches.length})</span>
          </button>

          <button
            onClick={() => setMatchMode('chain')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              matchMode === 'chain'
                ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                : 'text-[#52524D] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3-Way Chain Swaps (2 loops)</span>
          </button>
        </div>

        <span className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
          Matches calibrated for <span className="font-semibold text-[#1F1F1C] dark:text-[#FAF9F5]">{currentUser.name}</span>
        </span>
      </div>

      {/* Mode Content */}
      {matchMode === 'two-way' ? (
        scoredMatches.length === 0 ? (
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-12 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">
              No Skill Listings to Match Yet
            </h3>
            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] max-w-sm mx-auto">
              Post your skills or invite neighbors to list their crafts to discover mutual 2-way and 3-way barter matches.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scoredMatches.map(({ listing, score, matchReason }) => (
            <div
              key={listing.id}
              className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] dark:hover:border-[var(--theme-primary-dark)] p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Match Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: listing.accentBg || '#E5D9B6' }}
                  >
                    <SafeEmoji emoji={listing.emoji} fallbackCategory={listing.category} size="xl" />
                  </div>
                  <div>
                    <h3
                      className="font-bold text-base text-[#1F1F1C] dark:text-[#FAF9F5] hover:text-[var(--theme-primary)] dark:hover:text-[var(--theme-primary-dark)] cursor-pointer"
                      onClick={() => onSelectListing(listing)}
                    >
                      {listing.title}
                    </h3>
                    <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] flex items-center gap-2 mt-0.5">
                      <span>Mentor: {listing.user.name}</span>
                      <span>•</span>
                      <span>{listing.user.distance}</span>
                      <span>•</span>
                      <span>★ {listing.user.rating}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] block">
                      {score}% Match
                    </span>
                    <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">Reciprocity Score</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)]/30 flex items-center justify-center font-bold text-sm text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                    {score}%
                  </div>
                </div>
              </div>

              {/* Match Exchange Flow Banner */}
              <div className="p-3.5 rounded-2xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs items-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] block">
                    You Teach {listing.user.name.split(' ')[0]}:
                  </span>
                  <p className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{mySkill}</p>
                </div>

                <div className="flex items-center justify-center text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold">
                  <Repeat className="w-5 h-5 animate-pulse" />
                </div>

                <div className="space-y-1 md:text-right">
                  <span className="text-[10px] uppercase font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] block">
                    {listing.user.name.split(' ')[0]} Teaches You:
                  </span>
                  <p className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">{listing.offerSkill}</p>
                </div>
              </div>

              {/* Match Reason pill */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <p className="text-[#52524D] dark:text-[#C5C4BE] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0" />
                  <span>{matchReason}</span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectListing(listing)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-bold text-[#52524D] dark:text-[#D5D4CE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    View Syllabus
                  </button>
                  <button
                    onClick={() => onProposeSwap(listing)}
                    className="px-5 py-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Instant Swap Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )
      ) : (
        /* 3-Way Chain Swap View */
        <div className="space-y-6">
          <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] bg-[var(--theme-accent)]/10 px-2.5 py-1 rounded-full border border-[var(--theme-accent)]/25">
                  Triangular Knowledge Loop #1
                </span>
                <h3 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mt-2">
                  Design → Urban Gardening → Sourdough & Thai Cuisine
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1.5 bg-[var(--theme-primary)]/15 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] rounded-full">
                100% Zero-Waste Trade
              </span>
            </div>

            <p className="text-xs text-[#52524D] dark:text-[#C5C4BE]">
              When two people don't match directly, SwapCraft automatically connects a 3-way circular loop where everyone teaches what they know and learns what they crave.
            </p>

            {/* Loop Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2">
                <div className="flex items-center gap-2">
                  <GeometricAvatar avatar={currentUser.avatar} name={currentUser.name} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">You ({currentUser.name.split(' ')[0]})</p>
                    <p className="text-[10px] text-[#52524D] dark:text-[#C5C4BE]">Teaches UI/UX Design</p>
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold flex items-center gap-1 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  <span>↳ to Elena Rostova</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2">
                <div className="flex items-center gap-2">
                  <GeometricAvatar avatar="shape:flower:forest" name="Elena" size="sm" />
                  <div>
                    <p className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">Elena Rostova</p>
                    <p className="text-[10px] text-[#52524D] dark:text-[#C5C4BE]">Teaches Urban Gardening</p>
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold flex items-center gap-1 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  <span>↳ to Sunni Mahavong</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-[var(--theme-bg-light)]/50 dark:bg-[var(--theme-bg-dark)]/50 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] space-y-2">
                <div className="flex items-center gap-2">
                  <GeometricAvatar avatar="shape:sun:ochre" name="Sunni" size="sm" />
                  <div>
                    <p className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5]">Sunni Mahavong</p>
                    <p className="text-[10px] text-[#52524D] dark:text-[#C5C4BE]">Teaches Thai Cooking</p>
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-semibold flex items-center gap-1 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
                  <span>↳ to You ({currentUser.name.split(' ')[0]})!</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => onProposeSwap(peerListings[0] || listings[0])}
                className="px-6 py-2.5 rounded-xl bg-[var(--theme-primary)] hover:opacity-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Join & Confirm Chain Swap</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
