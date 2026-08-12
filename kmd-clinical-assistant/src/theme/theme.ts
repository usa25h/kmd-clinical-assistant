import { useColorScheme } from 'react-native';

export const palette = {
  // Neutrals
  neutral0: '#ffffff',
  neutral50: '#f8f9fa',
  neutral100: '#f1f3f5',
  neutral200: '#e9ecef',
  neutral300: '#dee2e6',
  neutral400: '#ced4da',
  neutral500: '#adb5bd',
  neutral600: '#868e96',
  neutral700: '#495057',
  neutral800: '#343a40',
  neutral900: '#212529',
  neutral950: '#0d0f10',

  // Accent – blue
  accent50: '#e7f0fd',
  accent100: '#c5d9fb',
  accent200: '#8eb5f7',
  accent500: '#3b82f6',
  accent600: '#2563eb',
  accent700: '#1d4ed8',

  // Danger – red
  danger50: '#fff0f0',
  danger100: '#ffe0e0',
  danger500: '#ef4444',
  danger600: '#dc2626',
  danger700: '#b91c1c',

  // Warning – amber
  warning50: '#fffbeb',
  warning100: '#fef3c7',
  warning500: '#f59e0b',
  warning600: '#d97706',
  warning700: '#b45309',

  // Success – green
  success50: '#f0fdf4',
  success100: '#dcfce7',
  success500: '#22c55e',
  success600: '#16a34a',
  success700: '#15803d',
} as const;

export interface ColorTokens {
  // Surfaces (layered background)
  surface0: string; // page background
  surface1: string; // card / sheet
  surface2: string; // elevated overlay

  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Borders
  border: string;
  borderStrong: string;

  // Role colors – fills
  accentFill: string;
  accentText: string;
  dangerFill: string;
  dangerText: string;
  warningFill: string;
  warningText: string;
  successFill: string;
  successText: string;

  // Role colors – subtle backgrounds
  accentSubtle: string;
  dangerSubtle: string;
  warningSubtle: string;
  successSubtle: string;
}

export const lightTokens: ColorTokens = {
  surface0: palette.neutral0,
  surface1: palette.neutral50,
  surface2: palette.neutral100,

  textPrimary: palette.neutral900,
  textSecondary: palette.neutral700,
  textMuted: palette.neutral500,

  border: palette.neutral200,
  borderStrong: palette.neutral400,

  accentFill: palette.accent600,
  accentText: palette.neutral0,
  dangerFill: palette.danger600,
  dangerText: palette.neutral0,
  warningFill: palette.warning500,
  warningText: palette.neutral900,
  successFill: palette.success600,
  successText: palette.neutral0,

  accentSubtle: palette.accent50,
  dangerSubtle: palette.danger50,
  warningSubtle: palette.warning50,
  successSubtle: palette.success50,
};

export const darkTokens: ColorTokens = {
  surface0: palette.neutral950,
  surface1: palette.neutral900,
  surface2: palette.neutral800,

  textPrimary: palette.neutral50,
  textSecondary: palette.neutral300,
  textMuted: palette.neutral500,

  border: palette.neutral800,
  borderStrong: palette.neutral600,

  accentFill: palette.accent500,
  accentText: palette.neutral0,
  dangerFill: palette.danger500,
  dangerText: palette.neutral0,
  warningFill: palette.warning500,
  warningText: palette.neutral900,
  successFill: palette.success500,
  successText: palette.neutral0,

  accentSubtle: '#0f1e3a',
  dangerSubtle: '#2d0a0a',
  warningSubtle: '#2d1f00',
  successSubtle: '#0a2318',
};

export const typography = {
  fontFamily: {
    regular: undefined, // system sans-serif
    medium: undefined,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

export function useTheme(): ColorTokens {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTokens : lightTokens;
}
