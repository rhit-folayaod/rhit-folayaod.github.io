// "Village Clash": a top-down village-builder homage. The Town Hall is About,
// the Barracks is Experience, the Builder's Workshop is Projects, and the
// Laboratory is Skills. Levels and resource bars are real counts from data.js
// (one Barracks level per job, and so on), never invented numbers.
import { icon } from "../pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, contactLinks, linkAttrs, usedIn, setSubPath, noSource, relatedProject, currentProjects, earlierProjects } from "../shared.js";

const R = (p = "") => `#/clash${p ? `/${p}` : ""}`;
const skillCount = skills.reduce((n, c) => n + c.items.length, 0);
const BUILDINGS = [
  { id: "about", name: "Town Hall", label: "About", lvl: about.leadership.length, why: "one level per club or role I hold", art: "hall" },
  { id: "experience", name: "Barracks", label: "Experience", lvl: experience.length, why: "one level per job", art: "barracks" },
  { id: "projects", name: "Builder's Workshop", label: "Projects", lvl: projects.length, why: "one level per project", art: "workshop" },
  { id: "skills", name: "Laboratory", label: "Skills", lvl: skills.length, why: "one level per skill category", art: "lab" },
];
const byId = (id) => BUILDINGS.find((b) => b.id === id);

/* ---------- original building art (SVG, drawn for this site) ---------- */
const ART = {
  hall: `<rect x="4" y="30" width="40" height="12" rx="2" fill="#8d8f93"/><rect x="8" y="16" width="32" height="20" fill="#d9c7a3"/>
    <path d="M8 22h32M8 28h32" stroke="#bda57a" stroke-width="1"/><path d="M4 18 24 5l20 13z" fill="#2f6fd6"/><path d="M4 18 24 5v13z" fill="#4d8ef0"/>
    <rect x="20" y="26" width="8" height="10" rx="4" fill="#5b3a1e"/><rect x="23.3" y="0" width="1.4" height="7" fill="#5b3a1e"/><path d="M24.7 0h7l-2 2 2 2h-7z" fill="#f2c230"/>
    <rect x="11" y="20" width="5" height="5" fill="#2b3f66"/><rect x="32" y="20" width="5" height="5" fill="#2b3f66"/>`,
  barracks: `<rect x="5" y="30" width="38" height="12" rx="2" fill="#7d6a55"/><rect x="9" y="18" width="30" height="18" fill="#c9a77a"/>
    <path d="M6 20 24 8l18 12z" fill="#c23b30"/><path d="M6 20 24 8v12z" fill="#e0574a"/><rect x="20" y="26" width="8" height="10" fill="#4a2e17"/>
    <path d="M12 34 18 22M36 34 30 22" stroke="#cfd6db" stroke-width="2"/><circle cx="24" cy="15" r="3" fill="#f2c230"/>`,
  workshop: `<rect x="4" y="30" width="40" height="12" rx="2" fill="#7a6a58"/><rect x="8" y="17" width="32" height="19" fill="#a8743f"/>
    <path d="M8 23h32M8 29h32" stroke="#875a2c" stroke-width="1"/><path d="M5 19h38l-5-9H10z" fill="#5d4a3a"/><path d="M10 10h28l2 4H8z" fill="#7a6350"/>
    <rect x="13" y="25" width="10" height="11" fill="#3b2a1a"/><rect x="28" y="22" width="8" height="6" fill="#ffd36a"/>
    <path d="M30 4 37 11" stroke="#6b4a2a" stroke-width="2.2"/><rect x="26.5" y="1.5" width="7" height="4" transform="rotate(45 30 3.5)" fill="#9aa4ab"/>`,
  lab: `<rect x="5" y="30" width="38" height="12" rx="2" fill="#7f8494"/><rect x="10" y="20" width="28" height="16" fill="#cfd3dc"/>
    <path d="M10 22a14 13 0 0 1 28 0z" fill="#7b4fd0"/><path d="M14 21a10 9 0 0 1 10-8v8z" fill="#9b74ea"/>
    <path d="M21 25h6v3l3 6h-12l3-6z" fill="#9ff0d0"/><rect x="21" y="24" width="6" height="2" fill="#5d6270"/>
    <circle cx="33" cy="9" r="2" fill="#c9b2ff"/><circle cx="36" cy="5" r="1.4" fill="#c9b2ff"/>`,
  tree: `<rect x="22" y="28" width="4" height="10" fill="#6b4626"/><circle cx="24" cy="22" r="11" fill="#2f8a3a"/><circle cx="20" cy="18" r="6" fill="#47a84f"/>`,
  rock: `<path d="M8 38 14 24l12-4 12 8 4 10z" fill="#8f9399"/><path d="M14 24l12-4 4 8-14 4z" fill="#b5b9be"/>`,
};
const art = (k, cls = "") => `<svg class="v-art ${cls}" viewBox="0 0 48 44" aria-hidden="true" focusable="false">${ART[k]}</svg>`;
const badge = (n, why) => `<span class="v-lvl" title="Level ${n}: ${esc(why)}"><small>Lv</small>${n}</span>`;

function hud(pg) {
  const bars = [
    { k: "gold", label: "Jobs", n: experience.length },
    { k: "elixir", label: "Projects", n: projects.length },
    { k: "gem", label: "Skills", n: skillCount },
  ].map((r) => `<li class="v-res v-${r.k}"><span class="v-res-ico" aria-hidden="true"></span><span class="v-res-bar"><b>${r.n}</b> ${r.label}</span></li>`).join("");
  return `<header class="v-hud">
      <a class="v-player" href="${R()}"><span class="v-xp" aria-hidden="true">SWE</span><span><b>${esc(about.name)}</b><small>Rose-Hulman &middot; May 2027</small></span></a>
      <ul class="v-resources" aria-label="Village totals">${bars}</ul>
      <a class="v-exit" href="#/" ${pg ? "" : "data-back"}>Exit to desktop</a>
    </header>`;
}
function chrome(pg, body) {
  return `<div class="v v-pg-${pg || "village"}">
    <div class="v-grass" aria-hidden="true"></div>
    ${hud(pg)}
    <div class="v-stage">${body}</div>
    <footer class="v-foot"><p>${DISCLAIMER}</p></footer>
  </div>`;
}
// Section screens: a wooden panel over the village with a close X back to it.
function panel(id, body, sub = "") {
  const b = byId(id);
  return chrome(id, `<section class="v-panel" aria-labelledby="v-h">
      <header class="v-panel-head">
        <span class="v-panel-art">${art(b.art)}</span>
        <h1 id="v-h" tabindex="-1">${b.name}<small>${b.label}${sub}</small></h1>
        ${badge(b.lvl, b.why)}
        <a class="v-close" href="${R()}" data-back aria-label="Back to the village">&#10005;</a>
      </header>
      <div class="v-panel-body">${body}</div>
    </section>`);
}
const tags = (t) => `<ul class="v-tags">${t.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

/* ---------- village ---------- */
function village() {
  const spots = BUILDINGS.map((b) => `<li class="v-spot v-at-${b.art}"><a class="v-bld" href="${R(b.id)}">
      ${art(b.art)}${badge(b.lvl, b.why)}<span class="v-name"><b>${b.name}</b><small>${b.label}</small></span></a></li>`).join("");
  const deco = ["tree", "tree", "rock", "tree", "rock", "tree"].map((k, i) => `<span class="v-deco d${i}">${art(k)}</span>`).join("");
  return chrome("", `<h1 class="v-title" tabindex="-1">${esc(about.name)}'s Village<small>Tap a building. The Town Hall is About.</small></h1>
    <div class="v-map">
      <div class="v-walls" aria-hidden="true"></div><div class="v-path" aria-hidden="true"></div>${deco}
      <ul class="v-spots" aria-label="Buildings">${spots}</ul>
    </div>
    <ul class="v-links">${contactLinks.map((l) => `<li><a class="v-btn" href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a></li>`).join("")}</ul>`);
}

/* ---------- barracks: training queue ---------- */
function xpCard(e) {
  return `<article class="v-card v-xpd" aria-live="polite">
      <p class="v-when">${esc(e.when)} &middot; ${esc(e.where)}</p>
      <h2>${esc(e.role)}</h2><p class="v-org">${esc(e.org)}</p>
      <ul class="v-bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      ${tags(e.tags)}
    </article>`;
}
function barracks() {
  const q = experience.map((e, i) => `<li><button type="button" class="v-slot" data-i="${i}" aria-pressed="${i === 0}">
      <span class="v-timer">${esc(e.when)}</span><b>${esc(e.role)}</b><small>${esc(e.org)}</small></button></li>`).join("");
  return panel("experience", `<p class="v-hint">Training queue, newest first. Pick one for the details.</p>
    <ol class="v-queue">${q}</ol><div id="v-xpd">${xpCard(experience[0])}</div>`);
}
function wireBarracks(root) {
  const out = root.querySelector("#v-xpd");
  root.querySelector(".v-queue").addEventListener("click", (e) => {
    const b = e.target.closest(".v-slot");
    if (!b) return;
    root.querySelectorAll(".v-slot").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    out.innerHTML = xpCard(experience[+b.dataset.i]);
  });
}

/* ---------- workshop: builds ---------- */
const STATE = { deployed: "Live", released: "Released", private: "Private", earlier: "Earlier" };
function buildCard(p) {
  const rel = relatedProject(p);
  return `<article class="v-card v-pd" aria-live="polite">
      <div class="v-pd-head"><span class="v-plot">${icon(p.icon)}</span><div><h2>${esc(p.name)}</h2>
        <p class="v-when">${esc(statusInfo[p.status].label)}${p.year ? ` &middot; ${esc(p.year)}` : ""}</p></div></div>
      <p class="v-lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      ${tags(p.tags)}
      <p class="v-actions">${p.live ? `<a class="v-btn go" href="${p.live}" ${ext}>Open site</a>` : ""}${p.repo ? `<a class="v-btn" href="${p.repo}" ${ext}>GitHub</a>` : `<span class="v-note">${noSource(p)}</span>`}${rel ? `<a class="v-btn" href="${R(`projects/${rel.id}`)}" data-id="${rel.id}">See ${esc(rel.name)}</a>` : ""}</p>
    </article>`;
}
function workshop(sel) {
  const cur = projects.find((p) => p.id === sel) || projects[0];
  const tile = (p) => `<li><button type="button" class="v-build" data-id="${p.id}" aria-pressed="${p === cur}">
      <span class="v-plot">${icon(p.icon)}</span><span class="v-bname">${esc(p.name)}</span><span class="v-state s-${p.status}">${STATE[p.status]}</span></button></li>`;
  return panel("projects", `<div class="v-shop">
      <div>
        <h2 class="v-h2">Current builds</h2><ul class="v-builds">${currentProjects.map(tile).join("")}</ul>
        <h2 class="v-h2">Course &amp; earlier projects</h2><ul class="v-builds old">${earlierProjects.map(tile).join("")}</ul>
      </div>
      <div id="v-pd">${buildCard(cur)}</div>
    </div>`);
}
function wireWorkshop(root) {
  const out = root.querySelector("#v-pd");
  const pick = (id) => {
    root.querySelectorAll(".v-build").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.id === id)));
    out.innerHTML = buildCard(projects.find((p) => p.id === id));
    setSubPath(R(`projects/${id}`));
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "start" });
  };
  root.querySelector(".v-shop").addEventListener("click", (e) => {
    const b = e.target.closest(".v-build, a[data-id]");
    if (!b) return;
    e.preventDefault();
    pick(b.dataset.id);
  });
}

/* ---------- laboratory: research ---------- */
function lab() {
  const rows = skills.map((c) => `<section class="v-lab-row"><h2 class="v-h2">${esc(c.name)}</h2>
      <ul class="v-research">${c.items.map((s) => {
        const n = usedIn(s).length;
        return `<li><button type="button" class="v-tech" aria-pressed="false"><span class="v-tname">${esc(s)}</span><span class="v-pips" aria-hidden="true">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= n ? "on" : ""}"></i>`).join("")}</span></button></li>`;
      }).join("")}</ul></section>`).join("");
  return panel("skills", `<p class="v-hint">Each research is a skill. Its pips count where it shows up on this site.</p>
    <div class="v-labwrap"><div>${rows}</div><aside class="v-card v-tech-out" id="v-tech" aria-live="polite"><h2>Pick a research</h2><p>See where I've used it.</p></aside></div>`);
}
function wireLab(root) {
  const out = root.querySelector("#v-tech");
  root.querySelector(".v-labwrap").addEventListener("click", (e) => {
    const b = e.target.closest(".v-tech");
    if (!b) return;
    root.querySelectorAll(".v-tech").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.querySelector(".v-tname").textContent, uses = usedIn(name);
    out.innerHTML = `<h2>${esc(name)}</h2>${uses.length ? `<p>Used in</p><ul class="v-used">${uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : "<p>On my resume, not tied to a project on this site.</p>"}`;
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "nearest" });
  });
}

/* ---------- town hall ---------- */
function townHall() {
  const a = about;
  return panel("about", `<div class="v-hall">
      <section class="v-card v-profile">
        <img src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling">
        <h2>${esc(a.name)}</h2><p class="v-org">${esc(a.fullName)}</p>
        <dl class="v-stats">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="v-actions"><a class="v-btn go" href="${links.resume}" ${ext}>Resume</a><a class="v-btn" href="mailto:${links.email}">Email</a></p>
      </section>
      <div class="v-col">
        <section class="v-card">${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</section>
        <section class="v-card"><h2 class="v-h2">Looking for</h2><p>${esc(a.lookingFor)}</p></section>
        <section class="v-card"><h2 class="v-h2">Clans</h2>
          <ul class="v-clans">${a.leadership.map((l) => `<li><span class="v-shield" style="--c:${l.color}" aria-hidden="true"></span><span><small>${esc(l.label)}</small>${esc(l.title)}</span></li>`).join("")}</ul></section>
      </div>
    </div>`);
}

function render([pg = "", sub]) {
  const views = { experience: [barracks, wireBarracks], projects: [() => workshop(sub), wireWorkshop], skills: [lab, wireLab], about: [townHall] };
  const v = views[pg];
  return {
    html: v ? v[0]() : village(),
    wire: v?.[1],
    title: v ? `${byId(pg).name} | Village Clash | Timi Folayan` : "Village Clash | Timi Folayan",
    screen: v ? pg : "village",
  };
}
export default { render };
