import { icon, type IconName } from './icons';

const controls = new WeakMap<HTMLSelectElement, { sync(): void; focus(): void }>();

/** Keep the native select as the data source; enhance only the demo's presentation. */
export function enhanceSelect(select: HTMLSelectElement, icons: Record<string, IconName> = {}): void {
  if (controls.has(select)) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'select-control';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.id = `${select.id}-trigger`;
  trigger.className = 'select-trigger';
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const list = document.createElement('div');
  list.id = `${select.id}-options`;
  list.className = 'select-options';
  list.setAttribute('role', 'listbox');
  list.hidden = true;
  trigger.setAttribute('aria-controls', list.id);
  const labels = Array.from(select.labels ?? []);
  const labelIds = labels.map((label, i) => {
    label.id ||= `${select.id}-label-${i}`;
    label.htmlFor = trigger.id;
    return label.id;
  }).join(' ');
  if (labelIds) {
    trigger.setAttribute('aria-labelledby', labelIds);
    list.setAttribute('aria-labelledby', labelIds);
  } else {
    const name = select.getAttribute('aria-label') ?? 'Choose an option';
    trigger.setAttribute('aria-label', name);
    list.setAttribute('aria-label', name);
  }
  select.before(wrapper);
  wrapper.append(select, trigger);
  document.body.append(list);
  select.hidden = true;
  let active = select.selectedIndex;
  let opened = false;
  let prefix = '';
  let lastTyped = 0;
  const options = Array.from(select.options);
  const rows = options.map((option, index) => {
    const row = document.createElement('div');
    row.id = `${list.id}-${index}`;
    row.className = 'select-option';
    row.setAttribute('role', 'option');
    row.setAttribute('aria-selected', 'false');
    if (option.disabled) row.setAttribute('aria-disabled', 'true');
    const name = icons[option.value];
    if (name) row.innerHTML = icon(name);
    const copy = document.createElement('span');
    copy.className = 'select-option-copy';
    const [title, ...description] = option.text.split(' · ');
    const text = document.createElement('span');
    text.textContent = title;
    copy.append(text);
    if (description.length) {
      const detail = document.createElement('small');
      detail.textContent = description.join(' · ');
      copy.append(detail);
    }
    row.append(copy);
    row.insertAdjacentHTML('beforeend', `<span class="select-check">${icon('check')}</span>`);
    row.addEventListener('pointerdown', event => event.preventDefault());
    row.addEventListener('click', () => { if (!option.disabled) { active = index; close(true); trigger.focus({ preventScroll: true }); } });
    list.append(row);
    return row;
  });
  function sync(): void {
    const option = options[select.selectedIndex];
    trigger.replaceChildren();
    if (option && icons[option.value]) trigger.innerHTML = icon(icons[option.value]);
    const label = document.createElement('span');
    label.className = 'select-value';
    label.textContent = option?.text.split(' · ')[0] ?? 'Choose an option';
    trigger.append(label);
    trigger.insertAdjacentHTML('beforeend', `<span class="select-chevron">${icon('caret-down')}</span>`);
    trigger.disabled = select.disabled;
    rows.forEach((row, i) => row.setAttribute('aria-selected', String(i === select.selectedIndex)));
    if (!opened) active = select.selectedIndex;
  }
  function highlight(index: number): void {
    active = index;
    rows.forEach((row, i) => row.classList.toggle('is-active', i === active));
    const row = rows[active];
    if (!row) return;
    trigger.setAttribute('aria-activedescendant', row.id);
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight;
  }
  function open(): void {
    if (opened || select.disabled) return;
    opened = true;
    list.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    const rect = trigger.getBoundingClientRect();
    const below = window.innerHeight - rect.bottom - 16;
    const above = rect.top - 16;
    const upward = below < 220 && above > below;
    const height = Math.min(336, Math.max(80, upward ? above : below));
    list.style.width = `${Math.min(Math.max(rect.width, 264), window.innerWidth - 24)}px`;
    list.style.maxHeight = `${height}px`;
    list.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - list.offsetWidth - 12))}px`;
    list.style.top = `${upward ? rect.top - list.offsetHeight - 6 : rect.bottom + 6}px`;
    const selected = select.selectedIndex < 0 ? 0 : select.selectedIndex;
    if (rows[selected]) list.scrollTop = rows[selected].offsetTop - (list.clientHeight - rows[selected].offsetHeight) / 2;
    highlight(selected);
  }
  function close(commit = false): void {
    if (!opened) return;
    opened = false;
    list.hidden = true;
    prefix = '';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
    if (commit && active >= 0 && !options[active].disabled && select.selectedIndex !== active) {
      select.selectedIndex = active;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sync();
  }
  trigger.addEventListener('click', () => opened ? close() : open());
  trigger.addEventListener('keydown', event => {
    const key = event.key;
    if (key === 'Tab') { close(true); return; }
    if (key === 'Escape') { if (opened) { event.preventDefault(); event.stopPropagation(); close(); } return; }
    if (key === 'Enter' || (key === ' ' && !prefix)) {
      event.preventDefault();
      opened ? close(true) : open();
      return;
    }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
      event.preventDefault();
      const wasOpen = opened;
      open();
      const direction = key === 'ArrowUp' || key === 'End' ? -1 : 1;
      let next = key === 'Home' ? 0 : key === 'End' ? options.length - 1 : wasOpen ? active + direction : active;
      while (next >= 0 && next < options.length && options[next].disabled) next += direction;
      if (next >= 0 && next < options.length) highlight(next);
      return;
    }
    if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      prefix = now - lastTyped > 650 ? key.toLowerCase() : prefix + key.toLowerCase();
      lastTyped = now;
      open();
      const repeated = [...prefix].every(char => char === prefix[0]);
      const query = repeated ? prefix[0] : prefix;
      const start = repeated ? active + 1 : active;
      for (let offset = 0; offset < options.length; offset++) {
        const index = (start + offset + options.length) % options.length;
        if (!options[index].disabled && options[index].text.toLowerCase().startsWith(query)) { highlight(index); break; }
      }
    }
  });
  trigger.addEventListener('blur', () => close());
  document.addEventListener('pointerdown', event => { if (!wrapper.contains(event.target as Node) && !list.contains(event.target as Node)) close(); });
  window.addEventListener('resize', () => close());
  window.addEventListener('scroll', event => { if (event.target !== list) close(); }, true);
  select.addEventListener('change', sync);
  controls.set(select, { sync, focus: () => trigger.focus({ preventScroll: true }) });
  sync();
}

export function syncSelect(select: HTMLSelectElement): void { controls.get(select)?.sync(); }
export function focusSelect(select: HTMLSelectElement): void { controls.get(select)?.focus(); }
