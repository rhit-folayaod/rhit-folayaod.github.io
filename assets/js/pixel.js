// Tiny pixel-art kit. Every icon on the site is drawn here at runtime from
// lines and fills, then auto-outlined and emitted as crisp SVG.

const OUTLINE = "#141414";

function grid(n) {
  return { n, p: Array.from({ length: n }, () => Array(n).fill(null)) };
}
function set(g, x, y, c) {
  if (x >= 0 && y >= 0 && x < g.n && y < g.n) g.p[y][x] = c;
}
function line(g, x0, y0, x1, y1, c) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    set(g, x0, y0, c);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}
function fill(g, test, c) {
  for (let y = 0; y < g.n; y++) for (let x = 0; x < g.n; x++) if (test(x, y)) set(g, x, y, c);
}
function rows(g, x0, y0, rowsArr, pal) {
  rowsArr.forEach((r, y) => [...r].forEach((ch, x) => { if (pal[ch]) set(g, x0 + x, y0 + y, pal[ch]); }));
}
function outline(g, c = OUTLINE) {
  const marks = [];
  for (let y = 0; y < g.n; y++) for (let x = 0; x < g.n; x++) {
    if (g.p[y][x]) continue;
    const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => {
      const X = x + a, Y = y + b;
      return X >= 0 && Y >= 0 && X < g.n && Y < g.n && g.p[Y][X] && g.p[Y][X] !== c;
    });
    if (near) marks.push([x, y]);
  }
  marks.forEach(([x, y]) => set(g, x, y, c));
}
function svg(g, label) {
  let rects = "";
  for (let y = 0; y < g.n; y++) {
    let x = 0;
    while (x < g.n) {
      const c = g.p[y][x];
      if (!c) { x++; continue; }
      let w = 1;
      while (x + w < g.n && g.p[y][x + w] === c) w++;
      rects += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${c}"/>`;
      x += w;
    }
  }
  const a11y = label ? `role="img" aria-label="${label}"` : `aria-hidden="true" focusable="false"`;
  return `<svg class="px" viewBox="0 0 ${g.n} ${g.n}" shape-rendering="crispEdges" ${a11y}>${rects}</svg>`;
}

const WOOD = "#8a5a2b", WOOD_D = "#5e3b1a";
const STEEL = "#dfe7ea", STEEL_D = "#93a5ad", GOLD = "#e8b923";

function handle(g, x0, y0, x1, y1) {
  line(g, x0, y0, x1, y1, WOOD);
  line(g, x0 + 1, y0, x1 + 1, y1, WOOD_D);
}

const draw = {
  sword() {
    const g = grid(16);
    line(g, 5, 10, 13, 2, STEEL); line(g, 6, 10, 14, 2, STEEL_D); set(g, 14, 1, STEEL);
    line(g, 2, 8, 7, 13, GOLD);
    handle(g, 1, 14, 4, 11);
    outline(g); return g;
  },
  pickaxe() {
    const g = grid(16);
    handle(g, 2, 14, 10, 6);
    line(g, 4, 2, 7, 1, STEEL); line(g, 7, 1, 10, 2, STEEL); line(g, 10, 2, 13, 5, STEEL);
    line(g, 13, 5, 14, 8, STEEL); line(g, 14, 8, 13, 11, STEEL);
    line(g, 8, 2, 12, 6, STEEL_D); line(g, 12, 6, 13, 8, STEEL_D);
    outline(g); return g;
  },
  shovel() {
    const g = grid(16);
    handle(g, 1, 14, 8, 7);
    fill(g, (x, y) => Math.abs(x - 11) + Math.abs(y - 4) <= 3, STEEL);
    fill(g, (x, y) => Math.abs(x - 11) + Math.abs(y - 4) <= 3 && x + y >= 16, STEEL_D);
    outline(g); return g;
  },
  axe() {
    const g = grid(16);
    handle(g, 2, 14, 11, 5);
    fill(g, (x, y) => x >= 6 && x <= 10 && y >= 1 && y <= 6 && (x - 6) + (6 - y) >= 1 && !(x === 10 && y === 6), STEEL);
    line(g, 6, 2, 9, 5, STEEL_D);
    outline(g); return g;
  },
  hoe() {
    const g = grid(16);
    handle(g, 2, 14, 11, 5);
    line(g, 11, 5, 13, 3, WOOD); line(g, 8, 3, 12, 3, STEEL); line(g, 8, 2, 11, 2, STEEL); set(g, 8, 4, STEEL_D); set(g, 9, 4, STEEL_D);
    outline(g); return g;
  },
  book() {
    const g = grid(16);
    fill(g, (x, y) => x >= 3 && x <= 12 && y >= 2 && y <= 13, "#7a2f4a");
    fill(g, (x, y) => x >= 4 && x <= 11 && y >= 3 && y <= 11, "#a23e5e");
    fill(g, (x, y) => x >= 3 && x <= 12 && y === 13, "#ece2c8");
    line(g, 3, 2, 3, 12, "#5a1f35");
    set(g, 6, 5, "#f6d9ff"); set(g, 9, 7, "#f6d9ff"); set(g, 7, 9, "#e6b3ff"); set(g, 10, 4, "#e6b3ff");
    outline(g); return g;
  },
  openBook() {
    const g = grid(24);
    fill(g, (x, y) => y >= 6 && y <= 17 && x >= 2 && x <= 21, "#7a4a22");
    fill(g, (x, y) => y >= 5 && y <= 16 && ((x >= 3 && x <= 11) || (x >= 12 && x <= 20)), "#f1ecdf");
    fill(g, (x, y) => y >= 5 && y <= 16 && (x === 11 || x === 12), "#c9c1ad");
    for (let y = 7; y <= 14; y += 2) { line(g, 4, y, 9, y, "#b5ab95"); line(g, 14, y, 19, y, "#b5ab95"); }
    set(g, 2, 6, GOLD); set(g, 21, 6, GOLD); set(g, 2, 17, GOLD); set(g, 21, 17, GOLD);
    outline(g); return g;
  },
  briefcase() {
    const g = grid(16);
    fill(g, (x, y) => x >= 2 && x <= 13 && y >= 5 && y <= 13, "#8b5a2b");
    fill(g, (x, y) => x >= 2 && x <= 13 && y === 8, "#6b4220");
    rows(g, 6, 2, ["####", "#..#", "#..#"], { "#": "#4a2f15" });
    set(g, 7, 8, GOLD); set(g, 8, 8, GOLD);
    outline(g); return g;
  },
  daq() {
    const g = grid(16);
    fill(g, (x, y) => x >= 1 && x <= 14 && y >= 4 && y <= 12, "#c8ccc8");
    fill(g, (x, y) => x >= 1 && x <= 14 && y >= 4 && y <= 5, "#e9ebe9");
    for (let x = 3; x <= 12; x += 3) { set(g, x, 10, "#2b2b2b"); set(g, x + 1, 10, "#2b2b2b"); }
    set(g, 3, 7, "#4cd964"); set(g, 5, 7, "#4cd964"); set(g, 7, 7, "#f5a623");
    line(g, 10, 7, 12, 7, "#55606a");
    outline(g); return g;
  },
  rack() {
    const g = grid(16);
    fill(g, (x, y) => x >= 3 && x <= 12 && y >= 1 && y <= 14, "#3a3f45");
    for (const y of [3, 7, 11]) { line(g, 4, y, 11, y, "#5d6670"); line(g, 4, y + 1, 11, y + 1, "#4a5158"); set(g, 10, y, "#4cd964"); }
    set(g, 10, 7, "#f5a623");
    outline(g); return g;
  },
  jetpack() {
    const g = grid(16);
    fill(g, (x, y) => (x >= 3 && x <= 6 || x >= 9 && x <= 12) && y >= 2 && y <= 10, "#d9542b");
    fill(g, (x, y) => (x === 3 || x === 9) && y >= 3 && y <= 9, "#f08458");
    fill(g, (x, y) => x >= 7 && x <= 8 && y >= 4 && y <= 8, "#7d8a91");
    rows(g, 3, 11, [".##..##.", ".#....#."], { "#": "#ffd23f" });
    rows(g, 4, 11, ["##..##", "##..##", ".#...#"], { "#": "#ff9a1f" });
    outline(g); return g;
  },
  ball() {
    const g = grid(16);
    fill(g, (x, y) => (x - 7.5) ** 2 + (y - 7.5) ** 2 <= 36, "#e07a2e");
    fill(g, (x, y) => (x - 7.5) ** 2 + (y - 7.5) ** 2 <= 36 && (x === 7 || y === 7), "#3b2312");
    fill(g, (x, y) => (x - 7.5) ** 2 + (y - 7.5) ** 2 <= 36 && Math.abs(Math.hypot(x - 0, y - 7.5) - 5.5) < 0.6, "#3b2312");
    fill(g, (x, y) => (x - 7.5) ** 2 + (y - 7.5) ** 2 <= 36 && Math.abs(Math.hypot(x - 15, y - 7.5) - 5.5) < 0.6, "#3b2312");
    outline(g); return g;
  },
  github() {
    const g = grid(12);
    rows(g, 1, 1, [
      ".#......#.",
      ".##....##.",
      ".########.",
      "##########",
      "##.####.##",
      "##.####.##",
      "##########",
      ".########.",
      "..#.##.#..",
      "...####...",
    ], { "#": "#f0f0f0" });
    return g;
  },
  linkedin() {
    const g = grid(12);
    rows(g, 1, 1, [
      "##........",
      "##........",
      "..........",
      "##.##.###.",
      "##.######.",
      "##.###.##.",
      "##.##..##.",
      "##.##..##.",
      "##.##..##.",
      "##.##..##.",
    ], { "#": "#f0f0f0" });
    return g;
  },
  sound() {
    const g = grid(12);
    rows(g, 1, 2, [
      "...#......",
      "..##...#..",
      "####.#..#.",
      "####..#.#.",
      "####..#.#.",
      "####.#..#.",
      "..##...#..",
      "...#......",
    ], { "#": "#f0f0f0" });
    return g;
  },
  muted() {
    const g = grid(12);
    rows(g, 1, 2, [
      "...#......",
      "..##......",
      "####.#..#.",
      "####..##..",
      "####..##..",
      "####.#..#.",
      "..##......",
      "...#......",
    ], { "#": "#f0f0f0" });
    return g;
  },
  gear() {
    const g = grid(12);
    rows(g, 1, 1, [
      "....##....",
      ".#.####.#.",
      "..######..",
      ".###..###.",
      "###....###",
      "###....###",
      ".###..###.",
      "..######..",
      ".#.####.#.",
      "....##....",
    ], { "#": "#f0f0f0" });
    return g;
  },
  banner(color) {
    const g = grid(16);
    line(g, 3, 1, 12, 1, WOOD);
    fill(g, (x, y) => x >= 4 && x <= 11 && y >= 2 && y <= 12, color);
    fill(g, (x, y) => x >= 6 && x <= 9 && y >= 5 && y <= 8, "rgba(255,255,255,0.55)");
    set(g, 4, 13, color); set(g, 6, 13, color); set(g, 9, 13, color); set(g, 11, 13, color);
    outline(g); return g;
  },
  /* ---------- desktop + theme icons (all original drawings) ---------- */
  qblock() {
    const g = grid(16);
    rows(g, 1, 1, [
      "hhhhhhhhhhhhhh",
      "hr..........rs",
      "h....qqqq....s",
      "h...qqddqq...s",
      "h...qqd.qqd..s",
      "h.......qqd..s",
      "h......qqdd..s",
      "h.....qqdd...s",
      "h.....qqd....s",
      "h......dd....s",
      "h.....qq.....s",
      "h.....qqd....s",
      "hr.....dd...rs",
      "ssssssssssssss",
    ], { h: "#ffd27a", ".": "#f0a52a", s: "#b8641a", r: "#6b3a10", q: "#fff3d6", d: "#6b3a10" });
    outline(g); return g;
  },
  grass() {
    const g = grid(16);
    rows(g, 1, 1, [
      "GGgGGgGGGgGGgG",
      "gggggGgggggGgg",
      "gdgggdggdgggdg",
      "dddgddddddgddd",
      "ddDdddsdddddDd",
      "dddddDddddsddd",
      "dsdddddddDdddd",
      "ddddDddsdddddd",
      "dDdddddddddsDd",
      "ddddsddDdddddd",
      "ddDdddddddsddd",
      "dddddsdDdddddd",
      "dsddddddddddDd",
      "DDDDDDDDDDDDDD",
    ], { G: "#7cc84f", g: "#5fa83a", d: "#8a5a33", D: "#6b4224", s: "#a8754a" });
    outline(g); return g;
  },
  tree() {
    const g = grid(16);
    fill(g, (x, y) => y >= 12 && y <= 14 && x >= 1 && x <= 14, "#8a5a33");
    fill(g, (x, y) => y === 12 && x >= 1 && x <= 14, "#4fae3c");
    set(g, 4, 14, "#6b4224"); set(g, 11, 13, "#6b4224");
    fill(g, (x, y) => x >= 7 && x <= 8 && y >= 7 && y <= 11, "#7a4f2a");
    set(g, 8, 9, "#5a3a1c");
    fill(g, (x, y) => (x - 7.5) ** 2 / 30 + (y - 4.5) ** 2 / 12 <= 1, "#3c8f35");
    fill(g, (x, y) => (x - 6) ** 2 / 9 + (y - 3.5) ** 2 / 4 <= 1, "#62bf4a");
    outline(g); return g;
  },
  ring() {
    const g = grid(16);
    const d = (x, y) => Math.hypot(x - 7.5, y - 7.5);
    fill(g, (x, y) => d(x, y) <= 6.6 && d(x, y) >= 3.6, "#f2c12e");
    fill(g, (x, y) => d(x, y) <= 6.6 && d(x, y) >= 3.6 && x + y >= 17, "#c48a12");
    fill(g, (x, y) => d(x, y) <= 6.6 && d(x, y) >= 5.2 && x + y <= 10, "#fff1a8");
    outline(g); return g;
  },
  crate() {
    const g = grid(16);
    fill(g, (x, y) => y <= 5 && (x - 7.5) ** 2 / 49 + (y - 5.5) ** 2 / 20 <= 1, "#e8edf2");
    fill(g, (x, y) => y <= 5 && (x - 7.5) ** 2 / 49 + (y - 5.5) ** 2 / 20 <= 1 && Math.floor((x + 1) / 3) % 2 === 0, "#e0533c");
    line(g, 2, 6, 5, 9, "#d8d0c0"); line(g, 13, 6, 10, 9, "#d8d0c0"); line(g, 7, 6, 7, 9, "#d8d0c0");
    fill(g, (x, y) => x >= 4 && x <= 11 && y >= 9 && y <= 14, "#b07a3a");
    line(g, 4, 11, 11, 11, "#7d5222"); line(g, 4, 13, 11, 13, "#7d5222");
    fill(g, (x, y) => (x === 4 || x === 11) && y >= 9 && y <= 14, "#2f6fd6");
    outline(g); return g;
  },
  notepad() {
    const g = grid(16);
    fill(g, (x, y) => x >= 3 && x <= 12 && y >= 2 && y <= 14, "#ffffff");
    fill(g, (x, y) => x >= 3 && x <= 12 && y >= 2 && y <= 3, "#2a5bd7");
    for (const y of [6, 8, 10, 12]) line(g, 5, y, 10, y, "#8aa2c8");
    set(g, 12, 14, "#c0c0c0"); set(g, 11, 14, "#c0c0c0"); set(g, 12, 13, "#c0c0c0");
    outline(g); return g;
  },
  computer() {
    const g = grid(16);
    fill(g, (x, y) => x >= 1 && x <= 14 && y >= 1 && y <= 10, "#d4d0c4");
    fill(g, (x, y) => x >= 3 && x <= 12 && y >= 3 && y <= 8, "#008080");
    set(g, 4, 4, "#7fd4d4"); set(g, 5, 4, "#7fd4d4");
    set(g, 12, 10, "#3fbf3f");
    fill(g, (x, y) => x >= 6 && x <= 9 && y === 11, "#a8a497");
    fill(g, (x, y) => x >= 3 && x <= 12 && y >= 12 && y <= 13, "#d4d0c4");
    outline(g); return g;
  },
  bin() {
    const g = grid(16);
    fill(g, (x, y) => y >= 4 && y <= 14 && x >= 3 + (y - 4) / 5 && x <= 12 - (y - 4) / 5, "#b9bdc1");
    fill(g, (x, y) => y >= 5 && y <= 13 && x >= 4 && x <= 11 && (x + y) % 3 === 0, "#7d8389");
    fill(g, (x, y) => y === 3 && x >= 2 && x <= 13, "#e2e5e8");
    outline(g); return g;
  },
  chest() {
    const g = grid(16);
    fill(g, (x, y) => x >= 1 && x <= 14 && y >= 4 && y <= 13, "#9a6230");
    fill(g, (x, y) => x >= 1 && x <= 14 && (y === 4 || y === 8 || y === 13), "#6b3f1a");
    fill(g, (x, y) => (x === 1 || x === 14) && y >= 4 && y <= 13, "#6b3f1a");
    fill(g, (x, y) => x >= 7 && x <= 8 && y >= 7 && y <= 10, "#e8b923");
    outline(g); return g;
  },
  envelope() {
    const g = grid(16);
    fill(g, (x, y) => x >= 1 && x <= 14 && y >= 3 && y <= 12, "#f0f0f0");
    line(g, 1, 3, 7, 8, "#8a96a3"); line(g, 14, 3, 8, 8, "#8a96a3");
    outline(g); return g;
  },
  door() {
    const g = grid(16);
    fill(g, (x, y) => x >= 4 && x <= 11 && y >= 1 && y <= 14, "#8a5a2b");
    fill(g, (x, y) => x >= 5 && x <= 10 && ((y >= 2 && y <= 6) || (y >= 9 && y <= 13)), "#6e4520");
    set(g, 10, 8, GOLD);
    outline(g); return g;
  },
  dice() {
    const g = grid(16);
    fill(g, (x, y) => x >= 2 && x <= 12 && y >= 3 && y <= 13, "#f4f1ea");
    fill(g, (x, y) => (x === 12 || y === 13) && x >= 2 && y >= 3, "#c9c2b2");
    for (const [x, y] of [[4, 5], [9, 5], [6, 8], [4, 11], [9, 11]]) { set(g, x, y, "#c62828"); set(g, x + 1, y, "#c62828"); }
    // sparkle
    line(g, 14, 0, 14, 4, "#ffd84a"); line(g, 12, 2, 15, 2, "#ffd84a"); set(g, 14, 2, "#fff6c8");
    outline(g); return g;
  },
  monogram() {
    const g = grid(12);
    rows(g, 0, 2, [
      "#####.####.",
      "..#...#....",
      "..#...###..",
      "..#...#....",
      "..#...#....",
    ], { "#": "#101010" });
    return g;
  },
};

const cache = new Map();
export function icon(name, label = "", arg) {
  const key = `${name}|${label}|${arg ?? ""}`;
  if (!cache.has(key)) cache.set(key, svg(draw[name](arg), label));
  return cache.get(key);
}

// Decorative "rune" strip: each letter maps to one of a few small glyphs.
const RUNES = ["#.#|###|#.#", "##.|.#.|.##", "#..|###|..#", ".#.|#.#|.#.", "###|..#|#..", "#.#|.#.|###", "..#|.##|##."];
export function runes(text) {
  let x = 0, rects = "";
  for (const ch of text.toLowerCase()) {
    if (ch === " ") { x += 3; continue; }
    const r = RUNES[(ch.charCodeAt(0) * 3 + 1) % RUNES.length].split("|");
    r.forEach((row, y) => [...row].forEach((c, k) => { if (c === "#") rects += `<rect x="${x + k}" y="${y}" width="1" height="1"/>`; }));
    x += 4;
  }
  return `<svg class="runes" viewBox="0 0 ${Math.max(1, x - 1)} 3" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${rects}</svg>`;
}
