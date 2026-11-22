// ===== core helpers =====
const W = 720, H = 1280, FPS = 30;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const P = (t, s, d) => clamp((t - s) / d);
const eOut = x => 1 - Math.pow(1 - x, 3);
const eIn = x => x * x * x;
const eIO = x => (x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eBack = x => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const win = (t, a, b) => t >= a && t < b;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let _uid = 0; const uid = p => `${p || 'u'}${_uid++}`;
const env = t => (window.ENV ? (window.ENV[Math.floor(t * FPS)] || 0) : 0);
// deterministic shake that decays after t0
function shake(t, t0, dur = .35, amp = 14) {
  if (t < t0 || t > t0 + dur) return [0, 0];
  const k = 1 - (t - t0) / dur, a = amp * k * k;
  return [Math.sin(t * 91) * a, Math.cos(t * 77) * a];
}

const C = {
  ink: '#1c1a24', white: '#ffffff', yel: '#FFD23F', red: '#FF4757', grn: '#2ED47A', blue: '#3D7BFF',
  hair: '#6b4a2f', jacket: '#7f8f4e', jacketD: '#67763c', boss: '#2e3650', tie: '#e03b3b',
  pants: '#2a2733', mouth: '#5b1c26', tongue: '#ef7d86', blush: '#ffb3b3', dark: '#16131f',
};

// text measuring (fonts must be loaded)
const _cv = document.createElement('canvas').getContext('2d');
function measure(text, size, fam = 'Unbounded', weight = 900) {
  _cv.font = `${weight} ${size}px ${fam}`; return _cv.measureText(text).width;
}
const FAM = { U: 'Unbounded', R: 'Rubik', H: 'Caveat' };

// ===== typography =====
// segs: string or [{t, c}] ; draws text with thick ink outline + hard drop shadow
function T(segs, o = {}) {
  const { x = 360, y = 640, size = 48, font = 'U', weight = 900, anchor = 'middle', fill = '#fff',
    stroke = C.ink, sw = null, rot = 0, op = 1, sc = 1, ls = 0, shadow = 1 } = o;
  if (typeof segs === 'string') segs = [{ t: segs, c: fill }];
  const sw2 = sw ?? Math.max(4, size * .2);
  const attrs = `font-family="${FAM[font]}" font-weight="${weight}" font-size="${size}" text-anchor="${anchor}" letter-spacing="${ls}" dy="0.36em" stroke-linejoin="round"`;
  const spans = col => segs.map(s => `<tspan fill="${col || s.c || fill}">${esc(s.t)}</tspan>`).join('');
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" opacity="${op}">` +
    (shadow ? `<text ${attrs} y="${size * .1}" stroke="${stroke}" stroke-width="${sw2}" fill="${stroke}">${spans(stroke)}</text>` : '') +
    `<text ${attrs} stroke="${stroke}" stroke-width="${sw2}" paint-order="stroke">${spans()}</text></g>`;
}
// marker tag: colored slab with text
function tag(text, o = {}) {
  const { x = 360, y = 640, size = 30, bg = C.yel, fg = C.ink, rot = 0, sc = 1, op = 1, font = 'U', weight = 900, pad = .55, skew = -6 } = o;
  const w = measure(text, size, FAM[font], weight) + size * pad * 2, h = size * 1.55;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" opacity="${op}">
   <g transform="skewX(${skew})"><rect x="${-w / 2 + 5}" y="${-h / 2 + 7}" width="${w}" height="${h}" rx="8" fill="${C.ink}"/>
   <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="${bg}" stroke="${C.ink}" stroke-width="4"/></g>
   <text font-family="${FAM[font]}" font-weight="${weight}" font-size="${size}" text-anchor="middle" dy="0.36em" fill="${fg}">${esc(text)}</text></g>`;
}
// animation envelope for kinetic text: returns {sc, op, rot, dy} or null if hidden
function kin(t, t0, t1, type = 'slam', seed = 0) {
  if (t < t0 || t > t1 + .2) return null;
  const k = P(t, t0, type === 'slam' ? .17 : .28), x = P(t, t1, .16);
  let sc = 1, op = 1, rot = 0, dy = 0;
  if (type === 'slam') { sc = lerp(2.6, 1, eOut(k)); op = clamp(k * 4); rot = Math.sin((t - t0) * 30) * 5 * Math.exp(-(t - t0) * 8); }
  else if (type === 'pop') { sc = eBack(k); op = clamp(k * 3); }
  else if (type === 'rise') { dy = 40 * (1 - eOut(k)); op = k; }
  else if (type === 'drop') { dy = -60 * (1 - eBack(k)); op = clamp(k * 3); }
  sc *= 1 - .35 * eIn(x); op *= 1 - x;
  // tiny breathing so text is never static
  sc *= 1 + .015 * Math.sin((t - t0) * 4 + seed);
  return { sc, op, rot, dy };
}
function KT(t, t0, t1, segs, o = {}, type = 'slam') {
  const a = kin(t, t0, t1, type, o.seed || 0); if (!a) return '';
  return T(segs, { ...o, sc: (o.sc || 1) * a.sc, op: a.op, rot: (o.rot || 0) + a.rot, y: (o.y ?? 640) + a.dy });
}
function KTag(t, t0, t1, text, o = {}, type = 'pop') {
  const a = kin(t, t0, t1, type, o.seed || 0); if (!a) return '';
  return tag(text, { ...o, sc: (o.sc || 1) * a.sc, op: a.op, rot: (o.rot || 0) + a.rot, y: (o.y ?? 640) + a.dy });
}

// game-style dialogue box with typewriter. text markup: *word* = yellow, _word_ = red
function dialog(t, { t0, t1, name, text, y = 300, cps = 26, nameBg = C.yel, x = 36, w = 648 }) {
  if (t >= 120.0 && y < 300) y = 300; // keep clear of the debt chip
  if (t < t0 - .05 || t > t1 + .25) return '';
  const inK = eBack(P(t, t0 - .05, .25)), outK = P(t, t1, .2);
  const lines = text.split('\n');
  const toks = [];
  lines.forEach((ln, li) => {
    ln.split(/(\*[^*]+\*|_[^_]+_)/).filter(Boolean).forEach(s => {
      let c = '#fff'; if (s[0] === '*') { c = C.yel; s = s.slice(1, -1); } else if (s[0] === '_') { c = C.red; s = s.slice(1, -1); }
      toks.push({ s, c, li });
    });
  });
  let n = Math.floor((t - t0) * cps); const lh = 46, h = lines.length * lh + 56;
  const per = lines.map(() => []);
  for (const tk of toks) { if (n <= 0) break; const s = tk.s.slice(0, n); n -= tk.s.length; per[tk.li].push(`<tspan fill="${tk.c}">${esc(s)}</tspan>`); }
  const done = (t - t0) * cps >= toks.reduce((a, b) => a + b.s.length, 0);
  const sc = lerp(.85, 1, inK) * (1 - .1 * outK), op = clamp(inK * 2) * (1 - outK);
  const nw = measure(name, 20, 'Unbounded', 800) + 34;
  return `<g transform="translate(${x + w / 2},${y + h / 2}) scale(${sc}) translate(${-w / 2},${-h / 2})" opacity="${op}">
   <rect x="6" y="8" width="${w}" height="${h}" rx="22" fill="${C.ink}"/>
   <rect width="${w}" height="${h}" rx="22" fill="#17141f" fill-opacity=".94" stroke="${C.ink}" stroke-width="4"/>
   <rect x="6" y="6" width="${w - 12}" height="${h - 12}" rx="17" fill="none" stroke="#ffffff" stroke-opacity=".14" stroke-width="2"/>
   <g transform="translate(26,-20) rotate(-3)"><rect width="${nw}" height="40" rx="10" fill="${nameBg}" stroke="${C.ink}" stroke-width="4"/>
   <text x="${nw / 2}" y="21" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="20" fill="${C.ink}">${esc(name)}</text></g>
   ${per.map((sp, i) => `<text x="30" y="${44 + i * lh}" dy="0.36em" font-family="Rubik" font-weight="700" font-size="33" fill="#fff">${sp.join('')}</text>`).join('')}
   ${done ? `<path d="M${w - 44} ${h - 30} l12 12 l12 -12z" fill="${C.yel}" opacity="${.4 + .6 * (Math.sin(t * 10) > 0)}"/>` : ''}
  </g>`;
}

// quest popup (slides in from left)
function objective(t, { t0, t1, title = 'НОВАЯ ЦЕЛЬ', text, y = 232, done = false, textAt = null }) {
  if (t < t0 || t > t1 + .3) return '';
  const k = eOut(P(t, t0, .35)), x = P(t, t1, .25);
  const col = done ? C.grn : C.yel;
  const w = Math.max(420, measure(text, 28, 'Unbounded', 800) + 120);
  const off = lerp(-w - 40, 24, k) - eIn(x) * (w + 60);
  const tk = textAt == null ? 1 : P(t, textAt, .2);
  const icon = done
    ? `<circle cx="44" cy="52" r="24" fill="${col}" stroke="${C.ink}" stroke-width="4"/><path d="M33 52 l8 9 l15 -17" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
    : `<circle cx="44" cy="52" r="24" fill="${col}" stroke="${C.ink}" stroke-width="4"/><path d="${star(44, 52, 15, 6.5)}" fill="${C.ink}" transform="rotate(${(t - t0) * 90} 44 52)"/>`;
  const strike = done ? `<rect x="84" y="${66 - 2}" width="${(w - 110) * eOut(P(t, t0 + .45, .35))}" height="5" fill="${C.grn}" rx="2"/>` : '';
  return `<g transform="translate(${off},${y})">
   <rect x="6" y="8" width="${w}" height="104" rx="18" fill="${C.ink}"/>
   <rect width="${w}" height="104" rx="18" fill="#17141f" stroke="${C.ink}" stroke-width="4"/>
   <rect width="12" height="104" rx="6" fill="${col}"/>
   ${icon}
   <text x="86" y="30" dy="0.36em" font-family="Rubik" font-weight="800" font-size="18" letter-spacing="2" fill="${col}">${esc(title)}</text>
   <g opacity="${tk}" transform="translate(${(1 - eOut(tk)) * 30},0)"><text x="86" y="68" dy="0.36em" font-family="Unbounded" font-weight="800" font-size="27" fill="#fff">${esc(text)}</text>${strike}</g>
  </g>`;
}
function star(cx, cy, R, r, n = 5) {
  let d = '';
  for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1); }
  return d + 'Z';
}

// ===== HUD =====
const HUD = { y: 108, money: { x: 24, w: 262, h: 92 }, timer: { x: 298, w: 398, h: 92 } };
const fmt$ = v => '$' + Math.round(v).toLocaleString('ru-RU').replace(/ |\s/g, ' ');
function moneyCard(v, { x, y, sc = 1, op = 1, flash = 0 }) {
  const w = HUD.money.w, h = HUD.money.h;
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${op}">
   <rect x="5" y="7" width="${w}" height="${h}" rx="20" fill="${C.ink}"/>
   <rect width="${w}" height="${h}" rx="20" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
   <circle cx="44" cy="${h / 2}" r="25" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/>
   <text x="44" y="${h / 2}" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="${C.ink}">$</text>
   <text x="84" y="28" dy="0.36em" font-family="Rubik" font-weight="800" font-size="15" letter-spacing="1.5" fill="#8a8796">НА СЧЕТУ</text>
   <text x="84" y="60" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="31" fill="${C.ink}">${fmt$(v)}</text>
   ${flash ? `<rect width="${w}" height="${h}" rx="20" fill="#fff" opacity="${flash}"/>` : ''}
  </g>`;
}
function timerCard(days, { x, y, sc = 1, op = 1, pulse = 0, t = 0, flip = 1 }) {
  const w = HUD.timer.w, h = HUD.timer.h;
  const segs = [0, 1, 2].map(i => {
    const on = i < days;
    return `<rect x="${22 + i * 82}" y="56" width="74" height="16" rx="5" fill="${on ? C.yel : '#3a3546'}" stroke="${C.ink}" stroke-width="3"/>`;
  }).join('');
  const glow = pulse ? `<rect x="-6" y="-6" width="${w + 12}" height="${h + 12}" rx="26" fill="none" stroke="${C.yel}" stroke-width="${6 * pulse}" opacity="${pulse}"/>` : '';
  return `<g transform="translate(${x},${y}) scale(${sc})" opacity="${op}">
   <rect x="5" y="7" width="${w}" height="${h}" rx="20" fill="${C.ink}"/>
   <rect width="${w}" height="${h}" rx="20" fill="#17141f" stroke="${C.ink}" stroke-width="4"/>${glow}
   <circle cx="30" cy="30" r="7" fill="${C.red}" opacity="${.35 + .65 * (Math.sin(t * 6) > -.2)}"/>
   <text x="46" y="30" dy="0.36em" font-family="Rubik" font-weight="800" font-size="17" letter-spacing="1.5" fill="#fff">ДО РЕЛИЗА GTA 6</text>
   ${segs}
   <g transform="translate(${w - 108},12)"><g transform="translate(47,34) scale(1,${flip < 1 ? Math.abs(Math.cos(flip * Math.PI)) : 1}) translate(-47,-34)"><rect width="94" height="68" rx="14" fill="${flip < 1 && flip > 0 ? C.red : C.yel}" stroke="${C.ink}" stroke-width="4"/></g>
   <text x="34" y="35" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="42" fill="${C.ink}">${days}</text>
   <text x="72" y="35" dy="0.36em" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="15" fill="${C.ink}">ДНЯ</text></g>
  </g>`;
}

// ===== characters =====
// expr: {eyes:'open'|'half'|'wide'|'closed'|'happy'|'angry', brow:'flat'|'up'|'down'|'worried'|'sly', mouth:'line'|'smile'|'smirk'|'grin'|'o'|'frown'|'wavy'|'talk', open, look:[x,y], sweat, blush}
function head(o) {
  const { x = 0, y = 0, r = 60, kind = 'hero', flip = false } = o;
  const e = { eyes: 'open', brow: 'flat', mouth: 'line', open: 0, look: [0, 0], ...o.e };
  const id = uid('hc');
  let hair = '';
  const HAIR = { hero: C.hair, colA: '#d8743c', colB: '#2c2930', tyoma: '#a86b3c', dad: '#3a302b', kid: '#e9c45a', granny: '#c9c8d2', hood: '#2b2932' };
  let back = '';
  if (kind === 'granny') back = `<circle cx="0" cy="${-1.02 * r}" r="${.32 * r}" fill="${HAIR.granny}" stroke="${C.ink}" stroke-width="${.06 * r}"/>`;
  if (kind === 'hood') back = `<path d="M${-1.22 * r} ${.5 * r} Q${-1.3 * r} ${-1.3 * r} 0 ${-1.3 * r} Q${1.3 * r} ${-1.3 * r} ${1.22 * r} ${.5 * r} L${.9 * r} ${1.0 * r} H${-.9 * r}Z" fill="#2b2932" stroke="${C.ink}" stroke-width="${.07 * r}"/>`;
  if (HAIR[kind] && kind !== 'boss') {
    const col = HAIR[kind];
    hair = `<path clip-path="url(#${id})" fill="${col}" d="M${-1.3 * r} ${-1.3 * r} H${1.3 * r} V${.1 * r} L${.9 * r} ${.1 * r} Q${.86 * r} ${-.36 * r} ${.38 * r} ${-.36 * r} Q${.05 * r} ${-.5 * r} ${-.28 * r} ${-.32 * r} Q${-.8 * r} ${-.36 * r} ${-.9 * r} ${.1 * r} L${-1.3 * r} ${.1 * r}Z" stroke="${C.ink}" stroke-width="4"/><path clip-path="url(#${id})" d="M${-.55 * r} ${-.62 * r} q${.25 * r} ${-.18 * r} ${.55 * r} ${-.16 * r}" stroke="#fff" stroke-opacity=".28" stroke-width="${.06 * r}" fill="none" stroke-linecap="round"/>`;
  } else if (kind === 'boss') {
    hair = `<g clip-path="url(#${id})" fill="#b4b3bd" stroke="${C.ink}" stroke-width="4">
      <ellipse cx="${-.98 * r}" cy="${-.02 * r}" rx="${.26 * r}" ry="${.36 * r}"/><ellipse cx="${.98 * r}" cy="${-.02 * r}" rx="${.26 * r}" ry="${.36 * r}"/></g>
      <path d="M${-.35 * r} ${-.72 * r} q${.2 * r} ${-.12 * r} ${.42 * r} ${-.05 * r}" stroke="#e9e9ef" stroke-width="${.07 * r}" fill="none" stroke-linecap="round"/>`;
  }
  // eyes
  const ex = .33 * r, ey = .06 * r, erx = .155 * r, ery = .185 * r;
  const lk = e.look;
  const eye = (cx) => {
    if (e.eyes === 'closed') return `<path d="M${cx - erx} ${ey} q${erx} ${.12 * r} ${2 * erx} 0" fill="none" stroke="${C.ink}" stroke-width="${.06 * r}" stroke-linecap="round"/>`;
    if (e.eyes === 'happy') return `<path d="M${cx - erx} ${ey + .04 * r} q${erx} ${-.2 * r} ${2 * erx} 0" fill="none" stroke="${C.ink}" stroke-width="${.065 * r}" stroke-linecap="round"/>`;
    const k = e.eyes === 'wide' ? 1.22 : 1;
    const px = cx + lk[0] * .06 * r, py = ey + lk[1] * .07 * r;
    let s = `<ellipse cx="${cx}" cy="${ey}" rx="${erx * k}" ry="${ery * k}" fill="#fff" stroke="${C.ink}" stroke-width="${.055 * r}"/>
      <circle cx="${px}" cy="${py}" r="${.085 * r * (e.eyes === 'wide' ? .8 : 1)}" fill="${C.ink}"/><circle cx="${px + .03 * r}" cy="${py - .03 * r}" r="${.022 * r}" fill="#fff"/>`;
    if (e.eyes === 'half' || e.eyes === 'angry') {
      const lid = e.eyes === 'half' ? .02 * r : -.02 * r;
      const tilt = e.eyes === 'angry' ? (cx < 0 ? .09 * r : -.09 * r) : 0;
      s += `<path d="M${cx - erx - 3} ${ey - ery - 6} H${cx + erx + 3} V${ey + lid - tilt} L${cx - erx - 3} ${ey + lid + tilt}Z" fill="#fff"/>
        <path d="M${cx - erx} ${ey + lid + tilt} L${cx + erx} ${ey + lid - tilt}" stroke="${C.ink}" stroke-width="${.055 * r}" stroke-linecap="round"/>`;
    }
    return s;
  };
  // brows
  const by = -.2 * r, bw = .17 * r;
  const brow = (cx, side) => {
    let a = 0, dy = 0, curve = -.05 * r;
    if (e.brow === 'up') { dy = -.08 * r; curve = -.08 * r; }
    if (e.brow === 'down') { a = side * 14; dy = .02 * r; curve = 0; }
    if (e.brow === 'worried') { a = -side * 16; dy = -.04 * r; curve = 0; }
    if (e.brow === 'sly') { a = side < 0 ? 0 : -14; dy = side < 0 ? 0 : -.06 * r; }
    return `<path transform="rotate(${a} ${cx} ${by + dy})" d="M${cx - bw} ${by + dy} q${bw} ${curve} ${2 * bw} 0" fill="none" stroke="${C.ink}" stroke-width="${.06 * r}" stroke-linecap="round"/>`;
  };
  // mouth (anatomy: lips line, single smooth upper-teeth band, tongue on bottom)
  const my = .44 * r;
  let mouth = '';
  const openMouth = (w, h, teeth = true) => {
    const mid = uid('mc');
    const d = `M${-w} ${my - .02 * r} Q0 ${my + .02 * r} ${w} ${my - .02 * r} Q${w * .9} ${my + h} 0 ${my + h} Q${-w * .9} ${my + h} ${-w} ${my - .02 * r}Z`;
    return `<clipPath id="${mid}"><path d="${d}"/></clipPath><path d="${d}" fill="${C.mouth}"/>
      <g clip-path="url(#${mid})">${teeth ? `<rect x="${-w}" y="${my - .1 * r}" width="${2 * w}" height="${.1 * r + Math.min(h * .32, .09 * r)}" rx="${.03 * r}" fill="#fff"/>` : ''}
      <ellipse cx="0" cy="${my + h}" rx="${w * .62}" ry="${h * .42}" fill="${C.tongue}"/></g>
      <path d="${d}" fill="none" stroke="${C.ink}" stroke-width="${.055 * r}" stroke-linejoin="round"/>`;
  };
  const sw = .058 * r;
  switch (e.mouth) {
    case 'line': mouth = `<path d="M${-.12 * r} ${my} H${.12 * r}" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`; break;
    case 'smile': mouth = `<path d="M${-.2 * r} ${my - .04 * r} Q0 ${my + .14 * r} ${.2 * r} ${my - .04 * r}" fill="none" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`; break;
    case 'smirk': mouth = `<path d="M${-.16 * r} ${my + .02 * r} Q${.04 * r} ${my + .1 * r} ${.2 * r} ${my - .07 * r}" fill="none" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`; break;
    case 'frown': mouth = `<path d="M${-.16 * r} ${my + .06 * r} Q0 ${my - .06 * r} ${.16 * r} ${my + .06 * r}" fill="none" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`; break;
    case 'wavy': mouth = `<path d="M${-.18 * r} ${my} q${.045 * r} ${-.07 * r} ${.09 * r} 0 t${.09 * r} 0 t${.09 * r} 0 t${.09 * r} 0" fill="none" stroke="${C.ink}" stroke-width="${sw * .85}" stroke-linecap="round"/>`; break;
    case 'grin': mouth = openMouth(.27 * r, .26 * r); break;
    case 'o': { const mid = uid('mo'); mouth = `<clipPath id="${mid}"><ellipse cx="0" cy="${my + .04 * r}" rx="${.09 * r}" ry="${.12 * r}"/></clipPath><ellipse cx="0" cy="${my + .04 * r}" rx="${.09 * r}" ry="${.12 * r}" fill="${C.mouth}"/><ellipse clip-path="url(#${mid})" cx="0" cy="${my + .15 * r}" rx="${.07 * r}" ry="${.05 * r}" fill="${C.tongue}"/><ellipse cx="0" cy="${my + .04 * r}" rx="${.09 * r}" ry="${.12 * r}" fill="none" stroke="${C.ink}" stroke-width="${sw}"/>`; break; }
    case 'talk': {
      const o2 = clamp(e.open);
      mouth = o2 < .12 ? `<path d="M${-.14 * r} ${my} Q0 ${my + .05 * r} ${.14 * r} ${my}" fill="none" stroke="${C.ink}" stroke-width="${sw}" stroke-linecap="round"/>`
        : openMouth(lerp(.13, .21, o2) * r, lerp(.08, .24, o2) * r, o2 > .35); break;
    }
  }
  const extra = (e.blush ? `<ellipse cx="${-.58 * r}" cy="${.3 * r}" rx="${.14 * r}" ry="${.07 * r}" fill="${C.blush}" opacity=".8"/><ellipse cx="${.58 * r}" cy="${.3 * r}" rx="${.14 * r}" ry="${.07 * r}" fill="${C.blush}" opacity=".8"/>` : '') +
    (e.sweat ? `<path d="M${.78 * r} ${-.35 * r} q${.1 * r} ${.18 * r} 0 ${.24 * r} q${-.1 * r} ${-.06 * r} 0 ${-.24 * r}z" fill="#6cc4ff" stroke="${C.ink}" stroke-width="3"/>` : '');
  return `<g transform="translate(${x},${y}) scale(${flip ? -1 : 1},1)">
    <clipPath id="${id}"><circle r="${r}"/></clipPath>${back}
    ${kind !== 'hood' ? `<g fill="#fff" stroke="${C.ink}" stroke-width="${.055 * r}"><ellipse cx="${-.97 * r}" cy="${.12 * r}" rx="${.15 * r}" ry="${.19 * r}"/><ellipse cx="${.97 * r}" cy="${.12 * r}" rx="${.15 * r}" ry="${.19 * r}"/></g><path d="M${-1.0 * r} ${.06 * r} q${.06 * r} ${.06 * r} 0 ${.12 * r} M${1.0 * r} ${.06 * r} q${-.06 * r} ${.06 * r} 0 ${.12 * r}" stroke="${C.ink}" stroke-width="${.03 * r}" fill="none"/>` : ''}
    <circle r="${r}" fill="${kind === 'hood' ? '#e4e3ea' : '#fff'}"/>${hair}
    <circle r="${r}" fill="none" stroke="${C.ink}" stroke-width="${.075 * r}"/>
    ${eye(-ex)}${eye(ex)}${brow(-ex, -1)}${brow(ex, 1)}
    <path d="M${-.03 * r} ${.2 * r} q${.07 * r} ${.06 * r} ${.01 * r} ${.11 * r}" fill="none" stroke="${C.ink}" stroke-width="${.035 * r}" stroke-linecap="round" opacity=".7"/>
    ${mouth}${extra}
    ${kind === 'tyoma' ? `<g fill="#fff" fill-opacity=".25" stroke="${C.ink}" stroke-width="${.05 * r}"><rect x="${-ex - .25 * r}" y="${ey - .2 * r}" width="${.5 * r}" height="${.38 * r}" rx="${.12 * r}"/><rect x="${ex - .25 * r}" y="${ey - .2 * r}" width="${.5 * r}" height="${.38 * r}" rx="${.12 * r}"/></g><path d="M${-ex + .25 * r} ${ey - .04 * r} H${ex - .25 * r}" stroke="${C.ink}" stroke-width="${.05 * r}"/>` : ''}
    ${kind === 'dad' ? `<path d="M${-.26 * r} ${.36 * r} Q${-.13 * r} ${.24 * r} 0 ${.32 * r} Q${.13 * r} ${.24 * r} ${.26 * r} ${.36 * r} Q${.13 * r} ${.4 * r} 0 ${.36 * r} Q${-.13 * r} ${.4 * r} ${-.26 * r} ${.36 * r}Z" fill="#3a302b" stroke="${C.ink}" stroke-width="3"/>` : ''}
  </g>`;
}

// full body. (x,y) = head center. Slim "series" proportions: ~2.4 heads tall.
// pose: 'stand'|'box'|'mug'|'ear'|'wide'|'up'|'phone'
function person(o) {
  const { x = 0, y = 0, r = 60, kind = 'hero', pose = 'stand', legs = true, walk = 0, sc = 1, flip = false, rot = 0 } = o;
  const isBoss = kind === 'boss';
  const BODY = { boss: C.boss, hero: C.jacket, colA: '#4f7fb8', colB: '#8a5aa8', tyoma: '#8db6e6', hood: '#2b2932', dad: '#d8453c', kid: '#f2c53d', granny: '#7a5a8a' };
  const PANTS = { hero: '#2f3a4f', boss: '#232a40', tyoma: '#3b3f4a', hood: '#1f1d24', dad: '#3a3f55', kid: '#4f7fb8', granny: '#5a4466', colA: '#2f3a4f', colB: '#2f3a4f' };
  const body = o.bodyCol || BODY[kind] || C.jacket;
  const dark = 'rgba(0,0,0,.16)';
  const ty = 1.0 * r, tw = .76 * r, th = legs ? 1.5 * r : 6 * r, wb = .7 * r;
  const lg = walk ? Math.sin(walk) * .2 * r : 0;
  const lw = .3 * r, ll = 1.3 * r, hip = ty + th - .05 * r;
  const pants = PANTS[kind] || C.pants;
  let legsS = '';
  if (legs) {
    const leg = (cx, off) => `<path d="M${cx - lw / 2 + off} ${hip - 10} h${lw} l${-off * .2} ${ll} h${-lw}z" fill="${pants}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`;
    const shoe = (cx, off) => { const fx = cx + off * .8, fy = hip + ll; return `<path d="M${fx - .2 * r} ${fy - .02 * r} q0 ${-.14 * r} ${.18 * r} ${-.14 * r} h${.06 * r} q${.2 * r} 0 ${.22 * r} ${.14 * r} v${.05 * r} h${-.46 * r}z" fill="#fff" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/><rect x="${fx - .2 * r}" y="${fy + .02 * r}" width="${.46 * r}" height="${.06 * r}" rx="3" fill="#cfd0d8" stroke="${C.ink}" stroke-width="3"/><path d="M${fx - .02 * r} ${fy - .1 * r} l${.06 * r} 0 M${fx} ${fy - .06 * r} l${.06 * r} 0" stroke="${C.ink}" stroke-width="2.5"/>`; };
    legsS = `<ellipse cx="0" cy="${hip + ll + .1 * r}" rx="${.75 * r}" ry="${.12 * r}" fill="#000" opacity=".18"/>` +
      leg(-.17 * r, lg) + leg(.17 * r, -lg) + shoe(-.2 * r, lg) + shoe(.2 * r, -lg);
  }
  const torso = `<path d="M${-wb} ${ty + th} L${-tw} ${ty + .32 * r} Q${-tw} ${ty} ${-tw * .5} ${ty - .02 * r} H${tw * .5} Q${tw} ${ty} ${tw} ${ty + .32 * r} L${wb} ${ty + th} Z" fill="${body}" stroke="${C.ink}" stroke-width="4.5" stroke-linejoin="round"/>`;
  const neck = `<rect x="${-.13 * r}" y="${.8 * r}" width="${.26 * r}" height="${.3 * r}" fill="#fff" stroke="${C.ink}" stroke-width="4"/>`;
  let detail = '';
  const hem = legs ? `<path d="M${-wb + 2} ${ty + th - .14 * r} H${wb - 2}" stroke="${dark}" stroke-width="${.1 * r}"/>` : '';
  if (isBoss) detail = `<path d="M${-.26 * r} ${ty - 2} L0 ${ty + .62 * r} L${.26 * r} ${ty - 2}Z" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/>
     <path d="M${-.07 * r} ${ty + .08 * r} H${.07 * r} L${.09 * r} ${ty + .52 * r} L0 ${ty + .64 * r} L${-.09 * r} ${ty + .52 * r}Z" fill="${C.tie}" stroke="${C.ink}" stroke-width="3"/>
     <path d="M${-.26 * r} ${ty} L${-.08 * r} ${ty + .7 * r} M${.26 * r} ${ty} L${.08 * r} ${ty + .7 * r}" stroke="${C.ink}" stroke-width="3.5" fill="none"/>
     <circle cx="0" cy="${ty + .85 * r}" r="${.04 * r}" fill="${C.ink}"/><circle cx="0" cy="${ty + 1.1 * r}" r="${.04 * r}" fill="${C.ink}"/>
     <path d="M${.36 * r} ${ty + .38 * r} h${.2 * r}" stroke="#fff" stroke-width="4"/>`;
  else if (kind === 'hood' || kind === 'kid') detail = `<path d="M${-.12 * r} ${ty + .06 * r} v${.42 * r} M${.12 * r} ${ty + .06 * r} v${.42 * r}" stroke="#eee" stroke-width="3.5" stroke-linecap="round"/>
     <path d="M${-.45 * r} ${ty + .85 * r} h${.9 * r} l${.08 * r} ${.4 * r} h${-1.06 * r}z" fill="${dark}" stroke="${C.ink}" stroke-width="3"/>${hem}`;
  else if (kind === 'tyoma') detail = `<path d="M${-.2 * r} ${ty - 2} L0 ${ty + .2 * r} L${.2 * r} ${ty - 2}" fill="#fff" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>
     <path d="M0 ${ty + .2 * r} V${ty + Math.min(th, 1.5 * r)}" stroke="${C.ink}" stroke-width="2.5"/>${[.4, .7, 1.0].map(k => `<circle cx="${.05 * r}" cy="${ty + k * r}" r="${.035 * r}" fill="#fff" stroke="${C.ink}" stroke-width="2"/>`).join('')}
     <rect x="${-.5 * r}" y="${ty + .35 * r}" width="${.26 * r}" height="${.24 * r}" rx="3" fill="none" stroke="${C.ink}" stroke-width="2.5"/><rect x="${-.46 * r}" y="${ty + .3 * r}" width="${.04 * r}" height="${.14 * r}" fill="#3d7bff"/>`;
  else if (kind === 'granny') detail = `${[.3, .6, .9, 1.2].map(k => `<circle cx="0" cy="${ty + k * r}" r="${.04 * r}" fill="#f2c53d" stroke="${C.ink}" stroke-width="2"/>`).join('')}<path d="M${-.22 * r} ${ty} q${.22 * r} ${.2 * r} ${.44 * r} 0" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`;
  else detail = `<path d="M0 ${ty + .24 * r} V${ty + Math.min(th, 1.5 * r) - 4}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="5 5" opacity=".55"/>
     <path d="M${-.32 * r} ${ty - 2} L0 ${ty + .3 * r} L${.32 * r} ${ty - 2}" fill="${kind === 'hero' ? C.jacketD : dark}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>
     ${legs || th < 3 * r ? `<path d="M${-.52 * r} ${ty + 1.0 * r} h${.3 * r} M${.22 * r} ${ty + 1.0 * r} h${.3 * r}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>` : `<path d="M${-.52 * r} ${ty + 1.0 * r} h${.3 * r} M${.22 * r} ${ty + 1.0 * r} h${.3 * r}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`}
     ${kind === 'hero' ? `<rect x="${.34 * r}" y="${ty + .34 * r}" width="${.14 * r}" height="${.06 * r}" rx="2" fill="${C.yel}" stroke="${C.ink}" stroke-width="2"/>` : ''}${hem}`;
  const aw = .24 * r;
  const shoulder = side => [side * (tw - .06 * r), ty + .2 * r];
  const arm = (side, hx, hy, cx2, cy2) => {
    const [sx, sy] = shoulder(side);
    const d = `M${sx} ${sy} Q${cx2} ${cy2} ${hx} ${hy}`;
    return `<path d="${d}" stroke="${C.ink}" stroke-width="${aw + 8}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${body}" stroke-width="${aw}" fill="none" stroke-linecap="round"/>`;
  };
  const hand = (hx, hy, side = 1) => `<g><circle cx="${hx}" cy="${hy}" r="${.14 * r}" fill="#fff" stroke="${C.ink}" stroke-width="3.5"/><ellipse cx="${hx - side * .1 * r}" cy="${hy - .06 * r}" rx="${.06 * r}" ry="${.045 * r}" fill="#fff" stroke="${C.ink}" stroke-width="3" transform="rotate(${-side * 30} ${hx - side * .1 * r} ${hy - .06 * r})"/></g>`;
  const down = side => { const sw2 = walk ? Math.sin(walk) * .14 * r * side : 0; return [side * (tw + .06 * r) + sw2, ty + 1.3 * r]; };
  let arms = '', front = '';
  const hang = side => { const [hx, hy] = down(side); return arm(side, hx, hy, side * (tw + .12 * r), ty + .75 * r); };
  const hangH = side => { const [hx, hy] = down(side); return hand(hx, hy, side); };
  if (pose === 'stand') { arms = hang(-1) + hang(1); front = hangH(-1) + hangH(1); }
  else if (pose === 'box') {
    const bw = 1.35 * r, bh = .85 * r, by = ty + .6 * r;
    arms = arm(-1, -bw / 2 + 4, by + bh * .5, -tw - .1 * r, ty + .7 * r) + arm(1, bw / 2 - 4, by + bh * .5, tw + .1 * r, ty + .7 * r);
    front = `<g><rect x="${-bw / 2}" y="${by}" width="${bw}" height="${bh}" rx="6" fill="#c99158" stroke="${C.ink}" stroke-width="4.5"/>
      <path d="M${-bw / 2} ${by + .16 * r} H${bw / 2}" stroke="${C.ink}" stroke-width="3"/><rect x="${-.1 * r}" y="${by}" width="${.2 * r}" height="${bh}" fill="#e2b781" opacity=".8"/>
      <path d="M${-bw * .3} ${by} l${-.08 * r} ${-.3 * r} l${.26 * r} ${.06 * r}z" fill="#3d7bff" stroke="${C.ink}" stroke-width="3"/>
      <rect x="${bw * .1}" y="${by - .36 * r}" width="${.18 * r}" height="${.38 * r}" rx="4" fill="#59b36b" stroke="${C.ink}" stroke-width="3"/></g>` +
      hand(-bw / 2 + 4, by + bh * .5, -1) + hand(bw / 2 - 4, by + bh * .5, 1);
  } else if (pose === 'mug') {
    arms = hang(-1) + arm(1, .5 * r, ty + .1 * r, tw + .3 * r, ty + .9 * r);
    front = hangH(-1) + mug(.5 * r + .26 * r, ty - .08 * r, r * .8) + hand(.5 * r, ty + .1 * r, 1);
  } else if (pose === 'ear') {
    arms = hang(-1) + arm(1, .78 * r, .05 * r, tw + .45 * r, ty + .6 * r);
    front = hangH(-1) + `<rect x="${.6 * r}" y="${-.5 * r}" width="${.26 * r}" height="${.56 * r}" rx="8" fill="${C.ink}" transform="rotate(25 ${.73 * r} ${-.2 * r})"/>` + hand(.78 * r, .05 * r, 1);
  } else if (pose === 'wide') {
    arms = arm(-1, -tw - .85 * r, ty + .15 * r, -tw - .45 * r, ty + .1 * r) + arm(1, tw + .85 * r, ty + .15 * r, tw + .45 * r, ty + .1 * r);
    front = hand(-tw - .85 * r, ty + .15 * r, 1) + hand(tw + .85 * r, ty + .15 * r, -1);
  } else if (pose === 'up') {
    arms = hang(-1) + arm(1, tw + .25 * r, -1.6 * r, tw + .5 * r, ty * .1);
    front = hangH(-1) + hand(tw + .25 * r, -1.6 * r, 1);
  } else if (pose === 'phone') {
    arms = arm(-1, -.12 * r, ty + .3 * r, -tw - .1 * r, ty + 1.1 * r) + arm(1, .25 * r, ty + .3 * r, tw + .1 * r, ty + 1.1 * r);
  }
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${flip ? -sc : sc},${sc})">${legsS}${torso}${detail}${neck}${arms}
    ${head({ ...o, x: 0, y: 0, flip: false })}${front}</g>`;
}
function mug(x, y, s = 60) {
  return `<g transform="translate(${x},${y})"><path d="M${.28 * s} ${-.2 * s} q${.22 * s} 0 ${.22 * s} ${.2 * s} t${-.22 * s} ${.2 * s}" fill="none" stroke="${C.ink}" stroke-width="5"/>
  <rect x="${-.3 * s}" y="${-.32 * s}" width="${.6 * s}" height="${.66 * s}" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
  <text x="0" y="${-.08 * s}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${.15 * s}" fill="${C.red}">BEST</text>
  <text x="0" y="${.1 * s}" text-anchor="middle" font-family="Rubik" font-weight="900" font-size="${.15 * s}" fill="${C.red}">BOSS</text></g>`;
}

// ===== scene furniture =====
function bgGrad(top, bot) { const id = uid('g'); return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="-400" y="-400" width="${W + 800}" height="${H + 800}" fill="url(#${id})"/>`; }
function stripesBG(t, a = '#1b1440', b = '#231a55') {
  let s = `<rect x="-400" y="-400" width="1520" height="2080" fill="${a}"/>`;
  const off = (t * 40) % 120;
  for (let i = -20; i < 30; i++) s += `<rect x="${i * 120 + off - 400}" y="-400" width="50" height="2200" fill="${b}" transform="rotate(20 360 640)"/>`;
  return s;
}
function desk(x, y, w, h = 300, top = '#b07447', front = '#8d5a36') {
  h = Math.max(h, 1000);
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${front}" stroke="${C.ink}" stroke-width="5"/><rect x="${x}" y="${y + 8}" width="${w}" height="14" fill="#000" opacity=".12"/>
   <rect x="${x - 14}" y="${y - 26}" width="${w + 28}" height="34" rx="6" fill="${top}" stroke="${C.ink}" stroke-width="5"/></g>`;
}
function drawer(x, y, w = 150, h = 70) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#9c6640" stroke="${C.ink}" stroke-width="4"/><rect x="${x + w / 2 - 22}" y="${y + h / 2 - 5}" width="44" height="10" rx="5" fill="${C.ink}"/>`; }
function monitor(x, y, w = 200, h = 140, t = 0) {
  let cells = '';
  for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
    const on = (Math.floor(t * 6) + r * 3 + c) % 7 === 0;
    cells += `<rect x="${x + 14 + c * (w - 28) / 4}" y="${y + 26 + r * (h - 40) / 5}" width="${(w - 28) / 4 - 4}" height="${(h - 40) / 5 - 4}" fill="${r === 0 ? '#2ea56a' : on ? '#bfe8cf' : '#e8f6ee'}"/>`;
  }
  return `<g><rect x="${x + w / 2 - 14}" y="${y + h}" width="28" height="30" fill="#55525e" stroke="${C.ink}" stroke-width="4"/>
   <rect x="${x + w / 2 - 50}" y="${y + h + 26}" width="100" height="14" rx="5" fill="#55525e" stroke="${C.ink}" stroke-width="4"/>
   <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#2b2833" stroke="${C.ink}" stroke-width="5"/>
   <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="4" fill="#f4fbf7"/>${cells}
   <rect x="${x + w - 34}" y="${y - 8}" width="30" height="30" fill="${C.yel}" stroke="${C.ink}" stroke-width="3" transform="rotate(8 ${x + w - 19} ${y + 7})"/></g>`;
}
function coffeeCup(x, y, s = 1, t = 0) {
  const st = [0, 1].map(i => `<path d="M${x - 8 + i * 16} ${y - 34} q8 -14 0 -26 q-8 -12 0 -24" fill="none" stroke="#9a96a6" stroke-width="4" stroke-linecap="round" opacity="${.4 + .3 * Math.sin(t * 4 + i)}" transform="translate(0 ${-((t * 14 + i * 9) % 10)})"/>`).join('');
  return `<g transform="translate(${x},${y}) scale(${s}) translate(${-x},${-y})">${st}<path d="M${x - 22} ${y - 30} L${x - 17} ${y + 30} H${x + 17} L${x + 22} ${y - 30}Z" fill="#fff" stroke="${C.ink}" stroke-width="4"/><rect x="${x - 20}" y="${y - 10}" width="40" height="18" fill="#8d5a36"/><rect x="${x - 25}" y="${y - 38}" width="50" height="12" rx="4" fill="#5b3a26" stroke="${C.ink}" stroke-width="4"/></g>`;
}
function vignette(a = .35) { const id = uid('v'); return `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${a}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`; }
function cam(content, { z = 1, cx = 360, cy = 640, rot = 0, sx = 0, sy = 0 } = {}) {
  return `<g transform="translate(${360 + sx},${640 + sy}) rotate(${rot}) scale(${z}) translate(${-cx},${-cy})">${content}</g>`;
}
// speed-lines burst behind slammed words
function burst(t, t0, x, y, col = '#fff', n = 14, R1 = 140, R2 = 330) {
  const k = P(t, t0, .35); if (k <= 0 || k >= 1) return '';
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + i * .3, r1 = lerp(R1 * .6, R2, eOut(k)), r2 = r1 + 60 * (1 - k);
    s += `<line x1="${x + Math.cos(a) * r1}" y1="${y + Math.sin(a) * r1}" x2="${x + Math.cos(a) * r2}" y2="${y + Math.sin(a) * r2}" stroke="${col}" stroke-width="${8 * (1 - k)}" stroke-linecap="round"/>`;
  }
  return s;
}
