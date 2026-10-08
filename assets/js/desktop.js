// The start screen: a late-90s style desktop. Game icons boot a theme; the
// other icons open small windows with the resume, contact links, and a joke.
import { icon } from "./pixel.js";
import { links, experience, currentProjects, earlierProjects, about } from "./data.js";
import { esc, ext, THEMES, DISCLAIMER, contactLinks, linkAttrs, themeById } from "./shared.js";

const EXTRAS = [
  { id: "resume", name: "Resume.txt", icon: "notepad", tip: "Plain-text resume" },
  { id: "computer", name: "My Computer", icon: "computer", tip: "Contact links" },
  { id: "bin", name: "Recycle Bin", icon: "bin", tip: "Recycle Bin" },
];
const GLORY = { id: "glory", name: "glory", icon: "dice", tip: "Opens a random game" };
const ICONS = [
  ...THEMES.map((t) => ({ id: t.id, name: t.name, icon: t.icon, tip: t.style, game: true })),
  GLORY,
  ...EXTRAS,
];
const LAST = "tf.lastTheme";
const CLICKED = "tf.desktopClicked";

const closeGlyph = `<svg viewBox="0 0 8 7" shape-rendering="crispEdges" aria-hidden="true"><path d="M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v1h1v1h1v1h1v1H6V6H5V5H3v1H2v1H0V6h1V5h1V4h1V3H2V2H1V1H0z"/></svg>`;

/* ---------- window bodies ---------- */
function welcomeBody() {
  const now = experience[0];
  return `<div class="win-body welcome">
      <span class="welcome-ico">${icon("computer")}</span>
      <div class="welcome-text">
        <p class="welcome-hi">Hi, I'm Timi.</p>
        <p>Pick a game to explore my portfolio, or open <b>glory</b> for a surprise.</p>
        <p class="welcome-sub">Software Engineering at Rose-Hulman, graduating May 2027. ${esc(now.when)}: ${esc(now.role)} at ${esc(now.org)}. Every game shows the same experience, projects, skills, and about.</p>
        <p class="welcome-links">${contactLinks.map((l) => `<a href="${l.href}" ${linkAttrs(l)}>${esc(l.id === "resume" ? "Resume.pdf" : l.label)}</a>`).join("")}</p>
      </div>
    </div>
    <div class="win-actions"><button type="button" class="w-btn w-default" data-open="glory"><span class="btn-ico">${icon("dice")}</span>Open glory</button><button type="button" class="w-btn" data-close>Close</button></div>`;
}
function gloryBody() {
  return `<div class="win-body picking">
      <p id="glory-status" aria-live="polite">Picking a game...</p>
      <div class="reel" aria-hidden="true"><span class="reel-ico"></span><span class="reel-name"></span></div>
    </div>
    <div class="win-actions"><button type="button" class="w-btn" data-close>Cancel</button></div>`;
}
function resumeBody() {
  const pad = (s, n) => esc(s) + "&nbsp;".repeat(Math.max(1, n - s.length));
  const xp = experience.map((e) => `<p><b>${pad(e.when, 22)}</b>${esc(e.role)}<br><span class="indent">${esc(e.org)}, ${esc(e.where)}</span></p>`).join("");
  const row = (p) => `<p><b>${esc(p.name)}</b><br><span class="indent">${esc(p.blurb)}</span>${p.live ? `<br><span class="indent"><a href="${p.live}" ${ext}>${esc(p.live)}</a></span>` : ""}</p>`;
  const pj = currentProjects.map(row).join("");
  const old = earlierProjects.map(row).join("");
  return `<div class="win-menu" aria-hidden="true"><span>File</span><span>Edit</span><span>Search</span><span>Help</span></div>
    <div class="win-body paper mono" tabindex="0" aria-label="Resume text">
      <p><b>${esc(about.name.toUpperCase())}</b><br>${esc(links.email)}</p>
      <p>B.S. Software Engineering, Minor in Geography<br>Rose-Hulman Institute of Technology, May 2027</p>
      <h3>EXPERIENCE</h3>${xp}
      <h3>PROJECTS</h3>${pj}
      <h3>COURSE &amp; EARLIER PROJECTS</h3>${old}
    </div>
    <div class="win-actions"><a class="w-btn" href="${links.resume}" ${ext}>Open Resume.pdf</a><button type="button" class="w-btn" data-close>Close</button></div>`;
}
function computerBody() {
  const drive = { resume: "notepad", github: "github", linkedin: "linkedin", email: "envelope" };
  const label = { resume: "Resume.pdf", github: "GitHub (G:)", linkedin: "LinkedIn (L:)", email: "Email (E:)" };
  return `<div class="win-body drives">
      ${contactLinks.map((l) => `<a class="drive" href="${l.href}" ${linkAttrs(l)}><span class="drive-ico ${l.id}">${icon(drive[l.id])}</span><span>${label[l.id]}</span></a>`).join("")}
    </div>
    <p class="win-status"><span>${contactLinks.length} object(s)</span><span>${esc(links.email)}</span></p>`;
}
function binBody() {
  return `<div class="win-body empty-bin">
      <p>The Recycle Bin is empty.</p>
      <p>Older versions of this site live in the <a href="https://github.com/rhit-folayaod/rhit-folayaod.github.io/commits/main" ${ext}>git history</a>.</p>
    </div>
    <p class="win-status"><span>0 object(s)</span></p>`;
}
function shutdownBody() {
  return `<div class="win-body shutdown"><p>It's now safe to close this tab.</p><p>Or don't. There are seven games left.</p></div>
    <div class="win-actions"><button type="button" class="w-btn" data-close>Restart</button></div>`;
}
function bootBody(t) {
  return `<div class="win-body booting">
      <span class="boot-ico">${icon(t.icon)}</span>
      <div><p>Starting ${esc(t.name)}...</p>
      <div class="progress" role="progressbar" aria-label="Loading ${esc(t.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div></div>
    </div>
    <div class="win-actions"><button type="button" class="w-btn" data-close>Cancel</button></div>`;
}

const WINDOWS = {
  welcome: { title: "Welcome.exe", icon: "computer", body: welcomeBody },
  resume: { title: "Resume.txt", icon: "notepad", body: resumeBody },
  computer: { title: "My Computer", icon: "computer", body: computerBody },
  bin: { title: "Recycle Bin", icon: "bin", body: binBody },
  shutdown: { title: "Shut Down", icon: "computer", body: shutdownBody },
};

function winHtml(id, title, ico, body) {
  return `<section class="win win-${id}" data-win="${id}" tabindex="-1" aria-labelledby="wt-${id}">
    <div class="win-bar"><span class="win-ico">${icon(ico)}</span><h2 id="wt-${id}">${esc(title)}</h2>
      <button type="button" class="win-x" data-close aria-label="Close ${esc(title)}">${closeGlyph}</button></div>
    ${body}
  </section>`;
}

/* ---------- screen ---------- */
function html() {
  const iconList = ICONS.map((d) => `<li><button type="button" class="dicon" data-open="${d.id}" title="${esc(d.tip)}">
      <span class="dicon-img">${icon(d.icon)}</span><span class="dicon-label">${esc(d.name)}</span></button></li>`).join("");
  const startItems = [
    ...THEMES.map((t) => `<li><button type="button" role="menuitem" data-open="${t.id}" title="${esc(t.style)}"><span class="sm-ico">${icon(t.icon)}</span>${esc(t.name)}</button></li>`),
    `<li><button type="button" role="menuitem" data-open="glory"><span class="sm-ico">${icon("dice")}</span>glory (random game)</button></li>`,
    `<li class="sep" role="separator"></li>`,
    ...EXTRAS.map((x) => `<li><button type="button" role="menuitem" data-open="${x.id}"><span class="sm-ico">${icon(x.icon)}</span>${esc(x.name)}</button></li>`),
    `<li class="sep" role="separator"></li>`,
    `<li><button type="button" role="menuitem" data-open="shutdown"><span class="sm-ico">${icon("computer")}</span>Shut Down...</button></li>`,
  ].join("");
  const fresh = sessionStorage.getItem(CLICKED) ? "" : " fresh";
  return `<section class="desk${fresh}" aria-labelledby="h-desk">
    <h1 id="h-desk" class="sr-only" tabindex="-1">Timi Folayan's desktop</h1>
    <ul class="icons" aria-label="Desktop icons. Click or press Enter to open.">${iconList}</ul>
    <div class="windows" id="windows">${winHtml("welcome", WINDOWS.welcome.title, "computer", welcomeBody())}</div>
    <p class="desk-legal">${DISCLAIMER}</p>
  </section>
  <div class="startmenu" id="startmenu" role="menu" aria-label="Start" hidden>
    <p class="sm-band" aria-hidden="true">Timi<b>OS</b></p>
    <ul>${startItems}</ul>
  </div>
  <footer class="taskbar">
    <button type="button" class="start" id="start" aria-haspopup="menu" aria-expanded="false" aria-controls="startmenu"><span class="start-ico">${icon("monogram")}</span>Start</button>
    <div class="tasks" id="tasks" aria-label="Open windows"></div>
    <p class="tb-hint"><span class="wide-only">Click any icon to open it. Esc backs out of a game.</span><span class="narrow-only">Tap an icon to open it.</span></p>
    <div class="tray"><time id="clock"></time></div>
  </footer>`;
}

function wire(root, ctx) {
  const layer = root.querySelector("#windows");
  const tasks = root.querySelector("#tasks");
  const menu = root.querySelector("#startmenu");
  const startBtn = root.querySelector("#start");
  const icons = [...root.querySelectorAll(".dicon")];
  let z = 10, cascade = 0, opener = null;
  const wide = () => matchMedia("(min-width: 721px)").matches;

  /* clock */
  const clock = root.querySelector("#clock");
  const tick = () => {
    const d = new Date();
    clock.dateTime = d.toISOString();
    clock.textContent = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };
  tick();
  const iv = setInterval(tick, 10000);
  ctx.cleanup(() => clearInterval(iv));

  /* windows */
  function syncTasks() {
    tasks.innerHTML = [...layer.querySelectorAll(".win")].map((w) =>
      `<button type="button" class="task${w.classList.contains("active") ? " active" : ""}" data-task="${w.dataset.win}">
        <span class="task-ico">${w.querySelector(".win-ico").innerHTML}</span><span>${w.querySelector("h2").textContent}</span></button>`).join("");
  }
  function focusWin(w) {
    layer.querySelectorAll(".win").forEach((x) => x.classList.toggle("active", x === w));
    w.style.zIndex = ++z;
    syncTasks();
  }
  function openWin(id, title, ico, body) {
    let w = layer.querySelector(`[data-win="${id}"]`);
    if (!w) {
      layer.insertAdjacentHTML("beforeend", winHtml(id, title, ico, body));
      w = layer.lastElementChild;
      if (wide()) {
        cascade = (cascade + 1) % 5;
        w.style.left = `${200 + cascade * 36}px`;
        w.style.top = `${60 + cascade * 30}px`;
      }
      w.opener_ = opener;
    }
    focusWin(w);
    w.focus();
    return w;
  }
  function closeWin(w) {
    const back = w.opener_;
    w.remove();
    const top = [...layer.querySelectorAll(".win")].sort((a, b) => (b.style.zIndex || 0) - (a.style.zIndex || 0))[0];
    if (top) focusWin(top); else syncTasks();
    (back && document.contains(back) ? back : icons[0]).focus();
  }

  /* booting a game: show a loading window while its code and CSS load */
  let booting = null;
  function boot(id) {
    const t = themeById(id);
    sessionStorage.setItem(LAST, id);
    if (ctx.reducedMotion) { location.hash = `#/${id}`; return; }
    if (layer.querySelector('[data-win^="boot-"]')) return; // already starting one
    const w = openWin(`boot-${id}`, t.name, t.icon, bootBody(t));
    const bar = w.querySelector(".progress");
    const fillEl = bar.querySelector("span");
    const token = (booting = {});
    let pct = 0, loaded = false;
    ctx.preload(id).then(() => { loaded = true; });
    const step = setInterval(() => {
      if (booting !== token || !document.contains(w)) { clearInterval(step); return; }
      pct = Math.min(loaded ? pct + 20 : Math.min(pct + 10, 80), 100);
      fillEl.style.width = `${pct}%`;
      bar.setAttribute("aria-valuenow", String(pct));
      if (pct >= 100) { clearInterval(step); location.hash = `#/${id}`; }
    }, 70);
    ctx.cleanup(() => clearInterval(step));
  }

  /* glory: shuffle through the games, land on one that wasn't the last one opened */
  let picking = null;
  function glory() {
    const last = sessionStorage.getItem(LAST);
    const pool = THEMES.filter((t) => t.id !== last);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (ctx.reducedMotion) return boot(pick.id);
    if (picking) return;
    const w = openWin("glory", "glory", "dice", gloryBody());
    const ico = w.querySelector(".reel-ico"), name = w.querySelector(".reel-name"), status = w.querySelector("#glory-status");
    const token = (picking = {});
    let i = Math.floor(Math.random() * THEMES.length), n = 0;
    const spins = 12 + Math.floor(Math.random() * 5);
    const show = (t) => { ico.innerHTML = icon(t.icon); name.textContent = t.name; };
    function spin() {
      if (picking !== token || !document.contains(w)) return;
      if (n >= spins) {
        show(pick);
        w.querySelector(".reel").classList.add("landed");
        status.textContent = `Landed on ${pick.name}.`;
        const t2 = setTimeout(() => {
          if (picking !== token || !document.contains(w)) return;
          picking = null;
          w.remove();
          boot(pick.id);
        }, 650);
        ctx.cleanup(() => clearTimeout(t2));
        return;
      }
      i = (i + 1) % THEMES.length;
      show(THEMES[i]);
      n++;
      const t1 = setTimeout(spin, 60 + n * n * 1.1);
      ctx.cleanup(() => clearTimeout(t1));
    }
    spin();
  }

  function open(id, from) {
    opener = from || null;
    closeMenu(false);
    markClicked();
    if (id === "glory") return glory();
    if (themeById(id)) return boot(id);
    const W = WINDOWS[id];
    openWin(id, W.title, W.icon, W.body());
  }

  /* icons: one click, tap, or Enter opens (a double-click still works, it just doesn't open twice) */
  function markClicked() {
    sessionStorage.setItem(CLICKED, "1");
    root.querySelector(".desk").classList.remove("fresh");
  }
  const iconList = root.querySelector(".icons");
  iconList.addEventListener("click", (e) => {
    const b = e.target.closest(".dicon");
    if (!b || e.detail > 1) return;
    icons.forEach((x) => x.classList.toggle("sel", x === b));
    open(b.dataset.open, b);
  });
  iconList.addEventListener("keydown", (e) => {
    const dirs = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
    const d = dirs[e.key];
    const b = e.target.closest(".dicon");
    if (!d || !b) return;
    e.preventDefault();
    const r = b.getBoundingClientRect();
    let best = null, bestScore = Infinity;
    for (const o of icons) {
      if (o === b) continue;
      const q = o.getBoundingClientRect();
      const dx = q.left - r.left, dy = q.top - r.top;
      const along = dx * d[0] + dy * d[1];
      if (along <= 0) continue;
      const score = along + Math.abs(d[0] ? dy : dx) * 3;
      if (score < bestScore) { bestScore = score; best = o; }
    }
    if (best) { best.focus(); icons.forEach((x) => x.classList.toggle("sel", x === best)); }
  });

  /* windows: close, focus, drag */
  layer.addEventListener("click", (e) => {
    const w = e.target.closest(".win");
    if (!w) return;
    const opener2 = e.target.closest("[data-open]");
    if (opener2) { open(opener2.dataset.open, opener2); return; }
    if (e.target.closest("[data-close]")) {
      if (w.dataset.win.startsWith("boot-")) booting = null;
      if (w.dataset.win === "glory") picking = null;
      closeWin(w);
    } else focusWin(w);
  });
  layer.addEventListener("pointerdown", (e) => {
    const bar = e.target.closest(".win-bar");
    if (!bar || e.target.closest("button") || !wide()) return;
    const w = bar.closest(".win");
    focusWin(w);
    const sx = e.clientX - w.offsetLeft, sy = e.clientY - w.offsetTop;
    bar.setPointerCapture(e.pointerId);
    const move = (ev) => {
      const maxX = innerWidth - 80, maxY = innerHeight - 70;
      w.style.left = `${Math.max(-w.offsetWidth + 80, Math.min(maxX, ev.clientX - sx))}px`;
      w.style.top = `${Math.max(0, Math.min(maxY, ev.clientY - sy))}px`;
    };
    const up = () => { bar.removeEventListener("pointermove", move); bar.removeEventListener("pointerup", up); };
    bar.addEventListener("pointermove", move);
    bar.addEventListener("pointerup", up);
  });
  tasks.addEventListener("click", (e) => {
    const t = e.target.closest("[data-task]");
    if (!t) return;
    const w = layer.querySelector(`[data-win="${t.dataset.task}"]`);
    if (w) { focusWin(w); w.focus(); }
  });

  /* start menu */
  function openMenu() {
    menu.hidden = false;
    startBtn.setAttribute("aria-expanded", "true");
    menu.querySelector("button").focus();
  }
  function closeMenu(refocus = true) {
    if (menu.hidden) return;
    menu.hidden = true;
    startBtn.setAttribute("aria-expanded", "false");
    if (refocus) startBtn.focus();
  }
  startBtn.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu()));
  menu.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (b) open(b.dataset.open, startBtn);
  });
  menu.addEventListener("keydown", (e) => {
    const items = [...menu.querySelectorAll("button")];
    const i = items.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
    }
    if (e.key === "Tab") closeMenu(false);
  });
  const outside = (e) => { if (!menu.hidden && !e.target.closest("#startmenu, #start")) closeMenu(false); };
  document.addEventListener("pointerdown", outside);
  const onKey = (e) => {
    if (e.key !== "Escape") return;
    if (!menu.hidden) { e.preventDefault(); closeMenu(); return; }
    const w = document.activeElement?.closest?.(".win");
    if (w) {
      e.preventDefault();
      if (w.dataset.win.startsWith("boot-")) booting = null;
      if (w.dataset.win === "glory") picking = null;
      closeWin(w);
    }
  };
  document.addEventListener("keydown", onKey);
  ctx.cleanup(() => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", onKey); booting = null; picking = null; });

  focusWin(layer.querySelector(".win-welcome"));
}

export default {
  render: () => ({ html: html(), wire, screen: "desktop", title: "Timi Folayan | Software Engineering @ Rose-Hulman" }),
};
