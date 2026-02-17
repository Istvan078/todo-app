/// <reference lib="webworker" />

import {
  cleanupOutdatedCaches,
  precacheAndRoute,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute, NavigationRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;

// 1) Régi (kiselejtezett) cache-ek takarítása
cleanupOutdatedCaches();

// 2) Build fájlok precache-elése (ezt a listát a plugin injektálja)
precacheAndRoute(self.__WB_MANIFEST);

// 3) SW lifecycle: gyorsabb aktiválás + azonnal átvegye az irányítást
self.skipWaiting();
clientsClaim();

/**
 * 4) SPA offline támogatás (App Shell):
 * Navigációs kéréseknél (amikor a user URL-t nyit) adja vissza az index.html-t,
 * így offline is betölt a React app, ha már járt nálad egyszer.
 *
 * Ha nem rooton szolgálod ki (pl. /app/), akkor a "/index.html" helyett a base path-ot kell.
 */
registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")));

// 5) Runtime caching szabályok

// 5a) JS/CSS: gyors betöltés, háttérben frissít (stale-while-revalidate)
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "assets",
  }),
);

// 5b) Képek: cache-first + lejárat
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 80,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 nap
      }),
    ],
  }),
);

// 5c) API (GET): network-first (offline esetén cache), timeouttal
registerRoute(
  ({ url, request }) =>
    request.method === "GET" && url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 perc
      }),
    ],
  }),
);

// 6) PUSH: értesítés megjelenítése
self.addEventListener("push", (event) => {
  const data = event.data ? safeJson(event.data) : {};
  const title = data.title ?? "Új értesítés";

  const options: NotificationOptions = {
    body: data.body ?? "",
    icon: data.icon ?? "/pwa-192x192.png",
    badge: data.badge ?? "/pwa-192x192.png",
    data: {
      url: data.url ?? "/",
      // bármi extra ide jöhet
    },
    // tag: "some-tag", // ha akarod csoportosítani / felülírni
    // requireInteraction: true, // ha azt akarod, hogy ne tűnjön el automatikusan (nem mindenhol támogatott)
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 7) Notification click: fókuszálás / megnyitás
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = (event.notification.data as any)?.url ?? "/";

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      // ha már nyitva van egy tab az appból, fókuszáljuk
      for (const client of allClients) {
        // egyszerű check: ha ugyanazon az originön van, fókuszáljuk és navigálunk
        // (szigoríthatod, ha konkrét route-ot akarsz)
        if ("focus" in client) {
          await (client as WindowClient).focus();
          try {
            await (client as WindowClient).navigate(url);
          } catch {
            // néha navigate tiltott lehet; ilyenkor nyitunk új ablakot
            await self.clients.openWindow(url);
          }
          return;
        }
      }

      // ha nincs nyitva, nyissunk újat
      await self.clients.openWindow(url);
    })(),
  );
});

// --- helpers ---
function safeJson(data: PushMessageData) {
  try {
    return data.json();
  } catch {
    // ha nem JSON payload jön, próbáljuk szövegként
    try {
      return { body: data.text() };
    } catch {
      return {};
    }
  }
}
