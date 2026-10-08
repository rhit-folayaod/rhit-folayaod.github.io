# rhit-folayaod.github.io

Timi Folayan's portfolio. It opens on a late-90s style desktop; each game icon opens the same portfolio (experience, projects, skills, about) dressed up as a different game. **glory** on the desktop picks one at random.

| Icon | Theme | Route |
| --- | --- | --- |
| Super Plumber Bros. | side-scroller: pipes are sections, projects hide in ? blocks | `#/mario/...` |
| Dig & Build | 2D sandbox: hotbar menu (keys 1-0), NPC dialog boxes, crafting window | `#/terraria/...` |
| Block Craft | block-game title screen (the original site) | `#/minecraft/...` |
| Blue Blur Zone | zone select, act title cards, item monitors, rings | `#/sonic/...` |
| Battle Royale Lobby | battle pass tiers, item shop, locker | `#/fortnite/...` |

Every theme has `/experience`, `/projects[/<id>]`, `/skills`, `/about`. Old links (`#/projects`, `#about`, `daq-mcp.html`, ...) land in Block Craft.

Static HTML/CSS/JS served straight from `main` by GitHub Pages. No build step.

## Layout

- `index.html`: shell
- `assets/js/data.js`: every word of content, shared by all themes. Edit this, not the markup.
- `assets/js/boot.js`: router; loads each theme's JS and CSS the first time it's opened
- `assets/js/desktop.js`: the desktop (icons, windows, start menu, glory)
- `assets/js/themes/<theme>.js` + `assets/css/<theme>.css`: one pair per game
- `assets/js/shared.js`: theme list, disclaimer, small helpers
- `assets/js/pixel.js`: all icons, drawn in code and emitted as SVG
- `assets/img/`: generated art for Block Craft (`npm run art` rebuilds it)
- Old `*.html` project pages are redirect stubs.

## Art, fonts, and the fan-made part

These are tributes, not affiliated with or endorsed by Nintendo, Sega, Epic Games, Re-Logic, Mojang, or Microsoft, and every screen says so. Nothing is ripped: no sprites, logos, music, sound, or official fonts, and no characters are drawn. Blocks, pipes, rings, crates and the desktop chrome are CSS, inline SVG, or `pixel.js`. On-screen names are parodies; only the desktop tooltips say which game a theme is styled after.

Fonts are self-hosted, all SIL Open Font License 1.1 (`assets/fonts/OFL-*.txt`): Pixelify Sans, VT323 (digits only, so a 5 never reads as a 2), Press Start 2P, Jersey 10, Bungee, Anton.

## Checks

```
npm ci
npx playwright install chromium   # or PW_CHANNEL=chrome to reuse an installed Chrome
npm run test:e2e
```

Six journeys at 1440 and 390 wide: desktop boot + windows, glory never repeating the last game, every theme showing the same experience/projects with a way home, Block Craft's project/skills interactions, content hygiene across all 25 theme screens, and old-URL redirects. Not wired into CI yet.

Local preview: `npm run serve`, then open http://localhost:4173.
