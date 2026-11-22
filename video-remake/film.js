// ===== compositor for the whole film =====
const SCENES = [
  { ...S1, tin: 'none' }, { ...S2, tin: 'whip' }, { ...S3, tin: 'flash' }, { ...S4, tin: 'whip' }, { ...S5, tin: 'flash' },
  { ...S6, tin: 'whip' }, { ...S7, tin: 'whip' }, { ...S8, tin: 'flash' }, { ...S9, tin: 'whip' }, { ...S10, tin: 'whip' },
  { ...S11, tin: 'whip' }, { ...S12, tin: 'flash' }, { ...S13, tin: 'whip' },
  ...PART2.map(([sc, tin]) => ({ ...sc, tin })),
];
const CUT = [251.05, 254.35]; // removed narration line (seconds of source audio)
const CUTLEN = CUT[1] - CUT[0];
const srcT = t => (t < CUT[0] ? t : t + CUTLEN);
const END = 284.85; // source end
// money events: [time, delta]
const MONEY = [[115.6, 1200], [174.3, -700], [179.9, -140], [199.3, -450], [206.0, -40]];
function moneyAt(t) { return 3000 + MONEY.reduce((a, [t0, d]) => a + d * eOut(P(t, t0, .7)), 0); }
const hudOn = t => t >= 2.0 && t < 265.3;
function overlays(t) {
  let s = '';
  if (!hudOn(t)) return s + (t >= 265.3 ? '' : '');
  const outK = P(t, 265.0, .3);
  const lift = -160 * eIn(outK);
  // money
  {
    const d = eIO(P(t, 2.0, .4));
    const sc = lerp(2.1, 1, d);
    const x = lerp(360 - HUD.money.w * 2.1 / 2, HUD.money.x, d), y = lerp(640 - HUD.money.h * 2.1 / 2, HUD.y, d) + lift;
    const ev = MONEY.find(([t0]) => t >= t0 && t < t0 + 1.4);
    const [sx, sy] = ev ? shake(t, ev[0], .35, 8) : [0, 0];
    s += moneyCard(moneyAt(t), { x: x + sx, y: y + sy, sc, flash: ev ? clamp(1 - (t - ev[0]) * 3) * .5 : 0 });
    if (ev) { // flying delta chip
      const k = P(t, ev[0], 1.4), up = ev[1] > 0;
      s += tag((up ? '+$' : '−$') + Math.abs(ev[1]).toLocaleString('ru-RU').replace(/\s/g, ' '), { x: HUD.money.x + 360, y: HUD.y + 190 + 60 * eOut(k), size: 30, bg: up ? C.grn : C.red, fg: '#fff', rot: up ? -4 : 4, op: 1 - eIn(k), sc: eBack(clamp(k * 5)) });
    }
  }
  // debt chip (persistent after Tyoma's loan)
  if (t >= 120.3) {
    const k = eBack(P(t, 120.3, .4));
    s += `<g transform="translate(${HUD.money.x + 14},${HUD.y + HUD.money.h + 14 + lift}) scale(${k})"><rect x="3" y="4" width="214" height="40" rx="12" fill="${C.ink}"/><rect width="214" height="40" rx="12" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/>
      <text x="107" y="20" dy="0.36em" text-anchor="middle" font-family="Rubik" font-weight="800" font-size="18" fill="#fff">ДОЛГ ТЁМЕ · $1 200</text></g>`;
  }
  // release timer
  if (t >= 17.95) {
    const days = t >= 259.75 ? 2 : 3;
    const flip = P(t, 259.75, .35);
    const pulse = Math.max(clamp(1 - Math.abs(t - 47.7) * 2.5), clamp(1 - Math.abs(t - 18.0) * 3), clamp(1 - Math.abs(t - 260.0) * 1.5), clamp(1 - Math.abs(t - 157.5) * 2));
    s += `<g transform="translate(0,${lift})">${timerCard(days, { x: HUD.timer.x, y: HUD.y, t, pulse, flip })}</g>`;
  }
  s += objective(t, { t0: 42.55, t1: 45.2, title: 'ЗАДАНИЕ ВЫПОЛНЕНО', text: 'Уволиться из офиса', done: true });
  s += objective(t, { t0: 48.4, t1: 50.3, title: 'НОВАЯ ЦЕЛЬ', text: 'Свой игровой клуб', textAt: 49.0 });
  s += objective(t, { t0: 105.6, t1: 107.9, title: 'НОВЫЙ СОЮЗНИК', text: 'Тёма вложился', done: true, y: 1010 });
  s += objective(t, { t0: 216.6, t1: 219.0, title: 'ЗАДАНИЕ ВЫПОЛНЕНО', text: 'Клуб готов', done: true, y: 900 });
  return s;
}
function frame(t) {
  _uid = 0;
  // t is source time
  const sc = SCENES.find(s => t >= s.s && t < s.e) || SCENES[SCENES.length - 1];
  let body = sc.draw(t);
  const lt = t - sc.s;
  if (sc.tin === 'whip' && lt < .2) {
    const k = eOut(lt / .2);
    body = `<filter id="mb" x="-20%" width="140%"><feGaussianBlur stdDeviation="${18 * (1 - k)} 0"/></filter><g filter="url(#mb)" transform="translate(${180 * (1 - k)},0)">${body}</g>`;
  }
  let fx = '';
  if (sc.tin === 'flash' && lt < .15) fx = `<rect width="${W}" height="${H}" fill="#fff" opacity="${1 - lt / .15}"/>`;
  const fadeOut = t > END - .5 ? `<rect width="${W}" height="${H}" fill="#000" opacity="${P(t, END - .5, .5)}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#000"/>${body}${vignette(.3)}${overlays(t)}${fx}${fadeOut}</svg>`;
}
