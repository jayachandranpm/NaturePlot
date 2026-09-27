/** The shape of each example is executable with the public v0.2 API. */
export const instrumentGuides = {
  'seed-ledger': {
    use: 'Completed tasks, pages read, attendance totals, or a small inventory.',
    read: 'One seed stands for an explicit denomination. Rows separate categories. A partially filled seed represents a fraction through its filled area, while labels keep the exact quantity available.',
    rule: 'Use up to 6 nonnegative observations. unitsPerMark defaults to 1. When a row would need more than 40 seeds, the chart selects a larger multiple and prints the effective denomination. Zero and missing data are labeled separately.',
    source: "type: 'seed-ledger',\n  unitsPerMark: 1,\n  data: [\n    { label: 'Tasks', value: 23 },\n    { label: 'Pages', value: 16 },\n    { label: 'Sessions', value: 8.5 },\n  ]",
  },
  waterline: {
    use: 'Storage capacity, rainwater reserves, stock levels, or a resource allowance.',
    read: 'The water column uses a linear zero-to-capacity scale. Dashed leaders locate your named thresholds. Threshold labels are separated vertically so nearby values remain readable.',
    rule: 'Supply zero or one observation. Capacity comes from the point target, the chart target, or 100. Up to 6 unique thresholds can lie between zero and capacity. Over-capacity values retain their exact reading while the visible water fill is capped.',
    source: "type: 'waterline',\n  unit: 'L',\n  thresholds: [\n    { label: 'Refill soon', value: 20 },\n    { label: 'Reserve', value: 55 },\n    { label: 'High water', value: 90 },\n  ],\n  data: [{ label: 'Rain tank', value: 68, target: 100 }]",
  },
  sundial: {
    use: 'A workday, outdoor activity plan, or daily routine with simultaneous tracks.',
    read: 'Clock time runs clockwise from midnight at the top. Each arc begins and ends at its actual time. Tracks are ordered from outside inward by first appearance; the optional cursor points to a supplied time.',
    rule: 'This is a schedule dial, not a physical sundial. Use HH:mm strings within one day; only an interval end may be 24:00. Ends are exclusive. Split overnight activities into separate dates/charts. Up to 12 intervals and 4 tracks are supported; overlapping intervals need different tracks.',
    source: "type: 'sundial',\n  at: '13:30',\n  data: [\n    { label: 'Deep work', start: '09:00', end: '11:30', track: 'Work' },\n    { label: 'Walk', start: '12:00', end: '13:00', track: 'Life' },\n    { label: 'Create', start: '14:00', end: '17:00', track: 'Work' },\n  ]",
  },
  'season-wheel': {
    use: 'Planting plans, release schedules, school terms, or a year of creative work.',
    read: 'The full circle is the selected Gregorian year. Actual dates determine angular position, so February, March, and leap years retain their real lengths. Separate tracks show simultaneous plans.',
    rule: 'Use ISO start/end dates and an exclusive end. An interval can end on January 1 of the following year. Intervals must fit in the selected year; split those that cross it. Up to 12 intervals and 4 nonoverlapping tracks are supported. This does not compute solar terms or local seasons.',
    source: "type: 'season-wheel',\n  year: 2026,\n  at: '2026-09-21',\n  data: [\n    { label: 'Prepare', start: '2026-01-15', end: '2026-03-01', track: 'Garden' },\n    { label: 'Grow', start: '2026-03-01', end: '2026-09-15', track: 'Garden' },\n    { label: 'Journal', start: '2026-06-01', end: '2026-08-01', track: 'Creative' },\n    { label: 'Rest', start: '2026-10-01', end: '2027-01-01', track: 'Garden' },\n  ]",
  },
  phenology: {
    use: 'A plant journal, observed project milestones, onboarding stages, or maintenance readiness.',
    read: 'Sprouts mark observed dates on a shared date axis. Shaded intervals represent expected windows. Unobserved stages remain in a separate column, rather than being assigned an invented date.',
    rule: 'Use up to 6 stages. Each stage can have an observedAt date, an expectedStart/expectedEnd pair, both, or neither. A missing observation stays unknown even when its expected window passes. Dates set the domain automatically, or provide both startDate and endDate for a fixed inclusive domain.',
    source: "type: 'phenology',\n  startDate: '2026-03-01',\n  endDate: '2026-05-25',\n  data: [\n    { label: 'Sown', observedAt: '2026-03-01' },\n    { label: 'Sprouted', observedAt: '2026-03-12', expectedStart: '2026-03-08', expectedEnd: '2026-03-17' },\n    { label: 'Flower', expectedStart: '2026-04-10', expectedEnd: '2026-04-25' },\n    { label: 'Harvest' },\n  ]",
  },
  'lunar-cycle': {
    use: 'Your own recurring study, review, maintenance, or creative routine.',
    read: 'Angle gives position in the defined cycle. Separate outer stems show observation values by length. The moon drawings illustrate a cycle; they are not values, completion percentages, or astronomical phase calculations.',
    rule: 'This release provides an abstract-cycle chart. The default span is 30 steps, not a lunar-month estimate. Set cycleLength and cycleUnit explicitly for your routine. Supply up to 24 nonnegative observations with unique positions in [0, cycleLength); omitted positions use the array index.',
    source: "type: 'lunar-cycle',\n  cycleLength: 30,\n  cycleUnit: 'days',\n  cyclePosition: 12,\n  max: 10,\n  data: [\n    { label: 'Gather', position: 0, value: 3 },\n    { label: 'Explore', position: 5, value: 6 },\n    { label: 'Make', position: 15, value: 10 },\n    { label: 'Rest', position: 25, value: 2 },\n  ]",
  },
  'water-clock': {
    use: 'A focus session, cooking interval, meeting allocation, or a remaining time budget.',
    read: 'Water height shows the remaining share of a duration in a constant-area vessel. timeMode says whether your input is elapsed or remaining; it defaults to remaining. The numeric reading keeps that convention explicit.',
    rule: 'Use zero or one nonnegative observation and a positive target duration. Values and targets share the unit you supply. For elapsed input, overrun leaves the vessel empty and shows the excess. This is a snapshot: your application supplies updates. It does not start a timer or model an unregulated physical outlet.',
    source: "type: 'water-clock',\n  timeMode: 'elapsed',\n  unit: 'min',\n  data: [{ label: 'Focus session', value: 9, target: 25 }]",
  },
  balance: {
    use: 'Budget versus actual, incoming versus outgoing resources, or consumption versus replenishment.',
    read: 'The two bars use the same linear zero baseline and maximum. The balance beam leans toward the larger quantity as a directional cue. Stone shapes are decorative; the printed difference is right minus left.',
    rule: 'Provide exactly two observations, or an empty array for an empty state. Values must be nonnegative or null. A missing reading leaves the difference unavailable. Use the same units for both sides, and max when several comparisons need a shared scale.',
    source: "type: 'balance',\n  unit: 'L',\n  max: 100,\n  data: [\n    { label: 'Replenished', value: 72 },\n    { label: 'Used', value: 54 },\n  ]",
  },
  'cord-ledger': {
    use: 'Team contributions, grouped inventory, volunteer hours, or completed work.',
    read: 'Cords separate categories, while explicit knot units show their amounts. Parent tracks group neighboring cords. Knot groups of ten aid counting; partial filled areas retain fractional units.',
    rule: 'Use up to 8 nonnegative observations. Keep each parent track contiguous in the array. If a cord needs more than 20 knots, the chart increases and labels the effective denomination. This contemporary design is not an authentic khipu decoder or a reconstruction of all historical meanings.',
    source: "type: 'cord-ledger',\n  unitsPerMark: 1,\n  unit: 'h',\n  data: [\n    { label: 'Maya', track: 'Garden crew', value: 12 },\n    { label: 'Leo', track: 'Garden crew', value: 8 },\n    { label: 'Sam', track: 'Kitchen crew', value: 10 },\n    { label: 'Noor', track: 'Kitchen crew', value: 7.5 },\n  ]",
  },
  'growth-history': {
    use: 'Annual learning, successive savings contributions, or resource growth over time.',
    read: 'The oldest period sits nearest the center, followed by successive layers in input order. growthMode selects whether radial thickness or annular area encodes each contribution. Linked bars use a common linear scale for exact comparison.',
    rule: 'Use up to 10 nonnegative periods in chronological order. The default is thickness; area derives radii from cumulative area. A zero contributes no layer. An unknown period also has no quantitative layer and is explicitly labeled No data; do not interpret the visible stack as a complete total when periods are unknown. Existing Rings still compares independent goal percentages.',
    source: "type: 'growth-history',\n  growthMode: 'thickness',\n  unit: 'h',\n  data: [\n    { label: '2022', value: 20 },\n    { label: '2023', value: 35 },\n    { label: '2024', value: 28 },\n    { label: '2025', value: 50 },\n    { label: '2026', value: 67 },\n  ]",
  },
  'tidal-rhythm': {
    use: 'Demand by hour across several days, repeated usage patterns, or measured recurring workloads.',
    read: 'Small multiples align the same cycle positions on a shared numeric scale. Unlike the original evenly spaced River chart, horizontal distance here comes from explicit position values. Lines connect measurements, and null observations break the paths.',
    rule: 'Use up to 4 cycles, each with at most 48 observations. Positions must increase strictly within each cycle and lie in [0, cycleLength], including the endpoint. Omitted positions use the index within that cycle. Negative values are supported. This is a visualization of supplied observations, not a tide predictor or a detector of periodicity.',
    source: "type: 'tidal-rhythm',\n  cycleLength: 24,\n  cycleUnit: 'h',\n  data: [\n    { cycle: 'Monday', position: 0, value: 12 },\n    { cycle: 'Monday', position: 8, value: 44 },\n    { cycle: 'Monday', position: 16, value: null },\n    { cycle: 'Monday', position: 24, value: 14 },\n    { cycle: 'Tuesday', position: 0, value: 9 },\n    { cycle: 'Tuesday', position: 8, value: 35 },\n    { cycle: 'Tuesday', position: 24, value: 18 },\n  ]",
  },
  'star-cycle': {
    use: 'Recurring checkpoints, maintenance visits, learning reviews, or regular team touchpoints.',
    read: 'Each checkpoint has an angular position within a defined cycle. Star intensity carries the nonnegative observation value. Labels separate checkpoint positions from their values, and an optional dashed cursor shows a supplied cycle position.',
    rule: 'Use up to 24 observations with unique positions in [0, cycleLength). Omitted positions use array indices; cycleLength defaults to 12. A null is an unknown reading. This is an abstract recurring map, not a star chart, constellation reconstruction, or astronomical clock.',
    source: "type: 'star-cycle',\n  cycleLength: 12,\n  cycleUnit: 'weeks',\n  cyclePosition: 5,\n  max: 10,\n  data: [\n    { label: 'Reflect', position: 0, value: 8 },\n    { label: 'Connect', position: 4, value: 7 },\n    { label: 'Share', position: 8, value: 6 },\n  ]",
  },
};
