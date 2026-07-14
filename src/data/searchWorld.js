// World 4.6: Search & Substitute Mastery
// Deep dive on /, ?, n, N, *, :s, capture groups, :g

export const searchWorld = {
  id: 'w46', name: 'World 4.6 · Search & Substitute', icon: 'search',
  tagline: 'Find anything. Rewrite everything. Regex is a superpower once it clicks.',
  lessons: [
    {
      id: 'w46l1', type: 'info', title: 'Search is a motion',
      body: `In NORMAL mode:

- \`/pattern\` then Enter — search **forward**
- \`?pattern\` then Enter — search **backward**
- \`n\` — next match · \`N\` — previous match
- \`*\` — search the **word under the cursor** forward

Search is also an **operator motion**: \`d/END\` + Enter deletes from the cursor up to
(but not including) the next \`END\`. Same idea with \`c/\` and \`y/\`.

This simulator uses **JavaScript regex** for patterns (close to Vim's \`\\v\` very-magic
mode). Capture groups are \`(…)\`, not \`\\(…\\)\`.`,
    },
    {
      id: 'w46l2', type: 'drill', title: 'Jump with /',
      body: `Search forward for \`treasure\` and land on its first letter.
Type \`/treasure\` then Enter.`,
      drill: {
        start: 'noise noise noise treasure noise',
        cursorGoal: { row: 0, col: 18 }, par: 10, hint: '/treasure Enter',
      },
    },
    {
      id: 'w46l3', type: 'drill', title: 'Star and next',
      body: `Cursor starts on the first \`foo\`. Press \`*\` to search that word, then \`n\` twice
to land on the **third** \`foo\`.`,
      drill: {
        start: 'foo bar foo baz foo end',
        startCursor: { row: 0, col: 0 },
        cursorGoal: { row: 0, col: 16 }, par: 3, hint: '* n n — star, next, next',
      },
    },
    {
      id: 'w46l4', type: 'info', title: 'Substitute anatomy: :s',
      body: `The ex command \`:s\` rewrites text:

\`\`\`
:[range]s/pattern/replacement/flags
\`\`\`

- **No range** — current line only
- \`%\` — whole file (\`:%s/…\`)
- \`2,5\` — lines 2 through 5
- Flag \`g\` — every match on the line (not just the first)
- Flag \`i\` — case-insensitive (when supported)

Examples:
- \`:s/foo/bar/\` — first \`foo\` on this line → \`bar\`
- \`:%s/foo/bar/g\` — every \`foo\` in the file → \`bar\`

**Replacement side (Vim-style):** \`\\1\` \`\\2\` are capture groups; \`&\` is the whole match.
**Pattern side (this app):** JavaScript regex — write \`(\\w+)\` for a word group.`,
    },
    {
      id: 'w46l5', type: 'drill', title: 'Single-line substitute',
      body: `On this one line, change \`old\` to \`new\` with \`:s\`.`,
      drill: {
        start: 'replace old value here',
        target: 'replace new value here',
        par: 12, hint: ':s/old/new/ Enter',
      },
    },
    {
      id: 'w46l6', type: 'drill', title: 'File-wide rename',
      body: `Rename every \`tmp\` to \`buf\` across all lines. You need \`%\` and \`g\`.`,
      drill: {
        start: 'tmp = 1\nprint(tmp)\nreturn tmp',
        target: 'buf = 1\nprint(buf)\nreturn buf',
        par: 14, hint: ':%s/tmp/buf/g Enter',
      },
    },
    {
      id: 'w46l7', type: 'info', title: 'Capture groups and &',
      body: `Groups let you *rearrange* matches instead of only replacing them:

\`\`\`
:%s/(\\w+) (\\w+)/\\2 \\1/
\`\`\`

That swaps two words: first group \`\\1\`, second \`\\2\`.

\`&\` in the replacement means "the entire match":

\`\`\`
:%s/\\d+/[&]/g
\`\`\`

Wraps every number in brackets: \`7\` → \`[7]\`.

Practice counting keystrokes: long substitutes still beat ten manual edits.`,
    },
    {
      id: 'w46l8', type: 'drill', title: 'Swap the columns',
      body: `Swap first and last names on both lines using a capture-group substitute.`,
      drill: {
        start: 'ada lovelace\nalan turing',
        target: 'lovelace ada\nturing alan',
        par: 23, hint: ':%s/(\\w+) (\\w+)/\\2 \\1/ Enter',
      },
    },
    {
      id: 'w46l9', type: 'drill', title: 'Global purge',
      body: `Delete every line containing \`DROP\`. \`:g/pat/d\` runs delete on matching lines.`,
      drill: {
        start: 'keep\nDROP this\nkeep too\nDROP that\nkeep end',
        target: 'keep\nkeep too\nkeep end',
        par: 10, hint: ':g/DROP/d Enter',
      },
    },
    {
      id: 'w46l10', type: 'quiz', title: 'Search & substitute final',
      quiz: [
        { q: 'n after a search does what?', choices: ['New file', 'Next match', 'Normal mode', 'Nothing'], answer: 1, explain: 'n = next match in the last search direction.' },
        { q: '* searches for:', choices: ['Any character', 'The word under the cursor', 'The last yank', 'Line numbers'], answer: 1, explain: 'Star grabs the current word and searches forward.' },
        { q: ':%s/foo/bar/g means:', choices: ['First foo only', 'Every foo on every line → bar', 'Delete foo', 'Only line 1'], answer: 1, explain: '% = all lines, g = all matches per line.' },
        { q: 'In the replacement, \\1 refers to:', choices: ['Literal backslash-1', 'The first capture group', 'Line 1', 'Register 1'], answer: 1, explain: 'Backreferences pull captured submatches into the replacement.' },
        { q: ':g/DEBUG/d does:', choices: ['Deletes the word DEBUG only', 'Deletes every line matching DEBUG', 'Debugs the buffer', 'Global undo'], answer: 1, explain: ':g runs a command on matching lines; d deletes them.' },
        { q: 'd/END Enter deletes:', choices: ['The word END', 'From cursor up to (not including) END', 'The whole file', 'Nothing'], answer: 1, explain: 'Search is a motion; d + motion deletes the span.' },
      ],
    },
  ],
}
