// Minimal markdown renderer: headings, code fences, inline code, bold, italic,
// links, lists, blockquotes.
import React from 'react'

function inline(text, keyBase) {
  const out = []
  let rest = text
  let k = 0
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))/
  while (rest.length) {
    const m = rest.match(re)
    if (!m) { out.push(rest); break }
    if (m.index > 0) out.push(rest.slice(0, m.index))
    const tok = m[0]
    const key = `${keyBase}-${k++}`
    if (tok.startsWith('`')) out.push(<code key={key}>{tok.slice(1, -1)}</code>)
    else if (tok.startsWith('**')) out.push(<strong key={key}>{inline(tok.slice(2, -2), key)}</strong>)
    else if (tok.startsWith('*')) out.push(<em key={key}>{tok.slice(1, -1)}</em>)
    else {
      const mm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)
      out.push(<a key={key} href={mm[2]} target="_blank" rel="noreferrer">{mm[1]}</a>)
    }
    rest = rest.slice(m.index + tok.length)
  }
  return out
}

export default function Markdown({ text }) {
  const lines = text.split('\n')
  const blocks = []
  let i = 0, k = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const buf = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) buf.push(lines[i++])
      i++
      blocks.push(<pre key={k++} className="md-code"><code>{buf.join('\n')}</code></pre>)
      continue
    }
    if (line.startsWith('> ')) {
      const buf = []
      while (i < lines.length && lines[i].startsWith('> ')) buf.push(lines[i++].slice(2))
      blocks.push(<blockquote key={k++}>{inline(buf.join(' '), `bq${k}`)}</blockquote>)
      continue
    }
    if (/^[-*] /.test(line)) {
      const items = []
      while (i < lines.length && /^[-*] /.test(lines[i])) items.push(lines[i++].slice(2))
      blocks.push(<ul key={k++}>{items.map((it, j) => <li key={j}>{inline(it, `li${k}-${j}`)}</li>)}</ul>)
      continue
    }
    if (/^\d+\. /.test(line)) {
      const items = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) items.push(lines[i++].replace(/^\d+\. /, ''))
      blocks.push(<ol key={k++}>{items.map((it, j) => <li key={j}>{inline(it, `ol${k}-${j}`)}</li>)}</ol>)
      continue
    }
    if (line.startsWith('### ')) { blocks.push(<h4 key={k++}>{inline(line.slice(4), `h${k}`)}</h4>); i++; continue }
    if (line.startsWith('## ')) { blocks.push(<h3 key={k++}>{inline(line.slice(3), `h${k}`)}</h3>); i++; continue }
    if (line.startsWith('# ')) { blocks.push(<h2 key={k++}>{inline(line.slice(2), `h${k}`)}</h2>); i++; continue }
    if (line.trim() === '') { i++; continue }
    // paragraph: gather until blank
    const buf = []
    while (i < lines.length && lines[i].trim() !== '' && !/^(```|[-*] |\d+\. |#|> )/.test(lines[i])) buf.push(lines[i++])
    blocks.push(<p key={k++}>{inline(buf.join(' '), `p${k}`)}</p>)
  }
  return <div className="md">{blocks}</div>
}
