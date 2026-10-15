/**
 * ============================================================================
 * IMPORT RESOLVER
 * ============================================================================
 *
 * A previous bulk edit mangled relative specifiers (directory segments were
 * dropped). Rather than hand-patching dozens of files, this walks every
 * relative import in src/ and repairs it deterministically:
 *
 *   1. If the specifier already resolves to a real file, leave it alone.
 *   2. Otherwise, take its BASENAME and search src/ for a matching file.
 *      Exactly one match -> rewrite to the correct relative path.
 *      Multiple matches -> pick the closest by directory affinity.
 *      No match       -> report it for manual attention.
 *
 * Deterministic and idempotent — safe to re-run.
 *
 * Run with: node scripts/fix-imports.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const SRC = 'src';

/** All files under src/, by basename (basename -> [full paths]). */
function indexFiles() {
  const byBase = new Map();

  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(jsx?|mjs)$/.test(name)) continue;
      const list = byBase.get(name) ?? [];
      list.push(full.replace(/\\/g, '/'));
      byBase.set(name, list);
    }
  };

  walk(SRC);
  return byBase;
}

/**
 * Score a candidate by shared path segments with the importing file's
 * directory. Higher is better; used to break ties sensibly.
 */
function affinity(importerDir, candidatePath) {
  const a = importerDir.split('/').filter(Boolean);
  const b = candidatePath.split('/').filter(Boolean);
  let score = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    if (a[i] === b[i]) score += 1;
  }
  // Prefer siblings within the same top-level folder.
  if (a[0] === b[0]) score += 2;
  return score;
}

const IMPORT_RE = /(from\s+['"])(\.[^'"]*)(['"])/g;

function fixFile(file, byBase) {
  const original = readFileSync(file, 'utf8');
  const fileDir = dirname(file).replace(/\\/g, '/');
  const unresolved = [];

  const next = original.replace(IMPORT_RE, (match, head, spec, tail) => {
    if (existsSync(resolve(fileDir, spec))) return match;

    const base = spec.split('/').pop();
    const candidates = byBase.get(base) ?? [];
    if (candidates.length === 0) {
      unresolved.push(spec);
      return match;
    }

    const best = candidates
      .map((c) => ({ c, score: affinity(fileDir, c) }))
      .sort((x, y) => y.score - x.score)[0].c;

    let relPath = relative(fileDir, best).replace(/\\/g, '/');
    if (!relPath.startsWith('.')) relPath = `./${relPath}`;

    return `${head}${relPath}${tail}`;
  });

  if (next !== original) writeFileSync(file, next);
  return unresolved;
}

const byBase = indexFiles();
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.jsx?$/.test(name)) files.push(full.replace(/\\/g, '/'));
  }
})(SRC);

let fixed = 0;
const problems = [];

for (const file of files) {
  const before = readFileSync(file, 'utf8');
  const unresolved = fixFile(file, byBase);
  if (readFileSync(file, 'utf8') !== before) {
    fixed += 1;
    console.log('  fixed', file);
  }
  unresolved.forEach((s) => problems.push(`${file}: ${s}`));
}

console.log(`\nRepaired imports in ${fixed} file(s).`);
if (problems.length) {
  console.log('\nCould not resolve automatically:');
  problems.forEach((p) => console.log('  ', p));
} else {
  console.log('All relative imports resolve.');
}

void sep;