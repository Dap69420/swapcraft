import React from 'react';

export type ShapePattern =
  | 'arch'
  | 'rings'
  | 'sun'
  | 'prism'
  | 'mosaic'
  | 'zen'
  | 'star'
  | 'waves'
  | 'duo'
  | 'flower';

export type ColorPalette =
  | 'sage'
  | 'terracotta'
  | 'ochre'
  | 'indigo'
  | 'sand'
  | 'forest'
  | 'amber'
  | 'plum';

export interface AvatarConfig {
  shape: ShapePattern;
  palette: ColorPalette;
}

export const PALETTE_COLORS: Record<
  ColorPalette,
  { bg: string; primary: string; secondary: string; accent: string; label: string }
> = {
  sage: {
    bg: '#EAF0EA',
    primary: '#5B6D5B',
    secondary: '#85A885',
    accent: '#2F3E2F',
    label: 'Sage Garden',
  },
  terracotta: {
    bg: '#FDF1E8',
    primary: '#C68B59',
    secondary: '#E0A775',
    accent: '#6E401F',
    label: 'Warm Clay',
  },
  ochre: {
    bg: '#FAF3E3',
    primary: '#D4A373',
    secondary: '#E8C39E',
    accent: '#5E4324',
    label: 'Golden Ochre',
  },
  indigo: {
    bg: '#EDF2F7',
    primary: '#4A5D6E',
    secondary: '#7A95AA',
    accent: '#26333D',
    label: 'Nordic Indigo',
  },
  sand: {
    bg: '#F5F2EC',
    primary: '#9C8F79',
    secondary: '#C4B9A5',
    accent: '#473E30',
    label: 'Dune Sand',
  },
  forest: {
    bg: '#E9F2EC',
    primary: '#3D5A45',
    secondary: '#6E9B7B',
    accent: '#1D3023',
    label: 'Deep Pine',
  },
  amber: {
    bg: '#FAF0E6',
    primary: '#B87333',
    secondary: '#D99B66',
    accent: '#572E0C',
    label: 'Sunset Amber',
  },
  plum: {
    bg: '#F4EDF5',
    primary: '#6B4E71',
    secondary: '#9C79A4',
    accent: '#39223D',
    label: 'Mulberry Plum',
  },
};

export const SHAPE_OPTIONS: { shape: ShapePattern; label: string }[] = [
  { shape: 'arch', label: 'Arch & Sphere' },
  { shape: 'rings', label: 'Concentric Rings' },
  { shape: 'sun', label: 'Radiant Sun' },
  { shape: 'mosaic', label: 'Bauhaus Mosaic' },
  { shape: 'prism', label: 'Prism Geometry' },
  { shape: 'zen', label: 'Zen Pebbles' },
  { shape: 'star', label: 'Craft Star' },
  { shape: 'waves', label: 'Organic Waves' },
  { shape: 'duo', label: 'Dual Orbit' },
  { shape: 'flower', label: 'Botanical Bloom' },
];

export const parseAvatarString = (avatarStr: string | undefined): AvatarConfig => {
  if (!avatarStr || !avatarStr.startsWith('shape:')) {
    // Generate deterministic hash from string or default to arch:sage
    const defaultPalettes: ColorPalette[] = ['sage', 'terracotta', 'ochre', 'indigo', 'sand', 'forest', 'amber', 'plum'];
    const defaultShapes: ShapePattern[] = ['arch', 'rings', 'sun', 'mosaic', 'prism', 'zen', 'star', 'waves', 'duo', 'flower'];
    
    if (!avatarStr) return { shape: 'arch', palette: 'sage' };
    
    let hash = 0;
    for (let i = 0; i < avatarStr.length; i++) {
      hash = avatarStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);
    return {
      shape: defaultShapes[absHash % defaultShapes.length],
      palette: defaultPalettes[(absHash >> 3) % defaultPalettes.length],
    };
  }

  const parts = avatarStr.split(':');
  const shape = (parts[1] as ShapePattern) || 'arch';
  const palette = (parts[2] as ColorPalette) || 'sage';

  return {
    shape: SHAPE_OPTIONS.some((s) => s.shape === shape) ? shape : 'arch',
    palette: PALETTE_COLORS[palette] ? palette : 'sage',
  };
};

export const serializeAvatar = (config: AvatarConfig): string => {
  return `shape:${config.shape}:${config.palette}`;
};

interface GeometricAvatarProps {
  avatar?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  shape?: ShapePattern;
  palette?: ColorPalette;
}

const SIZE_CLASSES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

export const GeometricAvatar: React.FC<GeometricAvatarProps> = ({
  avatar,
  name,
  size = 'md',
  className = '',
  shape: customShape,
  palette: customPalette,
}) => {
  const parsed = parseAvatarString(avatar || name);
  const shape = customShape || parsed.shape;
  const palette = customPalette || parsed.palette;
  const colors = PALETTE_COLORS[palette] || PALETTE_COLORS.sage;

  const renderShape = () => {
    switch (shape) {
      case 'arch':
        return (
          <>
            <path
              d="M10 54 C10 30, 54 30, 54 54 Z"
              fill={colors.primary}
            />
            <circle cx="32" cy="22" r="11" fill={colors.secondary} />
            <circle cx="48" cy="18" r="4" fill={colors.accent} />
          </>
        );

      case 'rings':
        return (
          <>
            <circle cx="32" cy="32" r="26" fill="none" stroke={colors.secondary} strokeWidth="6" opacity="0.5" />
            <circle cx="32" cy="32" r="17" fill="none" stroke={colors.primary} strokeWidth="6" />
            <circle cx="32" cy="32" r="8" fill={colors.accent} />
          </>
        );

      case 'sun':
        return (
          <>
            <circle cx="32" cy="32" r="14" fill={colors.primary} />
            <path
              d="M32 6 L32 14 M32 50 L32 58 M6 32 L14 32 M50 32 L58 32 M13.6 13.6 L19.3 19.3 M44.7 44.7 L50.4 50.4 M13.6 50.4 L19.3 44.7 M44.7 19.3 L50.4 13.6"
              stroke={colors.secondary}
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="6" fill={colors.bg} />
          </>
        );

      case 'mosaic':
        return (
          <>
            <rect x="8" y="8" width="22" height="22" rx="4" fill={colors.primary} />
            <path d="M34 8 H56 V30 C44 30, 34 20, 34 8 Z" fill={colors.secondary} />
            <circle cx="20" cy="44" r="10" fill={colors.accent} />
            <rect x="34" y="34" width="22" height="22" rx="11" fill={colors.primary} />
          </>
        );

      case 'prism':
        return (
          <>
            <polygon points="32,8 56,22 32,36 8,22" fill={colors.secondary} />
            <polygon points="8,22 32,36 32,56 8,42" fill={colors.primary} />
            <polygon points="56,22 32,36 32,56 56,42" fill={colors.accent} />
          </>
        );

      case 'zen':
        return (
          <>
            <ellipse cx="32" cy="48" rx="22" ry="8" fill={colors.primary} />
            <ellipse cx="32" cy="34" rx="16" ry="7" fill={colors.secondary} />
            <ellipse cx="32" cy="21" rx="10" ry="6" fill={colors.accent} />
            <circle cx="32" cy="11" r="3.5" fill={colors.primary} />
          </>
        );

      case 'star':
        return (
          <>
            <polygon
              points="32,6 38,22 54,22 41,33 46,50 32,40 18,50 23,33 10,22 26,22"
              fill={colors.primary}
            />
            <circle cx="32" cy="31" r="7" fill={colors.bg} />
            <circle cx="32" cy="31" r="3" fill={colors.accent} />
          </>
        );

      case 'waves':
        return (
          <>
            <path
              d="M6 20 C18 10, 26 30, 38 20 C50 10, 58 24, 58 24"
              fill="none"
              stroke={colors.primary}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M6 34 C18 24, 26 44, 38 34 C50 24, 58 38, 58 38"
              fill="none"
              stroke={colors.secondary}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M6 48 C18 38, 26 58, 38 48 C50 38, 58 52, 58 52"
              fill="none"
              stroke={colors.accent}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        );

      case 'duo':
        return (
          <>
            <circle cx="24" cy="32" r="16" fill={colors.primary} opacity="0.85" />
            <circle cx="40" cy="32" r="16" fill={colors.secondary} opacity="0.85" />
            <circle cx="32" cy="32" r="6" fill={colors.accent} />
          </>
        );

      case 'flower':
      default:
        return (
          <>
            <circle cx="32" cy="20" r="9" fill={colors.secondary} />
            <circle cx="44" cy="32" r="9" fill={colors.primary} />
            <circle cx="32" cy="44" r="9" fill={colors.secondary} />
            <circle cx="20" cy="32" r="9" fill={colors.primary} />
            <circle cx="32" cy="32" r="7" fill={colors.accent} />
          </>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden shrink-0 select-none shadow-2xs border border-black/5 dark:border-white/10 transition-transform ${SIZE_CLASSES[size]} ${className}`}
      style={{ backgroundColor: colors.bg }}
      title={name || 'User Avatar'}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full p-1 sm:p-1.5"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderShape()}
      </svg>
    </div>
  );
};
