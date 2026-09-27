import { describe, expect, it } from 'vitest';
import { NaturePlot } from '../src';
import { types, options } from '../demo/samples';
import { pages, pageBySlug, parseRoute, code } from '../demo/docs/content';
import { createSearchIndex } from '../demo/docs/search';

describe('documentation navigation and search', () => {
  it('resolves every internal content link to a real page and section', () => {
    expect(new Set(pages.map(page => page.slug)).size).toBe(pages.length);
    for (const page of pages) {
      expect(new Set(page.sections.map(section => section.id)).size).toBe(page.sections.length);
      const template = document.createElement('template');
      template.innerHTML = page.sections.map(section => section.html).join('');
      for (const link of template.content.querySelectorAll<HTMLAnchorElement>('a[href^="#/"]')) {
        const route = parseRoute(link.getAttribute('href')!);
        const destination = pageBySlug.get(route.page);
        expect(destination, link.getAttribute('href')!).toBeDefined();
        if (route.section) expect(destination!.sections.some(section => section.id === route.section)).toBe(true);
      }
    }
    expect(parseRoute('')).toEqual({ page: 'introduction', section: undefined });
    expect(parseRoute('#/garden/create')).toEqual({ page: 'garden', section: 'create' });
  });

  it('finds API names, related concepts, and spelling errors across all sections', () => {
    const { index, entries } = createSearchIndex();
    expect(entries.length).toBe(pages.reduce((count, page) => count + page.sections.length, 0));
    expect(index.search('setTheme').slice(0, 5).map(result => result.page)).toContain('methods');
    expect(index.search('calender').slice(0, 5).map(result => result.page)).toContain('data');
    expect(index.search('dark theme').slice(0, 3).map(result => result.page)).toContain('themes');
    expect(index.search('sundial').slice(0, 3).map(result => result.page)).toContain('sundial');
    expect(index.search('ancient civilizations').slice(0, 3).map(result => result.page)).toContain('field-notes');
    for(const [query,page] of [['onboarding','phenology'],['delivery provider','petal-box'],['stock','waterline'],['returns','fern']])
      expect(index.search(query).slice(0,5).map(result=>result.page)).toContain(page);
    expect(index.search('zzqvnonexistent')).toEqual([]);
    expect(index.search('<img src=x onerror=alert(1)>')).toEqual([]);
  });

  it('preserves code exactly while escaping markup for display and copying', () => {
    const source = '<script>\n  const name = "<img src=x onerror=alert(1)>";\n</script>';
    const template = document.createElement('template');
    template.innerHTML = code(source, 'example.html');
    expect(template.content.querySelector('code')!.textContent).toBe(source);
    expect(template.content.querySelector('script, img')).toBeNull();
  });
});

describe('documentation examples', () => {
  it.each(types)('renders the %s example and its refreshed data', type => {
    const host = document.createElement('div');
    const chart = new NaturePlot(host, options(type));
    expect(host.querySelector('svg')).not.toBeNull();
    expect(chart.data.length).toBeGreaterThan(0);
    const next = options(type, true);
    if (type === 'bloom') next.max = Math.max(10, ...next.data.map(point => point.value ?? 0));
    expect(() => chart.update(next)).not.toThrow();
    expect(chart.toSVG()).not.toMatch(/NaN|Infinity/);
    chart.destroy();
  });
});
