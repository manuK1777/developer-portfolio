# Developer Portfolio

My personal portfolio site — built from scratch in plain HTML/CSS/JS, with a custom bilingual content-loading system and no framework.

**Live site:** [mkrapo.dev](https://mkrapo.dev)

## Features

- **Bilingual (EN/ES)** — locale-prefixed routes (`/en/`, `/es/`) with a custom runtime i18n loader: elements tagged with `[data-i18n]` are populated from `content/{lang}.json` via `fetch`, supporting nested keys and array indices (e.g. `about.skills.0`).
- **Project filtering** — client-side tag filtering on the Projects page, no page reload.
- **Case studies** — dedicated in-depth write-ups per project, separate from the project cards overview.
- **Scroll-reveal animations** — IntersectionObserver-based reveal on scroll, with staggered delays for sibling elements, and a full bail-out when the user has `prefers-reduced-motion` set.
- **Slideshow component** — a small reusable, dependency-free slideshow (dots navigation) for project imagery.
- **Zero build step** — static HTML/CSS/JS, deployed as-is.

## Tech stack

`HTML5` · `CSS3` · `Vanilla JavaScript` · `Vercel` (hosting)

## Project structure

```
developer-portfolio/
├── en/                      # English pages (index, projects, case-studies, contact)
├── es/                       # Spanish pages (mirrored structure)
├── content/
│   ├── en.json                 # English translations, keyed by data-i18n path
│   └── es.json                  # Spanish translations
├── css/
│   ├── base.css                   # Resets, variables
│   ├── layout.css                   # Page-level layout
│   ├── components.css                 # Cards, buttons, nav, etc.
│   └── animations.css                   # Scroll-reveal & transition styles
├── js/
│   ├── main.js                # Nav toggle, language switcher, i18n loader
│   ├── projects.js              # Client-side project filtering
│   ├── slideshow.js               # Slideshow component
│   ├── animations.js                # Scroll-reveal (IntersectionObserver)
│   └── contact.js                     # Contact form handling
└── vercel.json                          # Static deployment config, root redirect to /en/
```

## Running locally

No build step required — serve the root directory with any static server:

```bash
# Python (no install needed)
python3 -m http.server 8000
```

Then open `http://localhost:8000/en/`

## Deploying

Deployed on **Vercel** with zero build configuration (`vercel.json` sets an empty build command and serves the repo root directly, redirecting `/` to `/en/`).

---

*Personal project — designed and built to showcase my work as a full-stack developer.*