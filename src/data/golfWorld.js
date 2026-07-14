// World 4: VimGolf Dojo — challenges inspired by classic vimgolf.com puzzles.
// Score = total keystrokes. Gold ≤ par, Silver ≤ par+4, Bronze = finished.

export const golfWorld = {
  id: 'w4', name: 'World 4 · VimGolf Dojo', icon: 'golf',
  tagline: 'Real golf rules: transform start → target in the fewest keystrokes. Every key counts, even Escape.',
  lessons: [
    {
      id: 'w4l0', type: 'info', title: 'How VimGolf works',
      body: `[VimGolf](https://www.vimgolf.com) is a real competitive site: you're given a start file
and an end file, and you submit the keystroke sequence that transforms one into the other.
**Every keystroke counts — including Escape and Enter.** Leaderboards are brutal:
top players solve non-trivial edits in single-digit strokes.

Golfer's toolbox, in rough order of power:

1. **Counts** — \`3w\` beats \`www\`; \`2dd\` beats \`dddd\`... wait, \`dddd\` is dd twice — \`2dd\` still wins by 1.
2. **The right insert door** — \`A\` vs \`$a\`, \`I\` vs \`0i\`, \`o\` vs \`A⏎\`.
3. **f/t + operators** — \`dt,\` \`cf)\` are 3-key surgical strikes.
4. **Text objects** — \`ciw\` \`di"\` \`ca(\` work from anywhere inside.
5. **In real Vim:** the dot command \`.\`, macros \`qq...q@q\`, \`:s\` regex, \`:g\`, \`:norm\`.
   The simulator here covers 1–4; quizzes cover 5 so you're ready for the real site.

Each hole below shows a **par**. Beat or match it for gold. Reset costs nothing — retry freely!`,
    },
    {
      id: 'w4l1', type: 'golf', title: 'Hole 1 · Typo strike',
      body: 'One character is wrong. Fix `teh` → `the`. Remember: `r` replaces without insert mode... but here two chars are swapped — the ancient `xp` trick swaps a char with the next one.',
      drill: { start: 'teh quick brown fox', target: 'the quick brown fox', par: 3, hint: 'l xp — move onto "e", then xp swaps e/h' },
    },
    {
      id: 'w4l2', type: 'golf', title: 'Hole 2 · Delete the middleman',
      body: 'Remove ` really really` (both words). One operator, one count, one motion.',
      drill: { start: 'vim is really really great', target: 'vim is great', par: 5, hint: 'ww then d2w — or fr d2w (4 keys). Even better: 2w2dw? Count placement matters!' },
    },
    {
      id: 'w4l3', type: 'golf', title: 'Hole 3 · Quote swap',
      body: 'Change the URL inside the quotes to `localhost`. You start at column 0 — text objects don\'t care.',
      drill: { start: 'fetch("https://api.example.com/v2/users")', target: 'fetch("localhost")', par: 13, hint: 'ci" localhost Escape — 3 + 9 + 1 = 13' },
    },
    {
      id: 'w4l4', type: 'golf', title: 'Hole 4 · Reverse the lines',
      body: 'Three lines, reverse their order: `a b c` → `c b a`. Think ddp / ddGp.',
      drill: { start: 'alpha\nbeta\ngamma', target: 'gamma\nbeta\nalpha', par: 8, hint: 'ddGp ggddp = 9. But the legendary :g/^/m0⏎ = 8 — taught in the back nine, works right now!' },
    },
    {
      id: 'w4l5', type: 'golf', title: 'Hole 5 · Semicolon plague',
      body: 'A JS refugee left semicolons at the end of every line. Delete all three. `$x` per line, or think about what J and A could do... (In real Vim: `:%s/;$//` — 9 keys total!)',
      drill: { start: 'let a = 1;\nlet b = 2;\nlet c = 3;', target: 'let a = 1\nlet b = 2\nlet c = 3', par: 9, hint: '$x j$x j$x = 9. Or :%s/;//⏎ = 9. Or $x j. j. = 7 with the dot command!' },
    },
    {
      id: 'w4l6', type: 'golf', title: 'Hole 6 · Wrap it up',
      body: 'Turn `answer` into `(answer)`. You need one `(` before and one `)` after.',
      drill: { start: 'answer', target: '(answer)', par: 7, hint: 'i( Escape A) Escape — 6! or I( Escape A) Escape' },
    },
    {
      id: 'w4l7', type: 'golf', title: 'Hole 7 · Case closed',
      body: 'Capitalize the first letter of the line: `emacs` → `Emacs`. There is a one-key operator for toggling case...',
      drill: { start: 'emacs is an operating system', target: 'Emacs is an operating system', par: 1, hint: '~ — toggle case under cursor. One. Single. Key.' },
    },
    {
      id: 'w4l8', type: 'golf', title: 'Hole 8 · Extract the value',
      body: 'Keep only what\'s inside the brackets: `[keepme]` surrounded by junk → `keepme`. Plan: yank inside brackets, select all, paste over? Simpler: delete before, delete after.',
      drill: { start: 'junk junk [keepme] more junk', target: 'keepme', par: 6, hint: 'df[ f] D — delete through [, find ], delete to end. Six keys.' },
    },
    {
      id: 'w4l9', type: 'golf', title: 'Hole 9 · Line quadrupler',
      body: 'Classic vimgolf warm-up: turn one line into four identical lines.',
      drill: { start: 'SPAM', target: 'SPAM\nSPAM\nSPAM\nSPAM', par: 4, hint: 'yy3p' },
    },
    {
      id: 'w4l10', type: 'golf', title: 'Hole 10 · The rename',
      body: 'Rename every `foo` on the line to `bar` — there are two. Without `:s` or `.`, you\'ll pay full price; plan your route. (Real Vim: `:s/foo/bar/g⏎` = 13 keys, or cgn tricks.)',
      drill: { start: 'foo(1) + foo(2)', target: 'bar(1) + bar(2)', par: 9, hint: 'cwbar⏎… no wait: cwbar⎋ ff . — change once, find the next f, dot-repeat. 9 keys!' },
    },
    {
      id: 'w4l11', type: 'golf', title: 'Hole 11 · Join the party',
      body: 'Collapse three lines into one sentence separated by single spaces. `J` joins the line below with a space.',
      drill: { start: 'vim\nis\neternal', target: 'vim is eternal', par: 2, hint: '2J? No — J twice = JJ (2 keys). Or 3J (2 keys). Both = 2.' },
    },
    {
      id: 'w4l12', type: 'golf', title: 'Hole 12 · Boss hole: refactor',
      body: 'Change the function body: `return 0` should become `return compute(x)`, and rename `stub` to `main`. Two edits, plan the cheapest route between them.',
      drill: {
        start: 'function stub() {\n  return 0\n}',
        target: 'function main() {\n  return compute(x)\n}',
        par: 26,
        hint: 'fs cw main Esc j $ ... or: wcwmain<Esc>j$xacompute(x)? Count carefully — $ then x kills 0, then a…',
      },
    },
    {
      id: 'w4l28', type: 'golf', title: 'Hole 27 · Prefix power',
      body: 'Add `// ` at the start of the line. `I` jumps to first non-blank in insert mode — perfect for prefixes.',
      drill: { start: 'important note', target: '// important note', par: 5, hint: 'I// ␣ Escape — or I// space Esc' },
    },
    {
      id: 'w4l29', type: 'golf', title: 'Hole 28 · Change to end',
      body: 'Replace everything from `old` onward with `new`. Cursor starts mid-line. `C` = change to end of line (delete + insert).',
      drill: { start: 'keep old junk here', startCursor: { row: 0, col: 5 }, target: 'keep new', requireNormal: true, par: 6, hint: 'C new Escape' },
    },
    {
      id: 'w4l30', type: 'golf', title: 'Hole 29 · Substitute one',
      body: '`s` deletes the char under the cursor and enters insert. Fix `bax` → `bar` in one motion.',
      drill: { start: 'bax', startCursor: { row: 0, col: 2 }, target: 'bar', requireNormal: true, par: 3, hint: 's r Escape' },
    },
    {
      id: 'w4l13i', type: 'info', title: 'The Back Nine: new weapons unlocked',
      body: `From here on, the simulator supports the full pro toolkit — use it:

- **\`.\`** — repeat the last change. One edit + n dots = n edits.
- **\`q{a-z}…q\` / \`{n}@{a-z}\` / \`@@\`** — macros. Watch the ● indicator while recording.
- **\`/pat⏎\` \`?pat⏎\` \`n\` \`N\` \`*\`** — search. Also works as an operator motion: \`d/END⏎\`.
- **\`:\` ex commands** — \`:%s/pat/rep/g\`, \`:g/pat/d\`, \`:g/^/m0\`, \`:m\`, \`:2,4d\`, \`:%normal A;\`.
- **Marks** \`ma\` + \`\\\`a\` and **registers** \`"ayy "ap\`.

> **One caveat:** this simulator uses **JavaScript regex** syntax — write \`(\\w+)\` for groups
> (real Vim needs \`\\(\\w\\+\\)\` unless you use \`\\v\` “very magic” mode, which looks just like JS).
> Replacement side is Vim-style: \`\\1\` and \`&\` work as expected.

**Golf rule of thumb:** interactive edits win small jobs; \`.\` wins 2–5 repeats;
macros and \`:%s\` win everything bigger. Choose your weapon by counting first.`,
    },
    {
      id: 'w4l14', type: 'golf', title: 'Hole 13 · Search and destroy',
      body: 'Delete everything before `END`. The search motion `d/END⏎` cuts from cursor up to (not including) the match.',
      drill: { start: 'delete all of this junk END keep this', target: 'END keep this', par: 6, hint: 'd/END⏎ — d / E N D Enter = 6' },
    },
    {
      id: 'w4l15', type: 'golf', title: 'Hole 14 · The great rename',
      body: 'Rename ALL `foo` to `bar` — five of them across three lines. Interactive editing would cost a fortune; the substitute command charges a flat fee.',
      drill: { start: 'foo = foo + 1\nprint(foo, foo)\nreturn foo', target: 'bar = bar + 1\nprint(bar, bar)\nreturn bar', par: 14, hint: ':%s/foo/bar/g⏎ = 14 keys for unlimited replacements' },
    },
    {
      id: 'w4l16', type: 'golf', title: 'Hole 15 · Purge the debug lines',
      body: 'Delete every line containing `DEBUG`. The `:g` (global) command runs a command on every matching line.',
      drill: { start: 'main()\nDEBUG x=1\nprocess()\nDEBUG y=2\nsave()\nDEBUG done', target: 'main()\nprocess()\nsave()', par: 11, hint: ':g/DEBUG/d⏎ = 11 keys, works on 3 lines or 3000' },
    },
    {
      id: 'w4l17', type: 'golf', title: 'Hole 16 · Macro assembly line',
      body: 'Append a `;` to all five lines. Record once, replay four times — or find something even cheaper…',
      drill: { start: 'let a = 1\nlet b = 2\nlet c = 3\nlet d = 4\nlet e = 5', target: 'let a = 1;\nlet b = 2;\nlet c = 3;\nlet d = 4;\nlet e = 5;', par: 10, hint: 'qaA;⎋jq4@a = 10. Also 10: :%norm A;⏎. Also 10: A;⎋j.j.j.j. — wait, that\u2019s 11. Macro wins.' },
    },
    {
      id: 'w4l18', type: 'golf', title: 'Hole 17 · Dot sweep',
      body: 'Delete the first word of each line. One `dw`, then let the dot command do the walking.',
      drill: { start: 'junk keep this line\njunk and this one\njunk this too', target: 'keep this line\nand this one\nthis too', par: 6, hint: 'dw j. j. — 6 keys' },
    },
    {
      id: 'w4l19', type: 'golf', title: 'Hole 18 · Line elevator',
      body: 'Move the last line to the top. `:m` moves lines to any address: `:$m0` = \u201cmove the last line after line 0\u201d.',
      drill: { start: 'second\nthird\nfourth\nfirst', target: 'first\nsecond\nthird\nfourth', par: 5, hint: ':$m0⏎ = 5. Normal-mode Gddggp… wait ggP: G dd gg P = 6.' },
    },
    {
      id: 'w4l20', type: 'golf', title: 'Hole 19 · Name flipper',
      body: 'Swap first and last names on both lines: `john smith` → `smith john`. Capture groups: `(\\w+)` captures, `\\1 \\2` reference. (JS regex on the pattern side!)',
      drill: { start: 'john smith\nada lovelace', target: 'smith john\nlovelace ada', par: 23, hint: ':%s/(\\w+) (\\w+)/\\2 \\1/⏎ — 23 keys, any number of lines' },
    },
    {
      id: 'w4l21', type: 'golf', title: 'Hole 20 · Bracket the numbers',
      body: 'Wrap every number in square brackets: `7` → `[7]`. In the replacement, `&` means \u201cthe whole match\u201d.',
      drill: { start: 'ports 80 and 443 and 8080', target: 'ports [80] and [443] and [8080]', par: 13, hint: ':%s/\\d+/[&]/g⏎ — 14 keys with g… count again: : % s / \\ d + / [ & ] / g ⏎ = 14? The g IS required. Par is generous.' },
    },
    {
      id: 'w4l22', type: 'golf', title: 'Hole 21 · The grand reversal',
      body: 'Reverse all five lines. The legendary idiom: `:g/^/m0` — every line matches `^`, and each gets moved to the top in turn, reversing the file.',
      drill: { start: '1\n2\n3\n4\n5', target: '5\n4\n3\n2\n1', par: 8, hint: ':g/^/m0⏎ — 8 keys for any file length. Pure magic.' },
    },
    {
      id: 'w4l23', type: 'golf', title: 'Hole 22 · Normal for all',
      body: 'Comment out all four lines with `#`. `:%normal` runs normal-mode keys on every line in the range.',
      drill: { start: 'alpha\nbeta\ngamma\ndelta', target: '#alpha\n#beta\n#gamma\n#delta', par: 11, hint: ':%norm I#⏎ = 10 — or the macro route qaI#⎋jq3@a = 11' },
    },
    {
      id: 'w4l24', type: 'golf', title: 'Hole 23 · Star power rename',
      body: 'Rename all three `cnt` to `total`. Cursor starts on the first one. `*` searches the word under the cursor — combine with `ciw`, `n`, and `.` for a surgical refactor.',
      drill: { start: 'cnt = 0\ncnt += n\nreturn cnt', target: 'total = 0\ntotal += n\nreturn total', par: 14, hint: '* ciwtotal⎋ n. n. — star, change, then n-dot n-dot. 14 keys (beats :%s at 16!)' },
    },
    {
      id: 'w4l25', type: 'golf', title: 'Hole 24 · BOSS HOLE: the refactor gauntlet',
      body: 'Two edits: `var` → `let` on line 2, and delete the unused `extra` line. Plan the cheapest combined route — every weapon is legal.',
      drill: {
        start: 'function calc(x) {\n  var result = x + 1;\n  var extra = 0;\n  return result;\n}',
        target: 'function calc(x) {\n  let result = x + 1;\n  return result;\n}',
        par: 13,
        hint: 'j^ciwlet⎋ jdd = 10+3 = 13. Or :3d⏎ + :s/var/let/⏎… count it yourself, golfer.',
      },
    },
    {
      id: 'w4l26', type: 'golf', title: 'Hole 25 · Double vision',
      body: 'A stutter: `the the` — delete the duplicate word. Text objects work from anywhere on the word, and `aw` grabs its trailing space too.',
      drill: { start: 'the the end is near', target: 'the end is near', par: 3, hint: 'daw — delete a word, space included. 3 keys.' },
    },
    {
      id: 'w4l27', type: 'golf', title: 'Hole 26 · Range purge',
      body: 'Delete lines 2 through 4 in one command. Ex ranges take two line numbers: `:2,4d` means "delete lines 2 to 4".',
      drill: { start: 'keep\ntrash a\ntrash b\ntrash c\nkeep too', target: 'keep\nkeep too', par: 6, hint: ':2,4d⏎ = 6 keys. Normal mode j3dd = 4! Count both routes before you swing.' },
    },
    {
      id: 'w4l13', type: 'quiz', title: 'Pro golfer theory (real Vim powers)',
      quiz: [
        { q: 'The dot command `.` does what?', choices: ['Repeats the last motion', 'Repeats the last change', 'Redoes an undo', 'Nothing'], answer: 1, explain: '. repeats the last change — golfing cornerstone: one edit + n. presses.' },
        { q: 'Record a macro into register q, then replay it 10 times:', choices: ['qq...q then 10@q', 'mq...q then 10"q', ':macro q 10', 'q10q'], answer: 0, explain: 'qq starts recording to q, q stops, 10@q replays 10×. @@ repeats the last replay.' },
        { q: 'Replace all `foo` with `bar` in the whole file:', choices: [':s/foo/bar/', ':%s/foo/bar/g', ':g/foo/bar/', ':replace foo bar'], answer: 1, explain: '% = every line, /g = every occurrence per line.' },
        { q: 'What does `:g/^$/d` do?', choices: ['Deletes all blank lines', 'Deletes the first line', 'Adds blank lines', 'Global undo'], answer: 0, explain: ':g runs a command on every matching line; ^$ matches empty lines; d deletes them.' },
        { q: 'On vimgolf.com, your score is:', choices: ['Time taken', 'Number of keystrokes in your submitted solution', 'Lines changed', 'CPU cycles'], answer: 1, explain: 'Pure keystroke count. Escape counts. Enter counts. Everything counts.' },
        { q: '`ci(` vs `di(` — the difference?', choices: ['Nothing', 'ci( enters insert mode after deleting inside parens', 'di( deletes the parens too', 'ci( only works on the same line'], answer: 1, explain: 'c = change = delete + insert. d just deletes.' },
        { q: 'The `cgn` trick is used for:', choices: ['Changing the next search match, then repeating with .', 'Going to a line number', 'Changing indentation', 'Compiling'], answer: 0, explain: 'Search a pattern, cgn changes the next match — then each . fixes the next one. Rename-refactor in n keystrokes.' },
      ],
    },
  ],
}
