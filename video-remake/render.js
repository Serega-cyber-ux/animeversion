// usage: node render.js <start> <end> <out.mp4> [fps] [scale]
const { chromium } = require('playwright'); const { spawn } = require('child_process'); const path = require('path');
const [start, end, out, fpsA, scaleA] = process.argv.slice(2); const fps = +(fpsA || 30), scale = +(scaleA || 1.5);
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: scale });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => window.ready);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round((+end - +start) * fps);
  for (let i = 0; i < n; i++) {
    const t = +start + i / fps;
    await p.evaluate(t => window.renderAt(t), t);
    const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (errs.length) { console.error('ERR at', t, errs); break; }
    if (i % 150 === 0) console.log('frame', i, '/', n);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close();
})();
