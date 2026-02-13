const CACHE_NAME = 'maldives-genealogy-v9';

const CORE_ASSETS = [
  './',
  './index.html',
  './apps/web/dist/assets/main.js',
  './apps/web/dist/assets/index.css',
  './docs/offline-research-archive.json'
];

const EXTERNAL_ASSETS = [
  'https://cdn.jsdelivr.net/npm/d3@7/+esm',
  'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1/+esm',
  'https://cdn.jsdelivr.net/npm/gsap@3/+esm',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=JetBrains+Mono:wght@400;600&family=Noto+Sans+Thaana:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap'
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
