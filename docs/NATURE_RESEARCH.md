# NaturePlot.js — nature as a measuring instrument

Research and design brief · 21 September 2026

**Further expansion — v0.3.0:** The library now contains fifty charts. Thirty additional encodings, sources, and design contracts are documented in [the fifty-chart plan](FIFTY_CHARTS_PLAN.md) and [complete catalog](CHART_CATALOG.md).

**Implementation update — v0.2.0:** All twelve chart concepts in this notebook are now implemented. Sundial uses schedule mode, Season Wheel uses Gregorian calendar mode, and Lunar Cycle uses explicitly defined abstract cycles. Solar/lunar scientific adapters remain future work. See [the current API](API.md#natural-instruments--v020) and [the implementation plan](REMAINING_CHARTS_PLAN.md). The original research and proposal language below is retained as the design record.

**Design direction:** build charts around the ways nature reveals position, cycles, duration, quantity, thresholds, and accumulated history. The visual form should explain the measurement.

This document separates historical evidence, scientific mechanisms, and proposed NaturePlot designs. New chart names below are proposals, not APIs shipped in v0.1.0. The eight existing renderers remain available.

## 1. What a shadow can tell us

A fixed object casts a shadow that changes as the Sun moves across the sky. A calibrated dial turns that change into a readable time. Egyptian shadow clocks and later Greek and Roman sundials used different geometries and markings; there was no single universal dial design. [NIST: Early Clocks](https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-early-clocks)

The useful distinctions for our design are:

- **Position:** the shadow's direction and length change through the day.
- **Reference:** a fixed post, baseline, orientation, and calibrated markings make the change interpretable.
- **Context:** the correct mapping depends on the dial, latitude, and solar conditions. A vertical post does not produce uniformly spaced clock-hour marks on a flat surface.
- **Different clocks:** a sundial measures apparent solar time. Reading it as civil clock time requires appropriate corrections; solar noon is not universally 12:00 on a watch. [NIST: evolution of time measurement](https://tf.nist.gov/general/pdf/2533.pdf)

In an ideal side view on horizontal ground, a vertical post of height `h` and Sun elevation `α` gives shadow length `h / tan(α)`. This is elementary geometric reasoning, not a complete sundial algorithm. A single shadow length can occur before and after noon, and is not enough by itself to identify the time.

**Proposed chart: `sundial`.** A day planner with timed activities arranged around a dial. Angular position encodes time; arc extent encodes duration; a shadow indicates the selected instant. Examples: a workday, outdoor activity schedule, restaurant opening hours, or a daily routine.

Offer two clearly distinguished modes:

1. **Schedule dial:** evenly spaced clock time, explicitly a visual metaphor.
2. **Solar dial:** physical Sun/shadow geometry from date, location, and a validated solar-position calculation.

The first is straightforward and works anywhere. The second needs an astronomy layer and must handle darkness and polar day/night. Do not make the shadow length represent revenue, or pretend that a decorative semicircle calculates sunrise.

## 2. An unexpected connection to the three-plant calendar

The Egyptian civil calendar had twelve 30-day months plus five additional days. Its months were divided into three ten-day periods. Egyptian nighttime hours were also associated with the movement of star groups called decans. [The Metropolitan Museum of Art: Telling Time in Ancient Egypt](https://www.metmuseum.org/essays/telling-time-in-ancient-egypt)

**Design inference:** the proposed three plants × ten leaves is a useful contemporary representation of three equal date groups. The botanical picture is our invention; it is not a reconstruction of an Egyptian chart.

Improve `garden` by making the grouping legible: date ranges below stems, leaf dates visible, missing dates distinct, and optional grouping labels. Continue to support real Gregorian months rather than forcing February or 31-day months into the historical pattern.

**Related proposal: `star-cycle`.** Recurring checkpoints around an explicitly labeled cycle, useful for maintenance, recurring tasks, or learning reviews. Borrow the principle of recognizing a recurring position; do not assign invented ancient meanings to constellations.

## 3. Research-to-chart catalog

### A. Moon phases → recurring cycles

**Evidence.** The Moon's phase sequence repeats in about 29.5 days. Its roughly 27.3-day orbital period is a different quantity. [NASA: Moon Phases](https://science.nasa.gov/moon/moon-phases/)

**Proposal — `lunar-cycle`:** arrange days around an orbit and show a phase glyph at a selected date. Use this for genuine lunar calendars or explicitly abstract recurring routines. An abstract 30-day cycle must be labeled as such.

**Encoding:** angle = position within the cycle; a separate mark or label = the day's activity value. Keep phase illumination separate from completion percentage: a full Moon occurs near the midpoint of a new-Moon-to-new-Moon cycle, not its end. Waxing and waning can share the same illuminated fraction.

**Daily uses:** recurring maintenance, study/review schedules, creative cycles, and periodic subscriptions. An actual astronomy mode needs an epoch, timezone handling, and an appropriate ephemeris or documented approximation. Do not imply that a person's behavior is caused by lunar phase.

### B. Flowing water → elapsed duration

**Evidence.** Historical water clocks read time from water entering or leaving a marked vessel. Regulating flow was a substantial engineering problem. [NIST: Early Clocks](https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-early-clocks)

**Proposal — `water-clock`:** a calibrated vessel whose water level shows time remaining, with an explicit elapsed/remaining convention.

**Encoding:** elapsed duration determines the remaining quantity. A linear height-to-time mapping is an idealized constant-area, controlled-flow model. A tapering pot and an unregulated outlet would need a different calibration.

**Daily uses:** focus sessions, cooking intervals, meeting allocations, a remaining usage allowance. Passive animation is unnecessary; the chart can render a snapshot supplied by the host app.

**Relationship to v0.1.0:** retain `tide` as the existing progress gauge. A water-clock variant would explain depletion and duration more directly than simply reversing its percentage.

### C. Nile flood measurements → thresholds and capacity

**Evidence.** Nilometers measured water levels to inform practical decisions. The surviving Rawda Island example was built in 861 CE; it is a medieval example, not a pharaonic artifact. [Egyptian Ministry of Tourism and Antiquities: Rawda Island Nilometer](https://egymonuments.gov.eg/monuments/rawda-island-nilometer/)

**Proposal — `waterline`:** a vertical water-level chart with a graduated column, historical high/low markers, and explicitly labeled thresholds.

**Encoding:** height = quantity on a shared linear scale; horizontal marks = thresholds; an optional history strip = observations over time. Thresholds come from the user, never from invented universal “healthy” bands.

**Daily uses:** storage capacity, inventory reorder levels, resource budgets, rainwater tanks, and queue capacity. This is a stronger metaphor for operational thresholds than a generic percentage donut.

### D. Solar terms → a year understood in finer phases

**Evidence.** China's Twenty-Four Solar Terms connect the Sun's annual motion with seasonal understanding and activities. The tradition originated in the Yellow River region. [UNESCO: Twenty-Four Solar Terms](https://ich.unesco.org/en/RL/the-twenty-four-solar-terms-knowledge-in-china-of-time-and-practices-developed-through-observation-of-the-suns-annual-motion-00647)

Modern astronomical definitions assign terms by solar ecliptic longitude. Equal angular segments are not simply equal blocks of Gregorian dates. [National Astronomical Observatory of Japan: About 24 Solar Terms](https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/faq_en.cgi)

**Proposal — `season-wheel`:** a circular annual timeline with nested tracks for activities, observations, and milestones.

**Encoding:** angular position = actual date in the selected year; arc extent = actual duration; tracks = categories. Date-based and solar-longitude-based layouts must be separate named modes.

**Daily uses:** planting plans, release calendars, recurring demand, school terms, maintenance, or a content calendar. An ordinary project calendar need not copy historical names or force 24 artificial divisions.

### E. Ecological signs → event-defined phases

**Evidence.** CSIRO's seasonal-calendar work is co-produced with particular Aboriginal and Torres Strait Islander communities. It documents local understandings of Country rather than one universal Australian calendar. These are living knowledge systems. [CSIRO: Indigenous Seasonal Calendars](https://www.csiro.au/en/research/indigenous-science/indigenous-knowledge/calendars)

Seasonal indicators can include changes in plants, animals, weather, and celestial patterns. [Botanic Gardens of Sydney: Seasons in Aboriginal Culture](https://www.botanicgardens.org.au/teachers-and-schools/teacher-resources/primary-learning-resources/aboriginal-seasons/seasons)

**Proposal — `phenology`:** a timeline where a phase begins when an observed event occurs, rather than because an arbitrary date has arrived.

**Encoding:** observed dates become milestone positions; intervals connect stages; a separate layer shows expected windows. Unknown and not-yet-observed events remain explicit.

**Daily uses:** a plant's germination/flowering/harvest record, project readiness, an onboarding journey, or maintenance triggered by wear. Product examples can use generic, invented phases. Reproducing a community's named calendar would be a separate collaboration with its knowledge holders.

This could become one of NaturePlot's most distinctive ideas: represent **readiness and observed change**, not only dates and percentages.

### F. Clay counters → countable quantities

**Evidence.** Archaeologist Denise Schmandt-Besserat interprets ancient Near Eastern clay tokens as counters for goods, with shape and denomination carrying meaning. [University of Texas at Austin: Tokens](https://sites.utexas.edu/dsb/tokens/tokens/)

**Proposal — `seed-ledger`:** countable seed or pebble marks, grouped into readable bundles.

**Encoding:** one seed = an explicitly stated unit. Use a consistent denomination across compared groups. Display any fractional remainder and any aggregation rule rather than silently rounding it away. A seed is our nature-based visual adaptation, not a claim about the original token shape.

**Daily uses:** completed tasks, orders, inventory, attendance, or books read. For example, 23 completed tasks can appear as two groups of ten plus three seeds. Large datasets should switch to labeled bundles rather than thousands of tiny marks.

### G. Calibrated stone weights → meaningful comparison

**Evidence.** Harappan sites contain stone weights arranged in standardized relationships. Small weights often follow binary ratios; larger denominations also use other ratios. [J. Mark Kenoyer: Measuring the Harappan World](https://www.harappa.com/sites/default/files/pdf/Kenoyer%202010%20Measuring%20the%20Harappan%20World.pdf)

**Proposal — `balance`:** compare two quantities around a shared reference, using labeled stone-like units and a balance beam.

**Encoding:** the numeric difference and a common linear reference carry the quantity. Beam tilt should be a labeled qualitative cue, not an unexplained physical formula. Use matching units and preserve sign. If mark size carries value, specify area rather than letting both width and height scale linearly.

**Daily uses:** budget versus actual, incoming versus outgoing work, consumption versus replenishment. The lesson is calibration: naturally occurring objects do not automatically have identical mass or provide a standard.

### H. Knotted cords → recorded, grouped quantities

**Evidence.** Inka khipus used cords and knots to encode quantitative records. Attributes including cord organization and color were part of the recording system. [Smithsonian National Museum of the American Indian: Inka Khipu](https://americanindian.si.edu/exhibitions/infinityofnations/andes/143866.html)

**Proposal — `cord-ledger`:** hanging cords for categories, with regularly positioned beads or knots denoting a documented unit.

**Encoding:** cord = category; knot groups = amount or completed milestones; connecting structure = hierarchy. Keep the mathematical key visible.

**Daily uses:** team contributions, grouped inventory, departmental totals, and hierarchical task progress. A simple knot-count interface is a contemporary interpretation, not an authentic khipu decoder. Do not claim all surviving khipu meanings are known.

### I. Tree rings and sediment → accumulated history

**Evidence.** Tree-ring measurements are used as climate proxies. In suitable growing conditions, annual rings preserve successive growth periods, and their properties carry evidence about the environment. [NOAA: What Are Proxy Data?](https://www.ncei.noaa.gov/news/what-are-proxy-data)

**Proposal — `growth-history`:** concentric layers representing successive periods, with a linked straight cross-section for accurate comparison.

**Encoding:** ring order = chronology; radial thickness = that period's contribution. If area is intended to represent quantity instead, radius must be derived from cumulative area. Do not mix those two encodings.

**Daily uses:** annual contributions to savings, accumulated learning, product history, or long-term resource use. The source of this concept is modern interpretation of natural records, not a claim that all ancient societies used dendrochronology.

**Relationship to v0.1.0:** existing `rings` compares independent goal percentages. Preserve that behavior; add a separate growth-history chart for accumulated time.

### J. Tides → repeating change

**Evidence.** Tides reflect ocean responses to lunar and solar forces. [NOAA: What Are Tides?](https://oceanservice.noaa.gov/facts/tides.html)

**Proposal — `tidal-rhythm`:** show repeated rises and falls in observations, such as cyclical demand, across several labeled periods.

**Encoding:** time = horizontal position; measured value = vertical position; small multiples = comparable cycles. A wave-shaped decoration is not evidence of periodicity. Real tide forecasts require appropriate local data and a validated model.

**Relationship to v0.1.0:** reserve `tide` for its current single-value gauge. Give time-varying observations a new renderer instead of silently changing the meaning of existing code.

## 4. Architectural inspiration without a misleading chronology

Jaipur's Jantar Mantar is a valuable visual reference for geometry, calibrated surfaces, and large readable instruments. It dates to the early eighteenth century, so it belongs in a later historical-instrument chapter rather than an “ancient civilization” category. [UNESCO: Jantar Mantar, Jaipur](https://whc.unesco.org/en/list/1338)

**Original design opportunity:** let layout communicate the reference system—meridian, horizon, dial plane, measurement scale—so users can see why a mark has its position. Avoid adding elaborate instrument shapes whose geometry has no relation to the data.

## 5. A design vocabulary for the library

| Family | Question | Natural mechanism | Candidate chart |
| --- | --- | --- | --- |
| Position | Where are we in the day? | A moving shadow | Sundial |
| Cycle | When will this recur? | Lunar or seasonal phase | Lunar cycle, season wheel |
| Duration | How much time is left? | Controlled flow | Water clock |
| Threshold | Have we reached a boundary? | Water crossing a calibrated mark | Waterline |
| Count | How many units exist? | Discrete objects with a unit key | Seed ledger |
| Relation | How do quantities compare? | Calibrated weights | Balance |
| State | Has the next stage arrived? | Observed ecological change | Phenology |
| Memory | What accumulated over time? | Successive growth layers | Growth history |

These are our design abstractions. They do not imply that different cultures used identical systems or shared the same interpretation of time.

## 6. Recommended implementation order

### First: a useful next release

1. **Seed ledger** — introduces an exact, countable quantity encoding with straightforward validation.
2. **Waterline** — extends progress into useful thresholds and capacity readings.
3. **Sundial in schedule mode** — gives the library a distinctive daily timeline without claiming physical astronomy.
4. **Season wheel in calendar mode** — introduces an annual timeline with real interval lengths.

These four cover counts, values, within-day intervals, and annual intervals. They add new capabilities instead of merely reskinning the existing eight charts.

### Second: richer semantic data

5. **Phenology** — observed milestones and expected windows.
6. **Lunar cycle** — distinguish an abstract cycle from actual lunar-phase data.
7. **Growth history** — cumulative layers with an exact comparison view.
8. **Cord ledger and balance** — only after clarity tests demonstrate their advantage over simpler comparisons.

### Third: optional scientific adapters

A solar-position adapter, a lunar-phase adapter, and a time-series adapter should remain optional so the main library can stay lightweight. They must document date/time conventions, location requirements, precision, model source, and behavior when data is unavailable.

## 7. API consequences

The present `DataPoint { label, value, date, target }` works for simple quantities and dates. It is insufficient to describe intervals, events, and scientific context cleanly.

Proposed conceptual schemas, not shipped declarations:

```ts
// A dial or calendar arc needs a beginning and an end.
interface IntervalPoint {
  label: string;
  start: string;  // unambiguous ISO instant or a documented local-time form
  end: string;
  value?: number | null;
}

// A phase can be observed, expected, or not yet reached.
interface StagePoint {
  label: string;
  observedAt?: string;
  expectedStart?: string;
  expectedEnd?: string;
}

// Explicit thresholds and denominations make nature-based readings legible.
interface MeasurementContext {
  unit: string;
  unitsPerMark?: number;
  thresholds?: { value: number; label: string }[];
}
```

Use discriminated chart options when implementing these additions. A solar chart should not accept a location-free astronomical claim; a quantity chart should not need timezone settings. Do not quietly reinterpret a percentage as an angle of the Sun.

## 8. Acceptance criteria for the next charts

- A user can explain what changes when a value changes.
- A full cycle is distinct from a completed goal.
- Dates, intervals, and quantities retain their own units.
- Exact readings remain available through labels, focus details, and tables.
- The source is attached to the historical inspiration; invented metaphors are identified as modern designs.
- Uncertainty, missing observations, and unknown event dates remain visible.
- Prototype checks cover zero, full scale, missing data, reversal of a cycle, interval boundaries, and long labels.
- Copy never claims an approximate illustration is a physical instrument or a scientific forecast.

The existing Rainbow and Garden can remain the expressive calendar family. The next collection should make NaturePlot feel like a set of readable natural instruments.
