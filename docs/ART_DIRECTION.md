# NaturePlot nature studies

> Historical design record. Version 0.7.0 replaces generated images with native SVG in the library and site. See [the current review](NATIVE_SVG_REVIEW.md).

## Original artwork

Mode: generation, using the built-in image generation tool. Created September 21, 2026.

Asset: `demo/assets/generated/nature-studies-v1.png` (1536 × 1024). This original raster atlas appears in the interactive Nature studies section and the documentation field notes. The six specimens are visual references, not scientific drawings or data plots. The sundial is an imagined instrument, not a historical reconstruction.

The library translates selected details into native SVG: compound fern fronds, glass highlights, bark and growth-ring engraving, tapered coral branches, shell chambers, and a stone dial. Data remains vector geometry. Generated pixels never encode a supplied quantity, and exported charts have no image dependency.

## Exact generation prompt

```
Use case: stylized-concept.
Asset type: original editorial nature study for NaturePlot.js, a sophisticated data visualization library.
Create one exceptionally beautiful landscape image, 1536x1024 composition, arranged as a precise 3-column by 2-row specimen atlas. Six equally sized visual cells, absolutely no borders or dividing rules, all on a continuous warm ivory paper background (#f4f1e8). Each specimen is centered comfortably within its cell, with ample negative space around it, no object crossing between cells.
Top left: a gracefully uncurling fern with eight exquisitely drawn paired green pinnae, a slender curving rachis and tiny bronze spores; delicate real botanical structure.
Top middle: three overlapping translucent blue-green drops of dew nestled against the finely veined tip of a sage leaf, strong glasslike refraction and quiet specular highlights.
Top right: an irregular cross section of an old cedar trunk, softly scalloped outer bark, dozens of thin variable growth rings around an off-center heart, burnt umber and honey tones.
Bottom left: an elegant pale terracotta branching coral, tapering organic branches and subtly stippled limestone texture, no ocean scene.
Bottom middle: a cutaway nautilus shell, graceful logarithmic spiral, creamy chambers and thin burnt-sienna septa, meticulous natural-history museum illustration.
Bottom right: a small ancient warm-sandstone sundial instrument seen slightly from above, its triangular gnomon casting a long coherent indigo shadow on a circular engraved face, beside an understated small golden sun disc. No numerals, text, lettering or pseudo-writing.
Style: premium natural history print meets contemporary editorial illustration. A mix of fine engraved lines, opaque gouache, transparent watercolor and very subtle paper grain. Refined tactile realism, intelligent selective detail, sculptural volume, sophisticated organic silhouettes. Each object should read crisply at small size. Muted forest green, teal, sage, ochre, terracotta, cream and ink. Soft consistent light from upper left. Deliberate, masterful drawing, no cartoon, no cute characters, no icons, no generic stock clipart, no neon, no gradients filling the background, no photographic mockup.
This is nature reference artwork, not a data chart. Do not draw axes, data points, numbers, labels, UI or logos. Fill each cell about 70% of its width and 75% of its height; equal visual weight across the six specimens.
```

## Measurement boundaries

- Fern: the terminal tip remains exactly on the shared linear scale. Pinnae and veins are decorative; cumulative share has its own rail.
- Dew: the circle radius remains proportional to the square root of weight. Reflections remain inside the circle.
- Growth History: exact circular annulus boundaries retain thickness/area semantics. Engraving stays inside each period's annulus; outer bark is a decorative frame.
- Coral Range: branch endpoints are the supplied limits. Fine branches remain inside the interval and carry no additional observations.
- Nautilus: the existing position-to-angle and turn-to-radius mapping remains intact. Chambers are reference structure, not observations.
- Sundial: circular arcs encode clock-time intervals. Stone texture and the center ornament do not calculate a solar shadow.

The 50-chart purpose/limitations review remains in [QUALITY_REVIEW.md](./QUALITY_REVIEW.md).
