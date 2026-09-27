import { interactionHints } from './interaction-hints.js';
import type { ChartMetadata, ChartOptions, ChartRenderer, DataPoint, RenderContext, ThemeName, Theme } from './types.js';
import { chartTypes, renderers } from './renderers.js';
import { resolveTheme, themes } from './themes.js';
import { normalizeData, NS, pointLabel, targetOf } from './utils.js';
import { dataColumns, measurementContext } from './readings.js';
export type * from './types.js';
export { themes, chartTypes };
export { chartGuidance, type ChartGuidance } from './guidance.js';
export { chartUseCases, type ChartUseCase } from './use-cases.js';
export const version = '0.7.0';
let sequence = 0;

/** Add a renderer without replacing a built-in chart type. */
export function registerChart(name: string, renderer: ChartRenderer, metadata: ChartMetadata): void {
  if (!/^[a-z][a-z0-9-]*$/.test(name) || name in renderers) throw new Error('NaturePlot: chart name must be unique and contain lowercase letters, numbers, or hyphens.');
  if (typeof renderer !== 'function' || !metadata?.name) throw new Error('NaturePlot: a renderer and metadata are required.');
  renderers[name] = renderer;
  chartTypes[name] = { ...metadata };
}

const css = `
.np-chart{position:relative;width:100%;max-width:100%;overflow:auto;font:14px/1.6 system-ui,-apple-system,sans-serif;box-sizing:border-box;isolation:isolate}
.np-chart svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.np-chart .np-mark{cursor:crosshair;outline:none;transition:filter .18s,opacity .18s}
.np-chart .np-mark:hover,.np-chart .np-mark:focus{filter:brightness(.86) drop-shadow(0 2px 2px #0002);opacity:1}
.np-chart .np-mark:focus-visible{outline:2px solid currentColor;outline-offset:4px}
.np-chart .np-tooltip{position:absolute;z-index:3;box-sizing:border-box;max-width:min(280px,calc(100% - 16px));overflow-wrap:anywhere;padding:10px 14px;border-radius:9px;background:#20382e;color:#fff;font-size:14px;line-height:1.6;box-shadow:0 4px 16px #172b2820;pointer-events:none;white-space:pre-line;transform:translate(-50%,-100%)}
.np-chart .np-table{border-collapse:collapse;width:100%;margin-top:12px;font-size:14px}
.np-chart .np-inspector{position:sticky;left:0;box-sizing:border-box;width:100%;padding:12px 15px;border-top:1px solid #8883;background:var(--np-bg);color:var(--np-ink)}
.np-chart .np-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.np-chart .np-controls button{font:inherit;font-size:14px;padding:8px 12px;border:1px solid #8885;border-radius:6px;color:inherit;background:transparent;cursor:pointer;min-height:40px}
.np-chart .np-controls button:hover{background:#8882}.np-chart .np-controls button:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.np-chart .np-controls button:disabled{opacity:.4;cursor:default}
.np-chart .np-reading{font-size:14px;line-height:1.6;margin:9px 0 0;white-space:pre-line;overflow-wrap:anywhere}
.np-chart.np-has-selection .np-mark:not([aria-pressed=true]){opacity:.22}
.np-chart .np-series.np-series-muted{opacity:.14}
.np-chart .np-mark[aria-pressed=true]{filter:drop-shadow(0 0 2px #8888);opacity:1}
.np-chart .np-table th,.np-chart .np-table td{padding:7px 12px;text-align:left;border-bottom:1px solid #8883}
.np-chart .np-table caption{text-align:left;font-weight:600;padding:10px 12px}
.np-chart .np-sr-only{display:block!important;position:absolute!important;top:0!important;left:0!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.np-chart.np-essential .np-ornament{display:none}
.np-chart .np-observation-card{display:flex;align-items:center;gap:16px;margin:2px 0 14px;min-height:78px}
.np-chart .np-observation-copy{min-width:0;flex:1}.np-chart .np-observation-heading{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.7;font-weight:600}
.np-chart .np-observation-card .np-reading{margin:4px 0 0;font-size:15px}
.np-chart .np-mark:hover .np-focus-halo,.np-chart .np-mark:focus .np-focus-halo,.np-chart .np-mark[aria-pressed=true] .np-focus-halo{opacity:.85}
@keyframes np-appear{from{opacity:0}to{opacity:1}}
.np-chart.np-animate>svg{animation:np-appear .5s ease both}
@media(prefers-reduced-motion:reduce){.np-chart.np-animate>svg{animation:none}.np-chart .np-mark{transition:none}}
`;

export class NaturePlot {
  readonly container: HTMLElement;
  readonly id: string;
  private options: ChartOptions;
  private root!: HTMLDivElement;
  private svg!: SVGSVGElement;
  private destroyed = false;
  private normalized: DataPoint[] = [];
  private cleanup: (() => void) | undefined;
  private selectObservation: ((index: number) => void) | undefined;

  constructor(container: string | HTMLElement, options: ChartOptions) {
    const host = typeof container === 'string' ? document.querySelector(container) : container;
    if (!(host instanceof HTMLElement)) throw new Error('NaturePlot: container must be an existing HTML element or a matching selector.');
    this.container = host;
    this.id = `natureplot-${++sequence}`;
    this.options = { ...options };
    this.render(options);
  }

  /** Returns a defensive copy, including filled calendar dates. */
  get data(): DataPoint[] { return this.normalized.map(p => ({ ...p })); }

  /** Updates atomically: invalid data leaves the existing chart intact. */
  update(options: Partial<ChartOptions>): this {
    if (this.destroyed) throw new Error('NaturePlot: cannot update a destroyed chart.');
    this.render({ ...this.options, ...options });
    return this;
  }

  setTheme(theme: ThemeName | Theme): this { return this.update({ theme }); }

  /** Select an observation by normalized input index, including keyboard/readout state. */
  select(index: number): this {
    if(this.destroyed)throw new Error('NaturePlot: cannot select on a destroyed chart.');
    if(!Number.isInteger(index)||index<0||index>=this.normalized.length)throw new Error('NaturePlot: selection index is outside the data.');
    this.selectObservation?.(index);return this;
  }

  toSVG(): string {
    if (this.destroyed) throw new Error('NaturePlot: cannot export a destroyed chart.');
    const copy = this.svg.cloneNode(true) as SVGSVGElement;
    if(this.options.detail==='essential')copy.querySelectorAll('.np-ornament').forEach(el=>el.remove());
    copy.setAttribute('width', '640');
    copy.setAttribute('height', '360');
    copy.setAttribute('role', 'img');
    copy.querySelectorAll('.np-focus-halo,.np-specimen-hit').forEach(el=>el.remove());
    copy.querySelectorAll('[tabindex]').forEach(el => el.removeAttribute('tabindex'));
    copy.querySelectorAll('.np-mark').forEach(el => {
      el.removeAttribute('role'); el.removeAttribute('aria-pressed'); el.removeAttribute('aria-describedby');
    });
    copy.querySelectorAll('.np-series-muted').forEach(el => el.classList.remove('np-series-muted'));
    return new XMLSerializer().serializeToString(copy);
  }

  download(filename = `${this.options.type}.svg`): void {
    const url = URL.createObjectURL(new Blob([this.toSVG()], { type: 'image/svg+xml;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  destroy(): void {
    if (this.destroyed) return;
    this.cleanup?.();
    this.root.remove();
    this.normalized = [];
    this.selectObservation = undefined;
    this.destroyed = true;
  }

  private render(input: ChartOptions): void {
    if (!Object.hasOwn(renderers, input.type)) throw new Error(`NaturePlot: unknown chart type "${input.type}".`);
    const data = normalizeData(input), theme = resolveTheme(input.theme);
    const options: ChartOptions = { ...input, data: input.data.map(p => ({ ...p })), ...(input.thresholds ? { thresholds: input.thresholds.map(threshold => ({ ...threshold })) } : {}), theme };
    const format = (value: number | null) => value === null ? 'No data' : (options.formatValue ? options.formatValue(value) : (value !== 0 && Math.abs(value) < .001 ? String(value) : new Intl.NumberFormat('en', { maximumSignificantDigits: 21 }).format(value))) + (options.unit ? ` ${options.unit}` : '');
    const contextText = measurementContext(options, data, format);
    const columns = dataColumns(options, data, format);
    const root = document.createElement('div');
    root.className = `np-chart${options.detail==='essential'?' np-essential':''}${options.animate === false ? '' : ' np-animate'}`;
    root.style.color = theme.ink;
    root.style.setProperty('--np-bg', theme.background);
    root.style.setProperty('--np-ink', theme.ink);
    const style = document.createElement('style');
    style.textContent = css;
    root.append(style);
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 640 360');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-labelledby', `${this.id}-title`);
    svg.setAttribute('aria-describedby', `${this.id}-desc`);
    svg.setAttribute('font-family', 'system-ui, -apple-system, sans-serif');
    root.append(svg);
    const el: RenderContext['el'] = (tag, attrs = {}, parent = svg, text) => {
      const node = document.createElementNS(NS, tag);
      for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(tag === 'text' && key === 'font-size' && Number.isFinite(Number(value)) ? Math.max(12, Number(value)) : value));
      if (text !== undefined) node.textContent = text;
      parent.append(node);
      return node;
    };
    const title = options.title ?? `${chartTypes[options.type].name} chart`;
    el('title', { id: `${this.id}-title` }, svg, title);
    el('desc', { id: `${this.id}-desc` }, svg, options.description ?? `${chartTypes[options.type].encoding} ${contextText} Use arrow keys to explore observations; Enter to select. An exact data table follows the chart.`);
    el('rect', { width: 640, height: 360, rx: 4, fill: theme.background });
    const tooltip = document.createElement('div');
    tooltip.className = 'np-tooltip';
    tooltip.id = `${this.id}-tooltip`;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.hidden = true;
    root.append(tooltip);
    const marks: SVGElement[] = [];
    const details = (p: DataPoint, index: number): string => {
      const date = p.date ? ` · ${new Date(p.date + 'T00:00:00Z').toLocaleDateString('en', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}` : '';
      const target = targetOf(p, options);
      const temporal = ['sundial', 'season-wheel', 'phenology', 'daylight'].includes(options.type);
      const value = temporal && p.value === null ? '' : `\n${format(p.value)}${target ? ` / ${format(target)}` : ''}`;
      const extra = columns.filter(column => !['Observation', 'Date', 'Value', 'Target'].includes(column.header)).map(column => `${column.header}: ${column.read(p, index)}`);
      return `${pointLabel(p, index)}${date}${value}${extra.length ? '\n'+extra.join('\n') : ''}`;
    };
    const mark: RenderContext['mark'] = (node, point, index) => {
      node.classList.add('np-mark');
      node.dataset.index = String(index);
      node.setAttribute('tabindex', marks.length === 0 ? '0' : '-1');
      node.setAttribute('role', 'button');
      node.setAttribute('aria-pressed', 'false');
      node.setAttribute('aria-label', details(point, index).replace('\n', ': '));
      node.setAttribute('aria-describedby', tooltip.id);
      marks.push(node);
    };
    // Compact only visual labels. Readings, tables, and accessibility text retain precision.
    const visualFormat = (value: number | null) => {
      const exact = format(value);
      return value !== null && !options.formatValue && exact.length > 18
        ? value.toExponential(2) + (options.unit ? ` ${options.unit}` : '') : exact;
    };
    const context: RenderContext = { svg, data, options, theme, id: this.id, width: 640, height: 360, el, mark, format: visualFormat };
    if (data.length) renderers[options.type](context);
    else {
      el('circle', { cx: 320, cy: 145, r: 32, fill: theme.grid, opacity: .5 });
      el('path', { d: 'M320 163 V135 Q341 123 336 141 Q328 148 320 143 M320 151 Q298 143 307 132 Q319 134 320 144', fill: 'none', stroke: theme.colors[0], 'stroke-width': 2 });
      el('text', { x: 320, y: 213, 'text-anchor': 'middle', fill: theme.ink, 'font-size': 16 }, svg, 'Room to grow');
      el('text', { x: 320, y: 240, 'text-anchor': 'middle', fill: theme.muted, 'font-size': 12 }, svg, 'Add your first observation to begin.');
    }
    // Keep keyboard exploration in normalized input order, even in grouped layouts.
    marks.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
    marks.forEach((node, i) => node.setAttribute('tabindex', i === 0 ? '0' : '-1'));
    const table = document.createElement('table');
    table.className = `np-table${options.showTable ? '' : ' np-sr-only'}`;
    const caption = table.createCaption();
    caption.textContent = `${title} — exact data`;
    const head = table.createTHead().insertRow();
    columns.forEach(column => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = column.header; head.append(th); });
    const body = table.createTBody();
    data.forEach((point, i) => {
      const row = body.insertRow();
      columns.forEach(column => { row.insertCell().textContent = column.read(point, i); });
    });
    if (contextText) {
      const foot = table.createTFoot().insertRow().insertCell();
      foot.colSpan = columns.length;
      foot.textContent = contextText;
    }
    table.id = `${this.id}-table`;
    const inspector = document.createElement('div');
    inspector.className = 'np-inspector';
    const controls = document.createElement('div');
    controls.className = 'np-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Chart inspection controls');
    const control = (text: string, label: string) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = text; button.setAttribute('aria-label', label); controls.append(button); return button; };
    const previous = control('Previous', 'Previous observation');
    const next = control('Next', 'Next observation');
    const clear = control('Clear', 'Clear selection');
    const tableToggle = control(options.showTable ? 'Hide data' : 'Show data', 'Toggle chart data table');
    tableToggle.setAttribute('aria-expanded', String(!!options.showTable));
    tableToggle.setAttribute('aria-controls', table.id);
    const reading = document.createElement('p');
    reading.className = 'np-reading';
    reading.setAttribute('role', 'status');
    reading.textContent = marks.length ? 'Select a mark, or use Next to explore. Scroll the chart horizontally on small screens.' : 'No observations yet.';
    const card=document.createElement('div');card.className='np-observation-card';
    const copy=document.createElement('div');copy.className='np-observation-copy';
    const heading=document.createElement('strong');heading.className='np-observation-heading';heading.textContent='Explore an observation';
    reading.textContent=marks.length?(interactionHints[options.type]??reading.textContent):'No observations yet.';
    copy.append(heading,reading);card.append(copy);inspector.append(card,controls);
    if (options.interactive !== false) root.append(inspector);
    root.append(table);
    previous.disabled = next.disabled = !marks.length;
    clear.disabled = true;
    let selected = -1;
    const show = (node: SVGElement, event?: PointerEvent) => {
      const p = data[Number(node.dataset.index)];
      tooltip.textContent = details(p, Number(node.dataset.index));
      tooltip.hidden = false;
      const bounds = root.getBoundingClientRect(), point = node.getBoundingClientRect();
      const x = event ? event.clientX - bounds.left : point.left + point.width / 2 - bounds.left;
      const y = event ? event.clientY - bounds.top : point.top - bounds.top;
      const half = Math.min(tooltip.offsetWidth / 2 + 8, root.clientWidth / 2);
      tooltip.style.left = `${root.scrollLeft + Math.max(half, Math.min(root.clientWidth - half, x))}px`;
      tooltip.style.top = `${root.scrollTop + Math.max(tooltip.offsetHeight + 8, y - 12)}px`;
    };
    const getMark = (target: EventTarget | null) => target instanceof Element ? target.closest<SVGElement>('.np-mark') : null;
    const pointer = (event: PointerEvent) => { const node = getMark(event.target); if (node) show(node, event); else tooltip.hidden = true; };
    const focus = (event: FocusEvent) => { const node = getMark(event.target); if (node) { marks.forEach(m => m.setAttribute('tabindex', m === node ? '0' : '-1')); show(node); } };
    const hide = () => { tooltip.hidden = true; };
    const select = (node: SVGElement) => {
      const index = Number(node.dataset.index), point = Object.freeze({ ...data[index] });
      selected = marks.indexOf(node);
      root.classList.add('np-has-selection');
      marks.forEach(mark => mark.setAttribute('aria-pressed', String(mark === node)));
      svg.querySelectorAll<SVGElement>('[data-series]').forEach(layer => layer.classList.toggle('np-series-muted', layer.dataset.series !== (point.track ?? 'Series')));
      reading.textContent = `${index + 1} of ${data.length} · ${details(data[index], index)}`;
      const heading=inspector.querySelector('.np-observation-heading');if(heading)heading.textContent='Selected observation';
      clear.disabled = false;
      options.onSelect?.(point, index);
      root.dispatchEvent(new CustomEvent('natureplot:select', { bubbles: true, detail: { point, index, chart: this } }));
    };
    const previousStep = () => { if (marks.length) select(marks[(selected < 0 ? marks.length - 1 : selected - 1 + marks.length) % marks.length]); };
    previous.addEventListener('click', previousStep);
    const nextStep = () => { if (marks.length) select(marks[(selected + 1) % marks.length]); };
    next.addEventListener('click', nextStep);
    const clearSelection = () => { selected = -1; root.classList.remove('np-has-selection'); svg.querySelectorAll('.np-series-muted').forEach(layer => layer.classList.remove('np-series-muted'));  marks.forEach(mark => mark.setAttribute('aria-pressed', 'false')); reading.textContent = interactionHints[options.type]??'Selection cleared. Select a mark or use Next to explore.'; const heading=inspector.querySelector('.np-observation-heading');if(heading)heading.textContent='Explore an observation'; clear.disabled = true; hide(); };
    clear.addEventListener('click', clearSelection);
    const toggleTable = () => { const visible = table.classList.toggle('np-sr-only') === false; tableToggle.textContent = visible ? 'Hide data' : 'Show data'; tableToggle.setAttribute('aria-expanded', String(visible)); };
    tableToggle.addEventListener('click', toggleTable);
    const click = (event: MouseEvent) => { const node = getMark(event.target); if (node) { show(node); select(node); } };
    const keydown = (event: KeyboardEvent) => {
      const node = getMark(event.target);
      if (!node) return;
      const index = marks.indexOf(node);
      let next = index;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % marks.length;
      else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + marks.length) % marks.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = marks.length - 1;
      else if (['Enter', ' '].includes(event.key)) { event.preventDefault(); show(node); select(node); return; }
      else if (event.key === 'Escape') { clearSelection(); return; }
      else return;
      event.preventDefault();
      marks[next].focus();
    };
    root.addEventListener('pointermove', pointer);
    root.addEventListener('pointerleave', hide);
    root.addEventListener('focusin', focus);
    root.addEventListener('focusout', hide);
    root.addEventListener('click', click);
    root.addEventListener('keydown', keydown);
    this.cleanup?.();
    if (this.root) this.root.replaceWith(root); else this.container.append(root);
    this.root = root;
    this.svg = svg;
    this.options = options;
    this.normalized = data;
    this.selectObservation = index => { const node=marks.find(mark=>Number(mark.dataset.index)===index);if(node)select(node); };
    this.cleanup = () => {
      previous.removeEventListener('click', previousStep); next.removeEventListener('click', nextStep);
      clear.removeEventListener('click', clearSelection); tableToggle.removeEventListener('click', toggleTable);
      root.removeEventListener('pointermove', pointer); root.removeEventListener('pointerleave', hide);
      root.removeEventListener('focusin', focus); root.removeEventListener('focusout', hide);
      root.removeEventListener('click', click); root.removeEventListener('keydown', keydown);
    };
  }
}
export function createChart(container: string | HTMLElement, options: ChartOptions): NaturePlot { return new NaturePlot(container, options); }
export default NaturePlot;
