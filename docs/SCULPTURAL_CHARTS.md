# Sculptural charts — design and implementation record

> Historical design record. Version 0.7.0 replaces generated images with native SVG in the library and site. See [the current review](NATIVE_SVG_REVIEW.md).

Revisit sixteen charts named in the feedback: Balance, Cord Ledger, Star Cycle, Firefly, Migration, Murmuration, Pebble, Echo, Isobar, Phenology, Seed Ledger, Phyllotaxis, Leaf Veins, Bamboo, Petal Box, and Sundial. Daylight is excluded per the correction.

1. Generate original transparent production components with photographic materials, then inspect and save the unmodified atlases. These assets must appear inside the live charts, not only in reference panels.
2. Add an optional illustration pack to the library, shared sprite definitions and explicit measurement anchors. Preserve native value geometry, input contracts, keyboard access, missing data, and exact data tables.
3. Compose dimensional instruments, plants, insects, birds, stones, and wave forms for the sixteen renderers. Keep decorative surfaces separate from quantities; a photograph is never a new observation.
4. Make interactivity visible with selectable visual focus, chart-specific instructions, a selected-observation view, and meaningful adjustment examples in the showcase.
5. Verify both illustrated and vector modes, theme changes, all fifty regressions, SVG export, keyboard controls, and the built package. Inspect the sixteen revised live charts in the browser.

Implemented in v0.6.0. Generated assets use the built-in image generation tool (default mode). The three PNGs below are preserved unmodified; SVG symbols crop and reuse their components at runtime. They are AI-generated illustrations in a photographic style, not photographs of measured specimens.

## Review outcome

All sixteen renderers use the generated materials inside the live SVG. Native data anchors preserve the measurement; generated stone textures, seeds inside pods, and other ornament do not introduce observations. Daylight was excluded as requested.

The study explorer includes direct specimen selection, a chart-specific data or cursor slider, a fresh sample button, and Specimen / Vector comparison. Selection updates the accessible inspector and data table. Thin and hollow objects have transparent click targets; keyboard selection remains available. The programmatic equivalent is `chart.select(index)`.

The optional `natureplot/illustrations` pack contains 22 components across three atlases. The core library remains approximately 54 KB gzip; the separate pack is approximately 4.75 MB gzip. The demo loads it asynchronously after the interface starts. Illustrated SVG exports embed each used atlas once. They are self-contained SVGs containing raster artwork; fully vector output remains available through `artwork: 'vector'`.

### Chart decisions

| Chart | Material and measurement |
| --- | --- |
| Balance | Brass pans and beam, walnut support; bars measure amounts and tilt indicates direction. |
| Cord Ledger | Braided flax and dimensional knots; exact denominations and fractional tokens. |
| Star Cycle | Optical star flares; fixed size, intensity and cycle angle, movable cursor. |
| Firefly | Translucent wings and glowing abdomens; fixed event positions and tracks. |
| Migration | Feathered swallows follow route directions; numbered stops retain coordinates and bubble areas. |
| Murmuration | Individual starlings with exact horizontal anchors and collision-aware vertical separation. |
| Pebble | Slate and sandstone specimens on right-continuous cumulative distribution steps. |
| Echo | Reflective water ripples centered on lag-one pairs; unknown pairs stay separate. |
| Isobar | Illustrative mineral surface, interpolated bands, exact survey anchors and labeled contour levels. |
| Phenology | Seeds, sprouts, leaves, buds, flowers and pods for named stages; date anchors and unknown states remain explicit. |
| Seed Ledger | Striped shells over fraction-preserving backing tokens; exact totals remain visible. |
| Phyllotaxis | Sunflower corona, dark seed head and 120 category-colored seed anchors on a golden-angle spiral. |
| Leaf Veins | Veined leaf surfaces connect before/after anchors; direction follows change. |
| Bamboo | Segmented culm and numbered leaves; stem and unit labels reconstruct every integer. |
| Petal Box | Open pod between quartile ticks, strong median and unchanged min/max whiskers. |
| Sundial | Sandstone dial and brass gnomon, exact activity arcs and movable clock-time cursor. |

### Verification

- All fifty original chart regressions retained; the full suite contains 504 passing checks, including 40 illustration-specific checks.
- TypeScript, library and documentation builds pass. ES module and browser IIFE smoke checks cover all 50 vector charts and all 16 illustrated charts, selection, export, and vector fallback.
- All sixteen compositions visually inspected in the browser. Every new slider exercised at its upper limit; direct pan selection, keyboard navigation, specimen/vector comparison, fresh samples, and the documentation preview checked.
- Light and dark appearances inspected. Narrow-screen DOM check: page width equals viewport width; the 640-pixel chart surface scrolls within its container and inspector controls remain visible.
- Browser console reported no errors in the inspected views. Export tests check embedded images, local reference integrity, unique IDs, input preservation, and absence of nonfinite geometry.

## Generation record

## botanical-materials-v2

Saved unmodified at `assets/illustrations/botanical-materials-v2.png`.

```text
Use case: product-mockup. Asset type: production transparent sprite atlas of natural materials for interactive charts. Primary request: exactly 4 columns and 2 rows, 8 isolated objects, equal square cells in a landscape image. Photorealistic museum specimen photography and precise physically based material rendering, exquisite microdetail, tactile three-dimensional form, premium product visualization. NOT a drawing, NOT watercolor, NOT sketch, NOT clip art, NOT flat vector. Each object is fully inside its cell with generous 12% transparent margin on all sides; no overlaps across cells. Consistent soft studio lighting from upper left, contact shading only on the object's own surface. Truly transparent alpha background everywhere outside the objects, NO white paper, NO checkerboard baked in, NO floor, NO cast shadow, NO grid, NO labels, NO numbers or letters, NO border. Clean isolated silhouettes for compositing onto both dark and light chart canvases. Read cells left to right, top to bottom:
Cell 1: One horizontally oriented plump sunflower seed, oval tapering shell, fine ivory and dark brown stripes, convex volume, viewed from above.
Cell 2: One broad fresh green leaf pointing horizontally right, no stem beyond the left tip, translucent branching veins, folded midrib and realistic waxy surface.
Cell 3: One upright young green seedling with two open leaves and very fine exposed roots, delicate dimensional stem, clear anatomical structure.
Cell 4: One upright twig with a closed bud and a small unfolding leaf, natural brown bark, restrained realistic volume.
Cell 5: One straight upright green bamboo culm with six visible raised nodes, no foliage extending sideways, polished cylindrical light and shade, full stalk visible.
Cell 6: One open elongated seed pod pointing horizontally right, two softly curved green husks around a row of seeds, realistic interior fibers and rolled rims, top view.
Cell 7: One sunflower viewed perfectly from above, a rich golden petal corona surrounding an EMPTY TRANSPARENT round center occupying 65 percent of the flower diameter; no seeds in this center because live chart data will fill it.
Cell 8: One upright delicate flowering sprig with one white flower and two green leaves, fine botanical anatomy, full silhouette.
Requested image size 2048 by 1024. Keep the relative grid alignment exact.
```

## instrument-materials-v2

Saved unmodified at `assets/illustrations/instrument-materials-v2.png`.

```text
Use case: product-mockup. Asset type: production transparent sprite atlas of natural materials for interactive charts. Primary request: exactly 3 columns and 2 rows, 6 isolated objects, equal square cells in a landscape image. Photorealistic museum specimen photography and precise physically based material rendering, exquisite microdetail, tactile three-dimensional form, premium product visualization. NOT a drawing, NOT watercolor, NOT sketch, NOT clip art, NOT flat vector. Each object is fully inside its cell with generous 12% transparent margin on all sides; no overlaps across cells. Consistent soft studio lighting from upper left, contact shading only on the object's own surface. Truly transparent alpha background everywhere outside the objects, NO white paper, NO checkerboard baked in, NO floor, NO cast shadow, NO grid, NO labels, NO numbers or letters, NO border. Clean isolated silhouettes for compositing onto both dark and light chart canvases. Read cells left to right, top to bottom:
Cell 1: One isolated vertical antique balance-scale support: beautifully turned dark walnut column, brass pivot at its top, broad low wooden foot at its base. No horizontal beam, no pans, no text. Full silhouette.
Cell 2: One isolated horizontal balance-scale beam: straight warm brass crossbar with finely machined ends and a circular pivot precisely at its center. No support stand and no pans. Perfect horizontal front view.
Cell 3: One isolated suspended weighing pan: shallow brass bowl with curved reflective rim, three fine suspension chains meeting at a point straight above its center. No objects inside the pan. Symmetrical front view, full silhouette.
Cell 4: One straight single length of braided natural flax cord, vertical, with visible twisted fibers, no knots, equal thickness along its length, cleanly cut ends.
Cell 5: One compact single overhand knot of braided flax rope, only the tied knot with very short ends, natural fibers and dimensional shadows, centered close-up.
Cell 6: One blank circular sandstone sundial face viewed exactly from above, concentric carved rims, warm pale limestone texture and a central triangular brass gnomon. No numbers, no lines of text, no tick marks. Empty outer annular reading area. Full disk.
Requested image size 1536 by 1024. Keep the relative grid alignment exact.
```

## field-materials-v2

Saved unmodified at `assets/illustrations/field-materials-v2.png`.

```text
Use case: product-mockup. Asset type: production transparent sprite atlas of natural materials for interactive charts. Primary request: exactly 4 columns and 2 rows, 8 isolated objects, equal square cells in a landscape image. Photorealistic museum specimen photography and precise physically based material rendering, exquisite microdetail, tactile three-dimensional form, premium product visualization. NOT a drawing, NOT watercolor, NOT sketch, NOT clip art, NOT flat vector. Each object is fully inside its cell with generous 12% transparent margin on all sides; no overlaps across cells. Consistent soft studio lighting from upper left, contact shading only on the object's own surface. Truly transparent alpha background everywhere outside the objects, NO white paper, NO checkerboard baked in, NO floor, NO cast shadow, NO grid, NO labels, NO numbers or letters, NO border. Clean isolated silhouettes for compositing onto both dark and light chart canvases. Read cells left to right, top to bottom:
Cell 1: One isolated realistic warm white star light: small bright core, four fine diffraction spikes, delicate golden halo fading smoothly to transparency. No surrounding star field.
Cell 2: One realistic firefly viewed from above with its head pointing up: two detailed translucent wings spread open, segmented dark beetle body, amber thorax and luminous yellow green abdomen. Fine legs, antennae and wing venation, full silhouette.
Cell 3: One barn swallow in flight viewed exactly from above, head pointing up, wide spread wings with individually resolved feathers, deeply forked tail, blue-black plumage and ivory shoulders.
Cell 4: One starling in flight viewed exactly from above, head pointing up, wings widely spread in a gentle upward sweep, short fan tail, detailed iridescent brown-black feathering, full silhouette.
Cell 5: One smooth broad river pebble viewed from above, oval horizontally elongated shape, blue-gray slate with fine white mineral seams and softly rounded volume.
Cell 6: One smooth broad river pebble viewed from above, oval horizontally elongated shape, warm cream sandstone with fine ochre mineral speckles and softly rounded volume.
Cell 7: A circular concentric water ripple viewed perfectly from above: five fine reflective blue-green rings, crystal clear surface, rings fade at outside, perfectly transparent open center and background, no pond or scenery.
Cell 8: A small irregular horizontal rock surface sample seen from above, gray-green weathered stone with fine mineral veins and subtle relief, no scenery, no map lines, no large peaks, no labels.
Requested image size 2048 by 1024. Keep the relative grid alignment exact.
```
