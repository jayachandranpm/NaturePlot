import { themes, type Theme, type ThemeName } from '../src';

export const appearanceEvent = 'natureplot:appearance';
const key = 'natureplot-appearance';
const media = window.matchMedia('(prefers-color-scheme: dark)');
let saved: string | null = null;
try { saved = localStorage.getItem(key); } catch { /* Private contexts can deny storage. */ }
let preference = saved === 'light' || saved === 'dark' ? saved : null;

export function isDark(): boolean { return document.documentElement.dataset.appearance === 'dark'; }

function apply(): void {
  document.documentElement.dataset.appearance = preference ?? (media.matches ? 'dark' : 'light');
  document.documentElement.style.colorScheme = isDark() ? 'dark' : 'light';
  window.dispatchEvent(new Event(appearanceEvent));
}

export function toggleAppearance(): void {
  preference = isDark() ? 'light' : 'dark';
  try { localStorage.setItem(key, preference); } catch { /* The setting still works for this page. */ }
  apply();
}

export function displayPalette(name: ThemeName = 'meadow'): Theme {
  return isDark()
    ? { ...themes[name], background: '#17221b', ink: '#e2eadb', muted: '#a6b79f', grid: '#364a3b' }
    : { ...themes[name] };
}

media.addEventListener('change', () => { if (!preference) apply(); });
window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
  apply();
});
apply();
