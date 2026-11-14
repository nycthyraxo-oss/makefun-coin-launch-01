// MakeFun Ghost — makefun-coin-launch-01 entry (Node 22, standard library only).
//
// Copies LAUNCH.json from the repository root to /output/LAUNCH.json, where
// the gate reads it. That is all the program has to do: the coin itself is
// launched by the agent, and LAUNCH.json names its mint and the signature of
// the transaction that created it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'LAUNCH.json');
const target = join(OUTPUT_DIR, 'LAUNCH.json');

const bytes = readFileSync(source);
const launch = JSON.parse(bytes.toString('utf8'));
if (typeof launch !== 'object' || launch === null || typeof launch.mint !== 'string' || typeof launch.create_signature !== 'string') {
  console.error('LAUNCH.json is not an object with mint and create_signature strings');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(target, bytes);

// Round-trip check: what the gate reads must be byte-identical to the
// repository's file, so the two grading runs can never disagree.
const written = readFileSync(target);
if (!written.equals(bytes)) {
  console.error('LAUNCH.json was not copied byte-identically');
  process.exit(1);
}
