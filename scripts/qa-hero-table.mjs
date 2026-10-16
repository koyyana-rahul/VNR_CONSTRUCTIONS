/**
 * Reads a browser-runner dump and prints the hero spacing table compactly.
 * Bracket-balanced parse — the payload contains nested objects, so matching on
 * a bare `]` line stops at the first inner one.
 */
import fs from 'node:fs';

const file = process.argv[2];
const text = fs.readFileSync(file, 'utf8');
const start = text.indexOf('script     [');
if (start < 0) throw new Error('no script payload in dump');

// Walk the whole document counting brackets/braces from the opening `[`.
let depth = 0;
let end = -1;
for (let i = start + 'script     '.length; i < text.length; i += 1) {
  const ch = text[i];
  if (ch === '[' || ch === '{') depth += 1;
  else if (ch === ']' || ch === '}') {
    depth -= 1;
    if (depth === 0) {
      end = i + 1;
      break;
    }
  }
}
const data = JSON.parse(text.slice(start + 'script     '.length, end));

const VERT = process.argv.includes('--vertical');
if (VERT) {
  console.log('   w  sectBot frameBot contBot colBot ctaBot last');
  for (const r of data) {
    console.log(
      String(r.width).padStart(5),
      String(r.sectionBottom).padStart(7),
      String(r.frameBottom).padStart(8),
      String(r.containerBottom).padStart(8),
      String(r.columnBottom).padStart(6),
      String(r.ctaBottom).padStart(6),
      ' ',
      r.lastChildTag,
    );
  }
} else {
  console.log(
    'width  frameInset   padX(start/end)   padY(top/bot)   colGap L/R   eyebrowTop  ctasBot  ovf',
  );
  for (const r of data) {
    const cta = r.parts?.ctas ?? {};
    console.log(
      String(r.width).padStart(5),
      String(r.frameInsetL).padStart(9),
      (String(r.padStart) + '/' + String(r.padEnd)).padStart(15),
      (String(r.padTop) + '/' + String(r.padBottom)).padStart(15),
      (String(r.columnLeftGap) + '/' + String(r.columnRightGap)).padStart(11),
      String(r.parts?.eyebrow?.top ?? '-').padStart(10),
      String(cta.bottom ?? '-').padStart(8),
      String(r.overflowBy).padStart(4),
    );
  }
}