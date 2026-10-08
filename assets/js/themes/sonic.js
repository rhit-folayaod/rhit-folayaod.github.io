// "Blue Blur Zone": a fast 16-bit platformer homage. Zone select is the menu,
// every job gets an act title card, projects are item monitors, skills are rings.
import { icon } from "../pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, contactLinks, linkAttrs, usedIn, setSubPath } from "../shared.js";

const R = (p = "") => `#/sonic${p ? `/${p}` : ""}`;
const ZONES = [
  { id: "experience", name: "Work Zone", act: `ACT 1-${experience.length}`, label: "Experience" },
  { id: "projects", name: "Build Zone", act: `${projects.length} MONITORS`, label: "Projects" },
  { id: "skills", name: "Ring Zone", act: `${skills.length} ROWS`, label: "Skills" },
  { id: "about", name: "Goal Zone", act: "RESULTS", label: "About" },
];
const T0 = "tf.sonic.t0", RINGS = "tf.sonic.rings", GOT = "tf.sonic.got";
const rings = () => +(sessionStorage.getItem(RINGS) || 0);
function collect(key) {
  const got = new Set(JSON.parse(sessionStorage.getItem(GOT) || "[]"));
  if (got.has(key)) return false;
  got.add(key);
  sessionStorage.setItem(GOT, JSON.stringify([...got]));
  sessionStorage.setItem(RINGS, String(rings() + 1));
  return true;
}

function chrome(pg, body) {
  return `<div class="s s-${pg || "home"}">
    <div class="s-sky" aria-hidden="true"></div>
    <header class="s-hud">
      <dl>
        <div><dt>TIME</dt><dd id="s-time">0:00</dd></div>
        <div><dt>RINGS</dt><dd id="s-rings">${rings()}</dd></div>
      </dl>
      <nav class="s-nav" aria-label="Zones">${pg ? `<a href="${R()}" data-back>Zone select</a>` : ""}<a href="#/" ${pg ? "" : "data-back"}>Quit to desktop</a></nav>
    </header>
    <div class="s-stage">${body}</div>
    <footer class="s-ground"><p>${DISCLAIMER}</p></footer>
  </div>`;
}

/* ---------- zone select ---------- */
function home() {
  const rows = ZONES.map((z, i) => `<li><a class="s-zone-row" href="${R(z.id)}">
      <span class="s-zn">${esc(z.name)}</span><span class="s-zl">${z.label}</span><span class="s-za">${z.act}</span></a></li>`).join("");
  return chrome("", `<div class="s-titlebox">
      <p class="s-kicker">${esc(about.name)}</p>
      <h1 tabindex="-1">Blue Blur<br>Zone</h1>
      <p class="s-sub">Software Engineering &middot; Rose-Hulman &middot; May 2027</p>
    </div>
    <div class="s-select">
      <section class="s-panel" aria-labelledby="s-zs"><h2 id="s-zs" class="s-panel-h">Zone select</h2><ol class="s-zones">${rows}</ol></section>
      <div class="s-loop" aria-hidden="true"><i></i></div>
    </div>
    <ul class="s-links">${contactLinks.map((l) => `<li><a class="s-mon" href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a></li>`).join("")}</ul>`);
}

/* ---------- experience: act title cards ---------- */
function experiencePage() {
  const acts = experience.map((e, i) => `<li class="s-act">
      <div class="s-card">
        <span class="s-band" aria-hidden="true"></span>
        <div class="s-card-text"><p class="s-org">${esc(e.org)}</p><h2>${esc(e.role)}</h2></div>
        <span class="s-actno"><small>ACT</small>${i + 1}</span>
      </div>
      <div class="s-body">
        <p class="s-when">${esc(e.when)} &middot; ${esc(e.where)}</p>
        <ul class="s-bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        <ul class="s-tags">${e.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </div>
    </li>`).join("");
  return chrome("experience", `<h1 class="s-h" tabindex="-1"><small>Work Zone</small>Experience</h1><ol class="s-acts">${acts}</ol>`);
}

/* ---------- projects: item monitors ---------- */
function detail(p) {
  const s = statusInfo[p.status];
  return `<article class="s-panel s-detail" aria-live="polite">
      <div class="s-detail-head"><span class="s-screen">${icon(p.icon)}</span>
        <div><h2>${esc(p.name)}</h2><p class="s-when">${s.label}${p.year ? ` &middot; ${p.year}` : ""}</p></div></div>
      <p class="s-lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      <ul class="s-tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="s-actions">${p.live ? `<a class="s-go" href="${p.live}" ${ext}>Open site</a>` : ""}${p.repo ? `<a class="s-go" href="${p.repo}" ${ext}>GitHub</a>` : `<span class="s-note">Source is private.</span>`}</p>
    </article>`;
}
function projectsPage(sel) {
  const cur = projects.find((p) => p.id === sel) || projects[0];
  const mons = projects.map((p) => `<li><button type="button" class="s-monitor" data-id="${p.id}" aria-pressed="${p === cur}">
      <span class="s-tv"><span class="s-screen">${icon(p.icon)}</span></span><span class="s-mname">${esc(p.name)}</span></button></li>`).join("");
  return chrome("projects", `<h1 class="s-h" tabindex="-1"><small>Build Zone</small>Projects</h1>
    <div class="s-shop"><ul class="s-monitors" aria-label="Projects">${mons}</ul><div id="s-detail">${detail(cur)}</div></div>`);
}
function wireProjects(root) {
  const out = root.querySelector("#s-detail");
  root.querySelector(".s-monitors").addEventListener("click", (e) => {
    const b = e.target.closest(".s-monitor");
    if (!b) return;
    root.querySelectorAll(".s-monitor").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    out.innerHTML = detail(projects.find((p) => p.id === b.dataset.id));
    setSubPath(R(`projects/${b.dataset.id}`));
    if (matchMedia("(max-width: 720px)").matches) out.scrollIntoView({ block: "start" });
  });
}

/* ---------- skills: rings ---------- */
function skillsPage() {
  const rows = skills.map((c) => `<section class="s-panel s-ringrow"><h2 class="s-panel-h">${esc(c.name)}</h2>
      <ul class="s-rings">${c.items.map((s) => `<li><button type="button" class="s-ring" aria-pressed="false"><i aria-hidden="true"></i>${esc(s)}</button></li>`).join("")}</ul></section>`).join("");
  return chrome("skills", `<h1 class="s-h" tabindex="-1"><small>Ring Zone</small>Skills</h1>
    <p class="s-msg" id="s-msg" aria-live="polite">Grab a ring to see where I've used it.</p>
    <div class="s-ringrows">${rows}</div>`);
}
function wireSkills(root) {
  const msg = root.querySelector("#s-msg");
  root.querySelector(".s-ringrows").addEventListener("click", (e) => {
    const b = e.target.closest(".s-ring");
    if (!b) return;
    root.querySelectorAll(".s-ring").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.textContent.trim(), uses = usedIn(name);
    if (collect(`skill:${name}`)) root.querySelector("#s-rings").textContent = rings();
    msg.innerHTML = `<b>${esc(name)}</b> ${uses.length ? `Used in ${uses.map(esc).join(", ")}` : "On my resume, not tied to a project on this site."}`;
  });
}

/* ---------- about: results tally ---------- */
function aboutPage() {
  const a = about;
  return chrome("about", `<h1 class="s-h" tabindex="-1"><small>Goal Zone</small>About</h1>
    <div class="s-results">
      <section class="s-tally" aria-label="Results">
        <p class="s-got">Timi got through<br><b>Rose-Hulman</b></p>
        <img src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling">
        <dl>${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="s-actions"><a class="s-go" href="${links.resume}" ${ext}>Resume</a><a class="s-go" href="mailto:${links.email}">Email</a></p>
      </section>
      <div class="s-col">
        <section class="s-panel"><h2 class="s-panel-h">${esc(a.fullName)}</h2>${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</section>
        <section class="s-panel"><h2 class="s-panel-h">Looking for</h2><p>${esc(a.lookingFor)}</p></section>
        <section class="s-panel"><h2 class="s-panel-h">Leadership</h2>
          <ul class="s-lead">${a.leadership.map((l) => `<li><span class="s-dot" style="--c:${l.color}"></span><span><small>${esc(l.label)}</small>${esc(l.title)}</span></li>`).join("")}</ul></section>
      </div>
    </div>`);
}

const TITLES = { experience: "Experience", projects: "Projects", skills: "Skills", about: "About" };
function render([pg = "", sub]) {
  const views = { experience: [experiencePage], projects: [() => projectsPage(sub), wireProjects], skills: [skillsPage, wireSkills], about: [aboutPage] };
  const v = views[pg];
  if (!sessionStorage.getItem(T0)) sessionStorage.setItem(T0, String(Date.now()));
  if (v) collect(`zone:${pg}`);
  return {
    html: v ? v[0]() : home(),
    title: v ? `${TITLES[pg]} | Blue Blur Zone | Timi Folayan` : "Blue Blur Zone | Timi Folayan",
    screen: v ? pg : "home",
    wire(root, ctx) {
      v?.[1]?.(root);
      const el = root.querySelector("#s-time");
      const t0 = +sessionStorage.getItem(T0);
      const tick = () => {
        const s = Math.floor((Date.now() - t0) / 1000);
        el.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      };
      tick();
      const iv = setInterval(tick, 1000);
      ctx.cleanup(() => clearInterval(iv));
    },
  };
}
export default { render };
