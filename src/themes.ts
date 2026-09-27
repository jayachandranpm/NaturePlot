import type { Theme, ThemeName } from './types.js';
export const themes: Record<ThemeName, Theme> = {
  meadow: { background: '#fafbf5', ink: '#263e32', muted: '#647262', grid: '#dce5d8', colors: ['#63866a', '#93aa73', '#bbca80', '#e3c874', '#dfa06f', '#be8077', '#9681a3'] },
  ocean: { background: '#f3f8fa', ink: '#274a57', muted: '#56717d', grid: '#d6e5e9', colors: ['#4e8599', '#6ea9b4', '#92bfc1', '#abd2c7', '#d0dcb9', '#b1bfd8', '#8a9bb9'] },
  autumn: { background: '#fff8ef', ink: '#604934', muted: '#816b56', grid: '#ebdfcc', colors: ['#ab6c48', '#cb8850', '#e1ac68', '#e8c98d', '#b6ac6e', '#8c9768', '#c08276'] },
  twilight: { background: '#f8f5fc', ink: '#4b4263', muted: '#78698c', grid: '#e4dced', colors: ['#87749f', '#a48eb4', '#c1a4c3', '#dbb7cb', '#e7c9b6', '#a2b2c7', '#869cad'] },
};
export function resolveTheme(theme: ThemeName | Theme = 'meadow'): Theme {
  const value = typeof theme === 'string' ? themes[theme] : theme;
  if (!value || !Array.isArray(value.colors) || value.colors.length === 0 ||
    [value.background, value.ink, value.muted, value.grid, ...value.colors].some(c => typeof c !== 'string' || !/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(c))) {
    throw new Error('NaturePlot: theme must be a known theme name or a palette of hex colors.');
  }
  return { ...value, colors: [...value.colors] };
}
