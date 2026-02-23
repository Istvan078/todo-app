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
    console.log("New version is ready.");
    const shouldReload = window.confirm(
      "New version available. Please click OK to refresh.",
    );
    if (shouldReload) {
      updateSW(); // Re-register the service worker to get the new version
    }
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
