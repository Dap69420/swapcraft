import React from 'react';
import { SkillCategory, SwapFormat, ExperienceLevel, UserProfile } from '../types';
import { RotateCcw, Award } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { GeometricAvatar } from './GeometricAvatar';

interface SidebarFiltersProps {
  categories: SkillCategory[];
  selectedCategory: SkillCategory;
  onSelectCategory: (category: SkillCategory) => void;
  categoryCounts: Record<string, number>;
  selectedFormat: SwapFormat | 'All';
  onSelectFormat: (format: SwapFormat | 'All') => void;
  selectedLevel: ExperienceLevel | 'All';
  onSelectLevel: (level: ExperienceLevel | 'All') => void;
  onlySaved: boolean;
  onToggleOnlySaved?: () => void;
  onToggleSaved?: () => void;
  onResetFilters: () => void;
  hasActiveFilters?: boolean;
  topSwapper?: UserProfile;
  onViewSwapper?: (user: UserProfile) => void;
}

export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  selectedFormat,
  onSelectFormat,
  selectedLevel,
  onSelectLevel,
  onlySaved,
  onToggleOnlySaved,
  onToggleSaved,
  onResetFilters,
  hasActiveFilters = false,
  topSwapper,
  onViewSwapper,
}) => {
  const handleToggle = onToggleOnlySaved || onToggleSaved || (() => {});
  const activeSwapper = topSwapper;

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-5">
      {/* Category List */}
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] p-4 shadow-2xs transition-colors">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7D7D76] dark:text-[#8E8D86]">
            Categories
          </h3>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:opacity-80 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-0.5">
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--theme-primary)]/10 dark:bg-[var(--theme-primary)]/20 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] font-bold border border-[var(--theme-primary)]/25'
                    : 'text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[#1F1F1C] dark:hover:text-white'
                }`}
              >
                <span className="truncate text-left">{cat === 'All' ? 'All Categories' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isSelected
                      ? 'bg-white dark:bg-[var(--theme-bg-dark)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shadow-2xs font-bold'
                      : 'bg-black/5 dark:bg-white/5 text-[#7D7D76] dark:text-[#8E8D86]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Format & Experience Filter */}
      <div className="bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] p-4 shadow-2xs space-y-3.5 transition-colors">
        <div>
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#7D7D76] dark:text-[#8E8D86] mb-2">
            Format
          </h4>
          <div className="grid grid-cols-2 gap-1.5">
            {(['All', 'In-Person', 'Online', 'Flexible'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onSelectFormat(fmt)}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                  selectedFormat === fmt
                    ? 'bg-[var(--theme-primary)] text-white border-[var(--theme-primary)] font-bold shadow-2xs'
                    : 'bg-black/5 dark:bg-white/5 text-[#52524D] dark:text-[#C5C4BE] border-transparent hover:border-[#E2DFD8] dark:hover:border-[var(--theme-border-dark)]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <CustomSelect
            label="Skill Level"
            value={selectedLevel}
            onChange={(val) => onSelectLevel(val as any)}
            options={[
              { value: 'All', label: 'All Experience Levels' },
              { value: 'Beginner Friendly', label: 'Beginner Friendly' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />
        </div>

        <div className="pt-2 border-t border-[#E2DFD8] dark:border-[var(--theme-border-dark)]">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#3D3D38] dark:text-[#D8D7D0]">
            <input
              type="checkbox"
              checked={onlySaved}
              onChange={handleToggle}
              className="w-3.5 h-3.5 text-[var(--theme-primary)] rounded border-[#E2DFD8] dark:border-[var(--theme-border-dark)] focus:ring-[var(--theme-primary)]"
            />
            <span>Saved wishlist only</span>
          </label>
        </div>
      </div>

      {/* Top Swapper Spotlight */}
      {activeSwapper && (
        <div className="p-4 bg-white dark:bg-[var(--theme-card-dark)] rounded-2xl border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] relative overflow-hidden transition-colors shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Artisan Spotlight
            </span>
            <span className="text-[10px] font-mono bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] px-1.5 py-0.5 rounded font-semibold">
              {activeSwapper?.completedSwaps ?? 26} Swaps
            </span>
          </div>

          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="shrink-0">
              <GeometricAvatar avatar={activeSwapper?.avatar} name={activeSwapper?.name || 'Swapper'} size="sm" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#1F1F1C] dark:text-[#FAF9F5] truncate">
                {activeSwapper?.name}
              </p>
              <p className="text-[10px] text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)] truncate">
                {activeSwapper?.tagline}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#52524D] dark:text-[#C5C4BE] line-clamp-2 mb-2.5">
            "{activeSwapper?.bio}"
          </p>

          {onViewSwapper && (
            <button
              onClick={() => onViewSwapper(activeSwapper)}
              className="w-full py-1.5 bg-[#FAF9F6] dark:bg-[var(--theme-bg-dark)] text-[#1F1F1C] dark:text-[#FAF9F5] text-xs font-bold rounded-lg border border-[#E2DFD8] dark:border-[var(--theme-border-dark)] hover:border-[var(--theme-primary)] transition-colors cursor-pointer"
            >
              View Artisan Profile
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
