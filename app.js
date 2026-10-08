const CHAPTERS = ["starters","burgers","steaks","cocktails","desserts"];
const WIFI = { net: "PLATELY-GUEST", pass: "plate1824" };
const SOCIAL = {
  google: "https://www.google.com/search?q=Plately+Warszawa+restauracja+opinie",
  instagram: "https://www.instagram.com/"
};

const state = { locale: "pl", view: "table", reel: null, idx: 0, moving: false };

const t = (loc) => (loc && (loc[state.locale] || loc.en)) || "";
const ui = () => MENU.ui[state.locale];
const money = (n) => new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 }).format(n);
const media = (p) => (p || "").replace(/^\//, "");

function products() {
  return MENU.products.filter((p) => p.available).sort((a, b) => a.sortOrder - b.sortOrder);
}
function byCat(cat) {
  return products().filter((p) => p.category === cat);
}
function reelList() {
  return CHAPTERS.flatMap(byCat);
}

function langsHtml() {
  return ["pl","en","uk"].map((l) =>
    `<button type="button" data-l="${l}" class="${state.locale===l?"on":""}">${l.toUpperCase()}</button>`
  ).join("");
}

function renderTable() {
  document.getElementById("place").textContent = `${t(MENU.restaurant.city)} · ${t(MENU.restaurant.tagline)}`;
  document.getElementById("langs").innerHTML = langsHtml();
  document.getElementById("tableNote").textContent = ui().demo;
  const items = [
    ["wifi", ui().wifi, ui().wifiHint],
    ["waiter", ui().waiter, ui().callWaiter],
    ["menu", ui().menu, ui().menuHint],
    ["socials", ui().socials, ui().socialsHint]
  ];
  document.getElementById("tableNav").innerHTML = items.map(([id, title, hint], i) => `
    <button class="opt" type="button" data-opt="${id}">
      <span class="n">0${i+1}</span>
      <span><h2>${title}</h2><p>${hint}</p></span>
      <span class="arr">→</span>
    </button>`).join("");
}

function renderMenu() {
  document.getElementById("langs2").innerHTML = langsHtml();
  document.getElementById("backTable").textContent = "← " + ui().back;
  document.getElementById("chapters").innerHTML = CHAPTERS.map((id) =>
    `<a href="#ch-${id}" data-ch="${id}">${t(MENU.categoryNames[id])}</a>`
  ).join("");
  document.getElementById("carta").innerHTML = CHAPTERS.map((id) => {
    const list = byCat(id);
    if (!list.length) return "";
    return `<section class="chapter" id="ch-${id}">
      <h3>${t(MENU.categoryNames[id])}</h3>
      ${list.map((p) => `
        <button class="row" type="button" data-open="${p.id}">
          <span class="plate-wrap">
            <span class="plate"><img src="${media(p.poster)}" alt=""></span>
            <span class="hint">${ui().tap}</span>
          </span>
          <span>
            <h4>${t(p.name)}</h4>
            <p class="desc">${t(p.description)}</p>
          </span>
          <span class="price">${money(p.price)}</span>
        </button>`).join("")}
    </section>`;
  }).join("");
}

function showView(name) {
  state.view = name;
  document.getElementById("table").classList.toggle("hidden", name !== "table");
  document.getElementById("menu").classList.toggle("hidden", name !== "menu");
}

function openSheet(kind) {
  const el = document.getElementById("sheet");
  let inner = "";
  if (kind === "wifi") {
    inner = `<div class="card">
      <h2>${ui().wifi}</h2>
      <div class="kv"><span>${ui().wifiNet}</span><b>${WIFI.net}</b></div>
      <div class="kv"><span>${ui().wifiPass}</span><b>${WIFI.pass}</b></div>
      <p class="tiny">${ui().wifiHint}</p>
      <button class="close" type="button" data-sheet-close>${ui().close}</button>
    </div>`;
  } else if (kind === "socials") {
    inner = `<div class="card">
      <h2>${ui().socials}</h2>
      <a href="${SOCIAL.google}" target="_blank" rel="noopener">${ui().googleReview}</a>
      <a href="${SOCIAL.instagram}" target="_blank" rel="noopener">${ui().instagram}</a>
      <button class="close" type="button" data-sheet-close>${ui().close}</button>
    </div>`;
  }
  el.innerHTML = inner;
  el.classList.remove("hidden");
}

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 2600);
}

function storyHTML(p, cls) {
  return `<article class="story ${cls}" data-id="${p.id}">
    ${p.video
      ? `<video src="${media(p.video)}" poster="${media(p.poster)}" autoplay muted loop playsinline></video>`
      : `<img src="${media(p.poster)}" alt="">`}
    <div class="shade"></div>
    <button class="x" type="button" data-close>×</button>
    <div class="info">
      <p class="k">${t(MENU.categoryNames[p.category])}</p>
      <h2>${t(p.name)}</h2>
      <p>${t(p.description)}</p>
      <p class="price">${money(p.price)}</p>
    </div>
  </article>`;
}

function openReel(id) {
  const list = reelList();
  const i = Math.max(0, list.findIndex((p) => p.id === id));
  state.idx = i;
  state.reel = list[i].id;
  paintStories(true);
}

function paintStories(reset) {
  const list = reelList();
  const el = document.getElementById("stories");
  const cur = list[state.idx];
  const nxt = list[(state.idx + 1) % list.length];
  const prv = list[(state.idx - 1 + list.length) % list.length];
  el.classList.remove("hidden");
  el.innerHTML = storyHTML(prv, "prv") + storyHTML(cur, "cur") + storyHTML(nxt, "nxt");
  el.querySelectorAll("video").forEach((v) => {
    v.playbackRate = 0.7;
    v.addEventListener("canplay", () => v.play().catch(() => {}));
  });
  if (reset) el.querySelector(".cur video")?.play().catch(() => {});
}

function move(dir) {
  if (state.moving || state.reel == null) return;
  const list = reelList();
  const el = document.getElementById("stories");
  const cur = el.querySelector(".cur");
  const nxt = el.querySelector(".nxt");
  const prv = el.querySelector(".prv");
  state.moving = true;
  if (dir > 0) {
    cur.style.transform = "translate3d(0,-100%,0)";
    nxt.style.transform = "translate3d(0,0,0)";
  } else {
    cur.style.transform = "translate3d(0,100%,0)";
    prv.style.transform = "translate3d(0,0,0)";
  }
  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    state.idx = (state.idx + dir + list.length) % list.length;
    state.reel = list[state.idx].id;
    state.moving = false;
    paintStories(false);
  };
  cur.addEventListener("transitionend", done, { once: true });
  setTimeout(done, 680);
}

function closeReel() {
  state.reel = null;
  document.getElementById("stories").classList.add("hidden");
  document.getElementById("stories").innerHTML = "";
}

function render() {
  renderTable();
  renderMenu();
  if (state.view === "menu") showView("menu");
  else showView("table");
}

document.addEventListener("click", (e) => {
  const l = e.target.closest("[data-l]");
  if (l) { state.locale = l.dataset.l; render(); return; }
  const opt = e.target.closest("[data-opt]");
  if (opt) {
    const k = opt.dataset.opt;
    if (k === "menu") showView("menu");
    else if (k === "wifi" || k === "socials") openSheet(k);
    else if (k === "waiter") toast(ui().waiterDone);
    return;
  }
  if (e.target.closest("[data-home]")) { showView("table"); return; }
  if (e.target.closest("[data-sheet-close]") || e.target.id === "sheet") {
    document.getElementById("sheet").classList.add("hidden");
    return;
  }
  const o = e.target.closest("[data-open]");
  if (o) { openReel(o.dataset.open); return; }
  if (e.target.closest("[data-close]")) { closeReel(); return; }
});

const carta = document.getElementById("carta");
carta.addEventListener("scroll", () => {}, { passive: true });
window.addEventListener("scroll", () => {
  const links = [...document.querySelectorAll("[data-ch]")];
  let current = CHAPTERS[0];
  for (const id of CHAPTERS) {
    const sec = document.getElementById("ch-" + id);
    if (sec && sec.getBoundingClientRect().top < 140) current = id;
  }
  links.forEach((a) => a.classList.toggle("on", a.dataset.ch === current));
}, { passive: true });

let touchY = null;
document.getElementById("stories").addEventListener("touchstart", (e) => {
  touchY = e.touches[0].clientY;
}, { passive: true });
document.getElementById("stories").addEventListener("touchend", (e) => {
  if (touchY == null || state.reel == null) return;
  const dy = e.changedTouches[0].clientY - touchY;
  if (dy < -56) move(1);
  if (dy > 56) move(-1);
  touchY = null;
});

window.addEventListener("keydown", (e) => {
  if (state.reel == null) return;
  if (e.key === "Escape") closeReel();
  if (e.key === "ArrowDown" || e.key === "ArrowRight") move(1);
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") move(-1);
});
let wheelLock = 0;
window.addEventListener("wheel", (e) => {
  if (state.reel == null || Math.abs(e.deltaY) < 28) return;
  const now = Date.now();
  if (now - wheelLock < 620) return;
  wheelLock = now;
  move(e.deltaY > 0 ? 1 : -1);
}, { passive: true });

if (location.hash === "#menu") state.view = "menu";
render();
