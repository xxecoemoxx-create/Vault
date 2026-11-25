// ENDLING surface — listening room, comfort controls, reveal motion.
// Progressive: with JS off the page still reads; the player shows its first
// track server-rendered in the markup.

import { TRACKS } from "./tracks.js";

const $ = (sel) => document.querySelector(sel);

/* ── listening room ─────────────────────────────────────────────────────── */

const titleEl = $("#track-title");
const lyricsEl = $("#lyrics-box");
const listEl = $("#tracklist");
const statusEl = $("#player-status");

let index = 0;
let audio = null;

const plain = (title) => title.replace(/^\d+\.\s*/, "");

function renderList() {
  if (!listEl) return;
  listEl.innerHTML = "";
  TRACKS.forEach((track, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML =
      `<span class="n">0${i + 1}</span>` +
      `<span class="t">${plain(track.title)}</span>` +
      `<span class="d">${track.audioUrl ? "Master" : "Lyrics"}</span>`;
    btn.addEventListener("click", () => select(i));
    li.appendChild(btn);
    listEl.appendChild(li);
  });
}

function select(i, announce) {
  if (i < 0 || i >= TRACKS.length) return;
  index = i;
  const track = TRACKS[i];

  if (titleEl) titleEl.textContent = track.title;
  if (lyricsEl) {
    lyricsEl.textContent = track.lyrics;
    lyricsEl.scrollTop = 0;
  }

  if (listEl) {
    Array.from(listEl.querySelectorAll("button")).forEach((btn, j) => {
      btn.setAttribute("aria-current", j === i ? "true" : "false");
    });
  }

  if (audio) {
    audio.pause();
    audio = null;
  }

  if (statusEl) {
    statusEl.textContent = track.audioUrl
      ? "Master ready — press play."
      : "Masters still in the kiln. Read along below.";
  }

  if (announce) document.title = `ENDLING — ${plain(track.title)}`;
}

function toggle() {
  const track = TRACKS[index];
  if (!track.audioUrl) {
    if (statusEl) {
      statusEl.textContent =
        "No master for this movement yet — the lyrics are the recording for now.";
    }
    return;
  }
  if (!audio) {
    audio = new Audio(track.audioUrl);
    audio.addEventListener("ended", () => next());
  }
  if (audio.paused) {
    audio.play().then(() => {
      if (statusEl) statusEl.textContent = "Playing.";
    }).catch(() => {
      if (statusEl) statusEl.textContent = "Playback blocked by the browser — press play again.";
    });
  } else {
    audio.pause();
    if (statusEl) statusEl.textContent = "Paused.";
  }
}

function next() {
  select(index + 1 >= TRACKS.length ? 0 : index + 1, true);
}

function prev() {
  select(index - 1 < 0 ? TRACKS.length - 1 : index - 1, true);
}

document.addEventListener("click", (event) => {
  const act = event.target.closest("[data-act]");
  if (!act) return;
  const action = act.getAttribute("data-act");
  if (action === "next") next();
  if (action === "prev") prev();
  if (action === "toggle") toggle();
});

/* ── comfort mode ───────────────────────────────────────────────────────── */

const comfortBtn = $("#comfort");
const STORE_KEY = "ee-comfort";

function setComfort(on) {
  document.documentElement.setAttribute("data-comfort", on ? "on" : "off");
  if (comfortBtn) {
    comfortBtn.setAttribute("aria-pressed", on ? "true" : "false");
    comfortBtn.setAttribute(
      "title",
      on ? "Calm mode on — motion paused" : "Calm mode off — full motion"
    );
  }
}

let stored = null;
try {
  stored = window.localStorage.getItem(STORE_KEY);
} catch (error) {
  stored = null;
}

const prefersCalm =
  stored === null &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

setComfort(stored === "on" || Boolean(prefersCalm));

if (comfortBtn) {
  comfortBtn.addEventListener("click", () => {
    const on = document.documentElement.getAttribute("data-comfort") !== "on";
    setComfort(on);
    try {
      window.localStorage.setItem(STORE_KEY, on ? "on" : "off");
    } catch (error) {
      /* private mode — the toggle still works for this visit */
    }
  });
}

/* ── reveal on scroll ──────────────────────────────────────────────────── */

const calmNow = () => document.documentElement.getAttribute("data-comfort") === "on";

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    if (calmNow()) el.classList.add("in");
    else io.observe(el);
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
}

/* ── misc ──────────────────────────────────────────────────────────────── */

const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

renderList();

/* Return visits resume where the listener stopped. */
let lastPlayed = 0;
try {
  lastPlayed = Number(window.localStorage.getItem("ee-track")) || 0;
} catch (error) {
  lastPlayed = 0;
}
select(lastPlayed >= 0 && lastPlayed < TRACKS.length ? lastPlayed : 0);

document.addEventListener("click", (event) => {
  if (!event.target.closest(".tracklist button, [data-act]")) return;
  try {
    window.localStorage.setItem("ee-track", String(index));
  } catch (error) {
    /* private mode — session only */
  }
});
