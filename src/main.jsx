import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureServiceWorker } from './platform'
import './styles.css'

function hideBoot() {
  const boot = document.getElementById('boot')
  if (!boot) return
  boot.classList.add('done')
  setTimeout(() => boot.remove(), 220)
}

// Show native window immediately — splash is already painted in HTML.
// Also paint window/webview native bg so fullscreen never flashes white.
if (window.__TAURI_INTERNALS__) {
  document.documentElement.classList.add('tauri-app')
  import('@tauri-apps/api/webviewWindow')
    .then(async ({ getCurrentWebviewWindow }) => {
      const win = getCurrentWebviewWindow()
      try { await win.setBackgroundColor('#1a1b26') } catch { }
      try { await win.show() } catch { }
    })
    .catch(() => {
      import('@tauri-apps/api/window')
        .then(({ getCurrentWindow }) => getCurrentWindow().show())
        .catch(() => { })
    })
}

const rootEl = document.getElementById('root')
try {
  ReactDOM.createRoot(rootEl).render(<App />)
} catch (err) {
  rootEl.innerHTML = `<pre style="color:#f7768e;padding:20px;font-family:monospace;white-space:pre-wrap">Failed to start: ${err?.message || err}</pre>`
  hideBoot()
  throw err
}

// Fade splash after first React paint (and as a safety timeout).
requestAnimationFrame(() => {
  requestAnimationFrame(hideBoot)
})
setTimeout(hideBoot, 2500)

  // Auto-hide scrollbar: show while scrolling (or near right edge), hide after idle.
  ; (() => {
    let hideTimer = 0
    const show = () => {
      document.body.classList.add('is-scrolling')
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling')
      }, 900)
    }
    window.addEventListener('scroll', show, { passive: true, capture: true })
    document.addEventListener('scroll', show, { passive: true, capture: true })
    // Reveal when pointer is near the scrollbar gutter so it can still be grabbed.
    window.addEventListener('mousemove', (e) => {
      const nearEdge = window.innerWidth - e.clientX < 18
      document.body.classList.toggle('is-scroll-hover', nearEdge)
      if (nearEdge) show()
    }, { passive: true })
  })()

if ('serviceWorker' in navigator) {
  configureServiceWorker({
    isTauri: Boolean(window.__TAURI_INTERNALS__),
    serviceWorker: navigator.serviceWorker,
    cacheStorage: window.caches,
  }).catch(() => { })
}
