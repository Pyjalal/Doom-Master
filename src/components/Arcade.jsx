import React, { useState, useEffect, useRef, useCallback } from 'react'
import VimEditor from './VimEditor'
import { getText } from '../engine/vim'
import { sfx } from '../sound'
import { Icon } from '../icons'

// Speedrun gauntlet: random micro-drills, 60s + bonus time per solve, combo multiplier.
const POOL = [
  { start: 'teh cat', target: 'the cat', tip: 'xp swap' },
  { start: 'hello wrold', target: 'hello world', tip: 'fix the typo' },
  { start: 'delete me please', target: 'please', tip: 'd2w' },
  { start: 'aaa\nbbb', target: 'bbb\naaa', tip: 'ddp' },
  { start: 'x = "old"', target: 'x = "new"', tip: 'ci"' },
  { start: 'one', target: 'one\none', tip: 'yyp' },
  { start: 'CAPS off', target: 'cAPS off', tip: '~' },
  { start: 'junk word', target: 'word', tip: 'dw' },
  { start: 'end;', target: 'end', tip: '$x' },
  { start: 'a b c d e', target: 'a b c', tip: 'delete last 2 words' },
  { start: 'no tail here', target: 'no', tip: 'dW dW or d$ from w' },
  { start: 'l1\nl2\nl3', target: 'l1\nl3', tip: 'delete middle line' },
  { start: 'wrap', target: '(wrap)', tip: 'I( A)' },
  { start: 'foo bar', target: 'bar foo', tip: 'transpose words' },
  { start: 'zzz important', target: 'important', tip: 'daw on zzz' },
  { start: 'semi;colon', target: 'semicolon', tip: 'f; x' },
  { start: 'double  space', target: 'double space', tip: 'find the gap' },
  { start: 'abc', target: '', tip: 'dd or 3x' },
  { start: 'x\nx\nx', target: 'x x x', tip: 'J twice or 3J' },
  { start: 'const a=1', target: 'let a=1', tip: 'change the keyword' },
]

const START_TIME = 60
const BONUS = 6

export default function Arcade({ high, onEnd }) {
  const [phase, setPhase] = useState('idle') // idle | run | over
  const [time, setTime] = useState(START_TIME)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [task, setTask] = useState(null)
  const [taskKey, setTaskKey] = useState(0)
  const timerRef = useRef(null)
  const timeRef = useRef(START_TIME)
  const scoreRef = useRef(0)
  const solvedRef = useRef(false)
  const lastIdx = useRef(-1)

  const nextTask = useCallback(() => {
    let i
    do { i = Math.floor(Math.random() * POOL.length) } while (i === lastIdx.current)
    lastIdx.current = i
    solvedRef.current = false
    setTask(POOL[i])
    setTaskKey((k) => k + 1)
  }, [])

  const stop = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  const start = () => {
    setScore(0); scoreRef.current = 0
    setCombo(0)
    timeRef.current = START_TIME
    setTime(START_TIME)
    setPhase('run')
    nextTask()
    stop()
    timerRef.current = setInterval(() => {
      timeRef.current -= 1
      setTime(timeRef.current)
      if (timeRef.current <= 0) {
        stop()
        setPhase('over')
        sfx.bossLose()
        onEnd(scoreRef.current)
      }
    }, 1000)
  }

  useEffect(() => stop, [])

  const check = (vim) => {
    if (solvedRef.current || !task) return
    if (getText(vim) === task.target && vim.mode === 'normal') {
      solvedRef.current = true
      scoreRef.current += 1
      setScore(scoreRef.current)
      setCombo((c) => {
        sfx.combo(Math.min(c + 1, 8))
        return c + 1
      })
      timeRef.current = Math.min(START_TIME, timeRef.current + BONUS)
      setTime(timeRef.current)
      setTimeout(nextTask, 350)
    }
  }

  if (phase === 'idle' || phase === 'over') {
    return (
      <div className="arcade arcade-idle">
        <div className="arcade-logo"><Icon name="zap" size={26} /> SPEEDRUN ARCADE</div>
        {phase === 'over' && (
          <div className="arcade-result">
            <div className="arcade-final">{score}</div>
            <div>{score > high ? <><Icon name="trophy" size={18} /> NEW HIGH SCORE!</> : `high score: ${high}`}</div>
          </div>
        )}
        {phase === 'idle' && (
          <>
            <p>Random micro-edits against the clock. Each solve: <strong>+1 point, +{BONUS}s</strong>. Chain solves for combo glory.</p>
            <p className="arcade-high"><Icon name="trophy" size={16} /> high score: <strong>{high}</strong></p>
          </>
        )}
        <button className="btn boss-start" onClick={start}>{phase === 'over' ? <><Icon name="reset" size={16} /> RUN IT BACK</> : <><Icon name="zap" size={16} /> START RUN</>}</button>
      </div>
    )
  }

  return (
    <div className="arcade arcade-run">
      <div className="arcade-hud">
        <span className="arcade-score"><Icon name="zap" size={18} /> {score}</span>
        {combo >= 2 && <span className="arcade-combo">x{combo} COMBO</span>}
        <span className={`boss-timer ${time <= 10 ? 'critical' : ''}`}><Icon name="timer" size={16} /> {time}s</span>
      </div>
      <div className="drill-target">
        <div className="drill-target-label">TARGET {task.tip && <em className="arcade-tip">({task.tip})</em>}</div>
        <pre>{task.target === '' ? '(empty buffer)' : task.target}</pre>
      </div>
      <VimEditor key={taskKey} start={task.start} onChange={check} focusSignal={taskKey} />
    </div>
  )
}
