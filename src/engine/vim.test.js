import test from 'node:test'
import assert from 'node:assert/strict'
import { createVim, handleKey, getText } from './vim.js'

// seq: string with <Esc> <CR> <BS> tokens
function keys(s) {
  const out = []
  let i = 0
  while (i < s.length) {
    if (s.startsWith('<Esc>', i)) { out.push('Escape'); i += 5 }
    else if (s.startsWith('<CR>', i)) { out.push('Enter'); i += 4 }
    else if (s.startsWith('<BS>', i)) { out.push('Backspace'); i += 4 }
    else { out.push(s[i]); i++ }
  }
  return out
}

function run(text, keySeq, cursor) {
  let v = createVim(text)
  if (cursor) { v.row = cursor[0]; v.col = cursor[1] }
  for (const k of keys(keySeq)) v = handleKey(v, k)
  return v
}

// ---------- legacy behaviors ----------
test('insert and escape', () => {
  const v = run('', 'ihello<Esc>')
  assert.equal(getText(v), 'hello')
  assert.equal(v.mode, 'normal')
})

test('dw deletes word', () => {
  const v = run('foo bar baz', 'dw')
  assert.equal(getText(v), 'bar baz')
})

test('d2w with count', () => {
  const v = run('one two three four', 'd2w')
  assert.equal(getText(v), 'three four')
})

test('ciw from middle of word', () => {
  const v = run('the wrong answer', 'ciwright<Esc>', [0, 6])
  assert.equal(getText(v), 'the right answer')
})

test('ci" inside quotes', () => {
  const v = run('msg = "TODO: fix"', 'ci"done<Esc>', [0, 9])
  assert.equal(getText(v), 'msg = "done"')
})

test('dd and p line move', () => {
  const v = run('first\nthird\nsecond', 'jddp')
  assert.equal(getText(v), 'first\nsecond\nthird')
})

test('yy3p quadruples line', () => {
  const v = run('SPAM', 'yy3p')
  assert.equal(getText(v), 'SPAM\nSPAM\nSPAM\nSPAM')
})

test('f and ; find', () => {
  const v = run('one to move onto obviously', 'fo;;')
  assert.equal(v.col, 12)
})

test('A appends at end of line', () => {
  const v = run('(vim is grea', 'At)<Esc>')
  assert.equal(getText(v), '(vim is great)')
})

test('x with count', () => {
  const v = run('emzzacs', 'll2x')
  assert.equal(getText(v), 'emacs')
})

test('J joins lines', () => {
  const v = run('vim\nis\neternal', '3J')
  assert.equal(getText(v), 'vim is eternal')
})

test('xp swaps chars', () => {
  const v = run('teh quick', 'lxp')
  assert.equal(getText(v), 'the quick')
})

test('u undoes', () => {
  const v = run('hello', 'ddu')
  assert.equal(getText(v), 'hello')
})

test('~ toggles case', () => {
  const v = run('emacs', '~')
  assert.equal(getText(v), 'Emacs')
})

// ---------- dot repeat ----------
test('. repeats x', () => {
  const v = run('abcdef', 'x..')
  assert.equal(getText(v), 'def')
})

test('. repeats dw across lines', () => {
  const v = run('foo one\nfoo two\nfoo three', 'dwj.j.')
  assert.equal(getText(v), 'one\ntwo\nthree')
})

test('. repeats insert change', () => {
  const v = run('a\nb', 'A!<Esc>j.')
  assert.equal(getText(v), 'a!\nb!')
})

test('. repeats ciw', () => {
  const v = run('foo foo', 'ciwbar<Esc>w.')
  assert.equal(getText(v), 'bar bar')
})

// ---------- macros ----------
test('macro records and replays', () => {
  const v = run('a\nb\nc\nd', 'qaA;<Esc>jq3@a')
  assert.equal(getText(v), 'a;\nb;\nc;\nd;')
})

test('@@ repeats last macro', () => {
  const v = run('a\nb\nc', 'qaA!<Esc>jq@a@@')
  assert.equal(getText(v), 'a!\nb!\nc!')
})

test('macro keystrokes count only the typed keys', () => {
  const v = run('a\nb\nc\nd\ne', 'qaA;<Esc>jq4@a')
  assert.equal(v.keystrokes, 10) // q a A ; Esc j q 4 @ a
  assert.equal(getText(v), 'a;\nb;\nc;\nd;\ne;')
})

// ---------- search ----------
test('/ search moves cursor', () => {
  const v = run('one two\nthree needle four', '/needle<CR>')
  assert.equal(v.row, 1)
  assert.equal(v.col, 6)
})

test('n repeats search with wrap', () => {
  const v = run('foo x\nbar\nfoo y', '/foo<CR>n')
  assert.equal(v.row, 0)
  assert.equal(v.col, 0)
})

test('d/pattern operator', () => {
  const v = run('delete this KEEP me', 'd/KEEP<CR>')
  assert.equal(getText(v), 'KEEP me')
})

test('* searches word under cursor', () => {
  const v = run('alpha beta\ngamma alpha', '*')
  assert.equal(v.row, 1)
  assert.equal(v.col, 6)
})

// ---------- ex commands ----------
test(':%s global substitute', () => {
  const v = run('foo a foo\nfoo b', ':%s/foo/bar/g<CR>')
  assert.equal(getText(v), 'bar a bar\nbar b')
})

test(':s current line only', () => {
  const v = run('foo\nfoo', ':s/foo/bar/<CR>')
  assert.equal(getText(v), 'bar\nfoo')
})

test(':%s with capture group', () => {
  const v = run('john smith', ':%s/(\\w+) (\\w+)/\\2 \\1/<CR>')
  assert.equal(getText(v), 'smith john')
})

test(':%s with & reference', () => {
  const v = run('num', ':%s/num/[&]/<CR>')
  assert.equal(getText(v), '[num]')
})

test(':g/pat/d deletes matching lines', () => {
  const v = run('keep\nDEBUG x\nkeep2\nDEBUG y', ':g/DEBUG/d<CR>')
  assert.equal(getText(v), 'keep\nkeep2')
})

test(':g/^/m0 reverses file', () => {
  const v = run('1\n2\n3\n4', ':g/^/m0<CR>')
  assert.equal(getText(v), '4\n3\n2\n1')
})

test(':m moves line', () => {
  const v = run('a\nb\nc', ':1m$<CR>')
  assert.equal(getText(v), 'b\nc\na')
})

test(':N jumps to line', () => {
  const v = run('a\nb\nc\nd', ':3<CR>')
  assert.equal(v.row, 2)
})

test(':2,3d deletes range', () => {
  const v = run('a\nb\nc\nd', ':2,3d<CR>')
  assert.equal(getText(v), 'a\nd')
})

test(':%normal appends per line', () => {
  const v = run('a\nb\nc', ':%normal A;<CR>')
  assert.equal(getText(v), 'a;\nb;\nc;')
})

test('ex keystrokes counted per char', () => {
  const v = run('foo', ':%s/foo/ba/g<CR>')
  assert.equal(v.keystrokes, 13)
})

// ---------- marks ----------
test('marks: ma and backtick jump', () => {
  const v = run('one\ntwo\nthree', 'llmaGgg`a')
  assert.equal(v.row, 0)
  assert.equal(v.col, 2)
})

test("d'a linewise delete to mark", () => {
  const v = run('a\nb\nc\nd', "majjd'a")
  assert.equal(getText(v), 'd')
})

// ---------- registers ----------
test('named register yank/paste', () => {
  const v = run('keep me\ntrash', '"ayyjdd"ap')
  assert.equal(getText(v), 'keep me\nkeep me')
})

// ---------- flags ----------
test('usage flags set correctly', () => {
  const v = run('foo foo foo', 'x.qax q@a:s/o/0/<CR>/f<CR>')
  assert.ok(v.usedDot)
  assert.ok(v.usedMacro)
  assert.ok(v.usedEx)
  assert.ok(v.usedSearch)
})
