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


// 引起動機文字雲：每一句今天都會被回答
const CLOUD = [
  { t:'您缺的不是努力',              lv:3, ax:0 },
  { t:'馬斯克也拿過政府的錢',        lv:2, ax:1 },
  { t:'台積電近一半是國家出的',      lv:2, ax:1 },
  { t:'戴森被銀行全部拒絕過',        lv:1, ax:1 },
  { t:'青創貸款，一輩子只能拿一次？', lv:2, ax:1 },
  { t:'不缺錢，也該去借',            lv:1, ax:1 },
  { t:'政府是您最大的客戶',          lv:1, ax:1 },
  { t:'開公司的唯一目的是什麼',      lv:2, ax:1 },
  { t:'有賺錢，帳上卻沒錢',          lv:3, ax:2 },
  { t:'高槓桿＝高風險？',            lv:2, ax:2 },
  { t:'9% 配息，是機會還是陷阱',     lv:2, ax:2 },
  { t:'最危險的是看起來像機會的',    lv:1, ax:2 },
  { t:'老闆的錢跟公司的錢',          lv:1, ax:2 },
  { t:'他們找夥伴的方式不一樣',      lv:3, ax:3 },
  { t:'換了幾百張名片，然後呢',      lv:2, ax:3 },
  { t:'不擅長社交就沒救了嗎',        lv:1, ax:3 },
  { t:'把半條命交給對手',            lv:1, ax:3 }
];

// 十大案例一頁版
const CASES10 = [
  { id:'nvidia',  p:'黃仁勳',       co:'NVIDIA',   n:'$40K 起家' },
  { id:'tsmc',    p:'張忠謀',       co:'台積電',    n:'國發基金 48%' },
  { id:'spacex',  p:'伊隆·馬斯克',  co:'SpaceX',   n:'$396M 里程碑補助' },
  { id:'dyson',   p:'詹姆士·戴森',  co:'Dyson',    n:'政府擔保貸款' },
  { id:'airbnb',  p:'布萊恩·切斯基', co:'Airbnb',  n:'$2B 緊急重組' },
  { id:'tesla',   p:'伊隆·馬斯克',  co:'Tesla',    n:'$465M 政府貸款' },
  { id:'alibaba', p:'馬雲',         co:'Alibaba',  n:'引入 CFO 立紀律' },
  { id:'tencent', p:'馬化騰',       co:'Tencent',  n:'轉向資本配置' },
  { id:'moderna', p:'史蒂芬·班塞爾', co:'Moderna', n:'無稀釋性資本' },
  { id:'irobot',  p:'柯林·安格爾',  co:'iRobot',   n:'SBIR 國防補助' }
];

// 四桌分群：階段 → 需求 → 對應工具 → 陪談的創辦人
const TABLES = [
  { no:'桌 01', who:'想創業，還沒創業', need:'先把資本結構架好，再開始燒錢',
    tool:'政策性貸款<br>青創　鳳凰', host:'Ainstein', img:'AINSTEIN' },
  { no:'桌 02', who:'已創業　幼年期', need:'需要更多資源當燃料，把事情跑起來',
    tool:'中小微貸款<br>WLB　小人提', host:'Rebecca', img:'rebecca' },
  { no:'桌 03', who:'已創業　壯年期', need:'想轉型，想長出第二曲線',
    tool:'SBIR　SIIR　SITI<br>數位轉型', host:'Rebecca ／ Kevin', img:'kevin' },
  { no:'桌 04', who:'金融槓桿．人脈破圈', need:'錢要用得對，圈子要進得去',
    tool:'資金結構與風險<br>高純度圈層', host:'Andy ／ Kevin', img:'andy' }
];

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
const STEPS = { flip:4, quiz:5, mirrors:5, offer:1, tables:2, tables2:2, cloud:1, cases10:2 };
function maxStep(s) {
  if (has(s, 'flip')) return 4;
  for (const k in STEPS) if (has(s, k)) return STEPS[k];
  return +(s.dataset.steps || 0);
}

function drawTables(box, s, n) {
  if (!box) return;
  if (!box.dataset.built) {
    box.dataset.built = 1;
    box.innerHTML = TABLES.map(t => `<div class="tb">
      <span class="no">${t.no}</span>
      <div class="who2">${t.who}</div>
      <div class="need">${t.need}</div>
      <div class="tool">${t.tool}</div>
      <div class="host"><img src="assets/img/speakers/${t.img}-avatar.webp" alt="${t.host}">${t.host}</div>
    </div>`).join('');
  }
  $$('.tb', box).forEach((c, i) => c.classList.toggle('is-on', n >= 1 || true));
  s.classList.toggle('show-punch', n >= 2);
}

function drawCloud(box, s, n) {
  if (!box.dataset.built) { box.dataset.built = 1;
    box.innerHTML = CLOUD.map(c => `<span class="cw cw--l${c.lv} cw--a${c.ax}">${c.t}</span>`).join(''); }
  (s._seq || []).forEach(clearTimeout); s._seq = [];
  const items = $$('.cw', box);
  if (n < 1) { items.forEach(x => x.classList.remove('is-on')); s.classList.remove('show-punch'); return; }
  if (REDUCED) { items.forEach(x => x.classList.add('is-on')); s.classList.add('show-punch'); return; }
  items.forEach((x, i) => s._seq.push(setTimeout(() => x.classList.add('is-on'), 80 + i * 120)));
  s._seq.push(setTimeout(() => s.classList.add('show-punch'), 80 + items.length * 120 + 400));
}

function drawCases(box, s, n) {
  if (!box.dataset.built) { box.dataset.built = 1;
    box.innerHTML = CASES10.map(c => `<figure class="c10">
      <img src="assets/img/cases/${c.id}.webp" alt="${c.p}">
      <figcaption><b>${c.p}</b><span>${c.co}</span><i>${c.n}</i></figcaption></figure>`).join(''); }
  $$('.c10', box).forEach((c, i) =>
    setTimeout(() => c.classList.toggle('is-on', n >= 1), n >= 1 ? i * 90 : 0));
  s.classList.toggle('show-concl', n >= 2);
}

const H = {
  cloud(s, n) { drawCloud($('#cloud', s), s, n); },
  cases10(s, n) { drawCases($('#cases10', s), s, n); },
  tables(s, n) { drawTables($('#tables', s), s, n); },
  tables2(s, n) { drawTables($('#tables2', s), s, n); },
  flip(s, n) {
    $$('.myth', s).forEach((m, i) => m.classList.toggle('is-flipped', i < n));
    s.classList.toggle('show-punch', n >= 1);
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
const AUTO = new Set([3, 4, 8, 9, 10, 13, 14, 15, 19, 23, 24, 25, 26]);
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
console.log('%c25HRS 實體場　27 頁　│　→ 下一步　← 上一步　F 全螢幕　R 重置',
  'color:#d6b16a;font-size:13px');
})();
