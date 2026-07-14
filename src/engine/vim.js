// Pro Vim engine: normal/insert/visual modes, counts, operators, text objects,
// dot-repeat, macros, search (/ ? n N *), ex commands (:s :g :m :d :normal),
// marks, named registers. Pure functions: handleKey(state, key) -> new state.

export function createVim(text) {
  return {
    lines: text.length ? text.split('\n') : [''],
    row: 0, col: 0,
    mode: 'normal',            // normal | insert | visual | visual-line
    pending: '',               // multi-key prefix: d c y g f F t T r m ` ' " q@ @ etc.
    count: '',
    register: { text: '', linewise: false },
    registers: {},             // named a-z
    macros: {},                // recorded macros a-z
    marks: {},                 // a-z -> {row,col}
    useReg: null,              // pending "x register selection
    undo: [], redo: [],
    vrow: 0, vcol: 0,          // visual anchor
    keystrokes: 0,
    cmdline: null,             // { type: ':'|'/'|'?', text, op }
    recording: null,           // { reg, keys: [] }
    lastMacro: null,
    search: null,              // { pat, dir: 1|-1 }
    lastFind: null,
    dotKeys: [], dotChanged: false, lastChange: null,
    usedDot: false, usedMacro: false, usedEx: false, usedSearch: false,
    lastMessage: '',
    _noDot: false,
  }
}

const clone = (v) => ({ ...v, lines: [...v.lines] })
const isWord = (c) => /[A-Za-z0-9_]/.test(c)
const isSpace = (c) => /\s/.test(c)
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function snapshot(v) {
  v.undo = [...v.undo, { lines: [...v.lines], row: v.row, col: v.col }]
  if (v.undo.length > 100) v.undo = v.undo.slice(-100)
  v.redo = []
}

function clampCol(v, insert = false) {
  if (v.row > v.lines.length - 1) v.row = v.lines.length - 1
  if (v.row < 0) v.row = 0
  const max = Math.max(0, v.lines[v.row].length - (insert || v.mode !== 'normal' ? 0 : 1))
  if (v.col > max) v.col = max
  if (v.col < 0) v.col = 0
}

function firstNonBlank(s) { const m = s.match(/\S/); return m ? m.index : 0 }

// ---------- motions ----------
function motionResult(v, key, count) {
  let { row, col } = v
  const L = v.lines
  const line = () => L[row]
  const n = count || 1
  switch (key) {
    case 'h': col = Math.max(0, col - n); return { row, col }
    case 'l': col = Math.min(Math.max(0, line().length - 1), col + n); return { row, col }
    case 'j': row = Math.min(L.length - 1, row + n); return { row, col, linewise: true }
    case 'k': row = Math.max(0, row - n); return { row, col, linewise: true }
    case '0': return { row, col: 0 }
    case '^': return { row, col: firstNonBlank(line()) }
    case '$': row = Math.min(L.length - 1, row + n - 1); return { row, col: Math.max(0, L[row].length - 1) }
    case 'G': row = count ? Math.min(L.length - 1, count - 1) : L.length - 1
      return { row, col: firstNonBlank(L[row]), linewise: true }
    case 'gg': row = count ? Math.min(L.length - 1, count - 1) : 0
      return { row, col: firstNonBlank(L[row]), linewise: true }
    case 'w': for (let i = 0; i < n; i++) ({ row, col } = wordFwd(L, row, col)); return { row, col, excl: true }
    case 'W': for (let i = 0; i < n; i++) ({ row, col } = wordFwd(L, row, col, true)); return { row, col, excl: true }
    case 'b': for (let i = 0; i < n; i++) ({ row, col } = wordBack(L, row, col)); return { row, col, excl: true }
    case 'B': for (let i = 0; i < n; i++) ({ row, col } = wordBack(L, row, col, true)); return { row, col, excl: true }
    case 'e': for (let i = 0; i < n; i++) ({ row, col } = wordEnd(L, row, col)); return { row, col }
    case 'E': for (let i = 0; i < n; i++) ({ row, col } = wordEnd(L, row, col, true)); return { row, col }
    case '{': { let r = row; for (let i = 0; i < n; i++) { r--; while (r > 0 && L[r].trim() !== '') r-- } row = Math.max(0, r); return { row, col: 0, linewise: true } }
    case '}': { let r = row; for (let i = 0; i < n; i++) { r++; while (r < L.length - 1 && L[r].trim() !== '') r++ } row = Math.min(L.length - 1, r); return { row, col: 0, linewise: true } }
    default: return null
  }
}

function wordFwd(L, row, col, big = false) {
  const cls = (c) => big ? (isSpace(c) ? 0 : 1) : (isSpace(c) ? 0 : isWord(c) ? 1 : 2)
  let line = L[row]
  const start = cls(line[col] || ' ')
  col++
  while (true) {
    if (col >= line.length) {
      if (row >= L.length - 1) return { row, col: Math.max(0, line.length - 1) }
      row++; col = 0; line = L[row]
      if (line.length === 0) return { row, col }
      if (cls(line[0]) !== 0) return { row, col }
      continue
    }
    const c = cls(line[col])
    if (c !== 0 && c !== start) return { row, col }
    if (c !== 0 && start === 0) return { row, col }
    if (c === 0) return wordFwdSkipSpace(L, row, col, cls)
    col++
  }
}
function wordFwdSkipSpace(L, row, col, cls) {
  let line = L[row]
  while (true) {
    if (col >= line.length) {
      if (row >= L.length - 1) return { row, col: Math.max(0, line.length - 1) }
      row++; col = 0; line = L[row]
      if (line.length === 0) return { row, col }
      continue
    }
    if (cls(line[col]) !== 0) return { row, col }
    col++
  }
}

function wordBack(L, row, col, big = false) {
  const cls = (c) => big ? (isSpace(c) ? 0 : 1) : (isSpace(c) ? 0 : isWord(c) ? 1 : 2)
  col--
  while (true) {
    if (col < 0) {
      if (row === 0) return { row: 0, col: 0 }
      row--; col = L[row].length - 1
      if (col < 0) continue
    }
    if (cls(L[row][col]) !== 0) break
    col--
  }
  const k = cls(L[row][col])
  while (col > 0 && cls(L[row][col - 1]) === k) col--
  return { row, col }
}

function wordEnd(L, row, col, big = false) {
  const cls = (c) => big ? (isSpace(c) ? 0 : 1) : (isSpace(c) ? 0 : isWord(c) ? 1 : 2)
  col++
  while (true) {
    if (col >= L[row].length) {
      if (row >= L.length - 1) return { row, col: Math.max(0, L[row].length - 1) }
      row++; col = 0
      continue
    }
    if (cls(L[row][col]) !== 0) break
    col++
  }
  const k = cls(L[row][col])
  while (col < L[row].length - 1 && cls(L[row][col + 1]) === k) col++
  return { row, col }
}

function findCharMotion(v, kind, ch, count) {
  const line = v.lines[v.row]
  let col = v.col
  const n = count || 1
  for (let i = 0; i < n; i++) {
    if (kind === 'f' || kind === 't') {
      const idx = line.indexOf(ch, col + (kind === 't' && i === 0 ? 2 : 1))
      if (idx === -1) return null
      col = idx
    } else {
      const idx = line.lastIndexOf(ch, col - (kind === 'T' && i === 0 ? 2 : 1))
      if (idx === -1) return null
      col = idx
    }
  }
  if (kind === 't') col--
  if (kind === 'T') col++
  return { row: v.row, col }
}

// ---------- text objects ----------
function textObject(v, inner, obj) {
  const line = v.lines[v.row]
  if (obj === 'w' || obj === 'W') {
    if (!line.length) return null
    const big = obj === 'W'
    const cls = (c) => big ? (isSpace(c) ? 0 : 1) : (isSpace(c) ? 0 : isWord(c) ? 1 : 2)
    let s = v.col, e = v.col
    const k = cls(line[v.col])
    while (s > 0 && cls(line[s - 1]) === k) s--
    while (e < line.length - 1 && cls(line[e + 1]) === k) e++
    if (!inner) {
      let e2 = e
      while (e2 < line.length - 1 && isSpace(line[e2 + 1])) e2++
      if (e2 > e) e = e2
      else while (s > 0 && isSpace(line[s - 1])) s--
    }
    return { srow: v.row, scol: s, erow: v.row, ecol: e }
  }
  if (obj === '"' || obj === "'" || obj === '`') {
    const before = line.lastIndexOf(obj, v.col)
    const sIdx = before !== -1 ? before : line.indexOf(obj)
    if (sIdx === -1) return null
    const eIdx = line.indexOf(obj, sIdx + 1)
    if (eIdx === -1) return null
    return inner
      ? (eIdx - sIdx < 2 ? null : { srow: v.row, scol: sIdx + 1, erow: v.row, ecol: eIdx - 1 })
      : { srow: v.row, scol: sIdx, erow: v.row, ecol: eIdx }
  }
  const openFor = { '(': '(', ')': '(', b: '(', '{': '{', '}': '{', B: '{', '[': '[', ']': '[', '<': '<', '>': '<' }
  const open = openFor[obj]
  if (!open) return null
  const close = { '(': ')', '{': '}', '[': ']', '<': '>' }[open]
  let depth = 0, sr = -1, sc = -1
  outer: for (let r = v.row; r >= 0; r--) {
    const start = r === v.row ? v.col : v.lines[r].length - 1
    for (let c = start; c >= 0; c--) {
      const ch = v.lines[r][c]
      if (ch === close && !(r === v.row && c === v.col)) depth++
      else if (ch === open) { if (depth === 0) { sr = r; sc = c; break outer } depth-- }
    }
  }
  if (sr === -1) return null
  depth = 0
  for (let r = sr; r < v.lines.length; r++) {
    const start = r === sr ? sc + 1 : 0
    for (let c = start; c < v.lines[r].length; c++) {
      const ch = v.lines[r][c]
      if (ch === open) depth++
      else if (ch === close) {
        if (depth === 0) {
          if (inner) {
            let er = r, ec = c - 1
            if (sr === er && ec < sc + 1) return null
            if (ec < 0) { er--; ec = v.lines[er].length - 1 }
            return { srow: sr, scol: sc + 1, erow: er, ecol: ec }
          }
          return { srow: sr, scol: sc, erow: r, ecol: c }
        }
        depth--
      }
    }
  }
  return null
}

// ---------- register & edit helpers ----------
function setReg(v, reg) {
  v.register = reg
  if (v.useReg) {
    v.registers = { ...v.registers, [v.useReg]: reg }
    v.useReg = null
  }
}

function deleteRange(v, srow, scol, erow, ecol, linewise) {
  if (linewise) {
    const removed = v.lines.slice(srow, erow + 1)
    setReg(v, { text: removed.join('\n'), linewise: true })
    v.lines.splice(srow, erow - srow + 1)
    if (v.lines.length === 0) v.lines = ['']
    v.row = Math.min(srow, v.lines.length - 1)
    v.col = firstNonBlank(v.lines[v.row])
    return
  }
  if (srow === erow) {
    const line = v.lines[srow]
    setReg(v, { text: line.slice(scol, ecol + 1), linewise: false })
    v.lines[srow] = line.slice(0, scol) + line.slice(ecol + 1)
  } else {
    const first = v.lines[srow], last = v.lines[erow]
    const mid = v.lines.slice(srow + 1, erow)
    setReg(v, { text: [first.slice(scol), ...mid, last.slice(0, ecol + 1)].join('\n'), linewise: false })
    v.lines.splice(srow, erow - srow + 1, first.slice(0, scol) + last.slice(ecol + 1))
  }
  v.row = srow; v.col = scol
}

function yankRange(v, srow, scol, erow, ecol, linewise) {
  if (linewise) { setReg(v, { text: v.lines.slice(srow, erow + 1).join('\n'), linewise: true }); return }
  if (srow === erow) setReg(v, { text: v.lines[srow].slice(scol, ecol + 1), linewise: false })
  else {
    const parts = [v.lines[srow].slice(scol), ...v.lines.slice(srow + 1, erow), v.lines[erow].slice(0, ecol + 1)]
    setReg(v, { text: parts.join('\n'), linewise: false })
  }
}

function orderRange(a, b, c, d) {
  if (a > c || (a === c && b > d)) return [c, d, a, b]
  return [a, b, c, d]
}

function applyOperator(v, op, target) {
  let srow, scol, erow, ecol, linewise = false
  if ('srow' in target) ({ srow, scol, erow, ecol } = target)
  else {
    linewise = !!target.linewise
      ;[srow, scol, erow, ecol] = orderRange(v.row, v.col, target.row, target.col)
    if (linewise) { scol = 0; ecol = Math.max(0, v.lines[erow].length - 1) }
    else if (target.excl) {
      if (erow === target.row && ecol === target.col) {
        ecol--
        if (ecol < 0 && erow > srow) { erow--; ecol = Math.max(0, v.lines[erow].length - 1) }
        if (ecol < 0) ecol = 0
      }
    }
  }
  snapshot(v)
  if (op === 'y') {
    yankRange(v, srow, scol, erow, ecol, linewise)
    v.row = srow; v.col = scol
  } else if (op === 'd' || op === 'c') {
    if (op === 'c' && linewise) {
      yankRange(v, srow, scol, erow, ecol, true)
      v.lines.splice(srow, erow - srow + 1, '')
      v.row = srow; v.col = 0; v.mode = 'insert'
      return
    }
    deleteRange(v, srow, scol, erow, ecol, linewise)
    if (op === 'c') v.mode = 'insert'
  }
  clampCol(v, v.mode === 'insert')
}

function put(v, after) {
  snapshot(v)
  const reg = v.useReg ? (v.registers[v.useReg] || { text: '', linewise: false }) : v.register
  v.useReg = null
  if (!reg.text) return
  if (reg.linewise) {
    const newLines = reg.text.split('\n')
    const at = after ? v.row + 1 : v.row
    v.lines.splice(at, 0, ...newLines)
    v.row = at; v.col = firstNonBlank(v.lines[at])
  } else {
    const line = v.lines[v.row]
    const parts = reg.text.split('\n')
    const at = after ? Math.min(v.col + 1, line.length) : v.col
    if (parts.length === 1) {
      v.lines[v.row] = line.slice(0, at) + reg.text + line.slice(at)
      v.col = at + reg.text.length - 1
    } else {
      const tail = line.slice(at)
      v.lines[v.row] = line.slice(0, at) + parts[0]
      const rest = parts.slice(1)
      rest[rest.length - 1] += tail
      v.lines.splice(v.row + 1, 0, ...rest)
      v.row += 1; v.col = 0
    }
  }
  clampCol(v)
}

// ---------- search ----------
function buildRegex(pat, flags = 'g') {
  try { return new RegExp(pat, flags) } catch { return new RegExp(escapeRe(pat), flags) }
}

function findMatch(v, pat, dir) {
  const re = buildRegex(pat)
  const L = v.lines
  const positionsInLine = (r) => {
    const out = []
    re.lastIndex = 0
    let m
    while ((m = re.exec(L[r])) !== null) {
      out.push(m.index)
      if (m.index === re.lastIndex) re.lastIndex++
    }
    return out
  }
  const total = L.length
  if (dir === 1) {
    for (let i = 0; i <= total; i++) {
      const r = (v.row + i) % total
      for (const c of positionsInLine(r)) {
        if (i === 0 && c <= v.col) continue
        if (i === total && c > v.col) continue
        return { row: r, col: c }
      }
    }
  } else {
    for (let i = 0; i <= total; i++) {
      const r = ((v.row - i) % total + total) % total
      const cols = positionsInLine(r).reverse()
      for (const c of cols) {
        if (i === 0 && c >= v.col) continue
        if (i === total && c < v.col) continue
        return { row: r, col: c }
      }
    }
  }
  return null
}

// ---------- ex commands ----------
function parseAddr(v, s) {
  if (s[0] === '$') return [v.lines.length - 1, s.slice(1)]
  if (s[0] === '.') return [v.row, s.slice(1)]
  const m = s.match(/^\d+/)
  if (m) return [parseInt(m[0], 10) - 1, s.slice(m[0].length)]
  return [null, s]
}

function parseRange(v, text) {
  if (text[0] === '%') return { range: [0, v.lines.length - 1], rest: text.slice(1) }
  const [a, rest] = parseAddr(v, text)
  if (a === null) return { range: null, rest: text }
  if (rest[0] === ',') {
    const [b, rest2] = parseAddr(v, rest.slice(1))
    return { range: [a, b === null ? v.row : b], rest: rest2 }
  }
  return { range: [a, a], rest }
}

function splitOnSlash(s) {
  const out = ['']
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '\\' && s[i + 1] === '/') { out[out.length - 1] += '/'; i++; continue }
    if (ch === '/') { out.push(''); continue }
    out[out.length - 1] += ch
  }
  return out
}

function vimRepToJs(rep) {
  return rep
    .replace(/\\&/g, '\u0000')
    .replace(/&/g, '$$&')
    .replace(/\u0000/g, '&')
    .replace(/\\(\d)/g, '$$$1')
}

function execEx(v, text) {
  text = text.trim()
  if (!text) return v
  v.usedEx = true
  const { range, rest } = parseRange(v, text)

  // :N — goto line
  if (range && rest === '') {
    v.row = Math.max(0, Math.min(v.lines.length - 1, range[1]))
    v.col = firstNonBlank(v.lines[v.row])
    return v
  }
  const clampRange = (rg) => {
    let [a, b] = rg || [v.row, v.row]
    a = Math.max(0, Math.min(v.lines.length - 1, a))
    b = Math.max(0, Math.min(v.lines.length - 1, b))
    return a <= b ? [a, b] : [b, a]
  }

  // :s/pat/rep/flags
  if (rest[0] === 's' && (rest[1] === '/' || rest.length === 1)) {
    const [a, b] = clampRange(range)
    const parts = splitOnSlash(rest.slice(2))
    const pat = parts[0] || (v.search && v.search.pat)
    if (!pat) { v.lastMessage = 'E33: No previous substitute'; return v }
    const rep = vimRepToJs(parts[1] || '')
    const flags = parts[2] || ''
    const g = flags.includes('g')
    const i = flags.includes('i')
    const re = buildRegex(pat, g ? (i ? 'gi' : 'g') : (i ? 'i' : ''))
    snapshot(v)
    let hits = 0, lastRow = v.row
    for (let r = a; r <= b; r++) {
      const before = v.lines[r]
      if (!g) re.lastIndex = 0
      const after = before.replace(re, rep)
      if (after !== before) { hits++; lastRow = r; v.lines[r] = after }
    }
    if (hits === 0) { v.undo = v.undo.slice(0, -1); v.lastMessage = `E486: Pattern not found: ${pat}` }
    else { v.row = lastRow; v.col = firstNonBlank(v.lines[lastRow]); v.search = { pat, dir: 1 }; v.lastMessage = `${hits} line(s) changed` }
    clampCol(v)
    return v
  }

  // :g/pat/cmd  (d | m{addr} | normal keys)
  if (rest.startsWith('g/')) {
    const parts = splitOnSlash(rest.slice(2))
    const pat = parts[0]
    const sub = (parts[1] || 'd').trim()
    const re = buildRegex(pat)
    const matchRows = []
    for (let r = 0; r < v.lines.length; r++) { re.lastIndex = 0; if (re.test(v.lines[r])) matchRows.push(r) }
    if (!matchRows.length) { v.lastMessage = 'Pattern not found'; return v }
    snapshot(v)
    if (sub === 'd' || sub === '') {
      const kept = v.lines.filter((_, r) => !matchRows.includes(r))
      setReg(v, { text: matchRows.map((r) => v.lines[r]).join('\n'), linewise: true })
      v.lines = kept.length ? kept : ['']
      v.row = Math.min(v.row, v.lines.length - 1)
      clampCol(v)
      return v
    }
    if (sub[0] === 'm' && !sub.startsWith('normal') && !sub.startsWith('norm')) {
      // e.g. the classic reverse idiom :g/^/m0
      const destStr = sub.slice(1).trim()
      const objs = v.lines.map((t) => ({ t }))
      const matched = matchRows.map((r) => objs[r])
      const arr = [...objs]
      for (const mo of matched) {
        const idx = arr.indexOf(mo)
        arr.splice(idx, 1)
        let at
        if (destStr === '0') at = 0
        else if (destStr === '$' || destStr === '') at = arr.length
        else { const dn = parseInt(destStr, 10); at = Number.isNaN(dn) ? arr.length : Math.min(dn, arr.length) }
        arr.splice(at, 0, mo)
      }
      v.lines = arr.map((o) => o.t)
      v.row = Math.min(v.row, v.lines.length - 1)
      clampCol(v)
      return v
    }
    if (sub.startsWith('normal ') || sub.startsWith('norm ')) {
      const keys = sub.replace(/^normal? /, '')
      let cur = v
      // process bottom-up so row indexes stay valid for same-line edits
      for (let i = matchRows.length - 1; i >= 0; i--) {
        cur = { ...clone(cur), row: Math.min(matchRows[i], cur.lines.length - 1), col: 0 }
        for (const k of keys) cur = handleKey(cur, k, { replay: true })
        if (cur.mode === 'insert') cur = handleKey(cur, 'Escape', { replay: true })
      }
      return cur
    }
    return v
  }

  // :d — delete range
  if (rest === 'd') {
    const [a, b] = clampRange(range)
    snapshot(v)
    deleteRange(v, a, 0, b, 0, true)
    return v
  }

  // :m{addr} — move range
  if (rest[0] === 'm' && !rest.startsWith('normal') && !rest.startsWith('norm')) {
    const [a, b] = clampRange(range)
    const addrStr = rest.slice(1).trim()
    let dest
    if (addrStr === '0') dest = -1
    else { const [d] = parseAddr(v, addrStr); dest = d === null ? v.row : d }
    snapshot(v)
    const chunk = v.lines.slice(a, b + 1)
    v.lines.splice(a, b - a + 1)
    let at = dest
    if (dest > b) at = dest - (b - a + 1)
    at = Math.max(-1, Math.min(v.lines.length - 1, at))
    v.lines.splice(at + 1, 0, ...chunk)
    v.row = Math.min(at + chunk.length, v.lines.length - 1)
    clampCol(v)
    return v
  }

  // :normal keys — run keys on each line of range (default current line)
  if (rest.startsWith('normal ') || rest.startsWith('norm ')) {
    const keys = rest.replace(/^normal? /, '')
    const [a, b] = clampRange(range)
    let cur = v
    for (let r = b; r >= a; r--) {
      cur = { ...clone(cur), row: Math.min(r, cur.lines.length - 1), col: 0 }
      for (const k of keys) cur = handleKey(cur, k, { replay: true })
      if (cur.mode === 'insert') cur = handleKey(cur, 'Escape', { replay: true })
    }
    return cur
  }

  v.lastMessage = `E492: Not an editor command: ${text}`
  return v
}

// ---------- command line ----------
function cmdlineKey(v, key) {
  v._noDot = true
  const c = v.cmdline
  if (key === 'Escape') { v.cmdline = null; return v }
  if (key === 'Backspace') {
    if (!c.text.length) { v.cmdline = null; return v }
    v.cmdline = { ...c, text: c.text.slice(0, -1) }
    return v
  }
  if (key === 'Enter') {
    v.cmdline = null
    if (c.type === ':') return execEx(v, c.text)
    // search
    const pat = c.text || (v.search && v.search.pat)
    if (!pat) return v
    const dir = c.type === '/' ? 1 : -1
    v.search = { pat, dir }
    v.usedSearch = true
    const m = findMatch(v, pat, dir)
    if (!m) { v.lastMessage = `E486: Pattern not found: ${pat}`; return v }
    if (c.op) { applyOperator(v, c.op, { row: m.row, col: m.col, excl: true }); return v }
    v.row = m.row; v.col = m.col
    clampCol(v)
    return v
  }
  if (key === 'Tab') return v
  if (key.length === 1) v.cmdline = { ...c, text: c.text + key }
  return v
}

// ---------- main key handler ----------
export function handleKey(vim, key, opts = {}) {
  let v = clone(vim)
  v.lastMessage = ''
  v._noDot = false
  if (!opts.replay) v.keystrokes++

  // stop macro recording (q in clean normal state)
  if (!opts.replay && v.recording && v.mode === 'normal' && !v.pending && !v.cmdline && key === 'q') {
    v.macros = { ...v.macros, [v.recording.reg]: v.recording.keys }
    v.lastMessage = `macro @${v.recording.reg} recorded (${v.recording.keys.length} keys)`
    v.recording = null
    return v
  }
  if (!opts.replay && v.recording) {
    v.recording = { ...v.recording, keys: [...v.recording.keys, key] }
  }

  const beforeText = v.lines.join('\n')
  const beforeMode = v.mode
  v = dispatch(v, key, opts)

  if (!opts.replay) {
    if (v._noDot) { v.dotKeys = []; v.dotChanged = false }
    else {
      const changed = v.lines.join('\n') !== beforeText || (beforeMode !== 'insert' && v.mode === 'insert')
      v.dotKeys = [...v.dotKeys, key]
      if (changed) v.dotChanged = true
      if (v.mode === 'normal' && !v.pending && !v.cmdline) {
        if (v.count === '') {
          if (v.dotChanged) v.lastChange = v.dotKeys
          v.dotKeys = []
          v.dotChanged = false
        }
      }
    }
  }
  return v
}

function num(v) { return v.count ? parseInt(v.count, 10) : 0 }

function dispatch(v, key, opts) {
  if (v.cmdline) return cmdlineKey(v, key)
  if (v.mode === 'insert') return insertKey(v, key)

  if (key === 'Escape') {
    v.pending = ''; v.count = ''; v.useReg = null
    if (v.mode !== 'normal') v.mode = 'normal'
    clampCol(v)
    v._noDot = true
    return v
  }

  // ----- pending multi-key states -----
  if (['f', 'F', 't', 'T'].includes(v.pending)) {
    const res = findCharMotion(v, v.pending, key, num(v))
    v.lastFind = { kind: v.pending, ch: key }
    v.pending = ''; v.count = ''
    if (res) { v.row = res.row; v.col = res.col }
    return v
  }
  if (/^[dcy](f|F|t|T)$/.test(v.pending)) {
    const op = v.pending[0], kind = v.pending[1]
    const res = findCharMotion(v, kind, key, num(v))
    v.lastFind = { kind, ch: key }
    v.pending = ''; v.count = ''
    if (res) applyOperator(v, op, { row: res.row, col: res.col })
    return v
  }
  if (v.pending === 'r') {
    v.pending = ''
    if (key.length === 1) {
      snapshot(v)
      const line = v.lines[v.row]
      if (v.col < line.length) v.lines[v.row] = line.slice(0, v.col) + key + line.slice(v.col + 1)
    }
    return v
  }
  if (/^[dcy][ia]$/.test(v.pending)) {
    const op = v.pending[0], inner = v.pending[1] === 'i'
    v.pending = ''; v.count = ''
    const obj = textObject(v, inner, key)
    if (obj) applyOperator(v, op, obj)
    return v
  }
  if (v.pending === 'g') {
    v.pending = ''
    if (key === 'g') {
      const res = motionResult(v, 'gg', num(v)); v.count = ''
      v.row = res.row; v.col = res.col
    }
    return v
  }
  if (/^[dcy]g$/.test(v.pending)) {
    const op = v.pending[0]; v.pending = ''
    if (key === 'g') { applyOperator(v, op, motionResult(v, 'gg', num(v))); v.count = '' }
    return v
  }
  if (v.pending === 'm') {
    v.pending = ''; v._noDot = true
    if (/^[a-z]$/.test(key)) v.marks = { ...v.marks, [key]: { row: v.row, col: v.col } }
    return v
  }
  if (v.pending === '`' || v.pending === "'") {
    const lw = v.pending === "'"
    v.pending = ''
    const mk = v.marks[key]
    if (mk) {
      v.row = Math.min(mk.row, v.lines.length - 1)
      v.col = lw ? firstNonBlank(v.lines[v.row]) : mk.col
      clampCol(v)
    }
    return v
  }
  if (/^[dcy][`']$/.test(v.pending)) {
    const op = v.pending[0], lw = v.pending[1] === "'"
    v.pending = ''
    const mk = v.marks[key]
    if (mk) {
      const row = Math.min(mk.row, v.lines.length - 1)
      applyOperator(v, op, { row, col: mk.col, linewise: lw, excl: !lw })
    }
    return v
  }
  if (v.pending === '"') {
    v.pending = ''
    if (/^[a-zA-Z0-9]$/.test(key)) v.useReg = key.toLowerCase()
    return v
  }
  if (v.pending === 'qreg') {
    v.pending = ''; v._noDot = true
    if (/^[a-z]$/.test(key)) {
      v.recording = { reg: key, keys: [] }
      v.lastMessage = `recording @${key}…`
    }
    return v
  }
  if (v.pending === '@') {
    v.pending = ''; v._noDot = true
    const reg = key === '@' ? v.lastMacro : key
    const keys = reg && v.macros[reg]
    const n = num(v) || 1; v.count = ''
    if (keys && keys.length) {
      v.lastMacro = reg
      v.usedMacro = true
      let cur = v
      for (let i = 0; i < n; i++) {
        for (const k of keys) cur = handleKey(cur, k, { replay: true })
      }
      if (cur.mode === 'insert') cur = handleKey(cur, 'Escape', { replay: true })
      cur._noDot = true
      return cur
    }
    return v
  }

  // ----- counts -----
  if (/[1-9]/.test(key) || (key === '0' && v.count !== '')) { v.count += key; return v }

  // ----- operator pending -----
  if (['d', 'c', 'y'].includes(v.pending)) {
    const op = v.pending
    if (key === op) {
      const n = num(v) || 1
      const erow = Math.min(v.lines.length - 1, v.row + n - 1)
      applyOperator(v, op, { row: erow, col: 0, linewise: true })
      v.pending = ''; v.count = ''
      return v
    }
    if (key === 'i' || key === 'a') { v.pending = op + key; return v }
    if (['f', 'F', 't', 'T'].includes(key)) { v.pending = op + key; return v }
    if (key === 'g') { v.pending = op + 'g'; return v }
    if (key === '`' || key === "'") { v.pending = op + key; return v }
    if (key === '/') { v.pending = ''; v.cmdline = { type: '/', text: '', op }; v._noDot = true; return v }
    if (key === 'w' && op === 'c') {
      const line = v.lines[v.row]
      if (v.col < line.length && !isSpace(line[v.col])) {
        const res = wordEnd(v.lines, v.row, v.col - 1, false)
        applyOperator(v, op, { row: res.row, col: Math.max(res.col, v.col) })
        v.pending = ''; v.count = ''
        return v
      }
    }
    const res = motionResult(v, key, num(v))
    v.pending = ''; v.count = ''
    if (res) applyOperator(v, op, res)
    return v
  }

  // ----- visual mode -----
  if (v.mode === 'visual' || v.mode === 'visual-line') {
    if (['d', 'x', 'c', 'y', 's'].includes(key)) {
      const lw = v.mode === 'visual-line'
      let [sr, sc, er, ec] = orderRange(v.vrow, v.vcol, v.row, v.col)
      if (lw) { sc = 0; ec = Math.max(0, v.lines[er].length - 1) }
      snapshot(v)
      if (key === 'y') { yankRange(v, sr, sc, er, ec, lw); v.row = sr; v.col = sc; v.mode = 'normal' }
      else {
        if (lw && (key === 'c' || key === 's')) {
          yankRange(v, sr, sc, er, ec, true)
          v.lines.splice(sr, er - sr + 1, '')
          v.row = sr; v.col = 0; v.mode = 'insert'
        } else {
          deleteRange(v, sr, sc, er, ec, lw)
          v.mode = (key === 'c' || key === 's') ? 'insert' : 'normal'
        }
      }
      clampCol(v, v.mode === 'insert')
      return v
    }
    if (key === 'v') { v.mode = v.mode === 'visual' ? 'normal' : 'visual'; return v }
    if (key === 'V') { v.mode = v.mode === 'visual-line' ? 'normal' : 'visual-line'; return v }
    if (key === 'o') { const r = v.row, c = v.col; v.row = v.vrow; v.col = v.vcol; v.vrow = r; v.vcol = c; return v }
  }

  // ----- single keys -----
  switch (key) {
    case 'i': v.mode = 'insert'; snapshot(v); return v
    case 'a': v.mode = 'insert'; snapshot(v); v.col = Math.min(v.lines[v.row].length, v.col + 1); return v
    case 'I': v.mode = 'insert'; snapshot(v); v.col = firstNonBlank(v.lines[v.row]); return v
    case 'A': v.mode = 'insert'; snapshot(v); v.col = v.lines[v.row].length; return v
    case 'o': snapshot(v); v.lines.splice(v.row + 1, 0, ''); v.row++; v.col = 0; v.mode = 'insert'; return v
    case 'O': snapshot(v); v.lines.splice(v.row, 0, ''); v.col = 0; v.mode = 'insert'; return v
    case 'x': {
      snapshot(v)
      const n = num(v) || 1; v.count = ''
      const line = v.lines[v.row]
      if (line.length) {
        const end = Math.min(line.length, v.col + n)
        setReg(v, { text: line.slice(v.col, end), linewise: false })
        v.lines[v.row] = line.slice(0, v.col) + line.slice(end)
      }
      clampCol(v); return v
    }
    case 'X': { snapshot(v); const line = v.lines[v.row]; if (v.col > 0) { v.lines[v.row] = line.slice(0, v.col - 1) + line.slice(v.col); v.col-- } return v }
    case 's': { snapshot(v); const line = v.lines[v.row]; if (line.length) v.lines[v.row] = line.slice(0, v.col) + line.slice(v.col + 1); v.mode = 'insert'; return v }
    case 'S': { snapshot(v); setReg(v, { text: v.lines[v.row], linewise: true }); v.lines[v.row] = ''; v.col = 0; v.mode = 'insert'; return v }
    case 'D': { snapshot(v); const line = v.lines[v.row]; setReg(v, { text: line.slice(v.col), linewise: false }); v.lines[v.row] = line.slice(0, v.col); clampCol(v); return v }
    case 'C': { snapshot(v); const line = v.lines[v.row]; setReg(v, { text: line.slice(v.col), linewise: false }); v.lines[v.row] = line.slice(0, v.col); v.mode = 'insert'; return v }
    case 'Y': setReg(v, { text: v.lines[v.row], linewise: true }); return v
    case 'J': {
      snapshot(v)
      const n = Math.max(2, num(v) || 2) - 1; v.count = ''
      for (let i = 0; i < n && v.row < v.lines.length - 1; i++) {
        const cur = v.lines[v.row].replace(/\s+$/, '')
        const next = v.lines[v.row + 1].replace(/^\s+/, '')
        v.col = cur.length
        v.lines[v.row] = cur + (cur && next ? ' ' : '') + next
        v.lines.splice(v.row + 1, 1)
      }
      return v
    }
    case 'p': case 'P': {
      const n = num(v) || 1; v.count = ''
      for (let i = 0; i < n; i++) put(v, key === 'p')
      return v
    }
    case 'u': {
      v._noDot = true
      if (v.undo.length) {
        const cur = { lines: [...v.lines], row: v.row, col: v.col }
        const prev = v.undo[v.undo.length - 1]
        v.undo = v.undo.slice(0, -1)
        v.redo = [...v.redo, cur]
        v.lines = [...prev.lines]; v.row = prev.row; v.col = prev.col
        clampCol(v)
      }
      return v
    }
    case '~': {
      snapshot(v)
      const line = v.lines[v.row]
      if (line.length) {
        const c = line[v.col]
        v.lines[v.row] = line.slice(0, v.col) + (c === c.toLowerCase() ? c.toUpperCase() : c.toLowerCase()) + line.slice(v.col + 1)
        v.col = Math.min(line.length - 1, v.col + 1)
      }
      return v
    }
    case ';': if (v.lastFind) { const r = findCharMotion(v, v.lastFind.kind, v.lastFind.ch, 1); if (r) { v.row = r.row; v.col = r.col } } return v
    case ',': if (v.lastFind) {
      const flip = { f: 'F', F: 'f', t: 'T', T: 't' }[v.lastFind.kind]
      const r = findCharMotion(v, flip, v.lastFind.ch, 1); if (r) { v.row = r.row; v.col = r.col }
    } return v
    case 'd': case 'c': case 'y': v.pending = key; return v
    case 'f': case 'F': case 't': case 'T': case 'r': v.pending = key; return v
    case 'g': v.pending = 'g'; return v
    case 'm': v.pending = 'm'; return v
    case '`': v.pending = '`'; return v
    case "'": v.pending = "'"; return v
    case '"': v.pending = '"'; return v
    case 'v': v.mode = 'visual'; v.vrow = v.row; v.vcol = v.col; return v
    case 'V': v.mode = 'visual-line'; v.vrow = v.row; v.vcol = v.col; return v
    case ':': v.cmdline = { type: ':', text: '', op: null }; v._noDot = true; return v
    case '/': v.cmdline = { type: '/', text: '', op: null }; v._noDot = true; return v
    case '?': v.cmdline = { type: '?', text: '', op: null }; v._noDot = true; return v
    case 'n': case 'N': {
      if (v.search) {
        const dir = key === 'n' ? v.search.dir : -v.search.dir
        const m = findMatch(v, v.search.pat, dir)
        if (m) { v.row = m.row; v.col = m.col; clampCol(v) }
        else v.lastMessage = 'Pattern not found'
      }
      return v
    }
    case '*': {
      const line = v.lines[v.row]
      if (!line.length) return v
      let s = v.col, e = v.col
      if (!isWord(line[s])) { while (s < line.length && !isWord(line[s])) s++; e = s }
      if (s >= line.length) return v
      while (s > 0 && isWord(line[s - 1])) s--
      while (e < line.length - 1 && isWord(line[e + 1])) e++
      const word = line.slice(s, e + 1)
      v.search = { pat: `\\b${escapeRe(word)}\\b`, dir: 1 }
      v.usedSearch = true
      const m = findMatch(v, v.search.pat, 1)
      if (m) { v.row = m.row; v.col = m.col; clampCol(v) }
      return v
    }
    case 'q': v.pending = 'qreg'; v._noDot = true; return v
    case '@': v.pending = '@'; return v
    case '.': {
      v._noDot = true
      if (!v.lastChange) return v
      v.usedDot = true
      const n = num(v) || 1; v.count = ''
      let cur = v
      for (let i = 0; i < n; i++) {
        for (const k of v.lastChange) cur = handleKey(cur, k, { replay: true })
      }
      if (cur.mode === 'insert') cur = handleKey(cur, 'Escape', { replay: true })
      cur._noDot = true
      return cur
    }
    case 'Enter': { const res = motionResult(v, 'j', num(v)); v.count = ''; v.row = res.row; clampCol(v); return v }
  }

  // plain motion fallback
  const res = motionResult(v, key, num(v))
  if (res) {
    v.count = ''
    v.row = res.row; v.col = res.col
    if (v.mode === 'normal') clampCol(v)
    return v
  }
  v.count = ''
  return v
}

function insertKey(v, key) {
  if (key === 'Escape') { v.mode = 'normal'; v.col = Math.max(0, v.col - 1); clampCol(v); return v }
  const line = v.lines[v.row]
  if (key === 'Enter') {
    const before = line.slice(0, v.col), after = line.slice(v.col)
    v.lines[v.row] = before
    v.lines.splice(v.row + 1, 0, after)
    v.row++; v.col = 0
    return v
  }
  if (key === 'Backspace') {
    if (v.col > 0) { v.lines[v.row] = line.slice(0, v.col - 1) + line.slice(v.col); v.col-- }
    else if (v.row > 0) {
      const prev = v.lines[v.row - 1]
      v.lines[v.row - 1] = prev + line
      v.lines.splice(v.row, 1)
      v.row--; v.col = prev.length
    }
    return v
  }
  if (key === 'Tab') { v.lines[v.row] = line.slice(0, v.col) + '  ' + line.slice(v.col); v.col += 2; return v }
  if (key.length === 1) {
    v.lines[v.row] = line.slice(0, v.col) + key + line.slice(v.col)
    v.col++
  }
  return v
}

export function getText(v) { return v.lines.join('\n') }
