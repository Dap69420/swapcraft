import React from 'react';
import {
  Palette,
  UtensilsCrossed,
  Camera,
  Coffee,
  Code2,
  Sprout,
  Music,
  Sparkles,
  Mic,
  BookOpen,
  HeartHandshake,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { SkillCategory } from '../types';

interface SafeEmojiProps {
  emoji?: string;
  fallbackCategory?: SkillCategory | string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Technology: Code2,
  'Culinary Arts': UtensilsCrossed,
  'Visual Arts': Camera,
  Languages: BookOpen,
  'Wellness & Fitness': Sprout,
  'Music & Audio': Music,
  'Crafts & DIY': Layers,
  'Business & Writing': Sparkles,
  All: HeartHandshake,
};

// Map newer / multi-codepoint emojis to guaranteed universal single codepoints
const SAFE_EMOJI_MAP: Record<string, string> = {
  '🪻': '🌸',
  '🎙️': '🎤',
  '♟️': '🎯',
  '🧘‍♀️': '🧘',
  '☕': '☕',
  '🥘': '🍳',
  '📸': '📷',
  '🌿': '🌱',
};

export const SafeEmoji: React.FC<SafeEmojiProps> = ({
  emoji,
  fallbackCategory,
  className = '',
  size = 'md',
}) => {
  const safeEmoji = emoji ? (SAFE_EMOJI_MAP[emoji] || emoji) : null;
  const CategoryIcon = fallbackCategory ? (CATEGORY_ICON_MAP[fallbackCategory] || Sparkles) : null;

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
    '2xl': 'w-8 h-8',
  };

  if (!safeEmoji && CategoryIcon) {
    return <CategoryIcon className={`${iconSizes[size]} ${className}`} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center select-none font-['Noto_Color_Emoji','Apple_Color_Emoji','Segoe_UI_Emoji',sans-serif] ${sizeClasses[size]} ${className}`}
      role="img"
      aria-label="Skill icon"
    >
      {safeEmoji || '✨'}
    </span>
  );
};
