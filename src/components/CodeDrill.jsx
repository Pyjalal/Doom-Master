import React, { useState } from 'react'
import Markdown from './Markdown'
import { sfx } from '../sound'
import { Icon } from '../icons'

// Free-text Elisp writing drill. Each check = { re, hint }; all must pass.
export default function CodeDrill({ lesson, onComplete, completed }) {
  const c = lesson.code
  const [text, setText] = useState('')
  const [result, setResult] = useState(null) // { ok, failures:[hints] }
  const [showSolution, setShowSolution] = useState(false)

  const normalize = (s) => s.replace(/\s+/g, ' ').trim()

  const check = () => {
    const norm = normalize(text)
    const failures = []
    for (const chk of c.checks) {
      let ok = false
      try { ok = new RegExp(chk.re, chk.flags || '').test(norm) } catch { }
      if (!ok) failures.push(chk.hint)
    }
    const ok = failures.length === 0 && norm.length > 0
    setResult({ ok, failures })
    if (ok) { sfx.success(); onComplete() } else sfx.error()
  }

  return (
    <div className="codedrill">
      {lesson.body && <Markdown text={lesson.body} />}
      <div className="codedrill-prompt">
        {c.prompt} {completed && <span className="badge done"><Icon name="check" size={14} /> COMPLETED</span>}
      </div>
      <textarea
        className="codedrill-input"
        value={text}
        onChange={(e) => { setText(e.target.value); setResult(null) }}
        placeholder={c.placeholder}
        rows={Math.max(3, (c.placeholder.match(/\n/g) || []).length + 2)}
        spellCheck={false}
      />
      <div className="codedrill-actions">
        <button className="btn" onClick={check}>eval ⏎ (C-x C-e)</button>
        <button className="hint-btn" onClick={() => setShowSolution((s) => !s)}>
          {showSolution ? 'hide solution' : <><Icon name="search" size={14} /> reveal solution</>}
        </button>
      </div>
      {result && result.ok && (
        <div className="quiz-explain good"><Icon name="check" size={16} /> The Lisp interpreter accepts your offering. +25 XP</div>
      )}
      {result && !result.ok && (
        <div className="quiz-explain bad">
          <div>
            <Icon name="xCircle" size={16} /> Not quite. {result.failures.length ? 'Hints:' : ''}
            <ul>{result.failures.map((h, i) => <li key={i}>{h}</li>)}</ul>
          </div>
        </div>
      )}
      {showSolution && <pre className="md-code codedrill-solution"><code>{c.solution}</code></pre>}
    </div>
  )
}
