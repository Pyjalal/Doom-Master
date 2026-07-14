import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createVim, handleKey, getText } from '../engine/vim'
import { sfx } from '../sound'
import { Icon } from '../icons'

const IGNORED = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12']

export default function VimEditor({ start, startCursor, onChange, focusSignal }) {
  const [vim, setVim] = useState(() => {
    const v = createVim(start)
    if (startCursor) { v.row = startCursor.row; v.col = startCursor.col }
    return v
  })
  const [lastKeys, setLastKeys] = useState([])
  const ref = useRef(null)
  const [focused, setFocused] = useState(false)

  const reset = useCallback(() => {
    const v = createVim(start)
    if (startCursor) { v.row = startCursor.row; v.col = startCursor.col }
    setVim(v)
    setLastKeys([])
    onChange && onChange(v)
    ref.current && ref.current.focus()
  }, [start, startCursor, onChange])

  useEffect(() => { reset() }, [start])
  useEffect(() => { if (focusSignal) ref.current && ref.current.focus() }, [focusSignal])

  const onKeyDown = (e) => {
    if (IGNORED.includes(e.key)) return
    if (e.ctrlKey || e.metaKey || e.altKey) return
    e.preventDefault()
    sfx.tick()
    const next = handleKey(vim, e.key)
    setVim(next)
    setLastKeys((ks) => [...ks.slice(-11), displayKey(e.key)])
    onChange && onChange(next)
  }

  const modeLabel = { normal: 'NORMAL', insert: 'INSERT', visual: 'VISUAL', 'visual-line': 'V-LINE' }[vim.mode]

  return (
    <div className={`vim-editor ${focused ? 'focused' : ''}`}>
      <div
        className="vim-buffer" tabIndex={0} ref={ref}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      >
        {vim.lines.map((line, r) => (
          <div className="vim-line" key={r}>
            <span className="vim-lnum">{r + 1}</span>
            <span className="vim-text">{renderLine(vim, line, r)}</span>
          </div>
        ))}
        {!focused && <div className="vim-focus-hint">click here, then type Vim keys</div>}
      </div>
      {vim.cmdline && (
        <div className="vim-cmdline">
          {vim.cmdline.type}{vim.cmdline.text}<span className="vim-cmdline-cursor">▌</span>
        </div>
      )}
      {!vim.cmdline && vim.lastMessage && <div className="vim-message">{vim.lastMessage}</div>}
      <div className={`vim-status mode-${vim.mode}`}>
        <span className="vim-mode">{modeLabel}</span>
        {vim.recording && <span className="vim-recording">● @{vim.recording.reg}</span>}
        <span className="vim-pending">{vim.count}{vim.pending === 'qreg' ? 'q' : vim.pending}{vim.useReg ? `"${vim.useReg}` : ''}</span>
        <span className="vim-keys">{lastKeys.join(' ')}</span>
        <span className="vim-strokes"><Icon name="keyboard" size={14} /> {vim.keystrokes}</span>
        <button className="vim-reset" onClick={reset} title="Reset (does not count keystrokes)"><Icon name="reset" size={14} /> reset</button>
      </div>
    </div>
  )
}

function inVisual(vim, r, c) {
  if (vim.mode !== 'visual' && vim.mode !== 'visual-line') return false
  let { vrow, vcol, row, col } = vim
  let sr = vrow, sc = vcol, er = row, ec = col
  if (sr > er || (sr === er && sc > ec)) { [sr, sc, er, ec] = [er, ec, sr, sc] }
  if (r < sr || r > er) return false
  if (vim.mode === 'visual-line') return true
  if (sr === er) return c >= sc && c <= ec
  if (r === sr) return c >= sc
  if (r === er) return c <= ec
  return true
}

function renderLine(vim, line, r) {
  const chars = line.length ? line.split('') : []
  const cells = chars.map((ch, c) => {
    const cursor = r === vim.row && c === vim.col
    const vis = inVisual(vim, r, c)
    return (
      <span key={c} className={`${cursor ? 'vim-cursor' : ''} ${vis ? 'vim-visual' : ''}`}>
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    )
  })
  if (r === vim.row && vim.col >= line.length) {
    cells.push(<span key="eol" className="vim-cursor">{'\u00A0'}</span>)
  }
  return cells
}

function displayKey(k) {
  if (k === 'Escape') return '⎋'
  if (k === 'Enter') return '⏎'
  if (k === 'Backspace') return '⌫'
  if (k === ' ') return '␣'
  return k
}

export { getText }
