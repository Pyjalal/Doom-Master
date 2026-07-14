import React, { useEffect, useState, useCallback } from 'react'
import { Icon } from '../icons'
import { isDesktop, toggleDesktopFullscreen, syncFullscreenState } from '../windowChrome'

const isTauri = () => isDesktop()

const RESIZE_EDGES = [
  'North', 'South', 'East', 'West',
  'NorthEast', 'NorthWest', 'SouthEast', 'SouthWest',
]

async function getWin() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  return getCurrentWindow()
}

export default function TitleBar() {
  const [active, setActive] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    if (!isTauri()) return
    setActive(true)
    document.documentElement.classList.add('tauri-app')
    let unlistenResize
    ;(async () => {
      try {
        const win = await getWin()
        setMaximized(await win.isMaximized())
        setFullscreen(await syncFullscreenState())
        unlistenResize = await win.onResized(async () => {
          try {
            setMaximized(await win.isMaximized())
            setFullscreen(await syncFullscreenState())
          } catch { }
        })
      } catch { }
    })()
    return () => {
      document.documentElement.classList.remove('tauri-app')
      if (unlistenResize) unlistenResize()
    }
  }, [])

  const drag = useCallback(async (e) => {
    if (!active || e.button !== 0) return
    if (e.target.closest('button, a, input, select, textarea')) return
    try {
      const win = await getWin()
      await win.startDragging()
    } catch { }
  }, [active])

  const onTitleDblClick = useCallback(async () => {
    if (!active) return
    try {
      const win = await getWin()
      await win.toggleMaximize()
      setMaximized(await win.isMaximized())
    } catch { }
  }, [active])

  const startResize = useCallback(async (direction) => {
    if (!active || maximized || fullscreen) return
    try {
      const win = await getWin()
      await win.startResizeDragging(direction)
    } catch { }
  }, [active, maximized, fullscreen])

  const minimize = async () => {
    try { await (await getWin()).minimize() } catch { }
  }
  const toggleMax = async () => {
    try {
      const win = await getWin()
      await win.toggleMaximize()
      setMaximized(await win.isMaximized())
    } catch { }
  }
  const toggleFs = async () => {
    try {
      const next = await toggleDesktopFullscreen()
      setFullscreen(next)
      const win = await getWin()
      setMaximized(await win.isMaximized().catch(() => false))
    } catch { }
  }
  const close = async () => {
    try { await (await getWin()).close() } catch { }
  }

  if (!active) return null

  return (
    <>
      <div className="titlebar" onMouseDown={drag} onDoubleClick={onTitleDblClick}>
        <div className="titlebar-left">
          <Icon name="skull" size={16} className="titlebar-icon" />
          <span className="titlebar-title">DOOM MASTER</span>
        </div>
        <div className="titlebar-drag" data-tauri-drag-region />
        <div className="titlebar-controls">
          <button type="button" className="titlebar-btn" title={fullscreen ? 'Exit fullscreen (F11)' : 'Fullscreen (F11)'} onClick={toggleFs}>
            <Icon name={fullscreen ? 'minimize2' : 'maximize2'} size={14} />
          </button>
          <button type="button" className="titlebar-btn" title="Minimize" onClick={minimize}>
            <Icon name="minus" size={14} />
          </button>
          <button type="button" className="titlebar-btn" title={maximized ? 'Restore' : 'Maximize'} onClick={toggleMax}>
            <Icon name={maximized ? 'copy' : 'square'} size={13} />
          </button>
          <button type="button" className="titlebar-btn titlebar-close" title="Close" onClick={close}>
            <Icon name="x" size={14} />
          </button>
        </div>
      </div>
      {!maximized && !fullscreen && RESIZE_EDGES.map((dir) => (
        <div
          key={dir}
          className={`resize-handle resize-${dir.toLowerCase()}`}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            startResize(dir)
          }}
        />
      ))}
    </>
  )
}
