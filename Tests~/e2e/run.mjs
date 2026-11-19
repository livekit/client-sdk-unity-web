#!/usr/bin/env node
// Serves a Unity WebGL build, opens it in headless Chromium with LiveKit tokens in the query string,
// and turns the player's "[E2E] PASS|FAIL ..." console lines into an exit code.
//
//   node run.mjs <path-to-webgl-build>
//
// Env: LIVEKIT_URL (ws://localhost:7880), LIVEKIT_API_KEY (devkey), LIVEKIT_API_SECRET (secret),
//      E2E_TIMEOUT_MS (300000), E2E_PORT (8080)
import { createServer } from 'node:http';
import { appendFile, readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { chromium } from 'playwright';
import { AccessToken } from 'livekit-server-sdk';

if (!process.argv[2]) {
  console.error('usage: node run.mjs <path-to-webgl-build>');
  process.exit(2);
}

const buildDir = resolve(process.argv[2]);
const livekitUrl = process.env.LIVEKIT_URL ?? 'ws://localhost:7880';
const apiKey = process.env.LIVEKIT_API_KEY ?? 'devkey';
const apiSecret = process.env.LIVEKIT_API_SECRET ?? 'secret';
const timeoutMs = Number(process.env.E2E_TIMEOUT_MS ?? 300_000);
const port = Number(process.env.E2E_PORT ?? 8080);

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.wasm': 'application/wasm',
  '.data': 'application/octet-stream',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function serve() {
  const server = createServer(async (req, res) => {
    let file = normalize(join(buildDir, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (file !== buildDir && !file.startsWith(buildDir + sep)) return res.writeHead(403).end();
    try {
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

// Identities must match E2ERunner.cs.
function token(identity, room) {
  const at = new AccessToken(apiKey, apiSecret, { identity, ttl: '15m' });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true });
  return at.toJwt();
}

const room = `e2e-${Date.now()}`;
const params = new URLSearchParams({
  url: livekitUrl,
  room,
  tokenA: await token('unity-a', room),
  tokenB: await token('unity-b', room),
});

const server = await serve();
const browser = await chromium.launch({
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--autoplay-policy=no-user-gesture-required',
    // Unity needs a WebGL context; headless CI runners only have SwiftShader.
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
const page = await browser.newPage();

const results = [];
let finish;
const finished = new Promise((ok) => (finish = ok));
const timer = setTimeout(() => finish('timeout'), timeoutMs);

page.on('console', (msg) => {
  const text = msg.text();
  console.log(`[browser:${msg.type()}] ${text}`);
  const m = text.match(/\[E2E\] (PASS|FAIL) (\S+) ([\d.]+)s(?: :: ([^\n]*))?/);
  if (m) results.push({ ok: m[1] === 'PASS', name: m[2], seconds: m[3], error: m[4] ?? '' });
  if (text.includes('[E2E] DONE')) finish('done');
});
page.on('pageerror', (err) => console.log(`[browser:pageerror] ${err.message}`));
page.on('crash', () => finish('crash'));

console.log(`Serving ${buildDir} on :${port}, LiveKit ${livekitUrl}, room ${room}`);
await page.goto(`http://localhost:${port}/index.html?${params}`);
const outcome = await finished;
clearTimeout(timer);
await browser.close();
server.close();

const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;

console.log('\n==== WebGL E2E results ====');
for (const r of results) console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name} (${r.seconds}s)${r.error ? `  ${r.error}` : ''}`);
if (outcome !== 'done') console.log(`Runner stopped early: ${outcome} (player never logged "[E2E] DONE")`);
console.log(`${passed} passed, ${failed} failed`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map((r) => `| ${r.ok ? '✅' : '❌'} | ${r.name} | ${r.seconds}s | ${r.error.replaceAll('|', '\\|')} |`);
  const md = [
    '## WebGL E2E',
    outcome !== 'done' ? `\n:boom: Runner stopped early: **${outcome}**. Check the "Run E2E tests" logs.\n` : '',
    '| | Test | Time | Error |',
    '|---|---|---|---|',
    ...rows,
    '',
    `**${passed} passed, ${failed} failed**`,
    '',
  ];
  await appendFile(process.env.GITHUB_STEP_SUMMARY, md.join('\n'));
}

process.exit(outcome === 'done' && failed === 0 && passed > 0 ? 0 : 1);
