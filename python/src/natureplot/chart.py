"""Python data interface to the packaged NaturePlot JavaScript renderer."""
from __future__ import annotations

from collections.abc import Iterable, Mapping
from datetime import date, datetime
from functools import lru_cache
from html import escape
from importlib.resources import files
import json
from pathlib import Path
import re
from typing import Any
from uuid import uuid4


@lru_cache(maxsize=1)
def _catalog() -> dict[str, Any]:
    return json.loads(files("natureplot").joinpath("_assets/catalog.json").read_text(encoding="utf-8"))


@lru_cache(maxsize=1)
def _bundle() -> str:
    bundle = files("natureplot").joinpath("_assets/natureplot.global.js").read_text(encoding="utf-8")
    # Keep script boundaries safe even if a future renderer contains this literal.
    return re.sub(r"</script", r"<\\/script", bundle, flags=re.IGNORECASE)


def chart_types() -> dict[str, dict[str, str]]:
    """Return a fresh catalog of all 50 chart names, categories, and encodings."""
    return json.loads(json.dumps(_catalog()["charts"]))


def _json_value(value: Any) -> Any:
    if type(value) is int and abs(value) > 2**53 - 1:
        raise ValueError("Integers must fit JavaScript's exact range (±9007199254740991). Rescale larger quantities.")
    if isinstance(value, datetime):
        raise TypeError("Use a datetime.date or an ISO string for calendar dates; convert datetime with .date().")
    if isinstance(value, date):
        return value.isoformat()
    if isinstance(value, Mapping):
        if any(not isinstance(key, str) for key in value):
            raise TypeError("Chart objects must have string keys.")
        return {key: _json_value(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [_json_value(item) for item in value]
    return value


def _script_json(value: Any) -> str:
    text = json.dumps(value, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
    for original, encoded in (("&", "\\u0026"), ("<", "\\u003c"), (">", "\\u003e"), ("\u2028", "\\u2028"), ("\u2029", "\\u2029")):
        text = text.replace(original, encoded)
    return text


class Chart:
    """Create an offline interactive chart from observations and chart options.

    Options accept JavaScript camelCase or Python snake_case names. Python
    callbacks are not supported: interaction runs inside the browser. Detailed
    measurement validation is performed by the shared JavaScript renderer.
    """

    def __init__(self, chart_type: str, data: Iterable[Mapping[str, Any]], **options: Any) -> None:
        catalog = _catalog()
        if not isinstance(chart_type, str) or chart_type not in catalog["charts"]:
            raise ValueError(f"Unknown chart type {chart_type!r}. See natureplot.chart_types().")
        aliases = {re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower(): name for name in catalog["options"]}
        normalized: dict[str, Any] = {}
        for name, value in options.items():
            key = aliases.get(name, name)
            if name in ("on_select", "onSelect", "format_value", "formatValue"):
                raise TypeError("Python callbacks cannot run in exported HTML. Use the JavaScript API for browser callbacks.")
            if key not in catalog["options"]:
                raise TypeError(f"Unknown chart option {name!r}.")
            if key in normalized:
                raise TypeError(f"Chart option {key!r} was supplied more than once.")
            normalized[key] = value
        if isinstance(data, (str, bytes, Mapping)):
            raise TypeError("data must be an iterable of observation dictionaries.")
        observations = list(data)
        if any(not isinstance(point, Mapping) for point in observations):
            raise TypeError("Each observation must be a dictionary, such as {'label': 'Mon', 'value': 4}.")
        theme = normalized.get("theme", "meadow")
        if not isinstance(theme, Mapping) and (not isinstance(theme, str) or theme not in catalog["themes"]):
            raise ValueError("theme must be meadow, ocean, autumn, twilight, or a theme dictionary.")
        if normalized.get("detail", "natural") not in ("natural", "essential"):
            raise ValueError("detail must be natural or essential.")
        for name in ("title", "description", "unit", "xLabel", "yLabel", "weightLabel"):
            if name in normalized and not isinstance(normalized[name], str):
                raise TypeError(f"{name} must be a string.")
        # Copy through JSON to isolate the chart from subsequent caller mutations.
        serialized = _json_value({"type": chart_type, "data": observations, **normalized})
        try:
            self._options = json.loads(json.dumps(serialized, allow_nan=False))
        except (ValueError, OverflowError) as error:
            raise ValueError("Chart data must contain finite, JSON-compatible values; use None for missing readings.") from error

    def to_dict(self) -> dict[str, Any]:
        """Return a defensive copy of the browser options, with camelCase keys."""
        return json.loads(json.dumps(self._options))

    def to_html(self, *, full_document: bool = True, include_js: bool = True) -> str:
        """Render HTML; JavaScript creates the SVG when the document is opened.

        By default the complete runtime is embedded, with no CDN or Node.js
        dependency. With include_js=False, the host must load the matching
        natureplot.global.js before the fragment. No JavaScript is executed by
        Python. Inline scripts must be allowed by the host's CSP.
        """
        identifier = "natureplot-" + uuid4().hex
        title = self._options.get("title") or _catalog()["charts"][self._options["type"]]["name"]
        safe_title = escape(title, quote=True)
        runtime = f"<script>{_bundle()}</script>" if include_js else ""
        config = _script_json(self._options)
        fragment = f'''<section class="natureplot-python" aria-label="{safe_title}">
<div id="{identifier}"></div>
<p id="{identifier}-error" role="alert" hidden></p>
<div style="padding:12px 0"><button id="{identifier}-export" type="button" hidden style="font:inherit;padding:8px 14px;border:1px solid #87967d;border-radius:6px;background:transparent;color:inherit;cursor:pointer">Download SVG</button></div>
<noscript>This interactive chart requires JavaScript.</noscript>
</section>
{runtime}
<script type="application/json" id="{identifier}-data">{config}</script>
<script>
(function () {{
  const host = document.getElementById("{identifier}");
  const error = document.getElementById("{identifier}-error");
  const download = document.getElementById("{identifier}-export");
  try {{
    if (!window.NaturePlot) throw new Error("Load natureplot.global.js before this chart.");
    const chart = window.NaturePlot.createChart(host, JSON.parse(document.getElementById("{identifier}-data").textContent));
    host.natureplot = chart;
    download.hidden = false;
    download.addEventListener("click", function () {{ chart.download("natureplot.svg"); }});
  }} catch (cause) {{
    error.hidden = false;
    error.textContent = cause instanceof Error ? cause.message : String(cause);
  }}
}})();
</script>'''
        if not full_document:
            return fragment
        return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{safe_title}</title>
<style>body{{margin:0;padding:24px;background:#f9faf6;color:#2b4033;font:16px/1.6 system-ui,sans-serif}}main{{max-width:960px;margin:auto}}h1{{font-size:24px;line-height:1.3}}[role=alert]{{padding:16px;border:1px solid #b65345;border-radius:8px;overflow-wrap:anywhere}}</style>
</head><body><main><h1>{safe_title}</h1>{fragment}</main></body></html>'''

    def write_html(self, path: str | Path) -> Path:
        """Write a standalone HTML file and return its absolute path."""
        target = Path(path).expanduser().resolve()
        target.write_text(self.to_html(), encoding="utf-8")
        return target

    def _repr_html_(self) -> str:
        """Notebook representation with each chart isolated in its own iframe."""
        title = self._options.get("title") or "NaturePlot chart"
        return f'<iframe title="{escape(title, quote=True)}" sandbox="allow-scripts allow-downloads" srcdoc="{escape(self.to_html(), quote=True)}" width="100%" height="600" style="border:0;display:block"></iframe>'
