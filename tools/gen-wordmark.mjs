// Builds assets/img/wordmark.svg: "TIMI FOLAYAN / PORTFOLIO" as extruded,
// cracked stone blocks. Glyphs are hand-drawn on a 7-row grid for this site.
// Run: node tools/gen-wordmark.mjs
import { writeFileSync } from "node:fs";

const G = {
  T: ["######", "######", "..##..", "..##..", "..##..", "..##..", "..##.."],
  I: ["####", ".##.", ".##.", ".##.", ".##.", ".##.", "####"],
  M: ["##....##", "###..###", "########", "##.##.##", "##....##", "##....##", "##....##"],
  F: ["######", "##....", "##....", "#####.", "##....", "##....", "##...."],
  O: [".####.", "##..##", "##..##", "##..##", "##..##", "##..##", ".####."],
  L: ["##....", "##....", "##....", "##....", "##....", "##....", "######"],
  A: [".####.", "##..##", "##..##", "######", "##..##", "##..##", "##..##"],
  Y: ["##..##", "##..##", ".####.", "..##..", "..##..", "..##..", "..##.."],
  N: ["##...##", "###..##", "####.##", "##.####", "##..###", "##...##", "##...##"],
  P: ["#####.", "##..##", "##..##", "#####.", "##....", "##....", "##...."],
  R: ["#####.", "##..##", "##..##", "#####.", "##.##.", "##..##", "##..##"],
};

let seed = 1027;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function layout(text) {
  const cells = [];
  let col = 0;
  for (const ch of text) {
    if (ch === " ") { col += 3; continue; }
    const g = G[ch];
    g.forEach((row, r) => [...row].forEach((c, k) => { if (c === "#") cells.push([col + k, r]); }));
    col += g[0].length + 1;
  }
  return { cells, cols: col - 1 };
}

function lineSvg(text, unit, ox, oy) {
  const { cells } = layout(text);
  const has = new Set(cells.map(([c, r]) => `${c},${r}`));
  const depth = Math.round(unit * 0.7);
  const o = Math.max(2, Math.round(unit * 0.22));
  const out = { shadow: [], side: [], face: [], light: [], crack: [] };
  for (const [c, r] of cells) {
    const x = ox + c * unit, y = oy + r * unit;
    out.shadow.push(`<rect x="${x - o}" y="${y - o}" width="${unit + 2 * o}" height="${unit + depth + 2 * o}"/>`);
    out.side.push(`<rect x="${x}" y="${y}" width="${unit}" height="${unit + depth}"/>`);
    out.face.push(`<rect x="${x}" y="${y}" width="${unit}" height="${unit}"/>`);
    if (!has.has(`${c},${r - 1}`)) out.light.push(`<rect x="${x}" y="${y}" width="${unit}" height="${Math.max(1, unit * 0.14)}"/>`);
    if (!has.has(`${c - 1},${r}`)) out.light.push(`<rect x="${x}" y="${y}" width="${Math.max(1, unit * 0.12)}" height="${unit}"/>`);
    if (rand() < 0.32) {
      // short zig-zag crack that stays inside this block
      const pts = [];
      let px = x + unit * (0.2 + rand() * 0.6), py = y + unit * 0.1;
      pts.push([px, py]);
      for (let i = 0; i < 3; i++) {
        px = Math.min(x + unit * 0.9, Math.max(x + unit * 0.1, px + (rand() - 0.5) * unit * 0.6));
        py = Math.min(y + unit * 0.92, py + unit * 0.28);
        pts.push([px, py]);
      }
      out.crack.push(`<polyline points="${pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(" ")}"/>`);
    }
  }
  return { ...out, depth, o };
}

const U1 = 12, U2 = 8;
const l1 = layout("TIMI FOLAYAN"), l2 = layout("PORTFOLIO");
const pad = 6;
const W = l1.cols * U1 + pad * 2;
const top = lineSvg("TIMI FOLAYAN", U1, pad, pad);
const y2 = pad + 7 * U1 + top.depth + 10;
const ox2 = Math.round((W - l2.cols * U2) / 2);
const bot = lineSvg("PORTFOLIO", U2, ox2, y2);
const H = y2 + 7 * U2 + bot.depth + pad + 2;

const join = (k) => top[k].join("") + bot[k].join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" shape-rendering="crispEdges" role="img" aria-labelledby="wm-title">
<title id="wm-title">Timi Folayan Portfolio</title>
<defs><pattern id="stone" width="12" height="12" patternUnits="userSpaceOnUse">
<rect width="12" height="12" fill="#cbc4bb"/><rect x="0" y="0" width="3" height="3" fill="#d9d3cb"/><rect x="6" y="2" width="3" height="3" fill="#bdb5ab"/><rect x="3" y="7" width="3" height="3" fill="#e0dad2"/><rect x="9" y="8" width="3" height="3" fill="#b4ab a1"/><rect x="8" y="5" width="2" height="2" fill="#d4cdc4"/><rect x="1" y="10" width="2" height="2" fill="#b9b0a6"/>
</pattern></defs>
<g fill="#1a1918">${join("shadow")}</g>
<g fill="#6a625a">${join("side")}</g>
<g fill="url(#stone)">${join("face")}</g>
<g fill="#ece6de">${join("light")}</g>
<g fill="none" stroke="#7b7168" stroke-width="1.3" stroke-linejoin="miter" shape-rendering="geometricPrecision">${join("crack")}</g>
</svg>
`.replace("#b4ab a1", "#b4aba1");
writeFileSync(new URL("../assets/img/wordmark.svg", import.meta.url), svg);
console.log(`wordmark ${W}x${H}, ${svg.length} bytes`);
