const CACHE_NAME = "creator-manifestation-v33";
const APP_SHELL = [
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(fetch(event.request, { cache: "reload" }).catch(() => caches.match("./manifestation-system.html")));
    return;
  }
  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(response => {
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
