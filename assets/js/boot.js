// Router. "#/" is the desktop; "#/<theme>/<section>[/<id>]" is a section in one
// game theme. Each theme's JS and CSS load the first time it is opened.
import { themeById, prefersReducedMotion } from "./shared.js";

const main = document.getElementById("main");
const modules = {
  desktop: () => import("./desktop.js"),
  minecraft: () => import("./themes/minecraft.js"),
  mario: () => import("./themes/mario.js"),
  terraria: () => import("./themes/terraria.js"),
  sonic: () => import("./themes/sonic.js"),
  fortnite: () => import("./themes/fortnite.js"),
};

/* ---------- per-theme stylesheets: loaded once, switched by media ---------- */
const sheets = new Map();
function loadSheet(id) {
  if (!sheets.has(id)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `assets/css/${id}.css`;
    l.media = "not all";
    const ready = new Promise((r) => { l.onload = r; l.onerror = r; });
    document.head.append(l);
    sheets.set(id, { link: l, ready });
  }
  return sheets.get(id).ready;
}
function activateSheet(id) {
  for (const [k, s] of sheets) s.link.media = k === id ? "all" : "not all";
}

/** Fetch a theme's code and CSS without showing it (used by the desktop's boot window). */
export function preload(id) {
  return Promise.all([modules[id]().then((m) => m.default), loadSheet(id)]);
}

/* ---------- routes ---------- */
const OLD_SECTIONS = ["experience", "projects", "skills", "about"];
const OLD_ANCHORS = { about: "about", experience: "experience", projects: "projects", skills: "skills", leadership: "about", contact: "about", education: "about" };

function parse() {
  const raw = location.hash;
  const h = raw.replace(/^#\/?/, "");
  // Links from before the desktop existed: "#projects", "#/projects/daq-mcp", ...
  if (OLD_ANCHORS[h] && !raw.startsWith("#/")) return { redirect: `#/minecraft/${OLD_ANCHORS[h]}` };
  const [first, ...rest] = h.split("/");
  if (OLD_SECTIONS.includes(first)) return { redirect: `#/minecraft/${h}` };
  if (themeById(first)) return { theme: first, path: rest.filter(Boolean) };
  return { theme: "desktop", path: [] };
}

let cleanups = [];
let first = true;
let seq = 0;
async function render() {
  const r = parse();
  if (r.redirect) { location.replace(r.redirect); return; }
  const n = ++seq;
  const [theme] = await preload(r.theme);
  if (n !== seq) return; // a newer navigation won
  cleanups.forEach((f) => f());
  cleanups = [];
  const ctx = { cleanup: (f) => cleanups.push(f), reducedMotion: prefersReducedMotion(), preload };
  const view = theme.render(r.path, ctx);
  activateSheet(r.theme);
  document.body.dataset.theme = r.theme;
  document.body.dataset.screen = view.screen;
  document.title = view.title;
  main.innerHTML = view.html;
  view.wire?.(main, ctx);
  if (!first) (main.querySelector("[data-focus]") || main.querySelector("h1"))?.focus({ preventScroll: true });
  first = false;
}

addEventListener("hashchange", render);
addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || e.defaultPrevented || document.querySelector("dialog[open]")) return;
  if (e.target.matches?.("input") && e.target.value) return;
  const back = main.querySelector("[data-back]");
  if (back) location.hash = back.getAttribute("href");
});
render();
