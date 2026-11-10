/* Service worker: makes the app installable and lets it open instantly.
   It caches only the app shell (this page, icons, the pinned supabase-js script).
   Task data comes from Supabase and is never cached here. */
const CACHE = 'pd-shell-v1';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never touch Supabase (data, sign-in, realtime) or anything else cross-origin except the pinned script.
  const isShell = url.origin === self.location.origin;
  const isLib = url.origin === 'https://cdn.jsdelivr.net' && url.pathname.indexOf('/npm/@supabase/supabase-js@') === 0;
  if (!isShell && !isLib) return;

  if (isLib) {
    // Pinned version: cache-first.
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }))
    );
    return;
  }

  // App shell: network first so updates show up, cache as the offline fallback.
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
