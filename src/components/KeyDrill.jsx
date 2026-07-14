import React, { useState, useRef } from 'react'
import Markdown from './Markdown'
import { sfx } from '../sound'
import { Icon } from '../icons'

// Player must physically type key sequences (SPC = space).
export default function KeyDrill({ lesson, onComplete, completed }) {
  const drills = lesson.drills
  const [idx, setIdx] = useState(0)
  const [pos, setPos] = useState(0)
  const [flash, setFlash] = useState('')     // '', 'good', 'bad'
  const [doneAll, setDoneAll] = useState(false)
  const ref = useRef(null)
  const [focused, setFocused] = useState(false)

  const d = drills[idx]

  const expected = (k) => (k === 'SPC' ? ' ' : k)

  const onKeyDown = (e) => {
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return
    e.preventDefault()
    if (doneAll) return
    if (e.key === expected(d.keys[pos])) {
      sfx.tick()
      const nextPos = pos + 1
      if (nextPos >= d.keys.length) {
        setFlash('good')
        sfx.success()
        setTimeout(() => {
          setFlash('')
          if (idx + 1 >= drills.length) {
            setDoneAll(true)
            onComplete(drills.length)
          } else {
            setIdx(idx + 1)
            setPos(0)
          }
        }, 500)
        setPos(nextPos)
      } else setPos(nextPos)
    } else {
      setFlash('bad')
      sfx.error()
      setPos(0)
      setTimeout(() => setFlash(''), 350)
    }
  }

  if (doneAll) {
    return (
      <div className="keydrill">
        <div className="quiz-result">
          <div className="quiz-score"><Icon name="flame" size={48} /></div>
          <div>All {drills.length} bindings drilled into muscle memory.</div>
          <button className="btn" onClick={() => { setIdx(0); setPos(0); setDoneAll(false) }}>drill again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="keydrill">
      {lesson.body && <Markdown text={lesson.body} />}
      <div className="quiz-progress">Binding {idx + 1} / {drills.length} {completed && <span className="badge done">✓ COMPLETED</span>}</div>
      <div
        className={`keydrill-pad ${flash} ${focused ? 'focused' : ''}`}
        tabIndex={0} ref={ref} onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      >
        <div className="keydrill-prompt">{d.prompt}</div>
        <div className="keydrill-keys">
          {d.keys.map((k, i) => (
            <span key={i} className={`keycap ${i < pos ? 'hit' : i === pos ? 'next' : ''}`}>{k}</span>
          ))}
        </div>
        {!focused && <div className="vim-focus-hint">click here, then type the keys</div>}
        {flash === 'bad' && <div className="keydrill-miss"><Icon name="xCircle" size={14} /> wrong key — sequence reset</div>}
      </div>
    </div>
  )
}
