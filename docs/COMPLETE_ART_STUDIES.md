# Fifty chart studies

> Historical design record. Version 0.7.0 replaces generated images with native SVG in the library and site. See [the current review](NATIVE_SVG_REVIEW.md).

Mode: original generation with the built-in image generation tool. Four new atlases extend the six-specimen atlas from v0.4.1 to fifty named chart studies. Each atlas is a visual reference, not a measured dataset, scientific plate, or historical reconstruction.

## Plan and acceptance criteria

1. Give every built-in chart a specimen, a use case, a recorded visual treatment, and an explicit measurement boundary.
2. Preserve data-bearing coordinates, endpoints, areas, counts, and missing-value behavior. Clip decorative engraving to the existing shapes. Do not fabricate observations.
3. Refine each renderer or retain its already-reviewed v0.4.1 treatment with an explicit rationale.
4. Make all fifty studies discoverable in the specimen explorer and their individual documentation guides.
5. Run the full regression suite, export/package checks, browser interaction checks, and light/dark contact-sheet review.

## Generated assets and prompts

### Botanical systems

Saved at `demo/assets/generated/botanical-v1.png`.

```text
Use case: stylized-concept.
Asset type: original nature specimen atlas for NaturePlot.js, a refined visualization library.
Style: masterful natural-history museum illustration, fine engraved lines with subtle watercolor and opaque gouache, exquisite anatomical or material detail, sculptural form, tactile restrained realism. Warm ivory paper background #f4f1e8, continuous and uniform. Forest green, sage, blue-green, ochre, terracotta, cream, graphite. Soft light from upper left. Rich beautiful silhouettes that stay legible as thumbnails.
Composition: each specimen centered in its own equally sized rectangular cell, ample blank margins. No objects cross cells. All cells have equal visual weight and fill 65–70% of their cell. No grid lines, borders, text, lettering, numerals, captions, axes, UI, logos, watermarks or fake annotations. Not cartoon, not generic icons, not stock clip art. This is visual inspiration, not scientific evidence or a plotted dataset.
Primary request: Botanical systems, a landscape atlas at 1536 by 1152 pixels, exactly FOUR COLUMNS and THREE ROWS, 12 specimens.
Subjects in exact reading order, left to right then top to bottom:
Row 1, column 1: Three upright herb plants, each with paired finely veined sage leaves, exposed stems, and delicate rootlets.
Row 1, column 2: A small group of conifer trees with individually drawn needle sprays and varied branch tiers.
Row 1, column 3: An open radial flower with twelve long petal lobes, fine parallel veins, and a warm pollen center.
Row 1, column 4: One elegant twig bearing a bud, emerging leaf, full leaf and seed capsule, showing botanical development.
Row 2, column 1: A small natural-history arrangement of elongated seeds with fine shell seams and tiny hilum markings.
Row 2, column 2: A sunflower seed head viewed straight on, densely packed spiraling seeds, precisely detailed.
Row 2, column 3: One broad translucent leaf with a clear midrib and delicate branching secondary veins.
Row 2, column 4: A lotus viewed from above, layered pale cream and muted rose petals, a dark green seed pod center.
Row 3, column 1: An opening seed pod, soft elongated curved shells and fine longitudinal grooves, three visible seeds.
Row 3, column 2: A graceful pitcher plant, a fluted tapering green chamber, rolled reddish lip and slender lid.
Row 3, column 3: A segmented bamboo culm, subtle longitudinal grain, raised nodes, and a small spray of lanceolate leaves.
Row 3, column 4: An aerial study of neighboring overlapping tree crowns, clustered foliage with fine branch structure.
```

### Water and earth

Saved at `demo/assets/generated/water-earth-v1.png`.

```text
Use case: stylized-concept.
Asset type: original nature specimen atlas for NaturePlot.js, a refined visualization library.
Style: masterful natural-history museum illustration, fine engraved lines with subtle watercolor and opaque gouache, exquisite anatomical or material detail, sculptural form, tactile restrained realism. Warm ivory paper background #f4f1e8, continuous and uniform. Forest green, sage, blue-green, ochre, terracotta, cream, graphite. Soft light from upper left. Rich beautiful silhouettes that stay legible as thumbnails.
Composition: each specimen centered in its own equally sized rectangular cell, ample blank margins. No objects cross cells. All cells have equal visual weight and fill 65–70% of their cell. No grid lines, borders, text, lettering, numerals, captions, axes, UI, logos, watermarks or fake annotations. Not cartoon, not generic icons, not stock clip art. This is visual inspiration, not scientific evidence or a plotted dataset.
Primary request: Water and earth, a landscape atlas at 1536 by 1152 pixels, exactly FOUR COLUMNS and THREE ROWS, 12 specimens.
Subjects in exact reading order, left to right then top to bottom:
Row 1, column 1: A meandering blue-green river seen from above, flowing between pale banks, finely engraved current lines.
Row 1, column 2: A small rugged mountain ridge, angular shaded rock facets and fine scree etching, no sky.
Row 1, column 3: A round tidal pool with a calm blue-green water surface, fine ripples and a pale stone rim.
Row 1, column 4: A transparent straight-sided glass water vessel with visible meniscus and refracted vertical light streaks, no graduations or letters.
Row 2, column 1: An imagined ancient straight-sided water-clock vessel, warm pottery rim and transparent blue water section, no text.
Row 2, column 2: Several parallel water-wave crests, undulating rhythm and fine engraved ripples, no full ocean scene.
Row 2, column 3: A sculptural rain cloud, soft gray volume, individual blue rain streaks beneath it, a contained atmospheric specimen.
Row 2, column 4: Three softly overlapping ochre dunes, long wind-carved parallel ripple textures on their slopes.
Row 3, column 1: A stepped glacier fragment, translucent blue ice facets and angular crevasses.
Row 3, column 2: A cutaway sedimentary rock specimen with thin parallel layers, varied sandstone, shale, and clay textures.
Row 3, column 3: A fan-shaped river delta seen from above, one river branching into smaller channels among pale sand islands.
Row 3, column 4: An estuary seen from above, several rivers joining a broad blue-green tidal channel, flowing water striations.
```

### Cycles and signals

Saved at `demo/assets/generated/cycles-signals-v1.png`.

```text
Use case: stylized-concept.
Asset type: original nature specimen atlas for NaturePlot.js, a refined visualization library.
Style: masterful natural-history museum illustration, fine engraved lines with subtle watercolor and opaque gouache, exquisite anatomical or material detail, sculptural form, tactile restrained realism. Warm ivory paper background #f4f1e8, continuous and uniform. Forest green, sage, blue-green, ochre, terracotta, cream, graphite. Soft light from upper left. Rich beautiful silhouettes that stay legible as thumbnails.
Composition: each specimen centered in its own equally sized rectangular cell, ample blank margins. No objects cross cells. All cells have equal visual weight and fill 65–70% of their cell. No grid lines, borders, text, lettering, numerals, captions, axes, UI, logos, watermarks or fake annotations. Not cartoon, not generic icons, not stock clip art. This is visual inspiration, not scientific evidence or a plotted dataset.
Primary request: Cycles and signals, a landscape atlas at 1536 by 1152 pixels, exactly FOUR COLUMNS and THREE ROWS, 12 specimens.
Subjects in exact reading order, left to right then top to bottom:
Row 1, column 1: A delicate luminous rainbow arch above two very small misty clouds, restrained muted natural colors.
Row 1, column 2: A small cedar cross section with visible concentric wood grain and several subtly open ring arcs, natural bark.
Row 1, column 3: A circular seasonal wreath with small buds, mature leaves, seed heads and bare twigs, no clock or labels.
Row 1, column 4: Four small moon discs from crescent to full, softly textured lunar craters and crisp terminators.
Row 2, column 1: An imagined ancient wooden balance instrument with two suspended shallow seed bowls and a carved central pivot.
Row 2, column 2: Three hanging cotton counting cords with small evenly spaced knots, visible braided fibers, no numbers.
Row 2, column 3: A dark indigo celestial sphere fragment with delicate constellations and small four-point starlight glints, no lettering.
Row 2, column 4: A small spiral of flowing wind ribbons around a central seed, finely engraved flow filaments, no compass letters.
Row 3, column 1: One firefly with a glowing warm abdomen, translucent finely veined wings, small dark head and antennae.
Row 3, column 2: Three elegant flying birds following a curved route, fine wing feathers, restrained dynamic posture.
Row 3, column 3: A small murmuration of many separate birds in flight, individual curved wing silhouettes and varied orientations.
Row 3, column 4: A golden sun disc rising over a contained horizontal horizon, fine rays and soft peach atmospheric light.
```

### Hidden structures

Saved at `demo/assets/generated/hidden-structures-v1.png`.

```text
Use case: stylized-concept.
Asset type: original nature specimen atlas for NaturePlot.js, a refined visualization library.
Style: masterful natural-history museum illustration, fine engraved lines with subtle watercolor and opaque gouache, exquisite anatomical or material detail, sculptural form, tactile restrained realism. Warm ivory paper background #f4f1e8, continuous and uniform. Forest green, sage, blue-green, ochre, terracotta, cream, graphite. Soft light from upper left. Rich beautiful silhouettes that stay legible as thumbnails.
Composition: each specimen centered in its own equally sized rectangular cell, ample blank margins. No objects cross cells. All cells have equal visual weight and fill 65–70% of their cell. No grid lines, borders, text, lettering, numerals, captions, axes, UI, logos, watermarks or fake annotations. Not cartoon, not generic icons, not stock clip art. This is visual inspiration, not scientific evidence or a plotted dataset.
Primary request: Hidden structures, a landscape atlas at 1536 by 768 pixels, exactly FOUR COLUMNS and TWO ROWS, 8 specimens.
Subjects in exact reading order, left to right then top to bottom:
Row 1, column 1: An irregular cluster of golden honeycomb cells, thick beveled wax walls, translucent amber interiors.
Row 1, column 2: A branching white fungal mycelium network on dark moss, delicate hyphae bundled into larger threads.
Row 1, column 3: A small exposed root system, one thick taproot dividing into progressively finer tapered roots, botanical detail.
Row 1, column 4: Seven smooth river pebbles, subtle mineral grain, varied gray-green colors, small reflected light highlights.
Row 2, column 1: An exquisitely branching six-armed ice crystal, fine secondary facets and translucent pale blue structure.
Row 2, column 2: Concentric ripples on a small circular patch of water, elegant repeated curved wave fronts.
Row 2, column 3: A carefully balanced stack of five river stones, individually rounded silhouettes, subtle strata and mineral seams.
Row 2, column 4: An atmospheric vortex viewed from above, flowing concentric cloud bands around a pale center, fine continuous contour-like filaments.
```

The initial six-specimen artwork and its prompt are documented in [ART_DIRECTION.md](./ART_DIRECTION.md).


## Fifty decisions

Each entry was reviewed for purpose, encoding, and appearance. Retained treatments are explicitly identified. The original atlas is documented in [ART_DIRECTION.md](./ART_DIRECTION.md).

| Chart | Reference family | A useful question | Applied treatment and measurement boundary |
| --- | --- | --- | --- |
| 1. Rainbow | Cycles & signals | Find consistent days across a 49-day habit or activity log. | Cloud wisps frame the calendar without covering any of its 49 daily segments. Value remains a uniform intensity within each segment. |
| 2. Garden | Botanical systems | Review a month of daily routines, practice, or contributions. | Paired secondary veins and fine roots make the plant structure more legible. Day positions, leaf size, and the intensity scale remain fixed. |
| 3. Forest | Botanical systems | Compare a small set of category totals in the same unit. | Eight tiers of fine needle sprays give the canopy depth. The top of each tree remains exactly on the shared linear value scale. |
| 4. River | Water & earth | Follow an ordered series with a gentle visual rhythm. | Fine current lines are clipped inside each known section of the flowing area. Missing observations still interrupt the river. |
| 5. Bloom | Botanical systems | Compare a handful of dimensions sharing one unit and scale. | Curved longitudinal veins emphasize the petal tip. Length beyond the center carries the value; petal width and texture carry no additional measurement. |
| 6. Mountain | Water & earth | Find peaks and troughs in ordered observations. | Rock engraving is clipped beneath the measured ridge. Vertices and straight connections retain the supplied readings, including negative values and gaps. |
| 7. Tide | Water & earth | Communicate progress toward one positive goal. | Clipped water ripples add surface detail. The added 0%, 50%, and 100% reference ticks make the height scale explicit. |
| 8. Rings | Cycles & signals | Track up to eight independent goals with different targets. | Fine arc engraving and a bark frame reference wood. Butt caps keep small progress arcs from gaining extra angular extent; every ring remains an independent goal. |
| 9. Seed Ledger | Botanical systems | Make small counts and fractional quantities tangible. | Shell seams and hilum details stay inside each seed. Partial fills retain their fractional area, with an explicit denomination for bundled counts. |
| 10. Waterline | Water & earth | Monitor a capacity against user-defined thresholds. | Glass reflections and a double rim are clipped to the vessel. The water boundary and labeled capacity thresholds keep their exact positions. |
| 11. Sundial | First observations | Plan activities inside one clock day, including simultaneous lanes. | The reviewed stone face is retained, with finer hourly ticks added. Arc endpoints still encode clock time; the center ornament is not a calculated solar shadow. |
| 12. Season Wheel | Cycles & signals | Compare annual windows, seasons, or project phases. | Quarter reference ticks make the annual dial easier to scan. The Gregorian date positions remain exact, with separate lanes for overlapping intervals. |
| 13. Phenology | Botanical systems | Compare observed milestones with expected date windows. | Sprouts receive leaf veins and fine root strokes. Their stem centers remain on observed dates; expected windows and unobserved stages stay distinct. |
| 14. Lunar Cycle | Cycles & signals | Place recurring activity within an explicitly defined cycle. | Subtle crater outlines stay inside the illustrative moons. Data is still read from cycle angle and the outer stems, never from an inferred astronomical phase. |
| 15. Water Clock | Water & earth | Show elapsed or remaining time in a single duration snapshot. | Glazing, rim details, and clipped reflections distinguish the vessel. Its constant cross-section and exact remaining-water height preserve the time scale. |
| 16. Balance | Cycles & signals | Compare two nonnegative quantities and their difference. | Wood grain and mineral detail give the instrument a material identity. Only the two common-scale bars encode amounts; tilt continues to indicate direction. |
| 17. Cord Ledger | Cycles & signals | Count contributions organized into a few named teams. | Two braided strands follow each cord, with detailed knots. The braiding adds no counted units; denomination and partial-knot area remain explicit. |
| 18. Growth History | First observations | Show known contributions accumulated in chronological order. | Retained the reviewed bark and annulus engraving. Every period keeps its exact circular thickness or area, supported by aligned comparison bars. |
| 19. Tidal Rhythm | Water & earth | Compare multiple observed cycles on a common position axis. | Current engraving sits inside each cycle’s filled area. Irregular positions, a shared signed scale, and gaps remain intact. |
| 20. Star Cycle | Cycles & signals | Place checkpoints around a repeating cycle. | Fine central glints sharpen each star silhouette. The fixed star size, intensity scale, cycle positions, and optional cursor retain their separate meanings. |
| 21. Honeycomb | Hidden structures | Compare activity for a small row-by-column matrix. | Inset wax rims give each hexagon depth. Cell area stays equal, while its uniform interior intensity and numeric reading encode value. |
| 22. Mycelium | Hidden structures | Explore a small directed network with weighted connections. | A narrow highlight follows each positive link inside its measured width. No extra branches or relationships are invented; zero and unknown links keep distinct dashes. |
| 23. Root Tree | Hidden structures | Trace a compact taxonomy or ownership hierarchy. | Bundled root fibers distinguish parent links from measured nodes. Every link follows a supplied parent, and node area represents only that node’s own value. |
| 24. Canopy | Botanical systems | Compare positive parts of a total within two grouping levels. | Clipped vein engraving gives rectangular crowns botanical detail. The treemap’s exact area allocation and explicit group labels remain the reading system. |
| 25. Fern | First observations | Find high-impact categories and their cumulative share. | Retained the reviewed compound fronds and numeric amount axis. Frond tips keep a shared linear scale; cumulative share is read on its own rail. |
| 26. Phyllotaxis | Botanical systems | Explain how a whole is divided among several categories. | Every allocated seed receives an identical small shell seam. There are still exactly 120 equal-area dots when the total is positive, with rounding explained. |
| 27. Leaf Veins | Botanical systems | Compare before and after across several measures in the same unit. | Leaf engraving connects the two readings. Hollow baseline markers now sit above the leaf surface; equal readings retain a visible center dot. |
| 28. Lotus | Botanical systems | Compare performance against a different target on each axis. | Quiet petal washes and fine veins sit behind the radar profile. The measured polygon, target fractions, and missing-axis gaps remain separate from the botanical guides. |
| 29. Petal Box | Botanical systems | Compare medians and supplied quartile summaries. | Longitudinal pod engraving is clipped to the Q1–Q3 body. The median remains a strong line, and the whiskers retain the supplied minimum and maximum. |
| 30. Raincloud | Water & earth | Compare frequencies across supplied numeric bins, including unequal widths. | Vertical rain engraving fills the existing histogram bins. Flat tops and exact bin widths preserve frequency density and the area-to-count relationship. |
| 31. Dew | First observations | Explore two measurements and an optional size variable. | Retained the reviewed refractive fill and reflections. Radius still uses the square root of weight, with distinct hollow zero and dashed missing markers. |
| 32. Wind Rose | Cycles & signals | Compare amounts across 4, 8, or 16 compass directions. | Wind filaments are clipped to compass sectors. Removed the minimum radius: zero sectors now have no measured area and use a hollow inspection marker. |
| 33. Dune | Water & earth | Compare frequency profiles across up to four cohorts. | Sand-ripple engraving is clipped beneath each ridge and follows series selection. All ridges retain their common height scale and actual horizontal positions. |
| 34. Glacier | Water & earth | Explain how signed changes produce a final running total. | Crystalline facets stay inside each floating ice step. Signed changes, zero-height steps, connectors, and the running balance retain their exact geometry. |
| 35. Sediment | Water & earth | Read changing composition across aligned numeric positions. | Fine stratification is clipped within each series and dims with that series. Only the colored layer boundaries encode the supplied stacked contributions. |
| 36. Delta | Water & earth | Explain one budget or supply split among destinations. | Water filaments stay inside the outgoing ribbons. Their widths still partition the supplied total; zero allocations remain accessible without painted flow. |
| 37. Estuary | Water & earth | Follow transfers from several sources to several destinations. | Contained water engraving gives the ribbons a flowing surface. The same widths enter and leave each transfer, with source and destination totals preserved. |
| 38. Pitcher | Botanical systems | Find where a sequential funnel loses participants. | Ribbed chambers replace the fixed outward bulge. Stage width now stays exactly proportional to count, including true zero-width stages. |
| 39. Firefly | Cycles & signals | Locate bursts and gaps in event streams. | Fine translucent wing outlines distinguish each event. Horizontal position, track membership, and glow intensity retain their original meanings. |
| 40. Migration | Cycles & signals | Follow an ordered route through planar coordinates. | Small directional bird silhouettes follow the route segments. Stop centers and their areas stay on equal-scale planar coordinates, with input order preserved. |
| 41. Murmuration | Cycles & signals | Compare raw observations across a few cohorts. | Fine curved wings and a short body give each observation a clear anchor. Horizontal values stay exact; vertical jitter only separates nearby readings. |
| 42. Coral Range | First observations | Compare estimates with explicitly supplied uncertainty bounds. | Retained the reviewed tapered branches and central polyps. Branches remain within the supplied low–high interval; a missing estimate stays explicit. |
| 43. Pebble | Hidden structures | Read empirical percentiles without choosing bins. | Small rounded mineral silhouettes replace flat dots. Their centers remain on the right-continuous empirical distribution, including tied observations. |
| 44. Nautilus | First observations | Preserve chronology across up to four repeating cycles. | Retained the reviewed shell chambers. Angle locates the explicit cycle position, each turn retains chronology, and only dot area encodes value. |
| 45. Frost | Hidden structures | Compare a supplied symmetric correlation matrix. | Six-armed corner crystals leave numeric readings unobstructed. The signed, symmetric correlation matrix and fixed diverging color scale remain intact. |
| 46. Echo | Hidden structures | Look for relationships between adjacent ordered readings. | Fine concentric wave fragments emphasize each paired point. Their centers retain the lag-one coordinates; unpaired and missing records stay on a separate rail. |
| 47. Cairn | Hidden structures | Show individual contributions toward one shared goal. | Mineral seams are clipped inside the stones. Stone height stays proportional to contribution against one common target, including over-target totals and zero contributions. |
| 48. Daylight | Cycles & signals | Compare opening and closing times across dated observations. | A soft warm wash and small opening rays distinguish each interval. Endpoint centers and the shared 24-hour axis retain the supplied times. |
| 49. Isobar | Hidden structures | Explore equal-value contours in a small complete rectangular grid. | Pale contour halos improve separation from grid lines and nodes. The piecewise-linear interpolation and three labeled contour levels remain unchanged. |
| 50. Bamboo | Botanical systems | Inspect a small sample of integer scores without hiding original values. | Culm highlights, node rings, and a small leaf at each joint give the stem its structure. The displayed tens and units still reconstruct every original integer. |

## Verification

- 464 automated checks pass, including 50 dark export checks, exact specimen coverage, valid SVG references, and Pitcher/Wind Rose geometry regressions.
- All 50 examples reviewed in light and dark contact sheets. These can be regenerated with `npm run review:charts` after building.
- All 50 explorer options selected through the browser UI; every title, specimen selection, guide link, interactive mark collection, and data table matched the chosen chart.
- Next-observation controls exercised on all 50 charts; every selection produced a reading and one selected mark, with no browser console errors.
- Narrow-layout verification found no horizontal page overflow; SVG charts preserve readable sizing within their own scrolling containers.
- These are nature-inspired encodings for the documented use cases and supported input sizes. The specimens do not imply additional measurements or a scientific simulation.

TypeScript checks, the production library/site builds, and all 50 ESM/browser-IIFE package smoke checks pass for v0.5.0. The installable local package is `natureplot-0.5.0.tgz`; no public npm publication was performed.
