# NaturePlot 0.7 — native SVG and practical use

## Plan

1. Keep all 50 chart types and their data contracts. Remove generated raster images from the chart runtime, showcase, and current documentation examples. Preserve the previous asset files as historical design work.
2. Replace the sixteen image-based compositions with native SVG components: Bézier leaf and feather shapes, graded brass and stone, braided cords, layered seeds, and clear measured anchors. Keep shared definitions local to each chart and exports self-contained.
3. Provide Natural and Essential detail levels. The latter removes decorative material detail while retaining the same measurements, missing-value states, selection, keyboard access, and exact table.
4. Give all fifty charts a concrete everyday example, an explicit question, a useful decision, and an honest limitation. Make those examples discoverable through search, the live explorer, and every chart guide.
5. Check numerical integrity, all fifty chart schemas, both detail levels, small containers, theme changes, selection, and SVG export. Visually review the rebuilt compositions in the browser and verify the distributable package.

## Design boundaries

Natural appearance comes from native geometry, not simulated photographs. Ornament must not invent samples, measured area, counts, or confidence. Business questions take precedence over the metaphor. For dense tables, precise financial reconciliation, or complex networks, recommend the clearer alternative rather than implying that every nature chart fits every task.

`detail: 'natural'` is the default; `detail: 'essential'` prioritizes the data. No image generation is used in this revision.

## Review of all fifty purposes

Each example is illustrative. The live explorer and every guide also include the decision it supports, the measurement contract, a limitation, and an alternative.

| Chart | Worked example | Question |
| --- | --- | --- |
| Rainbow | Seven weeks of dispatches | Which days had unusually low dispatch activity? |
| Garden | Daily orders this month | How consistently are orders arriving across the month? |
| Forest | Orders by sales channel | Which sales channels bring the most orders? |
| River | Weekly net cash movement | Is the weekly cash movement improving or becoming more volatile? |
| Bloom | Customer service ratings | Which aspects of service need attention? |
| Mountain | Weekly order demand | Which weeks put the most pressure on fulfillment? |
| Tide | Invoices collected this month | How much of the collection goal has been reached? |
| Rings | Team goals this month | Which independent targets are furthest from completion? |
| Seed Ledger | Follow-up hours by team | How much time has each team spent on customer follow-ups? |
| Waterline | Packaging stock on hand | Is stock close to a replenishment threshold? |
| Sundial | A day at the service desk | When do appointments and support shifts overlap? |
| Season Wheel | Annual campaign calendar | Which campaigns share the same part of the year? |
| Phenology | Customer onboarding milestones | Which milestones happened inside their expected window? |
| Lunar Cycle | Recurring equipment checks | Where do checks fall within our maintenance cycle? |
| Water Clock | Time left in an appointment | How much of the allotted session remains? |
| Balance | Operating budget and spending | Is spending above or below the budget? |
| Cord Ledger | Volunteer hours by crew | How much has each person contributed within their crew? |
| Growth History | New members by year | Which years contributed most to today’s membership? |
| Tidal Rhythm | Hourly visits across store days | Do busy hours recur at similar times on different days? |
| Star Cycle | Customer review checkpoints | Where are customer reviews within our twelve-week cycle? |
| Honeycomb | Support tickets by team and weekday | Which team-day combinations have the heaviest load? |
| Mycelium | Ticket transfers between teams | Where are tickets being handed between teams? |
| Root Tree | Workload and ownership | Who owns each part of the work? |
| Canopy | Department spending allocation | How is spending divided between departments and activities? |
| Fern | Reasons for customer returns | Which return reasons account for most of the volume? |
| Phyllotaxis | Sales mix by product family | How is our sales volume divided across product families? |
| Leaf Veins | Response time before and after | Which teams improved after the process change? |
| Lotus | Progress against team targets | Which goals are closest to their individual targets? |
| Petal Box | Delivery times by provider | Which delivery provider is faster and more consistent? |
| Raincloud | Distribution of handling times | Are most requests quick, or is there a long tail? |
| Dew | Campaign effort and response | How do campaign effort, response, and reach relate? |
| Wind Rose | Delivery requests by direction | Which compass sectors generate more delivery requests? |
| Dune | Order-size profiles by customer group | How do order-size patterns differ between customer groups? |
| Glacier | Weekly changes in the cash balance | Which inflows and outflows changed the running balance? |
| Sediment | Revenue by product over time | Which products account for changes in total revenue? |
| Delta | Routing incoming enquiries | How are incoming enquiries allocated to teams? |
| Estuary | Work handed between departments | How much work moves between each pair of departments? |
| Pitcher | Trial-to-customer funnel | At which stage do the most prospects drop away? |
| Firefly | Operational events through the day | When did incidents occur across the monitored services? |
| Migration | A courier’s recorded stops | In what order were the delivery stops visited? |
| Murmuration | Handling times by team | How much variation is hidden behind each team’s average? |
| Coral Range | Task duration estimates | Which tasks have the widest planning range? |
| Pebble | Customer waiting-time distribution | What share of customers waited at most a given time? |
| Nautilus | Three cycles of outreach activity | How did activity differ at the same position across cycles? |
| Frost | Relationships between service metrics | Which measured metrics have positive or negative associations? |
| Echo | Order volume and the previous day | Do high-volume days tend to follow high-volume days? |
| Cairn | Contributions to a shared fund | How much has each contributor added toward one goal? |
| Daylight | Store opening hours by date | Which dates offer longer or shorter opening windows? |
| Isobar | Temperature across a stockroom | Where do measured temperatures form hotter or cooler zones? |
| Bamboo | Training assessment scores | What are the original scores, including repeated values? |

## Implementation decisions

- Keep the existing natural treatment of the other 34 charts, including Fern, Growth History, and Nautilus. Refine shared SVG styling and provide an Essential option across the whole collection instead of forcing all encodings into decorative objects.
- Replace image-backed components with reusable local SVG symbols and paint servers. A chart defines each shape once. No renderer uses `image`, `foreignObject`, remote URLs, filters, or raster data URLs for its natural components.
- Keep marks driven by the input: seed and knot denominations, balance bar lengths, quartiles, cycle angles, event positions, paired endpoints, ordered routes, cumulative shares, and numbered stem leaves retain their original contracts.
- Isobar's filled bands come from the same piecewise-linear triangular interpolation as the contour lines. Arbitrary rock textures were removed because they could suggest measurements that do not exist.
- Decorative seeds inside a Petal Box pod do not represent five observations. Its width represents Q1–Q3. The guide states this distinction. Balance stones are likewise decorative, with exact amounts represented by the common-scale bars.
- Every example can be changed with a sample control. Controls preserve interval ordering, quartile bounds, funnel order, and symmetric off-diagonal correlations. The fixed correlation diagonal remains one. Every chart also retains the full JSON playground.
- Units remain explicit: discrete sample counts are integers; fractional follow-up and volunteer time use hours. Event-position and frequency-coordinate axes no longer inherit the value's unit. Compact trend ticks keep long units in a separate heading. Full readings remain in the inspector and table.

## Compatibility and delivery

Version 0.7.0 removes the optional `natureplot/illustrations` entry point and registration API. Remove these imports when upgrading from 0.6. The legacy `artwork` option is deprecated and ignored; use `detail: 'natural' | 'essential'`. Original generated assets remain in the repository as historical experiments and do not enter the runtime, live documentation, site bundle, or npm tarball.

The 640-pixel chart drawing remains scrollable within narrow containers. This deliberately preserves label size instead of shrinking an entire chart to fit a phone. Both detail modes use the same input values and selection indexes; exports are static, self-contained vector drawings.

## Verification

- TypeScript checks for the library and both sites.
- 572 unit and DOM integration tests: all 50 schemas, missing/zero/extreme values, updates, keyboard/selection behavior, both detail modes, unique SVG IDs and resolved local references, image-free export, all 50 sample controls, business-unit semantics, documentation links and use-case search.
- ESM and browser IIFE package checks for all 50 types in both detail modes, plus NodeNext consumer types.
- Browser visual review with reproducible contact sheets; detailed checks of Balance, Star Cycle, Phyllotaxis, Phenology, Bamboo, Petal Box, Firefly, the axes and distribution views. Native/Essential toggles, slider updates, exact tables, keyboard selection, and search for onboarding were exercised in the browser.
- Narrow viewport checks confirmed that both documentation and the explorer keep page width contained while the 640-pixel chart scrolls internally. Both light and dark appearances were inspected. No browser console errors were observed in the review session.

Core ESM is 191.17 kB / 59.64 kB gzip; the browser IIFE is 154.48 kB / 54.63 kB gzip. The local package is about 169 kB compressed, with zero raster files. The previous optional image pack alone was about 4.75 MB gzip.

The build is a local release, not published to npm. See README for build, preview and local installation commands.
