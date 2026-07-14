// Worlds 1–3: Vim from absolute zero to operator grammar mastery.
// Lesson types: info | drill (live editor task) | quiz

export const vimWorlds = [
  {
    id: 'w1', name: 'World 1 · Vim Survival', icon: 'egg',
    tagline: 'You just woke up inside a modal editor. Learn to move, type, and escape alive.',
    lessons: [
      {
        id: 'w1l1', type: 'info', title: 'Why Vim exists (and why Doom uses it)',
        body: `Doom Emacs is **Emacs wearing Vim's clothes** (via a package called *evil-mode*).
So mastering Doom means mastering Vim's language first.

**The big idea: MODES.** In most editors, every key types a character. In Vim, keys mean
different things depending on the *mode* you're in:

- **NORMAL mode** — keys are *commands* (move, delete, copy). You live here.
- **INSERT mode** — keys type text, like a normal editor.
- **VISUAL mode** — keys select text.

You start in NORMAL. Press \`i\` to insert text. Press \`Escape\` to get back to NORMAL.

> **Mantra:** *"Escape is home."* When confused, smash Escape and you're back in NORMAL mode.

This feels weird for a day, then it feels like a superpower: your fingers never leave
the home row, and editing becomes a language you *speak*.`,
      },
      {
        id: 'w1l2', type: 'drill', title: 'First blood: insert and escape',
        body: `The editor below is live. You are in NORMAL mode.

1. Press \`i\` to enter INSERT mode (watch the mode indicator change).
2. Type \`hello\`.
3. Press \`Escape\` to return to NORMAL mode.`,
        drill: { start: '', target: 'hello', requireNormal: true, par: 8, hint: 'i → type "hello" → Escape' },
      },
      {
        id: 'w1l3', type: 'info', title: 'hjkl — home-row arrows',
        body: `Arrow keys force your hand off the home row. Vim uses:

- \`h\` ← left
- \`j\` ↓ down  (looks like a down-arrow hook)
- \`k\` ↑ up
- \`l\` → right

Why these keys? The terminal Vim's author used (ADM-3A, 1976) had arrows printed on hjkl.
History became muscle memory for millions.

**Counts:** prefix any motion with a number. \`5j\` = down 5 lines. \`3l\` = right 3 chars.
This works for *almost everything* in Vim — remember it.`,
      },
      {
        id: 'w1l4', type: 'drill', title: 'Navigate the maze',
        body: `Move the cursor onto the \`X\` using only \`h j k l\` (and counts like \`3j\`).
Do NOT use insert mode.`,
        drill: {
          start: '#########\n#.......#\n#.......#\n#....X..#\n#.......#\n#########',
          cursorGoal: { row: 3, col: 5 }, par: 6, hint: '3j then 4l — or 3j4l. Counts save keystrokes!',
        },
      },
      {
        id: 'w1l5', type: 'drill', title: 'x marks the spot',
        body: `In NORMAL mode, \`x\` deletes the character under the cursor.
Delete all the \`z\` characters to fix this word. Move with \`h l\`, delete with \`x\`.`,
        drill: { start: 'emzzacs', target: 'emacs', par: 6, hint: 'll then xx' },
      },
      {
        id: 'w1l6', type: 'info', title: 'The insert family: i a I A o O',
        body: `Six ways to enter INSERT mode, each placing the cursor differently:

- \`i\` — insert **before** cursor
- \`a\` — insert **after** cursor (append)
- \`I\` — insert at **start of line**
- \`A\` — append at **end of line**
- \`o\` — **open** a new line below
- \`O\` — open a new line above

Pros never do \`$\` then \`a\` — they just hit \`A\`. Picking the right entry point
is your first taste of *golf thinking*.`,
      },
      {
        id: 'w1l7', type: 'drill', title: 'Choose your door',
        body: `Make the line read \`(vim is great)\` — it's missing the final \`t)\`.
The fastest way: \`A\` jumps to end-of-line in insert mode. Then type, then Escape.`,
        drill: { start: '(vim is grea', target: '(vim is great)', requireNormal: true, par: 5, hint: 'A t ) Escape — 4 keystrokes of genius' },
      },
      {
        id: 'w1l8', type: 'quiz', title: 'Survival check',
        quiz: [
          { q: 'You typed text and now random letters are doing weird things. What happened?', choices: ['Vim crashed', "You're in NORMAL mode — keys are commands", 'Caps lock is on', 'The file is read-only'], answer: 1, explain: 'Keys act as commands in NORMAL mode. Press i to type text.' },
          { q: 'Fastest way to add text at the END of the current line?', choices: ['$ then i', 'A', 'lllllll then a', 'o'], answer: 1, explain: 'A = append at end of line, one keystroke.' },
          { q: 'What does 7j do?', choices: ['Deletes 7 lines', 'Moves down 7 lines', 'Joins 7 lines', 'Types "7j"'], answer: 1, explain: 'Count + motion: 7j moves down 7 lines.' },
          { q: 'Universal panic button that returns you to NORMAL mode?', choices: ['Ctrl-C twice', 'Escape', 'q', ':normal'], answer: 1, explain: 'Escape is home. (Doom also lets you use "jk" or "ESC".)' },
        ],
      },
    ],
  },
  {
    id: 'w2', name: 'World 2 · Motion Mastery', icon: 'footprints',
    tagline: 'Stop crawling with hjkl. Teleport with words, lines, and character search.',
    lessons: [
      {
        id: 'w2l1', type: 'info', title: 'Word motions: w b e',
        body: `Moving by character is walking. Moving by **word** is driving:

- \`w\` — start of next **w**ord
- \`b\` — **b**ack to start of word
- \`e\` — **e**nd of word

Capital versions treat punctuation as part of the word (WORD = space-separated):

- \`W\` \`B\` \`E\` — same, but only whitespace splits words.

\`3w\` jumps 3 words. In \`foo.bar()\`, \`w\` stops at \`.\`, \`bar\`, \`(\` — but \`W\` skips the whole thing.`,
      },
      {
        id: 'w2l2', type: 'drill', title: 'Word hopping',
        body: `Get the cursor to the start of the word \`target\` using word motions (\`w\`, counts).
hjkl works but costs more — par assumes word motions.`,
        drill: { start: 'jump over these words to reach the target word', cursorGoal: { row: 0, col: 37 }, par: 3, hint: '7w — or 8w then b if you overshoot' },
      },
      {
        id: 'w2l3', type: 'info', title: 'Line motions: 0 ^ $ gg G',
        body: `- \`0\` — column 0 (hard start of line)
- \`^\` — first **non-blank** character
- \`$\` — end of line
- \`gg\` — first line of file
- \`G\` — last line of file
- \`42G\` or \`:42\` — jump to line 42

**gg and G take counts** — \`5G\` = go to line 5. This is how you fly through files.
In Doom, relative line numbers make \`{count}j/k\` jumps instant to eyeball.`,
      },
      {
        id: 'w2l4', type: 'drill', title: 'Vertical teleport',
        body: `Jump to the line that says \`YOU WANT THIS LINE\` (line 7), then to its end.
Use \`7G\` (or \`gg\` + counts) then \`$\`.`,
        drill: {
          start: 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nYOU WANT THIS LINE\nline 8\nline 9',
          cursorGoal: { row: 6, col: 17 }, par: 3, hint: '7G then $',
        },
      },
      {
        id: 'w2l5', type: 'info', title: 'Sniper mode: f t F T ; ,',
        body: `The single most underrated motion family. Within a line:

- \`f{char}\` — **f**ind: jump ONTO next \`{char}\`
- \`t{char}\` — **t**ill: jump just BEFORE next \`{char}\`
- \`F{char}\` / \`T{char}\` — same, backwards
- \`;\` — repeat last find, \`,\` — repeat in reverse

\`fx\` beats mashing \`l\` ten times. VimGolf pros use \`f\`/\`t\` constantly because
they pair beautifully with operators: \`dt)\` = *delete till closing paren*.`,
      },
      {
        id: 'w2l6', type: 'drill', title: 'Sniper practice',
        body: `Land the cursor on the \`@\` using \`f@\` — one find, two keystrokes.`,
        drill: { start: 'find the needle in this haystack @ right there', cursorGoal: { row: 0, col: 33 }, par: 2, hint: 'f@' },
      },
      {
        id: 'w2l7', type: 'drill', title: 'Semicolon chains',
        body: `Land on the THIRD \`o\` in the line. \`fo\` finds the first, then \`;\` repeats the find.`,
        drill: { start: 'one to move onto obviously', cursorGoal: { row: 0, col: 12 }, par: 3, hint: '3fo — count works on finds too! (fo;; also works, 4 keys)' },
      },
      {
        id: 'w2l8', type: 'quiz', title: 'Motion theory exam',
        quiz: [
          { q: 'Cursor is mid-line. Cheapest way to reach the first non-blank character?', choices: ['0', '^', 'gg', 'b b b'], answer: 1, explain: '^ goes to first non-blank; 0 goes to column 0 (may be a space).' },
          { q: 'In `foo.bar_baz()`, how far does one `W` move you (from `f`)?', choices: ['To the dot', 'To bar_baz', 'Past the whole thing to the next space-separated word', 'One character'], answer: 2, explain: 'WORD motions only break on whitespace.' },
          { q: 'You did `fa` but want the NEXT `a` after that. Press?', choices: ['fa again', ';', ',', 'n'], answer: 1, explain: '; repeats the last f/t/F/T search forward.' },
          { q: 'Jump to line 100?', choices: ['100j', '100G', '100l', 'G100'], answer: 1, explain: '100G (or :100). 100j is relative — only correct from line 0 which does not exist.' },
          { q: 'What does `t)` do?', choices: ['Jump onto the )', 'Jump just before the )', 'Delete until )', 'Nothing'], answer: 1, explain: 't = till: stops one char before the target. Perfect for ct) / dt).' },
        ],
      },
    ],
  },
  {
    id: 'w3', name: 'World 3 · The Grammar of Editing', icon: 'swords',
    tagline: 'Verbs + nouns. Once you speak operator language, you never click again.',
    lessons: [
      {
        id: 'w3l1', type: 'info', title: 'The sacred formula: operator + motion',
        body: `Here is the secret that makes Vim a *language*, not a keybinding list:

**\`[count] operator motion\`**

Operators (verbs):
- \`d\` — delete (cut)
- \`c\` — change (delete + enter insert)
- \`y\` — yank (copy)

Motions you already know are the nouns. Combine freely:

- \`dw\` — delete word · \`d$\` (or \`D\`) — delete to end of line
- \`c3w\` — change 3 words · \`ct.\` — change till the period
- \`yG\` — yank to end of file · \`yy\` — yank line

**Doubling an operator applies it to the whole line:** \`dd\` \`cc\` \`yy\`.
Then \`p\` pastes after cursor, \`P\` before. \`u\` undoes. That's the whole grammar.`,
      },
      {
        id: 'w3l2', type: 'drill', title: 'Delete a word',
        body: `Remove the word \`ugly \` (including its trailing space) with \`dw\`.
First navigate to it — \`w\` twice, or better: \`fu\`.`,
        drill: { start: 'this is ugly beautiful code', target: 'this is beautiful code', par: 4, hint: 'fu dw — snipe then delete' },
      },
      {
        id: 'w3l3', type: 'drill', title: 'Change till character',
        body: `The function name is wrong. Change \`fetchUser\` to \`fetchOrder\`.
Snipe to the \`U\` with \`fU\`, then \`cw\` changes the rest of the word... but wait —
\`cw\` on \`User(\` only eats \`User\`. Type the fix and Escape.`,
        drill: { start: 'result = fetchUser(id)', target: 'result = fetchOrder(id)', requireNormal: true, par: 10, hint: 'fU cw Order Escape' },
      },
      {
        id: 'w3l4', type: 'info', title: 'Text objects: i and a change everything',
        body: `Motions work *from* the cursor. **Text objects** work *around* it — you can be
anywhere inside the thing:

- \`iw\` / \`aw\` — inner word / a word (with space)
- \`i"\` / \`a"\` — inside quotes / including quotes
- \`i(\` \`i)\` \`ib\` — inside parens · \`i{\` \`iB\` — inside braces · \`i[\` — inside brackets

Combine with operators:
- \`ciw\` — change the word you're on (no need to be at its start!)
- \`di"\` — delete inside quotes
- \`ya(\` — yank parens and contents
- \`ci{\` — rewrite a whole code block

**\`ciw\` alone will change your life.** Cursor anywhere in a word, ciw, retype. Done.`,
      },
      {
        id: 'w3l5', type: 'drill', title: 'ciw — the life changer',
        body: `Cursor starts in the middle of \`wrong\`. Change it to \`right\` with \`ciw\`.
No navigation needed — that's the point.`,
        drill: { start: 'the wrong answer', startCursor: { row: 0, col: 6 }, target: 'the right answer', requireNormal: true, par: 10, hint: 'ciw right Escape' },
      },
      {
        id: 'w3l6', type: 'drill', title: 'Surgical strike inside quotes',
        body: `Replace the string content: \`"TODO: fix me"\` → \`"done"\`.
Cursor is already inside the quotes. \`ci"\` deletes everything inside and enters insert.`,
        drill: { start: 'msg = "TODO: fix me"', startCursor: { row: 0, col: 9 }, target: 'msg = "done"', requireNormal: true, par: 9, hint: 'ci" done Escape' },
      },
      {
        id: 'w3l7', type: 'drill', title: 'Line surgery: dd and p',
        body: `The lines are in the wrong order. Fix them: cut line 2 (\`dd\`) and paste it below line 3 (\`p\`).
\`dd\` cuts a whole line; \`p\` pastes it *below* the cursor line.`,
        drill: { start: 'first\nthird\nsecond', target: 'first\nsecond\nthird', par: 4, hint: 'j dd p' },
      },
      {
        id: 'w3l8', type: 'drill', title: 'Multiply with yy',
        body: `Copy the line 3 times so there are 4 identical lines. \`yy\` yanks, then \`3p\` pastes 3 times.`,
        drill: { start: 'const x = 1', target: 'const x = 1\nconst x = 1\nconst x = 1\nconst x = 1', par: 4, hint: 'yy 3p' },
      },
      {
        id: 'w3l9', type: 'info', title: 'Visual mode & friends',
        body: `Sometimes you want to *see* the selection first:

- \`v\` — character-wise visual · \`V\` — line-wise visual
- Extend with any motion, then hit an operator: \`d\` \`c\` \`y\`
- \`o\` in visual mode swaps which end you're extending

More power tools:
- \`r{char}\` — replace one character without insert mode
- \`~\` — toggle case
- \`J\` — join line below onto this one
- \`.\` — repeat last change (the golfer's best friend — not in this simulator yet, but burn it into your brain)

Visual mode is honest but often *costs more keystrokes* than operator+motion.
Golfers reach for \`v\` last.`,
      },
      {
        id: 'w3l10', type: 'quiz', title: 'Grammar final',
        quiz: [
          { q: 'Cursor is on the middle of a word. Rewrite the whole word:', choices: ['bcw', 'ciw', 'dwi', 'S'], answer: 1, explain: 'ciw = change inner word, works from anywhere inside it.' },
          { q: 'Delete everything inside the parentheses (cursor inside them):', choices: ['di(', 'd$', 'dw', 'x x x'], answer: 0, explain: 'di( = delete inside parens. da( would eat the parens too.' },
          { q: 'What does `3dd` do?', choices: ['Deletes 3 characters', 'Deletes 3 lines', 'Deletes to line 3', 'Nothing'], answer: 1, explain: 'Count + doubled operator = 3 whole lines.' },
          { q: 'Copy the current line and duplicate it below:', choices: ['yyp', 'ddp', 'Vyp is the only way', 'cc'], answer: 0, explain: 'yy yanks the line, p pastes it below. ddp cuts (works but riskier).' },
          { q: 'Swap two lines (cursor on the first):', choices: ['ddp', 'yyp', 'J', 'xp'], answer: 0, explain: 'ddp: cut line, paste below the next — classic idiom. (xp swaps two chars!)' },
          { q: 'Fix one wrong character without entering insert mode:', choices: ['cl', 'r + the new char', 's', 'x then i'], answer: 1, explain: 'r replaces the char under the cursor and stays in normal mode. 2 keystrokes.' },
        ],
      },
    ],
  },
]
