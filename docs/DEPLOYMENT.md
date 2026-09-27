# Website deployment

NaturePlot's home page, playground, and documentation are hosted on GitHub Pages:

- [Home and playground](https://jayachandranpm.github.io/NaturePlot/)
- [Documentation](https://jayachandranpm.github.io/NaturePlot/docs/)
- [Installation instructions](https://jayachandranpm.github.io/NaturePlot/docs/#/installation)
- [Source code](https://github.com/jayachandranpm/NaturePlot)

## Updating the website

Push a reviewed change to `main`. The **Validate and deploy NaturePlot** workflow installs dependencies from `package-lock.json`, runs the JavaScript tests, builds the library and site, checks package exports and TypeScript declarations, and tests the Python interface. Only successful builds deploy. Pull requests run the same checks without deploying.

The Vite build writes the home page to `site/index.html` and documentation to `site/docs/index.html`. Relative asset URLs allow both pages to work under the `/NaturePlot/` project path. Documentation uses hash routes, so links such as `docs/#/python` can be opened directly without server rewrites. Only the `site/` directory is uploaded to Pages.

View deployment progress in the repository's **Actions** tab. The workflow can also be run manually with **Run workflow**. GitHub Pages must use **GitHub Actions** as its publishing source in **Settings → Pages**.

## Local validation

Use Node.js 24 and Python 3.10 or newer:

```sh
npm ci
npm test
npm run build
npm run test:package
python3 -m unittest discover -s python/tests
npm run preview
```

Open the preview URL printed by Vite, then check `/docs/#/installation` and `/docs/#/python`.

## Package releases are separate

Website deployment does not publish to npm or PyPI, change package versions, or require registry tokens. Version 0.7.0 is available from both registries:

```sh
npm install natureplot
pnpm add natureplot
yarn add natureplot
bun add natureplot
python -m pip install natureplot
uv add natureplot
poetry add natureplot
```

See [PUBLISHING.md](PUBLISHING.md) for future library releases. Published package artifacts are immutable; repository metadata changes appear in the next package release.
