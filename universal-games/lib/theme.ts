export type FontSizeLevel = 'large' | 'xlarge' | 'xxlarge';

export const FONT_SIZES: Record<FontSizeLevel, { body: number; heading: number; label: number }> = {
  large: { body: 20, heading: 32, label: 18 },
  xlarge: { body: 26, heading: 40, label: 24 },
  xxlarge: { body: 32, heading: 48, label: 30 },
};

export const COLORS = {
  background: '#FFFDF7',
  surface: '#FFFFFF',
  primary: '#4A90D9',
  primaryDark: '#2E6BAF',
  accent: '#FF8C42',
  text: '#1A1A1A',
  textLight: '#555555',
  disabled: '#CCCCCC',
  disabledText: '#888888',
  success: '#4CAF50',
  mole: '#8B5E3C',
  moleDark: '#6B4226',
  hole: '#3D2B1F',
  holeRim: '#5C3D2E',
  ground: '#7CB342',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const MIN_TAP_SIZE = 80;
