import { NaturePlot, type ThemeName } from '../src';
import { appearanceEvent, displayPalette } from './appearance';
import { options } from './samples';

/** Reuse the live example's renderer, sample data, and inspection controls. */
export function mountPhyllotaxisHero(): void {
  const host = document.querySelector<HTMLElement>('#hero-phyllotaxis-chart');
  if (!host) return;

  const preset = options('phyllotaxis');
  const palette = preset.theme as ThemeName;
  const chart = new NaturePlot(host, {
    ...preset,
    theme: displayPalette(palette),
    detail: 'natural',
    animate: false,
  });

  window.addEventListener(appearanceEvent, () => chart.setTheme(displayPalette(palette)));
}
