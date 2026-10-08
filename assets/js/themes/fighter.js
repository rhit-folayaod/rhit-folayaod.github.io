// "Arcade Clash": a 90s arcade fighting-game homage with no fighters drawn.
// Projects are the character-select grid (picking one plays a VS splash),
// experience is the arcade ladder, skills are a move list with stat bars, and
// About is the player profile card. Stat bars count real uses in data.js.
import { icon } from "../pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, contactLinks, linkAttrs, usedIn, setSubPath, noSource, relatedProject, groupStart } from "../shared.js";

const R = (p = "") => `#/fighter${p ? `/${p}` : ""}`;
const MENU = [
  { id: "experience", label: "Arcade Mode", sub: "Experience ladder" },
  { id: "projects", label: "Character Select", sub: "Projects" },
  { id: "skills", label: "Move List", sub: "Skills" },
  { id: "about", label: "Player Profile", sub: "About" },
];
const NAMES = { experience: "Arcade Mode", projects: "Character Select", skills: "Move List", about: "Player Profile" };
// Tile colors cycle so neighbors never match.
const HUES = ["#d7263d", "#1b6ef5", "#f2a007", "#1aa34a", "#8e3ad6", "#00a6a6", "#e3542c", "#4057d6", "#c2185b", "#6d8a12"];
const hue = (p) => HUES[projects.indexOf(p) % HUES.length];

function chrome(pg, body) {
  return `<div class="x x-pg-${pg || "title"}">
    <div class="x-bg" aria-hidden="true"></div>
    <header class="x-hud">
      <div class="x-hp p1"><span class="x-tag">1P</span><b>${esc(about.name.split(" ")[0].toUpperCase())}</b><i aria-hidden="true"></i></div>
      <span class="x-clock" aria-hidden="true">&infin;</span>
      <div class="x-hp p2"><i aria-hidden="true"></i><b>${pg ? NAMES[pg].toUpperCase() : "INSERT COIN"}</b><span class="x-tag">2P</span></div>
    </header>
    <nav class="x-nav" aria-label="Arcade Clash">${pg ? `<a class="x-navbtn" href="${R()}" data-back>&#9664; Title</a>` : ""}<a class="x-navbtn" href="#/" ${pg ? "" : "data-back"}>Exit to desktop</a></nav>
    <div class="x-stage">${body}</div>
    <footer class="x-foot"><p>${DISCLAIMER}</p></footer>
  </div>`;
}
const tags = (t) => `<ul class="x-tags">${t.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
const heading = (pg, small) => `<h1 class="x-h" tabindex="-1"><small>${small}</small>${NAMES[pg]}</h1>`;

/* ---------- title screen ---------- */
function title() {
  const items = MENU.map((m) => `<li><a class="x-menu-item" href="${R(m.id)}"><span>${m.label}</span><small>${m.sub}</small></a></li>`).join("");
  return chrome("", `<div class="x-title">
      <p class="x-kicker">${esc(about.name)} presents</p>
      <h1 class="x-logo" tabindex="-1"><span>Arcade</span><span>Clash</span></h1>
      <p class="x-sub">Software Engineering &middot; Rose-Hulman &middot; May 2027</p>
      <nav aria-label="Main menu"><ul class="x-menu">${items}</ul></nav>
      <p class="x-press" aria-hidden="true">Press start</p>
      <ul class="x-links">${contactLinks.map((l) => `<li><a href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a></li>`).join("")}</ul>
    </div>`);
}
function wireTitle(root) {
  const items = [...root.querySelectorAll(".x-menu-item")];
  root.querySelector(".x-menu").addEventListener("keydown", (e) => {
    const i = items.indexOf(document.activeElement);
    if (i < 0 || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
  });
}

/* ---------- arcade ladder: newest stage on top ---------- */
function stageDetail(e, n) {
  return `<article class="x-panel x-sd" aria-live="polite">
      <p class="x-label">Stage ${n} &middot; ${esc(e.when)}</p>
      <h2>${esc(e.role)}</h2><p class="x-org">${esc(e.org)} &middot; ${esc(e.where)}</p>
      <ul class="x-bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      ${tags(e.tags)}
    </article>`;
}
function ladder() {
  const n = experience.length;
  const rungs = experience.map((e, i) => `<li><button type="button" class="x-rung" data-i="${i}" aria-pressed="${i === 0}">
      <span class="x-stno">Stage ${n - i}</span><span class="x-rung-org">${esc(e.org)}</span><span class="x-rung-role">${esc(e.role)}</span><span class="x-rung-when">${esc(e.when)}</span></button></li>`).join("");
  return chrome("experience", `${heading("experience", "Experience")}
    <p class="x-hint">Climb from Stage 1 at the bottom. Pick a stage for the fight card.</p>
    <div class="x-ladderwrap"><ol class="x-ladder" aria-label="Stages, newest first">${rungs}</ol><div id="x-sd">${stageDetail(experience[0], n)}</div></div>`);
}
function wireLadder(root) {
  const out = root.querySelector("#x-sd"), n = experience.length;
  root.querySelector(".x-ladder").addEventListener("click", (e) => {
    const b = e.target.closest(".x-rung");
    if (!b) return;
    root.querySelectorAll(".x-rung").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    out.innerHTML = stageDetail(experience[+b.dataset.i], n - +b.dataset.i);
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "nearest" });
  });
}

/* ---------- character select ---------- */
function bio(p) {
  const rel = relatedProject(p);
  return `<article class="x-panel x-bio" aria-live="polite" style="--h:${hue(p)}">
      <div class="x-bio-head"><span class="x-port big">${icon(p.icon)}</span><div>
        <p class="x-label">${esc(statusInfo[p.status].label)}${p.year ? ` &middot; ${esc(p.year)}` : ""}</p><h2>${esc(p.name)}</h2></div></div>
      <p class="x-lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      <p class="x-label">Fighting style</p>${tags(p.tags)}
      <p class="x-actions">${p.live ? `<a class="x-btn" href="${p.live}" ${ext}>Open site</a>` : ""}${p.repo ? `<a class="x-btn" href="${p.repo}" ${ext}>GitHub</a>` : `<span class="x-note">${noSource(p)}</span>`}${rel ? `<a class="x-btn alt" href="${R(`projects/${rel.id}`)}" data-id="${rel.id}">Rival: ${esc(rel.name)}</a>` : ""}</p>
    </article>`;
}
function select(sel) {
  const cur = projects.find((p) => p.id === sel) || projects[0];
  const tiles = projects.map((p) => `${groupStart(p, "x-grp")}<li><button type="button" class="x-tile" data-id="${p.id}" aria-pressed="${p === cur}" style="--h:${hue(p)}">
      <span class="x-port">${icon(p.icon)}</span><span class="x-tname">${esc(p.name)}</span></button></li>`).join("");
  return chrome("projects", `${heading("projects", "Projects")}
    <p class="x-hint">Arrow keys move the cursor. Pick a project to fight it.</p>
    <div class="x-select"><ul class="x-grid" aria-label="Projects">${tiles}</ul><div id="x-bio">${bio(cur)}</div></div>
    <div class="x-vs" id="x-vs" hidden aria-hidden="true"><div class="x-vs-l">${esc(about.name.split(" ")[0])}</div><b>VS</b><div class="x-vs-r"></div></div>`);
}
function wireSelect(root, ctx) {
  const out = root.querySelector("#x-bio"), vs = root.querySelector("#x-vs");
  const tiles = [...root.querySelectorAll(".x-tile")];
  let timer = 0;
  const hideVs = () => { clearTimeout(timer); vs.hidden = true; vs.classList.remove("go"); };
  ctx.cleanup(hideVs);
  const pick = (id, splash) => {
    const p = projects.find((x) => x.id === id);
    tiles.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.id === id)));
    out.innerHTML = bio(p);
    setSubPath(R(`projects/${id}`));
    if (splash && !ctx.reducedMotion) {
      vs.querySelector(".x-vs-r").textContent = p.name;
      vs.style.setProperty("--h", hue(p));
      vs.hidden = false;
      void vs.offsetWidth;
      vs.classList.add("go");
      clearTimeout(timer);
      timer = setTimeout(hideVs, 1100);
    }
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "start" });
  };
  vs.addEventListener("click", hideVs);
  root.querySelector(".x-grid").addEventListener("click", (e) => {
    const b = e.target.closest(".x-tile");
    if (b) pick(b.dataset.id, true);
  });
  out.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-id]");
    if (!a) return;
    e.preventDefault();
    pick(a.dataset.id, true);
    tiles.find((t) => t.dataset.id === a.dataset.id)?.focus({ preventScroll: true });
  });
  root.querySelector(".x-grid").addEventListener("keydown", (e) => {
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const d = dirs[e.key], b = e.target.closest(".x-tile");
    if (!d || !b) return;
    e.preventDefault();
    const r = b.getBoundingClientRect();
    let best = null, score = Infinity;
    for (const o of tiles) {
      if (o === b) continue;
      const q = o.getBoundingClientRect(), dx = q.left - r.left, dy = q.top - r.top;
      const along = dx * d[0] + dy * d[1];
      if (along <= 2) continue;
      const s = along + Math.abs(d[0] ? dy : dx) * 3;
      if (s < score) { score = s; best = o; }
    }
    best?.focus();
  });
  const onKey = (e) => { if (e.key === "Escape" && !vs.hidden) { e.preventDefault(); hideVs(); } };
  document.addEventListener("keydown", onKey, true);
  ctx.cleanup(() => document.removeEventListener("keydown", onKey, true));
}

/* ---------- move list ---------- */
// Decorative stick inputs, picked from the skill name so they never change.
const MOVES = ["&darr; &searr; &rarr; + P", "&rarr; &darr; &searr; + P", "&darr; &swarr; &larr; + K", "&larr; [hold] &rarr; + P", "&darr; &darr; + K", "&rarr; &rarr; + P", "P P P", "&darr; &uarr; + K"];
const moveFor = (s) => MOVES[[...s].reduce((n, c) => n + c.charCodeAt(0), 0) % MOVES.length];
const maxUses = Math.max(1, ...skills.flatMap((c) => c.items.map((s) => usedIn(s).length)));
function moveList() {
  const sets = skills.map((c) => `<section class="x-panel x-moves"><h2 class="x-cat">${esc(c.name)}<small>${c.items.length} moves</small></h2>
      <ul>${c.items.map((s) => {
        const n = usedIn(s).length;
        return `<li><button type="button" class="x-move" aria-pressed="false" data-skill="${esc(s)}">
          <span class="x-mname">${esc(s)}</span><span class="x-input" aria-hidden="true">${moveFor(s)}</span>
          <span class="x-bar" aria-hidden="true"><i style="width:${Math.round((n / maxUses) * 100)}%"></i></span><span class="x-uses">${n ? `used in ${n}` : "on resume"}</span></button></li>`;
      }).join("")}</ul></section>`).join("");
  return chrome("skills", `${heading("skills", "Skills")}
    <p class="x-hint">The bar counts how many jobs and projects on this site use that skill. The stick inputs are just for fun.</p>
    <div class="x-movewrap"><div class="x-movesets">${sets}</div><aside class="x-panel x-moveout" id="x-moveout" aria-live="polite"><p class="x-label">Training</p><h2>Pick a move</h2><p>See where it lands.</p></aside></div>`);
}
function wireMoves(root) {
  const out = root.querySelector("#x-moveout");
  root.querySelector(".x-movesets").addEventListener("click", (e) => {
    const b = e.target.closest(".x-move");
    if (!b) return;
    root.querySelectorAll(".x-move").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.dataset.skill, uses = usedIn(name);
    out.innerHTML = `<p class="x-label">Training</p><h2>${esc(name)}</h2>${uses.length ? `<p>Lands in</p><ul class="x-used">${uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : "<p>On my resume, not tied to a project on this site.</p>"}`;
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "nearest" });
  });
}

/* ---------- player profile ---------- */
function profile() {
  const a = about;
  return chrome("about", `${heading("about", "About")}
    <div class="x-profile">
      <section class="x-card">
        <div class="x-frame"><img src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling"><span class="x-tag">1P</span></div>
        <h2 class="x-pname">${esc(a.name)}</h2><p class="x-org">${esc(a.fullName)}</p>
        <dl class="x-stats">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="x-actions"><a class="x-btn" href="${links.resume}" ${ext}>Resume</a><a class="x-btn alt" href="mailto:${links.email}">Email</a></p>
      </section>
      <div class="x-col">
        <section class="x-panel"><p class="x-label">Story</p>${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</section>
        <section class="x-panel"><p class="x-label">Looking for</p><p>${esc(a.lookingFor)}</p></section>
        <section class="x-panel"><p class="x-label">Team</p>
          <ul class="x-team">${a.leadership.map((l) => `<li style="--c:${l.color}"><small>${esc(l.label)}</small>${esc(l.title)}</li>`).join("")}</ul></section>
      </div>
    </div>`);
}

function render([pg = "", sub]) {
  const views = { experience: [ladder, wireLadder], projects: [() => select(sub), wireSelect], skills: [moveList, wireMoves], about: [profile] };
  const v = views[pg];
  return {
    html: v ? v[0]() : title(),
    wire: v ? v[1] : wireTitle,
    title: v ? `${NAMES[pg]} | Arcade Clash | Timi Folayan` : "Arcade Clash | Timi Folayan",
    screen: v ? pg : "title",
  };
}
export default { render };
