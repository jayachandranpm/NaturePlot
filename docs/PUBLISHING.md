# Publishing NaturePlot

NaturePlot has two distributions with the same version and browser renderer:

| Registry | Consumers | Package |
| --- | --- | --- |
| npm | npm, pnpm, Yarn, Bun | `natureplot` JavaScript library |
| PyPI | pip, uv, Poetry | `natureplot` Python HTML/notebook interface |

There are no separate pnpm, Yarn, Bun, uv, or Poetry uploads. The npm and PyPI releases are separate operations. Verify each registry after uploading; a successful upload to one registry does not publish the other.

## 1. Prepare the release

From the repository root, with development dependencies installed:

```sh
npm test
npm run build
npm run test:package
npm run prepare:python
npm run test:python

python3 -m venv .venv-packaging
.venv-packaging/bin/python -m pip install build twine
.venv-packaging/bin/python -m build python
.venv-packaging/bin/python -m twine check python/dist/*
```

Test the installed wheel in a clean environment, including all 50 browser renderers:

```sh
python3 -m venv .venv-python-smoke
.venv-python-smoke/bin/python -m pip install --no-index --force-reinstall python/dist/natureplot-0.7.0-py3-none-any.whl
npm run test:python:package -- .venv-python-smoke/bin/python
```

The Python build creates `python/dist/natureplot-0.7.0-py3-none-any.whl` and `python/dist/natureplot-0.7.0.tar.gz`. The source distribution includes the browser runtime, so pip users do not need Node.js. The wheel has no runtime dependencies.

The Python build hook checks the runtime checksum, chart count, and version. `npm run prepare:python` copies the version from `package.json`; keep the exported version in `src/index.ts` aligned too. A version mismatch fails preparation.

Before each release, align version references and update the changelog and installation status in the README, Python README, and documentation. Add your actual public repository, homepage, and issue tracker to package metadata when those URLs exist. Use explicit artifact paths for uploads so older files in `python/dist/` are not included by accident.

## 2. Publish JavaScript to npm

Create an npm account, verify your email, and enable two-factor authentication. Log in from your own terminal:

```sh
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
npm publish --dry-run --access public --registry=https://registry.npmjs.org/
npm publish --access public --registry=https://registry.npmjs.org/
npm view natureplot version --registry=https://registry.npmjs.org/
```

`prepublishOnly` automatically runs the JavaScript tests, builds, and package checks. Complete npm's authentication prompts. Do not paste credentials into project files or chat.

After publication, users choose one command:

```sh
npm install natureplot
pnpm add natureplot
yarn add natureplot
bun add natureplot
```

All use the same ES module bundle and TypeScript declarations. The browser build is also inside the npm package at `dist/natureplot.global.js` for sites without a bundler. Node.js is a build tool here; constructing charts still requires a browser DOM.

## 3. Publish Python to PyPI

Create a PyPI account, verify your email, and set up 2FA. Create a PyPI API token for publishing. For a first package, an account-wide token may be needed; after the project exists, use a project-scoped token or configure trusted publishing. Enter the token only at Twine's secure terminal prompt.

First upload to TestPyPI if you want a registry rehearsal. TestPyPI is a separate service with its own account and token:

```sh
.venv-packaging/bin/python -m twine upload --repository testpypi \
  python/dist/natureplot-0.7.0-py3-none-any.whl \
  python/dist/natureplot-0.7.0.tar.gz
```

For the public release, upload both artifacts to PyPI:

```sh
.venv-packaging/bin/python -m twine upload \
  python/dist/natureplot-0.7.0-py3-none-any.whl \
  python/dist/natureplot-0.7.0.tar.gz
```

Verify from a clean virtual environment, then open the generated HTML:

```sh
python3 -m venv .venv-release-check
.venv-release-check/bin/python -m pip install natureplot==0.7.0
.venv-release-check/bin/python -c 'from natureplot import Chart; print(Chart("forest", [{"label": "Orders", "value": 12}]).write_html("orders.html"))'
```

After publication, consumers choose one command:

```sh
python -m pip install natureplot
uv add natureplot
poetry add natureplot
```

The Python API produces HTML rendered by the same JavaScript engine. It does not provide a native Python SVG renderer, Python event callbacks, or automatic notebook-to-kernel synchronization. See the Python guide for exact boundaries.

## Later releases and automation

Increment the version for every release; registries do not allow overwriting an existing release artifact. Rebuild both distributions from the same source and version, then publish them independently. One registry succeeding does not publish the other.

When the project has a repository and CI, configure trusted publishing separately for npm and PyPI. The repository deploys the website through GitHub Pages; see [DEPLOYMENT.md](DEPLOYMENT.md). Package releases still use the separate publishing steps above. Local build/check commands do not upload anything; publishing requires a separate authenticated upload.

## Official references

- [npm publishing](https://docs.npmjs.com/cli/v11/commands/npm-publish/)
- [npm authentication requirements](https://docs.npmjs.com/about-two-factor-authentication/)
- [pnpm add](https://pnpm.io/cli/add)
- [Yarn add](https://yarnpkg.com/cli/add)
- [Bun add](https://bun.com/docs/pm/cli/add)
- [Python packaging and publishing](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
- [PyPI trusted publishing](https://docs.pypi.org/trusted-publishers/)
- [uv dependencies](https://docs.astral.sh/uv/concepts/projects/dependencies/)
