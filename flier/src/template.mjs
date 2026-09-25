// Builds the complete HTML for one flier version (A4 portrait).
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import QRCode from 'qrcode';
import { fontFaceCSS } from './fonts.mjs';
import { contact } from './versions.mjs';

const require = createRequire(import.meta.url);
const asset = (name) => `data:image/jpeg;base64,${readFileSync(new URL(`../assets/${name}`, import.meta.url)).toString('base64')}`;
const photo = asset('classroom-photo.jpg');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Phosphor icons (filled weight), coloured through CSS.
const icon = (name) =>
  readFileSync(require.resolve(`@phosphor-icons/core/assets/fill/${name}-fill.svg`), 'utf8').replace('<svg ', '<svg class="icon" aria-hidden="true" ');

// Chunky maths symbols drawn as rounded bars, so they read clearly from a distance.
const mathSymbol = (sym) => {
  const bar = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const shapes = {
    plus: bar(-10, 0, 10, 0) + bar(0, -10, 0, 10),
    minus: bar(-10, 0, 10, 0),
    times: bar(-7.5, -7.5, 7.5, 7.5) + bar(-7.5, 7.5, 7.5, -7.5),
    divide: bar(-10, 0, 10, 0) + '<circle cx="0" cy="-8" r="2.9" class="dot"/><circle cx="0" cy="8" r="2.9" class="dot"/>',
  };
  return `<svg viewBox="-16 -16 32 32" aria-hidden="true">${shapes[sym]}</svg>`;
};

const burst = (side) =>
  `<svg class="burst ${side}" viewBox="0 0 26 30" aria-hidden="true"><g stroke-linecap="round" stroke-width="3.4">
    <line x1="22" y1="5" x2="6" y2="0.5"/><line x1="23" y1="15" x2="3" y2="15"/><line x1="22" y1="25" x2="6" y2="29.5"/></g></svg>`;

const arrow = `<svg class="arrow" viewBox="0 0 48 30" aria-hidden="true"><g fill="none" stroke="#f6bf10" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 25 C16 26 30 20 40 7"/><path d="M29 7.5 L40 6 L41.5 17"/></g></svg>`;

const priceCard = (p, big = false) => `
  <div class="price-card${big ? ' big' : ''}">
    <div class="head"><div class="label">${esc(p.label)}</div>${p.sub ? `<div class="sub">${esc(p.sub)}</div>` : ''}</div>
    <div class="body">
      <div class="amounts"><span class="was">£${p.was}</span><span class="now">£${p.now}</span></div>
      <div class="meta"><span class="per">per hour</span><span class="save">Save £${p.was - p.now}</span></div>
    </div>
  </div>`;

const whereCard = (w) => `
  <div class="info-card">
    <div class="ic">${icon('map-pin')}</div>
    <div class="txt"><div class="k">Where</div><div class="v">${esc(w.title)}</div><div class="d">${esc(w.detail)}</div></div>
  </div>`;

const whenCard = (w) => {
  if (w.flexible) {
    return `
  <div class="info-card">
    <div class="ic">${icon('calendar-check')}</div>
    <div class="txt"><div class="k">When</div><div class="v">${esc(w.title)}</div><div class="d">${esc(w.detail)}</div></div>
  </div>`;
  }
  return `
  <div class="info-card">
    <div class="ic">${icon('calendar-check')}</div>
    <div class="txt"><div class="k">When</div>
      <div class="slots">${w.slots.map((s) => `<div class="slot"><span class="day">${esc(s.day)}</span><span class="time">${esc(s.time)}</span></div>`).join('')}</div>
    </div>
  </div>`;
};

// Student review: portrait (or a quote mark if there is no photo), the quote, and the star rating.
const reviewCard = (r) => `
  <section class="review">
    ${r.photo
      ? `<div class="avatar"><img src="${asset(r.photo)}" alt="${esc(r.name)}"><span class="qb">${icon('quotes')}</span></div>`
      : `<div class="qm">${icon('quotes')}</div>`}
    <div class="rv">
      <p class="quote">“${esc(r.quote)}”</p>
      <div class="by">${r.name ? `<b>${esc(r.name)}</b><span class="dot">·</span>` : ''}${esc(r.by)}</div>
    </div>
    <div class="rating"><div class="stars">${icon('star').repeat(5)}</div><span>5-star<br>reviews</span></div>
  </section>`;

const offer = (v) => {
  if (v.prices.length > 1) {
    return `
  <section class="offer offer-tiers">
    <div class="prices">${v.prices.map((p) => priceCard(p)).join('')}</div>
    <div class="info">${whereCard(v.where)}${whenCard(v.when)}</div>
  </section>`;
  }
  return `
  <section class="offer offer-single">
    ${priceCard(v.prices[0], true)}
    <div class="info stack">${whereCard(v.where)}${whenCard(v.when)}</div>
  </section>`;
};

// bleedMm > 0 adds a printer's bleed: the sheet grows on every side and edge-to-edge colour runs into it.
export async function renderFlier(v, { bleedMm = 0 } = {}) {
  const qr = await QRCode.toString(v.qr, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#0b1a3b', light: '#ffffff' } });

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>Highview Tutors | Maths Tutoring | ${esc(v.name)}</title>
<style>
${fontFaceCSS()}
@page { size: ${210 + 2 * bleedMm}mm ${297 + 2 * bleedMm}mm; margin: 0; }
:root {
  --navy: #0b1a3b;
  --navy-2: #162a5c;
  --yellow: #f6bf10;
  --gold: #c99400;
  --cream: #fff4d1;
  --muted: #4a5775;
  --line: #d9deea;
  --red: #e0352b;
  --wa: #25d366;
  --side: 40px;
  --bleed: ${bleedMm}mm;
  --footer: 136px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #fff; }
body { font-family: 'Poppins', sans-serif; color: var(--navy); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.sheet { position: relative; width: calc(210mm + 2 * var(--bleed)); height: calc(297mm + 2 * var(--bleed)); overflow: hidden; background: #fff; }
.page { position: absolute; left: var(--bleed); top: var(--bleed); width: 210mm; height: 297mm; overflow: ${bleedMm ? 'visible' : 'hidden'}; background: #fff; }
.main { position: absolute; top: 0; left: 0; right: 0; bottom: var(--footer); display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 14px; }

/* decoration */
.dots { position: absolute; background-image: radial-gradient(var(--yellow) 2.1px, transparent 2.6px); background-size: 13px 13px; }
.dots.tl { top: 14px; left: 14px; width: 92px; height: 118px; -webkit-mask-image: linear-gradient(135deg, #000 20%, transparent 85%); }
.dots.tr { top: 150px; right: 10px; width: 60px; height: 100px; -webkit-mask-image: linear-gradient(225deg, #000 10%, transparent 80%); }
.ghost { position: absolute; width: 44px; height: 44px; opacity: .14; }
.ghost svg { width: 100%; height: 100%; stroke: var(--navy); stroke-width: 5; stroke-linecap: round; fill: none; }
.ghost svg .dot { fill: var(--navy); stroke: none; }

/* header */
.brand { position: relative; text-align: center; padding-top: 22px; }
.wordmark { font-weight: 800; font-size: 58px; letter-spacing: -1.8px; line-height: 1.02; }
.wordmark .tt { color: var(--yellow); }
.tagline { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 6px; font-weight: 600; font-size: 12.5px; letter-spacing: 3.2px; }
.tagline .rule { width: 44px; height: 2px; background: var(--navy); border-radius: 2px; }
.tagline b { color: var(--gold); font-weight: 700; }

/* hero */
.hero { position: relative; text-align: center; margin-top: 12px; }
.headline { display: flex; align-items: center; justify-content: center; gap: 16px; font-weight: 900; font-size: 70px; line-height: 1; letter-spacing: -2.2px; }
.headline .hl { display: inline-block; background: var(--yellow); padding: 3px 16px 7px; border-radius: 16px; transform: rotate(-2.5deg); box-shadow: 5px 6px 0 var(--navy); }
.banner-wrap { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; }
.banner { display: flex; align-items: center; gap: 14px; background: var(--navy); color: #fff; font-weight: 800; font-size: 19.5px; letter-spacing: .6px; text-transform: uppercase; padding: 8px 28px 7px; border-radius: 14px; transform: skewX(-9deg); }
.banner > * { transform: skewX(9deg); }
.banner .sep { width: 9px; height: 9px; border-radius: 50%; background: var(--yellow); }
.banner .y { color: var(--yellow); }
.burst { width: 24px; height: 28px; stroke: var(--yellow); }
.burst.right { transform: scaleX(-1); }

/* classroom photo + floating maths symbols */
.photo { position: relative; flex: 1 1 0; min-height: 260px; max-height: 468px; display: flex; flex-direction: column; margin: 18px var(--side) 0; }
.photo .frame { flex: 1; border-radius: 18px; overflow: hidden; box-shadow: 7px 8px 0 var(--yellow); }
.photo img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%; }
.sym { position: absolute; width: 50px; height: 50px; border-radius: 50%; border: 4px solid #fff; display: grid; place-items: center; box-shadow: 0 3px 0 rgba(11,26,59,.18); }
.sym svg { width: 30px; height: 30px; stroke-width: 5.2; stroke-linecap: round; fill: none; }
.sym.y { background: var(--yellow); } .sym.y svg { stroke: var(--navy); } .sym.y .dot { fill: var(--navy); stroke: none; }
.sym.n { background: var(--navy); } .sym.n svg { stroke: var(--yellow); } .sym.n .dot { fill: var(--yellow); stroke: none; }
.sym.s1 { left: -22px; top: 24px; transform: rotate(-8deg); }
.sym.s2 { left: -20px; bottom: 36px; }
.sym.s3 { right: -24px; top: 20px; }
.sym.s4 { right: -22px; bottom: 44px; transform: rotate(10deg); }

/* offer: prices + where/when */
.offer { margin: 26px var(--side) 0; }

/* review */
.review { display: flex; align-items: center; gap: 22px; margin: 16px var(--side) 0; border: 2px solid var(--navy); border-radius: 16px; padding: 12px 22px 12px 16px; }
.review .qm { flex: none; width: 52px; height: 52px; border-radius: 50%; background: var(--yellow); display: grid; place-items: center; }
.review .qm .icon { width: 29px; height: 29px; fill: var(--navy); }
.avatar { position: relative; flex: none; width: 96px; height: 96px; }
.avatar img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--yellow); }
.avatar .qb { position: absolute; right: 0; bottom: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--navy); border: 2px solid #fff; display: grid; place-items: center; }
.avatar .qb .icon { width: 17px; height: 17px; fill: var(--yellow); }
.review .rv { flex: 1; }
.review .quote { font-size: 18px; font-weight: 700; line-height: 1.3; text-wrap: balance; }
.review .by { font-size: 12.5px; font-weight: 500; color: var(--muted); margin-top: 5px; }
.review .by b { font-weight: 700; color: var(--navy); }
.review .by .dot { margin: 0 7px; color: var(--gold); font-weight: 800; }
.rating { flex: none; align-self: stretch; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; padding-left: 22px; border-left: 1.5px solid var(--line); }
.rating .stars { display: flex; gap: 2px; }
.rating .icon { width: 18px; height: 18px; fill: var(--yellow); }
.rating span { font-size: 10.5px; font-weight: 800; letter-spacing: 1.8px; line-height: 1.35; text-transform: uppercase; text-align: center; color: var(--gold); }
.prices { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.price-card { border: 2px solid var(--navy); border-radius: 14px; overflow: hidden; text-align: center; background: #fff; box-shadow: 0 4px 0 rgba(11,26,59,.12); }
.price-card .head { background: var(--navy); color: #fff; padding: 6px 8px 6px; }
.price-card .label { font-weight: 800; font-size: 16px; letter-spacing: .6px; text-transform: uppercase; line-height: 1.2; }
.price-card .sub { font-size: 11.5px; font-weight: 600; color: var(--yellow); line-height: 1.3; }
.price-card .body { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 10px 8px 10px; }
.amounts { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.was { position: relative; font-size: 18px; font-weight: 700; color: #7b86a0; }
.was::after { content: ''; position: absolute; left: -4px; right: -4px; top: 50%; height: 2.6px; background: var(--red); border-radius: 2px; transform: rotate(-14deg); }
.now { font-size: 48px; font-weight: 800; letter-spacing: -1.2px; margin-top: 1px; }
.meta { display: flex; flex-direction: column; align-items: center; gap: 5px; }
.per { font-size: 12px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; white-space: nowrap; }
.save { background: var(--yellow); font-weight: 800; font-size: 13.5px; letter-spacing: .4px; text-transform: uppercase; padding: 3px 11px 2px; border-radius: 7px; white-space: nowrap; }

.info { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 12px; }
.info-card { display: flex; gap: 14px; align-items: center; background: var(--cream); border-radius: 14px; padding: 12px 16px; }
.info-card .ic { flex: none; width: 46px; height: 46px; border-radius: 13px; background: var(--navy); display: grid; place-items: center; }
.info-card .ic .icon { width: 27px; height: 27px; fill: var(--yellow); }
.info-card .k { font-size: 11px; font-weight: 800; letter-spacing: 2.2px; text-transform: uppercase; color: var(--gold); line-height: 1.2; }
.info-card .v { font-size: 17px; font-weight: 800; line-height: 1.25; }
.info-card .d { font-size: 13.5px; font-weight: 500; color: var(--muted); line-height: 1.35; }

/* single-price versions: one big card beside where/when */
.offer-single { display: grid; grid-template-columns: 262px 1fr; gap: 14px; }
.price-card.big { display: flex; flex-direction: column; }
.price-card.big .head { padding: 10px 8px; }
.price-card.big .label { font-size: 18px; }
.price-card.big .body { flex: 1; gap: 12px; padding: 8px 10px 10px; }
.price-card.big .was { font-size: 23px; }
.price-card.big .now { font-size: 68px; letter-spacing: -1.8px; }
.price-card.big .meta { gap: 8px; }
.price-card.big .per { font-size: 13.5px; }
.price-card.big .save { font-size: 15px; padding: 4px 12px 3px; }
.info.stack { grid-template-columns: 1fr; margin-top: 0; gap: 12px; }
.info.stack .info-card { padding: 12px 16px; }
.info.stack .v { font-size: 18px; }
.info.stack .d { font-size: 14px; }
.slots { display: flex; gap: 10px; margin-top: 4px; }
.slot { background: #fff; border: 2px solid var(--navy); border-radius: 11px; padding: 3px 15px 4px; line-height: 1.15; }
.slot .day { display: block; font-size: 11.5px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: var(--gold); }
.slot .time { display: block; font-size: 21px; font-weight: 800; letter-spacing: -.2px; }

/* footer */
.footer { position: absolute; left: calc(-1 * var(--bleed)); right: calc(-1 * var(--bleed)); bottom: calc(-1 * var(--bleed)); height: calc(var(--footer) + var(--bleed)); background: var(--navy); color: #fff; }
.footer::before { content: ''; position: absolute; left: 0; right: 0; top: -1px; height: 6px; background: var(--yellow); clip-path: polygon(0 0, 100% 0, 100% 0, 0 100%); }
.footer .row { position: absolute; left: calc(var(--side) + var(--bleed)); right: calc(var(--side) + var(--bleed)); top: 14px; display: flex; align-items: center; }
.wa { flex: none; width: 58px; height: 58px; border-radius: 50%; background: var(--wa); display: grid; place-items: center; }
.wa .icon { width: 38px; height: 38px; fill: #fff; }
.call { margin-left: 14px; }
.call .k { font-size: 13px; font-weight: 600; letter-spacing: 1.6px; text-transform: uppercase; }
.call .k b { color: var(--yellow); font-weight: 800; }
.call .num { font-size: 36px; font-weight: 800; letter-spacing: .5px; line-height: 1.05; }
.footer .vr { width: 2px; height: 58px; background: rgba(255,255,255,.28); margin: 0 18px 0 22px; }
.msg { display: flex; align-items: flex-end; gap: 4px; font-size: 12.5px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; line-height: 1.35; }
.arrow { width: 40px; height: 26px; margin-bottom: 2px; }
.qr { margin-left: auto; flex: none; width: 98px; height: 98px; background: #fff; border-radius: 12px; padding: 7px; }
.qr svg { display: block; width: 100%; height: 100%; }
.contacts { position: absolute; left: calc(var(--side) + var(--bleed)); bottom: calc(20px + var(--bleed)); display: flex; align-items: center; gap: 12px; font-size: 11.5px; color: #d6dcea; }
.contacts span { display: inline-flex; align-items: center; gap: 6px; }
.contacts .icon { width: 15px; height: 15px; fill: var(--yellow); }
.contacts i { width: 1.5px; height: 13px; background: rgba(255,255,255,.3); }
.stripe { position: absolute; left: 0; right: 0; bottom: 0; height: calc(7px + var(--bleed)); background: var(--yellow); }
</style>
</head>
<body>
<div class="sheet"><div class="page">
  <div class="dots tl"></div>
  <div class="dots tr"></div>
  <div class="ghost" style="top:40px; right:70px; transform:rotate(12deg)">${mathSymbol('plus')}</div>
  <div class="ghost" style="top:212px; left:30px; width:34px; height:34px; transform:rotate(-10deg)">${mathSymbol('times')}</div>

  <div class="main">
  <header class="brand">
    <div class="wordmark">Highview <span class="tt">Tutors</span></div>
    <div class="tagline"><span class="rule"></span><span>EXPERT TUTORS. <b>PROVEN RESULTS.</b></span><span class="rule"></span></div>
  </header>

  <section class="hero">
    <h1 class="headline"><span class="hl">Maths</span><span>Tutoring</span></h1>
    <div class="banner-wrap">
      ${burst('left')}
      <div class="banner"><span>Ages <span class="y">7–17</span></span><span class="sep"></span><span>Online &amp; in West Ealing</span></div>
      ${burst('right')}
    </div>
  </section>

  <section class="photo">
    <div class="frame"><img src="${photo}" alt="Teacher and pupil pointing at area formulas on a classroom blackboard"></div>
    <div class="sym y s1">${mathSymbol('plus')}</div>
    <div class="sym n s2">${mathSymbol('minus')}</div>
    <div class="sym n s3">${mathSymbol('times')}</div>
    <div class="sym y s4">${mathSymbol('divide')}</div>
  </section>

  ${offer(v)}
${v.review ? reviewCard(v.review) : ''}

  </div>

  <footer class="footer">
    <div class="row">
      <div class="wa">${icon('whatsapp-logo')}</div>
      <div class="call">${v.freeConsultation ? '<div class="k">Book a <b>free</b> consultation</div>' : ''}<div class="num">${esc(contact.phone)}</div></div>
      <span class="vr"></span>
      <div class="msg"><span>Message us<br>on WhatsApp!</span>${arrow}</div>
      <div class="qr">${qr}</div>
    </div>
    <div class="contacts">
      <span>${icon('envelope-simple')}${esc(contact.email)}</span><i></i>
      <span>${icon('globe-simple')}${esc(contact.web)}</span><i></i>
      <span>${icon('map-pin')}${esc(contact.area)}</span>
    </div>
    <div class="stripe"></div>
  </footer>
</div></div>
</body>
</html>`;
}
