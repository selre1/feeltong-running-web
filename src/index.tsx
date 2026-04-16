import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import Skeleton from "./components/Skeleton";

import "./index.css";

const App = () => <Skeleton />;

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <Router>
    <App />
  </Router>
);

const SW_CACHE_PREFIX = "feeltong-running-shell-";

if ("serviceWorker" in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Ignore registration failures in unsupported environments.
      });
    });
  } else {
    window.addEventListener("load", () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // Ignore cleanup failures in dev.
          });
        });
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys
            .filter((key) => key.startsWith(SW_CACHE_PREFIX))
            .forEach((key) => {
              caches.delete(key).catch(() => {
                // Ignore cleanup failures in dev.
              });
            });
        });
      }
    });
  }
}
