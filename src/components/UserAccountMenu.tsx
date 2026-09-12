import React, { useEffect, useRef } from 'react';
import {
  User,
  Layers,
  Repeat,
  Coins,
  Moon,
  Sun,
  Palette,
  LogOut,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { GeometricAvatar } from './GeometricAvatar';
import { NavTab } from './Navbar';

interface UserAccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  myPostsCount?: number;
  pendingCount: number;
  onNavigate: (tab: NavTab) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenThemeSelector: () => void;
  onSignOut?: () => void;
}

export const UserAccountMenu: React.FC<UserAccountMenuProps> = ({
  isOpen,
  onClose,
  currentUser,
  myPostsCount = 0,
  pendingCount,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  onOpenThemeSelector,
  onSignOut,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-3xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-xl p-3 z-50 text-[#1F1F1C] dark:text-[#FAF9F5] animate-in fade-in slide-in-from-top-2 duration-150"
      role="menu"
      aria-orientation="vertical"
    >
      {/* User Header Summary */}
      <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F8F7F4] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
        <GeometricAvatar avatar={currentUser.avatar} name={currentUser.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold truncate text-[#1F1F1C] dark:text-[#FAF9F5]">
              {currentUser.name}
            </h4>
            <span className="shrink-0 text-[10px] font-mono px-1.5 py-[3px] rounded bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold">
              Lv. 3
            </span>
          </div>
          <p className="text-xs text-[#6B6A64] dark:text-[#A8A7A0] truncate">
            {currentUser.bio || 'Craft & Skill Swapper'}
          </p>
        </div>
      </div>

      {/* Karma Balance Micro-Card */}
      <div className="mt-2 p-2.5 rounded-2xl bg-[var(--theme-accent)]/10 dark:bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]">
            <Coins className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-extrabold font-mono text-[#1F1F1C] dark:text-[#FAF9F5]">
                {currentUser.credits}
              </span>
              <span className="text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE]">Karma</span>
            </div>
            <p className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">Timebank exchange balance</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onNavigate('credits');
            onClose();
          }}
          className="text-xs font-bold text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Ledger</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation Options */}
      <div className="mt-2.5 space-y-0.5 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] pt-2">
        {/* My Posts & Circles */}
        <button
          type="button"
          onClick={() => {
            onNavigate('my-posts');
            onClose();
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[#F3F2EE] dark:hover:bg-white/10 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] group-hover:scale-105 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-[#1F1F1C] dark:text-[#FAF9F5]">
                My Posts & Circles
              </span>
              <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                Manage skills & workshops
              </span>
            </div>
          </div>
          {myPostsCount > 0 ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-primary)] text-white">
              {myPostsCount}
            </span>
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A7A0] group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>

        {/* My Swaps */}
        <button
          type="button"
          onClick={() => {
            onNavigate('my-swaps');
            onClose();
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[#F3F2EE] dark:hover:bg-white/10 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-[#52524D] dark:text-[#C5C4BE] group-hover:scale-105 transition-transform">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-[#1F1F1C] dark:text-[#FAF9F5]">
                My Swaps
              </span>
              <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                Active & pending exchanges
              </span>
            </div>
          </div>
          {pendingCount > 0 ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--theme-accent)] text-white">
              {pendingCount}
            </span>
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-[#A8A7A0] group-hover:translate-x-0.5 transition-transform" />
          )}
        </button>

        {/* Public Profile */}
        <button
          type="button"
          onClick={() => {
            onNavigate('profile');
            onClose();
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[#F3F2EE] dark:hover:bg-white/10 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-[#52524D] dark:text-[#C5C4BE] group-hover:scale-105 transition-transform">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-[#1F1F1C] dark:text-[#FAF9F5]">
                My Profile
              </span>
              <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                Avatar, bio & ratings
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A7A0] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Appearance & Themes */}
      <div className="mt-2.5 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] pt-2 space-y-1">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F3F2EE] dark:hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-[#52524D] dark:text-[#C5C4BE]">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[var(--theme-accent)]" />
              ) : (
                <Moon className="w-4 h-4 text-[#52524D]" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] block">
                Dark Mode
              </span>
              <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                {isDarkMode ? 'Night theme active' : 'Daylight theme active'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleDarkMode}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
              isDarkMode ? 'bg-[var(--theme-primary)] justify-end' : 'bg-[#DCDAD2] justify-start'
            }`}
            aria-label="Toggle dark mode"
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Color Palette Modal Opener */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onOpenThemeSelector();
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-[#F3F2EE] dark:hover:bg-white/10 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-[#52524D] dark:text-[#C5C4BE] group-hover:scale-105 transition-transform">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold block text-[#1F1F1C] dark:text-[#FAF9F5]">
                Color Palettes
              </span>
              <span className="text-[10px] text-[#7D7D76] dark:text-[#8E8D86]">
                Sage, Ochre, Terracotta, Indigo...
              </span>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#A8A7A0] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Sign Out Option */}
      {onSignOut && (
        <div className="mt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSignOut();
            }}
            className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-[#C04A3E] hover:bg-[#C04A3E]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out / Switch Demo User</span>
          </button>
        </div>
      )}
    </div>
  );
};
