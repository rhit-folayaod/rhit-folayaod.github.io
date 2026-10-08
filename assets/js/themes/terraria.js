// "Dig & Build": a 2D sandbox homage. Sections are depths of the world, the
// hotbar is the menu (keys 1-0 work), projects sit in a crafting window and
// every job talks to you in an NPC dialog box.
import { icon } from "../pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, usedIn, setSubPath } from "../shared.js";

const R = (p = "") => `#/terraria${p ? `/${p}` : ""}`;
const LAYERS = {
  "": { name: "Surface", cls: "surface" },
  about: { name: "Surface", cls: "surface" },
  experience: { name: "Dirt Layer", cls: "dirt" },
  projects: { name: "Underground", cls: "stone" },
  skills: { name: "Caverns", cls: "cavern" },
};
const HOTBAR = [
  { key: "1", label: "Experience", icon: "pickaxe", href: R("experience"), page: "experience" },
  { key: "2", label: "Projects", icon: "chest", href: R("projects"), page: "projects" },
  { key: "3", label: "Skills", icon: "book", href: R("skills"), page: "skills" },
  { key: "4", label: "About", icon: "banner", arg: "#2e7d32", href: R("about"), page: "about" },
  { key: "5", label: "Resume", icon: "notepad", href: links.resume, ext: true },
  { key: "6", label: "GitHub", icon: "github", href: links.github, ext: true },
  { key: "7", label: "LinkedIn", icon: "linkedin", href: links.linkedin, ext: true },
  { key: "8", label: "Email", icon: "envelope", href: `mailto:${links.email}` },
  { key: "9", label: "Map", icon: "tree", href: R(), page: "" },
  { key: "0", label: "Desktop", icon: "door", href: "#/" },
];
const RARITY = { deployed: "#ffc896", released: "#9696ff", private: "#96ff96" };

function chrome(pg, body) {
  const L = LAYERS[pg] ?? LAYERS[""];
  const active = HOTBAR.find((h) => h.page === pg);
  const slots = HOTBAR.map((h) => `<li><a class="t-slot${h === active ? " on" : ""}" href="${h.href}" ${h.ext ? ext : ""} data-key="${h.key}" ${h === active ? 'aria-current="page"' : ""} ${!pg && h.key === "0" ? "data-back" : ""}>
      <span class="t-key" aria-hidden="true">${h.key}</span><span class="t-ico">${icon(h.icon, "", h.arg)}</span><span class="sr-only">${h.label}${h.key === "0" ? " (exit to desktop)" : ""}</span></a></li>`).join("");
  return `<div class="t t-${L.cls}">
    <div class="t-sky" aria-hidden="true"></div>
    <header class="t-top">
      <nav aria-label="Hotbar"><p class="t-held" aria-hidden="true">${active ? active.label : "Dig & Build"}</p><ul class="t-hotbar">${slots}</ul></nav>
      <p class="t-depth"><span>Depth</span>${L.name}</p>
    </header>
    <div class="t-stage">${pg ? `<a class="t-back" href="${R()}" data-back>&lt; Back to the map</a>` : ""}${body}</div>
    <footer class="t-foot"><p>${DISCLAIMER}</p><p class="t-keys">Keys 1-0 use the hotbar. Esc goes back.</p></footer>
  </div>`;
}
const npc = (name, inner, opts = "") => `<div class="t-dialog"><p class="t-npc">${esc(name)}</p>${inner}${opts ? `<p class="t-opts">${opts}</p>` : ""}</div>`;

/* ---------- map: a cross-section of the world ---------- */
function home() {
  const strata = [
    { page: "about", layer: "Surface", label: "About", note: "Who I am, where I'm from, what I'm looking for" },
    { page: "experience", layer: "Dirt Layer", label: "Experience", note: `${experience.length} jobs, newest on top` },
    { page: "projects", layer: "Underground", label: "Projects", note: `${projects.length} things I built, in a crafting window` },
    { page: "skills", layer: "Caverns", label: "Skills", note: `${skills.reduce((n, c) => n + c.items.length, 0)} tools, sorted into chests` },
  ];
  return chrome("", `<h1 class="t-title" tabindex="-1">Dig &amp; Build<small>${esc(about.name)}'s world</small></h1>
    ${npc(about.name, `<p>Software Engineering at Rose-Hulman, graduating May 2027. Dig down for my experience and projects, or press 1 to 4.</p>`,
      `<a href="${R("experience")}">Experience</a><a href="${R("projects")}">Projects</a><a href="${R("skills")}">Skills</a><a href="${R("about")}">About</a><a href="#/">Close</a>`)}
    <nav aria-label="World layers"><ol class="t-strata">${strata.map((s) => `<li><a class="t-stratum t-s-${s.page}" href="${R(s.page)}">
      <span class="t-layer">${s.layer}</span><b>${s.label}</b><span class="t-note">${esc(s.note)}</span></a></li>`).join("")}</ol></nav>`);
}

/* ---------- experience: NPC dialog per job ---------- */
function experiencePage() {
  const boxes = experience.map((e) => `<li>${npc(e.org, `
      <h2>${esc(e.role)}</h2><p class="t-when">${esc(e.when)} &middot; ${esc(e.where)}</p>
      <ul class="t-lines">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`,
      e.tags.map((t) => `<span>${esc(t)}</span>`).join(""))}</li>`).join("");
  return chrome("experience", `<h1 class="t-h" tabindex="-1">Experience</h1><ul class="t-xp">${boxes}</ul>`);
}

/* ---------- projects: crafting window ---------- */
function tooltip(p) {
  const s = statusInfo[p.status];
  return `<div class="t-tip" aria-live="polite">
      <div class="t-tip-head"><span class="t-bigslot">${icon(p.icon)}</span>
        <div><h2 style="color:${RARITY[p.status]}">${esc(p.name)}</h2><p class="t-when">${s.label}${p.year ? ` &middot; ${p.year}` : ""}</p></div></div>
      <p class="t-lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      <p class="t-req">Crafted with</p>
      <ul class="t-mats">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="t-actions">${p.live ? `<a class="t-btn" href="${p.live}" ${ext}>Open site</a>` : ""}${p.repo ? `<a class="t-btn" href="${p.repo}" ${ext}>GitHub</a>` : `<span class="t-private">Source is private.</span>`}</p>
    </div>`;
}
function projectsPage(sel) {
  const cur = projects.find((p) => p.id === sel) || projects[0];
  const list = projects.map((p) => `<li><button type="button" class="t-recipe" data-id="${p.id}" aria-pressed="${p === cur}">
      <span class="t-slot-s">${icon(p.icon)}</span><span style="color:${RARITY[p.status]}">${esc(p.name)}</span></button></li>`).join("");
  return chrome("projects", `<h1 class="t-h" tabindex="-1">Projects</h1>
    <div class="t-craft">
      <section class="t-panel" aria-labelledby="t-craft-h"><h2 id="t-craft-h" class="t-label">Crafting</h2><ul class="t-recipes">${list}</ul></section>
      <div id="t-tip">${tooltip(cur)}</div>
    </div>`);
}
function wireProjects(root) {
  const tip = root.querySelector("#t-tip");
  root.querySelector(".t-recipes").addEventListener("click", (e) => {
    const b = e.target.closest(".t-recipe");
    if (!b) return;
    root.querySelectorAll(".t-recipe").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    tip.innerHTML = tooltip(projects.find((p) => p.id === b.dataset.id));
    setSubPath(R(`projects/${b.dataset.id}`));
    if (matchMedia("(max-width: 720px)").matches) tip.scrollIntoView({ block: "start" });
  });
}

/* ---------- skills: chests ---------- */
function skillsPage() {
  const chests = skills.map((c) => `<section class="t-panel t-chest"><h2 class="t-label">${icon("chest")}${esc(c.name)}</h2>
      <ul class="t-items">${c.items.map((s) => `<li><button type="button" class="t-item" aria-pressed="false">${esc(s)}</button></li>`).join("")}</ul></section>`).join("");
  return chrome("skills", `<h1 class="t-h" tabindex="-1">Skills</h1>
    <div class="t-dialog t-used" id="t-used" aria-live="polite"><p class="t-npc">Item info</p><p>Pick an item to see where I've used it.</p></div>
    <div class="t-chests">${chests}</div>`);
}
function wireSkills(root) {
  const out = root.querySelector("#t-used");
  root.querySelector(".t-chests").addEventListener("click", (e) => {
    const b = e.target.closest(".t-item");
    if (!b) return;
    root.querySelectorAll(".t-item").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.textContent.trim(), uses = usedIn(name);
    out.innerHTML = `<p class="t-npc">${esc(name)}</p><p>${uses.length ? `Used in: ${uses.map(esc).join(", ")}` : "On my resume, not tied to a project on this site."}</p>`;
  });
}

/* ---------- about: housing ---------- */
function aboutPage() {
  const a = about;
  return chrome("about", `<h1 class="t-h" tabindex="-1">About</h1>
    <div class="t-house">
      <section class="t-panel t-id">
        <div class="t-frame"><img src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling"></div>
        <p class="t-name">${esc(a.name)}</p><p class="t-full">${esc(a.fullName)}</p>
        <dl class="t-facts">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="t-actions"><a class="t-btn" href="${links.resume}" ${ext}>Resume</a><a class="t-btn" href="mailto:${links.email}">Email</a></p>
      </section>
      <div class="t-col">
        ${npc(a.name, a.bio.map((p) => `<p>${esc(p)}</p>`).join(""))}
        ${npc("Looking for", `<p>${esc(a.lookingFor)}</p>`)}
        <section class="t-panel"><h2 class="t-label">Banners</h2>
          <ul class="t-banners">${a.leadership.map((l) => `<li><span class="t-slot-s">${icon("banner", "", l.color)}</span><span><small>${esc(l.label)}</small>${esc(l.title)}</span></li>`).join("")}</ul></section>
      </div>
    </div>`);
}

function render([pg = "", sub]) {
  const views = { experience: [experiencePage], projects: [() => projectsPage(sub), wireProjects], skills: [skillsPage, wireSkills], about: [aboutPage] };
  const v = views[pg];
  const title = v ? `${pg[0].toUpperCase() + pg.slice(1)} | Dig & Build | Timi Folayan` : "Dig & Build | Timi Folayan";
  return {
    html: v ? v[0]() : home(),
    title,
    screen: v ? pg : "home",
    wire(root, ctx) {
      v?.[1]?.(root);
      const onKey = (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey || e.target.matches?.("input, textarea")) return;
        const slot = root.querySelector(`.t-slot[data-key="${e.key}"]`);
        if (slot) { e.preventDefault(); slot.click(); }
      };
      document.addEventListener("keydown", onKey);
      ctx.cleanup(() => document.removeEventListener("keydown", onKey));
    },
  };
}
export default { render };
