# rhit-folayaod.github.io

Timi Folayan's portfolio. It opens on a late-90s style desktop; each game icon opens the same portfolio (experience, projects, skills, about) dressed up as a different game. **glory** on the desktop picks one at random.

| Icon | Theme | Route |
| --- | --- | --- |
| Super Plumber Bros. | side-scroller: pipes are sections, projects hide in ? blocks | `#/mario/...` |
| Dig & Build | 2D sandbox: hotbar menu (keys 1-0), NPC dialog boxes, crafting window | `#/terraria/...` |
| Block Craft | block-game title screen (the original site) | `#/minecraft/...` |
| Blue Blur Zone | zone select, act title cards, item monitors, rings | `#/sonic/...` |
| Battle Royale Lobby | battle pass tiers, item shop, locker | `#/fortnite/...` |
| Village Clash | top-down village: Town Hall is About, Barracks is Experience, Builder's Workshop is Projects, Laboratory is Skills | `#/clash/...` |
| Arcade Brawl | character select with a VS splash for projects, arcade ladder, move list with stat bars, player profile | `#/fighter/...` |

Every theme has `/experience`, `/projects[/<id>]`, `/skills`, `/about`. Old links (`#/projects`, `#about`, `daq-mcp.html`, ...) land in Block Craft; links into retired themes (`#/roblox/...`) go back to the desktop.

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
- `assets/og/og-card.png`, `favicon.*`, `apple-touch-icon.png`, `site.webmanifest`: link-preview card and icons, all built from one pixel gold crown (the glory symbol). `npm run icons` rebuilds them.
- `CNAME`: serves the site at https://timifolayan.com. Keep it.
- Old `*.html` project pages are redirect stubs.

## Art, fonts, and the fan-made part

These are tributes, not affiliated with or endorsed by Nintendo, Sega, Epic Games, Re-Logic, Mojang, Microsoft, Supercell, or Capcom, and every screen says so. Nothing is ripped: no sprites, logos, music, sound, or official fonts, and no characters, avatars, or troops are drawn. Blocks, pipes, rings, crates, village buildings, and the desktop chrome are CSS, inline SVG, or `pixel.js`. On-screen names are parodies; only the desktop tooltips say which game a theme is styled after.

Fonts are self-hosted, all SIL Open Font License 1.1 (`assets/fonts/OFL-*.txt`): Pixelify Sans, VT323 (digits only, so a 5 never reads as a 2), Press Start 2P, Jersey 10, Bungee, Anton, Lilita One, Bowlby One.

## Checks

```
npm ci
npx playwright install chromium   # or PW_CHANNEL=chrome to reuse an installed Chrome
npm run test:e2e
```

Eight journeys, each run at 1440 wide, 390 wide, and in WebKit with the iPhone 13 profile: desktop boot + windows, glory never repeating the last game, every theme showing the same experience/projects with a way home, Block Craft's project/skills interactions, content hygiene (and zero page errors) across all 35 theme screens, older projects listed after current ones and reachable from the new themes, old-URL and retired-theme redirects, and the never-blank boot. Not wired into CI yet.

Projects marked `status: "earlier"` in `data.js` are course and earlier work; keep them at the end of the list.

Local preview: `npm run serve`, then open http://localhost:4173.
