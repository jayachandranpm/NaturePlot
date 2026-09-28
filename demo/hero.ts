/** Decorative golden-angle seed head; the linked chart provides the data view. */
export function mountPhyllotaxisHero(): void {
  const host = document.querySelector<SVGGElement>('#hero-phyllotaxis-seeds');
  if (!host) return;

  const ns = 'http://www.w3.org/2000/svg';
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const seeds = document.createDocumentFragment();

  for (let i = 0; i < 120; i++) {
    const angle = i * goldenAngle;
    const radius = 14 * Math.sqrt(i + 0.5);
    const x = 260 + Math.cos(angle) * radius;
    const y = 205 + Math.sin(angle) * radius;
    const palette = i < 27 ? 'gold' : i < 72 ? 'sage' : 'moss';
    const seed = document.createElementNS(ns, 'g');
    seed.setAttribute('transform', `translate(${x.toFixed(3)} ${y.toFixed(3)}) rotate(${(angle * 180 / Math.PI + 35).toFixed(3)})`);

    const body = document.createElementNS(ns, 'path');
    body.setAttribute('d', 'M-9 0C-5-7 5-7 9 0C5 7-5 7-9 0Z');
    body.setAttribute('fill', `url(#hero-seed-${palette})`);

    const seam = document.createElementNS(ns, 'path');
    seam.setAttribute('d', 'M-6 0Q0-1.5 6 0');
    seam.setAttribute('fill', 'none');
    seam.setAttribute('stroke', 'var(--seed-vein)');
    seam.setAttribute('stroke-width', '0.65');
    seam.setAttribute('opacity', '0.45');

    seed.append(body, seam);
    seeds.append(seed);
  }

  host.replaceChildren(seeds);
}
