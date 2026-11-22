// ===== Part 2: 55s → end =====
// ---------- shared pieces ----------
function grannyFlatBG(t, opts = {}) {
  let s = `<rect x="-400" y="-400" width="1520" height="1500" fill="#e9d9bf"/>`;
  // wallpaper dots
  for (let y = -380; y < 1000; y += 70) for (let x = -380; x < 1100; x += 70) s += `<circle cx="${x + ((y / 70) % 2 ? 35 : 0)}" cy="${y}" r="5" fill="#d8c3a2"/>`;
  // red carpet on wall
  s += `<g><rect x="200" y="40" width="330" height="230" rx="8" fill="#b2333a" stroke="${C.ink}" stroke-width="6"/>
   <rect x="222" y="62" width="286" height="186" fill="none" stroke="#f0b44c" stroke-width="6" stroke-dasharray="14 8"/>
   <path d="M365 90 L430 155 L365 220 L300 155Z" fill="#f0b44c" stroke="${C.ink}" stroke-width="4"/><path d="M365 125 L395 155 L365 185 L335 155Z" fill="#2c5aa0"/></g>`;
  if (!opts.noSideboard) {
    // sideboard (сервант) with plates
    const sx = opts.sideX ?? 470;
    s += `<g><rect x="${sx}" y="330" width="230" height="560" fill="#7a4b2c" stroke="${C.ink}" stroke-width="6"/>
     <rect x="${sx + 20}" y="350" width="190" height="210" fill="#bfe3ef" stroke="${C.ink}" stroke-width="5"/>
     ${[0, 1, 2].map(i => `<circle cx="${sx + 55 + i * 60}" cy="420" r="22" fill="#fff" stroke="${C.ink}" stroke-width="4"/>`).join('')}
     ${[0, 1, 2].map(i => `<ellipse cx="${sx + 55 + i * 60}" cy="500" rx="22" ry="12" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/>`).join('')}
     <rect x="${sx + 20}" y="590" width="90" height="280" fill="#8c5934" stroke="${C.ink}" stroke-width="5"/><rect x="${sx + 120}" y="590" width="90" height="280" fill="#8c5934" stroke="${C.ink}" stroke-width="5"/></g>`;
  }
  if (!opts.noTV) {
    // old CRT on a low table
    s += `<g><rect x="-30" y="650" width="300" height="240" fill="#6e4329" stroke="${C.ink}" stroke-width="6"/>
     <rect x="20" y="500" width="190" height="150" rx="16" fill="#5a5a66" stroke="${C.ink}" stroke-width="6"/><rect x="40" y="518" width="130" height="112" rx="10" fill="${opts.crtOn ? '#ff8a3d' : '#3b6e7a'}" stroke="${C.ink}" stroke-width="4"/>
     ${opts.crtOn ? `<text x="105" y="574" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="22" fill="#fff">GTA 6</text>` : ''}
     <path d="M90 500 L60 440 M140 500 L170 440" stroke="${C.ink}" stroke-width="5"/></g>`;
  }
  s += `<rect x="-400" y="890" width="1520" height="900" fill="#9a6a44"/>`;
  for (let i = -6; i < 12; i++) s += `<rect x="${i * 120}" y="890" width="4" height="900" fill="#7f5535"/>`;
  s += `<ellipse cx="360" cy="1120" rx="420" ry="110" fill="#8e2a33" stroke="${C.ink}" stroke-width="6"/><ellipse cx="360" cy="1120" rx="360" ry="85" fill="none" stroke="#f0b44c" stroke-width="5" stroke-dasharray="18 12"/>`;
  return s;
}
function kitchenBG() {
  let s = `<rect x="-400" y="-400" width="1520" height="1500" fill="#eef3f7"/>`;
  for (let y = -380; y < 900; y += 64) s += `<rect x="-400" y="${y}" width="1520" height="3" fill="#d4dde6"/>`;
  for (let x = -380; x < 1100; x += 64) s += `<rect x="${x}" y="-400" width="3" height="1300" fill="#d4dde6"/>`;
  s += `<rect x="560" y="200" width="200" height="700" rx="16" fill="#fff" stroke="${C.ink}" stroke-width="6"/><rect x="580" y="420" width="12" height="80" rx="6" fill="${C.ink}"/>
   <rect x="60" y="150" width="260" height="230" fill="#c98c55" stroke="${C.ink}" stroke-width="6"/><rect x="186" y="150" width="8" height="230" fill="${C.ink}"/>
   <circle cx="170" cy="270" r="7" fill="${C.ink}"/><circle cx="210" cy="270" r="7" fill="${C.ink}"/>`;
  return s;
}
function table(y = 980, col = '#c98c55') { return `<rect x="-400" y="${y}" width="1520" height="700" fill="#a86f40"/><rect x="-400" y="${y - 30}" width="1520" height="40" fill="${col}" stroke="${C.ink}" stroke-width="6"/>`; }
function envelope(x, y, s = 1, rot = 0, { crossed = 0, open = 0, label = 'НА МАШИНУ' } = {}) {
  const cash = open > 0 ? `<g transform="translate(0,${-70 * eOut(open)})"><rect x="-80" y="-50" width="160" height="80" rx="6" fill="#64c47c" stroke="${C.ink}" stroke-width="4"/><circle cx="0" cy="-10" r="18" fill="none" stroke="#2f8a48" stroke-width="4"/><text y="-10" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="18" fill="#2f8a48">$</text></g>` : '';
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">${cash}
   <rect x="-110" y="-60" width="220" height="130" rx="8" fill="#f3e2c0" stroke="${C.ink}" stroke-width="5"/>
   <path d="M-110 -60 L0 ${open > 0 ? -130 : 20} L110 -60" fill="${open > 0 ? '#e6d0a6' : 'none'}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>
   <text y="38" text-anchor="middle" dy="0.36em" font-family="Caveat" font-weight="700" font-size="34" fill="#2c5aa0">${label}</text>
   ${crossed > 0 ? `<path d="M-84 40 L${-84 + 168 * crossed} 32" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/>` : ''}</g>`;
}
// ledger: rows [{t0,l,v,c}] -> handwritten reveal
function ledger(t, rows, { title = 'День 1 · до релиза 3 дня', x = 60, y = 150, w = 600, h = 980, rot = -2, lh = 58, extra = '' } = {}) {
  let s = `<g transform="rotate(${rot} 360 640)"><rect x="${x + 10}" y="${y + 14}" width="${w}" height="${h}" rx="10" fill="${C.ink}" opacity=".5"/>
   <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fbfbf7" stroke="${C.ink}" stroke-width="5"/>`;
  for (let gy = y + 30; gy < y + h; gy += 30) s += `<rect x="${x}" y="${gy}" width="${w}" height="1.5" fill="#cfe0f0"/>`;
  for (let gx = x + 30; gx < x + w; gx += 30) s += `<rect x="${gx}" y="${y}" width="1.5" height="${h}" fill="#e3edf6"/>`;
  s += `<rect x="${x + 70}" y="${y}" width="3" height="${h}" fill="#f19aa0"/>`;
  for (let i = 0; i < 16; i++) s += `<circle cx="${x + 30}" cy="${y + 40 + i * 60}" r="11" fill="#7a5236" stroke="${C.ink}" stroke-width="3"/>`;
  s += `<text x="${x + 96}" y="${y + 70}" font-family="Caveat" font-weight="700" font-size="40" fill="#24306b">${esc(title)}</text>`;
  rows.forEach((r, i) => {
    if (t < r.t0) return;
    const k = P(t, r.t0, .45), cid = uid('lc');
    const ry = y + 140 + i * lh + (r.dy || 0);
    const col = r.c || '#24306b';
    s += `<clipPath id="${cid}"><rect x="${x + 80}" y="${ry - 50}" width="${(w - 90) * k}" height="80"/></clipPath><g clip-path="url(#${cid})">
      ${r.box ? `<rect x="${x + 88}" y="${ry - 38}" width="${w - 120}" height="58" rx="6" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="12 7"/>` : ''}
      <text x="${x + 104}" y="${ry}" font-family="Caveat" font-weight="700" font-size="${r.big ? 50 : 38}" fill="${col}">${esc(r.l)}</text>
      ${r.v ? `<text x="${x + w - 40}" y="${ry}" text-anchor="end" font-family="Caveat" font-weight="700" font-size="${r.big ? 54 : 38}" fill="${col}">${esc(r.v)}</text>` : ''}</g>`;
    if (r.circle && t > r.t0 + .3) {
      const ck = P(t, r.t0 + .3, .6), L = 2 * Math.PI * 80;
      s += `<ellipse cx="${x + w - 100}" cy="${ry - 14}" rx="96" ry="42" fill="none" stroke="#2c5aa0" stroke-width="5" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - ck)}"/>`;
    }
  });
  return s + extra + '</g>';
}
function phone(x, y, w, h, inner, rot = 0, top = '#2ea56a', title = '') {
  return `<g transform="translate(${x},${y}) rotate(${rot})">
   <rect x="${-w / 2 + 8}" y="${-h / 2 + 10}" width="${w}" height="${h}" rx="42" fill="${C.ink}" opacity=".5"/>
   <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="42" fill="#1d1b24" stroke="${C.ink}" stroke-width="6"/>
   <rect x="${-w / 2 + 16}" y="${-h / 2 + 16}" width="${w - 32}" height="${h - 32}" rx="30" fill="#f4f4f8"/>
   ${top ? `<path d="M${-w / 2 + 16} ${-h / 2 + 46} a30 30 0 0 1 30 -30 h${w - 92} a30 30 0 0 1 30 30 v54 h${-(w - 32)}z" fill="${top}"/><text x="${-w / 2 + 44}" y="${-h / 2 + 72}" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="24" fill="#fff">${title}</text>` : ''}
   <rect x="-50" y="${-h / 2 + 26}" width="100" height="18" rx="9" fill="#1d1b24"/>
   ${inner}</g>`;
}
function handsHolding(t) {
  return `<g><path d="M70 1400 L150 1010" stroke="${C.ink}" stroke-width="96" stroke-linecap="round"/><path d="M70 1400 L150 1010" stroke="${C.jacket}" stroke-width="84" stroke-linecap="round"/><circle cx="150" cy="1000" r="38" fill="#fff" stroke="${C.ink}" stroke-width="5"/>
   <path d="M650 1400 L570 1010" stroke="${C.ink}" stroke-width="96" stroke-linecap="round"/><path d="M650 1400 L570 1010" stroke="${C.jacket}" stroke-width="84" stroke-linecap="round"/><circle cx="570" cy="1000" r="38" fill="#fff" stroke="${C.ink}" stroke-width="5"/></g>`;
}
function consoleBox(x, y, s = 1, rot = 0) {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-38" y="-110" width="76" height="220" rx="26" fill="#f7f7fb" stroke="${C.ink}" stroke-width="5"/>
   <rect x="-10" y="-110" width="20" height="220" fill="#1d1b24"/><rect x="-30" y="80" width="14" height="6" rx="3" fill="#3d7bff"/></g>`;
}
function gamepad(x, y, s = 1, rot = 0, col = '#f2f2f6') {
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><path d="M-70 -20 Q-70 -40 -40 -40 H40 Q70 -40 70 -20 L88 40 Q92 62 70 62 Q55 62 40 34 H-40 Q-55 62 -70 62 Q-92 62 -88 40Z" fill="${col}" stroke="${C.ink}" stroke-width="5"/>
   <path d="M-48 -4 h20 M-38 -14 v20" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><circle cx="38" cy="-10" r="7" fill="${C.ink}"/><circle cx="52" cy="4" r="7" fill="${C.ink}"/></g>`;
}
function bigTV(x, y, w, h, on = true, label = '') {
  return `<g><rect x="${x + w / 2 - 70}" y="${y + h}" width="140" height="18" rx="6" fill="#2b2833" stroke="${C.ink}" stroke-width="4"/>
   <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#1d1b24" stroke="${C.ink}" stroke-width="6"/>
   <defs><linearGradient id="tvg${x | 0}${y | 0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5f8f"/><stop offset=".65" stop-color="#ff9e4a"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>
   ${on ? `<rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" rx="6" fill="url(#tvg${x | 0}${y | 0})"/><circle cx="${x + w * .68}" cy="${y + h * .5}" r="${h * .2}" fill="#ffd166"/>
    ${[[.08, .45, .1], [.2, .35, .09], [.31, .55, .08]].map(([a, b, c]) => `<rect x="${x + w * a}" y="${y + h * b}" width="${w * c}" height="${h * (1 - b) - 12}" fill="#5b2a86"/>`).join('')}` : `<rect x="${x + 12}" y="${y + 12}" width="${w - 24}" height="${h - 24}" rx="6" fill="#2d2a38"/>`}
   ${label ? `<text x="${x + w / 2}" y="${y + h * .25}" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="${h * .16}" fill="#fff" stroke="${C.ink}" stroke-width="7" paint-order="stroke">${label}</text>` : ''}</g>`;
}
function priceTag(x, y, text, col = C.yel, rot = 8, s = 1) { return tag(text, { x, y, size: 26 * s, bg: col, rot, skew: 0 }); }
function storeBG(cols = 7) {
  let s = `<rect x="-400" y="-400" width="1520" height="1500" fill="#eceef3"/>`;
  const pal = ['#e04848', '#3d7bff', '#f2c53d', '#2ea56a', '#8a5aa8', '#ff8a3d'];
  for (let r = 0; r < 3; r++) {
    s += `<rect x="-400" y="${170 + r * 150}" width="1520" height="14" fill="#b9bcc7" stroke="${C.ink}" stroke-width="3"/>`;
    for (let c = -2; c < 9; c++) s += `<rect x="${c * 100 + 10}" y="${80 + r * 150}" width="76" height="88" rx="6" fill="${pal[(c + r * 2 + 12) % 6]}" stroke="${C.ink}" stroke-width="4"/>`;
  }
  s += `<rect x="-400" y="900" width="1520" height="900" fill="#c9ccd6"/>`;
  return s;
}
function stairsBG(t, light = 0) {
  let s = `<rect x="-400" y="-400" width="1520" height="2080" fill="#24302a"/>`;
  for (let i = 0; i < 12; i++) s += `<rect x="${-100 + i * 60}" y="${760 - i * 60}" width="${900}" height="60" fill="${i % 2 ? '#2f3d35' : '#34433a'}" stroke="#1a221d" stroke-width="3"/>`;
  s += `<rect x="-400" y="900" width="1520" height="900" fill="#1d2520"/>`;
  s += `<circle cx="520" cy="120" r="${40 + 4 * Math.sin(t * 13)}" fill="#ffe8a8" opacity="${.35 + .25 * (Math.sin(t * 17) > .6 ? 0 : 1)}"/>`;
  return s;
}
function yardBG(t) {
  let s = `<rect x="-400" y="-400" width="1520" height="1500" fill="#ff9a52"/>`;
  [[-60, 120, 200], [150, 40, 170], [330, 160, 180], [520, 60, 220]].forEach(([x, y, w], i) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="900" fill="${i % 2 ? '#6b4fa3' : '#59408f'}" stroke="${C.ink}" stroke-width="5"/>`;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 3; c++) s += `<rect x="${x + 22 + c * (w - 40) / 3}" y="${y + 30 + r * 90}" width="26" height="34" fill="#ffd66b" opacity="${(r * 3 + c + i) % 4 ? .9 : .2}"/>`;
  });
  s += `<rect x="-400" y="900" width="1520" height="900" fill="#6d6a75"/><rect x="-400" y="900" width="1520" height="16" fill="#8f8c98"/>`;
  return s;
}
function car(x, y, trunk = 1) {
  return `<g transform="translate(${x},${y})"><rect x="-260" y="-140" width="430" height="150" rx="40" fill="#d8453c" stroke="${C.ink}" stroke-width="6"/>
   <path d="M-200 -140 L-150 -230 H40 L100 -140Z" fill="#d8453c" stroke="${C.ink}" stroke-width="6"/><path d="M-170 -145 L-135 -210 H-60 V-145Z" fill="#bfe3ef" stroke="${C.ink}" stroke-width="5"/>
   <path d="M170 -140 L${170 + 120 * trunk} ${-140 - 170 * trunk}" stroke="${C.ink}" stroke-width="14"/><path d="M170 -140 L${170 + 120 * trunk} ${-140 - 170 * trunk}" stroke="#d8453c" stroke-width="8"/>
   <rect x="40" y="-150" width="150" height="70" fill="#1d1b24" stroke="${C.ink}" stroke-width="4"/>
   ${consoleBox(80, -110, .3, 90)}${consoleBox(150, -110, .3, 90)}
   <circle cx="-150" cy="20" r="56" fill="#2b2833" stroke="${C.ink}" stroke-width="6"/><circle cx="-150" cy="20" r="22" fill="#b9bcc7"/>
   <circle cx="90" cy="20" r="56" fill="#2b2833" stroke="${C.ink}" stroke-width="6"/><circle cx="90" cy="20" r="22" fill="#b9bcc7"/></g>`;
}
// achievement toast (bottom-center, distinct from quest panel)
function achievement(t, t0, t1, text, sub = 'ДОСТИЖЕНИЕ') {
  if (t < t0 || t > t1 + .3) return '';
  const k = eBack(P(t, t0, .4)), x = P(t, t1, .25);
  const w = Math.max(440, measure(text, 26, 'Unbounded', 900) + 140);
  const shine = ((t - t0) * 1.4) % 1;
  return `<g transform="translate(360,${lerp(1220, 1000, k) + 200 * eIn(x)}) scale(${lerp(.6, 1, k)})" opacity="${clamp(k * 2) * (1 - x)}">
   <rect x="${-w / 2 + 6}" y="-46" width="${w}" height="104" rx="52" fill="${C.ink}"/>
   <rect x="${-w / 2}" y="-52" width="${w}" height="104" rx="52" fill="#17141f" stroke="${C.yel}" stroke-width="5"/>
   <rect x="${-w / 2 + (w - 60) * shine}" y="-52" width="40" height="104" fill="#fff" opacity=".08" transform="skewX(-20)"/>
   <circle cx="${-w / 2 + 52}" cy="0" r="34" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/>
   <path d="M${-w / 2 + 36} -16 h32 v10 q0 22 -16 26 q-16 -4 -16 -26z M${-w / 2 + 46} 20 h12 v8 h-12z" fill="${C.ink}"/>
   <text x="${-w / 2 + 102}" y="-16" dy="0.36em" font-family="Rubik" font-weight="800" font-size="17" letter-spacing="2" fill="${C.yel}">${sub}</text>
   <text x="${-w / 2 + 102}" y="16" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">${esc(text)}</text></g>`;
}
function locBanner(t, t0, t1, time, place) {
  if (t < t0 || t > t1 + .3) return '';
  const k = eOut(P(t, t0, .35)), x = P(t, t1, .25);
  const w = measure(place, 34, 'Unbounded', 900) + 80;
  return `<g transform="translate(360,${330})" opacity="${k * (1 - x)}">
   <rect x="${-w / 2 * k}" y="-2" width="${w * k}" height="4" fill="${C.yel}" transform="translate(0,-46)"/>
   <text y="-74" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="800" font-size="20" letter-spacing="4" fill="${C.yel}" stroke="${C.ink}" stroke-width="5" paint-order="stroke">${esc(time)}</text>
   <text y="${(1 - k) * 20}" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff" stroke="${C.ink}" stroke-width="9" paint-order="stroke" letter-spacing="${(1 - k) * 10}">${esc(place)}</text>
   <rect x="${-w / 2 * k}" y="44" width="${w * k}" height="4" fill="${C.yel}"/></g>`;
}
function dim(a) { return `<rect x="-400" y="-400" width="1520" height="2080" fill="#000" opacity="${a}"/>`; }
const talkE = (t, a, b, base = {}) => (win(t, a, b) ? { ...base, mouth: 'talk', open: env(t) * 1.7 } : base);

// ---------- scenes ----------
const T1 = { s: 55.0, e: 59.5, draw(t) { // granny flat arrival
  const lt = t - this.s, hx = lerp(-60, 330, eOut(P(t, 55.0, 1.6)));
  const scene = grannyFlatBG(t) + person({ x: hx, y: 780, r: 95, kind: 'hero', pose: 'box', walk: lt < 1.6 ? lt * 8 : 0, e: { eyes: 'open', brow: 'up', mouth: 'smile', look: [.3, -.3] } });
  return cam(scene, { z: lerp(1.0, 1.08, P(t, 55, 4.5)), cx: 360, cy: 760 }) +
    locBanner(t, 55.2, 57.6, '11:00', 'БАБУШКИНА КВАРТИРА') +
    KTag(t, 56.3, 59.4, 'КЛУБ — ПРЯМО ДОМА', { x: 360, y: 510, size: 26, bg: C.yel, rot: -3 }) +
    KT(t, 58.2, 59.4, [{ t: 'ОТ БАБУШКИ', c: '#fff' }], { x: 520, y: 640, size: 34, rot: 6 }, 'pop');
} };
const T2 = { s: 59.5, e: 65.0, draw(t) { // ledger day 1
  const z = lerp(1.06, 1.0, eOut(P(t, 59.5, .6)));
  const sc = `<rect x="-400" y="-400" width="1520" height="2080" fill="#8d5a36"/>` + ledger(t, [{ t0: 61.0, l: 'Начало', v: '$3000' }], {});
  return cam(sc, { z, cx: 360, cy: 600 }) + stamp(t, 61.6, 470, 760, 'ДЕНЬ 1', C.blue, -10, 44) +
    KT(t, 62.3, 65.0, [{ t: '$3 000', c: C.grn }], { x: 360, y: 980, size: 72, rot: -3 }) + KT(t, 62.4, 65.0, 'НА СТАРТЕ', { x: 360, y: 900, size: 30, rot: -3, fill: '#fff' }, 'rise');
} };
// Tyoma intro card
function allyCard(t, t0, rows) {
  const k = eOut(P(t, t0, .35));
  return `<g transform="translate(${lerp(760, 372, k)},232) rotate(-2)">
   <rect x="6" y="8" width="316" height="${78 + rows.length * 62}" rx="20" fill="${C.ink}"/>
   <rect width="316" height="${78 + rows.length * 62}" rx="20" fill="#17141f" stroke="${C.ink}" stroke-width="4"/>
   <rect width="316" height="52" rx="20" fill="#8db6e6" stroke="${C.ink}" stroke-width="4"/><rect y="30" width="316" height="22" fill="#8db6e6"/>
   <text x="158" y="27" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="21" fill="${C.ink}">СОЮЗНИК · ТЁМА</text>
   ${rows.map((r, i) => statRow(t, r[0], i, r[1], r[2], r[3] || '#fff')).join('')}</g>`;
}
const T3 = { s: 65.0, e: 73.5, draw(t) { // Tyoma's kitchen
  const close = t >= 70.6;
  const ty = { x: close ? 360 : 230, y: close ? 760 : 760, r: close ? 150 : 88, kind: 'tyoma', legs: false, e: close ? talkE(t, 70.7, 72.5, { eyes: 'wide', brow: 'up', mouth: 'o', sweat: true }) : { eyes: 'open', brow: 'flat', mouth: 'smile', look: [1, 0] } };
  let scene = kitchenBG() + person(ty);
  if (!close) scene += person({ x: 520, y: 770, r: 84, kind: 'hero', legs: false, e: { eyes: 'half', brow: 'flat', mouth: 'smile', look: [-1, 0] } });
  scene += table(close ? 1100 : 930) + (close ? '' : `<rect x="130" y="880" width="56" height="60" rx="8" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>`);
  const z = close ? lerp(1.12, 1.0, eOut(P(t, 70.6, .4))) : lerp(1.0, 1.06, P(t, 65, 5.6));
  let out = cam(scene, { z, cx: 360, cy: 780 });
  if (!close) out += locBanner(t, 65.1, 66.6, '19:00', 'КУХНЯ ТЁМЫ') +
    allyCard(t, 66.7, [[66.8, 'ДРУГ', 'СО ШКОЛЫ', C.yel], [67.8, 'РАБОТА', 'НАДЁЖНАЯ'], [68.9, 'ГОЛОВА', 'ХОЛОДНАЯ', '#8fd3ff']]);
  else out += dialog(t, { t0: 70.7, t1: 73.4, name: 'ТЁМА', nameBg: '#8db6e6', text: 'Ты что, правда\n*уволился*?!', y: 250, cps: 22 }) +
    KTag(t, 72.6, 73.4, 'НЕ ВЕРИТ', { x: 520, y: 520, size: 24, bg: '#fff', rot: 5 });
  return out;
} };
const T4 = { s: 73.5, e: 81.0, draw(t) { // club shopping list
  const items = [[74.6, 'PS5 б/у ×2', 700, 'console'], [76.5, 'GTA 6 ×2', 140, 'game'], [77.3, 'геймпад ×2', 150, 'pad'], [78.0, 'телевизор', 300, 'tv']];
  let list = '';
  items.forEach(([t0, l, v, ic], i) => {
    if (t < t0) return;
    const k = eBack(P(t, t0, .3)), y = 420 + i * 120;
    const icon = ic === 'console' ? consoleBox(0, 0, .38, 0) : ic === 'pad' ? gamepad(0, 0, .45) : ic === 'tv' ? `<rect x="-36" y="-26" width="72" height="50" rx="6" fill="#1d1b24"/><rect x="-28" y="-18" width="56" height="34" fill="#ff8a3d"/>` : `<rect x="-26" y="-34" width="52" height="68" rx="6" fill="#ff8a3d" stroke="${C.ink}" stroke-width="4"/><text dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="14" fill="#fff">GTA</text>`;
    list += `<g transform="translate(${lerp(760, 70, k)},${y})"><rect x="6" y="6" width="580" height="100" rx="18" fill="${C.ink}"/><rect width="580" height="100" rx="18" fill="#fff" stroke="${C.ink}" stroke-width="5"/>
      <rect x="14" y="14" width="72" height="72" rx="14" fill="#eceef3" stroke="${C.ink}" stroke-width="3"/><g transform="translate(50,50)">${icon}</g>
      <text x="110" y="50" dy="0.36em" font-family="Rubik" font-weight="800" font-size="30" fill="${C.ink}">${l}</text>
      <text x="556" y="50" dy="0.36em" text-anchor="end" font-family="Unbounded" font-weight="900" font-size="30" fill="${C.red}">$${v}</text></g>`;
  });
  const tot = t >= 78.8 ? Math.round(1290 * eOut(P(t, 78.8, 1.2))) : 0;
  const total = t >= 78.8 ? `<g transform="translate(360,960) scale(${eBack(P(t, 78.8, .3))}) rotate(-3)"><rect x="-224" y="-56" width="460" height="120" rx="22" fill="${C.ink}"/><rect x="-230" y="-62" width="460" height="120" rx="22" fill="${C.yel}" stroke="${C.ink}" stroke-width="6"/>
     <text x="-200" y="0" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="28" fill="${C.ink}">ИТОГО</text><text x="200" y="0" dy="0.36em" text-anchor="end" font-family="Unbounded" font-weight="900" font-size="52" fill="${C.ink}">$${tot.toLocaleString('ru-RU').replace(/\s/g, ' ')}</text></g>` : '';
  return stripesBG(t, '#173a2a', '#1d4633') + `<text x="360" y="320" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="40" fill="#fff" stroke="${C.ink}" stroke-width="9" paint-order="stroke" opacity="${P(t, 73.6, .3)}">ПЛАН КЛУБА</text>` + list + total;
} };
const T5 = { s: 81.0, e: 85.5, draw(t) { // hero pitch
  const e = talkE(t, 81.1, 85.2, { eyes: 'happy', brow: 'up', mouth: 'grin', blush: true });
  const scene = kitchenBG() + person({ x: 360, y: 800, r: 130, kind: 'hero', legs: false, pose: 'wide', e: { ...e, blush: true } }) + table(1150);
  const [sx, sy] = shake(t, 81.15, .3, 12);
  return cam(scene, { z: lerp(1.15, 1.0, eOut(P(t, 81, .5))), cx: 360, cy: 800, sx, sy }) +
    burst(t, 81.15, 360, 360, C.yel) + KT(t, 81.15, 82.5, [{ t: '$5', c: C.yel }, { t: ' / ЧАС', c: '#fff' }], { x: 360, y: 360, size: 84, rot: -4 }) +
    KTag(t, 82.6, 85.4, 'ВСЕ ЗАХОТЯТ ИГРАТЬ', { x: 360, y: 330, size: 28, bg: '#fff', rot: 3 }) +
    KTag(t, 83.8, 85.4, 'PS5 ЕСТЬ НЕ У ВСЕХ', { x: 390, y: 410, size: 28, bg: C.yel, rot: -3 });
} };
function calculator(t, display, x = 360, y = 640, s = 1) {
  const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '.', '=', '+'];
  return `<g transform="translate(${x},${y}) scale(${s})"><rect x="-206" y="-306" width="420" height="620" rx="40" fill="${C.ink}"/><rect x="-210" y="-310" width="420" height="620" rx="40" fill="#3a3a48" stroke="${C.ink}" stroke-width="6"/>
   <rect x="-170" y="-270" width="340" height="120" rx="14" fill="#b9e3a5" stroke="${C.ink}" stroke-width="5"/>
   <text x="150" y="-210" dy="0.36em" text-anchor="end" font-family="Unbounded" font-weight="900" font-size="${display.length > 8 ? 38 : 58}" fill="#1f2a1a">${display}</text>
   ${keys.map((k, i) => { const cx = -126 + (i % 4) * 84, cy = -90 + Math.floor(i / 4) * 92; return `<rect x="${cx - 34}" y="${cy - 34}" width="68" height="68" rx="16" fill="${i % 4 === 3 ? '#f29a2e' : '#555566'}" stroke="${C.ink}" stroke-width="4"/><text x="${cx}" y="${cy}" dy="0.36em" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="30" fill="#fff">${k}</text>`; }).join('')}</g>`;
}
const T6 = { s: 85.5, e: 91.2, draw(t) { // calculator
  const disp = t < 87.4 ? '3000' : t < 88.4 ? '3000' : t < 89.5 ? '3000 − 1290' : t < 90.2 ? '1710 − 40' : '1670';
  const press = [87.5, 88.4, 89.5, 90.2].find(p => t >= p && t < p + .25);
  const fx = press ? 300 : 240, fy = press ? 830 : 900;
  const scene = `<rect x="-400" y="-400" width="1520" height="2080" fill="#d9a76f"/>` + calculator(t, disp, 360, 760) +
    `<g><path d="M${fx + 40} 1400 L${fx} ${fy}" stroke="${C.ink}" stroke-width="80" stroke-linecap="round"/><path d="M${fx + 40} 1400 L${fx} ${fy}" stroke="#8db6e6" stroke-width="68" stroke-linecap="round"/><circle cx="${fx}" cy="${fy}" r="34" fill="#fff" stroke="${C.ink}" stroke-width="5"/></g>`;
  const [sx, sy] = shake(t, 90.2, .3, 10);
  return cam(scene, { z: lerp(1.0, 1.1, P(t, 85.5, 5.7)), cx: 360, cy: 640, sx, sy }) +
    KTag(t, 85.7, 91.2, 'ЗАРПЛАТА: $0', { x: 360, y: 290, size: 30, bg: C.red, fg: '#fff', rot: -3 }) +
    KT(t, 85.6, 87.3, 'МОЛЧА', { x: 560, y: 1080, size: 36, rot: 6, fill: '#e9e6f2' }, 'rise') +
    KT(t, 89.5, 91.2, [{ t: '−$40 НА ЕДУ', c: C.red }], { x: 360, y: 400, size: 40, rot: -2 }, 'pop');
} };
const T7 = { s: 91.2, e: 96.0, draw(t) { // Tyoma: zero salary
  const e = talkE(t, 91.3, 95.8, { eyes: 'angry', brow: 'down', mouth: 'frown' });
  const scene = kitchenBG() + person({ x: 360, y: 820, r: 150, kind: 'tyoma', legs: false, e }) + table(1160) + `<rect x="80" y="1080" width="70" height="76" rx="10" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/>`;
  return cam(scene, { z: lerp(1.0, 1.15, P(t, 91.2, 4.8)), cx: 360, cy: 820 }) +
    dialog(t, { t0: 91.3, t1: 95.9, name: 'ТЁМА', nameBg: '#8db6e6', text: '$1670. И _ноль_ зарплаты.\nА если первый месяц\n_никто_ не придёт?', y: 240, cps: 17 });
} };
const T8 = { s: 96.0, e: 105.5, draw(t) { // envelope "на машину"
  if (t < 100.8) {
    const up = eOut(P(t, 96.1, .6)), door = eOut(P(t, 96.9, .5)), env1 = eOut(P(t, 98.1, .6));
    const scene = kitchenBG() + `<g transform="translate(190,265)"><rect x="-130" y="-115" width="${130 * (1 - door * .8)}" height="230" fill="#c98c55" stroke="${C.ink}" stroke-width="6"/></g>
      <rect x="${60 + 130 * 0}" y="150" width="${door > 0 ? 260 : 0}" height="230" fill="#6e4329" opacity="${door}"/>` +
      (door > .5 && env1 < 1 ? envelope(220, 300, .5, 0) : '') +
      person({ x: 260, y: lerp(820, 720, up), r: 96, kind: 'tyoma', pose: up > .5 ? 'up' : 'stand', e: { eyes: 'open', brow: 'down', mouth: 'line', look: [0, -1] } }) +
      (env1 > 0 ? envelope(lerp(220, 360, env1), lerp(300, 150, env1), lerp(.5, .9, env1), -8) : '') +
      person({ x: 500, y: 860, r: 84, kind: 'hero', legs: false, e: { eyes: 'wide', brow: 'up', mouth: 'o', look: [-1, -1] } }) + table(1000);
    return cam(scene, { z: lerp(1.0, 1.1, P(t, 96, 4.8)), cx: 360, cy: 640 }) +
      KTag(t, 99.0, 100.8, '«НА МАШИНУ»', { x: 520, y: 330, size: 28, bg: '#f3e2c0', rot: 6 });
  }
  const cross = P(t, 101.0, .5), slide = eOut(P(t, 101.9, .7)), open = P(t, 103.7, .5);
  const scene = kitchenBG() + person({ x: 160, y: 760, r: 110, kind: 'tyoma', legs: false, e: { eyes: 'half', brow: 'flat', mouth: 'line' } }) +
    person({ x: 580, y: 760, r: 110, kind: 'hero', legs: false, e: { eyes: open > 0 ? 'wide' : 'open', brow: 'up', mouth: open > 0 ? 'o' : 'line', look: [-1, .6] } }) +
    table(960) + envelope(lerp(220, 380, slide), 930, 1.1, lerp(-6, 4, slide), { crossed: cross, open });
  const [sx, sy] = shake(t, 103.75, .3, 12);
  return cam(scene, { z: lerp(1.05, 1.2, P(t, 100.8, 4.7)), cx: 360, cy: 880, sx, sy }) +
    KT(t, 101.0, 102.4, [{ t: 'ЗАЧЁРКИВАЕТ', c: C.red }], { x: 360, y: 400, size: 44, rot: -4 }, 'pop') +
    burst(t, 103.75, 360, 420, C.grn) + KT(t, 103.75, 105.5, [{ t: '$1 200', c: C.grn }], { x: 360, y: 420, size: 96, rot: -4 });
} };
function tyomaRule(t, t0, t1, y = 980) { // pinned "rule" card, callback later
  if (t < t0 || t > t1 + .3) return '';
  const k = eBack(P(t, t0, .4)), x = P(t, t1, .25);
  return `<g transform="translate(360,${y}) rotate(${-3 + 2 * Math.sin((t - t0) * 2)}) scale(${k * (1 - .3 * x)})" opacity="${1 - x}">
   <rect x="-264" y="-76" width="540" height="160" rx="12" fill="${C.ink}"/><rect x="-270" y="-82" width="540" height="160" rx="12" fill="#fff7b8" stroke="${C.ink}" stroke-width="5"/>
   <circle cx="0" cy="-82" r="16" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>
   <text y="-38" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="800" font-size="18" letter-spacing="3" fill="#8a7a2a">ПРАВИЛО ТЁМЫ</text>
   <text y="16" text-anchor="middle" dy="0.36em" font-family="Caveat" font-weight="700" font-size="46" fill="#24306b">Месяц-два — всегда в запасе</text></g>`;
}
const T9 = { s: 105.5, e: 115.3, draw(t) { // "держи" + rule
  const press = P(t, 109.9, .4);
  const reach = eOut(P(t, 108.5, .9));
  const tyE = talkE(t, 106.3, 108.1, { eyes: t < 109.9 ? 'happy' : 'angry', brow: t < 109.9 ? 'up' : 'down', mouth: t < 109.9 ? 'smile' : 'line', blush: t < 109.9 });
  const tyE2 = win(t, 111.7, 115.1) ? { ...tyE, mouth: 'talk', open: env(t) * 1.7 } : tyE;
  const scene = kitchenBG() + person({ x: 170, y: 760, r: 110, kind: 'tyoma', legs: false, e: tyE2 }) +
    person({ x: 570, y: 760, r: 110, kind: 'hero', legs: false, e: { eyes: press > .5 ? 'wide' : 'open', brow: 'up', mouth: press > .5 ? 'o' : 'smile', look: [-1, .5] } }) +
    table(960) + envelope(380, 930, 1.1, 4, { crossed: 1 }) +
    (reach > 0 ? `<g transform="translate(${lerp(640, 470, reach)},925)"><path d="M0 0 L90 60" stroke="${C.ink}" stroke-width="52" stroke-linecap="round"/><path d="M0 0 L90 60" stroke="${C.jacket}" stroke-width="42" stroke-linecap="round"/><circle r="26" fill="#fff" stroke="${C.ink}" stroke-width="4"/></g>` : '') +
    (press > 0 ? `<g transform="translate(${lerp(120, 330, eOut(press))},915)"><path d="M0 0 L-90 60" stroke="${C.ink}" stroke-width="52" stroke-linecap="round"/><path d="M0 0 L-90 60" stroke="#8db6e6" stroke-width="42" stroke-linecap="round"/><circle r="26" fill="#fff" stroke="${C.ink}" stroke-width="4"/></g>` : '');
  const [sx, sy] = shake(t, 110.3, .25, 10);
  return cam(scene, { z: lerp(1.0, 1.12, P(t, 105.5, 9.8)), cx: 360, cy: 860, sx, sy }) +
    dialog(t, { t0: 106.3, t1: 108.3, name: 'ТЁМА', nameBg: '#8db6e6', text: 'Держи. Вернёшь,\nкогда *сможешь*.', y: 250, cps: 20 }) +
    KT(t, 110.0, 111.6, [{ t: 'СТОП', c: C.red }], { x: 360, y: 420, size: 80, rot: -6 }) +
    dialog(t, { t0: 111.7, t1: 115.2, name: 'ТЁМА', nameBg: '#8db6e6', text: 'Только запомни: *месяц-два*\nвсегда должны быть в запасе.', y: 250, cps: 19 }) +
    tyomaRule(t, 112.8, 115.2, 1080);
} };
const T10 = { s: 115.3, e: 121.2, draw(t) { // ledger + debt
  const sc = `<rect x="-400" y="-400" width="1520" height="2080" fill="#8d5a36"/>` + ledger(t, [
    { t0: -1, l: 'Начало', v: '$3000' }, { t0: 116.3, l: '+ долг Тёмы', v: '+$1200', c: '#1f8a4c' }, { t0: 119.4, l: 'Долг Тёме: $1200', c: C.red, box: 1, dy: 20 }], { y: 250, h: 900 });
  return cam(sc, { z: lerp(1.0, 1.06, P(t, 115.3, 6)), cx: 360, cy: 560 }) +
    KT(t, 117.0, 118.3, [{ t: '+$1 200', c: C.grn }], { x: 360, y: 880, size: 76, rot: -4 }) +
    KTag(t, 120.3, 121.2, 'В РАМКЕ — ДОЛГ', { x: 360, y: 900, size: 30, bg: C.red, fg: '#fff', rot: 3 });
} };
const T11 = { s: 121.2, e: 123.9, draw(t) { // risk
  const scene = kitchenBG() + person({ x: 360, y: 760, r: 150, kind: 'hero', legs: false, e: { eyes: 'open', brow: 'worried', mouth: 'wavy', sweat: true, look: [-.6, .8] } }) + table(1100) + envelope(200, 1070, 1.0, -6, { crossed: 1 });
  return cam(scene, { z: lerp(1.0, 1.15, P(t, 121.2, 2.7)), cx: 360, cy: 800 }) +
    KT(t, 121.3, 123.9, 'РИСКУЕШЬ', { x: 360, y: 330, size: 60, rot: -3 }) +
    KTag(t, 122.3, 123.9, 'ЧУЖИМИ ДЕНЬГАМИ', { x: 380, y: 420, size: 30, bg: C.red, fg: '#fff', rot: 3 });
} };
function listing(y, title, price, hot, k = 1) {
  return `<g transform="translate(0,${y})" opacity="${k}"><rect x="-190" y="-58" width="380" height="116" rx="18" fill="${hot ? '#fff6cf' : '#fff'}" stroke="${hot ? C.yel : '#d8d8e0'}" stroke-width="${hot ? 6 : 3}"/>
   <rect x="-174" y="-42" width="84" height="84" rx="14" fill="#eceef3" stroke="${C.ink}" stroke-width="3"/>${consoleBox(-132, 0, .3)}
   <text x="-72" y="-18" dy="0.36em" font-family="Rubik" font-weight="800" font-size="20" fill="#55525e">${title}</text>
   <text x="-72" y="20" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="34" fill="${hot ? C.red : C.ink}">${price}</text></g>`;
}
const T12 = { s: 123.9, e: 134.85, draw(t) { // ads
  const k = eOut(P(t, 123.9, .4)), scroll = lerp(80, 0, eOut(P(t, 124.6, 1.2)));
  const hot = t >= 130.3;
  const inner = `<g transform="translate(0,${scroll})">${listing(-200, 'PS5 · как новая', '$350')}${listing(-60, 'PS5 срочно', '$300')}${listing(80, 'PS5 «все игры»', '$280', hot)}${listing(220, 'PS5 + 2 геймпада', '$390', false, .7)}</g>`;
  const sc = stripesBG(t, '#1c2350', '#222b60') + handsHolding(t) + phone(360, lerp(1300, 690, k), 440, 820, inner, 0, '#2ea56a', 'Объявления');
  let out = cam(sc, { z: hot ? lerp(1, 1.12, eOut(P(t, 130.3, .5))) : 1, cx: 360, cy: hot ? 760 : 640 });
  out += locBanner(t, 124.0, 125.4, '20:00', 'ОБЪЯВЛЕНИЯ');
  out += KTag(t, 125.6, 128.2, 'ПОЛГОРОДА ПРОДАЁТ', { x: 340, y: 330, size: 30, bg: C.red, fg: '#fff', rot: -3 });
  out += KTag(t, 128.3, 130.2, 'ПОЛГОРОДА ПОКУПАЕТ', { x: 380, y: 400, size: 30, bg: C.grn, fg: '#fff', rot: 3 });
  out += KT(t, 130.4, 132.3, [{ t: 'САМАЯ ДЕШЁВАЯ', c: '#fff' }], { x: 360, y: 300, size: 40, rot: -3 }, 'pop');
  if (t >= 132.3) { // thought bubble
    const bk = eBack(P(t, 132.3, .35));
    out += `<g transform="translate(470,310) scale(${bk})"><circle cx="-150" cy="110" r="14" fill="#fff" stroke="${C.ink}" stroke-width="4"/><circle cx="-120" cy="80" r="20" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
      <ellipse cx="0" cy="0" rx="230" ry="80" fill="#fff" stroke="${C.ink}" stroke-width="5"/>
      <text y="-16" text-anchor="middle" dy="0.36em" font-family="Caveat" font-weight="700" font-size="40" fill="${C.ink}">возьму две</text>
      <text y="26" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="34" fill="${C.blue}">по $270</text></g>`;
  }
  return out;
} };
const T13 = { s: 134.85, e: 139.5, draw(t) { // hood seller hurries
  const sE = talkE(t, 137.4, 139.3, { eyes: 'half', brow: 'sly', mouth: 'smirk' });
  const scene = stairsBG(t) + person({ x: 230, y: 760, r: 100, kind: 'hood', e: sE }) + person({ x: 560, y: 790, r: 92, kind: 'hero', e: { eyes: 'open', brow: 'down', mouth: 'line', look: [-1, 0] } });
  let out = cam(scene, { z: lerp(1.0, 1.1, P(t, 134.85, 4.6)), cx: 360, cy: 760 }) + locBanner(t, 134.95, 136.7, '20:40', 'ТЁМНЫЙ ПОДЪЕЗД');
  out += dialog(t, { t0: 137.4, t1: 139.4, name: 'ПРОДАВЕЦ', nameBg: '#b9b8c4', text: 'Бери _быстрее_,\nещё трое едут.', y: 250, cps: 20 });
  if (t > 138.2) { // pressure ring
    const k = eBack(P(t, 138.2, .3));
    out += `<g transform="translate(400,470) scale(${k * .9})">${[0, 1, 2].map(i => `<g transform="translate(${(i - 1) * 64},0)"><circle r="26" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/>${head({ r: 16, kind: 'colB', e: { eyes: 'open' } })}</g>`).join('')}
      <text y="56" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="800" font-size="20" fill="#fff" stroke="${C.ink}" stroke-width="5" paint-order="stroke">ЕДУТ +3</text></g>`;
  }
  return out;
} };
function inspection(t, items, title, okMode, ix = 36, iy = 250) {
  let s = `<g transform="translate(${ix},${iy})"><rect x="6" y="8" width="300" height="${70 + items.length * 56}" rx="16" fill="${C.ink}"/><rect width="300" height="${70 + items.length * 56}" rx="16" fill="#17141f" stroke="${C.ink}" stroke-width="4"/>
   <text x="20" y="34" dy="0.36em" font-family="Rubik" font-weight="800" font-size="18" letter-spacing="2" fill="${C.yel}">${title}</text>`;
  items.forEach(([t0, txt, ok], i) => {
    const on = t >= t0, k = eBack(P(t, t0, .3));
    s += `<g transform="translate(20,${80 + i * 56})"><rect width="32" height="32" rx="8" fill="${on ? (ok ? C.grn : C.red) : '#3a3546'}" stroke="${C.ink}" stroke-width="3" transform="translate(16,16) scale(${on ? k : 1}) translate(-16,-16)"/>
      ${on ? (ok ? `<path d="M7 16 l6 7 l12 -14" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` : `<path d="M9 9 l14 14 M23 9 l-14 14" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`) : ''}
      <text x="46" y="16" dy="0.36em" font-family="Rubik" font-weight="800" font-size="22" fill="${on ? '#fff' : '#6e6a7c'}">${txt}</text></g>`;
  });
  return s + '</g>';
}
const T14 = { s: 139.5, e: 147.2, draw(t) { // flashlight inspection
  const fl = P(t, 140.2, .3);
  const mx = 360 + Math.sin(t * 1.3) * 60, my = 720 + Math.cos(t * 1.1) * 80;
  const marks = [[142.5, 320, 470, 'пломба'], [143.6, 420, 640, 'винты'], [145.0, 330, 920, 'серийник']];
  let con = `<rect x="-400" y="-400" width="1520" height="2080" fill="#0e0d14"/>
    <g transform="translate(360,700)"><rect x="-150" y="-380" width="300" height="760" rx="70" fill="#f2f2f6" stroke="${C.ink}" stroke-width="7"/><rect x="-36" y="-380" width="72" height="760" fill="#1d1b24"/>
    <g transform="translate(-60,-230) rotate(-14)"><rect x="-40" y="-24" width="80" height="48" fill="#fff" stroke="${C.ink}" stroke-width="3"/><path d="M-4 -24 l8 16 l-6 10 l8 22" stroke="${C.red}" stroke-width="4" fill="none"/></g>
    <circle cx="60" cy="-60" r="16" fill="#9a9aa6" stroke="${C.ink}" stroke-width="3"/><path d="M50 -70 l20 20 M48 -58 l14 -6" stroke="#55525e" stroke-width="3"/>
    <circle cx="60" cy="0" r="16" fill="#9a9aa6" stroke="${C.ink}" stroke-width="3"/><path d="M50 -6 l18 14" stroke="#55525e" stroke-width="3"/>
    <g transform="translate(-40,230) rotate(9)"><rect x="-60" y="-34" width="120" height="68" fill="#fff" stroke="${C.ink}" stroke-width="3"/>${[...Array(12)].map((_, i) => `<rect x="${-50 + i * 8}" y="-24" width="${i % 3 ? 3 : 5}" height="34" fill="${C.ink}"/>`).join('')}</g></g>`;
  marks.forEach(([t0, x, y]) => { if (t >= t0) { const k = P(t, t0, .35), L = 2 * Math.PI * 80; con += `<circle cx="${x}" cy="${y}" r="80" fill="none" stroke="${C.red}" stroke-width="8" stroke-dasharray="${L}" stroke-dashoffset="${L * (1 - k)}"/>`; } });
  const mid = uid('fl');
  const lit = `<defs><radialGradient id="${mid}"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".92"/></radialGradient></defs><rect x="-400" y="-400" width="1520" height="2080" fill="url(#${mid})" transform="translate(${mx - 360},${my - 640})"/>`;
  return cam(con + (fl > 0 ? lit : dim(.9)), { z: lerp(1.15, 1.0, eOut(P(t, 139.5, .6))), cx: 470, cy: 680 }) +
    inspection(t, [[142.5, 'Пломба', 0], [143.6, 'Винты', 0], [146.0, 'Серийник', 0]], 'ПРОВЕРКА', 0, 400, 250) +
    KT(t, 140.2, 141.6, [{ t: 'ФОНАРИК', c: C.yel }], { x: 470, y: 1040, size: 40, rot: -4 }, 'pop');
} };
const T15 = { s: 147.2, e: 153.1, draw(t) { // refusal + shout
  const scene = stairsBG(t) + person({ x: 200, y: 780, r: 100, kind: 'hood', e: talkE(t, 149.0, 151.6, { eyes: 'angry', brow: 'down', mouth: 'frown' }) }) +
    person({ x: lerp(560, 760, eIn(P(t, 149.2, 3.5))), y: 790, r: 92, kind: 'hero', walk: t > 149.2 ? (t - 149.2) * 8 : 0, flip: t > 149.2, e: talkE(t, 147.3, 148.9, { eyes: 'half', brow: 'down', mouth: 'line', look: [-1, 0] }) });
  return cam(scene, { z: 1.05, cx: 360, cy: 760 }) +
    dialog(t, { t0: 147.3, t1: 149.0, name: 'ТЫ', nameBg: C.red, text: 'Вскрытая. _Не надо._', y: 250, cps: 22 }) +
    dialog(t, { t0: 149.1, t1: 153.0, name: 'ПРОДАВЕЦ', nameBg: '#b9b8c4', text: 'Да она *прошитая*, там все\nигры бесплатно!', y: 250, cps: 20 }) +
    KT(t, 151.7, 153.0, 'КРИЧИТ ВСЛЕД', { x: 330, y: 520, size: 34, rot: -5, fill: '#e9e6f2' }, 'rise');
} };
const T16 = { s: 153.1, e: 158.3, draw(t) { // ban warning
  if (t < 155.2) {
    const scene = stairsBG(t) + person({ x: 360, y: 760, r: 150, kind: 'hero', legs: false, e: { eyes: 'open', brow: 'down', mouth: 'smirk' } });
    return cam(scene, { z: lerp(1.0, 1.12, P(t, 153.1, 2.1)), cx: 360, cy: 760 }) +
      KT(t, 154.1, 155.2, [{ t: 'ЧЕСТНЫЙ', c: C.grn }, { t: ' КЛУБ', c: '#fff' }], { x: 360, y: 340, size: 56, rot: -3 });
  }
  const g = Math.sin(t * 60) > .7 ? 8 : 0;
  const k = eBack(P(t, 155.2, .3));
  let s = `<rect width="720" height="1280" fill="#2a0a12"/>`;
  for (let i = 0; i < 40; i++) s += `<rect y="${i * 32}" width="720" height="2" fill="#ff4757" opacity=".08"/>`;
  s += `<g transform="translate(${360 + g},560) scale(${k})"><circle r="110" fill="${C.red}" stroke="${C.ink}" stroke-width="8"/><rect x="-62" y="-14" width="124" height="28" rx="8" fill="#fff"/></g>`;
  s += KT(t, 155.3, 158.3, [{ t: 'АККАУНТ', c: '#fff' }], { x: 360 - g, y: 760, size: 60, rot: 0 }) + KT(t, 156.3, 158.3, [{ t: 'ЗАБАНЕН', c: C.red }], { x: 360 + g, y: 850, size: 80, rot: 0 });
  s += KTag(t, 157.2, 158.3, 'В НОЧЬ РЕЛИЗА', { x: 360, y: 960, size: 30, bg: C.yel, rot: -3 });
  s += KTag(t, 155.3, 158.3, 'ПРОШИВКА', { x: 360, y: 380, size: 30, bg: '#fff', rot: 2 });
  return s;
} };
const T17 = { s: 158.3, e: 173.0, draw(t) { // courtyard honest seller
  const lt = t - this.s;
  const check = t >= 164.5 && t < 168.1;
  const dadE = talkE(t, 162.5, 164.3, talkE(t, 170.5, 171.4, { eyes: 'happy', brow: 'up', mouth: 'smile', blush: true }));
  const heroE = t > 172.9 ? { eyes: 'open', brow: 'worried', mouth: 'wavy', look: [1, 0], sweat: true } : check ? { eyes: 'half', brow: 'down', mouth: 'line', look: [1, -.5] } : t > 168.1 ? { eyes: 'open', brow: 'worried', mouth: 'line', look: [1, -.5] } : { eyes: 'open', brow: 'flat', mouth: 'line', look: [1, 0] };
  const hum = t > 168.1 ? Math.sin(t * 60) * 3 : 0;
  const scene = yardBG(t) + `<g transform="translate(${hum},0)">${car(300, 960)}</g>` +
    person({ x: 120, y: 760, r: 88, kind: 'hero', e: heroE }) +
    person({ x: 540, y: 760, r: 86, kind: 'dad', e: dadE, pose: t > 171.5 && t < 172.6 ? 'up' : 'stand' }) +
    person({ x: 660, y: 900, r: 52, kind: 'kid', e: { eyes: 'happy', mouth: 'smile', blush: true } });
  const z = check ? lerp(1.0, 1.35, eOut(P(t, 164.5, .5))) : lerp(1.06, 1.0, P(t, 158.3, 4));
  let out = cam(scene, { z, cx: check ? 420 : 360, cy: check ? 760 : 700 });
  out += locBanner(t, 158.5, 160.6, '21:30', 'ДВОР');
  out += KTag(t, 159.6, 160.6, 'ПАПА С СЫНОМ', { x: 520, y: 470, size: 26, bg: '#fff', rot: 3 });
  out += KTag(t, 160.7, 162.4, '2 ПРИСТАВКИ В БАГАЖНИКЕ', { x: 360, y: 460, size: 24, bg: C.yel, rot: -2 });
  out += dialog(t, { t0: 162.5, t1: 164.4, name: 'ПРОДАВЕЦ', nameBg: '#ffb3a8', text: 'Сыну на учёбу,\nпродаю *обе*.', y: 250, cps: 20 });
  if (t >= 164.5 && t < 170.4) out += inspection(t, [[165.1, 'Пломбы', 1], [166.0, 'Серийники', 1], [166.8, 'Оригинал', 1]], 'ПРОВЕРКА', 1);
  if (t >= 168.1 && t < 173.0) out += KTag(t, 168.1, 170.4, '⚠ ВТОРАЯ ГУДИТ', { x: 470, y: 520, size: 26, bg: C.yel, rot: 4 }).replace('⚠ ', '! ');
  out += dialog(t, { t0: 170.5, t1: 172.5, name: 'ПРОДАВЕЦ', nameBg: '#ffb3a8', text: 'Пыль, норм.', y: 250, cps: 18 });
  out += KT(t, 172.9, 173.0, '...', { x: 160, y: 520, size: 60 });
  return out;
} };
const T18 = { s: 173.0, e: 176.85, draw(t) { // doubt → pay
  const pay = t >= 174.2;
  const scene = yardBG(t) + car(300, 960) + person({ x: 300, y: 760, r: 140, kind: 'hero', legs: false, e: pay ? { eyes: 'half', brow: 'worried', mouth: 'smile' } : { eyes: 'open', brow: 'worried', mouth: 'wavy', sweat: true, look: [.5, 0] } }) +
    (pay ? `<g transform="translate(${lerp(460, 640, eOut(P(t, 174.3, .6)))},940) rotate(-12)"><rect x="-70" y="-40" width="140" height="80" rx="6" fill="#64c47c" stroke="${C.ink}" stroke-width="4"/><text dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#1f6a35">$700</text></g>` : '');
  return cam(scene, { z: lerp(1.15, 1.0, eOut(P(t, 173, .5))), cx: 330, cy: 800 }) +
    KT(t, 173.0, 174.1, 'СОМНЕВАЕШЬСЯ...', { x: 360, y: 360, size: 40, rot: -3, fill: '#e9e6f2' }, 'rise') +
    KT(t, 174.2, 176.85, [{ t: 'НО ПЛАТИШЬ', c: C.yel }], { x: 360, y: 360, size: 50, rot: 3 }) +
    achievement(t, 175.3, 176.8, 'Честные приставки ×2');
} };
const T19 = { s: 176.85, e: 183.4, draw(t) { // PS store digital
  const k = eOut(P(t, 176.85, .4)), bought = t >= 179.9;
  const inner = `<rect x="-190" y="-340" width="380" height="250" rx="16" fill="#ff8a3d"/>${[[-170, -200, 40, 110], [-120, -240, 36, 150], [-76, -180, 30, 90]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#5b2a86"/>`).join('')}<circle cx="90" cy="-220" r="50" fill="#ffd166"/>
    <text x="0" y="-290" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="40" fill="#fff" stroke="${C.ink}" stroke-width="8" paint-order="stroke">GTA 6</text>
    <text x="-180" y="-40" font-family="Rubik" font-weight="800" font-size="22" fill="#55525e">Цифровая версия</text>
    <text x="-180" y="20" font-family="Unbounded" font-weight="900" font-size="52" fill="${C.ink}">$70</text><text x="-50" y="16" font-family="Rubik" font-weight="800" font-size="28" fill="${C.blue}">× 2 консоли</text>
    <g transform="translate(0,${t >= 178.4 ? 0 : 0})"><rect x="-180" y="60" width="360" height="70" rx="14" fill="#f4f4f8" stroke="#d8d8e0" stroke-width="3"/><text x="0" y="95" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="800" font-size="24" fill="${t >= 178.4 ? C.red : '#8a8796'}">${t >= 178.4 ? 'ДИСК: НЕТ' : 'ДИСК'}</text></g>
    <rect x="-180" y="160" width="360" height="90" rx="45" fill="${bought ? C.grn : C.blue}" stroke="${C.ink}" stroke-width="5"/><text x="0" y="205" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="30" fill="#fff">${bought ? 'КУПЛЕНО ✓'.replace(' ✓', '') : 'КУПИТЬ'}</text>`;
  const sc = stripesBG(t, '#101a3d', '#152150') + handsHolding(t) + phone(360, lerp(1300, 680, k), 460, 860, inner, 0, '#0b2a6b', 'Store');
  return cam(sc, { z: 1, cx: 360, cy: 640 }) +
    KT(t, 176.9, 179.0, [{ t: 'ДИСКОВ ', c: '#fff' }, { t: 'НЕТ', c: C.red }], { x: 360, y: 290, size: 52, rot: -3 }) +
    KTag(t, 179.0, 179.9, 'ТОЛЬКО ЦИФРА', { x: 360, y: 370, size: 30, bg: C.yel, rot: 3 }) +
    KTag(t, 180.0, 183.4, 'КОПИЯ НА КАЖДУЮ', { x: 360, y: 300, size: 30, bg: '#fff', rot: -3 });
} };
const T20 = { s: 183.4, e: 191.6, draw(t) { // 75" dream TV
  const dream = t >= 189.0;
  const heroE = dream ? talkE(t, 189.0, 191.4, { eyes: 'happy', brow: 'up', mouth: 'grin', blush: true }) : { eyes: 'wide', brow: 'up', mouth: 'o', look: [0, -1] };
  let scene = storeBG() + `<g opacity="${.25 + .1 * Math.sin(t * 3)}"><polygon points="140,0 580,0 700,900 20,900" fill="#fff"/></g>` + bigTV(60, 420, 600, 360, true, '75"') +
    priceTag(560, 410, '$1 100', C.yel, 10, 1.3) + person({ x: 360, y: 1000, r: 100, kind: 'hero', e: heroE });
  if (dream) {
    const bk = eBack(P(t, 189.1, .35));
    scene += `<g transform="translate(360,610) scale(${bk})"><ellipse rx="300" ry="150" fill="#fff" stroke="${C.ink}" stroke-width="6"/><circle cx="-10" cy="190" r="22" fill="#fff" stroke="${C.ink}" stroke-width="5"/>
      <text y="-90" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="800" font-size="22" letter-spacing="3" fill="#8a8796">ОЧЕРЕДЬ</text>
      ${[0, 1, 2, 3, 4, 5].map(i => { const kk = eBack(P(t, 189.4 + i * .15, .3)); return kk > 0 ? `<g transform="translate(${-225 + i * 90},10) scale(${kk})">${head({ r: 34, kind: ['colA', 'colB', 'kid', 'colA', 'tyoma', 'colB'][i], e: { eyes: 'happy', mouth: 'smile', blush: true } })}</g>` : ''; }).join('')}</g>`;
  }
  return cam(scene, { z: dream ? 1.0 : lerp(1.0, 1.12, eIO(P(t, 183.4, 5))), cx: 360, cy: 700 }) +
    locBanner(t, 183.5, 185.0, '22:10', 'МАГАЗИН ЭЛЕКТРОНИКИ') +
    KT(t, 184.3, 185.6, 'ЗАМИРАЕШЬ', { x: 360, y: 380, size: 44, rot: -3 }, 'pop') +
    KT(t, 187.6, 189.0, [{ t: '$1 100', c: C.red }], { x: 360, y: 880, size: 72, rot: -4 }) +
    dialog(t, { t0: 189.1, t1: 191.5, name: 'ТЫ', nameBg: C.red, text: 'Вот на таком к нам бы\n*все* ходили...', y: 250, cps: 18 });
} };
const T21 = { s: 191.6, e: 195.6, draw(t) { // Tyoma message
  const k = eOut(P(t, 191.6, .35)), typing = t < 193.0;
  const bub = t >= 193.0 ? `<g transform="translate(-170,-130) scale(${eBack(P(t, 193.0, .3))})"><rect width="320" height="110" rx="22" fill="#e3e8f4" stroke="#c8cfe0" stroke-width="3"/><text x="22" y="40" font-family="Rubik" font-weight="800" font-size="26" fill="${C.ink}">Месяц-два в запасе.</text><text x="22" y="80" font-family="Rubik" font-weight="800" font-size="26" fill="${C.ink}">Помнишь?</text></g>`
    : `<g transform="translate(-170,-130)"><rect width="110" height="56" rx="22" fill="#e3e8f4"/>${[0, 1, 2].map(i => `<circle cx="${30 + i * 25}" cy="28" r="7" fill="#8a8796" opacity="${.3 + .7 * (Math.floor(t * 6) % 3 === i)}"/>`).join('')}</g>`;
  const inner = `<circle cx="-150" cy="-310" r="26" fill="#8db6e6" stroke="${C.ink}" stroke-width="3"/>${head({ x: -150, y: -310, r: 22, kind: 'tyoma', e: { eyes: 'open', mouth: 'line' } })}
    <text x="-110" y="-318" font-family="Unbounded" font-weight="900" font-size="24" fill="${C.ink}">Тёма</text><text x="-110" y="-290" font-family="Rubik" font-weight="800" font-size="16" fill="${C.grn}">в сети</text>` + bub;
  const sc = stripesBG(t, '#1c2350', '#222b60') + handsHolding(t) + phone(360, lerp(1300, 700, k), 440, 820, inner, 0, null);
  const [sx, sy] = shake(t, 191.7, .3, 10);
  return cam(sc, { z: 1, cx: 360, cy: 640, sx, sy }) + KT(t, 191.7, 193.0, [{ t: 'ДЗЫНЬ!', c: C.yel }], { x: 520, y: 330, size: 48, rot: 10 }, 'pop') +
    tyomaRule(t, 194.0, 195.6, 1090);
} };
const T22 = { s: 195.6, e: 202.2, draw(t) { // buy 50" + gamepads
  const scene = storeBG() + bigTV(120, 430, 320, 200, false, '') + `<text x="280" y="530" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="44" fill="#fff">50"</text>` +
    priceTag(400, 420, '$300', C.yel, 8) + gamepad(540, 720, .9, -10) + gamepad(600, 780, .9, 8, '#2b2833') + priceTag(580, 640, '$150', C.yel, -6) +
    person({ x: 260, y: 900, r: 100, kind: 'hero', e: { eyes: t < 196.6 ? 'closed' : 'half', brow: 'worried', mouth: t < 196.6 ? 'line' : 'smile' } });
  return cam(scene, { z: lerp(1.08, 1.0, P(t, 195.6, 6)), cx: 360, cy: 700 }) +
    KT(t, 195.7, 196.7, 'ВЗДОХ', { x: 160, y: 420, size: 34, rot: -8, fill: '#e9e6f2' }, 'rise') +
    KTag(t, 196.7, 202.2, 'ОБЫЧНЫЙ', { x: 280, y: 380, size: 28, bg: '#fff', rot: -3 }) +
    KTag(t, 199.3, 202.2, 'ТВ + 2 ГЕЙМПАДА', { x: 400, y: 1080, size: 26, bg: C.yel, rot: -3 });
} };
const T23 = { s: 202.2, e: 207.5, draw(t) { // groceries
  const items = [[204.2, 'ГРЕЧКА', '#c9874b', 150], [204.7, 'МАКАРОНЫ', '#f2c53d', 360], [205.4, 'ЧАЙ', '#2ea56a', 560]];
  let s = storeBG();
  items.forEach(([t0, l, col, x]) => {
    const k = eBack(P(t, t0, .35));
    if (k <= 0) return;
    s += `<g transform="translate(${x},${lerp(300, 640, k)}) scale(${k}) rotate(${(x - 360) / 40})"><rect x="-80" y="-130" width="160" height="260" rx="14" fill="${col}" stroke="${C.ink}" stroke-width="6"/>
      <rect x="-64" y="-30" width="128" height="60" rx="8" fill="#fff"/><text dy="0.36em" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${l.length > 6 ? 20 : 26}" fill="${C.ink}">${l}</text></g>`;
  });
  s += person({ x: 360, y: 1000, r: 90, kind: 'hero', e: { eyes: 'half', brow: 'flat', mouth: 'line' } });
  return cam(s, { z: 1, cx: 360, cy: 680 }) + locBanner(t, 202.3, 203.8, '22:40', 'СУПЕРМАРКЕТ') +
    KTag(t, 203.2, 207.5, 'ТОЛЬКО НУЖНОЕ', { x: 360, y: 420, size: 28, bg: '#fff', rot: 2 }) +
    KT(t, 206.0, 207.5, [{ t: '−$40', c: C.red }, { t: ' / НЕДЕЛЯ', c: '#fff' }], { x: 360, y: 900, size: 50, rot: -3 });
} };
function buildBar(t, steps) {
  const done = steps.filter(s => t >= s[0]).length, k = steps.length ? done / steps.length : 0;
  return `<g transform="translate(60,250)"><rect x="5" y="7" width="600" height="96" rx="18" fill="${C.ink}"/><rect width="600" height="96" rx="18" fill="#17141f" stroke="${C.ink}" stroke-width="4"/>
   <text x="22" y="28" dy="0.36em" font-family="Rubik" font-weight="800" font-size="17" letter-spacing="2" fill="${C.yel}">СТРОИМ КЛУБ</text>
   <text x="578" y="28" dy="0.36em" text-anchor="end" font-family="Unbounded" font-weight="900" font-size="20" fill="#fff">${Math.round(k * 100)}%</text>
   <rect x="22" y="56" width="556" height="22" rx="11" fill="#3a3546"/><rect x="22" y="56" width="${556 * k}" height="22" rx="11" fill="${C.grn}"/></g>`;
}
const T24 = { s: 207.5, e: 216.5, draw(t) { // build the club
  const push = eOut(P(t, 209.9, 1.0));
  const plug = t >= 212.5;
  const scene = grannyFlatBG(t, { noSideboard: true, noTV: plug, crtOn: false }) +
    `<g transform="translate(${lerp(0, 160, push)},0)"><rect x="470" y="330" width="230" height="560" fill="#7a4b2c" stroke="${C.ink}" stroke-width="6"/><rect x="490" y="350" width="190" height="210" fill="#bfe3ef" stroke="${C.ink}" stroke-width="5"/></g>` +
    (plug ? `<rect x="-20" y="650" width="560" height="240" fill="#6e4329" stroke="${C.ink}" stroke-width="6"/>` +
      `<g opacity="${P(t, 213.3, .3)}"><rect x="20" y="500" width="190" height="150" rx="16" fill="#5a5a66" stroke="${C.ink}" stroke-width="6"/><rect x="40" y="518" width="130" height="112" rx="10" fill="#ff8a3d" stroke="${C.ink}" stroke-width="4"/><text x="105" y="574" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="22" fill="#fff">GTA 6</text></g>` +
      `<g opacity="${P(t, 214.6, .3)}">${bigTV(250, 470, 260, 170, true, '')}</g>` +
      `<g opacity="${P(t, 215.5, .3)}">${consoleBox(150, 760, .45, 90)}${consoleBox(380, 760, .45, 90)}</g>` : '') +
    person({ x: plug ? 560 : lerp(300, 430, push), y: 800, r: 90, kind: 'hero', pose: plug ? 'stand' : 'stand', e: { eyes: 'open', brow: 'down', mouth: push > 0 && push < 1 ? 'grin' : 'smirk' } });
  return cam(scene, { z: 1.0, cx: 360, cy: 700 }) + locBanner(t, 207.6, 209.2, '23:00', 'НОЧЬ') +
    buildBar(t, [[209.9], [211.0], [213.3], [214.6], [215.5]]) +
    KT(t, 208.8, 209.9, [{ t: 'КВАРТИРА → КЛУБ', c: C.yel }], { x: 360, y: 440, size: 40, rot: -3 }, 'pop') +
    KTag(t, 209.9, 211.0, 'СЕРВАНТ — В СТОРОНУ', { x: 380, y: 430, size: 24, bg: '#fff', rot: 3 }) +
    KTag(t, 213.3, 215.5, 'СТАРЫЙ + НОВЫЙ', { x: 300, y: 430, size: 26, bg: C.yel, rot: -3 });
} };
const T25 = { s: 216.5, e: 221.3, draw(t) { // sign
  const k = eBack(P(t, 216.7, .45));
  const sw = Math.sin((t - 216.7) * 5) * 4 * Math.exp(-(t - 216.7) * 1.5);
  const scene = `<rect x="-400" y="-400" width="1520" height="2080" fill="#e9d9bf"/>` +
    `<rect x="190" y="560" width="340" height="760" fill="#7a4b2c" stroke="${C.ink}" stroke-width="7"/><circle cx="490" cy="950" r="14" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/>` +
    `<g transform="translate(360,${lerp(-200, 380, k)}) rotate(${sw})"><path d="M-120 -110 L0 -190 L120 -110" fill="none" stroke="${C.ink}" stroke-width="5"/><rect x="-224" y="-104" width="460" height="230" rx="14" fill="${C.ink}"/><rect x="-230" y="-110" width="460" height="230" rx="14" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
     <text y="-46" text-anchor="middle" dy="0.36em" font-family="Caveat" font-weight="700" font-size="74" fill="${C.ink}">PS КЛУБ</text>
     <text y="24" text-anchor="middle" dy="0.36em" font-family="Caveat" font-weight="700" font-size="50" fill="${C.red}" opacity="${P(t, 217.6, .3)}">$5 / час</text>
     <text y="78" text-anchor="middle" dy="0.36em" font-family="Caveat" font-weight="700" font-size="38" fill="#1f8a4c" opacity="${P(t, 219.3, .3)}">первый час — $3</text></g>`;
  return cam(scene, { z: lerp(1.0, 1.08, P(t, 216.5, 4.8)), cx: 360, cy: 600 }) +
    KTag(t, 219.4, 221.3, 'АКЦИЯ НА ОТКРЫТИЕ', { x: 360, y: 760, size: 28, bg: C.grn, fg: '#fff', rot: -3 });
} };
const T26 = { s: 221.3, e: 229.6, draw(t) { // granny calls
  const grE = talkE(t, 222.7, 225.2, { eyes: 'open', brow: 'worried', mouth: 'smile' });
  const heE = talkE(t, 225.4, 227.2, { eyes: 'half', brow: 'up', mouth: 'smile', sweat: t > 225 });
  const scene = grannyFlatBG(t, { noTV: true, noSideboard: true }) + person({ x: 270, y: 820, r: 130, kind: 'hero', pose: 'ear', legs: false, e: heE });
  const ck = eBack(P(t, 221.4, .4));
  const cam2 = `<g transform="translate(560,540) scale(${ck * .9})"><circle r="116" fill="#e9d9bf" stroke="${C.ink}" stroke-width="7"/><circle r="${128 + 8 * Math.sin(t * 8)}" fill="none" stroke="${C.grn}" stroke-width="5" opacity=".6"/>
    ${person({ x: 0, y: 10, r: 62, kind: 'granny', legs: false, e: grE })}<rect x="-80" y="76" width="160" height="40" rx="12" fill="${C.grn}" stroke="${C.ink}" stroke-width="4"/><text y="96" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="18" fill="#fff">БАБУШКА</text></g>`;
  return cam(scene, { z: 1.05, cx: 360, cy: 800 }) + `<g clip-path="none">${cam2}</g>` +
    dialog(t, { t0: 222.7, t1: 225.3, name: 'БАБУШКА', nameBg: C.grn, text: 'Внучок, ты там ничего\nне *затеваешь*?', y: 250, cps: 20 }) +
    dialog(t, { t0: 225.4, t1: 227.8, name: 'ТЫ', nameBg: C.red, text: 'Не-не, ба. Всё *спокойно*.', y: 250, cps: 20 }) +
    KTag(t, 228.0, 229.6, 'ТЕЛЕФОН НА ПЛЕЧЕ', { x: 300, y: 420, size: 24, bg: '#fff', rot: 4 });
} };
const T27 = { s: 229.6, e: 233.6, draw(t) { // peephole
  const k = eOut(P(t, 229.6, .8));
  const mid = uid('pp');
  const inner = grannyFlatBG(t, { noTV: true, noSideboard: true }).replace(/#e9d9bf/g, '#d9c8a9') + `<rect x="200" y="300" width="320" height="620" fill="#6e4329" stroke="${C.ink}" stroke-width="7"/>` +
    person({ x: 470, y: 820, r: 70, kind: 'hero', pose: 'box', e: { eyes: 'half', brow: 'flat', mouth: 'line' } });
  const fish = `<clipPath id="${mid}"><circle cx="360" cy="620" r="${lerp(80, 300, k)}"/></clipPath><rect width="720" height="1280" fill="#050508"/>
    <g clip-path="url(#${mid})"><g transform="translate(360,620) scale(${lerp(1.6, 1.15, k)}) translate(-360,-640)">${inner}</g><circle cx="360" cy="620" r="300" fill="none" stroke="#000" stroke-width="80" opacity=".5"/></g>
    <circle cx="360" cy="620" r="${lerp(80, 300, k)}" fill="none" stroke="#2a2a34" stroke-width="14"/>`;
  return fish + KT(t, 230.4, 233.6, [{ t: 'КТО-ТО', c: C.red }], { x: 360, y: 1010, size: 64, rot: -3 }) + KT(t, 232.6, 233.6, 'НАБЛЮДАЕТ', { x: 360, y: 1090, size: 40, rot: 2 }, 'rise') +
    `<g opacity="${P(t, 231.0, .5) * (.6 + .4 * Math.sin(t * 9))}"><ellipse cx="310" cy="300" rx="26" ry="18" fill="#fff"/><ellipse cx="410" cy="300" rx="26" ry="18" fill="#fff"/><circle cx="318" cy="302" r="9" fill="${C.ink}"/><circle cx="402" cy="302" r="9" fill="${C.ink}"/></g>`;
} };
const T28 = { s: 233.6, e: 255.2, draw(t) { // day 1 results
  const rows = [
    { t0: 235.6, l: 'Было', v: '$3000' }, { t0: 237.0, l: '+ долг Тёмы', v: '+$1200', c: '#1f8a4c' },
    { t0: 239.0, l: '− PS5 б/у ×2', v: '−$700', c: C.red }, { t0: 240.3, l: '− GTA 6 ×2', v: '−$140', c: C.red },
    { t0: 242.3, l: '− геймпады ×2', v: '−$150', c: C.red }, { t0: 243.6, l: '− телевизор 50"', v: '−$300', c: C.red },
    { t0: 245.0, l: '− на себя (нед. 1)', v: '−$40', c: C.red },
    { t0: 247.0, l: 'Итог', v: '$2870', big: 1, circle: 1, dy: 20 },
    { t0: 249.6, l: 'Долг Тёме: $1200 · вернул $0', c: C.red, box: 1, dy: 34 },
    { t0: 251.0, l: 'Запас без дохода', v: '11,5 мес', dy: 46 }];
  const focus = rows.filter(r => t >= r.t0).length;
  const cy = lerp(560, 760, clamp((focus - 4) / 6));
  const sc = `<rect x="-400" y="-400" width="1520" height="2080" fill="#8d5a36"/>` + ledger(t, rows, { y: 250, h: 960, lh: 60 });
  let out = cam(sc, { z: .97, cx: 360, cy: 610 });
  if (t < 235.6) out += dim(.55 * (1 - P(t, 235.2, .4)));
  out += KT(t, 233.7, 235.5, [{ t: 'ДЕНЬ 1', c: '#fff' }], { x: 360, y: 560, size: 90, rot: -4 }) + KT(t, 234.0, 235.5, [{ t: 'ПРОЙДЕН', c: C.yel }], { x: 360, y: 660, size: 60, rot: 3 });
  out += KT(t, 253.0, 255.2, [{ t: '11,5 МЕСЯЦЕВ', c: C.yel }], { x: 360, y: 1150, size: 52, rot: -3 });
  return out;
} };
const T29 = { s: 255.2, e: 265.3, draw(t) { // day 2, empty club
  const zero = t >= 261.5;
  const scene = `<rect x="-400" y="-400" width="1520" height="2080" fill="#2a2240"/>` +
    `<rect x="200" y="40" width="330" height="200" rx="8" fill="#6a2a35" stroke="${C.ink}" stroke-width="6"/>` +
    `<rect x="-20" y="560" width="760" height="300" fill="#4a2f22" stroke="${C.ink}" stroke-width="6"/>` +
    `<g>${'<rect x="20" y="380" width="230" height="170" rx="16" fill="#5a5a66" stroke="#1c1a24" stroke-width="6"/><rect x="40" y="398" width="190" height="134" rx="10" fill="#ff8a3d"/><text x="135" y="465" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">GTA 6</text>'}${bigTV(400, 370, 300, 190, true, 'GTA 6')}</g>` +
    consoleBox(140, 640, .4, 90) + consoleBox(550, 640, .4, 90) +
    `<ellipse cx="360" cy="1060" rx="420" ry="120" fill="#5e1f28" stroke="${C.ink}" stroke-width="6"/>` +
    `<g opacity="${P(t, 258.5, .4)}">${[150, 570].map(x => `<rect x="${x - 70}" y="900" width="140" height="80" rx="20" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="12 10" opacity=".7"/>`).join('')}</g>` +
    person({ x: 360, y: 1000, r: 100, kind: 'hero', legs: false, e: { eyes: zero ? 'half' : 'open', brow: zero ? 'worried' : 'flat', mouth: zero ? 'frown' : 'line', look: [0, -1] } });
  let out = cam(scene, { z: lerp(1.0, 1.1, P(t, 255.2, 10)), cx: 360, cy: 700 });
  out += locBanner(t, 255.3, 256.5, 'УТРО', 'ДЕНЬ 2');
  out += KTag(t, 256.5, 257.4, '2 ЭКРАНА', { x: 220, y: 330, size: 26, bg: '#fff', rot: -4 });
  out += KTag(t, 257.4, 258.5, '2 ПРИСТАВКИ', { x: 470, y: 330, size: 26, bg: '#fff', rot: 4 });
  out += KTag(t, 258.5, 259.6, '2 ПУСТЫХ МЕСТА', { x: 360, y: 860, size: 28, bg: C.yel, rot: -2 });
  if (t >= 259.7 && t < 261.5) out += dim(.5 * P(t, 259.7, .2)) + burst(t, 259.75, 360, 600, C.yel) + KT(t, 259.75, 261.4, [{ t: '2', c: C.yel }], { x: 360, y: 580, size: 220, rot: -4 }) + KT(t, 259.9, 261.4, 'ДНЯ ДО РЕЛИЗА', { x: 360, y: 740, size: 44, rot: 2 });
  if (zero) {
    const k = eBack(P(t, 261.5, .35));
    out += `<g transform="translate(360,560) scale(${k}) rotate(-3)"><rect x="-150" y="-110" width="300" height="220" rx="24" fill="${C.ink}" transform="translate(8,10)"/><rect x="-150" y="-110" width="300" height="220" rx="24" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
      <text y="-60" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="800" font-size="24" letter-spacing="4" fill="#8a8796">КЛИЕНТЫ</text>
      <text y="30" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="110" fill="${C.red}">0</text></g>`;
    out += KTag(t, 262.9, 265.3, 'О КЛУБЕ НЕ ЗНАЕТ НИКТО', { x: 360, y: 760, size: 26, bg: C.ink, fg: '#fff', rot: 2 });
  }
  return out;
} };
const T30 = { s: 265.3, e: 281.0, draw(t) { // poll
  const opts = [
    ['A', 'Реклама в сети', 'соцсети · чаты района', '−$50', C.blue, 267.6, 270.9],
    ['Б', 'Листовки', 'печать и раздача', '−$20', '#f29a2e', 271.0, 272.9],
    ['В', 'Сарафан', 'друзья и знакомые', '$0', C.grn, 273.0, 275.5]];
  let s = stripesBG(t, '#151036', '#1d1648');
  s += KT(t, 265.4, 281.0, 'КАК НАЙТИ', { x: 360, y: 250, size: 50, rot: -2 }, 'drop') + KT(t, 265.7, 281.0, [{ t: 'ПЕРВЫХ КЛИЕНТОВ?', c: C.yel }], { x: 360, y: 330, size: 40, rot: 1 }, 'drop');
  opts.forEach(([L, t1, t2, cost, col, a, b], i) => {
    const k = eBack(P(t, 266.3 + i * .25, .4)); if (k <= 0) return;
    const act = win(t, a, b), y = 470 + i * 170;
    s += `<g transform="translate(${lerp(-400, 360, k)},${y}) scale(${act ? 1.06 : 1}) rotate(${act ? -1.5 : 0})">
      <rect x="-294" y="-66" width="600" height="140" rx="26" fill="${C.ink}"/>
      <rect x="-300" y="-72" width="600" height="140" rx="26" fill="#fff" stroke="${act ? C.yel : C.ink}" stroke-width="${act ? 8 : 5}"/>
      <rect x="-286" y="-58" width="112" height="112" rx="20" fill="${col}" stroke="${C.ink}" stroke-width="4"/>
      <text x="-230" y="0" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="54" fill="#fff">${L}</text>
      <text x="-150" y="-18" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="28" fill="${C.ink}">${t1}</text>
      <text x="-150" y="24" dy="0.36em" font-family="Rubik" font-weight="800" font-size="20" fill="#8a8796">${t2}</text>
      <text x="276" y="0" text-anchor="end" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="32" fill="${cost === '$0' ? C.grn : C.red}">${cost}</text></g>`;
  });
  if (t > 276.3) {
    const k = eBack(P(t, 276.3, .4)), pulse = 1 + .04 * Math.sin(t * 8);
    s += `<g transform="translate(360,1000) scale(${k * pulse}) rotate(-2)"><rect x="-290" y="-44" width="590" height="96" rx="48" fill="${C.ink}"/><rect x="-296" y="-50" width="590" height="96" rx="48" fill="${C.yel}" stroke="${C.ink}" stroke-width="6"/>
      <text text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="28" fill="${C.ink}">ПИШИ А, Б ИЛИ В</text></g>`;
    s += KT(t, 277.6, 281.0, 'В КОММЕНТАРИЯХ ↓'.replace(' ↓', ''), { x: 360, y: 1090, size: 30, rot: 1 }, 'rise');
  }
  s += KTag(t, 278.3, 281.0, 'СЛЕДУЮЩАЯ СЕРИЯ — ПО ВЫБОРУ БОЛЬШИНСТВА', { x: 360, y: 1160, size: 18, bg: '#fff', rot: -1 });
  return s;
} };
const T31 = { s: 281.0, e: 285.0, draw(t) { // end card
  const k = eBack(P(t, 281.2, .4));
  return `<rect width="720" height="1280" fill="#0b0a12"/>` + stripesBG(t, '#0b0a12', '#120f1f') +
    `<g opacity="${P(t, 281.0, .4)}">` + KT(t, 281.1, 290, 'ПРОДОЛЖЕНИЕ', { x: 360, y: 560, size: 50, rot: 0 }, 'rise') + KT(t, 281.5, 290, 'СЛЕДУЕТ...', { x: 360, y: 630, size: 36, rot: 0, fill: '#d9d3f5' }, 'rise') + `</g>` +
    `<g transform="translate(360,760) scale(${k}) rotate(-4)"><rect x="-150" y="-50" width="300" height="100" rx="18" fill="${C.red}" stroke="${C.ink}" stroke-width="6"/><text text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="44" fill="#fff">СЕРИЯ 2</text></g>` +
    `<g transform="translate(560,880) scale(${eBack(P(t, 282.0, .4))})">${head({ r: 46, kind: 'hero', e: { eyes: 'happy', brow: 'up', mouth: 'grin', blush: true } })}</g>`;
} };
const PART2 = [
  [T1, 'whip'], [T2, 'flash'], [T3, 'whip'], [T4, 'whip'], [T5, 'flash'], [T6, 'whip'], [T7, 'whip'], [T8, 'whip'], [T9, 'whip'], [T10, 'flash'],
  [T11, 'whip'], [T12, 'whip'], [T13, 'flash'], [T14, 'whip'], [T15, 'whip'], [T16, 'flash'], [T17, 'whip'], [T18, 'whip'], [T19, 'whip'], [T20, 'flash'],
  [T21, 'whip'], [T22, 'whip'], [T23, 'whip'], [T24, 'flash'], [T25, 'whip'], [T26, 'whip'], [T27, 'flash'], [T28, 'whip'], [T29, 'flash'], [T30, 'whip'], [T31, 'flash']];
