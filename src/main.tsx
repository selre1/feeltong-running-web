import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const SW_CACHE_PREFIX = 'feeltong-running-shell-'

if ('serviceWorker' in navigator) {
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore registration failures in unsupported environments.
      })
    })
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // Ignore cleanup failures in dev.
          })
        })
      })

      if ('caches' in window) {
        caches.keys().then((keys) => {
          keys
            .filter((key) => key.startsWith(SW_CACHE_PREFIX))
            .forEach((key) => {
              caches.delete(key).catch(() => {
                // Ignore cleanup failures in dev.
              })
            })
        })
      }
    })
  }
}
