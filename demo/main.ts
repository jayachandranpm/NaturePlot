import { NaturePlot, chartTypes, chartGuidance, themes, type ChartOptions, type ChartType, type DataPoint, type ChartDatum, type ThemeName } from '../src';
import './style.css';
import './nature-studies.css';
import './controls.css';
import { enhanceSelect, syncSelect, focusSelect } from './select';
import { chartIcons } from './chart-icons';
import { dataColumns } from '../src/readings';
import { types, useCases, names, options, resetChartOptions } from './samples';
import { icon, hydrateIcons } from './icons';
import { appearanceEvent, displayPalette, isDark, toggleAppearance } from './appearance';
import { mountNatureStudies } from './nature-studies';

hydrateIcons();
mountNatureStudies();

const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const hero = new NaturePlot('#hero-chart', { ...options('garden'), theme: displayPalette('meadow'), animate: true, interactive: false });
const gallery: { type: ChartType; card: HTMLElement; chart: NaturePlot; palette: ThemeName }[] = [];
for (const [index, type] of types.entries()) {
  const metadata = chartTypes[type];
  const card = document.createElement('article');
  card.className = `chart-card${index >= 20 ? ' chart-card-new' : ''}`;
  card.dataset.category = metadata.category;
  // This template contains only constant, internal catalog strings. User data goes through textContent in the library.
  card.innerHTML = `<div class="card-visual"><div class="card-topline"><span class="card-number">${String(index + 1).padStart(2, '0')}${index >= 20 ? '<b class="new-chart-badge">NEW</b>' : ''}</span><span class="card-data-label">${useCases[type]}</span></div><div class="card-chart"></div></div><div class="card-bottom"><div><div class="card-name-row"><h3>${metadata.name}</h3><span class="type-pill">${metadata.category}</span></div><p>${metadata.subtitle}</p></div><button class="try-chart" aria-label="Try ${metadata.name} in the playground" title="Try ${metadata.name}">${icon('arrow-up-right')}</button></div>`;
  $('#chart-grid').append(card);
  const preset = options(type);
  const palette = preset.theme as ThemeName;
  const chart = new NaturePlot(card.querySelector<HTMLElement>('.card-chart')!, { ...preset, theme: displayPalette(palette) });
  card.querySelector('.try-chart')!.addEventListener('click', () => {
    focusSelect($<HTMLSelectElement>('#chart-type'));
    switchType(type);
    $('#playground').scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth' });
  });
  gallery.push({ type, card, chart, palette });
}
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const newCharts = new Set<ChartType>(types.slice(20));
const initialCategory = new URLSearchParams(location.search).get('collection') === 'new' ? 'new' : 'all';
let selectedCategory = initialCategory;
const isHidden = (type: ChartType, category: string) => category === 'new' ? !newCharts.has(type) : category !== 'all' && chartTypes[type].category !== category;
const categories = [['All charts', 'all'], ['New charts', 'new'], ['Calendars', 'Calendar'], ['Comparisons', 'Comparison'], ['Trends', 'Trend'], ['Progress', 'Progress'], ['Cycles', 'Cycle'], ['Timelines', 'Timeline'], ['Distributions', 'Distribution'], ['Relationships', 'Relationship'], ['Composition', 'Composition'], ['Spatial', 'Spatial']];
for (const [label, category] of categories) {
  const count = category === 'all' ? types.length : category === 'new' ? newCharts.size : gallery.filter(x => chartTypes[x.type].category === category).length;
  const button = document.createElement('button');
  button.className = 'filter-chip';
  button.setAttribute('aria-pressed', String(category === initialCategory));
  button.innerHTML = `${label} <span>${count}</span>`;
  button.addEventListener('click', () => {
    $('#filters').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    selectedCategory = category;
    filterGallery();
  });
  $('#filters').append(button);
}

function filterGallery(): void {
  const query = $<HTMLInputElement>('#chart-search').value.toLowerCase().trim();
  gallery.forEach(({ card, type }) => { const m = chartTypes[type]; card.hidden = isHidden(type, selectedCategory) || !!query && ![type, m.name, m.description, m.encoding, m.category, chartGuidance[type].bestFor,chartGuidance[type].question,chartGuidance[type].example,chartGuidance[type].decision].join(' ').toLowerCase().includes(query); });
  const count = gallery.filter(item => !item.card.hidden).length;
  $('#collection-count').textContent = `${count} of ${types.length} charts${count ? '' : ' · Try a different search or category'}`;
}
$('#chart-search').addEventListener('input', filterGallery);
filterGallery();

let activeOptions = options('garden');
let activeTheme: ThemeName = 'meadow';
$('#chart-detail').addEventListener('change',()=>{activeOptions.detail=$<HTMLSelectElement>('#chart-detail').value as 'natural'|'essential';playground.update({detail:activeOptions.detail});refresh(false);});
const status = (point: Readonly<DataPoint>) => { $('#selection-status').textContent = `${point.label ?? point.date}: ${point.start ? `${point.start} – ${point.end}` : point.observedAt ?? (point.expectedStart ? `Expected ${point.expectedStart} – ${point.expectedEnd}` : point.value ?? 'No data')}${activeOptions.unit ? ` ${activeOptions.unit}` : ''}${point.target ? ` / ${point.target}` : ''}`; };
const playground = new NaturePlot('#playground-chart', { ...activeOptions, theme: displayPalette(activeTheme), onSelect: status });
for (const type of types) {
  const option = document.createElement('option');
  option.value = type;
  option.textContent = `${chartTypes[type].name} · ${chartTypes[type].category}`;
  $('#chart-type').append(option);
}
enhanceSelect($<HTMLSelectElement>('#chart-type'), chartIcons);
enhanceSelect($<HTMLSelectElement>('#chart-detail'), { natural: 'leaf', essential: 'sliders-horizontal' });
$('#chart-type').addEventListener('change', event => switchType((event.target as HTMLSelectElement).value as ChartType));
for (const theme of Object.keys(themes) as ThemeName[]) {
  const button = document.createElement('button');
  button.className = 'theme-choice';
  button.dataset.theme = theme;
  button.innerHTML = `<span class="theme-dot" style="background:${themes[theme].colors[0]}"></span>${theme[0].toUpperCase() + theme.slice(1)}`;
  button.addEventListener('click', () => {
    activeTheme = theme;
    activeOptions.theme = theme;
    playground.setTheme(displayPalette(theme));
    refresh(false);
  });
  $('#theme-picker').append(button);
}
function switchType(type: ChartType): void {
  const next = options(type);
  // Reset type-specific options when moving between different encodings.
  activeOptions = { ...resetChartOptions, ...next, theme: activeTheme, detail:activeOptions.detail??'natural' };
  playground.update({ ...activeOptions, theme: displayPalette(activeTheme), onSelect: status });
  refresh();
  activateTab('preview');
}
function refresh(resetEditor = true): void {
  const type = activeOptions.type as ChartType;
  $<HTMLSelectElement>('#chart-type').value = type;
  syncSelect($<HTMLSelectElement>('#chart-type'));
  $('#chart-description').textContent = chartTypes[type].description;
  $('#preview-name').textContent = names[type];
  $('#encoding-note').textContent = chartTypes[type].encoding;
  $('#fit-purpose').textContent = chartGuidance[type].question;
  $('#fit-decision').textContent = chartGuidance[type].decision;
  $<HTMLSelectElement>('#chart-detail').value=activeOptions.detail??'natural';
  syncSelect($<HTMLSelectElement>('#chart-detail'));
  $('#fit-caution').textContent = chartGuidance[type].caution;
  const related = chartGuidance[type].alternative;
  const link = $<HTMLAnchorElement>('#fit-alternative');
  link.href = `./docs/#/${related}`; link.textContent = `Compare with ${chartTypes[related].name}`;
  $<HTMLAnchorElement>('#fit-guide').href = `./docs/#/${type}/fitness`;
  $('#theme-picker').querySelectorAll<HTMLElement>('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === activeTheme)));
  if (resetEditor) {
    $<HTMLTextAreaElement>('#json-data').value = JSON.stringify(activeOptions.data, null, 2);
    $('#data-error').textContent = '';
    $('#selection-status').textContent = 'Hover or focus to discover each observation.';
  }
  $<HTMLTextAreaElement>('#json-settings').value = JSON.stringify(Object.fromEntries(Object.keys(resetChartOptions).filter(key => activeOptions[key as keyof ChartOptions] !== undefined).map(key => [key, activeOptions[key as keyof ChartOptions]])), null, 2);
  $('#settings-error').textContent = '';
  $('#generated-code').textContent = getCode();
  const table = document.createElement('table');
  const row = table.createTHead().insertRow();
  const columns = dataColumns(activeOptions, playground.data, value => value === null ? 'No data' : String(value)+(activeOptions.unit ? ' '+activeOptions.unit : ''));
  columns.forEach(column => { const cell = document.createElement('th'); cell.scope = 'col'; cell.textContent = column.header; row.append(cell); });
  const body = table.createTBody();
  playground.data.forEach((point, i) => { const r = body.insertRow(); columns.forEach(column => { r.insertCell().textContent = column.read(point, i); }); });
  $('#data-table').replaceChildren(table);
}
function getCode(): string {
  const clean = Object.fromEntries(Object.entries(activeOptions).filter(([key, value]) => value !== undefined && !['onSelect', 'formatValue'].includes(key)));
  return `import { NaturePlot } from 'natureplot';\n\n// Add <div id="chart"></div> to your page.\nconst chart = new NaturePlot('#chart', ${JSON.stringify(clean, null, 2)});\n`;
}
$('#regenerate').addEventListener('click', () => {
  const next = { ...resetChartOptions, ...options(activeOptions.type as ChartType, true), theme: activeTheme,detail:activeOptions.detail??'natural' };
  playground.update({ ...next, theme: displayPalette(activeTheme) });
  activeOptions = next;
  refresh();
  toast('Fresh sample data and settings. A new perspective.');
});
$('#apply-data').addEventListener('click', () => {
  try {
    const data: ChartDatum[] = JSON.parse($<HTMLTextAreaElement>('#json-data').value);
    // User data is free to change the scale; retain the calendar date window.
    const next: ChartOptions = { ...activeOptions, data, max: undefined };
    playground.update({ ...next, theme: displayPalette(activeTheme) });
    activeOptions = next;
    refresh();
    toast('Your data is growing.');
  } catch (error) { $('#data-error').textContent = error instanceof Error ? error.message : 'Please enter valid chart data.'; }
});
$('#apply-settings').addEventListener('click', () => {
  try {
    const settings: unknown = JSON.parse($<HTMLTextAreaElement>('#json-settings').value);
    if (!settings || typeof settings !== 'object' || Array.isArray(settings)) throw new Error('Settings must be a JSON object.');
    for (const key of Object.keys(settings)) if (!Object.hasOwn(resetChartOptions, key)) throw new Error(`Unknown setting: ${key}. Edit observations in the data editor.`);
    const next: ChartOptions = { ...activeOptions, ...resetChartOptions, ...settings };
    playground.update({ ...next, theme: displayPalette(activeTheme) });
    activeOptions = next;
    refresh(false);
    toast('Settings applied. A new way to read your data.');
  } catch (error) { $('#settings-error').textContent = error instanceof Error ? error.message : 'Please enter valid settings.'; }
});
function activateTab(tab: string): void {
  document.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach(button => {
    const active = button.dataset.tab === tab;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    $(`#panel-${button.dataset.tab}`).hidden = !active;
  });
}
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-tab]')];
tabs.forEach((button, i) => {
  button.addEventListener('click', () => activateTab(button.dataset.tab!));
  button.addEventListener('keydown', event => {
    let next: number;
    if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (i + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); tabs[next].focus(); activateTab(tabs[next].dataset.tab!);
  });
});
let toastTimer: ReturnType<typeof setTimeout>;
function toast(message: string): void {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3000);
}
async function copy(text: string): Promise<void> {
  try { await navigator.clipboard.writeText(text); toast('Copied. Ready to plant.'); }
  catch { toast('Clipboard unavailable. Select and copy the code manually.'); }
}
$('#copy-playground').addEventListener('click', () => { void copy(getCode()); });
$('#copy-quickstart').addEventListener('click', () => { void copy($('.code-card pre').textContent ?? ''); });
$('#export-svg').addEventListener('click', () => { playground.download(`natureplot-${activeOptions.type}.svg`); toast('Your chart, ready to go.'); });
refresh();

function refreshAppearance(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-appearance-toggle]')!;
  button.innerHTML = icon(isDark() ? 'sun' : 'moon');
  button.setAttribute('aria-label', `Switch to ${isDark() ? 'light' : 'dark'} mode`);
  hero.setTheme(displayPalette('meadow'));
  gallery.forEach(({ chart, palette }) => chart.setTheme(displayPalette(palette)));
  playground.setTheme(displayPalette(activeTheme));
}
document.querySelector('[data-appearance-toggle]')!.addEventListener('click', toggleAppearance);
window.addEventListener(appearanceEvent, refreshAppearance);
refreshAppearance();

const requestedChart = new URLSearchParams(location.search).get('chart');
if (requestedChart && types.includes(requestedChart as ChartType)) switchType(requestedChart as ChartType);

