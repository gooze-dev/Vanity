# gooze.dev

The Gooze website and docs, built with [Astro](https://astro.build) as a fully static site. It also serves the Go vanity import paths `gooze.dev/pkg/gooze` and `gooze.dev/pkg/goozels`: `go get` reads the `go-import` and `go-source` meta tags on the pages in `src/pages/pkg/`.

## Getting started

You need Node.js 22.23.4 or newer.

```bash
npm ci
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). Pages live in `src/pages/`, and the docs structure in `src/lib/docs-pages.ts`.

## Build and checks

```bash
npm run build     # writes the site to out/
npm run preview   # serves out/ locally
npm run lint      # eslint and astro check
npm run seo:audit # checks the SEO rules on out/, after a build
```

## Deploy

`.github/workflows/pages.yml` publishes `out/` to GitHub Pages when a `v*` tag is pushed, so merging to main doesn't go live until a release. The workflow can also be run by hand.
