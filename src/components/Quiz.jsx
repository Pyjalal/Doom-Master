import React, { useState } from 'react'
import Markdown from './Markdown'
import { sfx } from '../sound'
import { Icon } from '../icons'

export default function Quiz({ lesson, onComplete, completed }) {
  const qs = lesson.quiz
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = qs[idx]

  const pick = (i) => {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) {
      sfx.success()
      setScore((s) => s + 1)
    } else {
      sfx.error()
    }
  }

  const next = () => {
    // Include current pick: setScore is async so `score` may still be stale here.
    const finalScore = score + (picked === q.answer ? 1 : 0)
    if (idx + 1 >= qs.length) {
      setFinished(true)
      setScore(finalScore)
      onComplete(finalScore)
    } else {
      setIdx(idx + 1)
      setPicked(null)
    }
  }

  if (finished) {
    return (
      <div className="quiz">
        <div className="quiz-result">
          <div className="quiz-score">{score} / {qs.length}</div>
          <div>{score === qs.length ? <><Icon name="award" size={18} /> Flawless. The grimoire accepts you.</> : score >= qs.length * 0.7 ? <><Icon name="swords" size={18} /> Solid. Review the misses and move on.</> : <><Icon name="book" size={18} /> Worth re-reading the lesson before advancing.</>}</div>
          <button className="btn" onClick={() => { setIdx(0); setPicked(null); setScore(0); setFinished(false) }}>retake</button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz">
      {lesson.body && <Markdown text={lesson.body} />}
      <div className="quiz-progress">Question {idx + 1} / {qs.length} {completed && <span className="badge done"><Icon name="check" size={14} /> COMPLETED</span>}</div>
      <div className="quiz-q">{q.q}</div>
      <div className="quiz-choices">
        {q.choices.map((c, i) => (
          <button
            key={i}
            className={`quiz-choice ${picked !== null ? (i === q.answer ? 'correct' : i === picked ? 'wrong' : 'dim') : ''}`}
            onClick={() => pick(i)}
          >
            <span className="quiz-letter">{'ABCD'[i]}</span> {c}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className={`quiz-explain ${picked === q.answer ? 'good' : 'bad'}`}>
          {picked === q.answer ? <><Icon name="check" size={16} /> </> : <><Icon name="xCircle" size={16} /> </>}{q.explain}
          <button className="btn" onClick={next}>{idx + 1 >= qs.length ? 'finish' : 'next →'}</button>
        </div>
      )}
    </div>
  )
}
