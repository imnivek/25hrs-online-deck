/* ============================================================
   25HRS 線上分享會　精簡版 12 頁　獨立引擎
   一人三頁：核心提問（引起動機）→ 關鍵內容 → 收束
   ============================================================ */
(() => {
'use strict';
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const WHO = {
  kevin:   { nm:'KEVIN',    role:'行銷長',  img:'kevin' },
  rebecca: { nm:'REBECCA',  role:'營運長',  img:'rebecca' },
  ainstein:{ nm:'AINSTEIN', role:'執行長',  img:'AINSTEIN' },
  andy:    { nm:'ANDY',     role:'投資長',  img:'andy' }
};

const POLL = { opts:[['A','錢　資金卡住了'],['B','人　找不到對的夥伴'],
  ['C','通路　東西賣不出去'],['D','門道　知道有路但進不去']], pct:[34,22,16,28] };

const QUIZ = [
  { k:'A', t:'自動代操<br><b>每月穩定</b>套利 2%', flags:3,
    why:'「每月」＋「穩定」＋「代操」。這三個詞同時出現，先停下來。' },
  { k:'B', t:'境外年金型商品<br>年配息 9%', flags:1, q:true,
    why:'不是紅的也不是綠的。差別不在商品，<b>在您有沒有那條渠道</b>。' },
  { k:'C', t:'海外商辦包租<br>年化 17%，綁約 5 年', flags:3,
    why:'報酬最高、標的最遠、綁約最久。三個一起來的時候，通常不是機會。' },
  { k:'D', t:'美元定存<br>年化 3.5%', flags:0, ok:true,
    why:'最無聊的那一個，也是唯一您今天下午就能查清楚的那一個。' }
];

const MIRRORS = [
  ['誰在保管您的錢？', '金流走銀行體系，還是走某個私人帳戶'],
  ['在哪一國、受哪個主管機關監理？', '查得到牌照，才有申訴的地方'],
  ['報酬從哪來？誰在付這個利息？', '說不清楚來源的收益，來源通常是下一個人'],
  ['出場條件是什麼？', '綁約幾年、能不能提前贖回、贖回付多少'],
  ['「穩定」「保證」「保本」出現幾次？', '出現越多次，越該退一步']
];

/* 舞台縮放：絕對定位置中，任何視窗都不會跑版 */
const stage = $('#stage');
const fit = () => stage.style.setProperty('--scale',
  Math.min(innerWidth / 1920, innerHeight / 1080));
addEventListener('resize', fit); fit();

const slides = $$('.slide');
let cur = 0, step = 0;

const has = (s, k) => s.dataset[k] !== undefined;
const STEPS = { poll:2, flip:4, kill:4, quiz:5, mirrors:5, offer:1 };
function maxStep(s) {
  if (has(s, 'flip')) return 4;
  for (const k in STEPS) if (has(s, k)) return STEPS[k];
  return +(s.dataset.steps || 0);
}

const H = {
  poll(s, n) {
    const b = $('#poll', s);
    if (!b.dataset.built) { b.dataset.built = 1;
      b.innerHTML = POLL.opts.map(([k, t], i) =>
        `<div class="bar"><div class="fill"></div><span class="opt"><b>${k}</b>　${t}</span>
         <span class="cnt">${POLL.pct[i]}%</span></div>`).join(''); }
    $$('.bar', b).forEach((x, i) => {
      x.querySelector('.fill').style.width = n >= 1 ? POLL.pct[i] + '%' : '0%';
      x.querySelector('.cnt').style.opacity = n >= 1 ? 1 : 0;
      x.classList.toggle('is-answer', n >= 1 && POLL.pct[i] === Math.max(...POLL.pct));
    });
    s.classList.toggle('show-punch', n >= 2);
  },
  flip(s, n) {
    $$('.myth', s).forEach((m, i) => m.classList.toggle('is-flipped', i < n));
    s.classList.toggle('show-punch', n >= 1);
  },
  kill(s, n) {
    $$('.wo-card', s).forEach((c, i) => c.classList.toggle('is-out', i < n));
    s.classList.toggle('show-punch', n >= 4);
  },
  quiz(s, n) {
    const g = $('#quiz', s);
    if (!g.dataset.built) { g.dataset.built = 1;
      g.innerHTML = QUIZ.map(q => `<div class="qcard">
        <div class="qk">${q.k}</div><div class="qt">${q.t}</div>
        <div class="qflags">${'<svg class="ic ic-32 ic--clay flag" viewBox="0 0 24 24"><use href="#iflag"/></svg>'.repeat(q.flags)}
          ${q.q ? '<svg class="ic ic-32 ic--azure flag" viewBox="0 0 24 24"><use href="#iq"/></svg>' : ''}
          ${q.ok ? '<svg class="ic ic-32 ic--jade flag" viewBox="0 0 24 24"><use href="#ick"/></svg>' : ''}</div>
        <div class="qwhy">${q.why}</div></div>`).join(''); }
    $$('.qcard', g).forEach((c, i) => {
      const on = i < n; c.classList.toggle('is-revealed', on);
      $$('.flag', c).forEach((f, k) =>
        setTimeout(() => f.classList.toggle('is-up', on), on ? k * 160 : 0));
    });
    s.classList.toggle('show-punch', n >= 5);
  },
  mirrors(s, n) {
    const b = $('#mirrors', s);
    if (!b.dataset.built) { b.dataset.built = 1;
      b.innerHTML = MIRRORS.map((m, i) => `<div class="mirror">
        <span class="mno">${String(i + 1).padStart(2, '0')}</span>
        <div><b class="h3">${m[0]}</b><p class="small">${m[1]}</p></div></div>`).join(''); }
    $$('.mirror', b).forEach((m, i) => m.classList.toggle('is-on', i < n));
  },
  offer(s, n) {
    const box = $('#cd', s), t = $('#cdT', s), ring = $('.cd-fg', s), total = 900;
    if (!ring.dataset.len) { const L = 2 * Math.PI * 52;
      ring.dataset.len = L; ring.style.strokeDasharray = L; }
    const paint = left => {
      t.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
      ring.style.strokeDashoffset = (+ring.dataset.len) * (1 - left / total);
      box.classList.toggle('is-low', left <= 120);
      box.classList.toggle('is-done', left <= 0);
    };
    clearInterval(box._t);
    const remain = () => Math.max(0, Math.round((box._deadline - Date.now()) / 1000));
    if (n < 1 && !box._deadline) { paint(total); return; }
    if (!box._deadline) box._deadline = Date.now() + total * 1000;
    box.classList.add('is-run'); paint(remain());
    box._t = setInterval(() => { const r = remain(); paint(r); if (r <= 0) clearInterval(box._t); }, 1000);
  }
};

function applyStep(s, n) {
  $$('.reveal', s).forEach(r => r.classList.toggle('is-revealed', +r.dataset.step <= n));
  const k = Object.keys(H).find(x => has(s, x));
  if (k) H[k](s, n);
}

/* 資訊型頁面進頁自動鋪開；提問、翻卡、測驗、收單留給講者控節奏 */
const AUTO = new Set([2, 4, 7, 8, 10, 11]);
function clearAuto(s) { (s._auto || []).forEach(clearTimeout); s._auto = []; }
function autoPlay(s) {
  clearAuto(s); const m = maxStep(s); if (!m) return;
  if (REDUCED) { step = m; applyStep(s, m); return; }
  s._auto = [];
  for (let k = 1; k <= m; k++)
    s._auto.push(setTimeout(() => {
      if (slides[cur] !== s) return;
      step = k; applyStep(s, k); if (k === m) s._auto = [];
    }, k * 520));
}

function chrome() {
  const s = slides[cur], w = WHO[s.dataset.who];
  $('#who').innerHTML = w
    ? `<img src="assets/img/speakers/${w.img}-avatar.webp" alt="${w.nm}">
       <div><b>${w.nm}</b><span>${w.role}</span></div>` : '';
  $('#pgN').textContent = String(cur + 1).padStart(2, '0');
}

function show(i) {
  if (i < 0 || i >= slides.length) return;
  const prev = slides[cur], next = slides[i];
  if (prev !== next) { clearAuto(prev); prev.classList.remove('is-active'); }
  if (!REDUCED && prev !== next) {
    const w = $('#wipe'); w.classList.remove('is-running'); void w.offsetWidth; w.classList.add('is-running');
  }
  next.classList.add('is-active', 'slide--in');
  setTimeout(() => next.classList.remove('slide--in'), 700);
  cur = i; step = 0; applyStep(next, 0); chrome();
  if (AUTO.has(i + 1)) autoPlay(next);
}

function next() {
  const s = slides[cur];
  if (s._auto && s._auto.length) { clearAuto(s); step = maxStep(s); applyStep(s, step); return; }
  if (step < maxStep(s)) { step++; applyStep(s, step); } else show(cur + 1);
}
function prev() {
  const s = slides[cur];
  if (step > 0) { step--; applyStep(s, step); }
  else if (cur > 0) { show(cur - 1); const p = slides[cur]; clearAuto(p); step = maxStep(p); applyStep(p, step); }
}

addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowRight': case ' ': case 'PageDown': e.preventDefault(); next(); break;
    case 'ArrowLeft':  case 'PageUp':            e.preventDefault(); prev(); break;
    case 'ArrowDown':  e.preventDefault(); show(cur + 1); break;
    case 'ArrowUp':    e.preventDefault(); show(cur - 1); break;
    case 'f': case 'F': document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); break;
    case 'r': case 'R': step = 0; applyStep(slides[cur], 0); break;
    default: if (/^[1-9]$/.test(e.key)) show(+e.key - 1);
  }
});
$('#pbar').onclick = e => {
  const b = e.target.closest('[data-nav]'); if (!b) return;
  ({ prev, next, full: () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen() })[b.dataset.nav]();
};
let hideT;
addEventListener('mousemove', () => { $('#pbar').classList.add('is-visible');
  clearTimeout(hideT); hideT = setTimeout(() => $('#pbar').classList.remove('is-visible'), 2000); });
stage.addEventListener('click', e => {
  if (e.target.closest('.btn, .myth, .qcard, a')) return; next();
});
addEventListener('click', e => {
  const btn = e.target.closest('.btn'); if (!btn || btn.disabled) return;
  const r = btn.getBoundingClientRect();
  const sc = +getComputedStyle(stage).getPropertyValue('--scale') || 1;
  const n = document.createElement('span'); n.className = 'ripple';
  n.style.left = (e.clientX - r.left) / sc + 'px';
  n.style.top  = (e.clientY - r.top)  / sc + 'px';
  n.style.transform = 'translate(-50%,-50%)';
  btn.appendChild(n); setTimeout(() => n.remove(), 460);
});

const QS = new URLSearchParams(location.search);
cur = Math.min(Math.max((+QS.get('s') || 1) - 1, 0), slides.length - 1);
slides[cur].classList.add('is-active');
step = QS.has('step') ? Math.min(+QS.get('step'), maxStep(slides[cur])) : 0;
applyStep(slides[cur], step);
chrome();
if (AUTO.has(cur + 1) && !QS.has('step')) autoPlay(slides[cur]);
window.__applyStep = applyStep; window.__maxStep = maxStep;
console.log('%c25HRS 精簡版　12 頁　│　→ 下一步　← 上一步　F 全螢幕　R 重置',
  'color:#d6b16a;font-size:13px');
})();
