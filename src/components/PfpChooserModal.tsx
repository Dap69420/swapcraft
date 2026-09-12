import React, { useState } from 'react';
import {
  ShapePattern,
  ColorPalette,
  SHAPE_OPTIONS,
  PALETTE_COLORS,
  GeometricAvatar,
  parseAvatarString,
  serializeAvatar,
} from './GeometricAvatar';
import { X, Check, Sparkles, Shuffle } from 'lucide-react';
const fireConfetti = (opts: Record<string, unknown>) => { void import('canvas-confetti').then((m) => m.default({ particleCount: 40, disableForReducedMotion: true, ...opts })); };

interface PfpChooserModalProps {
  currentAvatar: string;
  onClose: () => void;
  onSaveAvatar: (newAvatarString: string) => void;
}

export const PfpChooserModal: React.FC<PfpChooserModalProps> = ({
  currentAvatar,
  onClose,
  onSaveAvatar,
}) => {
  const initial = parseAvatarString(currentAvatar);
  const [selectedShape, setSelectedShape] = useState<ShapePattern>(initial.shape);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(initial.palette);

  const handleRandomize = () => {
    const shapes = SHAPE_OPTIONS.map((s) => s.shape);
    const palettes = Object.keys(PALETTE_COLORS) as ColorPalette[];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)];
    setSelectedShape(randomShape);
    setSelectedPalette(randomPalette);
  };

  const handleSave = () => {
    const serialized = serializeAvatar({
      shape: selectedShape,
      palette: selectedPalette,
    });
    try {
      fireConfetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: [
          PALETTE_COLORS[selectedPalette].primary,
          PALETTE_COLORS[selectedPalette].secondary,
          '#E5D9B6',
        ],
      });
    } catch {
      // ignore
    }
    onSaveAvatar(serialized);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[var(--theme-card-dark)] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] shadow-2xl space-y-6 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[10px] font-bold uppercase tracking-wider text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
              <Sparkles className="w-3 h-3 text-[var(--theme-accent)] dark:text-[var(--theme-accent-dark)]" />
              <span>Identity & Avatar Studio</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5] mt-1">
              Customize Your Geometric PFP
            </h3>
            <p className="text-xs text-[#7D7D76] dark:text-[#8E8D86]">
              Select a modern geometric motif and artisan colorway for your SwapCraft profile.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#7D7D76] dark:text-[#8E8D86] hover:text-[#1F1F1C] dark:hover:text-white rounded-full hover:bg-[var(--theme-bg-light)]/40 dark:hover:bg-[var(--theme-bg-dark)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GeometricAvatar
              shape={selectedShape}
              palette={selectedPalette}
              size="2xl"
              className="border-2 border-white dark:border-[var(--theme-border-dark)] shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-serif text-[#1F1F1C] dark:text-[#FAF9F5]">
                  {SHAPE_OPTIONS.find((s) => s.shape === selectedShape)?.label}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-[var(--theme-card-dark)] font-semibold border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]">
                  {PALETTE_COLORS[selectedPalette].label}
                </span>
              </div>
              <p className="text-[11px] text-[#7D7D76] dark:text-[#8E8D86]">
                Vector scaled for chat, cards, circles, and peer endorsements
              </p>
              <div className="flex items-center gap-2 pt-1">
                <GeometricAvatar shape={selectedShape} palette={selectedPalette} size="sm" />
                <GeometricAvatar shape={selectedShape} palette={selectedPalette} size="md" />
                <GeometricAvatar shape={selectedShape} palette={selectedPalette} size="lg" />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            className="px-3 py-2 rounded-xl bg-white dark:bg-[var(--theme-card-dark)] border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] hover:bg-[var(--theme-bg-light)]/60 dark:hover:bg-[var(--theme-bg-dark)] transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-95"
            title="Randomize Shape & Palette"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
        </div>

        {/* 1. Shape Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block">
            1. Select Geometric Motif
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SHAPE_OPTIONS.map((item) => {
              const isSelected = selectedShape === item.shape;
              return (
                <button
                  type="button"
                  key={item.shape}
                  onClick={() => setSelectedShape(item.shape)}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--theme-primary)]/15 border-[var(--theme-primary)] shadow-xs'
                      : 'bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:bg-white dark:hover:bg-[var(--theme-card-dark)]'
                  }`}
                >
                  <GeometricAvatar
                    shape={item.shape}
                    palette={selectedPalette}
                    size="sm"
                    className="pointer-events-none"
                  />
                  <span
                    className={`text-[11px] font-medium truncate w-full ${
                      isSelected
                        ? 'font-bold text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)]'
                        : 'text-[#52524D] dark:text-[#C5C4BE]'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Palette Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1F1F1C] dark:text-[#FAF9F5] block">
            2. Select Natural Colorway
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(PALETTE_COLORS) as ColorPalette[]).map((paletteKey) => {
              const info = PALETTE_COLORS[paletteKey];
              const isSelected = selectedPalette === paletteKey;
              return (
                <button
                  type="button"
                  key={paletteKey}
                  onClick={() => setSelectedPalette(paletteKey)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--theme-primary)]/15 border-[var(--theme-primary)] shadow-xs'
                      : 'bg-[var(--theme-bg-light)]/60 dark:bg-[var(--theme-bg-dark)] border-[#EAE7E1] dark:border-[var(--theme-border-dark)] hover:bg-white dark:hover:bg-[var(--theme-card-dark)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white dark:border-[var(--theme-card-dark)]"
                        style={{ backgroundColor: info.primary }}
                      />
                      <span
                        className="w-4 h-4 rounded-full border border-white dark:border-[var(--theme-card-dark)]"
                        style={{ backgroundColor: info.secondary }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1F1F1C] dark:text-[#FAF9F5] truncate">
                      {info.label}
                    </span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-[var(--theme-primary)] dark:text-[var(--theme-primary-dark)] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE7E1] dark:border-[var(--theme-border-dark)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#EAE7E1] dark:border-[var(--theme-border-dark)] text-xs font-semibold text-[#52524D] dark:text-[#C5C4BE] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[var(--theme-primary)] text-white text-xs font-bold hover:opacity-95 shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
