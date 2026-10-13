const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

// Compile modules in memory and isolate browser SDKs; never send real events.
function loader(globals = {}, mocks = {}) {
  const cache = new Map();
  function load(filename) {
    filename = path.resolve(filename);
    if (cache.has(filename)) return cache.get(filename);
    const exports = {};
    cache.set(filename, exports);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    vm.runInNewContext(code, {
      exports, URL, URLSearchParams, process, ...globals,
      require(name) {
        if (name in mocks) return mocks[name];
        if (name.startsWith('@/')) return load(`src/${name.slice(2)}.ts`);
        if (name.startsWith('.')) return load(path.resolve(path.dirname(filename), `${name}.ts`));
        throw new Error(`Unexpected module: ${name}`);
      },
    }, { filename });
    return exports;
  }
  return load;
}

test('sampling returns unique in-range indices, including zero and short lists', () => {
  const { randomGames } = loader()('src/utils/collections.ts');
  assert.equal(randomGames(0, 8).length, 0);
  assert.deepEqual(Array.from(randomGames(1, 8)), [0]);
  for (let n = 1; n < 30; n++) {
    const result = randomGames(n, 8);
    assert.equal(result.length, Math.min(n, 8));
    assert.equal(new Set(result).size, result.length);
    assert(result.every(i => i >= 0 && i < n));
  }
});
test('grouping does not consume the original dataset', () => {
  const { splitGames } = loader()('src/utils/collections.ts');
  const games = Object.freeze([1, 2, 3, 4, 5, 6, 7]);
  const result = splitGames(games);
  assert.equal(result.length, 2);
  assert.equal(result[1][0], 7);
  assert.equal(games.length, 7);
  assert.throws(() => splitGames(games, 0));
});
test('search queries and channel values are merged and encoded safely', () => {
  const { mergeQuery } = loader()('src/utils/query.ts');
  const value = mergeQuery('/search?q=car%20game#results', 'a&b', 'page=2');
  const url = new URL(value, 'https://example.com');
  assert.equal(url.searchParams.get('q'), 'car game');
  assert.equal(url.searchParams.get('channel'), 'a&b');
  assert.equal(url.searchParams.get('page'), '2');
  assert.equal(url.hash, '#results');
  assert.equal((value.match(/\?/g) || []).length, 1);
});
test('site config handles quoted domains and invalid input', () => {
  const { getSiteConfig, DEFAULT_SITE_URL } = loader()('src/config/site.ts');
  assert.equal(getSiteConfig(' "example.com" ').url, 'https://example.com');
  assert.equal(getSiteConfig('http://localhost:3000').hostname, 'localhost');
  assert.equal(getSiteConfig('http://[').url, DEFAULT_SITE_URL);
});
test('providers deduplicate per interaction and remain independent', () => {
  const events = [];
  const browser = { fbq: (...args) => events.push(['meta', ...args]), ttq: { track: (...args) => events.push(['tiktok', ...args]) } };
  const { createConversionState, trackAdConversion } = loader({ window: browser })('src/services/analytics.ts');
  const state = createConversionState();
  trackAdConversion(state); trackAdConversion(state);
  assert.equal(events.length, 2);
  assert.equal(events[0][2], 'Purchase');
  assert.equal(events[0][3].value, 0.2);
  assert.equal(events[0][3].currency, 'USD');
  browser.fbq = () => { throw new Error('blocked'); };
  const next = createConversionState();
  trackAdConversion(next);
  assert.equal(next.meta, false);
  assert.equal(next.tiktok, true);
});
test('Meta helper is safe without a browser or Pixel and rejects invalid amounts', () => {
  const { trackRevenue } = loader()('src/utils/meta-pixel.ts');
  assert.equal(trackRevenue({ value: 0.2, currency: 'USD' }), false);
  const calls = [];
  const track = loader({ window: { fbq: (...args) => calls.push(args) } })('src/utils/meta-pixel.ts').trackRevenue;
  assert.equal(track({ value: -1, currency: 'USD' }), false);
  assert.equal(track({ value: NaN, currency: 'USD' }), false);
  assert.equal(track({ value: 1, currency: 'usd' }), true);
  assert.equal(calls[0][2].currency, 'USD');
});
test('ad hook timing, double-trigger protection, and cleanup', () => {
  const listeners = new Map(); const timers = new Map(); let now = 0; let counter = 0; let cleanup; let focused = true;
  const events = [];
  const target = (prefix) => ({
    addEventListener: (name, callback) => listeners.set(prefix + name, callback),
    removeEventListener: (name) => listeners.delete(prefix + name),
  });
  const document = { ...target('document:'), visibilityState: 'hidden' };
  const window = { ...target('window:'), fbq: (...a) => events.push(['meta', ...a]), ttq: { track: (...a) => events.push(['tiktok', ...a]) } };
  const advance = (ms) => {
    const end = now + ms;
    while (true) {
      const next = [...timers].filter(([, t]) => t.time <= end).sort((a,b) => a[1].time-b[1].time)[0];
      if (!next) break;
      now = next[1].time; timers.delete(next[0]); next[1].fn();
    }
    now = end;
  };
  const load = loader({ window, document,
    setTimeout: (fn, ms) => { const id = ++counter; timers.set(id, { fn, time: now + ms }); return id; },
    clearTimeout: (id) => timers.delete(id),
  }, { react: { useEffect: (fn) => { cleanup = fn(); } }, '@/services/ad-interaction': { getFocusedAdFrame: () => focused ? {} : null } });
  load('src/hooks/useAdClickTracking.ts').useAdClickTracking();
  listeners.get('window:blur')(); advance(100); listeners.get('document:visibilitychange')();
  advance(499); assert.equal(events.length, 0); advance(1); assert.equal(events.length, 2);
  listeners.get('window:beforeunload')(); assert.equal(events.length, 2);
  listeners.get('window:blur')(); advance(301); listeners.get('document:visibilitychange')(); advance(600);
  assert.equal(events.length, 2);
  focused = false; cleanup(); assert.equal(listeners.size, 0); assert.equal(timers.size, 0);
});
test('legacy Japanese data fields normalize without changing the source', () => {
  const { normalizeGame } = loader()('src/services/normalize-game.ts');
  const raw = { id: '42', name: 'Game', description: '', instructions: '', gameUrl: 'https://example.com', thumb: '/thumb.jpg', category: 2 };
  const game = normalizeGame(raw);
  assert.equal(game.image, '/thumb.jpg'); assert.equal(game.categoryId, 2);
  assert.equal(raw.image, undefined); assert.equal(raw.categoryId, undefined);
});
