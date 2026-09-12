export type ColorThemeId = 'sage' | 'terracotta' | 'indigo' | 'amber' | 'amethyst';

export const DEFAULT_THEME_ID: ColorThemeId = 'sage';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  subtitle: string;
  emoji: string;
  primaryLight: string;
  primaryDark: string;
  accentLight: string;
  accentDark: string;
  bgLight: string;
  bgDark: string;
  cardDark: string;
  borderDark: string;
  glow: string;
  dotColor: string;
}

export const COLOR_THEMES: Record<ColorThemeId, ColorTheme> = {
  sage: {
    id: 'sage',
    name: 'Botanical Sage',
    subtitle: 'Earthy Forest & Moss',
    emoji: '🌿',
    primaryLight: '#4A654E',
    primaryDark: '#7CA380',
    accentLight: '#C68B59',
    accentDark: '#E0A775',
    bgLight: '#FAF9F6',
    bgDark: '#141614',
    cardDark: '#1E231F',
    borderDark: '#2F3831',
    glow: 'rgba(124, 163, 128, 0.15)',
    dotColor: '#10B981',
  },
  terracotta: {
    id: 'terracotta',
    name: 'Warm Terracotta',
    subtitle: 'Clay, Brick & Sunbaked Earth',
    emoji: '🏺',
    primaryLight: '#B85D3B',
    primaryDark: '#E07A5F',
    accentLight: '#D4A373',
    accentDark: '#E8C29D',
    bgLight: '#FAF7F5',
    bgDark: '#181412',
    cardDark: '#261F1B',
    borderDark: '#3D2F29',
    glow: 'rgba(224, 122, 95, 0.15)',
    dotColor: '#F97316',
  },
  indigo: {
    id: 'indigo',
    name: 'Nordic Indigo',
    subtitle: 'Deep Studio Ocean & Slate',
    emoji: '🌌',
    primaryLight: '#385A7C',
    primaryDark: '#6D9BC3',
    accentLight: '#DDA15E',
    accentDark: '#F4A261',
    bgLight: '#F7F9FB',
    bgDark: '#12161D',
    cardDark: '#1C232E',
    borderDark: '#2B3849',
    glow: 'rgba(109, 155, 195, 0.15)',
    dotColor: '#38BDF8',
  },
  amber: {
    id: 'amber',
    name: 'Golden Ochre',
    subtitle: 'Sunlit Workshop & Woodcraft',
    emoji: '🌻',
    primaryLight: '#9C6819',
    primaryDark: '#DE9F3E',
    accentLight: '#52796F',
    accentDark: '#84A98C',
    bgLight: '#FAF8F2',
    bgDark: '#181510',
    cardDark: '#282319',
    borderDark: '#403624',
    glow: 'rgba(222, 159, 62, 0.15)',
    dotColor: '#EAB308',
  },
  amethyst: {
    id: 'amethyst',
    name: 'Heather Plum',
    subtitle: 'Textile Fiber & Wild Flora',
    emoji: '🌸',
    primaryLight: '#7A527A',
    primaryDark: '#B488B4',
    accentLight: '#D08C5D',
    accentDark: '#E6A87C',
    bgLight: '#FAF7FA',
    bgDark: '#171318',
    cardDark: '#261E27',
    borderDark: '#3F3041',
    glow: 'rgba(180, 136, 180, 0.15)',
    dotColor: '#C084FC',
  },
};
