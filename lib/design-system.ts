/**
 * Crowe Logic Design System
 * 
 * This file contains the comprehensive design system for the Crowe Logic AI platform.
 * It includes design tokens, theme values, and TypeScript types for consistent styling.
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Base color palette using OKLCH color space for perceptual uniformity
 */
export const colors = {
  // Monochromatic base (OpenAI-inspired minimalism)
  light: {
    background: 'oklch(1 0 0)',
    foreground: 'oklch(0.15 0 0)',
    card: 'oklch(0.99 0 0)',
    cardForeground: 'oklch(0.15 0 0)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.15 0 0)',
    primary: 'oklch(0.15 0 0)',
    primaryForeground: 'oklch(0.99 0 0)',
    secondary: 'oklch(0.96 0 0)',
    secondaryForeground: 'oklch(0.15 0 0)',
    muted: 'oklch(0.96 0 0)',
    mutedForeground: 'oklch(0.5 0 0)',
    accent: 'oklch(0.94 0 0)',
    accentForeground: 'oklch(0.15 0 0)',
    destructive: 'oklch(0.55 0.22 25)',
    destructiveForeground: 'oklch(0.99 0 0)',
    border: 'oklch(0.9 0 0)',
    input: 'oklch(0.9 0 0)',
    ring: 'oklch(0.15 0 0)',
  },
  dark: {
    background: 'oklch(0.1 0 0)',
    foreground: 'oklch(0.95 0 0)',
    card: 'oklch(0.12 0 0)',
    cardForeground: 'oklch(0.95 0 0)',
    popover: 'oklch(0.1 0 0)',
    popoverForeground: 'oklch(0.95 0 0)',
    primary: 'oklch(0.95 0 0)',
    primaryForeground: 'oklch(0.1 0 0)',
    secondary: 'oklch(0.2 0 0)',
    secondaryForeground: 'oklch(0.95 0 0)',
    muted: 'oklch(0.2 0 0)',
    mutedForeground: 'oklch(0.65 0 0)',
    accent: 'oklch(0.18 0 0)',
    accentForeground: 'oklch(0.95 0 0)',
    destructive: 'oklch(0.5 0.2 25)',
    destructiveForeground: 'oklch(0.95 0 0)',
    border: 'oklch(0.22 0 0)',
    input: 'oklch(0.22 0 0)',
    ring: 'oklch(0.7 0 0)',
  },
} as const

/**
 * Premium glow colors for AI/tech elements
 */
export const glowColors = {
  purple: '#a855f7',
  pink: '#ec4899',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  green: '#10b981',
  amber: '#f59e0b',
} as const

/**
 * Semantic colors for status and feedback
 */
export const semanticColors = {
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
} as const

/**
 * Glass morphism effect values
 */
export const glassEffects = {
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
} as const

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Font families
 */
export const fonts = {
  sans: '"Inter", "Inter Fallback", system-ui, -apple-system, sans-serif',
  mono: '"Fira Code", "Fira Code Fallback", "JetBrains Mono", "Courier New", monospace',
  code: '"Fira Code", "JetBrains Mono", "Courier New", monospace',
} as const

/**
 * Font size scale (in pixels)
 */
export const fontSizes = {
  xs: '12px',
  sm: '14px',
  base: '16px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
} as const

/**
 * Line height values
 */
export const lineHeights = {
  none: 1,
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.6,
  loose: 2,
} as const

/**
 * Font weights
 */
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

/**
 * Letter spacing values
 */
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Spacing scale based on 4px base unit
 */
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const

// ============================================================================
// BORDER RADIUS
// ============================================================================

/**
 * Border radius values
 */
export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
} as const

// ============================================================================
// SHADOWS
// ============================================================================

/**
 * Box shadow values
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',
} as const

/**
 * Glass effect shadows
 */
export const glassShadows = {
  panel: '0 8px 32px 0 rgba(0, 0, 0, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.15)',
  panelDark: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
  card: '0 8px 32px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)',
  cardDark: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
  button: '0 4px 16px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.3)',
  buttonDark: '0 4px 16px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
} as const

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

/**
 * Animation duration values
 */
export const animationDuration = {
  fast: '150ms',
  base: '200ms',
  medium: '300ms',
  slow: '400ms',
  slower: '600ms',
  slowest: '1000ms',
} as const

/**
 * Animation easing functions
 */
export const animationEasing = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const

/**
 * Animation timing presets
 */
export const animations = {
  fadeIn: {
    duration: animationDuration.medium,
    easing: animationEasing.easeOut,
  },
  slideUp: {
    duration: animationDuration.slow,
    easing: animationEasing.spring,
  },
  scaleIn: {
    duration: animationDuration.medium,
    easing: animationEasing.spring,
  },
  hover: {
    duration: animationDuration.base,
    easing: animationEasing.easeInOut,
  },
} as const

// ============================================================================
// BREAKPOINTS
// ============================================================================

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

/**
 * Z-index layering system
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

/**
 * Glass effect variants
 */
export const glassVariants = {
  default: {
    backdrop: 'blur(16px) saturate(180%)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  premium: {
    backdrop: 'blur(20px) saturate(180%)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.12)',
  },
  shiny: {
    backdrop: 'blur(24px) saturate(200%)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.15)',
  },
  terminal: {
    backdrop: 'blur(20px) saturate(180%)',
    background: 'rgba(0, 0, 0, 0.4)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  phone: {
    backdrop: 'blur(40px) saturate(200%)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'rgba(255, 255, 255, 0.15)',
  },
} as const

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type ColorMode = 'light' | 'dark'
export type ColorKey = keyof typeof colors.light
export type GlowColor = keyof typeof glowColors
export type SemanticColor = keyof typeof semanticColors
export type FontFamily = keyof typeof fonts
export type FontSize = keyof typeof fontSizes
export type LineHeight = keyof typeof lineHeights
export type FontWeight = keyof typeof fontWeights
export type LetterSpacing = keyof typeof letterSpacing
export type Spacing = keyof typeof spacing
export type BorderRadius = keyof typeof borderRadius
export type Shadow = keyof typeof shadows
export type AnimationDuration = keyof typeof animationDuration
export type AnimationEasing = keyof typeof animationEasing
export type Breakpoint = keyof typeof breakpoints
export type ZIndex = keyof typeof zIndex
export type GlassVariant = keyof typeof glassVariants

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  mode: ColorMode
  colors: typeof colors.light | typeof colors.dark
  glowColors: typeof glowColors
  semanticColors: typeof semanticColors
  fonts: typeof fonts
  fontSizes: typeof fontSizes
  lineHeights: typeof lineHeights
  fontWeights: typeof fontWeights
  letterSpacing: typeof letterSpacing
  spacing: typeof spacing
  borderRadius: typeof borderRadius
  shadows: typeof shadows
  glassShadows: typeof glassShadows
  animationDuration: typeof animationDuration
  animationEasing: typeof animationEasing
  animations: typeof animations
  breakpoints: typeof breakpoints
  zIndex: typeof zIndex
  glassVariants: typeof glassVariants
}

/**
 * Get theme configuration for a specific mode
 */
export function getThemeConfig(mode: ColorMode = 'light'): ThemeConfig {
  return {
    mode,
    colors: colors[mode],
    glowColors,
    semanticColors,
    fonts,
    fontSizes,
    lineHeights,
    fontWeights,
    letterSpacing,
    spacing,
    borderRadius,
    shadows,
    glassShadows,
    animationDuration,
    animationEasing,
    animations,
    breakpoints,
    zIndex,
    glassVariants,
  }
}

/**
 * Design system export
 */
export const designSystem = {
  colors,
  glowColors,
  semanticColors,
  glassEffects,
  fonts,
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacing,
  spacing,
  borderRadius,
  shadows,
  glassShadows,
  animationDuration,
  animationEasing,
  animations,
  breakpoints,
  zIndex,
  glassVariants,
  getThemeConfig,
} as const

export default designSystem
