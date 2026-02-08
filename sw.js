const CACHE_NAME = 'maldives-genealogy-v7';

const CORE_ASSETS = [
  './',
  './index.html',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/graph.css',
  './css/search.css',
  './css/tooltip.css',
  './css/animations.css',
  './css/onboarding.css',
  './docs/offline-research-archive.json',
  './src/main.js',
  './src/state.js',
  './src/utils/css.js',
  './src/utils/dynasties.js',
  './src/utils/format.js',
  './src/graph/filter.js',
  './src/graph/highlight.js',
  './src/graph/pathfinder.js',
  './src/graph/rebuild.js',
  './src/graph/relationships.js',
  './src/ui/commandbar.js',
  './src/ui/command-palette.js',
  './src/ui/compare.js',
  './src/ui/history.js',
  './src/ui/hover-card.js',
  './src/ui/i18n.js',
  './src/ui/keyboard-nav.js',
  './src/ui/minimap.js',
  './src/ui/modal.js',
  './src/ui/navigation.js',
  './src/ui/exporter.js',
  './src/ui/onboarding.js',
  './src/ui/search.js',
  './src/ui/search-engine.js',
  './src/ui/sidebar.js',
  './src/ui/storytrails.js',
  './src/ui/theme.js',
  './src/ui/timeline-viz.js',
  './src/ui/viewstate.js',
  './src/data/era-events.js',
  './src/data/geo.js',
  './src/data/offices.js',
  './src/data/profile.enrichments.js',
  './src/data/sources.js',
  './src/data/storytrails.js',
  './src/data/timeline.js',
  './src/data/sovereigns.js',
  './src/data/sovereigns.core.js',
  './src/data/sovereigns.merge.js',
  './src/data/sovereigns.promoted.js',
  './src/data/sovereigns.research.js'
];

const EXTERNAL_ASSETS = [
  'https://cdn.jsdelivr.net/npm/d3@7/+esm',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=JetBrains+Mono:wght@400;600&family=Source+Sans+3:wght@400;500;600;700&display=swap'
];

function cacheableResponse(response) {
  return Boolean(response && (response.ok || response.type === 'opaque'));
}

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await Promise.all(EXTERNAL_ASSETS.map(url => cache.add(url).catch(() => null)));
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const runtimeAllowed = sameOrigin ||
    url.origin === 'https://cdn.jsdelivr.net' ||
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com';
  if (!runtimeAllowed) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) {
      event.waitUntil((async () => {
        try {
          const fresh = await fetch(req);
          if (cacheableResponse(fresh)) await cache.put(req, fresh.clone());
        } catch {
          // Ignore background refresh failures.
        }
      })());
      return cached;
    }

    try {
      const response = await fetch(req);
      if (cacheableResponse(response)) await cache.put(req, response.clone());
      return response;
    } catch (err) {
      if (req.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
