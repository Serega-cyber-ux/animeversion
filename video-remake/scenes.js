// ===== shared backgrounds =====
function openSpaceBG(t, opts = {}) {
  // wall, window w/ city, partitions, floor
  let s = `<rect x="-400" y="-400" width="1520" height="1300" fill="#ebe2d1"/>
  <rect x="-400" y="900" width="1520" height="900" fill="#bdbcc3"/>
  <rect x="-400" y="895" width="1520" height="10" fill="${C.ink}" opacity=".25"/>`;
  // window
  s += `<g><rect x="40" y="250" width="300" height="300" rx="8" fill="#2d2a5a" stroke="${C.ink}" stroke-width="6"/>
   ${[[60, 360, 50, 190], [118, 320, 44, 230], [170, 390, 56, 160], [236, 340, 40, 210], [280, 410, 50, 140]].map(([x, y, w, h], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? '#6b4fa3' : '#59408f'}"/>` + [0, 1, 2, 3].map(j => `<rect x="${x + 10}" y="${y + 18 + j * 34}" width="10" height="12" fill="#ffd66b" opacity="${(i + j) % 3 ? .9 : .25}"/>`).join('')).join('')}
   <rect x="186" y="250" width="8" height="300" fill="${C.ink}"/><rect x="40" y="396" width="300" height="8" fill="${C.ink}"/></g>`;
  // sales chart on wall
  s += `<g><rect x="400" y="270" width="270" height="190" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="5"/>
   <text x="535" y="300" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="16" fill="#7a7785">ПЛАН ПРОДАЖ · Q4</text>
   <polyline points="430,430 480,410 520,420 560,380 600,390 640,330" fill="none" stroke="#2ea56a" stroke-width="7" stroke-linejoin="round"/></g>`;
  // partitions
  s += `<rect x="-400" y="700" width="1520" height="210" fill="#93a4bb" stroke="${C.ink}" stroke-width="5"/>`;
  for (let i = -2; i < 8; i++) s += `<rect x="${i * 180}" y="700" width="8" height="210" fill="${C.ink}" opacity=".35"/>`;
  return s;
}
function bossOfficeBG() {
  let s = `<rect x="-400" y="-400" width="1520" height="1400" fill="#e6dccb"/>
  <rect x="-400" y="1000" width="1520" height="800" fill="#a9a8b0"/>`;
  // bookshelf
  s += `<g><rect x="-60" y="180" width="230" height="760" fill="#8d5a36" stroke="${C.ink}" stroke-width="6"/>`;
  const cols = ['#e2b33b', '#3aa66a', '#7c56b8', '#d84a4a', '#3d7bff'];
  for (let sh = 0; sh < 4; sh++) {
    s += `<rect x="-60" y="${180 + sh * 190 + 176}" width="230" height="14" fill="#6e4329"/>`;
    for (let b = 0; b < 5; b++) s += `<rect x="${-40 + b * 40}" y="${180 + sh * 190 + 40 + (b % 2) * 14}" width="32" height="${136 - (b % 2) * 14}" fill="${cols[(b + sh) % 5]}" stroke="${C.ink}" stroke-width="3"/>`;
  }
  s += `</g>`;
  // framed certificate + clock
  s += `<rect x="470" y="200" width="190" height="130" fill="#fff" stroke="${C.ink}" stroke-width="6"/><rect x="490" y="220" width="150" height="90" fill="none" stroke="#e2b33b" stroke-width="4"/>
   <text x="565" y="268" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="18" fill="#7a7785">ЛУЧШИЙ</text><text x="565" y="292" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="18" fill="#7a7785">ОТДЕЛ</text>`;
  return s;
}
function wallClock(x, y, r, t, speed = 1) {
  const a1 = t * speed * 360, a2 = t * speed * 30;
  return `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
   ${[0, 1, 2, 3].map(i => `<rect x="${x - 3}" y="${y - r + 8}" width="6" height="12" fill="${C.ink}" transform="rotate(${i * 90} ${x} ${y})"/>`).join('')}
   <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * .78}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round" transform="rotate(${a1} ${x} ${y})"/>
   <line x1="${x}" y1="${y}" x2="${x}" y2="${y - r * .5}" stroke="${C.red}" stroke-width="7" stroke-linecap="round" transform="rotate(${a2} ${x} ${y})"/>
   <circle cx="${x}" cy="${y}" r="7" fill="${C.ink}"/></g>`;
}
function paperDoc(x, y, rot, title = 'ЗАЯВЛЕНИЕ', w = 260, h = 170) {
  return `<g transform="translate(${x},${y}) rotate(${rot})"><rect x="${-w / 2 + 6}" y="${-h / 2 + 8}" width="${w}" height="${h}" fill="${C.ink}" opacity=".35"/>
   <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
   <text x="0" y="${-h / 2 + 34}" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="20" fill="${C.ink}">${title}</text>
   ${[0, 1, 2, 3].map(i => `<rect x="${-w / 2 + 24}" y="${-h / 2 + 62 + i * 22}" width="${w - 48 - (i === 3 ? 80 : 0)}" height="7" rx="3" fill="#cfcdd6"/>`).join('')}</g>`;
}
function stamp(t, t0, x, y, text, col = C.red, rot = -14, size = 34) {
  if (t < t0) return '';
  const k = P(t, t0, .14), sc = lerp(3, 1, eIn(k)), op = clamp(k * 3);
  const w = measure(text, size, 'Unbounded', 900) + 40, h = size * 1.7;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${sc})" opacity="${op}">
   <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="10" fill="#fff" fill-opacity=".55" stroke="${col}" stroke-width="7"/>
   <rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${w - 16}" height="${h - 16}" rx="6" fill="none" stroke="${col}" stroke-width="3"/>
   <text text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="${size}" fill="${col}">${text}</text></g>`;
}

// ===== S1: money intro =====
const S1 = {
  s: 0, e: 2.4, draw(t) {
    const k = eOut(P(t, .15, 1.35));
    const val = Math.round(2400 * k / 10) * 10;
    const pop = eBack(P(t, 0, .35));
    const coins = [...Array(10)].map((_, i) => {
      const a = i * 2.4, sp = P(t, .2 + i * .08, 1.2);
      if (sp <= 0 || sp >= 1) return '';
      const cx = 360 + Math.cos(a) * 260 * eOut(sp), cy = 640 + Math.sin(a) * 200 * eOut(sp) - 120 * sp + 200 * sp * sp;
      return `<g transform="translate(${cx},${cy}) rotate(${sp * 400})" opacity="${1 - sp}"><circle r="18" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/><text dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="18" fill="${C.ink}">$</text></g>`;
    }).join('');
    const glow = `<defs><radialGradient id="g1"><stop offset="0" stop-color="${C.yel}" stop-opacity=".45"/><stop offset="1" stop-color="${C.yel}" stop-opacity="0"/></radialGradient></defs><circle cx="360" cy="640" r="${380 + 20 * Math.sin(t * 5)}" fill="url(#g1)"/>`;
    return stripesBG(t) + glow + coins + KT(t, .1, 2.0, 'У ТЕБЯ', { x: 360, y: 470, size: 40, rot: -3, fill: '#d9d3f5' }, 'rise') + (t >= 2.0 ? '' :
      `<g transform="translate(360,640) scale(${2.1 * pop}) translate(${-HUD.money.w / 2},${-HUD.money.h / 2})">${moneyCard(val, { x: 0, y: 0, flash: k >= 1 ? clamp(1 - (t - 1.5) * 4) * .6 : 0 })}</g>`) +
      KT(t, 1.65, 2.25, [{ t: 'ВСЁ, ЧТО ', c: '#fff' }, { t: 'ЕСТЬ', c: C.yel }], { x: 360, y: 860, size: 46, rot: -4 });
  }
};

// ===== S2: resignation on the boss desk =====
const S2 = {
  s: 2.4, e: 5.6, draw(t) {
    const lt = t - this.s;
    const land = 3.15;
    const pk = eOut(P(t, 2.5, .65));
    const px = lerp(520, 400, pk), py = lerp(1450, seatTop(1000, 92) + 40, pk), pr = lerp(25, -6, pk);
    const [sx, sy] = shake(t, land, .25, 10);
    const [sx2, sy2] = shake(t, 3.95, .3, 16);
    const surprised = t > 4.5;
    const scene = bossOfficeBG() +
      seated({ x: 360, floor: 1000, r: 92, kind: 'boss', pose: 'stand', e: { eyes: surprised ? 'wide' : 'half', brow: surprised ? 'up' : 'flat', mouth: surprised ? 'o' : 'line', look: surprised ? [0, -.3] : [.3, 1], sweat: surprised } }) +
      officeDesk(-40, 760, seatTop(1000, 92), 1000) +
      `<g transform="translate(110,${seatTop(1000, 92) - 8})"><rect x="-55" y="-60" width="110" height="80" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="5"/><rect x="-55" y="-60" width="110" height="24" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/></g>` +
      mug(610, seatTop(1000, 92) - 36, 80) +
      // hand + sleeve sliding paper in
      `<g>${paperDoc(px, py, pr)}</g>` +
      (pk < 1 || t < land + .35 ? `<g transform="translate(${px + 30},${py + 90 + 200 * P(t, land + .05, .3)}) rotate(-12)"><path d="M0 0 L20 300" stroke="${C.ink}" stroke-width="64" stroke-linecap="round"/><path d="M0 0 L20 300" stroke="${C.jacket}" stroke-width="54" stroke-linecap="round"/><rect x="-30" y="20" width="62" height="22" rx="8" fill="${C.jacketD}" stroke="${C.ink}" stroke-width="4"/><circle r="26" fill="#fff" stroke="${C.ink}" stroke-width="4"/><ellipse cx="-22" cy="-8" rx="10" ry="7" fill="#fff" stroke="${C.ink}" stroke-width="3"/></g>` : '') +
      stamp(t, 3.95, 400, seatTop(1000, 92) + 60, 'УВОЛЬНЕНИЕ', C.red, -12, 32);
    const z = lerp(1, 1.18, eIO(P(t, 2.4, 3.2)));
    return cam(scene, { z, cx: 380, cy: 820, sx: sx + sx2, sy: sy + sy2 }) +
      KT(t, 4.6, 5.5, '!', { x: 520, y: 380, size: 90, fill: C.yel, rot: 10 }, 'pop');
  }
};

// ===== S3: character sheet (25 y.o., 3 years, manager) =====
function heroAtDesk(t, e, extra = '', o = {}) {
  return openSpaceBG(t) +
    seated({ x: o.hx ?? 420, floor: 1060, r: 88, kind: 'hero', e }) +
    officeDesk(-40, 760, seatTop(1060, 88), 1060) +
    monitor(60, seatTop(1060, 88) - 205, 230, 160, t) +
    `<rect x="300" y="${seatTop(1060, 88) - 24}" width="170" height="20" rx="6" fill="#d9d7df" stroke="${C.ink}" stroke-width="4"/>` +
    coffeeCup(620, seatTop(1060, 88) - 38, 1, t) + extra;
}
function statRow(t, t0, i, label, value, col = C.yel) {
  if (t < t0) return '';
  const k = eBack(P(t, t0, .3));
  return `<g transform="translate(${30 + (1 - k) * 60},${84 + i * 62})" opacity="${clamp(k * 2)}">
   <text x="0" y="0" dy="0.36em" font-family="Rubik" font-weight="800" font-size="16" letter-spacing="1" fill="#a9a5b8">${label}</text>
   <text x="${256}" y="0" dy="0.36em" text-anchor="end" font-family="Unbounded" font-weight="900" font-size="${value.length > 6 ? 21 : 26}" fill="${col}">${value}</text>
   <rect x="0" y="26" width="256" height="2" fill="#fff" opacity=".12"/></g>`;
}
const S3 = {
  s: 5.6, e: 10.1, draw(t) {
    const z = lerp(1.08, 1.2, eIO(P(t, 5.6, 4.5)));
    const e = { eyes: 'half', brow: 'flat', mouth: 'line', look: [-.4, .2] };
    const scene = cam(heroAtDesk(t, e, '', { hx: 250 }), { z, cx: 330, cy: 760 });
    const hsx = 360 + (250 - 330) * z, hsy = 640 + (720 - 760) * z - 88 * z;
    // name pointer above head
    const nk = eBack(P(t, 5.7, .3));
    const bob = Math.sin(t * 6) * 5;
    const pointer = nk > 0 ? `<g transform="translate(${hsx},${hsy - 70 + bob}) scale(${nk})"><rect x="-46" y="-30" width="92" height="52" rx="12" fill="${C.red}" stroke="${C.ink}" stroke-width="4"/><text dy="0.36em" y="-4" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="24" fill="#fff">ТЫ</text><path d="M-12 22 L0 40 L12 22Z" fill="${C.red}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/></g>` : '';
    const ck = eOut(P(t, 5.75, .35));
    const card = `<g transform="translate(${lerp(760, 380, ck)},232) rotate(2)">
      <rect x="6" y="8" width="316" height="320" rx="20" fill="${C.ink}"/>
      <rect width="316" height="320" rx="20" fill="#17141f" stroke="${C.ink}" stroke-width="4"/>
      <rect width="316" height="52" rx="20" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/><rect y="30" width="316" height="22" fill="${C.yel}"/>
      <text x="158" y="27" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="21" fill="${C.ink}">ПЕРСОНАЖ</text>
      ${statRow(t, 5.8, 0, 'ВОЗРАСТ', '25')}${statRow(t, 7.0, 1, 'СТАЖ', '3 ГОДА')}${statRow(t, 8.3, 2, 'КЛАСС', 'МЕНЕДЖЕР', '#fff')}${statRow(t, 9.4, 3, 'ЛОКАЦИЯ', 'ОФИС', '#fff')}</g>`;
    const saved = KTag(t, 7.7, 10.1, 'КОПИЛ НА МЕЧТУ', { x: 545, y: 640, size: 21, bg: C.grn, fg: '#fff', rot: -3 });
    return scene + pointer + card + saved;
  }
};

// ===== S4: routine montage =====
const S4 = {
  s: 10.1, e: 15.3, draw(t) {
    let out = '';
    const dayN = 1093 + Math.floor(P(t, 10.1, 1.9) * 2);
    if (t < 12.0) {
      const e = { eyes: 'half', brow: 'worried', mouth: 'frown', look: [-.6, .3] };
      out = cam(heroAtDesk(t, e, wallClock(560, 160, 60, t, 3)), { z: 1.02, cx: 360, cy: 700 }) +
        `<g transform="translate(36,236)">${tag('ДЕНЬ ' + dayN.toLocaleString('ru-RU'), { x: 110, y: 20, size: 24, bg: '#fff', rot: -2 })}</g>` +
        KT(t, 10.25, 12.0, 'КАЖДЫЙ ДЕНЬ', { x: 360, y: 470, size: 52, rot: -4 }) +
        KT(t, 11.2, 12.0, [{ t: 'ОДНО И ТО ЖЕ', c: C.yel }], { x: 380, y: 545, size: 44, rot: 3 });
    } else if (t < 12.9) {
      const lt = t - 12.0, z = lerp(1.35, 1.0, eOut(clamp(lt / .4)));
      out = cam(`<rect x="-400" y="-400" width="1520" height="2080" fill="#2b2833"/>` + monitor(60, 360, 600, 440, t * 3), { z, cx: 360, cy: 600 }) +
        KT(t, 12.02, 12.9, 'ТАБЛИЦЫ', { x: 360, y: 980, size: 66, rot: -3 });
    } else if (t < 13.9) {
      const lt = t - 12.9, z = lerp(1.35, 1.0, eOut(clamp(lt / .4)));
      const k = eOut(P(t, 12.95, .7));
      const pts = [[110, 820], [220, 760], [310, 790], [420, 650], [520, 690], [620, 500]];
      let n = Math.max(2, Math.ceil(k * pts.length));
      const poly = pts.slice(0, n).map(p => p.join(',')).join(' ');
      out = cam(`<rect x="-400" y="-400" width="1520" height="2080" fill="#ebe2d1"/>
        <rect x="60" y="380" width="600" height="520" rx="10" fill="#fff" stroke="${C.ink}" stroke-width="7"/>
        ${[0, 1, 2, 3].map(i => `<rect x="90" y="${480 + i * 100}" width="540" height="3" fill="#e4e2ea"/>`).join('')}
        <polyline points="${poly}" fill="none" stroke="#2ea56a" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>`, { z, cx: 360, cy: 640 }) +
        KT(t, 12.92, 13.9, [{ t: 'ПЛАНЫ ', c: '#fff' }, { t: 'ПРОДАЖ', c: C.grn }], { x: 360, y: 300, size: 56, rot: 3 });
    } else {
      const lt = t - 13.9, z = lerp(1.3, 1.0, eOut(clamp(lt / .5)));
      const fill = P(t, 14.0, 1.1);
      out = cam(`<rect x="-400" y="-400" width="1520" height="2080" fill="#cfd4dc"/>
        <rect x="150" y="250" width="420" height="820" rx="30" fill="#3a3a48" stroke="${C.ink}" stroke-width="7"/>
        <rect x="190" y="300" width="340" height="120" rx="12" fill="#14121c"/><text x="360" y="362" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="800" font-size="30" fill="#5cf08f">КОФЕ · 1</text>
        <rect x="240" y="470" width="240" height="400" rx="14" fill="#24222d" stroke="${C.ink}" stroke-width="5"/>
        <rect x="350" y="480" width="20" height="${150 * fill}" fill="#6b4226" opacity="${fill < 1 ? 1 : 0}"/>
        ${coffeeCup(360, 800, 2.2, t)}`, { z, cx: 360, cy: 650 }) +
        KT(t, 13.92, 15.3, 'КОФЕ', { x: 360, y: 1000, size: 72, rot: -4 }) +
        KT(t, 14.25, 15.3, [{ t: 'ИЗ АВТОМАТА', c: C.yel }], { x: 360, y: 1080, size: 34, rot: -2 }, 'rise');
    }
    // loop icon top-left under HUD
    const lk = P(t, 10.1, .3);
    out += `<g transform="translate(650,248) rotate(${t * 240})" opacity="${lk}"><circle r="30" fill="#17141f" stroke="${C.ink}" stroke-width="4"/><path d="M-14 -6 A16 16 0 1 1 -10 12" fill="none" stroke="${C.yel}" stroke-width="6" stroke-linecap="round"/><path d="M-22 -10 L-14 -2 L-6 -12Z" fill="${C.yel}"/></g>`;
    return out;
  }
};

// ===== S5: phone notification → release timer → decision =====
const S5 = {
  s: 15.3, e: 19.5, draw(t) {
    const dec = t >= 18.3;
    const z = dec ? lerp(1.0, 1.35, eOut(P(t, 18.3, .35))) : lerp(1.05, 1.0, P(t, 15.3, 3));
    const glow = `<defs><radialGradient id="ph"><stop offset="0" stop-color="#ff8a3d" stop-opacity=".55"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient></defs><circle cx="460" cy="900" r="420" fill="url(#ph)"/>`;
    const e = dec ? { eyes: 'open', brow: 'down', mouth: 'smirk', look: [0, 0] } : t > 16.15 ? { eyes: 'wide', brow: 'up', mouth: 'o', look: [.5, .9] } : { eyes: 'open', brow: 'flat', mouth: 'line', look: [.5, .9] };
    const ph = eOut(P(t, 15.35, .35));
    const phone = `<g transform="translate(${lerp(760, 470, ph)},${lerp(1250, 1000, ph)}) rotate(${lerp(30, -8, ph)})">
      <rect x="-95" y="-170" width="190" height="340" rx="26" fill="#1d1b24" stroke="${C.ink}" stroke-width="6"/>
      <rect x="-80" y="-150" width="160" height="300" rx="16" fill="#ff7a2e"/>
      <text y="-80" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="#fff">GTA 6</text>
      <text y="-40" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="19" fill="#fff">через 3 дня</text>
      <rect x="-60" y="0" width="120" height="70" rx="10" fill="#fff" opacity=".25"/></g>`;
    const scene = `<rect x="-400" y="-400" width="1520" height="2080" fill="#3a2f4a"/>` + openSpaceBG(t).replace('fill="#ebe2d1"', 'fill="#cfc4b4"') +
      `<rect x="-400" y="-400" width="1520" height="2080" fill="#120c22" opacity=".45"/>` + glow +
      person({ x: 330, y: 700, r: 140, kind: 'hero', pose: 'stand', e }) + phone;
    let out = cam(scene, { z, cx: 340, cy: 700 });
    // release timer reveal: big at center, then docks into HUD
    if (t >= 16.1 && t < 18.0) {
      const a = eBack(P(t, 16.1, .3)), d = eIO(P(t, 17.45, .5));
      const sc = lerp(1.6, 1, d) * a;
      const x = lerp(360 - HUD.timer.w * 1.6 / 2, HUD.timer.x, d), y = lerp(560, HUD.y, d);
      out += `<rect width="${W}" height="${H}" fill="#000" opacity="${.45 * (1 - d) * clamp(a)}"/>` + burst(t, 16.1, 360, 630, C.yel) +
        `<g transform="translate(${x},${y}) scale(${sc / 1})">${timerCard(3, { x: 0, y: 0, t })}</g>` +
        KT(t, 16.15, 17.4, [{ t: 'ВЫХОДИТ ', c: '#fff' }, { t: 'GTA 6', c: C.yel }], { x: 360, y: 820, size: 44, rot: -3 });
    }
    out += KT(t, 15.4, 16.1, 'НО', { x: 140, y: 380, size: 80, rot: -8 }, 'slam');
    if (dec) out += burst(t, 18.35, 360, 470, '#fff') + KT(t, 18.35, 19.5, [{ t: 'РЕШЕНО', c: C.yel }], { x: 360, y: 470, size: 84, rot: -5 });
    return out;
  }
};

// ===== S6: boss raises eyes + question =====
const S6 = {
  s: 19.5, e: 23.6, draw(t) {
    const up = P(t, 19.9, .3);
    const talking = win(t, 21.3, 23.5);
    const e = { eyes: up > .5 ? 'open' : 'half', brow: up > .5 ? 'up' : 'flat', mouth: talking ? 'talk' : 'line', open: env(t) * 1.6, look: [0, lerp(1, -.2, up)] };
    const z = lerp(1.0, 1.1, eIO(P(t, 19.5, 4)));
    const scene = bossOfficeBG() + seated({ x: 360, floor: 1400, r: 150, kind: 'boss', pose: 'mug', e }) + officeDesk(-40, 760, seatTop(1400, 150), 1400);
    return cam(scene, { z, cx: 360, cy: 800 }) +
      KTag(t, 19.75, 21.2, 'НАЧАЛЬНИК', { x: 360, y: 400, size: 26, bg: C.red, fg: '#fff', rot: -3 }) +
      dialog(t, { t0: 21.3, t1: 23.55, name: 'НАЧАЛЬНИК', nameBg: C.red, text: 'И чем ты теперь\nсобираешься *заниматься*?', y: 250, cps: 24 });
  }
};

// ===== S7: hero answer =====
const S7 = {
  s: 23.6, e: 26.7, draw(t) {
    const talking = win(t, 25.15, 26.4);
    const e = { eyes: talking ? 'open' : 'half', brow: 'sly', mouth: talking ? 'talk' : 'smirk', open: env(t) * 1.6, look: [0, 0], blush: false };
    const z = t > 25.2 ? lerp(1.0, 1.25, eOut(P(t, 25.2, .3))) : 1.0;
    const [sx, sy] = shake(t, 25.25, .35, 18);
    const scene = openSpaceBG(t) + person({ x: 360, y: 760, r: 150, kind: 'hero', pose: 'stand', e });
    let out = cam(scene, { z, cx: 360, cy: 760, sx, sy });
    out += KTag(t, 23.8, 25.1, 'СПОКОЙНО', { x: 520, y: 400, size: 24, bg: '#fff', rot: 4 }, 'rise');
    if (t > 25.2) out += `<rect width="${W}" height="${H}" fill="#fff" opacity="${clamp(1 - (t - 25.2) * 8) * .8}"/>` + burst(t, 25.2, 360, 360, C.yel, 18) +
      KT(t, 25.2, 26.7, '«ИГРАТЬ', { x: 350, y: 300, size: 76, rot: -5 }) + KT(t, 25.35, 26.7, [{ t: 'В GTA»', c: C.yel }], { x: 380, y: 392, size: 82, rot: 3 });
    return out;
  }
};

// ===== S8: freeze — boss.exe not responding + colleagues =====
const S8 = {
  s: 26.7, e: 31.2, draw(t) {
    const frozen = t < 29.0;
    const peek = eBack(P(t, 29.0, .35));
    const cols = [[200, 'colA'], [400, 'colB'], [560, 'colA']].map(([x, k], i) => {
      const pk = eBack(P(t, 29.0 + i * .12, .35));
      return head({ x, y: lerp(820, 640, pk), r: 50, kind: k, e: { eyes: 'wide', brow: 'up', mouth: i === 1 ? 'o' : 'line', look: [i === 0 ? 1 : -1, 0] } }) +
        (pk > .6 ? `<g transform="translate(${x + 40},${560 + Math.sin(t * 9 + i) * 4})"><text text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="40" fill="${C.yel}" stroke="${C.ink}" stroke-width="7" paint-order="stroke">!</text></g>` : '');
    }).join('');
    const scene = bossOfficeBG() + `<rect x="-400" y="700" width="1520" height="300" fill="#93a4bb" stroke="${C.ink}" stroke-width="5"/>` + cols +
      `<rect x="-400" y="760" width="1520" height="240" fill="#93a4bb"/><rect x="-400" y="760" width="1520" height="6" fill="${C.ink}"/>` +
      seated({ x: 210, floor: 1232, r: 85, kind: 'boss', pose: 'mug', e: { eyes: 'wide', brow: 'up', mouth: 'wavy', look: [1, 0], sweat: true } }) +
      officeDesk(-40, 440, seatTop(1232, 85), 1232) +
      person({ x: 560, y: 920, r: 80, kind: 'hero', pose: 'stand', e: { eyes: 'half', brow: 'sly', mouth: 'smirk', look: [-1, 0] } });
    const z = lerp(1.05, 1.0, eOut(P(t, 26.7, .4)));
    const sat = frozen ? `<filter id="gs"><feColorMatrix type="saturate" values="${lerp(1, .15, P(t, 26.85, .15))}"/></filter>` : '';
    let out = `${sat}<g ${frozen ? 'filter="url(#gs)"' : ''}>${cam(scene, { z, cx: 360, cy: 760 })}</g>`;
    if (frozen && t > 27.0) {
      const k = eBack(P(t, 27.0, .3));
      out += `<g transform="translate(360,520) scale(${k}) rotate(-2)">
        <rect x="-266" y="-82" width="540" height="180" rx="14" fill="${C.ink}"/>
        <rect x="-270" y="-90" width="540" height="180" rx="14" fill="#f2f2f6" stroke="${C.ink}" stroke-width="5"/>
        <rect x="-270" y="-90" width="540" height="44" rx="14" fill="${C.blue}" stroke="${C.ink}" stroke-width="5"/><rect x="-265" y="-60" width="530" height="14" fill="${C.blue}"/>
        <text x="-248" y="-68" dy="0.36em" font-family="Rubik" font-weight="800" font-size="20" fill="#fff">ошибка</text>
        <rect x="222" y="-82" width="32" height="28" rx="6" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>
        <circle cx="-210" cy="20" r="30" fill="${C.yel}" stroke="${C.ink}" stroke-width="4"/><text x="-210" y="20" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="34" fill="${C.ink}">!</text>
        <text x="-160" y="4" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="26" fill="${C.ink}">НАЧАЛЬНИК.EXE</text>
        <text x="-160" y="42" dy="0.36em" font-family="Rubik" font-weight="800" font-size="24" fill="#6e6a7c">не отвечает${'.'.repeat(1 + Math.floor(t * 3) % 3)}</text></g>`;
    }
    if (!frozen) out += KTag(t, 29.1, 31.1, 'КОЛЛЕГИ В ШОКЕ', { x: 380, y: 420, size: 28, bg: C.yel, rot: -3 });
    return out;
  }
};

// ===== S9: boss smirk + threat =====
const S9 = {
  s: 31.2, e: 35.5, draw(t) {
    const talking = win(t, 32.2, 35.3);
    const e = { eyes: 'half', brow: 'sly', mouth: talking ? 'talk' : 'smirk', open: env(t) * 1.6, look: [-.3, 0] };
    const z = lerp(1.15, 1.3, eIO(P(t, 31.2, 4.3)));
    const scene = bossOfficeBG() + seated({ x: 360, floor: 1420, r: 150, kind: 'boss', pose: 'mug', e }) + officeDesk(-40, 760, seatTop(1420, 150), 1420);
    return cam(scene, { z, cx: 360, cy: 820 }) +
      KT(t, 31.35, 32.15, 'ХМ.', { x: 560, y: 470, size: 60, rot: 8 }, 'pop') +
      dialog(t, { t0: 32.2, t1: 35.45, name: 'НАЧАЛЬНИК', nameBg: C.red, text: 'Через месяц _приползёшь_\nобратно. Место я придержу.', y: 250, cps: 21 });
  }
};

// ===== S10: calendar, red marker → 30 days =====
const S10 = {
  s: 35.5, e: 40.5, draw(t) {
    const z = lerp(1.0, 1.08, eIO(P(t, 35.5, 5)));
    let grid = '';
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    days.forEach((d, i) => grid += `<text x="${130 + i * 76}" y="520" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="20" fill="#8a8796">${d}</text>`);
    for (let n = 1; n <= 31; n++) {
      const i = (n - 1 + 2) % 7, r = Math.floor((n - 1 + 2) / 7);
      const x = 130 + i * 76, y = 580 + r * 76;
      grid += n === 1 ? `<rect x="${x - 28}" y="${y - 30}" width="56" height="56" rx="12" fill="${C.blue}"/><text x="${x}" y="${y}" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">1</text><text x="${x}" y="${y + 44}" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="14" fill="${C.blue}">сегодня</text>`
        : `<text x="${x}" y="${y}" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="800" font-size="26" fill="${C.ink}">${n}</text>`;
    }
    // target cell 31: index (30+2)%7=4, row 4
    const tx = 130 + 4 * 76, ty = 580 + 4 * 76;
    const draw = P(t, 37.4, 1.3);
    const circ = 2 * Math.PI * 44;
    const circle = `<circle cx="${tx}" cy="${ty}" r="44" fill="none" stroke="${C.red}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - draw)}" transform="rotate(-100 ${tx} ${ty})"/>`;
    const ang = (-100 + 360 * draw) * Math.PI / 180;
    const mk = eOut(P(t, 36.3, .9));
    const away = eIO(P(t, 38.75, .5));
    let mx = draw > 0 && draw < 1 ? tx + Math.cos(ang) * 44 : lerp(720, tx + 20, mk), my = draw > 0 && draw < 1 ? ty + Math.sin(ang) * 44 : lerp(1300, ty + 10, mk);
    if (draw >= 1) { mx = lerp(tx + 30, 760, away); my = lerp(ty - 20, 1350, away); }
    const marker = `<g transform="translate(${mx},${my}) rotate(35)"><rect x="-16" y="0" width="32" height="200" rx="10" fill="${C.red}" stroke="${C.ink}" stroke-width="5"/><path d="M-14 2 L0 -26 L14 2Z" fill="${C.ink}"/><rect x="-16" y="120" width="32" height="20" fill="#fff" opacity=".5"/></g>`;
    const scene = `<rect x="-400" y="-400" width="1520" height="2080" fill="#8d5a36"/>
      <g transform="rotate(-2 360 700)"><rect x="56" y="330" width="620" height="760" rx="22" fill="${C.ink}"/><rect x="50" y="320" width="620" height="760" rx="22" fill="#fff" stroke="${C.ink}" stroke-width="6"/>
      <rect x="50" y="320" width="620" height="120" rx="22" fill="${C.red}" stroke="${C.ink}" stroke-width="6"/><rect x="53" y="400" width="614" height="40" fill="${C.red}"/>
      <text x="360" y="382" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="38" fill="#fff">КАЛЕНДАРЬ</text>
      ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${110 + i * 100}" y="296" width="16" height="50" rx="8" fill="#55525e" stroke="${C.ink}" stroke-width="4"/>`).join('')}
      ${grid}${circle}${draw >= 1 ? `<text x="${tx}" y="${ty + 70}" text-anchor="middle" font-family="Rubik" font-weight="800" font-style="italic" font-size="20" fill="${C.red}" opacity="${P(t, 38.8, .3)}">вернётся</text>` : ''}</g>` + marker;
    return cam(scene, { z, cx: tx - 20, cy: 700 }) +
      burst(t, 39.0, 360, 1000, C.red) + KT(t, 39.0, 40.5, [{ t: '30 ДНЕЙ', c: C.red }], { x: 330, y: 1000, size: 76, rot: -4, stroke: C.ink }) +
      KTag(t, 39.35, 40.5, 'ДЕДЛАЙН', { x: 470, y: 1080, size: 24, bg: C.ink, fg: '#fff', rot: 3 }, 'rise');
  }
};

// ===== S11: walk out with box =====
const S11 = {
  s: 40.5, e: 43.5, draw(t) {
    const lt = t - this.s;
    const hx = lerp(160, 520, lt / 3);
    const scene = openSpaceBG(t) +
      `<rect x="590" y="560" width="200" height="350" fill="#9c6640" stroke="${C.ink}" stroke-width="6"/><rect x="600" y="500" width="120" height="44" rx="6" fill="${C.grn}" stroke="${C.ink}" stroke-width="4"/><text x="660" y="522" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="20" fill="#fff">ВЫХОД</text>` +
      `<rect x="-400" y="900" width="1520" height="900" fill="#bdbcc3"/>` +
      person({ x: hx, y: 690 + Math.abs(Math.sin(lt * 8)) * -10, r: 82, kind: 'hero', pose: 'box', walk: lt * 8, e: { eyes: 'half', brow: 'flat', mouth: 'line', look: [1, 0] } });
    const z = 1.05;
    return cam(scene, { z, cx: lerp(330, 420, lt / 3), cy: 760 }) +
      KT(t, 40.65, 42.5, 'МОЛЧА', { x: 230, y: 420, size: 40, rot: -6, fill: '#e9e6f2' }, 'rise') +
      KT(t, 42.6, 43.5, [{ t: 'УХОДИШЬ', c: '#fff' }], { x: 400, y: 1010, size: 54, rot: 3 });
  }
};

// ===== S12: street — billboard tilt-up =====
function billboard(t) {
  const sun = `<circle cx="470" cy="470" r="90" fill="#ffd166"/>`;
  return `<g><rect x="70" y="250" width="580" height="420" rx="10" fill="${C.ink}"/>
   <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff5f8f"/><stop offset=".6" stop-color="#ff9e4a"/><stop offset="1" stop-color="#ffd166"/></linearGradient></defs>
   <rect x="84" y="264" width="552" height="392" fill="url(#sky)"/>${sun}
   ${[[110, 470, 60, 186], [180, 420, 50, 236], [240, 500, 46, 156]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#5b2a86"/>`).join('')}
   <path d="M520 656 q10 -110 -10 -180" stroke="#2c1446" stroke-width="12" fill="none"/>${[0, 1, 2, 3].map(i => `<path d="M510 478 q${-60 + i * 40} ${-30 + Math.abs(i - 1.5) * 10} ${-90 + i * 60} ${10 + Math.abs(i - 1.5) * 12}" stroke="#2c1446" stroke-width="10" fill="none" stroke-linecap="round"/>`).join('')}
   <text x="360" y="330" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="84" fill="#fff" stroke="${C.ink}" stroke-width="12" paint-order="stroke">GTA 6</text>
   <text x="360" y="400" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="900" font-size="26" letter-spacing="6" fill="#fff" stroke="${C.ink}" stroke-width="6" paint-order="stroke">СКОРО</text></g>`;
}
const S12 = {
  s: 43.5, e: 48.3, draw(t) {
    const lt = t - this.s;
    let bld = `<rect x="-400" y="-600" width="1520" height="2400" fill="#a9c6ee"/>
      <rect x="20" y="-200" width="680" height="1300" fill="#e9e3d6" stroke="${C.ink}" stroke-width="6"/>`;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) bld += `<rect x="${50 + c * 108}" y="${720 + r * 96 - 300}" width="70" height="60" fill="${(r + c) % 3 ? '#7fb0e8' : '#f6d46b'}" stroke="${C.ink}" stroke-width="4"/>`;
    bld += `<rect x="-400" y="1100" width="1520" height="800" fill="#8c8b94"/><rect x="-400" y="1100" width="1520" height="20" fill="#c9c8d0"/>`;
    const cy = lerp(1150, 560, eIO(P(t, 43.6, 1.8)));
    const st = P(t, 47.55, .16);
    const sticker = t > 47.55 ? `<g transform="translate(540,600) rotate(-10) scale(${lerp(2.6, 1, eOut(st))})" opacity="${clamp(st * 4)}"><rect x="-90" y="-62" width="180" height="124" rx="16" fill="${C.red}" stroke="${C.ink}" stroke-width="6"/><text y="-12" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="58" fill="#fff">3</text><text y="36" text-anchor="middle" dy="0.36em" font-family="Rubik" font-weight="900" font-size="24" fill="#fff">ДНЯ</text></g>` : '';
    const scene = bld + billboard(t) + sticker +
      person({ x: 360, y: 1180, r: 80, kind: 'hero', pose: 'box', e: { eyes: 'open', brow: 'up', mouth: 'o', look: [0, -1] } });
    const [sx, sy] = shake(t, 47.6, .3, 14);
    return cam(scene, { z: lerp(1.15, 1.05, P(t, 43.5, 4.8)), cx: 360, cy, sx, sy }) +
      KTag(t, 43.6, 45.4, 'ЗДАНИЕ НАПРОТИВ', { x: 360, y: 300, size: 24, bg: '#fff', rot: -2 }, 'rise') +
      KT(t, 45.6, 47.5, [{ t: 'ДО ВЫХОДА', c: '#fff' }], { x: 360, y: 1000, size: 50, rot: -3 });
  }
};

// ===== S13: the plan — game club =====
const S13 = {
  s: 48.3, e: 55.0, draw(t) {
    const z = lerp(1.0, 1.08, eIO(P(t, 48.3, 6.7)));
    const e = t > 50.5 ? { eyes: 'happy', brow: 'up', mouth: 'grin', blush: true } : { eyes: 'open', brow: 'sly', mouth: 'smile', look: [.4, -.6] };
    const street = `<rect x="-400" y="-400" width="1520" height="2080" fill="#a9c6ee"/><rect x="-400" y="900" width="1520" height="900" fill="#8c8b94"/>
      ${[[-40, 240, 260], [230, 150, 240], [470, 300, 300]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="760" fill="#d9d2c4" stroke="${C.ink}" stroke-width="5" opacity=".9"/>`).join('')}`;
    const scene = street + `<rect x="-400" y="-400" width="1520" height="2080" fill="#1b1440" opacity=".25"/>` +
      person({ x: 360, y: 990, r: 120, kind: 'hero', pose: 'box', e });
    let out = cam(scene, { z, cx: 360, cy: 860 });
    // thought bubble with club blueprint
    const bk = eBack(P(t, 50.4, .4));
    if (bk > 0) {
      const ppl = [52.0, 52.3, 52.6].map((ts, i) => {
        const k = eBack(P(t, ts, .3)); if (k <= 0) return '';
        return `<g transform="translate(${-150 + i * 150},${110}) scale(${k})">${head({ r: 26, kind: i === 1 ? 'colA' : 'colB', e: { eyes: 'happy', mouth: 'smile' } })}</g>`;
      }).join('');
      const tv = (x, lit) => `<g transform="translate(${x},-40)"><rect x="-95" y="-60" width="190" height="115" rx="8" fill="${C.ink}"/><rect x="-85" y="-50" width="170" height="95" rx="4" fill="${lit ? '#ff8a3d' : '#3a3546'}"/>
        ${lit ? `<text y="-2" dy="0.36em" text-anchor="middle" font-family="Unbounded" font-weight="900" font-size="26" fill="#fff">GTA 6</text>` : ''}
        <rect x="-50" y="66" width="100" height="22" rx="6" fill="#f2f2f6" stroke="${C.ink}" stroke-width="4"/></g>`;
      const glow = P(t, 53.7, .3);
      out += `<g transform="translate(360,440) scale(${.92 * bk})">
        <circle cx="-40" cy="225" r="16" fill="#fff" stroke="${C.ink}" stroke-width="4"/><circle cx="-10" cy="258" r="10" fill="#fff" stroke="${C.ink}" stroke-width="4"/>
        <rect x="-300" y="-180" width="606" height="388" rx="60" fill="${C.ink}"/>
        <rect x="-306" y="-190" width="606" height="388" rx="60" fill="#2348a8" stroke="${C.ink}" stroke-width="6"/>
        ${[...Array(9)].map((_, i) => `<line x1="${-280 + i * 70}" y1="-170" x2="${-280 + i * 70}" y2="180" stroke="#fff" stroke-opacity=".12" stroke-width="2"/>`).join('')}
        <text x="0" y="-145" text-anchor="middle" dy="0.36em" font-family="Unbounded" font-weight="900" font-size="24" fill="#fff" opacity=".9">ПЛАН · ИГРОВОЙ КЛУБ</text>
        ${tv(-140, P(t, 51.0, .1) > 0)}${tv(140, P(t, 51.3, .1) > 0)}${ppl}
        ${glow > 0 ? `<rect x="-250" y="20" width="500" height="44" rx="10" fill="none" stroke="${C.yel}" stroke-width="${6 * glow}"/>` : ''}
      </g>`;
      out += KTag(t, 53.75, 55.0, 'ТВОИ ПРИСТАВКИ', { x: 360, y: 605, size: 26, bg: C.yel, rot: -3 });
    }
    return out;
  }
};

