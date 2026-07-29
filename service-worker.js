"use strict";
const CACHE = "saijo-actual-nearby-spots-v3";
const SHELL = [
  "./", "./index.html", "./map.html", "./guide.html", "./products.html", "./nearby.html",
  "./common.css", "./pages.css", "./style.css", "./site.js", "./app.js",
  "./offline.html", "./manifest.webmanifest", "./assets/saijo-logo.webp", "./assets/home-main.webp", "./assets/favicon-64.png", "./assets/apple-touch-icon.png", "./assets/icon-192.png", "./assets/icon-512.png",
  "./assets/kurara.webp", "./assets/yume-town-higashihiroshima.webp", "./assets/higashihiroshima-museum.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request)
      .then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(async () => (await caches.match(event.request)) || caches.match("./offline.html")));
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => cached || Response.error());
    return cached || network;
  }));
});
