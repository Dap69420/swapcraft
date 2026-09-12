import React, { useState, useEffect, useRef } from 'react';
import {
  Handshake,
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Users,
  Compass,
  Repeat,
  Coins,
  ShieldCheck,
  Moon,
  Sun,
  Palette,
  ArrowUpRight,
  BookOpen,
  Coffee,
  Code2,
} from 'lucide-react';
import { SkillListing, SkillCategory, UserProfile, CommunityCircle } from '../types';
import { MinimalHero } from '../components/MinimalHero';
import { SkillCard } from '../components/SkillCard';
import { GeometricAvatar } from '../components/GeometricAvatar';
import { ColorThemeId, COLOR_THEMES } from '../data/themes';

interface LandingPageProps {
  listings: SkillListing[];
  categories: SkillCategory[];
  selectedCategory: SkillCategory;
  setSelectedCategory: (cat: SkillCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredListings: SkillListing[];
  currentUser: UserProfile;
  isAuthenticated: boolean;
  onOpenAuth: (initialTab?: 'login' | 'signup') => void;
  onLaunchApp: () => void;
  onSelectListing: (listing: SkillListing) => void;
  onOpenMatchmaker: () => void;
  onOpenCircles: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (theme: ColorThemeId) => void;
  onQuickChat: (u: UserProfile, l?: SkillListing) => void;
  onQuickPropose: (l: SkillListing) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  trendingCircles?: CommunityCircle[];
}

export const LandingPage: React.FC<LandingPageProps> = ({
  listings,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  filteredListings,
  currentUser,
  isAuthenticated,
  onOpenAuth,
  onLaunchApp,
  onSelectListing,
  onOpenMatchmaker,
  onOpenCircles,
  isDarkMode,
  onToggleDarkMode,
  currentTheme,
  onSelectTheme,
  onQuickChat,
  onQuickPropose,
  onToggleSave,
  trendingCircles = [],
}) => {
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const themePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isThemePickerOpen) return;
    const onDown = (e: MouseEvent) => { if (themePickerRef.current && !themePickerRef.current.contains(e.target as Node)) setIsThemePickerOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsThemePickerOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [isThemePickerOpen]);

  const handleActionRequiringAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      onOpenAuth('login');
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--theme-bg-light)] dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] transition-colors">
      {/* Landing nav */}
      <header className="sticky top-2 sm:top-3 z-40 max-w-7xl mx-auto w-full px-3 sm:px-6 transition-colors">
        <div className="rounded-2xl sm:rounded-full bg-white/90 dark:bg-[var(--theme-card-dark)]/90 backdrop-blur-md border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] px-3.5 sm:px-6 py-2.5 shadow-sm flex items-center justify-between gap-4 relative">
          {/* Brand Logo with Handshake (No 'peer' text badge) */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left group focus:outline-none rounded-xl p-1 shrink-0 cursor-pointer"
            aria-label="SwapCraft Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[var(--theme-primary)] rounded-xl flex items-center justify-center text-white shadow-xs group-hover:opacity-90 transition-opacity">
              <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1F1F1C] dark:text-[#FAF9F5] font-display">
                SwapCraft
              </span>
            </div>
          </button>

          {/* Navigation Links for Visitors */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 text-xs sm:text-sm font-medium">
            <button
              type="button"
              onClick={() => handleScrollToSection('skills-feed')}
              className="px-3 py-1.5 rounded-full text-[#52524D] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Explore Skills
            </button>
            <button
              type="button"
              onClick={onOpenMatchmaker}
              className="px-3 py-1.5 rounded-full text-[#52524D] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              AI Matchmaker
            </button>
            <button
              type="button"
              onClick={onOpenCircles}
              className="px-3 py-1.5 rounded-full text-[#52524D] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Circles
            </button>
            <button
              type="button"
              onClick={() => handleScrollToSection('how-it-works')}
              className="px-3 py-1.5 rounded-full text-[#52524D] dark:text-[#C5C4BE] hover:text-[#1F1F1C] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Right Action Controls: Theme + Auth (Discord Style) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Color Palette Chooser */}
            <div className="relative" ref={themePickerRef}>
              <button
                type="button"
                aria-expanded={isThemePickerOpen}
                aria-label="Choose color theme"
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className="w-8 h-8 rounded-full border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] flex items-center justify-center text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>

              {isThemePickerOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-48 p-2 rounded-2xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-xl z-[60] space-y-1">
                  <div className="text-[10px] font-mono uppercase text-[#7D7D76] px-2 py-1">
                    Theme Palette
                  </div>
                  {Object.values(COLOR_THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        onSelectTheme(theme.id);
                        setIsThemePickerOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer ${
                        currentTheme === theme.id
                          ? 'bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] font-bold'
                          : 'hover:bg-black/5 dark:hover:bg-white/5 text-[#52524D] dark:text-[#C5C4BE]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: theme.primaryLight }}
                      />
                      <span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-8 h-8 rounded-full border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] flex items-center justify-center text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* If Authenticated: "Open SwapCraft" (Discord Style) */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onLaunchApp}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Open SwapCraft</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              /* If Not Authenticated: "Log In" + "Get Started" */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold text-[#3D3D38] dark:text-[#D8D7D0] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Hero Section (With Big Headline, Text, and 4 Stat Cards Highlighted in Screenshot) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <MinimalHero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalListingsCount={listings.length}
          currentUser={currentUser}
          onOpenMatchmaker={onOpenMatchmaker}
          onPostSkillClick={() => handleActionRequiringAuth(() => onLaunchApp())}
          onCirclesClick={onOpenCircles}
          onCreditsClick={onOpenCircles}
          onScrollToListings={() => handleScrollToSection('skills-feed')}
          inApp={false}
          isLoggedIn={isAuthenticated}
          onGetStarted={isAuthenticated ? onLaunchApp : () => onOpenAuth('signup')}
        />

        {/* 3. Community Skills Showcase / Preview Feed */}
        <section id="skills-feed" className="pt-8 pb-16 scroll-mt-20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E2DFD8] dark:border-[var(--theme-border-dark)] pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Marketplace Preview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5] mt-1">
                Explore Community Crafts
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto flex-nowrap -mx-1 px-1 pb-1 max-w-full scrollbar-none">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[var(--theme-primary)] text-white shadow-2xs font-bold'
                      : 'bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] text-[#52524D] dark:text-[#C5C4BE] hover:border-[var(--theme-primary)]/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Listings Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.slice(0, 6).map((listing) => (
              <SkillCard
                key={listing.id}
                listing={listing}
                onSelect={(l) => onSelectListing(l)}
                onQuickPropose={(l) => handleActionRequiringAuth(() => onQuickPropose(l))}
                onQuickMessage={(l) => handleActionRequiringAuth(() => onQuickChat(l.user, l))}
                onToggleSave={(id, e) => handleActionRequiringAuth(() => onToggleSave(id, e))}
              />
            ))}
          </div>

          {/* Launch App Callout under skills */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base sm:text-lg font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                Showing {Math.min(6, filteredListings.length)} of {filteredListings.length} community offerings
              </h3>
              <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#B5B4AC]">
                Log in to SwapCraft to access all filters, propose swaps, join circles, and chat directly with practitioners.
              </p>
            </div>
            <button
              type="button"
              onClick={isAuthenticated ? onLaunchApp : () => onOpenAuth('signup')}
              className="px-6 py-2.5 rounded-full bg-[var(--theme-primary)] text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap flex items-center gap-2"
            >
              <span>{isAuthenticated ? 'Launch Full App' : 'Join & View All Skills'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 4. How SwapCraft Works Section (Discord / Minimalist Style) */}
        <section id="how-it-works" className="py-12 border-t border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] text-xs font-mono font-bold uppercase">
              <span>Cashless Peer Knowledge Barter</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
              How SwapCraft Works
            </h2>
            <p className="text-sm sm:text-base text-[#52524D] dark:text-[#B5B4AC]">
              Three simple steps to unlock 1-on-1 peer learning without monetary barriers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="text-lg font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                List What You Know
              </h3>
              <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#B5B4AC] leading-relaxed">
                Post your craft or professional skill — whether it's Python development, artisan sourdough, ceramic wheel throwing, or conversational Spanish. Specify what you crave to learn in return.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="text-lg font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                Match & Barter 1-on-1
              </h3>
              <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#B5B4AC] leading-relaxed">
                Browse peer listings or let our AI Matchmaker pair complementary interests. Propose a structured session schedule: in-person coffee meetup or remote video call.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="text-lg font-bold font-display text-[#1F1F1C] dark:text-[#FAF9F5]">
                Zero Money, Powered by Karma
              </h3>
              <p className="text-xs sm:text-sm text-[#52524D] dark:text-[#B5B4AC] leading-relaxed">
                When you teach a peer, you earn Karma Credits. Can't find an immediate reciprocal match? Spend your Karma with any other artisan in the community.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Bottom Community Action Banner */}
        <section className="py-12">
          <div className="rounded-3xl bg-[var(--theme-primary)] text-white p-8 sm:p-12 text-center space-y-5 shadow-md relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 text-white inline-block">
                Start Learning Today
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display tracking-tight">
                Ready to trade what you know?
              </h2>
              <p className="text-sm sm:text-base text-white/85 leading-relaxed">
                Join community members exchanging skills across neighborhoods and remote sessions worldwide.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={onLaunchApp}
                    className="px-6 py-3 rounded-full bg-white text-[var(--theme-primary)] text-xs sm:text-sm font-bold shadow-xs hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>Open SwapCraft in Browser</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('signup')}
                      className="px-6 py-3 rounded-full bg-white text-[var(--theme-primary)] text-xs sm:text-sm font-bold shadow-xs hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Create Free Account (+5 Karma)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenAuth('login')}
                      className="px-5 py-3 rounded-full bg-white/15 border border-white/30 text-white text-xs sm:text-sm font-bold hover:bg-white/25 transition-all cursor-pointer"
                    >
                      <span>Log In</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Minimalist Landing Footer */}
      <footer className="border-t border-[#E2DFD8] dark:border-[var(--theme-border-dark)] py-8 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-[#7D7D76] dark:text-[#8E8D86]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--theme-primary)] rounded-lg flex items-center justify-center text-white">
              <Handshake className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[#1F1F1C] dark:text-[#FAF9F5] font-display">SwapCraft</span>
            <span className="text-[#A5A49D]">• Cashless Knowledge Network</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Community Circles</span>
            <span>•</span>
            <span>Karma Economics</span>
            <span>•</span>
            <span>Portland & Remote</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
