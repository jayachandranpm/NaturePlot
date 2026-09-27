import { afterEach, describe, expect, it, vi } from 'vitest';
import { enhanceSelect, syncSelect } from '../demo/select';

function setup() {
  document.body.innerHTML = '<label for="chart">Choose your chart</label><select id="chart"><option value="fern">Fern · Comparison</option><option disabled>Unavailable</option><option value="garden" selected>Garden · Calendar</option><option value="glacier">Glacier · Trend</option></select><button id="outside">Outside</button>';
  const select = document.querySelector('select')!;
  enhanceSelect(select, { fern: 'plant', garden: 'plant', glacier: 'snowflake' });
  const trigger = document.querySelector<HTMLButtonElement>('[role=combobox]')!;
  const key = (key: string) => trigger.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  const active = () => document.getElementById(trigger.getAttribute('aria-activedescendant') ?? '')?.textContent;
  return { select, trigger, key, active };
}
afterEach(() => { document.body.replaceChildren(); });

describe('demo chart dropdown', () => {
  it('connects its label, retains the native value, and renders the selected SVG', () => {
    const { select, trigger } = setup();
    expect(select.hidden).toBe(true);
    expect(select.value).toBe('garden');
    expect(document.querySelector('label')!.htmlFor).toBe(trigger.id);
    expect(trigger.querySelector('svg')).not.toBeNull();
    expect(trigger.textContent).toBe('Garden');
    trigger.click();
    expect(document.querySelector('[role=option][aria-selected=true]')?.textContent).toBe('GardenCalendar');
  });

  it('skips disabled choices and commits once on Enter, leaving focus on the trigger', () => {
    const { select, trigger, key, active } = setup();
    const change = vi.fn(); select.addEventListener('change', change);
    trigger.focus(); key('ArrowDown'); key('ArrowUp');
    expect(active()).toBe('FernComparison');
    expect(select.value).toBe('garden');
    key('Enter');
    expect(select.value).toBe('fern');
    expect(change).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
    expect(trigger.hasAttribute('aria-activedescendant')).toBe(false);
  });

  it('cancels with Escape and outside click; Tab commits the pending keyboard choice', () => {
    const { select, trigger, key } = setup();
    key('End'); key('Escape');
    expect(select.value).toBe('garden');
    key('Home');
    document.querySelector('#outside')!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(select.value).toBe('garden');
    key('End'); key('Tab');
    expect(select.value).toBe('glacier');
  });

  it('supports type-ahead and pointer selection', () => {
    const { select, trigger, key, active } = setup();
    key('g'); key('l');
    expect(active()).toBe('GlacierTrend');
    key('Enter');
    expect(select.value).toBe('glacier');
    trigger.click();
    document.querySelector<HTMLElement>('[role=option]')!.click();
    expect(select.value).toBe('fern');
    expect(trigger.textContent).toBe('Fern');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('reflects chart changes initiated elsewhere in the page', () => {
    const { select, trigger } = setup();
    select.value = 'fern'; syncSelect(select);
    expect(trigger.textContent).toBe('Fern');
    expect(document.querySelector('[role=option][aria-selected=true]')?.textContent).toBe('FernComparison');
  });
});
