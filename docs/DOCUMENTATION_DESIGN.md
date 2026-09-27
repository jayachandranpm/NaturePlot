# NaturePlot.js documentation design

Built September 2026. The documentation is a separate Vite entry at `/docs/`, with 64 pages and section-level hash routes that work on ordinary static hosting.

## Research and design references

- [Stripe documentation](https://docs.stripe.com/): task-oriented entry points and quickstarts that lead into reference material. Applied as a short path from installation to first chart, with deeper API pages nearby.
- [Linear documentation](https://linear.app/docs): clear groupings and predictable product navigation. Applied as a persistent grouped sidebar with an explicit current-page state.
- [Supabase documentation](https://supabase.com/docs): distinguish getting started, practical guides, and API reference. Applied to the information hierarchy and framework integration guidance.
- [Phosphor Icons](https://github.com/phosphor-icons/core): a consistent, open-source SVG icon vocabulary. Selected regular-weight icons are bundled locally, replacing emoji and ad hoc UI glyphs on the showcase.
- [MiniSearch](https://github.com/lucaong/minisearch): small client-side full-text indexing with prefix and fuzzy matching. Search indexes every documentation section and runs locally without a service.

These references inform navigation and interaction patterns. The botanical compositions, type treatment, colors, content, and chart illustrations belong to NaturePlot.

## Visual direction

Warm paper and quiet greens in light mode; deep forest surfaces and muted sage in dark mode. Instrument Serif supplies an editorial voice for titles, while DM Sans keeps instructions, navigation, and tables readable. Google Fonts are optional: local serif and sans-serif fallbacks remain usable if the network is unavailable.

The introduction uses a real Garden chart and four rendered chart miniatures. Chart guides show live examples with refresh and data-table controls. Themes include interactive palette swatches. Field notes include a vector shadow study, an actual Garden, and source-linked research cards. Diagrams communicate measurement or lifecycle rather than serving as unrelated decoration.

## Behavior

- Persistent light/dark choice shared with the showcase, following the system preference until explicitly changed. Storage failures degrade to a working per-page choice; storage events synchronize open tabs.
- Global documentation search via the search button, Cmd/Ctrl+K, or `/` when not typing. Arrow keys select, Enter opens a specific section, and Escape closes. Search result text and user queries are escaped.
- Grouped desktop sidebar, scroll-aware page outline, previous/next links, direct section links, and a modal navigation drawer on small screens.
- A native modal search dialog with a labeled combobox and listbox, a live result status, and an empty state.
- Copyable code blocks retain their original text. A clipboard failure selects the code and gives an honest manual-copy instruction.
- Chart examples preserve the core library's keyboard behavior and exact data tables. Theme changes redraw examples using an application-supplied dark palette.
- A useful unknown-page screen, meaningful page titles, skip navigation, visible focus, and reduced-motion support.

## Content boundaries

Installation explicitly uses a local package or tarball. The project has not published a package to npm. The fifty built-in chart APIs include all twelve instrument concepts. The source notebook retains its original proposal language under an explicit implementation-status update. Scientific adapters remain future work. The documentation states chart limits, missing-data semantics, decorative versus measured dimensions, and historical attribution.

## Maintenance

- Edit content, sections, and chart guide definitions in `demo/docs/content.ts`.
- Shared chart samples live in `demo/samples.ts`; examples instantiate the actual public API.
- Route resolution and search consume the same page registry, avoiding a separate stale search catalog.
- `tests/documentation.test.ts` checks internal links, section identifiers, search relevance and typo handling, code escaping, and all fifty rendered/refreshed examples.
- `npm run build` emits the library to `dist/` and both web entry points to `site/`.
- Phosphor and MiniSearch are website development dependencies only. License notices are in `docs/THIRD_PARTY.md` and copied into the static output.


## v0.3 readability and exploration

Body copy is 16px and primary navigation/controls are at least 14px. The expanded chart gallery adds text search and ten analytical categories. All fifty charts expose the shared observation inspector. Small screens retain a 640px diagram inside a horizontal scroll region so labels remain readable; HTML controls and readings stay within the viewport. Thirty Living systems guides add biomimicry, spatial fields, distributions, hierarchies, and flows. The source-linked field notes and fifty-chart plan record the research.
