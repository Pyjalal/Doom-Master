import React, { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react'
import { worlds, rankFor, nextRank, XP, isWorldUnlocked, isBossUnlocked } from './data'
import { loadSave, persist, resetSave, touchStreak } from './state'
import { checkAchievements } from './data/achievements'
import { setSoundEnabled, sfx } from './sound'
import { Icon, LESSON_ICONS } from './icons'
import TitleBar from './components/TitleBar'
import { isDesktop, toggleDesktopFullscreen } from './windowChrome'

// Lesson screens load on demand — map boots without them.
const Markdown = lazy(() => import('./components/Markdown'))
const Drill = lazy(() => import('./components/Drill'))
const Quiz = lazy(() => import('./components/Quiz'))
const KeyDrill = lazy(() => import('./components/KeyDrill'))
const CodeDrill = lazy(() => import('./components/CodeDrill'))
const Boss = lazy(() => import('./components/Boss'))
const Arcade = lazy(() => import('./components/Arcade'))
const AchievementsModal = lazy(() => import('./components/AchievementsModal'))

const THEMES = [
  { id: 'doom', name: 'Doom One' },
  { id: 'gruvbox', name: 'Gruvbox' },
  { id: 'nord', name: 'Nord' },
  { id: 'dracula', name: 'Dracula' },
]

export default function App() {
  const [save, setSave] = useState(loadSave)
  const [view, setView] = useState({ screen: 'map' }) // map | lesson | arcade
  const [toasts, setToasts] = useState([])
  const [rankUp, setRankUp] = useState(null)
  const [showAch, setShowAch] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => { document.body.dataset.theme = save.settings.theme }, [save.settings.theme])
  useEffect(() => { setSoundEnabled(save.settings.sound) }, [save.settings.sound])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (isDesktop()) {
        const next = await toggleDesktopFullscreen()
        setIsFullscreen(next)
        return
      }
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch { }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleFullscreen])

  useEffect(() => {
    const sync = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  const toast = useCallback((icon, text) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, icon, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  const update = useCallback((fn, event) => {
    setSave((s) => {
      const before = rankFor(s.xp)
      const next = fn(structuredClone(s))
      touchStreak(next)
      if (event) {
        const unlocked = checkAchievements(next, event, worlds)
        for (const a of unlocked) {
          sfx.achievement()
          toast(a.icon, `Achievement: ${a.name}`)
        }
      }
      const after = rankFor(next.xp)
      if (after.name !== before.name) {
        sfx.rankup()
        setRankUp(after)
      }
      persist(next)
      return next
    })
  }, [toast])

  const totalLessons = useMemo(() => worlds.reduce((a, w) => a + w.lessons.length, 0), [])
  const doneCount = Object.values(save.completed || {}).filter(Boolean).length
  const isLessonDone = useCallback((id) => !!(save.completed && save.completed[id]), [save.completed])
  const rank = rankFor(save.xp)
  const nxt = nextRank(save.xp)

  const completeLesson = (lesson, detail) => {
    // Build event before update so achievement checks always get full payload.
    let event = { kind: lesson.type }
    if (lesson.type === 'quiz') {
      const score = typeof detail === 'number' ? detail : 0
      event = { kind: 'quiz', score, total: lesson.quiz.length }
    } else if (lesson.type === 'drill' || lesson.type === 'golf') {
      event = { kind: lesson.type, ...(detail && typeof detail === 'object' ? detail : {}), par: lesson.drill?.par }
    }

    update((s) => {
      if (!s.completed) s.completed = {}
      if (!s.stats) s.stats = { infosRead: 0, drillsSolved: 0, perfectQuizzes: 0, bossesSlain: 0 }
      if (!s.bossBest) s.bossBest = {}
      if (!s.golfBest) s.golfBest = {}

      const first = !s.completed[lesson.id]
      // Always mark complete first so a later XP/stats error cannot drop progress.
      s.completed[lesson.id] = true

      if (lesson.type === 'info') {
        if (first) { s.xp += XP.info; s.stats.infosRead += 1 }
      } else if (lesson.type === 'quiz') {
        const score = typeof detail === 'number' ? detail : 0
        if (first) s.xp += score * XP.quizPerQ
        if (score === lesson.quiz.length) s.stats.perfectQuizzes += 1
      } else if (lesson.type === 'keydrill') {
        const n = typeof detail === 'number' ? detail : 0
        if (first) s.xp += n * XP.keydrillPer
      } else if (lesson.type === 'codedrill') {
        if (first) s.xp += XP.codedrill
      } else if (lesson.type === 'boss') {
        if (first) { s.xp += XP.boss; s.stats.bossesSlain += 1 }
        const left = typeof detail === 'number' ? detail : 0
        const prev = s.bossBest[lesson.id]
        if (prev == null || left > prev) s.bossBest[lesson.id] = left
      } else if (lesson.type === 'drill') {
        if (first) { s.xp += XP.drill; s.stats.drillsSolved += 1 }
      } else if (lesson.type === 'golf') {
        const strokes = detail?.strokes ?? 0
        const prev = s.golfBest[lesson.id]
        if (prev == null || strokes < prev) s.golfBest[lesson.id] = strokes
        if (first) {
          s.xp += XP.golfBase
          s.stats.drillsSolved += 1
          if (strokes <= lesson.drill.par) s.xp += XP.golfGold
          else if (strokes <= lesson.drill.par + 4) s.xp += XP.golfSilver
        } else if (prev != null && strokes <= lesson.drill.par && prev > lesson.drill.par) {
          s.xp += XP.golfGold
        }
      }
      return s
    }, event)
  }

  const overlays = (
    <>
      <div className="toasts">
        {toasts.map((t) => (
          <div className="toast" key={t.id}><span className="toast-icon"><Icon name={t.icon} size={18} /></span>{t.text}</div>
        ))}
      </div>
      {rankUp && (
        <div className="modal-backdrop" onClick={() => setRankUp(null)}>
          <div className="modal rankup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rankup-glow" />
            <div className="rankup-icon"><Icon name={rankUp.icon} size={56} /></div>
            <div className="rankup-label">RANK UP</div>
            <h2>{rankUp.name}</h2>
            <button className="btn" onClick={() => setRankUp(null)}>continue the ascent</button>
          </div>
        </div>
      )}
      {showAch && <Suspense fallback={null}><AchievementsModal save={save} onClose={() => setShowAch(false)} /></Suspense>}
    </>
  )

  const header = (
    <Header
      rank={rank} nxt={nxt} xp={save.xp} done={doneCount} total={totalLessons}
      streak={save.streak} save={save}
      isFullscreen={isFullscreen}
      onHome={view.screen !== 'map' ? () => setView({ screen: 'map' }) : undefined}
      onToggleSound={() => update((s) => { s.settings.sound = !s.settings.sound; return s })}
      onTheme={(t) => update((s) => { s.settings.theme = t; return s })}
      onShowAch={() => setShowAch(true)}
      onToggleFullscreen={toggleFullscreen}
    />
  )

  let body = null
  if (view.screen === 'arcade') {
    body = (
      <>
        {header}
        <div className="lesson-page">
          <div className="lesson-nav">
            <button className="btn ghost" onClick={() => setView({ screen: 'map' })}><Icon name="chevronLeft" size={14} /> map</button>
            <span className="lesson-crumb"><Icon name="zap" size={16} /> Speedrun Arcade</span>
          </div>
          <Suspense fallback={null}><Arcade
            high={save.arcadeHigh}
            onEnd={(score) => update((s) => {
              if (score > s.arcadeHigh) s.arcadeHigh = score
              return s
            }, { kind: 'arcade', score })}
          /></Suspense>
        </div>
        {overlays}
      </>
    )
  } else if (view.screen === 'lesson') {
    const world = worlds.find((w) => w.id === view.worldId)
    const li = world.lessons.findIndex((l) => l.id === view.lessonId)
    const lesson = world.lessons[li]
    const prev = world.lessons[li - 1]
    const next = world.lessons[li + 1]
    body = (
      <>
        {header}
        <div className="lesson-page">
          <div className="lesson-nav">
            <button className="btn ghost" onClick={() => setView({ screen: 'map' })}><Icon name="chevronLeft" size={14} /> map</button>
            <span className="lesson-crumb"><Icon name={world.icon} size={16} /> {world.name}</span>
            <span className="lesson-title-crumb">{lesson.title}</span>
          </div>
          <LessonBody
            key={lesson.id}
            lesson={lesson}
            completed={isLessonDone(lesson.id)}
            bestScore={save.golfBest?.[lesson.id]}
            bossBest={save.bossBest?.[lesson.id]}
            onComplete={(detail) => completeLesson(lesson, detail)}
          />
          <div className="lesson-pager">
            {prev ? <button className="btn ghost" onClick={() => setView({ screen: 'lesson', worldId: world.id, lessonId: prev.id })}><Icon name="chevronLeft" size={14} /> {prev.title}</button> : <span />}
            {next ? <button className="btn" onClick={() => setView({ screen: 'lesson', worldId: world.id, lessonId: next.id })}>{next.title} <Icon name="chevronRight" size={14} /></button> : <button className="btn" onClick={() => setView({ screen: 'map' })}><Icon name="map" size={14} /> back to map</button>}
          </div>
        </div>
        {overlays}
      </>
    )
  } else {
    // ---- campaign map ----
    body = (
      <>
        {header}
        <div className="hero">
          <h1 className="hero-title">DOOM<span>MASTER</span></h1>
          <p className="hero-sub">Vim → VimGolf → Macros → Doom Emacs → Elisp → Org. From absolute zero to editor deity.</p>
          <div className="hero-actions">
            <button className="btn arcade-btn" onClick={() => setView({ screen: 'arcade' })}><Icon name="zap" size={16} /> SPEEDRUN ARCADE {save.arcadeHigh > 0 && <span className="arcade-hi">HI {save.arcadeHigh}</span>}</button>
            <button className="btn ghost" onClick={() => setShowAch(true)}><Icon name="trophy" size={16} /> achievements ({Object.keys(save.achievements).length})</button>
          </div>
        </div>
        <div className="campaign">
          {worlds.map((w, wi) => {
            const unlocked = isWorldUnlocked(save, wi)
            const done = w.lessons.filter((l) => isLessonDone(l.id)).length
            const bossOpen = isBossUnlocked(save, w)
            const pct = Math.round((done / w.lessons.length) * 100)
            return (
              <div className={`world-node ${unlocked ? '' : 'locked'}`} key={w.id}>
                <div className="world-connector" />
                <div className="world-card">
                  <div className="world-head">
                    <span className="world-ring" style={{ '--pct': `${pct}%` }}>
                      <span className="world-icon">{unlocked ? <Icon name={w.icon} size={22} /> : <Icon name="lock" size={22} />}</span>
                    </span>
                    <div>
                      <div className="world-name">{w.name}</div>
                      <div className="world-tag">{unlocked ? w.tagline : `Complete 70% of the previous world to unlock`}</div>
                    </div>
                    <div className="world-progress">{done}/{w.lessons.length}</div>
                  </div>
                  {unlocked && (
                    <>
                      <div className="world-bar"><div style={{ width: `${pct}%` }} /></div>
                      <div className="lesson-list">
                        {w.lessons.map((l) => {
                          const isBoss = l.type === 'boss'
                          const bossLocked = isBoss && !bossOpen
                          const lessonDone = isLessonDone(l.id)
                          return (
                            <button
                              key={l.id}
                              className={`lesson-chip ${lessonDone ? 'done' : ''} ${isBoss ? 'boss-chip' : ''} ${bossLocked ? 'locked' : ''}`}
                              disabled={bossLocked}
                              title={bossLocked ? 'Complete every lesson in this world to face the boss' : undefined}
                              onClick={() => setView({ screen: 'lesson', worldId: w.id, lessonId: l.id })}
                            >
                              <span className="chip-type"><Icon name={LESSON_ICONS[l.type] || 'book'} size={14} /></span>
                              {l.title}
                              {lessonDone && <span className="chip-medal"><Icon name="check" size={14} /></span>}
                              {l.type === 'golf' && save.golfBest?.[l.id] != null && (
                                <span className="chip-medal"><Icon name="medal" size={14} className={save.golfBest[l.id] <= l.drill.par ? 'medal-gold' : save.golfBest[l.id] <= l.drill.par + 4 ? 'medal-silver' : 'medal-bronze'} /></span>
                              )}
                              {bossLocked && <span className="chip-medal"><Icon name="lock" size={14} /></span>}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="footer">
          <button className="btn danger" onClick={() => { if (confirm('Wipe all progress?')) setSave(resetSave()) }}>reset progress</button>
          <span className="footer-note">progress auto-saves in your browser · inspired by vimgolf.com & doomemacs</span>
        </div>
        {overlays}
      </>
    )
  }

  return (
    <div className="shell">
      <TitleBar />
      <div className="app">
        {body}
      </div>
    </div>
  )
}

function Header({ rank, nxt, xp, done, total, streak, save, isFullscreen, onHome, onToggleSound, onTheme, onShowAch, onToggleFullscreen }) {
  const pct = nxt ? Math.min(100, ((xp - rank.xp) / (nxt.xp - rank.xp)) * 100) : 100
  const streakActive = streak.last === new Date().toDateString() || streak.last === new Date(Date.now() - 86400000).toDateString()
  return (
    <header className="header">
      <div className="header-brand" onClick={onHome} style={{ cursor: onHome ? 'pointer' : 'default' }}><Icon name="flame" size={18} /> DOOM MASTER</div>
      <div className="header-rank">
        <span className="rank-badge"><Icon name={rank.icon} size={16} /> {rank.name}</span>
        <div className="xp-bar" title={nxt ? `${xp} XP — next: ${nxt.name} at ${nxt.xp}` : `${xp} XP — MAX RANK`}>
          <div style={{ width: `${pct}%` }} />
        </div>
        <span className="xp-num">{xp} XP</span>
      </div>
      <div className="header-tools">
        {streak.count > 0 && (
          <span className={`streak ${streakActive ? 'lit' : ''}`} title="daily streak" onClick={onShowAch}>
            <Icon name="flame" size={14} /> {streak.count}
          </span>
        )}
        <button
          type="button"
          className="icon-btn"
          title={isFullscreen ? 'Exit fullscreen (F11)' : 'Fullscreen (F11)'}
          onClick={onToggleFullscreen}
        >
          <Icon name={isFullscreen ? 'minimize2' : 'maximize2'} size={18} />
        </button>
        <button className="icon-btn" title={save.settings.sound ? 'mute' : 'unmute'} onClick={onToggleSound}>
          <Icon name={save.settings.sound ? 'volume' : 'volumeX'} size={18} />
        </button>
        <select
          className="theme-select" value={save.settings.theme}
          onChange={(e) => onTheme(e.target.value)} title="theme"
        >
          {THEMES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="header-progress">{done}/{total}</div>
      </div>
    </header>
  )
}

function LessonBody({ lesson, completed, bestScore, bossBest, onComplete }) {
  let body = null
  if (lesson.type === 'info') {
    body = (
      <div className="info-lesson">
        <Markdown text={lesson.body} />
        <button className={`btn ${completed ? 'ghost' : ''}`} onClick={() => onComplete()}>
          {completed ? <><Icon name="check" size={16} /> read again — got it</> : <>mark as learned <Icon name="check" size={16} /> (+15 XP)</>}
        </button>
      </div>
    )
  } else if (lesson.type === 'quiz') {
    body = <Quiz lesson={lesson} completed={completed} onComplete={onComplete} />
  } else if (lesson.type === 'keydrill') {
    body = <KeyDrill lesson={lesson} completed={completed} onComplete={onComplete} />
  } else if (lesson.type === 'codedrill') {
    body = <CodeDrill lesson={lesson} completed={completed} onComplete={onComplete} />
  } else if (lesson.type === 'boss') {
    body = <Boss lesson={lesson} completed={completed} best={bossBest} onComplete={onComplete} />
  } else {
    body = <Drill lesson={lesson} isGolf={lesson.type === 'golf'} completed={completed} bestScore={bestScore} onComplete={onComplete} />
  }
  return <Suspense fallback={<div className="lesson-loading">loading…</div>}>{body}</Suspense>
}
