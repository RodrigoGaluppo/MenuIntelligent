const NAV = ["all","popular","starters","burgers","grill","steaks","seafood","sides","desserts","cocktails","zero","soft"];

const state = { locale: "pl", cat: "all", q: "", reel: null, paused: false, fav: {} };

const t = (loc) => (loc && (loc[state.locale] || loc.en)) || "";
const money = (n) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(n);
const media = (p) => (p || "").replace(/^\//, "");

function products() {
  return MENU.products
    .filter((p) => p.available)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function visible() {
  const q = state.q.trim().toLowerCase();
  return products().filter((p) => {
    const hay = `${t(p.name)} ${t(p.description)}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (state.cat === "all") return true;
    if (state.cat === "popular") return p.featured;
    return p.category === state.cat;
  });
}

function render() {
  const ui = MENU.ui[state.locale];
  document.getElementById("tagline").textContent = t(MENU.restaurant.tagline);
  document.getElementById("search").placeholder = ui.search;
  document.getElementById("foot").textContent = ui.demo;

  document.getElementById("langs").innerHTML = ["pl","en","uk"].map((l) =>
    `<button type="button" data-l="${l}" class="${state.locale===l?"on":""}">${l.toUpperCase()}</button>`
  ).join("");

  document.getElementById("cats").innerHTML = NAV.map((id) =>
    `<button type="button" data-cat="${id}" class="${state.cat===id?"on":""}">${t(MENU.categoryNames[id])}</button>`
  ).join("");

  const hero = products().find((p) => p.id === "ember-burger") || products()[0];
  document.getElementById("hero").innerHTML = `
    <div class="hero-media">
      ${hero.video
        ? `<video src="${media(hero.video)}" poster="${media(hero.poster)}" autoplay muted loop playsinline></video>`
        : `<img src="${media(hero.poster)}" alt="">`}
    </div>
    <div class="hero-copy">
      <p class="kicker">${t(MENU.restaurant.city)}</p>
      <h1>${t(hero.name)}</h1>
      <p>${t(hero.description)}</p>
      <div class="row">
        <span class="price">${money(hero.price)}</span>
        <button class="btn" data-open="${hero.id}">${ui.watchDish}</button>
      </div>
    </div>`;

  const list = visible();
  document.getElementById("grid").innerHTML = list.length
    ? list.map((p) => `
      <button class="card" type="button" data-open="${p.id}">
        <div class="pic">
          <img src="${media(p.poster)}" alt="${t(p.name)}" loading="lazy">
          <span class="spin">▶ Spin</span>
        </div>
        <div class="meta">
          <p class="cat">${t(MENU.categoryNames[p.category])}</p>
          <h3>${t(p.name)}</h3>
          <p class="desc">${t(p.description)}</p>
          <span class="price">${money(p.price)}</span>
        </div>
      </button>`).join("")
    : `<p class="foot">${ui.empty}</p>`;

  renderReel();
}

function renderReel() {
  const el = document.getElementById("reel");
  const list = visible().length ? visible() : products();
  if (state.reel == null) { el.classList.add("hidden"); el.innerHTML = ""; return; }
  const i = Math.max(0, list.findIndex((p) => p.id === state.reel));
  const p = list[i] || list[0];
  const next = list[(i + 1) % list.length];
  const ui = MENU.ui[state.locale];
  el.classList.remove("hidden");
  el.innerHTML = `
    ${p.video
      ? `<video id="reelVid" src="${media(p.video)}" poster="${media(p.poster)}" autoplay muted loop playsinline></video>`
      : `<img src="${media(p.poster)}" alt="">`}
    ${next?.video ? `<link rel="preload" as="video" href="${media(next.video)}">` : ""}
    <div class="shade"></div>
    <div class="brand">ORZA</div>
    <button class="x" type="button" data-close>${ui.close}</button>
    <div class="info">
      <p class="kicker">${t(MENU.categoryNames[p.category])}</p>
      <h2>${t(p.name)}</h2>
      <p class="sub">${state.locale === "pl" ? p.name.en : p.name.pl}</p>
      <p>${t(p.description)}</p>
      <p class="price">${money(p.price)}</p>
      <p class="tiny">${ui.ingredients}: ${t(p.ingredients)}</p>
      <p class="tiny">${ui.allergens}: ${t(p.allergens)}</p>
    </div>
    <div class="side">
      <button type="button" data-fav>${state.fav[p.id] ? "♥" : "♡"}</button>
      <button type="button" data-pause>${state.paused ? "▶" : "❚❚"}</button>
      <button type="button" data-share>SH</button>
    </div>`;
  const v = document.getElementById("reelVid");
  if (v) {
    v.addEventListener("canplay", () => v.play().catch(() => {}));
    if (state.paused) v.pause();
  }
}

function move(dir) {
  const list = visible().length ? visible() : products();
  const i = Math.max(0, list.findIndex((p) => p.id === state.reel));
  state.reel = list[(i + dir + list.length) % list.length].id;
  state.paused = false;
  renderReel();
}

document.addEventListener("click", (e) => {
  const l = e.target.closest("[data-l]");
  if (l) { state.locale = l.dataset.l; render(); return; }
  const c = e.target.closest("[data-cat]");
  if (c) { state.cat = c.dataset.cat; render(); return; }
  const o = e.target.closest("[data-open]");
  if (o) { state.reel = o.dataset.open; state.paused = false; renderReel(); return; }
  if (e.target.closest("[data-close]")) { state.reel = null; renderReel(); return; }
  if (e.target.closest("[data-fav]") && state.reel) {
    state.fav[state.reel] = !state.fav[state.reel]; renderReel(); return;
  }
  if (e.target.closest("[data-pause]")) {
    state.paused = !state.paused;
    const v = document.getElementById("reelVid");
    if (v) state.paused ? v.pause() : v.play().catch(() => {});
    renderReel(); return;
  }
  if (e.target.closest("[data-share]")) {
    navigator.clipboard?.writeText(location.href); return;
  }
});

document.getElementById("search").addEventListener("input", (e) => {
  state.q = e.target.value; render();
});

let touchY = null;
document.getElementById("reel").addEventListener("touchstart", (e) => { touchY = e.touches[0].clientY; }, { passive: true });
document.getElementById("reel").addEventListener("touchend", (e) => {
  if (touchY == null || state.reel == null) return;
  const dy = e.changedTouches[0].clientY - touchY;
  if (dy < -48) move(1);
  if (dy > 48) move(-1);
  touchY = null;
});

window.addEventListener("keydown", (e) => {
  if (state.reel == null) return;
  if (e.key === "Escape") { state.reel = null; renderReel(); }
  if (e.key === "ArrowDown" || e.key === "ArrowRight") move(1);
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(-1);
});
let wheelLock = 0;
window.addEventListener("wheel", (e) => {
  if (state.reel == null || Math.abs(e.deltaY) < 40) return;
  const now = Date.now();
  if (now - wheelLock < 450) return;
  wheelLock = now;
  move(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

render();
