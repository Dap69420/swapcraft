import React from 'react';
import { ColorThemeId, COLOR_THEMES } from '../data/themes';
import { Sun, Moon, Check, Palette, Sparkles, X } from 'lucide-react';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (themeId: ColorThemeId) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  isDarkMode,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Popover / Modal */}
      <div className="fixed top-16 right-4 sm:right-8 z-50 w-80 sm:w-96 bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] shadow-2xl p-5 text-[#20201D] dark:text-[#F5F5F0] animate-in fade-in slide-in-from-top-3 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-serif leading-tight">Artisanal Color Themes</h3>
              <p className="text-[11px] text-[#52524D] dark:text-[#A8A7A0]">
                Choose your palette & atmosphere
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#6B6A64] hover:text-[#20201D] dark:hover:text-white hover:bg-[#F3F2EE] dark:hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close theme selector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Toggle (Light / Dark) */}
        <div className="my-4 p-3 rounded-2xl bg-[#F6F5F0] dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE]">
            Appearance Mode
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-[var(--theme-card-dark)] p-1 rounded-xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)]">
            <button
              onClick={() => {
                if (isDarkMode) onToggleDarkMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isDarkMode
                  ? 'bg-[#FAF9F6] text-[#20201D] shadow-xs border border-[#E2DFD8]'
                  : 'text-[#6B6A64] hover:text-[#20201D]'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-[#E5A84B]" />
              <span>Light</span>
            </button>
            <button
              onClick={() => {
                if (!isDarkMode) onToggleDarkMode();
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-[var(--theme-primary)] text-white shadow-xs'
                  : 'text-[#6B6A64] hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-white" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Palettes List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6A64] dark:text-[#8E8D86] px-1">
            Artisanal Palettes
          </span>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(COLOR_THEMES) as ColorThemeId[]).map((themeKey) => {
              const theme = COLOR_THEMES[themeKey];
              const isSelected = currentTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    onSelectTheme(themeKey);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/15 shadow-xs ring-1 ring-[var(--theme-primary)]'
                      : 'border-[#EAE7E1] dark:border-[var(--theme-border-dark)] bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] hover:border-[var(--theme-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Swatch preview with 2 colors */}
                    <div className="flex items-center -space-x-1.5 shrink-0">
                      <span
                        className="w-5 h-5 rounded-full border-2 border-white dark:border-[var(--theme-card-dark)] shadow-xs"
                        style={{ backgroundColor: isDarkMode ? theme.primaryDark : theme.primaryLight }}
                      />
                      <span
                        className="w-5 h-5 rounded-full border-2 border-white dark:border-[var(--theme-card-dark)] shadow-xs"
                        style={{ backgroundColor: isDarkMode ? theme.accentDark : theme.accentLight }}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate text-[#20201D] dark:text-[#F5F5F0]">
                          {theme.emoji} {theme.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] px-1.5 py-[3px] rounded font-bold bg-[var(--theme-primary)] text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#52524D] dark:text-[#A8A7A0] truncate">
                        {theme.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[var(--theme-primary)] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-center">
          <p className="text-[11px] text-[#6B6A64] dark:text-[#8E8D86]">
            Themes adjust colors, card elevation shadows, and accent glows throughout the app.
          </p>
        </div>
      </div>
    </>
  );
};
