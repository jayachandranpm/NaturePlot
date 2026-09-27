import json
from datetime import date, datetime
from html.parser import HTMLParser
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from natureplot import Chart, chart_types, __version__


class DocumentParser(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.scripts = []
        self.config = None
        self.in_config = False
        self.iframes = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag == "script":
            self.scripts.append(attributes)
            self.in_config = attributes.get("type") == "application/json"
        if tag == "iframe":
            self.iframes.append(attributes)

    def handle_data(self, data):
        if self.in_config:
            self.config = json.loads(data)

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_config = False


class ChartTests(unittest.TestCase):
    def test_catalog_has_every_chart_and_cannot_be_mutated(self):
        catalog = chart_types()
        self.assertEqual(len(catalog), 50)
        self.assertEqual(__version__, "0.7.0")
        del catalog["fern"]
        self.assertIn("fern", chart_types())
        for key in chart_types():
            self.assertEqual(Chart(key, []).to_dict()["type"], key)

    def test_dates_aliases_missing_values_and_defensive_copies(self):
        data = [{"date": date(2026, 9, 1), "value": None}, {"date": "2026-09-02", "value": 0}]
        chart = Chart("garden", data, start_date=date(2026, 9, 1), show_table=True)
        data[0]["value"] = 42
        options = chart.to_dict()
        self.assertEqual(options["startDate"], "2026-09-01")
        self.assertTrue(options["showTable"])
        self.assertIsNone(options["data"][0]["value"])
        self.assertEqual(options["data"][1]["value"], 0)
        options["data"].clear()
        self.assertEqual(len(chart.to_dict()["data"]), 2)

    def test_rejects_invalid_and_unsupported_options(self):
        for kwargs in [{"unknown": 1}, {"on_select": lambda *_: None}, {"formatValue": "x"}, {"show_table": True, "showTable": False}, {"title": 4}]:
            with self.subTest(kwargs=kwargs), self.assertRaises(TypeError):
                Chart("forest", [], **kwargs)
        for kwargs in [{"theme": "missing"}, {"detail": "photographic"}]:
            with self.subTest(kwargs=kwargs), self.assertRaises(ValueError):
                Chart("forest", [], **kwargs)
        with self.assertRaises(ValueError):
            Chart("unknown", [])

    def test_rejects_nonfinite_and_imprecise_numbers_and_invalid_data(self):
        for value in [float("nan"), float("inf"), -float("inf"), 2**53, -(2**53)]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                Chart("forest", [{"value": value}])
        for data in ["bad", {"value": 1}, [4], [{1: "bad"}], [{"date": datetime(2026, 9, 1), "value": 1}]]:
            with self.subTest(data=data), self.assertRaises(TypeError):
                Chart("forest", data)
        self.assertEqual(Chart("forest", ({"value": i} for i in range(3))).to_dict()["data"], [{"value": 0}, {"value": 1}, {"value": 2}])

    def test_html_preserves_untrusted_text_without_creating_markup(self):
        label = '</script><script>window.injected=true</script><img src=x onerror=alert(1)> & "\u2028'
        chart = Chart("forest", [{"label": label, "value": 2}], title=label)
        source = chart.to_html()
        parsed = DocumentParser(source)
        self.assertEqual(len(parsed.scripts), 3)
        self.assertEqual(parsed.config["data"][0]["label"], label)
        self.assertNotIn('<img src=x', source)
        self.assertIn('Download SVG', source)
        self.assertFalse(any('src' in script for script in parsed.scripts))

    def test_fragments_can_share_runtime_and_have_unique_ids(self):
        chart = Chart("forest", [{"value": 1}])
        first = chart.to_html(full_document=False, include_js=False)
        second = chart.to_html(full_document=False, include_js=False)
        self.assertNotEqual(first, second)
        self.assertNotIn('<!doctype', first)
        self.assertEqual(len(DocumentParser(first).scripts), 2)
        self.assertIn('Load natureplot.global.js', first)

    def test_notebook_frame_is_self_contained_and_isolated(self):
        frame = DocumentParser(Chart("forest", [])._repr_html_()).iframes[0]
        self.assertEqual(frame["sandbox"], "allow-scripts allow-downloads")
        self.assertIn('<!doctype html>', frame["srcdoc"])
        self.assertEqual(len(DocumentParser(frame["srcdoc"]).scripts), 3)

    def test_write_html_uses_utf8_and_returns_absolute_path(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Chart("forest", [{"label": "葉", "value": 3}]).write_html(Path(directory) / "chart.html")
            self.assertTrue(path.is_absolute())
            self.assertIn("葉", path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
