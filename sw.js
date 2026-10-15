// Leerpuls service worker: maakt de app installeerbaar en laat hem ook bij slecht bereik openen.
// Altijd eerst het netwerk (dus altijd de nieuwste versie), alleen bij geen internet uit de cache.
// Verzoeken naar Supabase, AI en andere sites worden niet aangeraakt.
const CACHE = 'leerpuls-v1';
const SHELL = ['./', './index.html', './config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './index.html' : req, copy)).catch(() => {});
      }
      return res;
    } catch {
      const hit = await caches.match(req.mode === 'navigate' ? './index.html' : req, { ignoreSearch: req.mode === 'navigate' });
      return hit || (await caches.match('./index.html')) || Response.error();
    }
  })());
});
