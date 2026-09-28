import { icon } from '../icons';
import { escapeHTML, pageLabel, type Page } from './content';
import { markdownURL, pageToMarkdown, siteURL } from './markdown';
import './page-actions.css';

export function assistantPrompt(page: Page): string {
  return `Help me use NaturePlot.js. Read the ${pageLabel(page)} guide at ${markdownURL(page.slug)}. Use ${siteURL}llms.txt to find related documentation. Explain how this applies to my project, use only documented APIs, and cite the relevant guides. Start with a short summary and ask what I want to build. If you cannot access the links, ask me to paste the Markdown instead of guessing.`;
}

// These web-app links are convenience shortcuts, not provider API integrations.
// Always keep a copyable prompt available if a service changes its URL handling.
export function assistantLinks(page: Page) {
  const prompt = assistantPrompt(page);
  const withPrompt = (base: string) => { const url = new URL(base); url.searchParams.set('q', prompt); return url.href; };
  return [
    { id: 'chatgpt', name: 'ChatGPT', symbol: 'spiral' as const, href: withPrompt('https://chatgpt.com/'), hint: 'Ask with this guide' },
    { id: 'perplexity', name: 'Perplexity', symbol: 'compass' as const, href: withPrompt('https://www.perplexity.ai/search'), hint: 'Explore with sources' },
    { id: 'gemini', name: 'Gemini', symbol: 'sparkle' as const, href: 'https://gemini.google.com/app', hint: 'Copy context, open, and paste' },
    { id: 'grok', name: 'Grok · xAI', symbol: 'star' as const, href: withPrompt('https://grok.com/'), hint: 'Ask with this guide' },
    { id: 'claude', name: 'Claude', symbol: 'sun' as const, href: withPrompt('https://claude.ai/new'), hint: 'Ask with this guide' },
  ];
}

export function pageActionsHTML(page: Page): string {
  return `<div class="doc-actions" aria-label="Page tools">
    <button class="doc-action-button" type="button" data-copy-page>${icon('copy')} Copy page</button>
    <details class="ask-ai">
      <summary class="doc-action-button">${icon('sparkle')} Ask about NaturePlot ${icon('caret-down')}</summary>
      <div class="ask-ai-panel">
        <div class="ask-ai-heading"><strong>Take this guide with you</strong><span>${escapeHTML(pageLabel(page))}</span></div>
        <div class="ask-ai-providers">${assistantLinks(page).map(provider => `<a href="${escapeHTML(provider.href)}" target="_blank" rel="noopener noreferrer" data-ai-provider="${provider.id}"><span class="ai-provider-icon">${icon(provider.symbol)}</span><span><strong>${provider.name}</strong><small>${provider.hint}</small></span>${icon('arrow-up-right')}</a>`).join('')}</div>
        <p class="ask-ai-hint">Opens in a new tab. If the prompt is not filled in, copy it below.</p>
        <details class="ai-prompt-fallback"><summary>Copy a prompt for any assistant ${icon('caret-down')}</summary><textarea readonly aria-label="NaturePlot assistant prompt" spellcheck="false">${escapeHTML(assistantPrompt(page))}</textarea><button type="button" class="doc-action-button" data-copy-prompt>${icon('copy')} Copy prompt</button></details>
        <p class="ai-action-status" role="status"></p>
        <div class="ai-resources"><a href="./${page.slug}.md" target="_blank" rel="noopener">${icon('code')} View page as Markdown</a><a href="../llms.txt" target="_blank" rel="noopener">${icon('book-open')} llms.txt</a><a href="../llms-full.txt" target="_blank" rel="noopener">${icon('stack')} Full documentation</a></div>
      </div>
    </details>
    <div class="page-copy-fallback" hidden><label>Copy this page as Markdown<textarea readonly spellcheck="false"></textarea></label></div>
  </div>`;
}

export function mountPageActions(host: HTMLElement, page: Page, toast: (message: string) => void): () => void {
  const actions = host.querySelector<HTMLElement>('.doc-actions')!;
  const details = actions.querySelector<HTMLDetailsElement>('.ask-ai')!;
  const trigger = details.querySelector<HTMLElement>('summary')!;
  const promptFallback = actions.querySelector<HTMLDetailsElement>('.ai-prompt-fallback')!;
  const promptField = promptFallback.querySelector('textarea')!;
  const status = actions.querySelector<HTMLElement>('.ai-action-status')!;
  const prompt = assistantPrompt(page);
  let markdown: string | undefined;
  const pageMarkdown = () => markdown ??= pageToMarkdown(page, document);
  const copy = async (value: string): Promise<boolean> => {
    try { await navigator.clipboard.writeText(value); return true; } catch { return false; }
  };
  actions.querySelector('[data-copy-page]')!.addEventListener('click', async () => {
    if (await copy(pageMarkdown())) toast('Page copied as Markdown.');
    else {
      const fallback = actions.querySelector<HTMLElement>('.page-copy-fallback')!;
      const textarea = fallback.querySelector('textarea')!;
      fallback.hidden = false;
      textarea.value = pageMarkdown(); textarea.focus(); textarea.select();
      toast('Markdown selected. Use your browser’s copy command.');
    }
  });
  actions.querySelector('[data-copy-prompt]')!.addEventListener('click', async () => {
    if (await copy(promptField.value)) status.textContent = 'Prompt copied. Paste it into your assistant.';
    else { promptField.focus(); promptField.select(); status.textContent = 'Prompt selected. Use your browser’s copy command.'; }
  });
  actions.querySelector('[data-ai-provider="gemini"]')!.addEventListener('click', async () => {
    // Start copying during the click; the anchor opens normally without an async popup.
    const context = `${prompt}\n\nDocumentation for reference:\n\n${pageMarkdown()}`;
    if (await copy(context)) {
      status.textContent = 'Page context copied. Paste it into Gemini to begin.';
      toast('Context copied. Paste it into Gemini.');
    } else {
      promptFallback.open = true; promptField.value = context;
      status.textContent = 'Copy the context below, then paste it into Gemini.';
      toast('Clipboard unavailable. The context is ready to copy in the menu.');
    }
  });
  const outside = (event: PointerEvent) => { if (!details.contains(event.target as Node)) details.open = false; };
  document.addEventListener('pointerdown', outside);
  details.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); details.open = false; trigger.focus(); }
  });
  details.addEventListener('focusout', event => {
    if (event.relatedTarget instanceof Node && !details.contains(event.relatedTarget)) details.open = false;
  });
  return () => document.removeEventListener('pointerdown', outside);
}
