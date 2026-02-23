import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { router } from "./routes.tsx";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onOfflineReady() {
    console.log("Service worker is ready to handle offline functionality.");
  },
  onNeedRefresh() {
    const shouldReload = window.confirm(
      "New version available. Please click OK to refresh.",
    );
    if (shouldReload) {
      updateSW(true); // Update the SW and reload the page
    }
  },

  onRegisteredSW(swUrl, registration) {
    if (!registration) return;
    setInterval(async () => {
      try {
        // Do not check for updates if the SW is still installing
        if (registration.installing) return;

        // Do not check for updates if offline
        if ("onLine" in navigator && !navigator.onLine) return;

        // Manually fetch the SW script to check for updates, bypassing the cache
        const resp = await fetch(swUrl, {
          cache: "no-store",
          headers: {
            "cache-control": "no-cache",
          },
        });
        // If the response is OK, it means there's a new version of the SW available
        if (resp.status === 200) {
          await registration.update();
        }
      } catch (err) {
        console.error("SW periodic update check failed:", err);
      }
    }, 30 * 1000); // Check for updates every 30 seconds
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
      <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
    </QueryClientProvider>
  </StrictMode>,
);
