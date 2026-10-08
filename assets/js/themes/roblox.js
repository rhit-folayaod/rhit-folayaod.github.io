// "Brick Hub": a blocky game-platform homage with no avatars. Experience is a
// row of experience cards with a Play button, projects live in a Studio-style
// Explorer tree with a Properties panel, skills are badges, About is chat.
// No visit or like counts: nothing here is a number I didn't earn.
import { icon } from "../pixel.js";
import { links, experience, projects, statusInfo, skills, about } from "../data.js";
import { esc, ext, DISCLAIMER, contactLinks, linkAttrs, usedIn, setSubPath, noSource, relatedProject, currentProjects, earlierProjects } from "../shared.js";

const R = (p = "") => `#/roblox${p ? `/${p}` : ""}`;
const NAV = [
  { id: "", label: "Home" },
  { id: "experience", label: "Experiences" },
  { id: "projects", label: "Studio" },
  { id: "skills", label: "Badges" },
  { id: "about", label: "Chat" },
];
// Each job's thumbnail is a little brick build in one color.
const THUMB = ["#2f7de1", "#7a4fd6", "#e0662f", "#2fb36b", "#d6a92f"];
const BADGE = ["#2f7de1", "#2fb36b", "#e0662f", "#7a4fd6", "#d6a92f"];

function chrome(pg, body) {
  const nav = NAV.map((n) => `<li><a class="b-nav" href="${R(n.id)}" ${n.id === pg ? 'aria-current="page"' : ""} ${pg && !n.id ? "data-back" : ""}>${n.label}</a></li>`).join("");
  return `<div class="b b-pg-${pg || "home"}">
    <header class="b-top">
      <a class="b-brand" href="${R()}"><span class="b-brand-ico">${icon("brick")}</span>Brick Hub</a>
      <nav aria-label="Brick Hub"><ul class="b-navs">${nav}</ul></nav>
      <a class="b-exit" href="#/" ${pg ? "" : "data-back"}>Exit to desktop</a>
    </header>
    <div class="b-stage">${body}</div>
    <footer class="b-foot"><p>${DISCLAIMER}</p></footer>
  </div>`;
}
const tags = (t) => `<ul class="b-tags">${t.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
// A tiny build: a baseplate with a few bricks stacked by index, so every card differs.
function build(color, seed) {
  const bricks = [0, 1, 2, 3].map((k) => {
    const w = 2 + ((seed + k * 3) % 3), x = (seed * 5 + k * 7) % (12 - w), y = 3 - k;
    return `<rect x="${x}" y="${y + 3}" width="${w}" height="1" fill="${k % 2 ? color : "#f2f2f2"}"/><rect x="${x}" y="${y + 3}" width="${w}" height="0.25" fill="rgba(255,255,255,.35)"/>`;
  }).join("");
  return `<svg class="b-build" viewBox="0 0 12 8" shape-rendering="crispEdges" aria-hidden="true"><rect width="12" height="8" fill="${color}" opacity=".28"/><rect y="7" width="12" height="1" fill="#6d7179"/>${bricks}</svg>`;
}

/* ---------- home ---------- */
function home() {
  const tiles = [
    { to: "experience", h: "Experiences", s: `${experience.length} jobs, each with a Play button` },
    { to: "projects", h: "Studio", s: "Projects in an Explorer tree" },
    { to: "skills", h: "Badges", s: "Skills, and where I earned them" },
    { to: "about", h: "Chat", s: "About me, one message at a time" },
  ].map((t, i) => `<li><a class="b-tile" href="${R(t.to)}">${build(THUMB[i], i + 2)}<b>${t.h}</b><span>${t.s}</span></a></li>`).join("");
  return chrome("", `<section class="b-hero" aria-labelledby="b-h">
      <div class="b-plate" aria-hidden="true"><i class="b-pad"></i><i class="b-tower t1"></i><i class="b-tower t2"></i><i class="b-tower t3"></i></div>
      <div class="b-hero-text">
        <p class="b-kicker">Spawned in</p>
        <h1 id="b-h" tabindex="-1">${esc(about.name)}</h1>
        <p class="b-sub">Software Engineering at Rose-Hulman, May 2027. Pick an experience below or hop into Studio.</p>
        <p class="b-row"><a class="b-play" href="${R("experience")}">Play</a><a class="b-btn" href="${R("projects")}">Open Studio</a></p>
      </div>
    </section>
    <h2 class="b-h2">Continue</h2>
    <ul class="b-tiles">${tiles}</ul>
    <h2 class="b-h2">Links</h2>
    <ul class="b-links">${contactLinks.map((l) => `<li><a class="b-btn" href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a></li>`).join("")}</ul>`);
}

/* ---------- experiences: cards with Play ---------- */
function xpDetail(e, i) {
  return `<article class="b-panel b-xpd" aria-live="polite">
      <div class="b-xpd-head">${build(THUMB[i % THUMB.length], i)}<div><p class="b-meta">${esc(e.when)} &middot; ${esc(e.where)}</p><h2>${esc(e.role)}</h2><p class="b-org">${esc(e.org)}</p></div></div>
      <ul class="b-bullets">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      ${tags(e.tags)}
    </article>`;
}
function experiencePage() {
  const cards = experience.map((e, i) => `<li class="b-xp">
      ${build(THUMB[i % THUMB.length], i)}
      <div class="b-xp-text"><h2>${esc(e.role)}</h2><p class="b-org">${esc(e.org)}</p><p class="b-meta">${esc(e.when)}</p></div>
      <button type="button" class="b-play sm" data-i="${i}" aria-pressed="${i === 0}" aria-label="Play: ${esc(e.role)}, ${esc(e.org)}">Play</button>
    </li>`).join("");
  return chrome("experience", `<h1 class="b-h1" tabindex="-1">Experiences</h1>
    <p class="b-lede">Every job I've had. Press Play to load the details.</p>
    <div class="b-xpwrap"><ul class="b-xps">${cards}</ul><div id="b-xpd">${xpDetail(experience[0], 0)}</div></div>`);
}
function wireExperience(root) {
  const out = root.querySelector("#b-xpd");
  root.querySelector(".b-xps").addEventListener("click", (e) => {
    const b = e.target.closest(".b-play");
    if (!b) return;
    root.querySelectorAll(".b-xps .b-play").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    out.innerHTML = xpDetail(experience[+b.dataset.i], +b.dataset.i);
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "nearest" });
  });
}

/* ---------- studio: explorer + properties ---------- */
function props(p) {
  const s = statusInfo[p.status];
  const rel = relatedProject(p);
  const row = (k, v) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`;
  return `<section class="b-win b-props" aria-labelledby="b-props-h" aria-live="polite">
      <h2 class="b-win-h" id="b-props-h">Properties: ${esc(p.name)}</h2>
      <table class="b-table"><tbody>
        ${row("Name", esc(p.name))}
        ${row("ClassName", p.status === "earlier" ? "EarlierProject" : "Project")}
        ${row("Year", p.year ? esc(p.year) : "&nbsp;")}
        ${row("Status", esc(s.label))}
        ${row("Tags", esc(p.tags.join(", ")))}
        ${row("Live", p.live ? `<a href="${p.live}" ${ext}>${esc(p.live.replace(/^https:\/\//, ""))}</a>` : "nil")}
        ${row("Source", p.repo ? `<a href="${p.repo}" ${ext}>GitHub</a>` : esc(noSource(p)))}
        ${rel ? row("Related", `<a href="${R(`projects/${rel.id}`)}" data-id="${rel.id}">${esc(rel.name)}</a>`) : ""}
      </tbody></table>
      <div class="b-script"><p class="b-script-h">Description</p><p class="b-lead">${esc(p.blurb)}</p>${p.detail.map((d) => `<p>${esc(d)}</p>`).join("")}</div>
    </section>`;
}
function treeItems(list, cur) {
  return list.map((p) => `<li role="none"><button type="button" role="treeitem" class="b-node" data-id="${p.id}" aria-selected="${p === cur}"><span class="b-node-ico">${icon(p.icon)}</span>${esc(p.name)}</button></li>`).join("");
}
function studioPage(sel) {
  const cur = projects.find((p) => p.id === sel) || projects[0];
  return chrome("projects", `<h1 class="b-h1" tabindex="-1">Studio</h1>
    <p class="b-lede">Projects, laid out like a place file. Pick one in the Explorer.</p>
    <div class="b-studio">
      <section class="b-win b-explorer" aria-labelledby="b-ex-h">
        <h2 class="b-win-h" id="b-ex-h">Explorer</h2>
        <ul class="b-tree" role="tree" aria-label="Projects">
          <li role="none"><span class="b-folder">Workspace</span>
            <ul role="group">
              <li role="none"><span class="b-folder sub">Current</span><ul role="group">${treeItems(currentProjects, cur)}</ul></li>
              <li role="none"><span class="b-folder sub">Course &amp; earlier</span><ul role="group">${treeItems(earlierProjects, cur)}</ul></li>
            </ul>
          </li>
        </ul>
      </section>
      <div id="b-props">${props(cur)}</div>
    </div>`);
}
function wireStudio(root) {
  const out = root.querySelector("#b-props");
  const nodes = [...root.querySelectorAll(".b-node")];
  const pick = (id, focus) => {
    const p = projects.find((x) => x.id === id);
    nodes.forEach((x) => x.setAttribute("aria-selected", String(x.dataset.id === id)));
    out.innerHTML = props(p);
    setSubPath(R(`projects/${id}`));
    if (focus) nodes.find((x) => x.dataset.id === id)?.focus();
  };
  root.querySelector(".b-tree").addEventListener("click", (e) => {
    const b = e.target.closest(".b-node");
    if (!b) return;
    pick(b.dataset.id);
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "start" });
  });
  root.querySelector(".b-tree").addEventListener("keydown", (e) => {
    const i = nodes.indexOf(e.target);
    if (i < 0 || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    const n = nodes[(i + (e.key === "ArrowDown" ? 1 : -1) + nodes.length) % nodes.length];
    pick(n.dataset.id, true);
  });
  out.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-id]");
    if (!a) return;
    e.preventDefault();
    pick(a.dataset.id, true);
  });
}

/* ---------- badges ---------- */
function badgesPage() {
  const groups = skills.map((c, i) => `<section class="b-badgegrp"><h2 class="b-h2">${esc(c.name)}</h2>
      <ul class="b-badges">${c.items.map((s) => `<li><button type="button" class="b-badge" style="--c:${BADGE[i % BADGE.length]}" aria-pressed="false"><i aria-hidden="true"></i><span>${esc(s)}</span></button></li>`).join("")}</ul></section>`).join("");
  return chrome("skills", `<h1 class="b-h1" tabindex="-1">Badges</h1>
    <p class="b-lede">One badge per skill. Click one to see where it was earned.</p>
    <div class="b-badgewrap"><div>${groups}</div>
      <aside class="b-panel b-awarded" id="b-awarded" aria-live="polite"><p class="b-meta">Badge</p><h2>None selected</h2><p>Pick a badge.</p></aside></div>`);
}
function wireBadges(root) {
  const out = root.querySelector("#b-awarded");
  root.querySelector(".b-badgewrap").addEventListener("click", (e) => {
    const b = e.target.closest(".b-badge");
    if (!b) return;
    root.querySelectorAll(".b-badge").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const name = b.textContent.trim(), uses = usedIn(name);
    out.innerHTML = `<p class="b-meta">Badge</p><h2>${esc(name)}</h2>${uses.length ? `<p>Earned in</p><ul class="b-used">${uses.map((u) => `<li>${esc(u)}</li>`).join("")}</ul>` : "<p>On my resume, not tied to a project on this site.</p>"}`;
    if (matchMedia("(max-width: 900px)").matches) out.scrollIntoView({ block: "nearest" });
  });
}

/* ---------- chat ---------- */
function chatPage() {
  const a = about;
  const me = (html) => `<li class="b-msg"><p class="b-bubble">${html}</p></li>`;
  const facts = a.facts.map(([k, v]) => `${esc(k)}: <b>${esc(v)}</b>`).join("<br>");
  const lead = a.leadership.map((l) => `${esc(l.title)} <small>(${esc(l.label)})</small>`).join("<br>");
  return chrome("about", `<h1 class="b-h1" tabindex="-1">Chat</h1>
    <div class="b-chat">
      <section class="b-win b-chatwin" aria-labelledby="b-chat-h">
        <div class="b-chat-head"><img src="headshot.jpg" width="480" height="480" alt="Timi Folayan in a dark suit, smiling"><div><h2 id="b-chat-h">${esc(a.name)}</h2><p class="b-meta">${esc(a.fullName)}</p></div></div>
        <ol class="b-msgs">
          ${a.bio.map((p) => me(esc(p))).join("")}
          ${me(facts)}
          ${me(`Looking for: ${esc(a.lookingFor)}`)}
          ${me(`<span class="b-msg-h">Leadership</span><br>${lead}`)}
        </ol>
        <p class="b-chatbar">${contactLinks.map((l) => `<a class="b-btn" href="${l.href}" ${linkAttrs(l)}>${esc(l.label)}</a>`).join("")}</p>
      </section>
    </div>`);
}

const TITLES = { experience: "Experiences", projects: "Studio", skills: "Badges", about: "Chat" };
function render([pg = "", sub]) {
  const views = { experience: [experiencePage, wireExperience], projects: [() => studioPage(sub), wireStudio], skills: [badgesPage, wireBadges], about: [chatPage] };
  const v = views[pg];
  return {
    html: v ? v[0]() : home(),
    wire: v?.[1],
    title: v ? `${TITLES[pg]} | Brick Hub | Timi Folayan` : "Brick Hub | Timi Folayan",
    screen: v ? pg : "home",
  };
}
export default { render };
