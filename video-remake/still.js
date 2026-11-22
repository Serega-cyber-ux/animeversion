// usage: node still.js out.png t1 t2 ...  -> contact sheet of stills (scale 0.5)
const { chromium } = require('playwright'); const path = require('path');
const [out, ...ts] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => window.ready);
  const imgs = [];
  for (const t of ts) { await p.evaluate(t => window.renderAt(t), +t); imgs.push((await p.screenshot({ type: 'jpeg', quality: 80 })).toString('base64')); }
  if (errs.length) console.error(errs);
  const cols = Math.min(4, ts.length), rows = Math.ceil(ts.length / cols);
  await p.setViewportSize({ width: cols * 360, height: rows * 660 });
  await p.setContent(`<body style="margin:0;display:grid;grid-template-columns:repeat(${cols},360px);background:#222">${imgs.map((d, i) => `<div style="position:relative"><img src="data:image/jpeg;base64,${d}" style="width:360px;height:640px;display:block"><span style="position:absolute;left:4px;top:4px;background:#000;color:#ff0;font:14px monospace">${ts[i]}</span></div>`).join('')}</body>`);
  await p.screenshot({ path: out }); await b.close();
})();
