// "Super Plumber Bros.": a side-scrolling platformer homage. Sections are
// pipes, projects hide in ? blocks, and the HUD counts coins you knock loose.
// Nothing here is a ripped asset: blocks, pipes, coins, hills and clouds are CSS.
import { icon } from "../pixel.js";
import { experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, contactLinks, linkAttrs, usedIn, setSubPath, noSource, groupStart } from "../shared.js";

const R = (p = "") => `#/mario${p ? `/${p}` : ""}`;
const WORLDS = [
  { id: "experience", n: "1-1", label: "Experience", h: 96 },
  { id: "projects", n: "1-2", label: "Projects", h: 140 },
  { id: "skills", n: "1-3", label: "Skills", h: 72 },
  { id: "about", n: "1-4", label: "About", h: 118 },
];
const COINS = "tf.mario.coins", HIT = "tf.mario.hit";
const coins = () => +(sessionStorage.getItem(COINS) || 0);
const addCoin = (root) => {
  const n = coins() + 1;
  sessionStorage.setItem(COINS, String(n));
  const el = root.querySelector("#m-coins");
  if (el) el.textContent = String(n).padStart(2, "0");
};
const hitSet = () => new Set(JSON.parse(sessionStorage.getItem(HIT) || "[]"));

function hud(world) {
  return `<header class="m-hud">
    <div class="m-hud-cell"><span>PLAYER</span><b>TIMI</b></div>
    <div class="m-hud-cell"><span>COINS</span><b><i class="coin" aria-hidden="true"></i>&times;<span id="m-coins">${String(coins()).padStart(2, "0")}</span></b></div>
    <div class="m-hud-cell"><span>WORLD</span><b>${world}</b></div>
    <a class="m-exit" href="#/" aria-label="Exit to desktop" ${world === "1-0" ? "data-back" : ""}>EXIT</a>
  </header>`;
}
const scenery = `<div class="m-scenery" aria-hidden="true">
    <i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i>
    <i class="hill h1"></i><i class="hill h2"></i><i class="bush b1"></i>
  </div>`;
const ground = `<footer class="m-ground"><p>${DISCLAIMER}</p></footer>`;
function page(cls, world, body, back = R()) {
  return `<div class="m m-${cls}">${scenery}${hud(world)}
    <div class="m-stage">${back ? `<a class="m-back" href="${back}" data-back>&#9664; ${back === R() ? "MAP" : "BACK"}</a>` : ""}${body}</div>
    ${ground}</div>`;
}
const tags = (t) => `<ul class="m-tags" aria-label="Tags">${t.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

/* ---------- map ---------- */
function home() {
  const pipes = WORLDS.map((w) => `<li><a class="pipe" href="${R(w.id)}" style="--h:${w.h}px">
      <span class="qb" aria-hidden="true">?</span>
      <span class="pipe-sign"><small>WORLD ${w.n}</small>${w.label}</span>
      <span class="pipe-lip" aria-hidden="true"></span><span class="pipe-body" aria-hidden="true"></span></a></li>`).join("");
  const bricks = contactLinks.map((l) => `<a class="brick" href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a>`).join("");
  const body = `<div class="m-board">
      <p class="m-kicker">SUPER PLUMBER BROS.</p>
      <h1 tabindex="-1">TIMI FOLAYAN</h1>
      <p class="m-tagline">Software Engineering &middot; Rose-Hulman &middot; May 2027</p>
    </div>
    <div class="m-bricks" aria-label="Links">${bricks}</div>
    <p class="m-hint">Pick a pipe. Each world is one part of my portfolio.</p>
    <nav aria-label="Worlds"><ul class="m-pipes">${pipes}</ul></nav>`;
  return page("home", "1-0", body, "");
}

/* ---------- experience: one stage per job ---------- */
function experiencePage() {
  const cards = experience.map((e, i) => `<li class="m-stagecard">
      <span class="qb used" aria-hidden="true"></span>
      <article class="m-card">
        <p class="m-when">${esc(e.when)} &middot; ${esc(e.where)}</p>
        <h2>${esc(e.role)}</h2>
        <p class="m-org">${esc(e.org)}</p>
        <ul class="m-bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        ${tags(e.tags)}
      </article>
      ${i === experience.length - 1 ? "" : `<span class="m-gap" aria-hidden="true"></span>`}
    </li>`).join("");
  return page("experience", "1-1", `<h1 class="m-h" tabindex="-1"><small>WORLD 1-1</small>Experience</h1>
    <ol class="m-level">${cards}</ol>`);
}

/* ---------- projects: ? blocks; hit one to pop the project out ---------- */
function projectDetail(p) {
  const s = statusInfo[p.status];
  const acts = [
    p.live ? `<a class="m-pipebtn" href="${p.live}" ${ext}>Open site &#9654;</a>` : "",
    p.repo ? `<a class="m-pipebtn" href="${p.repo}" ${ext}>GitHub &#9654;</a>` : `<span class="m-note">${noSource(p)}</span>`,
  ].join("");
  return `<article class="m-card m-detail" aria-live="polite">
      <div class="m-detail-head"><span class="m-item">${icon(p.icon)}</span>
        <div><h2>${esc(p.name)}</h2><p class="m-when">${p.year ? `${p.year} &middot; ` : ""}${esc(s.label)}</p></div></div>
      <p class="m-lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      ${tags(p.tags)}
      <div class="m-actions">${acts}</div>
    </article>`;
}
function projectsPage(sel) {
  const hit = hitSet();
  const cur = projects.find((p) => p.id === sel) || projects[0];
  hit.add(cur.id);
  const blocks = projects.map((p) => `${groupStart(p, "m-grp")}<li><button type="button" class="m-block${hit.has(p.id) ? " is-hit" : ""}" data-id="${p.id}" aria-pressed="${p.id === cur.id}">
      <span class="m-pop" aria-hidden="true">${icon(p.icon)}</span>
      <span class="qb" aria-hidden="true">?</span>
      <span class="m-block-name">${esc(p.name)}</span></button></li>`).join("");
  return page("projects", "1-2", `<h1 class="m-h" tabindex="-1"><small>WORLD 1-2</small>Projects</h1>
    <p class="m-hint">Hit a block to see what's inside.</p>
    <ul class="m-blocks" aria-label="Projects">${blocks}</ul>
    <div id="m-detail">${projectDetail(cur)}</div>`);
}
function wireProjects(root) {
  const detail = root.querySelector("#m-detail");
  const hit = hitSet();
  root.querySelector(".m-blocks").addEventListener("click", (e) => {
    const b = e.target.closest(".m-block");
    if (!b) return;
    const p = projects.find((x) => x.id === b.dataset.id);
    if (!hit.has(p.id)) { hit.add(p.id); sessionStorage.setItem(HIT, JSON.stringify([...hit])); addCoin(root); }
    root.querySelectorAll(".m-block").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    b.classList.add("is-hit");
    b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    detail.innerHTML = projectDetail(p);
    setSubPath(R(`projects/${p.id}`));
    if (matchMedia("(max-width: 720px)").matches) detail.scrollIntoView({ block: "start" });
  });
}

/* ---------- skills: coin rows ---------- */
function skillsPage() {
  const rows = skills.map((c) => `<li class="m-row"><h2 class="brick brick-h">${esc(c.name)}</h2>
      <ul class="m-coins">${c.items.map((s) => `<li><button type="button" class="m-skill" aria-pressed="false"><i class="coin" aria-hidden="true"></i>${esc(s)}</button></li>`).join("")}</ul></li>`).join("");
  return page("skills", "1-3", `<h1 class="m-h" tabindex="-1"><small>WORLD 1-3</small>Skills</h1>
    <p class="m-msg" id="m-msg" aria-live="polite">Grab a coin to see where I've used it.</p>
    <ul class="m-rows">${rows}</ul>`);
}
function wireSkills(root) {
  const msg = root.querySelector("#m-msg");
  root.querySelector(".m-rows").addEventListener("click", (e) => {
    const b = e.target.closest(".m-skill");
    if (!b) return;
    root.querySelectorAll(".m-skill").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.textContent.trim();
    const uses = usedIn(name);
    msg.innerHTML = uses.length ? `<b>${esc(name)}</b>: ${uses.map(esc).join(", ")}` : `<b>${esc(name)}</b>: on my resume, not tied to a project on this site.`;
  });
}

/* ---------- about: the castle ---------- */
function aboutPage() {
  const a = about;
  return page("about", "1-4", `<h1 class="m-h" tabindex="-1"><small>WORLD 1-4</small>About</h1>
    <div class="m-castle">
      <div class="m-card m-id">
        <img class="m-photo" src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling">
        <p class="m-name">${esc(a.name)}</p>
        <p class="m-full">${esc(a.fullName)}</p>
        <dl class="m-facts">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="m-bricks small">${contactLinks.map((l) => `<a class="brick" href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a>`).join("")}</div>
      </div>
      <div class="m-card m-bio">
        ${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}
        <h2>Looking for</h2><p>${esc(a.lookingFor)}</p>
        <h2>Leadership</h2>
        <ul class="m-lead-list">${a.leadership.map((l) => `<li><span class="m-flag" style="--c:${l.color}" aria-hidden="true"></span><span><small>${esc(l.label)}</small>${esc(l.title)}</span></li>`).join("")}</ul>
      </div>
    </div>`);
}

const TITLES = { experience: "Experience", projects: "Projects", skills: "Skills", about: "About" };
function render([pg = "", sub]) {
  const views = { experience: [experiencePage], projects: [() => projectsPage(sub), wireProjects], skills: [skillsPage, wireSkills], about: [aboutPage] };
  const v = views[pg];
  if (!v) return { html: home(), title: "Super Plumber Bros. | Timi Folayan", screen: "home" };
  if (pg !== "projects" || !sub) { /* entering a world through its pipe pays a coin, once per session */
    const seen = JSON.parse(sessionStorage.getItem("tf.mario.worlds") || "[]");
    if (!seen.includes(pg)) { seen.push(pg); sessionStorage.setItem("tf.mario.worlds", JSON.stringify(seen)); sessionStorage.setItem(COINS, String(coins() + 1)); }
  }
  return { html: v[0](), wire: v[1], title: `${TITLES[pg]} | Super Plumber Bros. | Timi Folayan`, screen: pg };
}
export default { render };
