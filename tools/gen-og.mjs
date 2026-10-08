// Link-preview card: assets/og/og-card.png (1200x630). Drawn as HTML with the
// site's own pixel icons and OFL fonts, then screenshotted by Playwright.
// Run after tools/gen_icons.py: node tools/gen-og.mjs
import { chromium } from "@playwright/test";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tmp = mkdtempSync(join(tmpdir(), "og-"));
writeFileSync(join(tmp, "pixel.mjs"), readFileSync(join(root, "assets/js/pixel.js")));
const { icon } = await import(pathToFileURL(join(tmp, "pixel.mjs")).href);

const crown = readFileSync(join(root, "assets/og/crown.svg"), "utf8").replace("<svg ", '<svg class="px" ');
const font = (f) => pathToFileURL(join(root, "assets/fonts", f)).href;
const games = [
  ["qblock", "Plumber"], ["tree", "Dig"], ["grass", "Block"], ["ring", "Zone"],
  ["crate", "Lobby"], ["townhall", "Village"], ["joystick", "Arcade"],
];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Pixelify Sans"; src: url("${font("pixelify-sans.woff2")}"); font-weight: 400 700; }
@font-face { font-family: "Press Start 2P"; src: url("${font("press-start-2p.woff2")}"); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body { position: relative; background: #008080; font-family: "Pixelify Sans", sans-serif; color: #000; }
svg.px { display: block; width: 100%; height: 100%; image-rendering: pixelated; }
:root {
  --raised: inset -2px -2px #0a0a0a, inset 2px 2px #fff, inset -4px -4px #808080, inset 4px 4px #dfdfdf;
  --sunken: inset -2px -2px #fff, inset 2px 2px #808080, inset -4px -4px #dfdfdf, inset 4px 4px #0a0a0a;
}
.icons { position: absolute; left: 28px; top: 26px; display: grid; grid-template-columns: repeat(2, 96px); gap: 14px 8px; }
.ic { display: grid; justify-items: center; gap: 6px; }
.ic .img { width: 56px; height: 56px; }
.ic span { color: #fff; font-size: 18px; text-shadow: 2px 2px 0 #003d3d; }
.win { position: absolute; left: 250px; top: 68px; width: 920px; height: 440px; padding: 6px; background: #c0c0c0;
  box-shadow: var(--raised), 6px 6px 0 rgba(0,0,0,.28); display: flex; flex-direction: column; }
.bar { height: 44px; display: flex; align-items: center; gap: 10px; padding: 0 6px 0 10px; color: #fff;
  background: linear-gradient(90deg, #000080, #1084d0); font-weight: 700; font-size: 24px; }
.bar .ico { width: 30px; height: 30px; }
.bar b { flex: 1; font-weight: 700; }
.bx { width: 34px; height: 30px; background: #c0c0c0; box-shadow: var(--raised); display: grid; place-items: center; }
.bx i { display: block; width: 14px; height: 14px; background:
  linear-gradient(45deg, transparent 43%, #000 43% 57%, transparent 57%),
  linear-gradient(-45deg, transparent 43%, #000 43% 57%, transparent 57%); }
.body { flex: 1; margin: 6px 2px 2px; display: flex; align-items: center; gap: 38px; padding: 0 40px; background: #fff; box-shadow: var(--sunken); }
.crown { width: 192px; height: 192px; flex: none; }
.name { white-space: nowrap; font-size: 86px; line-height: 1; font-weight: 700; letter-spacing: 1px; }
.sub { margin-top: 16px; font-size: 60px; line-height: 1; color: #000080; font-weight: 600; }
.tag { margin-top: 26px; font-size: 26px; color: #404040; }
.task { position: absolute; left: 0; right: 0; bottom: 0; height: 64px; background: #c0c0c0;
  box-shadow: inset 0 3px #dfdfdf, inset 0 5px #fff; display: flex; align-items: center; padding: 6px 8px 0; gap: 10px; }
.start { height: 46px; display: flex; align-items: center; gap: 10px; padding: 0 16px 0 10px; box-shadow: var(--raised); font-weight: 700; font-size: 26px; }
.start .ico { width: 32px; height: 32px; }
.task .fill { flex: 1; }
.tray { height: 44px; display: flex; align-items: center; padding: 0 18px; box-shadow: var(--sunken); font-size: 24px; }
</style></head><body>
<div class="icons">${games.map(([k, l]) => `<div class="ic"><div class="img">${icon(k)}</div><span>${l}</span></div>`).join("")}</div>
<div class="win">
  <div class="bar"><div class="ico">${crown}</div><b>glory.exe</b><div class="bx"><i></i></div></div>
  <div class="body">
    <div class="crown">${crown}</div>
    <div><div class="name">Timi Folayan</div><div class="sub">Portfolio</div>
    <div class="tag">Pick a game to explore my work</div></div>
  </div>
</div>
<div class="task"><div class="start"><div class="ico">${crown}</div>Start</div><div class="fill"></div><div class="tray">timifolayan.com</div></div>
</body></html>`;

const page_ = join(tmp, "og.html");
writeFileSync(page_, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(page_).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: join(root, "assets/og/og-card.png") });
await browser.close();
console.log("wrote assets/og/og-card.png");
