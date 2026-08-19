/**
 * VisionPath AI Color System
 * 
 * High-contrast, accessible color palette designed for:
 * - Users with limited or no vision
 * - Clear visual hierarchy
 * - Professional assistive technology appearance
 * - Sufficient color contrast ratios
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Background colors
    text: '#111827',
    background: '#EEF2F8',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E0E7FF',
    textSecondary: '#667085',
    
    // Brand colors
    primary: '#1761B0',
    primaryDark: '#0F4FA8',
    border: '#E6EBF2',
    danger: '#D92D20',
  },
  dark: {
    // Dark mode - simplified for future implementation
    text: '#F7F9FC',
    background: '#111827',
    backgroundElement: '#1F2937',
    backgroundSelected: '#374151',
    textSecondary: '#9CA3AF',
    primary: '#60A5FA',
    primaryDark: '#3B82F6',
    border: '#374151',
    danger: '#F87171',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
