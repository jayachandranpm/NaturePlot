import MiniSearch from 'minisearch';
import { pages, pageLabel } from './content';

export interface SearchEntry { id: string; page: string; anchor: string; title: string; heading: string; group: string; content: string; keywords: string }
// Index rendered text, never markup or icon paths. All source content is authored locally.
export function createSearchIndex(): { index: MiniSearch<SearchEntry>; entries: SearchEntry[] } {
  const text = (html: string): string => {
    const template = document.createElement('template');
    template.innerHTML = html;
    template.content.querySelectorAll('svg, button').forEach(node => node.remove());
    return (template.content.textContent ?? '').replace(/\s+/g, ' ').trim();
  };
  const entries = pages.flatMap(page => page.sections.map(section => ({
    id: `${page.slug}/${section.id}`, page: page.slug, anchor: section.id,
    title: pageLabel(page), heading: section.title, group: page.group,
    content: `${page.description} ${text(section.html)}`, keywords: page.keywords ?? '',
  })));
  const index = new MiniSearch<SearchEntry>({
    fields: ['title', 'heading', 'keywords', 'content'],
    storeFields: ['page', 'anchor', 'title', 'heading', 'group', 'content'],
    searchOptions: { boost: { title: 5, heading: 3, keywords: 2 }, prefix: true, fuzzy: 0.2, combineWith: 'AND' },
  });
  index.addAll(entries);
  return { index, entries };
}
