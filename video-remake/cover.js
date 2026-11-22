const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1.5 });
  p.on('pageerror', e => console.error(e.message));
  await p.goto('file://' + path.resolve(__dirname, 'cover.html')); await p.evaluate(() => window.ready); await p.evaluate(() => window.draw());
  await p.screenshot({ path: process.argv[2] || 'out/cover.png' }); await b.close(); })();
