// Gyaan Arena app: accounts, quizzes, progress, games, shop and leaderboard.
(function () {
  const C = window.GA_CONTENT;
  const { SKILLS, GRADES, SUBJECTS, R } = C;
  const SKILL = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const gname = (g) => (g === 11 ? "College" : "Grade " + g);
  const subjName = (id) => SUBJECTS.find((s) => s.id === id).n;
  const dayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  // ---------- Storage (browser) ----------
  const mem = {};
  const store = {
    ok: true,
    get(k) { try { const v = localStorage.getItem(k); return v == null ? mem[k] ?? null : JSON.parse(v); } catch (e) { this.ok = false; return mem[k] ?? null; } },
    set(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { this.ok = false; } },
  };
  let accounts = store.get("ga.accounts") || {};
  let me = null;
  function save() {
    if (!me) return;
    accounts[me.key] = me;
    store.set("ga.accounts", accounts);
  }

  // ---------- Shop ----------
  const SHOP = [
    { id: "hat-cap", cat: "hat", name: "Cricket cap", e: "🧢", price: 40 },
    { id: "hat-bow", cat: "hat", name: "Ribbon bow", e: "🎀", price: 50 },
    { id: "hat-top", cat: "hat", name: "Top hat", e: "🎩", price: 90 },
    { id: "hat-grad", cat: "hat", name: "Graduation cap", e: "🎓", price: 150 },
    { id: "hat-crown", cat: "hat", name: "Crown", e: "👑", price: 400 },
    { id: "eye-spec", cat: "eyes", name: "Reading glasses", e: "👓", price: 45 },
    { id: "eye-sun", cat: "eyes", name: "Sunglasses", e: "🕶️", price: 70 },
    { id: "eye-gog", cat: "eyes", name: "Lab goggles", e: "🥽", price: 120 },
    { id: "pet-cat", cat: "pet", name: "Kitten", e: "🐱", price: 150 },
    { id: "pet-dog", cat: "pet", name: "Puppy", e: "🐶", price: 150 },
    { id: "pet-turtle", cat: "pet", name: "Turtle", e: "🐢", price: 180 },
    { id: "pet-parrot", cat: "pet", name: "Parrot", e: "🦜", price: 220 },
    { id: "pet-unicorn", cat: "pet", name: "Unicorn", e: "🦄", price: 500 },
    { id: "pet-dragon", cat: "pet", name: "Dragon", e: "🐉", price: 650 },
    { id: "bg-mint", cat: "bg", name: "Mint", c: ["#c6f0dc", "#8fdcb8"], price: 30 },
    { id: "bg-sky", cat: "bg", name: "Sky", c: ["#cfe6ff", "#86b8f5"], price: 30 },
    { id: "bg-rose", cat: "bg", name: "Rose", c: ["#ffd9e2", "#f59ab3"], price: 30 },
    { id: "bg-saffron", cat: "bg", name: "Saffron", c: ["#ffd9a8", "#ff9a3c"], price: 80 },
    { id: "bg-sunset", cat: "bg", name: "Sunset", c: ["#ffb36b", "#d9487a"], price: 160 },
    { id: "bg-galaxy", cat: "bg", name: "Galaxy", c: ["#3b3fa8", "#140f33"], price: 300 },
    { id: "fr-silver", cat: "frame", name: "Silver ring", c: "#a9b4c4", price: 120 },
    { id: "fr-gold", cat: "frame", name: "Gold ring", c: "#e2a52b", price: 260 },
    { id: "fr-emerald", cat: "frame", name: "Emerald ring", c: "#18a06b", price: 350 },
  ];
  const SHOP_BY_ID = Object.fromEntries(SHOP.map((s) => [s.id, s]));
  const CATS = [["hat", "Hats"], ["eyes", "Glasses"], ["pet", "Pets"], ["bg", "Backgrounds"], ["frame", "Frames"]];
  const SKINS = ["#f1c9a5", "#e0a370", "#c68642", "#8d5524"];
  const SHIRTS = ["#2457d6", "#c84f26", "#12846a", "#7a3fb0", "#e0a400"];

  let avN = 0;
  const PHOTO_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/;
  function avatar(p, size = 56) {
    const id = "av" + ++avN;
    const look = p.look || { skin: SKINS[1], shirt: SHIRTS[0] };
    const eq = p.eq || {};
    const bg = SHOP_BY_ID[eq.bg]?.c || ["#ffe9a8", "#ffd23f"];
    const frame = SHOP_BY_ID[eq.frame]?.c;
    const hat = SHOP_BY_ID[eq.hat]?.e, eyes = SHOP_BY_ID[eq.eyes]?.e, pet = SHOP_BY_ID[eq.pet]?.e;
    const safe = (c) => (/^#[0-9a-f]{6}$/i.test(c) ? c : "#888888");
    const photo = typeof p.photo === "string" && PHOTO_RE.test(p.photo) ? p.photo : null;
    const face = photo
      ? `<image href="${photo}" x="4" y="4" width="92" height="92" preserveAspectRatio="xMidYMid slice"/>`
      : `<path d="M14 104 Q16 74 50 72 Q84 74 86 104 Z" fill="${safe(look.shirt)}"/>
        <circle cx="50" cy="48" r="23" fill="${safe(look.skin)}"/>
        <path d="M27 45 Q29 22 50 22 Q72 22 73 45 Q65 34 50 33 Q35 33 27 45Z" fill="#2a1d14"/>
        <circle cx="41.5" cy="49" r="2.8" fill="#1d1d1d"/><circle cx="58.5" cy="49" r="2.8" fill="#1d1d1d"/>
        <path d="M42 58 Q50 65 58 58" stroke="#1d1d1d" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="${esc(p.name || "Player")}'s avatar" style="flex:none">
      <defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient><clipPath id="${id}c"><circle cx="50" cy="50" r="46"/></clipPath></defs>
      <circle cx="50" cy="50" r="46" fill="url(#${id}g)"/>
      <g clip-path="url(#${id}c)">${face}</g>
      ${frame ? `<circle cx="50" cy="50" r="46" fill="none" stroke="${frame}" stroke-width="5"/>` : ""}
      ${eyes && !photo ? `<text x="50" y="58" font-size="25" text-anchor="middle">${eyes}</text>` : ""}
      ${hat ? `<text x="50" y="31" font-size="30" text-anchor="middle">${hat}</text>` : ""}
      ${pet ? `<text x="83" y="97" font-size="28" text-anchor="middle">${pet}</text>` : ""}
    </svg>`;
  }

  // ---------- Progress rules ----------
  const level = (xp) => Math.floor(Math.sqrt(xp / 40)) + 1;
  const lvlXp = (L) => 40 * (L - 1) ** 2;
  function sk(id) { return me.skills[id] || (me.skills[id] = { a: 0, c: 0, h: [] }); }
  function recentAcc(id) { const s = me.skills[id]; if (!s || !s.h.length) return null; return s.h.reduce((a, b) => a + b, 0) / s.h.length; }
  function stars(id, p = me) {
    const s = p.skills[id];
    if (!s || s.a < 5) return 0;
    const acc = s.h.reduce((a, b) => a + b, 0) / s.h.length;
    if (acc >= 0.9 && s.a >= 10) return 3;
    if (acc >= 0.75) return 2;
    if (acc >= 0.5) return 1;
    return 0;
  }
  const starHtml = (n) => `<span class="stars" aria-label="${n} of 3 stars">${[1, 2, 3].map((i) => `<span class="${i <= n ? "on" : ""}">★</span>`).join("")}</span>`;
  function gradeProgress(g) {
    const list = SKILLS.filter((s) => s.g === g);
    const done = list.filter((s) => stars(s.id) >= 2).length;
    return { list, done, need: Math.ceil(list.length * 0.5), total: list.length };
  }
  function checkGradeUp() {
    const g = me.maxGrade;
    if (g >= 11) return null;
    const p = gradeProgress(g);
    if (p.done < p.need) return null;
    me.maxGrade = GRADES[GRADES.indexOf(g) + 1];
    me.coins += 100;
    return me.maxGrade;
  }
  function bumpStreak() {
    const t = dayStr();
    if (me.streak.last === t) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    me.streak.days = me.streak.last === dayStr(y) ? me.streak.days + 1 : 1;
    me.streak.last = t;
  }
  const mastered = (p = me, subj) => SKILLS.filter((s) => (!subj || s.s === subj) && stars(s.id, p) >= 2).length;
  const BADGES = [
    ["First Steps", "Answer your first question", (p) => p.stats.answered >= 1],
    ["Sharp Shooter", "Finish a quiz with every answer right", (p) => p.stats.perfect >= 1],
    ["Explorer", "Practise all four subjects", (p) => SUBJECTS.every((s) => SKILLS.some((k) => k.s === s.id && p.skills[k.id]))],
    ["Math Wizard", "Reach 2★ in 8 maths skills", (p) => mastered(p, "math") >= 8],
    ["Bookworm", "Reach 2★ in 5 English skills", (p) => mastered(p, "eng") >= 5],
    ["Quiz Master", "Reach 2★ in 5 GK skills", (p) => mastered(p, "gk") >= 5],
    ["Grade Climber", "Unlock a new grade", (p) => p.maxGrade > p.startGrade],
    ["24 Champion", "Solve 10 Make 24 puzzles", (p) => p.games.m24 >= 10],
    ["Speedster", "Score 25 in Speed Sprint", (p) => p.games.sprint >= 25],
    ["On Fire", "Play 3 days in a row", (p) => p.streak.days >= 3],
    ["Collector", "Own 5 accessories", (p) => p.owned.length >= 5],
    ["Mistake Fixer", "Watch 5 fix-it lessons", (p) => (p.stats.lessons || 0) >= 5],
  ];
  // Older saved players predate some fields.
  function normalize(p) {
    p.mistakes = Array.isArray(p.mistakes) ? p.mistakes : [];
    p.stats.lessons = p.stats.lessons || 0;
    return p;
  }

  function newPlayer(name, pinHash, grade, look) {
    return {
      name, key: name.toLowerCase(), pinHash, startGrade: grade, maxGrade: grade, look,
      coins: 50, xp: 0, owned: [], eq: {}, skills: {},
      games: { sprint: 0, m24: 0, scramble: 0, flash: 0 },
      stats: { answered: 0, correct: 0, quizzes: 0, perfect: 0 },
      streak: { days: 0, last: null }, daily: null, created: Date.now(), mistakes: [],
    };
  }
  function demoPlayer() {
    const p = newPlayer("Demo", "", 7, { skin: SKINS[2], shirt: SHIRTS[1] });
    p.demo = true; p.coins = 320; p.xp = 560; p.owned = ["hat-cap", "pet-dog", "bg-sky"]; p.eq = { hat: "hat-cap", pet: "pet-dog", bg: "bg-sky" };
    const seed = { "m6-hcf": 9, "m6-int": 10, "m6-frac": 7, "m6-dec": 9, "m6-mens": 8, "s6-food": 9, "s6-sep": 8, "e6-art": 8, "e6-syn": 9, "g6-india": 10, "m7-int": 8, "m7-eq": 6, "s7-nutri": 9, "e7-tense": 5, "g7-sport": 7 };
    for (const [id, c] of Object.entries(seed)) p.skills[id] = { a: 10, c, h: Array.from({ length: 10 }, (_, i) => (i < c ? 1 : 0)) };
    p.stats = { answered: 150, correct: 122, quizzes: 18, perfect: 3 };
    p.games = { sprint: 21, m24: 4, scramble: 6, flash: 14 };
    p.streak = { days: 2, last: dayStr() };
    const ago = (h) => Date.now() - h * 3600e3;
    p.mistakes = [
      { id: "d1", sid: "m7-eq", q: "Solve for x: 4x + 7 = 31", a: "6", chosen: "9.5", t: ago(2) },
      { id: "d2", sid: "e7-tense", q: "I ___ my homework already.", a: "have finished", chosen: "finished have", t: ago(5) },
      { id: "d3", sid: "s7-acid", q: "Turmeric paper with a base turns…", a: "Red", chosen: "Yellow", t: ago(26) },
    ];
    return p;
  }

  async function hashPin(key, pin) {
    const txt = "gyaan-arena:" + key + ":" + pin;
    try {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
      return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      let h = 5381; for (const c of txt) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
      return "x" + (h >>> 0).toString(16);
    }
  }

  // ---------- Shared leaderboard + cloud backup (claude.ai db capability) ----------
  const remote = { db: null, uid: null, on: false, board: [], ro: false, chain: Promise.resolve(), sample: null };
  async function initRemote() {
    if (window.claude && typeof window.claude.use === "function") {
      window.claude.use("sample").then((s) => { remote.sample = s; if (view === "lesson") render(); }).catch(() => {});
    }
    try {
      if (!window.claude || typeof window.claude.use !== "function") return;
      const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      if (!db) return;
      remote.db = db;
      try { remote.uid = user ? await user.id() : null; } catch (e) { remote.uid = null; }
      remote.on = true;
      db.collection("leaderboard").limit(500).onSnapshot((snap) => {
        const rows = [];
        snap.docs.forEach((d) => {
          const ps = (d.data() || {}).players || {};
          for (const k in ps) {
            const p = ps[k];
            if (p && typeof p.name === "string" && Number.isFinite(p.xp)) rows.push({ ...p, owner: d.id, key: k });
          }
        });
        remote.board = rows;
        if (view === "board") render();
      }, () => { remote.on = false; if (view === "board") render(); });
      if (me) pushRemote();
      if (view === "board") render();
    } catch (e) { remote.on = false; }
  }
  function pushRemote() {
    if (!remote.db || !remote.uid || !me || me.demo || remote.ro) return;
    const db = remote.db, uid = remote.uid, p = me;
    const entry = { name: p.name, xp: p.xp, coins: p.coins, grade: p.maxGrade, look: p.look, eq: p.eq, updated: Date.now() };
    const snapshot = JSON.parse(JSON.stringify(p));
    remote.chain = remote.chain.then(async () => {
      const ref = db.doc("leaderboard/" + uid);
      try { await ref.update({ players: { [p.key]: entry } }); }
      catch (e) {
        if (e && e.code !== "invalid_argument") return;
        try { await ref.set({ players: { [p.key]: entry } }); } catch (e2) { remote.ro = true; return; }
      }
      try { await db.collection("data/users/" + uid).doc(p.key).set(snapshot); } catch (e) { /* backup is best-effort */ }
    }).catch(() => {});
  }
  async function fetchRemotePlayer(key) {
    if (!remote.db || !remote.uid) return null;
    try { const s = await remote.db.collection("data/users/" + remote.uid).doc(key).get(); return s.exists ? s.data() : null; } catch (e) { return null; }
  }

  // ---------- View state ----------
  let view = "login";
  const ui = { subject: "math", grade: null, boardTab: "device", shopCat: "hat", loginTab: "new", progGrade: null, su: { grade: 6, skin: SKINS[1], shirt: SHIRTS[0] } };
  let quiz = null, game = null, timers = [];
  const clearTimers = () => { timers.forEach(clearInterval); timers = []; };
  function go(v) { clearTimers(); hush(); view = v; render(); window.scrollTo(0, 0); }
  let toastT;
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (t.hidden = true), 2600); }

  const NAV = [["home", "Home", "⌂"], ["learn", "Learn", "✎"], ["games", "Games", "◆"], ["shop", "Shop", "✦"], ["board", "Leaderboard", "♛"], ["progress", "Progress", "▤"]];
  const navOf = (v) => (v === "quiz" || v === "lesson" ? "learn" : v === "mistakes" ? "progress" : v.startsWith("game-") ? "games" : v);

  function render() {
    if (!me) view = "login";
    const top = $("#top"), tab = $("#tabbar");
    top.hidden = tab.hidden = !me;
    if (me) {
      const cur = navOf(view);
      $("#nav").innerHTML = NAV.map(([v, n]) => `<button data-act="go" data-v="${v}" ${cur === v ? 'aria-current="page"' : ""}>${n}</button>`).join("");
      tab.innerHTML = NAV.map(([v, n, i]) => `<button data-act="go" data-v="${v}" ${cur === v ? 'aria-current="page"' : ""}><span class="ti" aria-hidden="true">${i}</span>${n === "Leaderboard" ? "Ranks" : n}</button>`).join("");
      $("#topRight").innerHTML = `<span class="coins" title="Coins"><i class="coin"></i><span class="num">${me.coins}</span></span>
        <button class="me-btn" data-act="go" data-v="progress" aria-label="Your profile">${avatar(me, 40)}</button>`;
    }
    const V = { login: vLogin, home: vHome, learn: vLearn, quiz: vQuiz, games: vGames, shop: vShop, board: vBoard, progress: vProgress, lesson: vLesson, mistakes: vMistakes, "game-sprint": vSprint, "game-m24": v24, "game-scramble": vScramble, "game-flash": vFlash };
    $("#app").innerHTML = (V[view] || vHome)();
  }

  // ---------- Login ----------
  function vLogin() {
    const locals = Object.values(accounts).sort((a, b) => b.xp - a.xp);
    const su = ui.su;
    const samples = [
      { name: "a", look: { skin: SKINS[0], shirt: SHIRTS[2] }, eq: { hat: "hat-grad", bg: "bg-mint" } },
      { name: "b", look: { skin: SKINS[2], shirt: SHIRTS[1] }, eq: { eyes: "eye-sun", pet: "pet-parrot", bg: "bg-sunset" } },
      { name: "c", look: { skin: SKINS[3], shirt: SHIRTS[3] }, eq: { hat: "hat-crown", bg: "bg-galaxy", frame: "fr-gold" } },
    ];
    const form = ui.loginTab === "new"
      ? `<form class="stack" data-form="signup" autocomplete="off">
          <div class="row" style="gap:16px;align-items:flex-start">
            <div id="suPreview">${avatar({ name: "New player", look: { skin: su.skin, shirt: su.shirt }, photo: su.photo }, 88)}</div>
            <div class="stack" style="flex:1;min-width:180px;gap:10px">
              <div><div class="label">Skin tone</div><div class="swatches" data-group="skin">${SKINS.map((c) => `<button type="button" class="swatch" style="background:${c}" data-act="su" data-k="skin" data-val="${c}" aria-label="Skin tone" aria-pressed="${su.skin === c}"></button>`).join("")}</div></div>
              <div><label class="btn btn-ghost" for="suPhotoIn" id="suPhotoLabel" style="padding-inline:0">${su.photo ? "Change photo" : "Or add your own photo"}</label><input id="suPhotoIn" type="file" accept="image/*" hidden></div>
              <div><div class="label">Shirt colour</div><div class="swatches" data-group="shirt">${SHIRTS.map((c) => `<button type="button" class="swatch" style="background:${c}" data-act="su" data-k="shirt" data-val="${c}" aria-label="Shirt colour" aria-pressed="${su.shirt === c}"></button>`).join("")}</div></div>
            </div>
          </div>
          <label class="field"><span class="label">Player name</span><input id="suName" maxlength="16" placeholder="e.g. Dhruvan" autocomplete="off"></label>
          <label class="field"><span class="label">4-digit PIN</span><input id="suPin" type="password" inputmode="numeric" maxlength="4" placeholder="••••" autocomplete="new-password"></label>
          <div class="field"><span class="label">Which class are you in?</span>
            <div class="row" style="gap:6px" data-group="grade">${GRADES.map((g) => `<button type="button" class="chip" data-act="su" data-k="grade" data-val="${g}" aria-pressed="${su.grade === g}">${g === 11 ? "College" : g}</button>`).join("")}</div>
            <span class="small muted">You can practise your class and everything below it. Higher grades unlock as you master skills.</span></div>
          <p class="err" id="loginErr"></p>
          <button class="btn btn-primary btn-lg" type="submit">Create player</button>
        </form>`
      : `<form class="stack" data-form="signin" autocomplete="off">
          ${locals.length ? `<div class="stack" style="gap:8px"><span class="label">Players on this device</span>${locals.map((p) => `<button type="button" class="profile-pick" data-act="pick" data-key="${esc(p.key)}">${avatar(p, 40)}<span><b>${esc(p.name)}</b><br><span class="small muted">${gname(p.maxGrade)} · Level ${level(p.xp)}</span></span></button>`).join("")}</div>` : ""}
          <label class="field"><span class="label">Player name</span><input id="siName" maxlength="16" autocomplete="off"></label>
          <label class="field"><span class="label">PIN</span><input id="siPin" type="password" inputmode="numeric" maxlength="4" placeholder="••••" autocomplete="current-password"></label>
          <p class="err" id="loginErr"></p>
          <button class="btn btn-primary btn-lg" type="submit">Sign in</button>
        </form>`;
    return `<section class="login">
      <div class="stack" style="gap:18px;padding-top:12px">
        <div class="hero-art">${samples.map((s, i) => `<div style="transform:rotate(${[-6, 3, -2][i]}deg)">${avatar(s, [72, 96, 80][i])}</div>`).join("")}</div>
        <h1>Learn, play and <span class="hl">climb the grades</span>.</h1>
        <p class="muted" style="max-width:52ch">Quizzes in Maths, Science, English and General Knowledge for Grade 6 to 10 and College, built around CBSE chapters. Earn coins, dress up your avatar, master skills to unlock the next grade, and race your friends on the leaderboard.</p>
        <div class="row small muted"><span class="row" style="gap:6px"><i class="subj s-math"></i>${SKILLS.filter((s) => s.s === "math").length} maths chapters</span><span class="row" style="gap:6px"><i class="subj s-sci"></i>${SKILLS.filter((s) => s.s === "sci").length} science</span><span class="row" style="gap:6px"><i class="subj s-eng"></i>${SKILLS.filter((s) => s.s === "eng").length} English</span><span class="row" style="gap:6px"><i class="subj s-gk"></i>${SKILLS.filter((s) => s.s === "gk").length} GK</span><span>4 games</span></div>
        <div><button class="btn" data-act="demo">Look around as the demo player</button></div>
        ${store.ok ? "" : `<p class="notice">This browser is blocking storage, so progress will be lost when you close the page.</p>`}
      </div>
      <div class="card stack" style="gap:16px">
        <div class="seg" role="group" aria-label="Sign in or create"><button data-act="loginTab" data-t="new" aria-pressed="${ui.loginTab === "new"}">New player</button><button data-act="loginTab" data-t="in" aria-pressed="${ui.loginTab === "in"}">Sign in</button></div>
        ${form}
      </div>
    </section>`;
  }
  async function doSignup() {
    const name = $("#suName").value.trim(), pin = $("#suPin").value.trim(), err = $("#loginErr");
    if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return (err.textContent = "Use 3 to 16 letters, numbers or _ for your name.");
    if (!/^\d{4}$/.test(pin)) return (err.textContent = "The PIN must be exactly 4 digits.");
    const key = name.toLowerCase();
    if (accounts[key] || key === "demo") return (err.textContent = "That name is taken on this device. Pick another or sign in.");
    me = newPlayer(name, await hashPin(key, pin), ui.su.grade, { skin: ui.su.skin, shirt: ui.su.shirt });
    if (ui.su.photo) me.photo = ui.su.photo;
    ui.subject = "math"; ui.grade = me.maxGrade;
    save(); store.set("ga.session", key); pushRemote();
    toast(`Welcome, ${name}! Here are 50 coins to start.`);
    go("home");
  }
  async function doSignin() {
    const name = $("#siName").value.trim(), pin = $("#siPin").value.trim(), err = $("#loginErr");
    const key = name.toLowerCase();
    const h = await hashPin(key, pin);
    let p = accounts[key];
    const cloud = await fetchRemotePlayer(key);
    if (cloud && cloud.pinHash === h && (!p || cloud.xp > p.xp)) p = cloud;
    if (!p) return (err.textContent = "No player with that name here. Check the spelling or create a new player.");
    if (p.pinHash !== h) return (err.textContent = "That PIN doesn't match. Try again.");
    me = normalize(p); ui.grade = me.maxGrade;
    save(); store.set("ga.session", key);
    go("home");
  }

  // ---------- Home ----------
  function suggestions() {
    const out = [];
    for (const s of SUBJECTS) {
      const pool = SKILLS.filter((k) => k.s === s.id && k.g <= me.maxGrade);
      const cur = pool.filter((k) => k.g === me.maxGrade);
      const list = (cur.length ? cur : pool).slice().sort((a, b) => stars(a.id) - stars(b.id) || (me.skills[a.id]?.a || 0) - (me.skills[b.id]?.a || 0));
      if (list[0]) out.push(list[0]);
    }
    return out;
  }
  function skillCard(k, locked) {
    const s = me.skills[k.id], st = stars(k.id), acc = recentAcc(k.id);
    return `<div class="card skill-card s-${k.s}">
      <div class="row" style="justify-content:space-between"><span class="label">${subjName(k.s)} · ${gname(k.g)}</span>${starHtml(st)}</div>
      <h3>${esc(k.n)}</h3>
      <div class="bar"><i style="width:${acc == null ? 0 : Math.round(acc * 100)}%"></i></div>
      <div class="row" style="justify-content:space-between">
        <span class="small muted">${s ? `${Math.round(acc * 100)}% recent · ${s.a} answered` : "Not started"}</span>
        ${locked ? `<span class="small muted">Locked</span>` : `<span class="row" style="gap:6px"><button class="btn btn-ghost" data-act="lesson" data-sid="${k.id}" title="Watch a 1-minute lesson">▶ Lesson</button><button class="btn btn-primary" data-act="practise" data-sid="${k.id}">Practise</button></span>`}
      </div>
    </div>`;
  }
  function vHome() {
    const L = level(me.xp), lo = lvlXp(L), hi = lvlXp(L + 1);
    const gp = gradeProgress(me.maxGrade);
    const dailyDone = me.daily === dayStr();
    const earned = BADGES.filter((b) => b[2](me));
    return `
      <section class="card hello">
        ${avatar(me, 92)}
        <div class="stack" style="gap:8px;min-width:0">
          <h2>Namaste, ${esc(me.name)}!</h2>
          <div class="row small"><span class="num" style="font-size:17px;font-weight:700">Level ${L}</span><span class="muted">${me.xp - lo} / ${hi - lo} XP to level ${L + 1}</span></div>
          <div class="bar marker" style="max-width:420px"><i style="width:${Math.round(((me.xp - lo) / (hi - lo)) * 100)}%"></i></div>
          <div class="statline small muted" style="margin-top:4px">
            <span class="stat"><b class="num">${me.coins}</b>coins</span>
            <span class="stat"><b class="num">${me.streak.days}</b>day streak</span>
            <span class="stat"><b class="num">${mastered()}</b>skills at 2★+</span>
            <span class="stat"><b class="num">${me.maxGrade === 11 ? "Col" : me.maxGrade}</b>top grade</span>
          </div>
        </div>
        <div class="stack" style="gap:8px">
          <button class="btn btn-marker btn-lg" data-act="daily" ${dailyDone ? "disabled" : ""}>${dailyDone ? "Daily challenge done" : "Daily challenge · 2× coins"}</button>
          <button class="btn" data-act="go" data-v="learn">Browse all chapters</button>
        </div>
      </section>
      ${mistakesCard(3)}
      <section class="card stack">
        <div class="row" style="justify-content:space-between"><h3>${gname(me.maxGrade)} progress</h3>
          <span class="small muted">${me.maxGrade === 11 ? "Top level reached. Keep collecting stars!" : `Get ${gp.need} of ${gp.total} skills to 2★ to unlock ${gname(GRADES[GRADES.indexOf(me.maxGrade) + 1])} (+100 coins)`}</span></div>
        <div class="bar"><i style="width:${Math.min(100, Math.round((gp.done / gp.need) * 100))}%"></i></div>
        <span class="small"><b class="num">${gp.done}</b> of ${gp.need} done</span>
      </section>
      <section class="stack">
        <h3>Practise next</h3>
        <div class="grid3">${suggestions().map((k) => skillCard(k, false)).join("")}</div>
      </section>
      <section class="stack">
        <div class="row" style="justify-content:space-between"><h3>Games</h3><button class="btn btn-ghost" data-act="go" data-v="games">All games</button></div>
        <div class="grid3">${GAMES.map(gameCard).join("")}</div>
      </section>
      <section class="card stack">
        <h3>Badges <span class="muted small">${earned.length} of ${BADGES.length}</span></h3>
        <div class="badges">${BADGES.map(([n, d, f]) => `<div class="badge ${f(me) ? "" : "locked"}" title="${esc(d)}"><b>${n}</b><span class="small muted">${d}</span></div>`).join("")}</div>
      </section>`;
  }

  // ---------- Learn ----------
  function vLearn() {
    const g = ui.grade ?? me.maxGrade;
    const list = SKILLS.filter((k) => k.s === ui.subject && k.g === g);
    const locked = g > me.maxGrade;
    return `
      <section class="stack">
        <h2>Learn</h2>
        <div class="row" style="gap:8px">${SUBJECTS.map((s) => `<button class="chip s-${s.id}" data-act="subj" data-id="${s.id}" aria-pressed="${ui.subject === s.id}"><i class="subj"></i>${s.n}</button>`).join("")}</div>
        <div class="row" style="gap:6px">${GRADES.map((x) => `<button class="chip" data-act="grade" data-g="${x}" aria-pressed="${g === x}">${gname(x)}${x > me.maxGrade ? " · locked" : ""}</button>`).join("")}</div>
      </section>
      ${locked ? `<p class="notice">${gname(g)} unlocks when you get half the ${gname(me.maxGrade)} skills to 2★. You can preview the chapters below.</p>` : ""}
      <div class="grid3">${list.map((k) => skillCard(k, locked)).join("")}</div>
      <p class="small muted">Chapter names follow the NCERT textbooks used in CBSE schools. Stars show mastery from your last 10 answers in each chapter: 1★ at 50%, 2★ at 75%, 3★ at 90% with 10+ answers.</p>`;
  }

  // ---------- Quiz ----------
  function startQuiz(sid) {
    const k = SKILL[sid];
    quiz = { kind: "skill", sid, title: k.n, subj: k.s, qs: C.buildQuiz(k, 8), i: 0, results: [], streak: 0, best: 0, coins: 0, xp: 0, mult: 1, answered: null, starsBefore: stars(sid) };
    go("quiz");
  }
  function startDaily() {
    if (me.daily === dayStr()) return toast("You've already done today's challenge. Come back tomorrow!");
    let pool = SKILLS.filter((k) => k.g === me.maxGrade);
    if (pool.length < 10) pool = pool.concat(SKILLS.filter((k) => k.g < me.maxGrade));
    const picks = R.shuffle(pool).slice(0, 10);
    quiz = { kind: "daily", title: "Daily challenge", subj: null, qs: picks.map((k) => C.buildQuiz(k, 1)[0]), i: 0, results: [], streak: 0, best: 0, coins: 0, xp: 0, mult: 2, answered: null };
    go("quiz");
  }
  function answer(idx) {
    if (!quiz || quiz.answered != null || quiz.done) return;
    const q = quiz.qs[quiz.i];
    const ok = q.opts[idx] === q.a;
    quiz.answered = idx; quiz.results.push(ok);
    const s = sk(q.sid); s.a++; if (ok) s.c++; s.h.push(ok ? 1 : 0); if (s.h.length > 10) s.h.shift();
    me.stats.answered++;
    if (!ok) {
      const m = { id: Date.now().toString(36) + R.int(100, 999), sid: q.sid, q: q.q, a: q.a, chosen: q.opts[idx], t: Date.now() };
      me.mistakes.unshift(m); if (me.mistakes.length > 60) me.mistakes.pop();
      quiz.lastMistake = m.id; (quiz.mistakes = quiz.mistakes || []).push(m.id);
    }
    if (ok) {
      me.stats.correct++; quiz.streak++; quiz.best = Math.max(quiz.best, quiz.streak);
      const c = (5 + (quiz.streak >= 3 ? 2 : 0)) * quiz.mult, x = 10 * quiz.mult;
      quiz.coins += c; quiz.xp += x; me.coins += c; me.xp += x; quiz.gain = c;
    } else { quiz.streak = 0; quiz.gain = 0; }
    save(); render();
  }
  function nextQ() {
    if (!quiz || quiz.answered == null) return;
    quiz.i++; quiz.answered = null;
    if (quiz.i < quiz.qs.length) return render();
    quiz.done = true;
    me.stats.quizzes++;
    if (quiz.results.every(Boolean)) { me.stats.perfect++; const b = 20 * quiz.mult; quiz.bonus = b; me.coins += b; quiz.coins += b; }
    if (quiz.kind === "daily") me.daily = dayStr();
    bumpStreak();
    quiz.gradeUp = checkGradeUp();
    save(); pushRemote(); render();
  }
  function vQuiz() {
    if (!quiz) return vHome();
    if (quiz.done) {
      const right = quiz.results.filter(Boolean).length, n = quiz.qs.length;
      const st = quiz.sid ? stars(quiz.sid) : null;
      return `<section class="quiz">
        <div class="card stack pop" style="text-align:center;justify-items:center;gap:14px;padding:28px">
          <span class="label">${esc(quiz.title)}</span>
          <div class="result-big num">${right}<span class="muted" style="font-size:36px">/${n}</span></div>
          <p>${right === n ? "Perfect round! Bonus coins added." : right >= n * 0.75 ? "Great work!" : right >= n / 2 ? "Good effort. Practise again to earn stars." : "Keep going. Every attempt builds the skill."}</p>
          <div class="row" style="justify-content:center;gap:22px">
            <span class="stat small muted"><b class="num" style="color:var(--ink)">+${quiz.coins}</b>coins</span>
            <span class="stat small muted"><b class="num" style="color:var(--ink)">+${quiz.xp}</b>XP</span>
            <span class="stat small muted"><b class="num" style="color:var(--ink)">${quiz.best}</b>best streak</span>
          </div>
          ${st != null ? `<div class="row" style="justify-content:center">${starHtml(st)}<span class="small muted">${st > quiz.starsBefore ? "New star earned!" : "Chapter mastery"}</span></div>` : ""}
          ${quiz.gradeUp ? `<p class="notice" style="color:var(--ink)"><b>${gname(quiz.gradeUp)} unlocked!</b> You earned 100 bonus coins.</p>` : ""}
          ${(quiz.mistakes || []).length ? `<div class="stack" style="width:100%;text-align:left;gap:8px"><span class="label">Fix your mistakes · +3 coins per lesson watched</span>${mistakeRows(me.mistakes.filter((m) => quiz.mistakes.includes(m.id)))}</div>` : ""}
          <div class="row" style="justify-content:center">
            ${quiz.sid ? `<button class="btn btn-primary" data-act="practise" data-sid="${quiz.sid}">Play again</button>` : ""}
            <button class="btn" data-act="go" data-v="learn">Back to chapters</button>
            <button class="btn btn-ghost" data-act="go" data-v="home">Home</button>
          </div>
        </div>
      </section>`;
    }
    const q = quiz.qs[quiz.i], k = SKILL[q.sid];
    const ans = quiz.answered;
    return `<section class="quiz">
      <div class="row" style="justify-content:space-between">
        <span class="row" style="gap:8px"><i class="subj s-${k.s}"></i><span class="label">${esc(quiz.kind === "daily" ? "Daily challenge · " + k.n : k.n)}</span></span>
        <span class="row" style="gap:12px">${quiz.streak >= 2 ? `<span class="combo">${quiz.streak} in a row</span>` : ""}<span class="small muted num">Q ${quiz.i + 1} of ${quiz.qs.length}</span><button class="btn btn-ghost" data-act="go" data-v="learn">Quit</button></span>
      </div>
      <div class="dots">${quiz.qs.map((_, i) => `<i class="${i < quiz.results.length ? (quiz.results[i] ? "ok" : "bad") : i === quiz.i ? "cur" : ""}"></i>`).join("")}</div>
      <div class="card stack" style="gap:20px;padding:22px">
        <p class="qtext">${esc(q.q)}</p>
        <div class="opts">${q.opts.map((o, i) => {
          let cls = "";
          if (ans != null) { if (o === q.a) cls = "ok"; else if (i === ans) cls = "bad"; }
          return `<button class="opt ${cls}" data-act="answer" data-i="${i}" ${ans != null ? "disabled" : ""}><kbd>${i + 1}</kbd><span>${esc(o)}</span></button>`;
        }).join("")}</div>
      </div>
      ${ans != null ? (q.opts[ans] === q.a
        ? `<div class="feedback ok pop"><span>Correct! +${quiz.gain} coins${quiz.streak >= 3 ? " (streak bonus)" : ""}</span><button class="btn btn-primary" data-act="next" id="nextBtn">${quiz.i + 1 < quiz.qs.length ? "Next question" : "See results"}</button></div>`
        : `<div class="feedback bad pop"><span>Not quite. The answer is <b>${esc(q.a)}</b>.</span><span class="row" style="gap:8px"><button class="btn" data-act="lesson" data-sid="${q.sid}" data-mid="${quiz.lastMistake}">▶ Watch 1-min fix</button><button class="btn btn-primary" data-act="next" id="nextBtn">${quiz.i + 1 < quiz.qs.length ? "Next question" : "See results"}</button></span></div>`) : ""}
    </section>`;
  }

  // ---------- Mistakes and fix-it lessons (narrated, video-style) ----------
  const LESSONS = window.GA_LESSONS || {};
  let lesson = null;
  const ytLink = (k) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(k.g === 11 ? `${k.n} explained` : `Class ${k.g} ${subjName(k.s)} ${k.n} NCERT`);
  function mistakeRows(list) {
    if (!list.length) return `<p class="notice">No mistakes to fix. Nice work!</p>`;
    return list.map((m) => {
      const k = SKILL[m.sid]; if (!k) return "";
      return `<div class="mistake s-${k.s}">
        <div class="stack" style="gap:3px;min-width:0"><span class="label">${esc(k.n)} · ${gname(k.g)}</span><b>${esc(m.q)}</b>
        <span class="small">You said <span class="was">${esc(m.chosen)}</span> · Answer <span class="right">${esc(m.a)}</span></span></div>
        <button class="btn ${m.watched ? "" : "btn-primary"}" data-act="lesson" data-sid="${m.sid}" data-mid="${esc(m.id)}">${m.watched ? "✓ Watch again" : "▶ Watch fix"}</button>
      </div>`;
    }).join("");
  }
  function mistakesCard(n) {
    const open = me.mistakes.filter((m) => !m.watched);
    if (!open.length) return "";
    return `<section class="card stack">
      <div class="row" style="justify-content:space-between"><h3>Fix your mistakes <span class="muted small">${open.length} to review</span></h3><button class="btn btn-ghost" data-act="go" data-v="mistakes">See all</button></div>
      <p class="small muted">Each 1-minute lesson explains the idea behind a question you missed. Finish one to earn 3 coins.</p>
      ${mistakeRows(open.slice(0, n))}</section>`;
  }
  function vMistakes() {
    const open = me.mistakes.filter((m) => !m.watched).length;
    return `<section class="stack"><h2>Mistakes to fix</h2><p class="muted">Every wrong answer lands here with a short narrated lesson on the idea behind it. ${open ? `${open} still to watch.` : "All caught up!"}</p></section>
      <section class="card stack">${mistakeRows(me.mistakes)}</section>`;
  }

  const canSpeak = () => "speechSynthesis" in window;
  const hush = () => { try { if (canSpeak()) speechSynthesis.cancel(); } catch (e) { /* ignore */ } };
  function speak(text) {
    hush();
    if (!canSpeak() || !lesson.voice) return;
    try {
      const u = new SpeechSynthesisUtterance(text), vs = speechSynthesis.getVoices();
      const v = vs.find((x) => /en[-_]IN/i.test(x.lang)) || vs.find((x) => /^en/i.test(x.lang));
      if (v) u.voice = v;
      u.rate = 0.97;
      speechSynthesis.speak(u);
    } catch (e) { /* narration is optional */ }
  }
  const sceneDur = (s) => Math.max(4500, (s.text.length + (s.title || "").length) * 55);
  const sceneSpeech = (s) => (s.kind === "intro" || s.kind === "mistake" || s.kind === "outro" ? `${s.title}. ${s.text}` : s.kind === "ai" ? s.steps.join(" ") : `${s.tag}. ${s.text}`);
  function openLesson(sid, mid) {
    const k = SKILL[sid], L = LESSONS[sid];
    if (!k || !L) return toast("No lesson for this chapter yet.");
    const m = mid ? me.mistakes.find((x) => x.id === mid) : null;
    const scenes = [{ kind: "intro", tag: "Fix-it lesson", title: k.n, text: `${subjName(k.s)}, ${gname(k.g)}. A one-minute lesson${m ? " on the question you missed" : ""}.` }];
    if (m) scenes.push({ kind: "mistake", tag: "Your answer", title: m.q, text: `You chose ${m.chosen}. The correct answer is ${m.a}. Let's see why.`, m });
    scenes.push({ tag: "Key idea", text: L[0] }, { tag: "Worked example", text: L[1] }, { tag: "Watch out", text: L[2] });
    scenes.push({ kind: "outro", tag: "Your turn", title: "Now try it yourself", text: m ? `Remember, the answer was ${m.a}. Practise ${k.n} to lock it in.` : `Practise ${k.n} to earn your stars.` });
    const from = view === "lesson" ? lesson?.from || "home" : view;
    lesson = { sid, k, m, scenes, i: 0, el: 0, playing: true, voice: lesson ? lesson.voice : true, from, ai: "idle", done: false };
    go("lesson");
    startScene();
  }
  function startScene() {
    clearTimers();
    lesson.el = 0;
    const s = lesson.scenes[lesson.i];
    if (lesson.playing) speak(sceneSpeech(s)); else hush();
    if (s.kind === "outro") finishLesson();
    timers.push(setInterval(() => {
      if (!lesson || view !== "lesson" || !lesson.playing) return;
      const dur = sceneDur(s);
      lesson.el = Math.min(dur, lesson.el + 100);
      const fill = document.querySelector(".seg-fill.cur");
      if (fill) fill.style.width = (lesson.el / dur) * 100 + "%";
      const talking = canSpeak() && lesson.voice && speechSynthesis.speaking;
      if (lesson.el >= dur && !talking && lesson.i < lesson.scenes.length - 1) { lesson.i++; render(); startScene(); }
    }, 100));
  }
  function seekScene(i) { lesson.i = Math.max(0, Math.min(lesson.scenes.length - 1, i)); lesson.playing = true; render(); startScene(); }
  function finishLesson() {
    if (lesson.done) return;
    lesson.done = true;
    me.stats.lessons = (me.stats.lessons || 0) + 1;
    if (lesson.m && !lesson.m.watched) { lesson.m.watched = true; me.coins += 3; me.xp += 5; lesson.reward = true; }
    save(); pushRemote();
    const c = $(".coins .num"); if (c) c.textContent = me.coins;
  }
  async function askWhy() {
    const s = remote.sample, m = lesson?.m, k = lesson?.k;
    if (!s || !m || lesson.ai === "loading") return;
    lesson.ai = "loading"; render();
    try {
      const prompt = `You are a friendly CBSE tutor helping a ${k.g === 11 ? "college" : "Grade " + k.g} student. They answered a ${subjName(k.s)} question from the chapter "${k.n}" incorrectly.\nQuestion: ${m.q}\nTheir answer: ${m.chosen}\nCorrect answer: ${m.a}\n\nExplain simply why the correct answer is right and what probably went wrong in their thinking. Reply with only JSON like {"steps": ["first short step", "second short step"]}: 2 to 4 steps, each under 30 words, plain text with no markdown.`;
      const out = await s.json(prompt, { modelTier: "quick" });
      const steps = (Array.isArray(out?.steps) ? out.steps : []).filter((x) => typeof x === "string" && x.trim()).slice(0, 4).map((x) => x.trim().slice(0, 240));
      if (!steps.length) throw new Error("empty");
      if (!lesson || lesson.m !== m) return;
      const at = lesson.scenes.findIndex((x) => x.kind === "mistake") + 1;
      lesson.scenes.splice(at, 0, { kind: "ai", tag: "Why this is the answer", text: steps.join(" "), steps });
      lesson.ai = "done";
      seekScene(at);
    } catch (e) {
      if (!lesson) return;
      lesson.ai = e && e.code === "not_granted" ? "off" : "error";
      render();
    }
  }
  function vLesson() {
    if (!lesson) return vHome();
    const s = lesson.scenes[lesson.i], k = lesson.k, dur = sceneDur(s);
    let body;
    if (s.kind === "mistake") body = `<p class="sc-q">${esc(s.title)}</p><div class="sc-ans"><span class="sc-was">${esc(s.m.chosen)}</span><span aria-hidden="true">→</span><span class="sc-right">${esc(s.m.a)}</span></div>`;
    else if (s.kind === "ai") body = `<ol class="sc-steps">${s.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`;
    else if (s.kind === "intro") body = `<p class="sc-title">${esc(s.title)}</p><p class="sc-text">${esc(s.text)}</p>`;
    else if (s.kind === "outro") body = `<p class="sc-title">${esc(s.title)}</p><p class="sc-text">${esc(s.text)}</p>${lesson.reward ? `<p class="sc-reward">+3 coins for fixing a mistake</p>` : ""}<div class="row" style="justify-content:center"><button class="btn btn-marker" data-act="practise" data-sid="${k.id}">Practise ${esc(k.n)}</button><button class="btn" data-act="lSeek" data-i="0">Replay</button></div>`;
    else body = `<p class="sc-text big">${esc(s.text)}</p>`;
    const backLabel = { quiz: "Back to quiz", mistakes: "Back to mistakes", learn: "Back to chapters", home: "Back home", progress: "Back to progress" }[lesson.from] || "Back";
    const ai = !lesson.m || !remote.sample ? ""
      : lesson.ai === "done" ? ""
      : lesson.ai === "loading" ? `<button class="btn" disabled>Claude is thinking…</button>`
      : lesson.ai === "off" ? `<span class="small muted">Asking Claude isn't allowed on this view.</span>`
      : `<button class="btn" data-act="askWhy">${lesson.ai === "error" ? "Try asking Claude again" : "Ask Claude why I got it wrong"}</button>`;
    return `<section class="player-wrap">
      <div class="row" style="justify-content:space-between"><span class="row" style="gap:8px"><i class="subj s-${k.s}"></i><span class="label">${subjName(k.s)} · ${gname(k.g)}</span></span><button class="btn btn-ghost" data-act="lessonBack">${backLabel}</button></div>
      <div class="player">
        <div class="stage">
          <span class="sc-tag">${esc(s.tag)}</span>
          <div class="sc-body" data-scene="${lesson.i}">${body}</div>
          <span class="sc-brand">Gyaan Arena</span>
        </div>
        <div class="controls">
          <button class="cb" data-act="lPlay" aria-label="${lesson.playing ? "Pause" : "Play"}">${lesson.playing ? "❚❚" : "▶"}</button>
          <button class="cb" data-act="lSeek" data-i="${lesson.i - 1}" aria-label="Previous scene" ${lesson.i ? "" : "disabled"}>⏮</button>
          <button class="cb" data-act="lSeek" data-i="${lesson.i + 1}" aria-label="Next scene" ${lesson.i < lesson.scenes.length - 1 ? "" : "disabled"}>⏭</button>
          <div class="segs">${lesson.scenes.map((x, j) => `<button class="seg-b" data-act="lSeek" data-i="${j}" aria-label="Scene ${j + 1}: ${esc(x.tag)}"><span class="seg-track"><i class="seg-fill ${j === lesson.i ? "cur" : ""}" style="width:${j < lesson.i ? 100 : j === lesson.i ? (lesson.el / dur) * 100 : 0}%"></i></span></button>`).join("")}</div>
          <span class="ltime">${lesson.i + 1} / ${lesson.scenes.length}</span>
          ${canSpeak() ? `<button class="cb" data-act="lVoice" aria-pressed="${lesson.voice}">${lesson.voice ? "Voice on" : "Voice off"}</button>` : ""}
        </div>
      </div>
      <div class="row">
        ${ai}
        <a class="btn" href="${ytLink(k)}" target="_blank" rel="noopener noreferrer">More videos on YouTube ↗</a>
        <button class="btn btn-primary" data-act="practise" data-sid="${k.id}">Practise this chapter</button>
      </div>
      <p class="small muted">Space pauses, and the arrow keys move between scenes. YouTube opens in a new tab with videos for this chapter.</p>
    </section>`;
  }

  // ---------- Profile photo ----------
  function processPhoto(file, forSignup) {
    if (!file || !/^image\//.test(file.type)) return toast("Please choose an image file (JPG or PNG).");
    if (file.size > 15e6) return toast("That image is too big. Pick one under 15 MB.");
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const S = 200, c = document.createElement("canvas"), side = Math.min(img.naturalWidth, img.naturalHeight);
      c.width = c.height = S;
      c.getContext("2d").drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, S, S);
      URL.revokeObjectURL(url);
      const data = c.toDataURL("image/jpeg", 0.85);
      if (forSignup) {
        ui.su.photo = data;
        const pv = $("#suPreview"); if (pv) pv.innerHTML = avatar({ name: "New player", look: { skin: ui.su.skin, shirt: ui.su.shirt }, photo: data }, 88);
        const lb = $("#suPhotoLabel"); if (lb) lb.textContent = "Change photo";
        return;
      }
      me.photo = data; save(); toast("Profile picture updated."); render();
    };
    img.onerror = () => { URL.revokeObjectURL(url); toast("Couldn't read that image. Try a JPG or PNG."); };
    img.src = url;
  }
  const photoControls = () => `<div class="row" style="gap:6px;justify-content:center">
      <label class="btn" for="photoIn">${me.photo ? "Change photo" : "Upload photo"}</label><input id="photoIn" type="file" accept="image/*" hidden>
      ${me.photo ? `<button class="btn btn-ghost" data-act="rmPhoto">Use cartoon face</button>` : ""}
    </div>`;

  // ---------- Games ----------
  const GAMES = [
    { id: "sprint", name: "Speed Sprint", ico: "+×", desc: "60 seconds of quick maths facts. How many can you get?", best: (p) => `Best: ${p.games.sprint}` },
    { id: "m24", name: "Make 24", ico: "24", desc: "Use all four numbers with + − × ÷ to make exactly 24.", best: (p) => `Solved: ${p.games.m24}` },
    { id: "scramble", name: "Word Scramble", ico: "Ab", desc: "Unscramble the letters to find the word. Clues help!", best: (p) => `Best: ${p.games.scramble}` },
    { id: "flash", name: "Fact Flash", ico: "T/F", desc: "Science and GK facts flash by. True or false? 45 seconds.", best: (p) => `Best: ${p.games.flash}` },
  ];
  const gameCard = (g) => `<button class="game-card" data-act="game" data-g="${g.id}"><span class="game-ico">${g.ico}</span><h3>${g.name}</h3><span class="small muted">${g.desc}</span><span class="small"><b>${g.best(me)}</b></span></button>`;
  function vGames() {
    return `<section class="stack"><h2>Games</h2><p class="muted">Fast fact-fluency games in the style of First in Math. Every game earns coins and XP.</p></section>
      <div class="grid2">${GAMES.map(gameCard).join("")}</div>`;
  }
  function tick(onEnd) {
    timers.push(setInterval(() => {
      if (!game || game.phase !== "play") return;
      game.t--;
      const el = $("#timer"); if (el) el.textContent = game.t + "s";
      if (game.t <= 0) { clearTimers(); onEnd(); }
    }, 1000));
  }
  function endGame(field, score, extra) {
    game.phase = "over";
    const prev = me.games[field];
    if (field === "m24") me.games.m24 += 0; else me.games[field] = Math.max(prev, score);
    game.newBest = field !== "m24" && score > prev;
    bumpStreak(); save(); pushRemote(); render();
  }
  function gameOver(title, score, unit) {
    return `<div class="card stack pop" style="justify-items:center;gap:12px;padding:28px">
      <span class="label">${title}</span>
      <div class="result-big num">${score}</div><span class="muted">${unit}</span>
      ${game.newBest ? `<p class="hl"><b>New personal best!</b></p>` : ""}
      <div class="row" style="justify-content:center;gap:22px"><span class="stat small muted"><b class="num" style="color:var(--ink)">+${game.coins}</b>coins</span><span class="stat small muted"><b class="num" style="color:var(--ink)">+${game.xp}</b>XP</span></div>
      <div class="row" style="justify-content:center"><button class="btn btn-primary" data-act="game" data-g="${game.type}">Play again</button><button class="btn" data-act="go" data-v="games">All games</button></div>
    </div>`;
  }
  function gain(c, x) { game.coins += c; game.xp += x; me.coins += c; me.xp += x; const el = $(".coins .num"); if (el) el.textContent = me.coins; }

  // Speed Sprint
  function sprintQ() {
    const op = game.op === "mix" ? R.pick(["+", "−", "×", "÷"]) : game.op, pro = game.lvl === 2;
    let a, b, ans;
    if (op === "+") { a = pro ? R.int(10, 99) : R.int(1, 10); b = pro ? R.int(10, 99) : R.int(1, 10); ans = a + b; }
    if (op === "−") { a = pro ? R.int(20, 99) : R.int(2, 20); b = R.int(1, a); ans = a - b; }
    if (op === "×") { a = pro ? R.int(2, 20) : R.int(1, 10); b = pro ? R.int(2, 12) : R.int(1, 10); ans = a * b; }
    if (op === "÷") { b = pro ? R.int(2, 12) : R.int(1, 10); ans = pro ? R.int(2, 20) : R.int(1, 10); a = b * ans; }
    game.q = { text: `${a} ${op} ${b}`, ans }; game.input = "";
  }
  function vSprint() {
    if (game.phase === "setup") return `<section class="arena">
      <h2>Speed Sprint</h2><p class="muted">Type the answer. It moves on by itself when you're right.</p>
      <div class="card stack" style="gap:16px">
        <div class="stack" style="gap:8px"><span class="label">Operation</span><div class="row" style="justify-content:center;gap:8px">${[["+", "Add"], ["−", "Subtract"], ["×", "Multiply"], ["÷", "Divide"], ["mix", "Mixed"]].map(([o, n]) => `<button class="chip" data-act="sOp" data-o="${o}" aria-pressed="${game.op === o}">${n}</button>`).join("")}</div></div>
        <div class="stack" style="gap:8px"><span class="label">Level</span><div class="row" style="justify-content:center;gap:8px"><button class="chip" data-act="sLvl" data-l="1" aria-pressed="${game.lvl === 1}">Warm-up (1–10)</button><button class="chip" data-act="sLvl" data-l="2" aria-pressed="${game.lvl === 2}">Pro (bigger numbers)</button></div></div>
        <button class="btn btn-primary btn-lg" data-act="sStart">Start · 60 seconds</button>
        <span class="small muted">Your best: ${me.games.sprint} · 1 coin per correct answer</span>
      </div></section>`;
    if (game.phase === "over") return `<section class="arena">${gameOver("Speed Sprint", game.score, "correct answers")}</section>`;
    return `<section class="arena">
      <div class="row" style="justify-content:space-between"><span class="timer" id="timer">${game.t}s</span><span class="num" style="font-size:22px;font-weight:700">Score ${game.score}</span></div>
      <div class="big-q">${game.q.text}</div>
      <div class="answer-box num ${game.flash || ""}" id="ansBox">${esc(game.input) || "&nbsp;"}</div>
      <div class="keypad">${["7", "8", "9", "4", "5", "6", "1", "2", "3", "⌫", "0", "Skip"].map((k) => `<button data-act="key" data-k="${k}">${k}</button>`).join("")}</div>
      <span class="small muted">You can also type on your keyboard.</span>
    </section>`;
  }
  function sprintKey(k) {
    if (game?.type !== "sprint" || game.phase !== "play") return;
    if (k === "⌫") game.input = game.input.slice(0, -1);
    else if (k === "Skip") { sprintQ(); }
    else if (/^\d$/.test(k) && game.input.length < 4) game.input += k;
    if (game.input !== "" && Number(game.input) === game.q.ans) { game.score++; gain(1, 2); sprintQ(); }
    const box = $("#ansBox");
    if (box) { box.textContent = game.input || " "; $(".big-q").textContent = game.q.text; $(".arena .num[style]").textContent = "Score " + game.score; }
  }

  // Make 24
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = C.gcd(n, d) || 1; return { n: n / g, d: d / g }; };
  const frStr = (f) => (f.d === 1 ? String(f.n).replace("-", "−") : `${String(f.n).replace("-", "−")}/${f.d}`);
  function solve24(arr) {
    if (arr.length === 1) return Math.abs(arr[0].v - 24) < 1e-9 ? arr[0].e : null;
    for (let i = 0; i < arr.length; i++) for (let j = 0; j < arr.length; j++) {
      if (i === j) continue;
      const a = arr[i], b = arr[j], rest = arr.filter((_, k) => k !== i && k !== j);
      const c = [];
      if (i < j) { c.push({ v: a.v + b.v, e: `(${a.e} + ${b.e})` }, { v: a.v * b.v, e: `(${a.e} × ${b.e})` }); }
      c.push({ v: a.v - b.v, e: `(${a.e} − ${b.e})` });
      if (b.v !== 0) c.push({ v: a.v / b.v, e: `(${a.e} ÷ ${b.e})` });
      for (const x of c) { const r = solve24([...rest, x]); if (r) return r; }
    }
    return null;
  }
  function new24() {
    let nums, sol;
    do { nums = [0, 0, 0, 0].map(() => R.int(1, 9)); sol = solve24(nums.map((v) => ({ v, e: String(v) }))); } while (!sol);
    game.start = nums; game.solution = sol.replace(/^\((.*)\)$/, "$1");
    reset24();
  }
  function reset24() { game.tiles = game.start.map((v, i) => ({ ...fr(v), id: i })); game.sel = null; game.op = null; game.hist = []; game.msg = ""; game.won = false; game.reveal = false; }
  function tap24(i) {
    if (game.won) return;
    if (game.sel == null || game.op == null || game.sel === i) { game.sel = game.sel === i ? null : i; return render(); }
    const a = game.tiles[game.sel], b = game.tiles[i];
    let r;
    if (game.op === "+") r = fr(a.n * b.d + b.n * a.d, a.d * b.d);
    if (game.op === "−") r = fr(a.n * b.d - b.n * a.d, a.d * b.d);
    if (game.op === "×") r = fr(a.n * b.n, a.d * b.d);
    if (game.op === "÷") { if (b.n === 0) return toast("You can't divide by zero."); r = fr(a.n * b.d, a.d * b.n); }
    game.hist.push(game.tiles.map((t) => ({ ...t })));
    const id = Date.now();
    game.tiles = game.tiles.map((t, k) => (k === i ? { ...r, id } : t)).filter((_, k) => k !== game.sel);
    game.sel = game.tiles.findIndex((t) => t.id === id); game.op = null;
    if (game.tiles.length === 1) {
      const t = game.tiles[0];
      if (t.n === 24 && t.d === 1) { game.won = true; game.solved++; me.games.m24++; gain(15, 20); bumpStreak(); save(); pushRemote(); game.msg = "You made 24! +15 coins"; }
      else game.msg = `That makes ${frStr(t)}, not 24. Undo and try another way.`;
    } else game.msg = "";
    render();
  }
  function v24() {
    return `<section class="arena">
      <div class="row" style="justify-content:space-between"><h2>Make 24</h2><span class="small muted">Solved this session: <b class="num">${game.solved}</b></span></div>
      <p class="muted small">Tap a number, then an operation, then another number. Keep going until one number is left. Use all four!</p>
      <div class="tiles">${game.tiles.map((t, i) => { const s = frStr(t); return `<button class="tile ${s.length > 3 ? "small-f" : ""}" data-act="tile" data-i="${i}" aria-pressed="${game.sel === i}">${s}</button>`; }).join("")}</div>
      <div class="ops">${["+", "−", "×", "÷"].map((o) => `<button data-act="op" data-o="${o}" aria-pressed="${game.op === o}" aria-label="${o}">${o}</button>`).join("")}</div>
      <p style="min-height:1.6em;font-weight:600;color:${game.won ? "var(--ok)" : "var(--ink)"}">${esc(game.msg)}</p>
      ${game.reveal ? `<p class="notice">One answer: <b>${esc(game.solution)}</b> = 24</p>` : ""}
      <div class="row" style="justify-content:center">
        ${game.won ? `<button class="btn btn-primary" data-act="new24">Next puzzle</button>` : `<button class="btn" data-act="undo24" ${game.hist.length ? "" : "disabled"}>Undo</button><button class="btn" data-act="reset24">Start over</button><button class="btn btn-ghost" data-act="show24">Show an answer</button><button class="btn btn-ghost" data-act="new24">New puzzle</button>`}
      </div>
      <span class="small muted">+15 coins for each puzzle you solve.</span>
    </section>`;
  }

  // Word Scramble
  function scrambleWord() {
    const tier = me.maxGrade <= 7 ? ["easy"] : me.maxGrade <= 9 ? ["easy", "medium", "medium"] : ["medium", "hard", "hard"];
    const [w, clue] = R.pick(C.WORDS[R.pick(tier)]);
    let s; do { s = R.shuffle(w.split("")); } while (s.join("") === w);
    game.word = w; game.clue = clue; game.letters = s.map((ch) => ({ ch, used: false })); game.picked = [];
  }
  function vScramble() {
    if (game.phase === "over") return `<section class="arena">${gameOver("Word Scramble", game.score, "words found")}</section>`;
    return `<section class="arena">
      <div class="row" style="justify-content:space-between"><span class="timer" id="timer">${game.t}s</span><span class="num" style="font-size:22px;font-weight:700">Words ${game.score}</span></div>
      <p class="label">Clue</p><h3>${esc(game.clue)}</h3>
      <div class="letters" aria-label="Your answer">${game.word.split("").map((_, i) => `<span class="slot">${game.picked[i] != null ? esc(game.letters[game.picked[i]].ch) : ""}</span>`).join("")}</div>
      <div class="letters">${game.letters.map((l, i) => `<button class="letter" data-act="letter" data-i="${i}" ${l.used ? "disabled" : ""}>${esc(l.ch)}</button>`).join("")}</div>
      <p style="min-height:1.4em;font-weight:600">${esc(game.msg || "")}</p>
      <div class="row" style="justify-content:center"><button class="btn" data-act="clearL">Clear</button><button class="btn" data-act="shuffleL">Shuffle</button><button class="btn btn-ghost" data-act="skipW">Skip word</button></div>
      <span class="small muted">Tap letters or type them. +5 coins per word.</span>
    </section>`;
  }
  function pickLetter(i) {
    const l = game.letters[i]; if (!l || l.used) return;
    l.used = true; game.picked.push(i); game.msg = "";
    if (game.picked.length === game.word.length) {
      const guess = game.picked.map((k) => game.letters[k].ch).join("");
      if (guess === game.word) { game.score++; gain(5, 8); game.msg = `Yes! "${game.word}"`; scrambleWord(); }
      else { game.msg = "Not that one. Try again."; game.letters.forEach((x) => (x.used = false)); game.picked = []; }
    }
    render();
  }

  // Fact Flash
  function vFlash() {
    if (game.phase === "over") return `<section class="arena">${gameOver("Fact Flash", game.score, "facts judged correctly")}</section>`;
    const it = game.item;
    return `<section class="arena">
      <div class="row" style="justify-content:space-between"><span class="timer" id="timer">${game.t}s</span><span class="num" style="font-size:22px;font-weight:700">Score ${game.score}</span></div>
      <div class="card stack" style="gap:10px;padding:24px">
        <p class="qtext" style="font-size:22px">${esc(it.q)}</p>
        <p class="qtext"><span class="hl">${esc(it.shown)}</span></p>
      </div>
      <div class="tf"><button data-act="tf" data-v="1" style="color:var(--ok)">True <span class="small muted">(T)</span></button><button data-act="tf" data-v="0" style="color:var(--bad)">False <span class="small muted">(F)</span></button></div>
      <p style="min-height:1.4em;font-weight:600">${game.msg || ""}</p>
    </section>`;
  }
  function judge(v) {
    if (game?.type !== "flash" || game.phase !== "play") return;
    const it = game.item;
    if (v === it.truth) { game.score++; gain(2, 3); game.msg = `<span style="color:var(--ok)">Right!</span>`; }
    else game.msg = `<span style="color:var(--bad)">Oops. ${esc(it.q)} <b>${esc(it.answer)}</b></span>`;
    game.item = C.flashItem(me.maxGrade);
    render();
  }

  function startGame(type) {
    clearTimers();
    game = { type, phase: "play", coins: 0, xp: 0, score: 0, msg: "" };
    if (type === "sprint") { game.phase = "setup"; game.op = "mix"; game.lvl = 1; }
    if (type === "m24") { game.solved = 0; new24(); }
    if (type === "scramble") { game.t = 90; scrambleWord(); }
    if (type === "flash") { game.t = 45; game.item = C.flashItem(me.maxGrade); }
    go("game-" + type);
    if (type === "scramble") tick(() => endGame("scramble", game.score));
    if (type === "flash") tick(() => endGame("flash", game.score));
  }

  // ---------- Shop ----------
  function vShop() {
    const items = SHOP.filter((s) => s.cat === ui.shopCat);
    return `<section class="stack"><h2>Accessory shop</h2><p class="muted">Spend the coins you earn on hats, glasses, pets and more.</p></section>
      <div class="shop">
        <div class="card shop-preview">
          ${avatar(me, 180)}
          <h3>${esc(me.name)}</h3>
          <span class="coins"><i class="coin"></i><span class="num">${me.coins}</span></span>
          ${photoControls()}
          <span class="small muted">${me.photo ? "Hats, pets and frames still show on your photo." : "Use a photo or the cartoon face below."} Photos stay on this device and are never shown on the shared leaderboard.</span>
          <div class="stack" style="gap:8px;justify-items:center">
            <span class="label">Skin tone</span><div class="swatches">${SKINS.map((c) => `<button class="swatch" style="background:${c}" data-act="look" data-k="skin" data-val="${c}" aria-label="Skin tone" aria-pressed="${me.look.skin === c}"></button>`).join("")}</div>
            <span class="label">Shirt</span><div class="swatches">${SHIRTS.map((c) => `<button class="swatch" style="background:${c}" data-act="look" data-k="shirt" data-val="${c}" aria-label="Shirt colour" aria-pressed="${me.look.shirt === c}"></button>`).join("")}</div>
          </div>
        </div>
        <div class="stack">
          <div class="row" style="gap:8px">${CATS.map(([c, n]) => `<button class="chip" data-act="shopCat" data-c="${c}" aria-pressed="${ui.shopCat === c}">${n}</button>`).join("")}</div>
          <div class="items">${items.map((it) => {
            const owned = me.owned.includes(it.id), on = me.eq[it.cat] === it.id;
            const ico = it.e ? `<span class="item-ico">${it.e}</span>` : it.cat === "bg" ? `<span class="item-swatch" style="background:linear-gradient(135deg,${it.c[0]},${it.c[1]})"></span>` : `<span class="item-swatch" style="border:6px solid ${it.c};background:none"></span>`;
            const btn = on ? `<button class="btn" data-act="unequip" data-c="${it.cat}">Take off</button>`
              : owned ? `<button class="btn btn-primary" data-act="equip" data-id="${it.id}">Wear</button>`
              : `<button class="btn btn-marker" data-act="buy" data-id="${it.id}" ${me.coins < it.price ? "disabled" : ""}><i class="coin"></i>${it.price}</button>`;
            return `<div class="item ${on ? "equipped" : ""}">${ico}<b>${it.name}</b><span class="small muted">${on ? "Wearing" : owned ? "Owned" : me.coins < it.price ? `Need ${it.price - me.coins} more` : "For sale"}</span>${btn}</div>`;
          }).join("")}</div>
        </div>
      </div>`;
  }

  // ---------- Leaderboard ----------
  function boardRows(rows) {
    if (!rows.length) return `<p class="notice">No players yet.</p>`;
    return `<div class="table-wrap"><table>
      <thead><tr><th>#</th><th>Player</th><th>Grade</th><th class="num">Level</th><th class="num">XP</th><th class="num">Coins</th></tr></thead>
      <tbody>${rows.map((p, i) => `<tr class="${p.isMe ? "me" : ""}"><td class="rank ${i < 3 ? "medal-" + (i + 1) : ""}">${i + 1}</td>
        <td><span class="row" style="gap:10px;flex-wrap:nowrap">${avatar(p, 36)}<span>${esc(p.name)}${p.isMe ? ' <span class="small muted">(you)</span>' : ""}</span></span></td>
        <td>${GRADES.includes(p.grade) ? gname(p.grade) : ""}</td><td class="num">${level(Number(p.xp) || 0)}</td><td class="num">${Number(p.xp) || 0}</td><td class="num">${Number(p.coins) || 0}</td></tr>`).join("")}</tbody>
    </table></div>`;
  }
  function vBoard() {
    let body;
    if (ui.boardTab === "device") {
      const rows = Object.values(accounts).map((p) => ({ name: p.name, xp: p.xp, coins: p.coins, grade: p.maxGrade, look: p.look, eq: p.eq, isMe: p.key === me.key })).sort((a, b) => b.xp - a.xp);
      body = boardRows(rows) + `<p class="small muted">Everyone who has played on this device or browser.</p>`;
    } else if (!remote.on) {
      body = `<p class="notice">The shared leaderboard works when Gyaan Arena is opened from its claude.ai link while signed in. On this view only the device leaderboard is available.</p>`;
    } else {
      const rows = remote.board.map((p) => ({ ...p, isMe: p.owner === remote.uid && p.key === me.key })).sort((a, b) => b.xp - a.xp).slice(0, 100);
      body = boardRows(rows) + `<p class="small muted">${me.demo ? "The demo player isn't posted to the shared board. Create your own player to join." : remote.ro ? "You can see the board, but this link doesn't let you post scores. Ask the owner for Contributor access." : "Your score updates after each quiz and game."}</p>`;
    }
    return `<section class="stack"><h2>Leaderboard</h2>
        <div class="seg" role="group" aria-label="Leaderboard scope"><button data-act="boardTab" data-t="device" aria-pressed="${ui.boardTab === "device"}">This device</button><button data-act="boardTab" data-t="all" aria-pressed="${ui.boardTab === "all"}">Everyone</button></div></section>
      <section class="card">${body}</section>`;
  }

  // ---------- Progress ----------
  function vProgress() {
    const g = ui.progGrade ?? me.maxGrade;
    const acc = me.stats.answered ? Math.round((me.stats.correct / me.stats.answered) * 100) : 0;
    const path = GRADES.map((x) => {
      const p = gradeProgress(x), state = x < me.maxGrade ? "done" : x === me.maxGrade ? "now" : "locked";
      return `<button class="card stack" data-act="progGrade" data-g="${x}" style="gap:6px;text-align:left;${g === x ? "border-color:var(--accent);box-shadow:0 0 0 2px var(--accent) inset" : ""}">
        <span class="label">${state === "done" ? "Unlocked" : state === "now" ? "Current" : "Locked"}</span><b class="num" style="font-size:20px">${gname(x)}</b>
        <div class="bar"><i style="width:${Math.round((p.done / p.total) * 100)}%"></i></div><span class="small muted">${p.done}/${p.total} skills at 2★</span></button>`;
    }).join("");
    const rows = SUBJECTS.map((sj) => SKILLS.filter((k) => k.s === sj.id && k.g === g).map((k) => {
      const s = me.skills[k.id], a = recentAcc(k.id);
      return `<tr><td><span class="row" style="gap:8px;flex-wrap:nowrap"><i class="subj s-${k.s}"></i>${sj.n}</span></td><td>${esc(k.n)}</td><td>${starHtml(stars(k.id))}</td><td class="num">${a == null ? "–" : Math.round(a * 100) + "%"}</td><td class="num">${s ? s.a : 0}</td>
        <td>${g <= me.maxGrade ? `<button class="btn" data-act="practise" data-sid="${k.id}">Practise</button>` : ""}</td></tr>`;
    }).join("")).join("");
    return `<section class="row" style="justify-content:space-between"><div class="row">${avatar(me, 64)}<div><h2>${esc(me.name)}</h2><span class="muted small">${me.demo ? "Demo player · progress is just for trying things out" : "Started in " + gname(me.startGrade)}</span></div></div>
        <div class="row">${photoControls()}<button class="btn" data-act="logout">Switch player</button></div></section>
      ${mistakesCard(5)}
      <section class="card statline">
        <span class="stat small muted"><b class="num" style="color:var(--ink)">${me.stats.answered}</b>questions answered</span>
        <span class="stat small muted"><b class="num" style="color:var(--ink)">${acc}%</b>accuracy</span>
        <span class="stat small muted"><b class="num" style="color:var(--ink)">${me.stats.quizzes}</b>quizzes</span>
        <span class="stat small muted"><b class="num" style="color:var(--ink)">${me.stats.perfect}</b>perfect rounds</span>
        <span class="stat small muted"><b class="num" style="color:var(--ink)">${mastered()}</b>skills at 2★+</span>
      </section>
      <section class="stack"><h3>Grade path</h3><div class="grid3" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">${path}</div></section>
      <section class="card stack"><h3>${gname(g)} skills</h3>
        <div class="table-wrap"><table><thead><tr><th>Subject</th><th>Chapter</th><th>Mastery</th><th class="num">Recent</th><th class="num">Answered</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>
      <section class="card stack"><h3>Badges</h3><div class="badges">${BADGES.map(([n, d, f]) => `<div class="badge ${f(me) ? "" : "locked"}"><b>${n}</b><span class="small muted">${d}</span></div>`).join("")}</div></section>`;
  }

  // ---------- Events ----------
  const A = {
    go: (d) => go(d.v),
    loginTab: (d) => { ui.loginTab = d.t; render(); },
    su: (d, el) => {
      ui.su[d.k] = d.k === "grade" ? Number(d.val) : d.val;
      el.parentElement.querySelectorAll("[aria-pressed]").forEach((b) => b.setAttribute("aria-pressed", String(b === el)));
      const pv = $("#suPreview"); if (pv) pv.innerHTML = avatar({ name: "New player", look: { skin: ui.su.skin, shirt: ui.su.shirt }, photo: ui.su.photo }, 88);
    },
    pick: (d) => { const i = $("#siName"); i.value = accounts[d.key]?.name || ""; $("#siPin").focus(); },
    demo: () => { me = normalize(accounts.demo || demoPlayer()); ui.grade = me.maxGrade; save(); store.set("ga.session", "demo"); toast("You're the demo player. Create your own player to save real progress."); go("home"); },
    logout: () => { me = null; store.set("ga.session", null); ui.loginTab = Object.keys(accounts).length ? "in" : "new"; go("login"); },
    subj: (d) => { ui.subject = d.id; render(); },
    grade: (d) => { ui.grade = Number(d.g); render(); },
    progGrade: (d) => { ui.progGrade = Number(d.g); render(); },
    practise: (d) => { if (SKILL[d.sid].g > me.maxGrade) return toast("That grade is still locked."); startQuiz(d.sid); },
    daily: () => startDaily(),
    answer: (d) => answer(Number(d.i)),
    next: () => nextQ(),
    game: (d) => startGame(d.g),
    sOp: (d) => { game.op = d.o; render(); },
    sLvl: (d) => { game.lvl = Number(d.l); render(); },
    sStart: () => { game.phase = "play"; game.t = 60; game.score = 0; sprintQ(); render(); tick(() => endGame("sprint", game.score)); },
    key: (d) => sprintKey(d.k),
    tile: (d) => tap24(Number(d.i)),
    op: (d) => { game.op = game.op === d.o ? null : d.o; render(); },
    undo24: () => { if (game.hist.length) { game.tiles = game.hist.pop(); game.sel = null; game.op = null; game.msg = ""; render(); } },
    reset24: () => { reset24(); render(); },
    new24: () => { new24(); render(); },
    show24: () => { game.reveal = true; render(); },
    letter: (d) => pickLetter(Number(d.i)),
    clearL: () => { game.letters.forEach((x) => (x.used = false)); game.picked = []; render(); },
    shuffleL: () => { game.letters.forEach((x) => (x.used = false)); game.picked = []; game.letters = R.shuffle(game.letters); render(); },
    skipW: () => { game.msg = `It was "${game.word}".`; const m = game.msg; scrambleWord(); game.msg = m; render(); },
    tf: (d) => judge(d.v === "1"),
    shopCat: (d) => { ui.shopCat = d.c; render(); },
    buy: (d) => {
      const it = SHOP_BY_ID[d.id]; if (!it || me.owned.includes(it.id)) return;
      if (me.coins < it.price) return toast(`You need ${it.price - me.coins} more coins.`);
      me.coins -= it.price; me.owned.push(it.id); me.eq[it.cat] = it.id; save(); pushRemote(); toast(`${it.name} is yours!`); render();
    },
    equip: (d) => { const it = SHOP_BY_ID[d.id]; me.eq[it.cat] = it.id; save(); pushRemote(); render(); },
    unequip: (d) => { delete me.eq[d.c]; save(); pushRemote(); render(); },
    look: (d) => { me.look[d.k] = d.val; save(); pushRemote(); render(); },
    boardTab: (d) => { ui.boardTab = d.t; render(); },
    lesson: (d) => openLesson(d.sid, d.mid),
    lessonBack: () => { const f = lesson?.from; go(f === "quiz" && !quiz ? "learn" : f && f !== "login" && f !== "lesson" ? f : "home"); },
    lPlay: () => { lesson.playing = !lesson.playing; if (lesson.playing) speak(sceneSpeech(lesson.scenes[lesson.i])); else hush(); render(); },
    lSeek: (d) => seekScene(Number(d.i)),
    lVoice: () => { lesson.voice = !lesson.voice; if (lesson.voice && lesson.playing) speak(sceneSpeech(lesson.scenes[lesson.i])); else hush(); render(); },
    askWhy: () => askWhy(),
    rmPhoto: () => { delete me.photo; save(); toast("Back to your cartoon face."); render(); },
  };
  document.addEventListener("change", (e) => {
    if (e.target.id === "photoIn" || e.target.id === "suPhotoIn") { processPhoto(e.target.files && e.target.files[0], e.target.id === "suPhotoIn"); e.target.value = ""; }
  });
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-act]");
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (fn) { e.preventDefault(); fn(el.dataset, el); }
  });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-form]"); if (!f) return;
    e.preventDefault();
    (f.dataset.form === "signup" ? doSignup : doSignin)();
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, select, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
    if (view === "quiz" && quiz && !quiz.done) {
      if (/^[1-4]$/.test(e.key) && quiz.answered == null) answer(Number(e.key) - 1);
      else if (e.key === "Enter" && quiz.answered != null) { e.preventDefault(); nextQ(); }
    } else if (view === "lesson" && lesson) {
      if (e.key === " ") { e.preventDefault(); A.lPlay(); }
      else if (e.key === "ArrowRight" && lesson.i < lesson.scenes.length - 1) seekScene(lesson.i + 1);
      else if (e.key === "ArrowLeft" && lesson.i > 0) seekScene(lesson.i - 1);
    } else if (view === "game-sprint") {
      if (/^\d$/.test(e.key)) sprintKey(e.key);
      else if (e.key === "Backspace") sprintKey("⌫");
    } else if (view === "game-flash") {
      if (e.key === "t" || e.key === "T" || e.key === "ArrowLeft") judge(true);
      if (e.key === "f" || e.key === "F" || e.key === "ArrowRight") judge(false);
    } else if (view === "game-scramble" && game?.phase === "play" && /^[a-z]$/i.test(e.key)) {
      const i = game.letters.findIndex((l) => !l.used && l.ch === e.key.toLowerCase());
      if (i >= 0) pickLetter(i);
    }
  });

  // ---------- Boot ----------
  const sess = store.get("ga.session");
  if (sess && accounts[sess]) { me = normalize(accounts[sess]); ui.grade = me.maxGrade; view = "home"; }
  else if (Object.keys(accounts).length) ui.loginTab = "in";
  render();
  initRemote();
})();
