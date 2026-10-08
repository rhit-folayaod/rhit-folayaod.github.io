// Bits every theme uses. Content itself lives in data.js only.
import { links, experience, projects, currentProjects, earlierProjects } from "./data.js";
export { currentProjects, earlierProjects };

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
export const ext = 'target="_blank" rel="noopener"';

export const DISCLAIMER =
  "Fan-made tribute. Not affiliated with or endorsed by Nintendo, Sega, Epic Games, Re-Logic, Mojang, Microsoft, Roblox Corporation, Supercell, or Capcom.";
export const disclaimer = (cls = "") => `<p class="disclaimer ${cls}">${DISCLAIMER}</p>`;

// The games on the desktop. `name` is what shows on screen; `style` is the
// most a tooltip says about what it is a tribute to.
export const THEMES = [
  { id: "mario", name: "Super Plumber Bros.", style: "Mario-style", icon: "qblock" },
  { id: "terraria", name: "Dig & Build", style: "Terraria-style", icon: "tree" },
  { id: "minecraft", name: "Block Craft", style: "Minecraft-style", icon: "grass" },
  { id: "sonic", name: "Blue Blur Zone", style: "Sonic-style", icon: "ring" },
  { id: "fortnite", name: "Battle Royale Lobby", style: "Fortnite-style", icon: "crate" },
  { id: "roblox", name: "Brick Hub", style: "Roblox-style", icon: "brick" },
  { id: "clash", name: "Village Clash", style: "Clash of Clans-style", icon: "townhall" },
  { id: "fighter", name: "Arcade Clash", style: "Street Fighter-style", icon: "joystick" },
];
export const themeById = (id) => THEMES.find((t) => t.id === id);

export const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
];

export const contactLinks = [
  { id: "resume", label: "Resume", href: links.resume, external: true },
  { id: "github", label: "GitHub", href: links.github, external: true },
  { id: "linkedin", label: "LinkedIn", href: links.linkedin, external: true },
  { id: "email", label: "Email", href: `mailto:${links.email}`, external: false },
];
export const linkAttrs = (l) => (l.external ? ext : "");

// Where a skill shows up in the experience and project data.
export const usedIn = (skill) => [
  ...experience.filter((e) => e.tags.includes(skill)).map((e) => e.org),
  ...projects.filter((p) => p.tags.includes(skill)).map((p) => p.name),
];

// What to say when a project has no public repo.
export const noSource = (p) => (p.status === "earlier" ? "No public repo." : "Source is private.");
// A divider before the first course/earlier project in a list ("" otherwise).
export const groupStart = (p, cls) => (p.id === earlierProjects[0]?.id ? `<li class="${cls}" aria-hidden="true">Course &amp; earlier projects</li>` : "");

// Link to a related project inside the same theme ("" when there isn't one).
export const relatedProject = (p) => (p.related ? projects.find((x) => x.id === p.related) : null);

// Projects keep a selection without re-rendering the whole screen; the URL
// follows along so a selected project can be linked to.
export function setSubPath(hash) {
  if (location.hash !== hash) history.replaceState(null, "", hash);
}

export const prefersReducedMotion = () =>
  (localStorage.getItem("tf.motion") || (matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full")) === "reduced";
