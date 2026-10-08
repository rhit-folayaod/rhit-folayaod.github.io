import { icon, runes } from "./pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "./data.js";

const main = document.getElementById("main");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ext = 'target="_blank" rel="noopener"';

/* ---------- settings: sound + motion ---------- */
const prefs = {
  sound: localStorage.getItem("tf.sound") === "on",
  motion: localStorage.getItem("tf.motion") || (matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full"),
};
let audio;
function click() {
  if (!prefs.sound) return;
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  const t = audio.currentTime;
  const len = Math.floor(audio.sampleRate * 0.05);
  const buf = audio.createBuffer(1, len, audio.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  const src = audio.createBufferSource();
  src.buffer = buf;
  const f = audio.createBiquadFilter();
  f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 1.2;
  const g = audio.createGain();
  g.gain.setValueAtTime(0.5, t);
  src.connect(f).connect(g).connect(audio.destination);
  src.start(t);
}
function applyPrefs() {
  document.documentElement.dataset.motion = prefs.motion;
  const mute = document.getElementById("mute");
  mute.innerHTML = icon(prefs.sound ? "sound" : "muted");
  mute.setAttribute("aria-pressed", String(prefs.sound));
  mute.setAttribute("aria-label", prefs.sound ? "Click sounds on. Turn off" : "Click sounds off. Turn on");
  document.querySelector('[data-opt="sound"]').textContent = `Click sounds: ${prefs.sound ? "On" : "Off"}`;
  document.querySelector('[data-opt="motion"]').textContent = `Motion: ${prefs.motion === "full" ? "Full" : "Reduced"}`;
  localStorage.setItem("tf.sound", prefs.sound ? "on" : "off");
  localStorage.setItem("tf.motion", prefs.motion);
}
document.getElementById("settings").innerHTML = icon("gear");
document.getElementById("mute").addEventListener("click", () => { prefs.sound = !prefs.sound; applyPrefs(); click(); });
const dlg = document.getElementById("settings-dialog");
document.getElementById("settings").addEventListener("click", () => dlg.showModal());
dlg.addEventListener("click", (e) => {
  const opt = e.target.closest("[data-opt]")?.dataset.opt;
  if (opt === "sound") prefs.sound = !prefs.sound;
  if (opt === "motion") prefs.motion = prefs.motion === "full" ? "reduced" : "full";
  if (opt) applyPrefs();
  if (e.target === dlg) dlg.close();
});
document.addEventListener("click", (e) => { if (e.target.closest(".mc-btn, .proj, .cat, .ench")) click(); });

/* ---------- shared bits ---------- */
const chips = (tags) => `<ul class="chips" aria-label="Tags">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
const backBtn = (href = "#/", label = "Back") => `<a class="mc-btn back" href="${href}" data-back>${label}</a>`;
function screen(id, title, body, foot) {
  return `<section class="screen screen-${id}" aria-labelledby="h-${id}">
    <h1 class="screen-heading" id="h-${id}" tabindex="-1">${esc(title)}</h1>
    ${body}
    <div class="screen-foot">${foot ?? backBtn()}</div>
  </section>`;
}

/* ---------- title ---------- */
function titleScreen() {
  return `<section class="screen screen-title" aria-labelledby="h-title">
    <header class="logo">
      <h1 id="h-title" tabindex="-1"><img src="assets/img/wordmark.svg" width="948" height="178" alt="Timi Folayan Portfolio"></h1>
      <p class="splash" aria-hidden="true">SWE @ Rose-Hulman!</p>
    </header>
    <nav class="menu" aria-label="Main menu">
      <a class="mc-btn" href="#/experience">Experience</a>
      <a class="mc-btn" href="#/projects">Projects</a>
      <a class="mc-btn" href="#/about">About Me</a>
      <div class="menu-row">
        <a class="mc-btn mc-square" href="${links.github}" ${ext} aria-label="GitHub (opens in new tab)">${icon("github")}</a>
        <a class="mc-btn" href="${links.resume}" ${ext}>Resume</a>
        <a class="mc-btn" href="#/skills">Skills</a>
        <a class="mc-btn mc-square" href="${links.linkedin}" ${ext} aria-label="LinkedIn (opens in new tab)">${icon("linkedin")}</a>
      </div>
    </nav>
    <p class="legal">© 2026 Timi Folayan. Not an official Minecraft product.<br>Not approved by or associated with Mojang or Microsoft.</p>
  </section>`;
}

/* ---------- experience ---------- */
function experienceScreen() {
  const items = experience.map((e) => `
    <article class="xp">
      <p class="xp-when">${esc(e.when)}<span>${esc(e.where)}</span></p>
      <div class="xp-body">
        <h2>${esc(e.role)} <span class="xp-org">· ${esc(e.org)}</span></h2>
        <ul class="bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        ${chips(e.tags)}
      </div>
    </article>`).join("");
  return screen("experience", "Experience", `<div class="panel scroll" tabindex="0" aria-label="Experience list">${items}</div>`);
}

/* ---------- projects ---------- */
function bars(status) {
  const s = statusInfo[status];
  return `<span class="status tone-${s.tone}"><span class="bars" aria-hidden="true">${[1, 2, 3, 4].map((i) => `<i class="${i <= s.bars ? "on" : ""}" style="height:${i * 25}%"></i>`).join("")}</span>${s.label}</span>`;
}
function projectRow(p) {
  return `<li><button type="button" class="proj" data-id="${p.id}" aria-pressed="false">
    <span class="tile">${icon(p.icon)}</span>
    <span class="proj-main">
      <span class="proj-name">${esc(p.name)}${p.year ? ` <small>${p.year}</small>` : ""}</span>
      <span class="proj-blurb">${esc(p.blurb)}</span>
      <span class="chips" aria-hidden="true">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</span>
    </span>
    ${bars(p.status)}
  </button></li>`;
}
function projectsScreen() {
  const body = `
    <label class="search"><span class="sr-only">Search projects</span>
      <input type="search" id="proj-search" placeholder="Search projects..." autocomplete="off" spellcheck="false">
    </label>
    <div class="panel scroll">
      <ul class="proj-list" id="proj-list" aria-label="Projects">${projects.map(projectRow).join("")}</ul>
      <p class="empty" id="proj-empty" hidden></p>
    </div>
    <p class="count" id="proj-count" aria-live="polite"></p>`;
  const foot = `<div class="bar4">
      <button type="button" class="mc-btn" id="p-open" disabled>Open</button>
      <button type="button" class="mc-btn" id="p-gh" disabled>GitHub</button>
      <button type="button" class="mc-btn" id="p-cancel" disabled>Cancel</button>
      ${backBtn()}
    </div>`;
  return screen("projects", "Select Project", body, foot);
}
function wireProjects() {
  let selected = null;
  const list = document.getElementById("proj-list");
  const open = document.getElementById("p-open"), gh = document.getElementById("p-gh"), cancel = document.getElementById("p-cancel");
  const count = document.getElementById("proj-count"), empty = document.getElementById("proj-empty");
  const visible = () => [...list.querySelectorAll(".proj")].filter((b) => !b.closest("li").hidden);
  function sync() {
    const p = projects.find((x) => x.id === selected);
    list.querySelectorAll(".proj").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === selected)));
    open.disabled = !p;
    gh.disabled = !p?.repo;
    cancel.disabled = !p;
    open.textContent = p?.live ? "Open site" : "Open";
    gh.title = p && !p.repo ? "Source is private" : "";
    const n = visible().length;
    count.textContent = p ? `${p.name} selected` : `${n} project${n === 1 ? "" : "s"} · select a project for actions`;
  }
  function openSel() {
    const p = projects.find((x) => x.id === selected);
    if (!p) return;
    if (p.live) window.open(p.live, "_blank", "noopener");
    else location.hash = `#/projects/${p.id}`;
  }
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".proj");
    if (!b) return;
    selected = selected === b.dataset.id && e.detail < 2 ? selected : b.dataset.id;
    sync();
    if (e.detail === 2) openSel();
  });
  list.addEventListener("keydown", (e) => {
    const b = e.target.closest(".proj");
    if (!b) return;
    const v = visible();
    const i = v.indexOf(b);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      v[(i + (e.key === "ArrowDown" ? 1 : -1) + v.length) % v.length]?.focus();
    }
  });
  open.addEventListener("click", openSel);
  gh.addEventListener("click", () => {
    const p = projects.find((x) => x.id === selected);
    if (p?.repo) window.open(p.repo, "_blank", "noopener");
  });
  cancel.addEventListener("click", () => { selected = null; sync(); });
  document.getElementById("proj-search").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    projects.forEach((p) => {
      const hit = !q || [p.name, p.blurb, ...p.tags].join(" ").toLowerCase().includes(q);
      list.querySelector(`[data-id="${p.id}"]`).closest("li").hidden = !hit;
      if (!hit && selected === p.id) selected = null;
    });
    const n = visible().length;
    empty.hidden = n > 0;
    empty.textContent = n ? "" : `Nothing matches "${e.target.value.trim()}". Try a language like Python or a tool like Docker.`;
    sync();
  });
  sync();
}
function projectDetail(p) {
  const actions = [
    p.live ? `<a class="mc-btn" href="${p.live}" ${ext}>Open site</a>` : "",
    p.repo ? `<a class="mc-btn" href="${p.repo}" ${ext}>GitHub</a>` : "",
  ].join("");
  const body = `<div class="panel scroll detail">
      <div class="detail-head">
        <span class="tile">${icon(p.icon)}</span>
        <p>${p.year ? `${p.year} · ` : ""}${bars(p.status)}</p>
      </div>
      <p class="lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      ${chips(p.tags)}
      ${!p.repo ? `<p class="note">Source is private.</p>` : ""}
    </div>`;
  return screen(`detail`, p.name, body, `<div class="bar2">${actions}${backBtn("#/projects")}</div>`);
}

/* ---------- skills ---------- */
const usedIn = (skill) => [
  ...experience.filter((e) => e.tags.includes(skill)).map((e) => e.org),
  ...projects.filter((p) => p.tags.includes(skill)).map((p) => p.name),
];
function skillsScreen() {
  const cats = skills.map((c, i) => `
    <li><button type="button" class="cat" data-i="${i}" aria-pressed="${i === 0}">
      <span class="slot">${icon(c.tool)}</span>
      <span class="cat-text">${runes(c.name)}<span class="cat-name">${esc(c.name)}</span><small>${c.items.length} enchantments</small></span>
      <span class="lvl" aria-label="Level ${i + 1}">${i + 1}</span>
    </button></li>`).join("");
  const body = `<div class="table">
      <div class="enchant" aria-live="polite" id="enchant"></div>
      <ul class="cats" aria-label="Skill categories">${cats}</ul>
      <div class="books" id="books"></div>
    </div>`;
  return screen("skills", "Skills", body);
}
function wireSkills() {
  const enchant = document.getElementById("enchant"), books = document.getElementById("books");
  let cat = 0;
  const idle = () => `<h2>Enchant</h2>${icon("openBook")}<p>Pick a tool, then a book to see where I've used it.</p>`;
  function renderBooks() {
    const c = skills[cat];
    books.innerHTML = `<div class="books-head"><h2>${esc(c.name)}</h2><span>${c.items.length} applied</span></div>
      <ul class="book-grid">${c.items.map((s) => `<li><button type="button" class="ench" aria-pressed="false">${icon("book")}<span>${esc(s)}</span></button></li>`).join("")}</ul>`;
    document.querySelectorAll(".cat").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.i === cat)));
    enchant.innerHTML = idle();
  }
  document.querySelector(".cats").addEventListener("click", (e) => {
    const b = e.target.closest(".cat");
    if (!b) return;
    cat = +b.dataset.i;
    renderBooks();
    books.scrollIntoView({ block: "nearest", behavior: prefs.motion === "full" ? "smooth" : "auto" });
  });
  books.addEventListener("click", (e) => {
    const b = e.target.closest(".ench");
    if (!b) return;
    books.querySelectorAll(".ench").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.textContent.trim();
    const uses = usedIn(name);
    enchant.innerHTML = `<h2>${esc(name)}</h2>${runes(name)}
      ${uses.length ? `<p class="used-label">Used in</p><ul class="used">${uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>`
        : `<p>On my resume, not tied to a project on this site.</p>`}`;
    enchant.scrollIntoView({ block: "nearest", behavior: prefs.motion === "full" ? "smooth" : "auto" });
  });
  renderBooks();
}

/* ---------- about ---------- */
function aboutScreen() {
  const a = about;
  const body = `<div class="panel scroll about">
    <div class="about-left">
      <img class="photo" src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling">
      <p class="nameplate">${esc(a.name)}</p>
      <p class="fullname">${esc(a.fullName)}</p>
      <dl class="facts">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${chips(a.chips)}
      <div class="bar2 small">
        <a class="mc-btn" href="${links.resume}" ${ext}>Resume</a>
        <a class="mc-btn" href="mailto:${links.email}">Email</a>
      </div>
      <p class="email">${esc(links.email)}</p>
    </div>
    <div class="about-right">
      <div class="bio">${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <h2 class="sub">Looking for</h2>
      <p class="bio looking">${esc(a.lookingFor)}</p>
      <h2 class="sub">Leadership</h2>
      <ul class="slots">${a.leadership.map((l) => `<li><span class="slot">${icon("banner", "", l.color)}</span><span><small>${esc(l.label)}</small>${esc(l.title)}</span></li>`).join("")}</ul>
    </div>
  </div>`;
  return screen("about", "About Me", body);
}

/* ---------- router ---------- */
const routes = {
  "": [titleScreen],
  experience: [experienceScreen],
  projects: [projectsScreen, wireProjects],
  skills: [skillsScreen, wireSkills],
  about: [aboutScreen],
};
const legacy = { about: "about", experience: "experience", projects: "projects", skills: "skills", leadership: "about", contact: "about", education: "about" };
let first = true;
function render() {
  let h = location.hash.replace(/^#\/?/, "");
  if (legacy[h] && !location.hash.startsWith("#/")) { location.replace(`#/${legacy[h]}`); return; }
  const [page, sub] = h.split("/");
  let html, wire, name = page || "title";
  const p = page === "projects" && sub && projects.find((x) => x.id === sub);
  if (p) { html = projectDetail(p); name = "detail"; document.title = `${p.name} | Timi Folayan`; }
  else {
    const r = routes[page] || routes[""];
    if (!routes[page]) name = "title";
    [html, wire] = [r[0](), r[1]];
    const t = { experience: "Experience", projects: "Projects", skills: "Skills", about: "About" }[name];
    document.title = t ? `${t} | Timi Folayan` : "Timi Folayan | Software Engineering @ Rose-Hulman";
  }
  document.body.dataset.screen = name;
  main.innerHTML = html;
  wire?.();
  if (!first) main.querySelector("h1")?.focus({ preventScroll: true });
  first = false;
}
addEventListener("hashchange", render);
addEventListener("keydown", (e) => {
  if (e.key !== "Escape" || dlg.open) return;
  if (e.target.matches?.("input") && e.target.value) return;
  const back = main.querySelector("[data-back]");
  if (back) location.hash = back.getAttribute("href");
});
applyPrefs();
render();
