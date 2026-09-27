import { NaturePlot, type ChartType, type ThemeName } from '../../src';
import { options } from '../samples';
import { icon, hydrateIcons } from '../icons';
import { appearanceEvent, displayPalette, isDark, toggleAppearance } from '../appearance';
import { pages, pageBySlug, pageLabel, parseRoute, escapeHTML, type Page } from './content';
import { createSearchIndex, type SearchEntry } from './search';
import './style.css';

const $ = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;

hydrateIcons();
if (!/Mac|iPhone|iPad/.test(navigator.platform)) document.querySelectorAll('[data-shortcut-modifier]').forEach(node => { node.textContent = 'Ctrl'; });
const menu = $<HTMLDialogElement>('#mobile-navigation');
$('#open-menu').addEventListener('click', () => menu.showModal());
$('#close-menu').addEventListener('click', () => menu.close());
menu.addEventListener('click', event => { if (event.target === menu) menu.close(); });

const groups = [...new Set(pages.map(page => page.group))];
const navigation = groups.map(group => `<div class="nav-group"><h2>${group}</h2>${pages.filter(page => page.group === group).map(page => `<a data-page-link="${page.slug}" href="#/${page.slug}">${icon(page.icon)}<span>${pageLabel(page)}</span>${page.slug === 'changelog' ? '<i class="new-dot"></i>' : ''}</a>`).join('')}</div>`).join('');
$('#desktop-navigation').innerHTML = navigation;
$('#mobile-nav-content').innerHTML = navigation;
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.close()));

let currentPage: Page | undefined;
let observers: IntersectionObserver[] = [];
let instances: { chart: NaturePlot; palette: ThemeName }[] = [];
const content = $('#doc-content');
$('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  content.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
});
const toastNode = $('#docs-toast');
let toastTimer: ReturnType<typeof setTimeout>;
function toast(message: string): void {
  clearTimeout(toastTimer);
  toastNode.textContent = message;
  toastNode.classList.add('visible');
  toastTimer = setTimeout(() => toastNode.classList.remove('visible'), 2600);
}

function mountExamples(): void {
  content.querySelectorAll<HTMLElement>('[data-example]').forEach(element => {
    const type = element.dataset.example as ChartType;
    const base = options(type);
    const record = { chart: new NaturePlot(element.querySelector<HTMLElement>('.example-chart')!, { ...base, theme: displayPalette(base.theme as ThemeName), onSelect: point => {
      element.querySelector('.example-caption span')!.textContent = `${point.label ?? point.date}: ${point.start ? `${point.start} – ${point.end}` : point.observedAt ?? (point.expectedStart ? `Expected ${point.expectedStart} – ${point.expectedEnd}` : point.value ?? 'No data')}${base.unit ? ' '+base.unit : ''}${point.target ? ' / '+point.target : ''}`;
    } }), palette: base.theme as ThemeName };
    instances.push(record);
    element.querySelector('[data-detail]')!.addEventListener('click',event=>{
      const button=event.currentTarget as HTMLButtonElement;
      const essential=button.getAttribute('aria-pressed')!=='true';
      button.setAttribute('aria-pressed',String(essential));
      record.chart.update({detail:essential?'essential':'natural'});
      element.querySelector('.example-caption span')!.textContent=essential?'Essential detail. Measurements and exact readings are unchanged.':'Natural detail. Select a mark for the exact reading.';
    });
    element.querySelector('[data-refresh]')!.addEventListener('click', () => {
      const next = options(type, true);
      if (type === 'bloom') next.max = Math.max(10, ...next.data.map(point => point.value ?? 0));
      record.chart.update({ ...next, theme: displayPalette(record.palette) });
      element.querySelector('.example-caption span')!.textContent = 'Fresh sample data. Hover or focus to explore.';
    });
    element.querySelector('[data-table]')!.addEventListener('click', event => {
      const button = event.currentTarget as HTMLButtonElement;
      const show = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} ${type} data table`);
      button.title = `${show ? 'Hide' : 'Show'} data table`;
      record.chart.update({ showTable: show });
    });
  });
  content.querySelectorAll<HTMLElement>('[data-mini-chart]').forEach(element => {
    const base = options(element.dataset.miniChart as ChartType);
    instances.push({ chart: new NaturePlot(element, { ...base, theme: displayPalette(base.theme as ThemeName), animate: false, interactive: false }), palette: base.theme as ThemeName });
  });
  if (content.querySelector('[data-hero-chart]')) {
    instances.push({ chart: new NaturePlot(content.querySelector<HTMLElement>('.hero-chart-mount')!, { ...options('garden'), theme: displayPalette('meadow'), animate: false, interactive: false }), palette: 'meadow' });
  }
  content.querySelectorAll<HTMLButtonElement>('[data-palette]').forEach(button => button.addEventListener('click', () => {
    const theme = button.dataset.palette as ThemeName;
    instances.forEach(record => { record.palette = theme; record.chart.setTheme(displayPalette(theme)); });
    content.querySelectorAll('[data-palette]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    const example = content.querySelector('.example-caption span');
    if (example) example.textContent = `${theme[0].toUpperCase()+theme.slice(1)} palette. Hover or focus to explore.`;
  }));
  content.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const value = button.closest('.code-block')!.querySelector('code')!.textContent ?? '';
    try {
      await navigator.clipboard.writeText(value);
      toast('Copied to clipboard. Ready to grow.');
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(button.closest('.code-block')!.querySelector('code')!);
      selection?.removeAllRanges(); selection?.addRange(range);
      toast('Code selected. Use your browser’s copy command.');
    }
  }));
}

function renderPage(): void {
  const route = parseRoute(location.hash);
  const page = pageBySlug.get(route.page);
  // A section link keeps the existing examples and their state alive.
  if (page !== currentPage || !content.childElementCount) {
    instances.forEach(({ chart }) => chart.destroy()); instances = [];
    observers.forEach(observer => observer.disconnect()); observers = [];
    currentPage = page;
    if (!page) {
      content.innerHTML = `<div class="page-heading"><span class="eyebrow">A PATH LESS TRAVELED</span><h1>That page hasn’t<br>taken root.</h1><p>We couldn’t find this documentation page.</p><a class="primary-link" href="#/introduction">Back to the field guide ${icon('arrow-right')}</a></div>`;
      $('#toc').replaceChildren();
      document.title = 'Page not found · NaturePlot.js';
    } else {
      document.title = `${pageLabel(page)} · NaturePlot.js`;
      const pageIndex = pages.indexOf(page);
      const previous = pages[pageIndex - 1];
      const next = pages[pageIndex + 1];
      content.innerHTML = `<div class="breadcrumb"><a href="#/introduction">Documentation</a>${icon('caret-right')}<span>${page.group}</span></div><div class="page-heading${page.slug === 'introduction' ? ' introduction-heading' : ''}"><span class="eyebrow">${page.group.toUpperCase()}</span><h1>${escapeHTML(page.title).replace('\n', '<br>')}</h1><p>${page.description}</p>${page.slug === 'introduction' ? '<div class="heading-version"><span class="status-dot"></span>THE FIELD GUIDE <span>/</span> v0.4.0</div>' : ''}</div>${page.sections.map(section => `<section class="doc-section" id="${section.id}"><h2 class="section-title"><a href="#/${page.slug}/${section.id}">${section.title}${icon('link')}</a></h2>${section.html}</section>`).join('')}<nav class="page-pagination" aria-label="Previous and next page">${previous ? `<a href="#/${previous.slug}"><span>${icon('arrow-left')} PREVIOUS</span><strong>${pageLabel(previous)}</strong></a>` : '<div></div>'}${next ? `<a href="#/${next.slug}"><span>UP NEXT ${icon('arrow-right')}</span><strong>${pageLabel(next)}</strong></a>` : '<div></div>'}</nav><footer class="doc-footer"><span>NaturePlot.js · Small by design.</span><a href="../LICENSE" target="_blank" rel="noopener">MIT License ${icon('arrow-up-right')}</a></footer>`;
      $('#toc').innerHTML = `<h2>ON THIS PAGE</h2><nav aria-label="On this page">${page.sections.map(section => `<a href="#/${page.slug}/${section.id}" data-toc="${section.id}">${section.title}</a>`).join('')}</nav>`;
      mountExamples();
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(visible.target.id);
      }, { rootMargin: '-90px 0px -60% 0px', threshold: 0 });
      content.querySelectorAll('.doc-section').forEach(section => observer.observe(section));
      observers.push(observer);
      setActiveSection(page.sections[0].id);
    }
    document.querySelectorAll<HTMLElement>('[data-page-link]').forEach(a => {
      const selected = a.dataset.pageLink === route.page;
      a.classList.toggle('active', selected);
      if (selected) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    // Avoid leaving keyboard focus on a removed page link.
    content.focus({ preventScroll: true });
  }
  if (route.section) {
    const section = document.getElementById(route.section);
    if (section && content.contains(section)) { section.scrollIntoView({ behavior: 'instant', block: 'start' }); setActiveSection(route.section); }
    else window.scrollTo({ top: 0, behavior: 'instant' });
  } else window.scrollTo({ top: 0, behavior: 'instant' });
}
function setActiveSection(id: string): void {
  $('#toc').querySelectorAll<HTMLElement>('[data-toc]').forEach(link => {
    link.classList.toggle('active', link.dataset.toc === id);
    if (link.dataset.toc === id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
  });
}
window.addEventListener('hashchange', () => { if (location.hash !== '#doc-content') renderPage(); });
renderPage();

function refreshAppearance(): void {
  const button = $('[data-appearance-toggle]');
  button.innerHTML = icon(isDark() ? 'sun' : 'moon');
  button.setAttribute('aria-label', `Switch to ${isDark() ? 'light' : 'dark'} mode`);
  button.title = `Switch to ${isDark() ? 'light' : 'dark'} mode`;
  instances.forEach(({ chart, palette }) => chart.setTheme(displayPalette(palette)));
  document.querySelector('meta[name="theme-color"]')!.setAttribute('content', isDark() ? '#111a14' : '#fafbf7');
}
$('[data-appearance-toggle]').addEventListener('click', toggleAppearance);
window.addEventListener(appearanceEvent, refreshAppearance);
refreshAppearance();

const search = createSearchIndex();
const searchDialog = $<HTMLDialogElement>('#search-dialog');
const searchInput = $<HTMLInputElement>('#search-input');
const resultsNode = $('#search-results');
let searchResults: SearchEntry[] = [];
let activeResult = 0;
function markMatches(text: string, query: string): string {
  const terms = query.trim().split(/\s+/).filter(Boolean).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return escapeHTML(text);
  const matcher = new RegExp(`(${terms.join('|')})`, 'gi');
  return text.split(matcher).map((part, index) => index % 2 ? `<mark>${escapeHTML(part)}</mark>` : escapeHTML(part)).join('');
}
function runSearch(): void {
  const query = searchInput.value.trim().slice(0, 180);
  searchResults = query ? search.index.search(query).slice(0, 9).map(result => ({ ...result, id: String(result.id) }) as unknown as SearchEntry) : ['quickstart', 'choosing-a-chart', 'garden', 'themes', 'options', 'field-notes'].map(slug => search.entries.find(entry => entry.page === slug)!);
  activeResult = 0;
  $('#search-meta').textContent = query ? `${searchResults.length ? 'RESULTS' : 'NO RESULTS'} FOR “${query}”` : 'A FEW GOOD PLACES TO START';
  resultsNode.innerHTML = searchResults.length ? searchResults.map((result, index) => {
    const matchAt = query ? result.content.toLowerCase().indexOf(query.toLowerCase()) : 0;
    const start = Math.max(0, matchAt - 45);
    const snippet = `${start > 0 ? '…' : ''}${result.content.slice(start, start + 140)}${result.content.length > start + 140 ? '…' : ''}`;
    return `<div id="result-${index}" role="option" aria-selected="${index === 0}" data-result="${index}"><span class="result-icon">${icon(pageBySlug.get(result.page)!.icon)}</span><div><span class="result-group">${escapeHTML(result.group)} <span>/</span> ${escapeHTML(result.title)}</span><strong>${markMatches(result.heading, query)}</strong><p>${markMatches(snippet, query)}</p></div>${icon('arrow-right')}</div>`;
  }).join('') : `<div class="empty-search">${icon('magnifying-glass')}<h3>No leaves on this branch.</h3><p>Try “calendar”, “dark theme”, or “export”.</p></div>`;
  resultsNode.querySelectorAll<HTMLElement>('[data-result]').forEach(result => {
    result.addEventListener('click', () => navigateToResult(Number(result.dataset.result)));
    result.addEventListener('pointermove', () => { activeResult = Number(result.dataset.result); selectResult(false); });
  });
  selectResult(false);
}
function selectResult(scroll = true): void {
  resultsNode.querySelectorAll('[role="option"]').forEach((node, index) => node.setAttribute('aria-selected', String(index === activeResult)));
  if (searchResults.length) {
    searchInput.setAttribute('aria-activedescendant', `result-${activeResult}`);
    if (scroll) document.getElementById(`result-${activeResult}`)?.scrollIntoView({ block: 'nearest' });
  } else searchInput.removeAttribute('aria-activedescendant');
}
function navigateToResult(index: number): void {
  const result = searchResults[index];
  if (!result) return;
  searchDialog.close();
  const hash = `#/${result.page}/${result.anchor}`;
  if (location.hash === hash) renderPage(); else location.hash = hash;
  content.focus({ preventScroll: true });
}
function openSearch(): void {
  if (menu.open) menu.close();
  searchInput.value = '';
  runSearch();
  searchDialog.showModal();
  searchInput.focus();
}
document.querySelectorAll('[data-open-search]').forEach(button => button.addEventListener('click', openSearch));
$('[data-close-search]').addEventListener('click', () => searchDialog.close());
searchDialog.addEventListener('click', event => { if (event.target === searchDialog) searchDialog.close(); });
searchInput.addEventListener('input', runSearch);
searchInput.addEventListener('keydown', event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (searchResults.length) activeResult = (activeResult + (event.key === 'ArrowDown' ? 1 : -1) + searchResults.length) % searchResults.length;
    selectResult();
  } else if (event.key === 'Enter') { event.preventDefault(); navigateToResult(activeResult); }
});
document.addEventListener('keydown', event => {
  const editing = event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable);
  if (((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') || (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey)) {
    event.preventDefault();
    if (searchDialog.open) searchDialog.close(); else openSearch();
  }
});

