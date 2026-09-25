// Flat vector illustration: three children writing at a table while a tutor points at maths on the board.
// Built from simple shapes so it stays sharp at any print size and needs no stock-image licence.

const C = {
  navy: '#0b1a3b',
  board: '#17306a',
  boardFrame: '#0b1a3b',
  yellow: '#f6bf10',
  panel: '#fff4d1',
  panelDeep: '#ffe9a6',
  tableTop: '#f2d6a2',
  tableFront: '#dfb471',
  tableShadow: '#c99a55',
  paper: '#ffffff',
  paperLine: '#cfd6e4',
  ink: '#1d2340',
  cheek: '#ff8a80',
  chalk: '#ffffff',
  chalkYellow: '#ffd84d',
};

const W = 720;
const H = 300;
const TABLE_BACK = 230; // y of the table's back edge: bodies disappear behind it
const TABLE_FRONT = 258;

// ---------- props ----------
const pencil = (x1, y1, x2, y2) => {
  // pencil drawn from the tip (x1,y1) to the eraser end (x2,y2)
  const ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const len = Math.hypot(x2 - x1, y2 - y1);
  return `<g transform="translate(${x1} ${y1}) rotate(${ang})">
    <path d="M0 0 L9 -3.2 L9 3.2 Z" fill="#f3d2a8"/>
    <path d="M0 0 L3.2 -1.1 L3.2 1.1 Z" fill="${C.ink}"/>
    <rect x="9" y="-3.2" width="${len - 16}" height="6.4" fill="${C.yellow}"/>
    <rect x="9" y="-3.2" width="${len - 16}" height="2.1" fill="#ffd95a"/>
    <rect x="${len - 7}" y="-3.2" width="3" height="6.4" fill="#aeb6c6"/>
    <rect x="${len - 4}" y="-3.2" width="4" height="6.4" rx="1.6" fill="#ff8fa3"/>
  </g>`;
};

const openBook = (cx, y, w = 38) => {
  // open exercise book lying on the table, seen from the front and slightly above
  const back = y, front = y + 23;
  const lines = [];
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    const yy = back + (front - back) * t;
    lines.push(`<line x1="${cx - w - 4 * t + 6}" y1="${yy}" x2="${cx - 5}" y2="${yy}" stroke="${C.paperLine}" stroke-width="1.3"/>`);
    lines.push(`<line x1="${cx + 5}" y1="${yy}" x2="${cx + w + 4 * t - 6}" y2="${yy}" stroke="${C.paperLine}" stroke-width="1.3"/>`);
  }
  return `<g>
    <path d="M${cx - w - 5} ${front + 3} L${cx + w + 5} ${front + 3} L${cx + w + 1} ${back + 1} L${cx - w - 1} ${back + 1} Z" fill="${C.tableShadow}" opacity="0.35"/>
    <path d="M${cx} ${back + 2} Q${cx - w / 2} ${back - 3} ${cx - w} ${back} L${cx - w - 4} ${front} Q${cx - w / 2} ${front - 3} ${cx} ${front + 1} Z" fill="${C.paper}" stroke="#dde2ec" stroke-width="1"/>
    <path d="M${cx} ${back + 2} Q${cx + w / 2} ${back - 3} ${cx + w} ${back} L${cx + w + 4} ${front} Q${cx + w / 2} ${front - 3} ${cx} ${front + 1} Z" fill="${C.paper}" stroke="#dde2ec" stroke-width="1"/>
    <line x1="${cx}" y1="${back + 2}" x2="${cx}" y2="${front + 1}" stroke="#c9cfdb" stroke-width="1.4"/>
    ${lines.join('')}
  </g>`;
};

const bookStack = (x, baseY) => `<g>
    <rect x="${x - 34}" y="${baseY - 14}" width="68" height="14" rx="3" fill="#2bb3a3"/>
    <rect x="${x - 34}" y="${baseY - 14}" width="68" height="4" rx="2" fill="#ffffff" opacity="0.35"/>
    <rect x="${x - 30}" y="${baseY - 27}" width="62" height="13" rx="3" fill="${C.navy}"/>
    <rect x="${x - 26}" y="${baseY - 39}" width="56" height="12" rx="3" fill="${C.yellow}"/>
    <rect x="${x - 26}" y="${baseY - 39}" width="56" height="3.5" rx="1.5" fill="#ffffff" opacity="0.45"/>
  </g>`;

const calculator = (x, y) => `<g transform="translate(${x} ${y}) scale(1 0.55) rotate(-14)">
    <rect x="-17" y="-24" width="34" height="46" rx="6" fill="${C.navy}"/>
    <rect x="-12" y="-19" width="24" height="10" rx="2" fill="#bfe8df"/>
    ${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${-12 + c * 9}" y="${-4 + r * 8}" width="6" height="5" rx="1.4" fill="${r === 2 && c === 2 ? C.yellow : '#e9edf5'}"/>`).join('')).join('')}
  </g>`;

// ---------- children ----------
const kid = ({ cx, hy, skin, hair, top, style, scarf, glasses = false, tilt = 0 }) => {
  const tb = TABLE_BACK - hy; // table back edge in the child's local coordinates
  const hijab = style === 'hijab';

  let hairBack = '', hairFront = '', face, ears = '', neck = '';
  if (hijab) {
    // scarf frames the face and drapes over the shoulders
    hairBack = `<path d="M-42 58 C-44 30 -40 -36 0 -37 C40 -36 44 30 42 58 C28 66 -28 66 -42 58 Z" fill="${scarf}"/>
      <path d="M-30 40 C-34 20 -34 -26 0 -27 C34 -26 34 20 30 40" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="3"/>`;
    face = `<ellipse cx="0" cy="3" rx="21.5" ry="25" fill="${skin}"/>`;
  } else {
    ears = `<circle cx="-27" cy="4" r="6" fill="${skin}"/><circle cx="27" cy="4" r="6" fill="${skin}"/>`;
    face = `<circle cx="0" cy="0" r="27" fill="${skin}"/>`;
    neck = `<rect x="-8" y="18" width="16" height="26" rx="6" fill="${skin}"/><rect x="-8" y="26" width="16" height="10" fill="rgba(0,0,0,0.08)"/>`;
    if (style === 'puffs') {
      hairBack = `<circle cx="-27" cy="-20" r="15" fill="${hair}"/><circle cx="27" cy="-20" r="15" fill="${hair}"/>`;
      hairFront = `<path d="M-28 2 C-30 -26 -12 -32 0 -32 C12 -32 30 -26 28 2 C24 -12 14 -18 0 -18 C-14 -18 -24 -12 -28 2 Z" fill="${hair}"/>
        <circle cx="-27" cy="-20" r="5" fill="${C.chalkYellow}"/><circle cx="27" cy="-20" r="5" fill="${C.chalkYellow}"/>`;
    }
    if (style === 'short') {
      hairFront = `<path d="M-28 0 C-31 -22 -16 -33 2 -32 C20 -31 31 -20 28 -2 C26 -10 22 -14 16 -15 C8 -10 -6 -9 -16 -14 C-22 -10 -26 -6 -28 0 Z" fill="${hair}"/>`;
    }
  }

  const eyes = `<ellipse cx="-9.5" cy="6" rx="2.8" ry="3.3" fill="${C.ink}"/><ellipse cx="9.5" cy="6" rx="2.8" ry="3.3" fill="${C.ink}"/>`;
  const brows = `<path d="M-14 -3 Q-9.5 -6 -5 -3.5" stroke="${C.ink}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.7"/><path d="M5 -3.5 Q9.5 -6 14 -3" stroke="${C.ink}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.7"/>`;
  const mouth = `<path d="M-6 15 Q0 20 6 15" stroke="${C.ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  const cheeks = `<circle cx="-15.5" cy="12" r="4.2" fill="${C.cheek}" opacity="0.45"/><circle cx="15.5" cy="12" r="4.2" fill="${C.cheek}" opacity="0.45"/>`;
  const specs = glasses
    ? `<g fill="none" stroke="${C.navy}" stroke-width="2.2"><circle cx="-9.5" cy="5.5" r="7.2"/><circle cx="9.5" cy="5.5" r="7.2"/><path d="M-2.3 5 Q0 3.4 2.3 5"/></g>`
    : '';

  const torso = `<path d="M-40 ${tb + 30} L-40 58 Q-40 40 -22 40 L22 40 Q40 40 40 58 L40 ${tb + 30} Z" fill="${top}"/>
    ${hijab ? '' : '<path d="M-10 40 L0 52 L10 40 Z" fill="#ffffff"/>'}`;

  // arms rest on the table, so they are drawn after it
  const handY = tb + 16;
  const arms = `<g fill="none" stroke="${top}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-33 52 Q-46 ${tb - 6} -44 ${tb + 10} Q-30 ${handY + 3} -16 ${handY}"/>
      <path d="M33 52 Q46 ${tb - 6} 44 ${tb + 10} Q30 ${handY + 3} 16 ${handY}"/>
    </g>`;
  const hands = `<circle cx="-15" cy="${handY}" r="8" fill="${skin}"/><circle cx="15" cy="${handY - 1}" r="8" fill="${skin}"/>`;
  const pen = pencil(9, handY + 7, 33, handY - 30);

  const head = `<g transform="rotate(${tilt} 0 26)">${hairBack}${ears}${face}${hairFront}${brows}${eyes}${specs}${cheeks}${mouth}</g>`;

  return {
    body: `<g transform="translate(${cx} ${hy})">${torso}${neck}${head}</g>`,
    front: `<g transform="translate(${cx} ${hy})">${arms}${hands}${pen}</g>`,
    book: openBook(cx, TABLE_BACK + 2, 38),
  };
};

// ---------- tutor ----------
const tutor = () => {
  const cx = 622, hy = 90, skin = '#c68642', hair = '#1b1b28';
  const tb = TABLE_BACK - hy;
  const blazer = '#162a5c', lapel = '#0e1f47', sleeve = '#1e3674';
  return `<g transform="translate(${cx} ${hy})">
      <path d="M-46 ${tb + 30} L-46 64 Q-46 42 -24 42 L24 42 Q46 42 46 64 L46 ${tb + 30} Z" fill="${blazer}"/>
      <path d="M-13 42 L13 42 L8 ${tb + 30} L-8 ${tb + 30} Z" fill="#ffffff"/>
      <path d="M-13 42 L0 62 L-9 ${tb + 30} L-24 ${tb + 30} L-24 44 Z" fill="${lapel}"/>
      <path d="M13 42 L0 62 L9 ${tb + 30} L24 ${tb + 30} L24 44 Z" fill="${lapel}"/>
      <path d="M-3.5 49 L3.5 49 L5.5 82 L0 89 L-5.5 82 Z" fill="${C.yellow}"/>
      <rect x="-9" y="20" width="18" height="26" rx="6" fill="${skin}"/>
      <rect x="-9" y="28" width="18" height="10" fill="rgba(0,0,0,0.1)"/>
      <!-- arm holding a workbook against the body -->
      <path d="M38 56 Q54 92 46 114 L22 120" fill="none" stroke="${sleeve}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="rotate(-8 6 104)">
        <rect x="-14" y="80" width="38" height="46" rx="4" fill="${C.yellow}"/>
        <rect x="-14" y="80" width="6" height="46" rx="2" fill="#e0a800"/>
        <text x="7" y="110" font-family="'Poppins', sans-serif" font-weight="800" font-size="17" fill="${C.navy}" text-anchor="middle">+×</text>
      </g>
      <circle cx="22" cy="119" r="8.5" fill="${skin}"/>
      <!-- head -->
      <circle cx="-29" cy="4" r="6.5" fill="${skin}"/><circle cx="29" cy="4" r="6.5" fill="${skin}"/>
      <circle cx="0" cy="0" r="29" fill="${skin}"/>
      <path d="M-30 2 C-33 -26 -14 -36 2 -35 C22 -34 33 -22 30 2 C28 -8 25 -14 20 -16 C8 -12 -10 -12 -22 -18 C-26 -12 -29 -6 -30 2 Z" fill="${hair}"/>
      <path d="M-27 6 C-26 30 -12 36 0 36 C12 36 26 30 27 6 C24 16 20 20 14 21 C8 18 -8 18 -14 21 C-20 20 -24 16 -27 6 Z" fill="${hair}"/>
      <path d="M-8 22 Q0 27 8 22" stroke="#ffffff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path d="M-16 -5 Q-11 -8 -6 -5.5" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M5 -5.5 Q10 -8 15 -5" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="-12.5" cy="4" rx="3" ry="3.5" fill="${C.ink}"/><ellipse cx="7.5" cy="4" rx="3" ry="3.5" fill="${C.ink}"/>
      <!-- arm pointing at the board -->
      <path d="M-36 56 Q-62 60 -72 34 L-84 8" fill="none" stroke="${sleeve}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="-86" cy="4" r="9" fill="${skin}"/>
      <g transform="translate(-86 4) rotate(-125)">
        <rect x="4" y="-3.5" width="26" height="7" rx="3" fill="${C.yellow}"/>
        <rect x="26" y="-3.5" width="6" height="7" rx="2" fill="${C.navy}"/>
      </g>
    </g>`;
};

export function illustrationSVG() {
  const kids = [
    kid({ cx: 160, hy: 146, skin: '#8d5524', hair: '#1c1310', top: '#ff7a59', style: 'puffs', tilt: -5 }),
    kid({ cx: 320, hy: 144, skin: '#f3c9a0', hair: '#6b3e1f', top: C.yellow, style: 'short', glasses: true, tilt: 4 }),
    kid({ cx: 480, hy: 146, skin: '#e0ac69', top: '#2bb3a3', style: 'hijab', scarf: '#5b7cfa', tilt: -3 }),
  ];

  const chalk = (x, y, text, fill = C.chalk, size = 27) =>
    `<text x="${x}" y="${y}" font-family="'Patrick Hand', 'Poppins', sans-serif" font-size="${size}" fill="${fill}">${text}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Three children writing at a table while a tutor points at maths on the board">
  <defs><clipPath id="panelClip"><rect x="0" y="0" width="${W}" height="${H}" rx="26"/></clipPath></defs>
  <g clip-path="url(#panelClip)">
    <rect x="0" y="0" width="${W}" height="${H}" fill="${C.panel}"/>
    <circle cx="${W - 10}" cy="-20" r="120" fill="${C.panelDeep}"/>
    <circle cx="-20" cy="${H - 40}" r="100" fill="${C.panelDeep}"/>

    <!-- board -->
    <rect x="72" y="16" width="458" height="162" rx="12" fill="${C.boardFrame}"/>
    <rect x="81" y="25" width="440" height="144" rx="7" fill="${C.board}"/>
    ${chalk(100, 62, '3 + 4 = 7')}
    ${chalk(100, 100, '12 ÷ 3 = 4')}
    ${chalk(256, 62, '6 × 7 = 42')}
    ${chalk(256, 100, '2x + 5 = 11', C.chalkYellow)}
    ${chalk(408, 62, '10 − 3 = 7')}
    ${chalk(408, 100, 'x² = 49')}
    <path d="M256 108 Q316 113 378 106" stroke="${C.chalkYellow}" stroke-width="2.5" fill="none" stroke-linecap="round"/>

    <!-- people behind the table -->
    ${tutor()}
    ${kids.map((k) => k.body).join('')}

    <!-- table -->
    <path d="M22 ${TABLE_BACK} L698 ${TABLE_BACK} L720 ${TABLE_FRONT} L0 ${TABLE_FRONT} Z" fill="${C.tableTop}"/>
    <rect x="0" y="${TABLE_FRONT}" width="${W}" height="${H - TABLE_FRONT}" fill="${C.tableFront}"/>
    <rect x="0" y="${TABLE_FRONT}" width="${W}" height="5" fill="${C.tableShadow}" opacity="0.55"/>

    <!-- things on the table -->
    ${bookStack(58, TABLE_BACK + 20)}
    ${calculator(662, TABLE_BACK + 14)}
    ${kids.map((k) => k.book).join('')}
    ${kids.map((k) => k.front).join('')}
  </g>
  </svg>`;
}
