const SHELL_CACHE = 'dev-gaming-shell-v1';
const ASSET_CACHE = 'dev-gaming-assets-v1';
const SHELL_FILES = [
    '/index.html',
    '/style.css?v=5',
    '/app.js?v=4',
    '/assets/logo.svg?v=3',
    '/assets/marketplace-scene.svg?v=3'
];
const MAX_CACHED_ASSETS = 50;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE)
            .then((cache) => cache.addAll(SHELL_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => Promise.all(cacheNames
                .filter((name) => name.startsWith('dev-gaming-') && ![SHELL_CACHE, ASSET_CACHE].includes(name))
                .map((name) => caches.delete(name))))
            .then(() => self.clients.claim())
    );
});

function refreshCachedRequest(event, cacheName, maxEntries) {
    const request = event.request;
    const update = fetch(request).then(async (response) => {
        if (response.ok && response.type === 'basic') {
            const cache = await caches.open(cacheName);
            await cache.put(request, response.clone());
            if (maxEntries) {
                const entries = await cache.keys();
                await Promise.all(entries.slice(0, Math.max(0, entries.length - maxEntries))
                    .map((entry) => cache.delete(entry)));
            }
        }
        return response;
    });

    event.waitUntil(update.then(() => undefined).catch(() => undefined));
    event.respondWith(
        caches.open(cacheName)
            .then((cache) => cache.match(request))
            .then((cached) => cached || update)
    );
}

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        const network = fetch(request).then(async (response) => {
            if (response.ok) {
                const cache = await caches.open(SHELL_CACHE);
                await cache.put('/index.html', response.clone());
            }
            return response;
        });
        event.waitUntil(network.then(() => undefined).catch(() => undefined));
        event.respondWith(network.catch(async () => (await caches.match('/index.html')) || Response.error()));
        return;
    }

    if (url.pathname.startsWith('/assets/')) {
        refreshCachedRequest(event, ASSET_CACHE, MAX_CACHED_ASSETS);
        return;
    }

    if (url.pathname === '/index.html' || url.pathname === '/style.css' || url.pathname === '/app.js') {
        refreshCachedRequest(event, SHELL_CACHE);
    }
});
