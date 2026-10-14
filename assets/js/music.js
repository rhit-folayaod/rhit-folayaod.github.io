// Background music: an original ambient loop synthesized live with WebAudio.
// No audio files, no samples, nothing borrowed (see assets/audio/LICENSE.md).
// Off by default. It only starts after the visitor turns it on, and the choice
// is remembered in localStorage. Browsers require a user gesture, so a saved
// "on" waits for the first click/tap/key before making any sound.
const KEY = "tf-music";
const VOLUME = 0.05; // quiet on purpose
let ctx = null, master = null, timer = null, nextAt = 0, step = 0;
let on = false;
try { on = localStorage.getItem(KEY) === "on"; } catch (_) { /* private mode */ }

// C major pentatonic, two slow chords and a soft music-box line over them.
const CHORDS = [[48, 55, 64], [45, 52, 60], [41, 48, 57], [43, 50, 59]];
const LINE = [72, 0, 76, 79, 0, 76, 74, 0, 69, 0, 72, 74, 0, 76, 0, 0];
const BEAT = 0.5; // seconds per step (120 bpm eighths, slow feel)
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function note(freq, t, len, type, gain) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + Math.min(0.4, len / 3));
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  o.connect(g); g.connect(master);
  o.start(t); o.stop(t + len + 0.05);
}
function schedule() {
  while (nextAt < ctx.currentTime + 1.2) {
    const bar = Math.floor(step / 16) % CHORDS.length, s = step % 16;
    if (s === 0) CHORDS[bar].forEach((m) => note(hz(m), nextAt, BEAT * 16, "sine", 0.18));
    const m = LINE[s];
    if (m) note(hz(m), nextAt, BEAT * 3, "triangle", 0.12);
    nextAt += BEAT; step++;
  }
}
function start() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = VOLUME;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
    master.connect(lp); lp.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  if (!timer) { nextAt = ctx.currentTime + 0.1; timer = setInterval(schedule, 250); schedule(); }
}
function stop() {
  if (timer) { clearInterval(timer); timer = null; }
  if (ctx) ctx.suspend();
}
function set(v) {
  on = v;
  try { localStorage.setItem(KEY, v ? "on" : "off"); } catch (_) { /* ignore */ }
  v ? start() : stop();
  sync();
}
export function sync() {
  document.querySelectorAll("[data-sound]").forEach((b) => {
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? "Mute music" : "Play music");
    b.title = on ? "Music on (click to mute)" : "Music off (click to play)";
    b.classList.toggle("is-on", on);
  });
}
export function init() {
  const fab = document.createElement("button");
  fab.type = "button"; fab.className = "sound-fab"; fab.setAttribute("data-sound", "");
  fab.innerHTML = '<span class="snd-ico" aria-hidden="true"></span>';
  document.body.appendChild(fab);
  document.addEventListener("click", (e) => {
    const b = e.target.closest && e.target.closest("[data-sound]");
    if (b) { e.preventDefault(); set(!on); }
  });
  if (on) {
    // saved "on": wait for the first gesture, never autoplay
    const go = (e) => {
      if (e.target.closest && e.target.closest("[data-sound]")) return; // the toggle handles itself
      if (on) start();
      ["pointerdown", "keydown"].forEach((t) => document.removeEventListener(t, go, true));
    };
    ["pointerdown", "keydown"].forEach((t) => document.addEventListener(t, go, true));
  }
  sync();
}
