import React, { useMemo } from 'react';
import { SkillListing, SkillCategory, SwapFormat, ExperienceLevel, UserProfile, SwapProposal, CommunityCircle } from '../types';
import { MinimalHero } from '../components/MinimalHero';
import { SidebarFilters } from '../components/SidebarFilters';
import { SkillCard } from '../components/SkillCard';
import { CustomSelect } from '../components/CustomSelect';
import { Search, Plus } from 'lucide-react';

interface DiscoverPageProps {
  listings: SkillListing[];
  filteredListings: SkillListing[];
  currentUser: UserProfile;
  activeProposals?: SwapProposal[];
  trendingCircles?: CommunityCircle[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: SkillCategory;
  setSelectedCategory: (c: SkillCategory) => void;
  selectedFormat: SwapFormat | 'All';
  setSelectedFormat: (f: SwapFormat | 'All') => void;
  selectedLevel: ExperienceLevel | 'All';
  setSelectedLevel: (l: ExperienceLevel | 'All') => void;
  onlySaved: boolean;
  setOnlySaved: (s: boolean) => void;
  sortBy: 'featured' | 'recent' | 'rating';
  setSortBy: (s: 'featured' | 'recent' | 'rating') => void;
  categories: SkillCategory[];
  categoryCounts: Record<string, number>;
  onSelectListing: (l: SkillListing) => void;
  onQuickPropose: (l: SkillListing) => void;
  onQuickChat: (u: UserProfile, l?: SkillListing) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onResetFilters: () => void;
  onPostSkill: () => void;
  onOpenMatchmaker: () => void;
  onViewSwapper?: (u: UserProfile) => void;
  onNavigateCircles?: () => void;
  onNavigateCredits?: () => void;
  onNavigateProfile?: () => void;
  onNavigateSwaps?: () => void;
  inApp?: boolean;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  listings,
  filteredListings,
  currentUser,
  activeProposals = [],
  trendingCircles = [],
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedFormat,
  setSelectedFormat,
  selectedLevel,
  setSelectedLevel,
  onlySaved,
  setOnlySaved,
  sortBy,
  setSortBy,
  categories,
  categoryCounts,
  onSelectListing,
  onQuickPropose,
  onQuickChat,
  onToggleSave,
  onResetFilters,
  onPostSkill,
  onOpenMatchmaker,
  onViewSwapper,
  onNavigateCircles,
  onNavigateCredits,
  onNavigateProfile,
  onNavigateSwaps,
  inApp = true,
}) => {
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedFormat !== 'All' ||
    selectedLevel !== 'All' ||
    onlySaved ||
    searchQuery.trim().length > 0;

  // Exclude current user's listings so topSwapper and counts are peers
  const peerListings = useMemo(() => listings.filter(
    (l) => l.user.id !== currentUser.id && l.user.name !== currentUser.name
  ), [listings, currentUser.id, currentUser.name]);

  // Pick top swapper with highest completed swaps from peer listings
  const topSwapper = useMemo(() => peerListings
      .map((l) => l.user)
      .sort((a, b) => (b.completedSwaps ?? 0) - (a.completedSwaps ?? 0))[0] || undefined, [peerListings]);

  const handleScrollToListings = () => {
    const el = document.getElementById('skills-feed');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16">
      {/* 1. Unified Minimalist Hero Section (In-app mode hides promotional hero text & cards) */}
      <MinimalHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalListingsCount={peerListings.length}
        currentUser={currentUser}
        activeProposals={activeProposals}
        onOpenMatchmaker={onOpenMatchmaker}
        onPostSkillClick={onPostSkill}
        onCirclesClick={() => onNavigateCircles?.()}
        onCreditsClick={() => onNavigateCredits?.()}
        onViewSwaps={() => onNavigateSwaps?.()}
        onScrollToListings={handleScrollToListings}
        inApp={inApp}
        isLoggedIn={true}
      />

      {/* 2. Main Discover Layout: Sidebar + Grid */}
      <div id="skills-feed" className="pt-4 scroll-mt-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left Sticky Sidebar */}
          <SidebarFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedFormat={selectedFormat}
            onSelectFormat={setSelectedFormat}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            onlySaved={onlySaved}
            onToggleOnlySaved={() => setOnlySaved(!onlySaved)}
            categoryCounts={categoryCounts}
            onResetFilters={onResetFilters}
            hasActiveFilters={hasActiveFilters}
            topSwapper={topSwapper}
            onViewSwapper={onViewSwapper}
          />

          {/* Right Listings Grid */}
          <section className="flex-1 w-full space-y-4">
            {/* Top Toolbar: Count + Sort Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[var(--theme-card-dark)] p-3.5 sm:p-4 rounded-2xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-2xs transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {selectedCategory === 'All' ? 'Community Skills' : selectedCategory}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-mono font-bold">
                  {filteredListings.length}
                </span>
                {onlySaved && (
                  <span className="text-[10px] font-mono bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] font-bold px-2 py-0.5 rounded-full">
                    Wishlist only
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <span className="text-xs font-mono text-[#7D7D76] dark:text-[#8E8D86] hidden sm:inline">
                  Sort:
                </span>
                <CustomSelect
                  value={sortBy}
                  onChange={(val) => setSortBy(val as 'featured' | 'recent' | 'rating')}
                  options={[
                    { value: 'featured', label: 'Recommended Match' },
                    { value: 'recent', label: 'Recently Listed' },
                    { value: 'rating', label: 'Highest Rated' },
                  ]}
                  className="w-full sm:w-48 text-xs font-sans"
                />
              </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] p-12 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--theme-primary)]/10 flex items-center justify-center text-[var(--theme-primary)]">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {listings.length === 0
                    ? 'No community skill listings yet'
                    : 'No matching skill swaps found'}
                </h3>
                <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] max-w-sm mx-auto">
                  {listings.length === 0
                    ? 'Be the first artisan to post a craft or knowledge offer and start trading skills with zero fees!'
                    : 'Try adjusting your keywords, switching categories, or post your own skill request to kickstart a swap!'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                  <button
                    onClick={onPostSkill}
                    className="px-4 py-2 bg-[var(--theme-primary)] text-white rounded-xl text-xs font-bold shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Post Your Skill</span>
                  </button>
                  {hasActiveFilters && (
                    <button
                      onClick={onResetFilters}
                      className="px-3.5 py-2 bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] rounded-xl text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredListings.map((listing) => (
                  <SkillCard
                    key={listing.id}
                    listing={listing}
                    onSelect={(l) => onSelectListing(l)}
                    onQuickPropose={(l) => onQuickPropose(l)}
                    onQuickMessage={(l) => onQuickChat(l.user, l)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};


