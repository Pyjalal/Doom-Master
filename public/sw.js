// Network-first SW. Cache-first was serving stale hashed JS after rebuilds
// and left the app stuck on the splash screen.
const CACHE_NAME = 'doom-master-v3';
const PRECACHE_URLS = [
  './',
  './index.html',
  './fonts/JetBrainsMono-Regular.woff2',
  './fonts/JetBrainsMono-Bold.woff2',
  './fonts/JetBrainsMono-ExtraBold.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => { }))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // Never cache Vite/dev or hashed build assets — always hit network.
  const isAsset =
    url.pathname.includes('/assets/') ||
    url.pathname.includes('/src/') ||
    url.pathname.includes('/node_modules/') ||
    url.pathname.includes('/@') ||
    /\.(js|css|mjs|map)$/i.test(url.pathname);

  if (isAsset || req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Only cache successful navigations / html for offline fallback.
          if (res.ok && (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/'))) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Fonts / static: cache-first is fine (stable filenames).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});
