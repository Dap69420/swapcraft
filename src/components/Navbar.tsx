import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Sparkles,
  MessageSquare,
  Repeat,
  Users,
  Compass,
  Handshake,
  Coins,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { UserProfile, AppNotification } from '../types';
import { GeometricAvatar } from './GeometricAvatar';
import { ColorThemeId } from '../data/themes';
import { ThemeSelector } from './ThemeSelector';
import { NotificationsPopover } from './NotificationsPopover';
import { UserAccountMenu } from './UserAccountMenu';

export type NavTab =
  | 'discover'
  | 'matchmaker'
  | 'community'
  | 'my-posts'
  | 'messages'
  | 'my-swaps'
  | 'credits'
  | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  pendingCount: number;
  unreadCount: number;
  myPostsCount?: number;
  notifications: AppNotification[];
  onMarkNotifAsRead: (id: string) => void;
  onMarkAllNotifsAsRead: () => void;
  onClearNotifs: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (themeId: ColorThemeId) => void;
  onPostSkillClick: () => void;
  onProfileClick: () => void;
  onOpenAuthModal: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  pendingCount,
  unreadCount,
  myPostsCount = 0,
  notifications,
  onMarkNotifAsRead,
  onMarkAllNotifsAsRead,
  onClearNotifs,
  isDarkMode,
  onToggleDarkMode,
  currentTheme,
  onSelectTheme,
  onPostSkillClick,
  onProfileClick: _onProfileClick,
  onOpenAuthModal: _onOpenAuthModal,
  onSignOut,
}) => {
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const navItems = [
    { id: 'discover' as NavTab, label: 'Discover', icon: Compass },
    {
      id: 'matchmaker' as NavTab,
      label: 'Matchmaker',
      icon: Sparkles,
      iconClass: 'text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]',
    },
    { id: 'community' as NavTab, label: 'Circles', icon: Users },
    { id: 'my-swaps' as NavTab, label: 'My Swaps', icon: Repeat, badge: pendingCount },
    { id: 'messages' as NavTab, label: 'Messages', icon: MessageSquare, badge: unreadCount },
  ];

  return (
    <header className="sticky top-2 sm:top-3 z-40 max-w-7xl mx-auto px-3 sm:px-6 transition-colors">
      <div className="rounded-2xl sm:rounded-full bg-white/90 dark:bg-[var(--theme-card-dark)]/90 backdrop-blur-md border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-sm flex items-center justify-between gap-3 relative">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('discover')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] rounded-xl p-1 shrink-0 cursor-pointer"
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

        {/* Primary nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 lg:gap-1.5 text-sm font-medium min-w-0 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActiveTab(item.id)}
                className={`relative isolate px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold'
                    : 'text-[#52524D] dark:text-[#C5C4BE] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 z-0 rounded-full bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 border border-[var(--theme-primary)]/30 shadow-2xs"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2"><Icon className={`w-4 h-4 ${item.iconClass || ''}`} />
                <span>{item.label}</span></span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="relative z-10 px-1.5 py-[3px] text-[10px] bg-[var(--theme-primary)] text-white rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-primary)] dark:bg-[var(--theme-primary-dark)] animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Post Skill CTA Button */}
          <button
            type="button"
            onClick={onPostSkillClick}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold bg-[var(--theme-primary)] text-white rounded-xl sm:rounded-full hover:opacity-90 transition-all shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Skill</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Notifications Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setIsUserMenuOpen(false);
              setIsNotificationsOpen((prev) => !prev);
            }}
            aria-label="View notifications"
            title="Notifications"
            className="relative p-1.5 sm:p-2 rounded-full text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[var(--theme-accent)] border-2 border-white dark:border-[var(--theme-bg-dark)]" />
            )}
          </button>

          {/* Unified Account & Profile Pill Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen(false);
                setIsUserMenuOpen((prev) => !prev);
              }}
              aria-expanded={isUserMenuOpen}
              aria-label="Account and user settings menu"
              title={`${currentUser.name} • ${currentUser.credits} Karma Credits`}
              className={`flex items-center gap-1.5 sm:gap-2 pl-2.5 pr-2 py-1 sm:py-1.5 rounded-full border transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)] ${
                isUserMenuOpen ||
                activeTab === 'profile' ||
                activeTab === 'credits' ||
                activeTab === 'my-posts'
                  ? 'bg-white dark:bg-[var(--theme-card-dark)] border-[var(--theme-primary)]/50 shadow-xs'
                  : 'bg-[#F3F2EE]/90 dark:bg-[var(--theme-bg-dark)]/90 hover:bg-[#EAE7E1] dark:hover:bg-white/10 border-[#E2DFD8] dark:border-[var(--theme-border-dark)]'
              }`}
            >
              <div className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] shrink-0" />
                <span className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] font-mono">
                  {currentUser.credits}
                </span>
              </div>
              <span className="w-px h-3.5 bg-[#DCDAD2] dark:bg-[var(--theme-border-dark)]" />
              <GeometricAvatar avatar={currentUser.avatar} name={currentUser.name} size="xs" />
              <ChevronDown
                className={`w-3 h-3 text-[#7D7D76] dark:text-[#A8A7A0] transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180 text-[var(--theme-primary)]' : ''
                }`}
              />
            </button>

            {/* User Account Popover Dropdown */}
            <UserAccountMenu
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
              currentUser={currentUser}
              myPostsCount={myPostsCount}
              pendingCount={pendingCount}
              onNavigate={(tab) => setActiveTab(tab)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={onToggleDarkMode}
              onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
              onSignOut={onSignOut}
            />
          </div>
        </div>

        {/* Notifications Popover Component */}
        <NotificationsPopover
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAsRead={onMarkNotifAsRead}
          onMarkAllAsRead={onMarkAllNotifsAsRead}
          onClearAll={onClearNotifs}
          onNavigateAction={(tab) => {
            setActiveTab(tab as NavTab);
          }}
        />
      </div>

      {/* Theme Selector Popover */}
      <ThemeSelector
        isOpen={isThemeSelectorOpen}
        onClose={() => setIsThemeSelectorOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={onSelectTheme}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />

      {/* Mobile nav */}
      <div className="md:hidden mt-2 rounded-2xl bg-white/95 dark:bg-[var(--theme-card-dark)]/95 backdrop-blur-md border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] px-3 py-1.5 shadow-sm flex items-center justify-around">
        <button
          type="button"
          aria-current={activeTab === 'discover' ? 'page' : undefined}
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center min-h-[44px] justify-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'discover'
              ? 'text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold'
              : 'text-[#5A5953] dark:text-[#C5C4BE]'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Discover</span>
        </button>
        <button
          type="button"
          aria-current={activeTab === 'matchmaker' ? 'page' : undefined}
          onClick={() => setActiveTab('matchmaker')}
          className={`flex flex-col items-center min-h-[44px] justify-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'matchmaker'
              ? 'text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold'
              : 'text-[#5A5953] dark:text-[#C5C4BE]'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
          <span>Match</span>
        </button>
        <button
          type="button"
          aria-current={activeTab === 'community' ? 'page' : undefined}
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center min-h-[44px] justify-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'community'
              ? 'text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold'
              : 'text-[#5A5953] dark:text-[#C5C4BE]'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span>Circles</span>
        </button>
        <button
          type="button"
          aria-current={activeTab === 'my-swaps' ? 'page' : undefined}
          onClick={() => setActiveTab('my-swaps')}
          className={`flex flex-col items-center min-h-[44px] justify-center py-1 px-2 text-[10px] font-medium relative ${
            activeTab === 'my-swaps'
              ? 'text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold'
              : 'text-[#5A5953] dark:text-[#C5C4BE]'
          }`}
        >
          <Repeat className="w-4 h-4 mb-0.5" />
          <span>Swaps</span>
          {pendingCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-[var(--theme-primary)] rounded-full"></span>
          )}
        </button>
        <button
          type="button"
          aria-current={activeTab === 'messages' ? 'page' : undefined}
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center min-h-[44px] justify-center py-1 px-2 text-[10px] font-medium relative ${
            activeTab === 'messages'
              ? 'text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold'
              : 'text-[#5A5953] dark:text-[#C5C4BE]'
          }`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>Inbox</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 bg-[var(--theme-accent)] rounded-full"></span>
          )}
        </button>
      </div>
    </header>
  );
};

