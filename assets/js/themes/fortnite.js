// "Battle Royale Lobby": a lobby/menu homage. Experience is a battle pass of
// tiers, projects are item-shop cards, skills are locker slots by rarity.
// Rarity colors stand for something real: project status, skill category.
import { icon } from "../pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, contactLinks, linkAttrs, usedIn, setSubPath, noSource, groupStart, currentProjects, earlierProjects } from "../shared.js";

const R = (p = "") => `#/fortnite${p ? `/${p}` : ""}`;
const TABS = [
  { id: "", label: "Lobby" },
  { id: "experience", label: "Battle Pass", sub: "Experience" },
  { id: "projects", label: "Item Shop", sub: "Projects" },
  { id: "skills", label: "Locker", sub: "Skills" },
  { id: "about", label: "Career", sub: "About" },
];
const PROJECT_RARITY = { deployed: "legendary", released: "epic", private: "rare", earlier: "common" };
const SKILL_RARITY = ["legendary", "rare", "epic", "uncommon", "common"];
const TIER_RARITY = ["uncommon", "rare", "epic", "legendary"];

function chrome(pg, body) {
  const tabs = TABS.map((t) => `<li><a class="f-tab" href="${R(t.id)}" ${t.id === pg ? 'aria-current="page"' : ""} ${pg && !t.id ? "data-back" : ""}>${t.label}${t.sub ? `<small>${t.sub}</small>` : ""}</a></li>`).join("");
  return `<div class="f f-pg-${pg || "lobby"}">
    <div class="f-bg" aria-hidden="true"></div>
    <header class="f-top">
      <a class="f-exit" href="#/" ${pg ? "" : "data-back"} aria-label="Exit to desktop">&#10005;<span>Exit</span></a>
      <nav aria-label="Lobby tabs"><ul class="f-tabs">${tabs}</ul></nav>
      <p class="f-player"><span class="f-lvl">SWE</span>${esc(about.name)}</p>
    </header>
    <div class="f-stage">${body}</div>
    <footer class="f-foot"><p>${DISCLAIMER}</p></footer>
  </div>`;
}
const rar = (r) => `<span class="f-rarity r-${r}">${r}</span>`;

/* ---------- lobby ---------- */
function lobby() {
  return chrome("", `<div class="f-lobby">
      <div class="f-hero">
        <p class="f-kicker">Battle Royale Lobby</p>
        <h1 tabindex="-1">${esc(about.name)}</h1>
        <p class="f-sub">Software Engineering &middot; Rose-Hulman &middot; May 2027</p>
        <ul class="f-cards">
          <li><a class="f-card r-legendary" href="${R("experience")}"><b>Battle Pass</b><span>${experience.length} tiers of experience</span></a></li>
          <li><a class="f-card r-epic" href="${R("projects")}"><b>Item Shop</b><span>${projects.length} projects</span></a></li>
          <li><a class="f-card r-rare" href="${R("skills")}"><b>Locker</b><span>Skills by category</span></a></li>
          <li><a class="f-card r-uncommon" href="${R("about")}"><b>Career</b><span>About me</span></a></li>
        </ul>
      </div>
      <div class="f-pedestal" aria-hidden="true"><div class="f-banner">${icon("banner", "", "#1565c0")}</div><div class="f-disc"></div></div>
      <div class="f-side">
        <a class="f-play" href="${R("experience")}">Play<small>Start with the battle pass</small></a>
        <ul class="f-party">${contactLinks.map((l) => `<li><a href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a></li>`).join("")}</ul>
      </div>
    </div>`);
}

/* ---------- battle pass: oldest job is tier 1 ---------- */
function tierDetail(e, n) {
  return `<article class="f-panel f-tierinfo" aria-live="polite">
      <p class="f-eyebrow">Tier ${n} &middot; ${esc(e.when)} &middot; ${esc(e.where)}</p>
      <h2>${esc(e.role)}</h2><p class="f-org">${esc(e.org)}</p>
      <ul class="f-bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <ul class="f-tags">${e.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </article>`;
}
const tiers = () => [...experience].reverse();
function passPage() {
  const list = tiers();
  const cur = list.length - 1;
  const cards = list.map((e, i) => `<li><button type="button" class="f-tier r-${TIER_RARITY[i] || "legendary"}" data-i="${i}" aria-pressed="${i === cur}">
      <span class="f-tiernum">${i + 1}</span>
      <span class="f-tierwhen">${esc(e.when)}</span>
      <b>${esc(e.role)}</b><span class="f-tierorg">${esc(e.org)}</span>
      ${rar(TIER_RARITY[i] || "legendary")}</button></li>`).join("");
  return chrome("experience", `<h1 class="f-h" tabindex="-1">Battle Pass<small>Experience &middot; tier 1 is where it started</small></h1>
    <div class="f-track"><ol class="f-tiers" aria-label="Tiers">${cards}</ol><div class="f-progress" aria-hidden="true"><i style="width:100%"></i></div></div>
    <div id="f-tier">${tierDetail(list[cur], cur + 1)}</div>`);
}
function wirePass(root) {
  const out = root.querySelector("#f-tier"), list = tiers();
  root.querySelector(".f-tiers").addEventListener("click", (e) => {
    const b = e.target.closest(".f-tier");
    if (!b) return;
    root.querySelectorAll(".f-tier").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    out.innerHTML = tierDetail(list[+b.dataset.i], +b.dataset.i + 1);
  });
}

/* ---------- item shop ---------- */
function itemDetail(p) {
  const r = PROJECT_RARITY[p.status];
  return `<article class="f-panel f-item" aria-live="polite">
      <div class="f-item-head"><span class="f-icon r-${r}">${icon(p.icon)}</span>
        <div><h2>${esc(p.name)}</h2><p class="f-eyebrow">${rar(r)} ${statusInfo[p.status].label}${p.year ? ` &middot; ${p.year}` : ""}</p></div></div>
      <p class="f-lead">${esc(p.blurb)}</p>
      ${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}
      <ul class="f-tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      <p class="f-actions">${p.live ? `<a class="f-btn" href="${p.live}" ${ext}>Open site</a>` : ""}${p.repo ? `<a class="f-btn" href="${p.repo}" ${ext}>GitHub</a>` : `<span class="f-note">${noSource(p)}</span>`}</p>
    </article>`;
}
function shopPage(sel) {
  const cur = projects.find((p) => p.id === sel) || projects[0];
  const card = (p, big) => `<li class="${big ? "big" : ""}"><button type="button" class="f-shopcard r-${PROJECT_RARITY[p.status]}" data-id="${p.id}" aria-pressed="${p === cur}">
      <span class="f-shopart">${icon(p.icon)}</span>
      <span class="f-shopname">${esc(p.name)}</span>
      <span class="f-price">${statusInfo[p.status].label}${p.year ? ` &middot; ${p.year}` : ""}</span></button></li>`;
  return chrome("projects", `<h1 class="f-h" tabindex="-1">Item Shop<small>Projects &middot; nothing here costs anything</small></h1>
    <div class="f-shop">
      <div><p class="f-section">Featured</p><ul class="f-grid featured">${currentProjects.slice(0, 2).map((p) => card(p, true)).join("")}</ul>
        <p class="f-section">Daily</p><ul class="f-grid daily">${currentProjects.slice(2).map((p) => card(p)).join("")}</ul>
        <p class="f-section">Vault <small class="f-vault-note">Course &amp; earlier projects</small></p><ul class="f-grid daily vault">${earlierProjects.map((p) => card(p)).join("")}</ul></div>
      <div id="f-item">${itemDetail(cur)}</div>
    </div>`);
}
function wireShop(root) {
  const out = root.querySelector("#f-item");
  root.querySelector(".f-shop").addEventListener("click", (e) => {
    const b = e.target.closest(".f-shopcard");
    if (!b) return;
    root.querySelectorAll(".f-shopcard").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    out.innerHTML = itemDetail(projects.find((p) => p.id === b.dataset.id));
    setSubPath(R(`projects/${b.dataset.id}`));
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "start" });
  });
}

/* ---------- locker ---------- */
function lockerPage() {
  const rows = skills.map((c, i) => `<section class="f-locker-row"><h2 class="f-section">${esc(c.name)} ${rar(SKILL_RARITY[i])}</h2>
      <ul class="f-slots">${c.items.map((s) => `<li><button type="button" class="f-slot r-${SKILL_RARITY[i]}" aria-pressed="false">${esc(s)}</button></li>`).join("")}</ul></section>`).join("");
  return chrome("skills", `<h1 class="f-h" tabindex="-1">Locker<small>Skills &middot; rarity is just the category color</small></h1>
    <div class="f-locker"><div class="f-rows">${rows}</div>
      <aside class="f-panel f-equip" id="f-equip" aria-live="polite"><p class="f-eyebrow">Selected</p><h2>Nothing equipped</h2><p>Pick a slot to see where I've used it.</p></aside></div>`);
}
function wireLocker(root) {
  const out = root.querySelector("#f-equip");
  root.querySelector(".f-rows").addEventListener("click", (e) => {
    const b = e.target.closest(".f-slot");
    if (!b) return;
    root.querySelectorAll(".f-slot").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.textContent.trim(), uses = usedIn(name);
    out.innerHTML = `<p class="f-eyebrow">Selected</p><h2>${esc(name)}</h2>${uses.length ? `<p>Used in</p><ul class="f-used">${uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : "<p>On my resume, not tied to a project on this site.</p>"}`;
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "nearest" });
  });
}

/* ---------- career ---------- */
function careerPage() {
  const a = about;
  return chrome("about", `<h1 class="f-h" tabindex="-1">Career<small>About</small></h1>
    <div class="f-career">
      <section class="f-panel f-profile">
        <img src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling">
        <h2>${esc(a.name)}</h2><p class="f-org">${esc(a.fullName)}</p>
        <dl class="f-stats">${a.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <p class="f-actions"><a class="f-btn" href="${links.resume}" ${ext}>Resume</a><a class="f-btn alt" href="mailto:${links.email}">Email</a></p>
      </section>
      <div class="f-col">
        <section class="f-panel">${a.bio.map((p) => `<p>${esc(p)}</p>`).join("")}</section>
        <section class="f-panel"><p class="f-eyebrow">Looking for</p><p>${esc(a.lookingFor)}</p></section>
        <section class="f-panel"><p class="f-eyebrow">Squads</p>
          <ul class="f-squads">${a.leadership.map((l) => `<li style="--c:${l.color}"><small>${esc(l.label)}</small>${esc(l.title)}</li>`).join("")}</ul></section>
      </div>
    </div>`);
}

const TITLES = { experience: "Battle Pass", projects: "Item Shop", skills: "Locker", about: "Career" };
function render([pg = "", sub]) {
  const views = { experience: [passPage, wirePass], projects: [() => shopPage(sub), wireShop], skills: [lockerPage, wireLocker], about: [careerPage] };
  const v = views[pg];
  return {
    html: v ? v[0]() : lobby(),
    wire: v?.[1],
    title: v ? `${TITLES[pg]} | Battle Royale Lobby | Timi Folayan` : "Battle Royale Lobby | Timi Folayan",
    screen: v ? pg : "lobby",
  };
}
export default { render };
