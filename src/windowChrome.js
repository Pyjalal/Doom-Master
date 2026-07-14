/** Desktop window helpers (Tauri). Reliable fullscreen for frameless Windows. */

const BG = '#1a1b26'

let localFullscreen = false
let wasMaximizedBeforeFs = false

export function isDesktop() {
  return typeof window !== 'undefined' && !!window.__TAURI_INTERNALS__
}

async function getWin() {
  const { getCurrentWebviewWindow } = await import('@tauri-apps/api/webviewWindow')
  return getCurrentWebviewWindow()
}

async function paintBg(win) {
  try { await win.setBackgroundColor(BG) } catch { }
}

/**
 * Toggle real exclusive fullscreen.
 * On Windows frameless windows, entering FS while maximized leaves a white/black
 * strip — so we unmaximize first, then setFullscreen.
 * @returns {Promise<boolean>} new fullscreen state
 */
export async function toggleDesktopFullscreen() {
  const win = await getWin()

  // Prefer tracked state; fall back to native (can be flaky on frameless)
  let currentlyFs = localFullscreen
  try {
    currentlyFs = localFullscreen || (await win.isFullscreen())
  } catch { }

  if (currentlyFs) {
    try { await win.setFullscreen(false) } catch { }
    localFullscreen = false
    if (wasMaximizedBeforeFs) {
      try { await win.maximize() } catch { }
    }
    wasMaximizedBeforeFs = false
    await paintBg(win)
    try { await win.setFocus() } catch { }
    return false
  }

  // Enter fullscreen
  wasMaximizedBeforeFs = false
  try { wasMaximizedBeforeFs = await win.isMaximized() } catch { }

  if (wasMaximizedBeforeFs) {
    try { await win.unmaximize() } catch { }
    // Brief settle so HWND is not in maximized state when FS kicks in
    await new Promise((r) => setTimeout(r, 16))
  }

  try {
    await win.setFullscreen(true)
  } catch {
    // Fallback: if exclusive FS fails, maximize instead of leaving a tiny window
    try { await win.maximize() } catch { }
    localFullscreen = false
    wasMaximizedBeforeFs = false
    await paintBg(win)
    return false
  }

  localFullscreen = true
  await paintBg(win)
  try { await win.setFocus() } catch { }
  return true
}

export async function syncFullscreenState() {
  if (!isDesktop()) return false
  try {
    const win = await getWin()
    const fs = await win.isFullscreen()
    localFullscreen = fs
    return fs
  } catch {
    return localFullscreen
  }
}

export function getLocalFullscreen() {
  return localFullscreen
}
