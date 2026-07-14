import React, { useState, useEffect, useRef, useCallback } from 'react'
import VimEditor from './VimEditor'
import { getText } from '../engine/vim'
import { sfx } from '../sound'
import { Icon } from '../icons'

// Multi-stage timed boss battle. Stage kinds: drill | keys | quiz.
export default function Boss({ lesson, onComplete, completed, best }) {
  const b = lesson.boss
  const [phase, setPhase] = useState('idle')   // idle | fight | won | lost
  const [stage, setStage] = useState(0)
  const [timeLeft, setTimeLeft] = useState(b.time)
  const [shake, setShake] = useState(false)
  const timerRef = useRef(null)
  const timeRef = useRef(b.time)
  const stageRef = useRef(0)
  const completedOnceRef = useRef(false)

  const stop = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  const start = () => {
    stageRef.current = 0
    completedOnceRef.current = false
    setStage(0)
    setTimeLeft(b.time)
    timeRef.current = b.time
    setPhase('fight')
    sfx.boss()
    stop()
    timerRef.current = setInterval(() => {
      timeRef.current -= 1
      setTimeLeft(timeRef.current)
      if (timeRef.current <= 0) {
        stop()
        setPhase('lost')
        sfx.bossLose()
      }
    }, 1000)
  }

  useEffect(() => stop, [])

  const penalty = (secs) => {
    timeRef.current = Math.max(1, timeRef.current - secs)
    setTimeLeft(timeRef.current)
    setShake(true)
    setTimeout(() => setShake(false), 350)
    sfx.error()
  }

  const stageClear = useCallback(() => {
    sfx.success()
    const next = stageRef.current + 1
    if (next >= b.stages.length) {
      if (completedOnceRef.current) return
      completedOnceRef.current = true
      stop()
      setPhase('won')
      sfx.bossWin()
      onComplete(timeRef.current)
      return
    }
    stageRef.current = next
    setStage(next)
  }, [b.stages.length, onComplete])

  if (phase === 'idle') {
    return (
      <div className="boss boss-intro">
        <div className="boss-face"><Icon name="skull" size={64} /></div>
        <h2>{lesson.title.replace('BOSS · ', '')}</h2>
        <p className="boss-speech">{b.intro}</p>
        <div className="boss-meta">
          <span className="badge par"><Icon name="timer" size={14} /> {b.time}s</span>
          <span className="badge par">{b.stages.length} stages</span>
          {completed && <span className="badge done"><Icon name="check" size={14} /> SLAIN{best != null ? ` · best ${best}s left` : ''}</span>}
        </div>
        <button className="btn boss-start" onClick={start}><Icon name="swords" size={16} /> FIGHT</button>
      </div>
    )
  }

  if (phase === 'won') {
    return (
      <div className="boss boss-won">
        <div className="boss-face dead"><Icon name="skull" size={64} /></div>
        <h2>BOSS SLAIN</h2>
        <p>Victory with <strong>{timeLeft}s</strong> to spare. +100 XP</p>
        <button className="btn" onClick={start}>fight again (improve time)</button>
      </div>
    )
  }

  if (phase === 'lost') {
    return (
      <div className="boss boss-lost">
        <div className="boss-face"><Icon name="skull" size={64} /></div>
        <h2>YOU DIED</h2>
        <p>The clock ran out at stage {stage + 1} of {b.stages.length}. The boss feeds on hesitation.</p>
        <button className="btn danger" onClick={start}><Icon name="reset" size={16} /> RETRY</button>
      </div>
    )
  }

  const s = b.stages[stage]
  const hpPct = ((b.stages.length - stage) / b.stages.length) * 100
  const timePct = (timeLeft / b.time) * 100

  return (
    <div className={`boss boss-fight ${shake ? 'shake' : ''}`}>
      <div className="boss-hud">
        <div className="boss-hp">
          <span><Icon name="skull" size={12} /> BOSS HP</span>
          <div className="boss-bar"><div className="boss-bar-fill hp" style={{ width: `${hpPct}%` }} /></div>
        </div>
        <div className={`boss-timer ${timeLeft <= 10 ? 'critical' : ''}`}><Icon name="timer" size={16} /> {timeLeft}s</div>
        <div className="boss-hp">
          <span>TIME</span>
          <div className="boss-bar"><div className="boss-bar-fill time" style={{ width: `${timePct}%` }} /></div>
        </div>
      </div>
      <div className="boss-stage-label">STAGE {stage + 1} / {b.stages.length}</div>
      {s.kind === 'drill' && <BossDrill key={stage} s={s} onClear={stageClear} />}
      {s.kind === 'keys' && <BossKeys key={stage} s={s} onClear={stageClear} onMiss={() => penalty(3)} />}
      {s.kind === 'quiz' && <BossQuiz key={stage} s={s} onClear={stageClear} onMiss={() => penalty(8)} />}
    </div>
  )
}

function BossDrill({ s, onClear }) {
  const doneRef = useRef(false)
  const check = (vim) => {
    if (doneRef.current) return
    let ok = false
    if (s.target !== undefined) {
      ok = getText(vim) === s.target
      if (ok && s.requireNormal && vim.mode !== 'normal') ok = false
    } else if (s.cursorGoal) {
      ok = vim.row === s.cursorGoal.row && vim.col === s.cursorGoal.col && vim.mode === 'normal'
    }
    if (ok) { doneRef.current = true; onClear() }
  }
  return (
    <div>
      <div className="boss-prompt">{s.prompt}</div>
      {s.target !== undefined && (
        <div className="drill-target"><div className="drill-target-label">TARGET</div><pre>{s.target}</pre></div>
      )}
      {s.cursorGoal && (
        <div className="drill-target"><div className="drill-target-label">GOAL</div><pre>Cursor to line {s.cursorGoal.row + 1}, column {s.cursorGoal.col + 1}</pre></div>
      )}
      <VimEditor start={s.start} startCursor={s.startCursor} onChange={check} focusSignal={1} />
    </div>
  )
}

function BossKeys({ s, onClear, onMiss }) {
  const [pos, setPos] = useState(0)
  const ref = useRef(null)
  const [focused, setFocused] = useState(false)
  useEffect(() => { ref.current && ref.current.focus() }, [])
  const expected = (k) => (k === 'SPC' ? ' ' : k)
  const onKeyDown = (e) => {
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return
    e.preventDefault()
    if (e.key === expected(s.keys[pos])) {
      const next = pos + 1
      setPos(next)
      if (next >= s.keys.length) setTimeout(onClear, 250)
    } else {
      setPos(0)
      onMiss()
    }
  }
  return (
    <div
      className={`keydrill-pad ${focused ? 'focused' : ''}`} tabIndex={0} ref={ref}
      onKeyDown={onKeyDown} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    >
      <div className="keydrill-prompt">{s.prompt}</div>
      <div className="keydrill-keys">
        {s.keys.map((k, i) => (
          <span key={i} className={`keycap ${i < pos ? 'hit' : i === pos ? 'next' : ''}`}>{k}</span>
        ))}
      </div>
      {!focused && <div className="vim-focus-hint">click here, then type the keys</div>}
    </div>
  )
}

function BossQuiz({ s, onClear, onMiss }) {
  const [wrong, setWrong] = useState([])
  const pick = (i) => {
    if (i === s.answer) onClear()
    else { setWrong((w) => [...w, i]); onMiss() }
  }
  return (
    <div className="quiz">
      <div className="quiz-q">{s.q}</div>
      <div className="quiz-choices">
        {s.choices.map((c, i) => (
          <button key={i} className={`quiz-choice ${wrong.includes(i) ? 'wrong' : ''}`} onClick={() => pick(i)} disabled={wrong.includes(i)}>
            <span className="quiz-letter">{'ABCD'[i]}</span> {c}
          </button>
        ))}
      </div>
      <div className="boss-quiz-warn">wrong answers cost time!</div>
    </div>
  )
}
