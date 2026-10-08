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
  roblox: () => import("./themes/roblox.js"),
  clash: () => import("./themes/clash.js"),
  fighter: () => import("./themes/fighter.js"),
};

/* ---------- per-theme stylesheets: loaded once, switched by media ---------- */
// WebKit (iOS Safari) often never fires load/error for <link media="not all">,
// so awaiting onload alone hung forever and left #main blank. Race a timeout
// and never let CSS block the first paint.
const SHEET_WAIT_MS = 1500;
const sheets = new Map();
function loadSheet(id) {
  if (!sheets.has(id)) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = `assets/css/${id}.css`;
    l.media = "not all";
    const ready = Promise.race([
      new Promise((r) => {
        l.onload = () => r();
        l.onerror = () => r();
      }),
      new Promise((r) => setTimeout(r, SHEET_WAIT_MS)),
    ]);
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

/* ---------- plain fallback when render throws ---------- */
function fallbackHtml(err) {
  const msg = err && err.message ? String(err.message) : "unknown error";
  return `<section class="boot-fallback" style="max-width:640px;margin:40px auto;padding:0 16px;font:16px/1.5 system-ui,sans-serif;color:#111;background:#fff">
  <h1>Timi Folayan</h1>
  <p>Software Engineering @ Rose-Hulman, May 2027. The interactive portfolio failed to load on this browser.</p>
  <p><a href="Resume.pdf">Resume (PDF)</a> · <a href="https://github.com/rhit-folayaod">GitHub</a> · <a href="https://www.linkedin.com/in/timifolayan">LinkedIn</a> · <a href="mailto:folayaod@rose-hulman.edu">folayaod@rose-hulman.edu</a></p>
  <p style="color:#666;font-size:13px">(${msg.replace(/[<>&]/g, "")})</p>
</section>`;
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
  try {
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
  } catch (err) {
    console.error("[boot] render failed", err);
    try {
      document.body.dataset.theme = "fallback";
      document.body.style.background = "#fff";
      main.innerHTML = fallbackHtml(err);
    } catch (_) {
      /* last resort: leave whatever is on screen */
    }
  }
}

addEventListener("hashchange", render);
addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || e.defaultPrevented || document.querySelector("dialog[open]")) return;
  if (e.target.matches?.("input") && e.target.value) return;
  const back = main.querySelector("[data-back]");
  if (back) location.hash = back.getAttribute("href");
});
render();
