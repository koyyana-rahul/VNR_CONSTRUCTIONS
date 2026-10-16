/** Reports the class chain of each remaining contrast failure. */
const BASE = process.env.AUDIT_BASE || 'http://localhost:5199';

export default async function run(page, ui) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const out = {};

  for (const [name, path] of [
    ['quality', '/quality'],
    ['packages', '/packages'],
    ['estimator', '/estimate'],
  ]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), y);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(800);

    out[name] = await page.evaluate(() => {
      const wanted = [
        'On engineering specifications',
        'Why there are no prices here',
        'Illustrative rates',
        '01',
        'Differs',
        '6/12 included',
        'Build the envelope',
        '₹1,45,000',
        'Standard structural design',
      ];
      const res = [];
      for (const el of document.querySelectorAll('*')) {
        if (el.children.length) continue;
        const t = (el.textContent || '').trim();
        if (!t) continue;
        if (!wanted.some((w) => t.startsWith(w))) continue;
        const cs = getComputedStyle(el);
        // ancestor chain, 4 levels
        const chain = [];
        let n = el;
        for (let i = 0; i < 5 && n && n !== document.body; i++) {
          chain.push(n.tagName.toLowerCase() + '.' + String(n.className || '').slice(0, 70));
          n = n.parentElement;
        }
        // does any ancestor carry on-light?
        let onLight = false;
        for (let m = el; m; m = m.parentElement) {
          if (m.classList && m.classList.contains('on-light')) onLight = true;
        }
        res.push({ text: t.slice(0, 32), color: cs.color, onLight, chain });
        if (res.length > 9) break;
      }
      return res;
    });
  }
  return out;
}
