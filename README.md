# rhit-folayaod.github.io

Timi Folayan's portfolio, laid out like a block-game title screen: stone menu buttons, a world-select list for projects, and an enchanting table for skills.

Static HTML/CSS/JS served straight from `main` by GitHub Pages. No build step.

## Layout

- `index.html`: shell; screens are hash routes (`#/experience`, `#/projects`, `#/projects/<id>`, `#/skills`, `#/about`)
- `assets/js/data.js`: every word of content. Edit this, not the markup.
- `assets/js/app.js`: screens, router, project selection, skills lookup, sound/motion options
- `assets/js/pixel.js`: all icons, drawn in code (lines + fills, auto-outlined) and emitted as SVG
- `assets/css/site.css`: styles
- `assets/img/`: generated art. `python3 tools/gen_art.py` (landscape and stone; needs Pillow) and `node tools/gen-wordmark.mjs` (the stone wordmark) rebuild it.
- Old `*.html` project pages are redirect stubs so existing links still land.

## Art and font

Every texture, icon, and the wordmark are made in this repo by the scripts above. No game assets. The font is Pixelify Sans (SIL Open Font License 1.1, `assets/fonts/OFL-PixelifySans.txt`), self-hosted and subset to Latin.

Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.

## Checks

```
npm ci
npx playwright install chromium   # or PW_CHANNEL=chrome to reuse an installed Chrome
npm run test:e2e
```

Five journeys at 1440 and 390 wide: title menu, project select/search/open, skills lookup, content hygiene (no phone number, excluded projects, or em dashes), and old-URL redirects. Not wired into CI yet.

Local preview: `npm run serve`, then open http://localhost:4173.
