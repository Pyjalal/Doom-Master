import React, { useState, useCallback } from 'react'
import VimEditor from './VimEditor'
import Markdown from './Markdown'
import { getText } from '../engine/vim'
import { sfx } from '../sound'
import { Icon } from '../icons'

// Handles both `drill` and `golf` lesson types.
export default function Drill({ lesson, isGolf, onComplete, completed, bestScore }) {
  const d = lesson.drill
  const [solved, setSolved] = useState(false)
  const [strokes, setStrokes] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [gold, setGold] = useState(false)

  const check = useCallback((vim) => {
    setStrokes(vim.keystrokes)
    let ok = false
    if (d.target !== undefined) {
      ok = getText(vim) === d.target
      if (ok && d.requireNormal && vim.mode !== 'normal') ok = false
      if (ok && d.cursorAlso && (vim.row !== d.cursorAlso.row || vim.col !== d.cursorAlso.col)) ok = false
    } else if (d.cursorGoal) {
      ok = vim.row === d.cursorGoal.row && vim.col === d.cursorGoal.col && vim.mode === 'normal'
    }
    if (ok) {
      setSolved(true)
      const isGold = vim.keystrokes <= d.par
      setGold(isGold)
      if (isGold) sfx.medal(); else sfx.success()
      onComplete({
        strokes: vim.keystrokes,
        flags: { dot: vim.usedDot, macro: vim.usedMacro, ex: vim.usedEx, search: vim.usedSearch },
      })
    } else {
      setSolved(false)
      setGold(false)
    }
  }, [d, onComplete])

  const medal = (s) => (s <= d.par ? 'GOLD' : s <= d.par + 4 ? 'SILVER' : 'BRONZE')

  return (
    <div className="drill">
      {lesson.body && <Markdown text={lesson.body} />}
      <div className="drill-meta">
        <span className="badge par">PAR {d.par}</span>
        {isGolf && bestScore != null && <span className="badge best">BEST {bestScore} {medal(bestScore)}</span>}
        {completed && !isGolf && <span className="badge done"><Icon name="check" size={14} /> COMPLETED</span>}
      </div>
      {d.target !== undefined && (
        <div className="drill-target">
          <div className="drill-target-label">TARGET</div>
          <pre>{d.target}</pre>
        </div>
      )}
      {d.cursorGoal && (
        <div className="drill-target">
          <div className="drill-target-label">GOAL</div>
          <pre>Move cursor to line {d.cursorGoal.row + 1}, column {d.cursorGoal.col + 1} (in NORMAL mode)</pre>
        </div>
      )}
      {d.cursorAlso && (
        <div className="drill-target">
          <div className="drill-target-label">AND</div>
          <pre>End with cursor on line {d.cursorAlso.row + 1}, column {d.cursorAlso.col + 1}</pre>
        </div>
      )}
      <VimEditor start={d.start} startCursor={d.startCursor} onChange={check} />
      {solved && gold && <Confetti />}
      <div className="drill-footer">
        {solved ? (
          <div className="drill-solved">
            <Icon name="check" size={16} /> Solved in <strong>{strokes}</strong> keystrokes — {medal(strokes)}
            {strokes > d.par && <span className="drill-tease"> · par is {d.par}, hit reset and golf it!</span>}
          </div>
        ) : (
          <div className="drill-unsolved"><Icon name="keyboard" size={14} /> {strokes} keystrokes so far…</div>
        )}
        <button className="hint-btn" onClick={() => setShowHint((s) => !s)}>
          {showHint ? 'hide hint' : <><Icon name="sparkles" size={14} /> hint</>}
        </button>
      </div>
      {showHint && <div className="hint-box">{d.hint}</div>}
    </div>
  )
}

function Confetti() {
  const pieces = Array.from({ length: 24 }, (_, i) => i)
  const colors = ['#ecbe7b', '#ff6c6b', '#98be65', '#51afef', '#c678dd']
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${(i * 41) % 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${(i % 8) * 0.09}s`,
            animationDuration: `${1 + (i % 5) * 0.18}s`,
          }}
        />
      ))}
    </div>
  )
}
