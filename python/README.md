# NaturePlot for Python

Create interactive nature-inspired SVG charts from Python data. All 50 NaturePlot.js chart types are included: growing calendars, forests, rivers, petals, natural instruments, and more.

The Python package embeds the NaturePlot.js browser renderer. It generates HTML for reports, notebooks, and web applications. Charts retain hover readings, keyboard selection, exact data tables, and SVG downloads. No Node.js, CDN, or Python runtime dependencies are needed by users.

[Website](https://jayachandranpm.github.io/NaturePlot/) · [Python documentation](https://jayachandranpm.github.io/NaturePlot/docs/#/python) · [Source](https://github.com/jayachandranpm/NaturePlot)

## Install

Choose your Python package manager:

```sh
python -m pip install natureplot
uv add natureplot
poetry add natureplot
```

Python 3.10 or newer is required.

## Create a chart

```python
from natureplot import Chart

chart = Chart(
    "forest",
    data=[
        {"label": "Online", "value": 42},
        {"label": "Retail", "value": 28},
        {"label": "Wholesale", "value": 18},
    ],
    title="Orders by sales channel",
    unit="orders",
    theme="meadow",
)
chart.write_html("orders.html")
```

Open `orders.html` in a browser. The complete JavaScript runtime is embedded, so the chart works offline. Use the **Download SVG** button to save the rendered SVG.

## Notebooks

Leave `chart` as the final expression in a notebook cell, or use `display(chart)`. The rich HTML representation uses an isolated iframe and requires a notebook frontend that permits JavaScript in trusted output. Each chart includes its runtime and does not modify the notebook's global JavaScript environment.

```python
from datetime import date
from natureplot import Chart

chart = Chart(
    "garden",
    data=[{"date": date(2026, 9, 1), "value": 8}],
    start_date=date(2026, 9, 1),
    days=30,
    title="September orders",
)
chart
```

## Options and data

Options accept both Python `snake_case` and JavaScript `camelCase`: for example, `start_date` or `startDate`, `show_table` or `showTable`. Passing both spellings of one option is an error. Observation dictionary keys use the JavaScript API names, including `observedAt`, `expectedStart`, and `expectedEnd`.

Use `None` for missing readings, zero for measured zero, and `datetime.date` for calendar dates. NaN and Infinity are rejected. Integers must be within JavaScript's exact range, ±9,007,199,254,740,991; rescale larger quantities. For pandas, pass `frame.to_dict(orient="records")` with JSON-compatible values and replace missing numeric values with `None` first.

```python
from natureplot import chart_types

for key, metadata in chart_types().items():
    print(key, metadata["category"], metadata["encoding"])
```

General input validation happens in Python. Chart-specific measurement rules, such as valid timeline intervals and maximum category counts, are checked by the shared JavaScript renderer when the page opens. Rendering errors appear as readable alerts in the document.

## API

- `Chart(chart_type, data, **options)` copies and serializes your data. Later mutations to the original list do not change the chart.
- `chart.to_dict()` returns a fresh dictionary of JavaScript chart options.
- `chart.to_html()` returns a complete, self-contained HTML document.
- `chart.to_html(full_document=False)` returns an embeddable HTML fragment. Scripts must be allowed and executed by the host; inserting it with `innerHTML` alone does not execute its scripts.
- `chart.to_html(full_document=False, include_js=False)` omits the runtime. Load the matching `natureplot.global.js` before the fragment.
- `chart.write_html(path)` writes UTF-8 HTML and returns the absolute `Path`.
- `chart_types()` returns metadata for all 50 built-in charts.

Interaction runs in the browser. Python `on_select` callbacks, live kernel synchronization, static PNG/PDF generation, server-side SVG rendering, and JavaScript custom renderer registration are not part of this Python API. Use the JavaScript API for client-side callbacks. Rendering allows inline scripts and styles, so a host's Content Security Policy must permit those or provide an integration of its own.

## Build from the monorepo

From the repository root:

```sh
npm run prepare:python
python3 -m venv .venv-packaging
.venv-packaging/bin/python -m pip install build twine
.venv-packaging/bin/python -m build python
.venv-packaging/bin/python -m twine check python/dist/*
python3 -m unittest discover -s python/tests
```

`prepare:python` rebuilds the browser runtime and copies the version, catalog, runtime, and MIT license into this package. Building rejects missing assets, version mismatches, or a mismatched runtime checksum. The source distribution also includes the bundled runtime and can build a wheel without Node.js.

See `docs/PUBLISHING.md` in the monorepo for the npm and PyPI publishing steps. This project is MIT licensed.
