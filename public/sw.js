const CACHE_NAME = 'feeltong-running-shell-v2'
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/favicon.svg', '/pwa-icon.svg', '/pwa-maskable.svg']
const STATIC_DESTINATIONS = ['style', 'script', 'image', 'font', 'manifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(event.request.url)

  if (requestUrl.origin !== self.location.origin) {
    return
  }

  if (requestUrl.pathname.startsWith('/api')) {
    return
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/index.html')))
    return
  }

  if (!STATIC_DESTINATIONS.includes(event.request.destination)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached
      }

      return fetch(event.request).then((response) => {
        if (!response.ok || response.type !== 'basic') {
          return response
        }

        const cloned = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
        return response
      })
    }),
  )
})
