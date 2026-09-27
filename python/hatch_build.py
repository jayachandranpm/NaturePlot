"""Reject incomplete or mismatched source distributions before upload."""
import hashlib
import json
from pathlib import Path
from hatchling.builders.hooks.plugin.interface import BuildHookInterface


class CustomBuildHook(BuildHookInterface):
    def initialize(self, version, build_data):
        assets = Path(self.root) / "src/natureplot/_assets"
        try:
            catalog = json.loads((assets / "catalog.json").read_text(encoding="utf-8"))
            bundle = (assets / "natureplot.global.js").read_bytes()
        except FileNotFoundError as error:
            raise RuntimeError("Missing browser assets. Run npm run prepare:python from the repository root.") from error
        if catalog["version"] != self.metadata.version:
            raise RuntimeError("Python and browser versions differ. Run npm run prepare:python.")
        if hashlib.sha256(bundle).hexdigest() != catalog["bundle_sha256"]:
            raise RuntimeError("Browser bundle checksum mismatch. Run npm run prepare:python.")
        if len(catalog["charts"]) != 50:
            raise RuntimeError("The Python distribution must include all 50 charts.")
