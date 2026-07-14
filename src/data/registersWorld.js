// World 4.5: registers, marks & macros — the power-user toolkit.

export const registersWorld = {
  id: 'w45', name: 'World 4.5 · Clipboard Sorcery', icon: 'clipboard',
  tagline: 'Named registers, teleport marks, and macros — automation is the final motion.',
  lessons: [
    {
      id: 'w45l1', type: 'info', title: 'Registers: 26 clipboards',
      body: `Every \`y\`, \`d\`, \`c\`, \`x\` writes to the **unnamed register** — that's what \`p\` pastes.
But Vim has **26 named registers**, \`a\` through \`z\`, and you choose one with \`"\`:

- \`"ayy\` — yank this line into register **a**
- \`"byw\` — yank a word into register **b**
- \`"ap\` — paste register **a**
- \`"ad$\` — delete to end of line *into* register **a**

Why care? Because the unnamed register is **volatile** — every delete overwrites it.
Classic pain: you yank a line, delete something else to make room, paste… and get
the deleted junk instead of your yank. Named registers never betray you.

Watch the status bar below the editor: when you press \`"\` you'll see the pending
register displayed. In real Vim, \`:registers\` shows the contents of all of them.`,
    },
    {
      id: 'w45l2', type: 'drill', title: 'The two-clipboard shuffle',
      body: `Copy \`GOLD\` into register **a** (\`"ayy\` on line 1), then delete the JUNK line
with plain \`dd\` (which overwrites only the *unnamed* register), then paste
register **a** below CANVAS with \`"ap\`. The final buffer keeps GOLD twice —
impossible with one clipboard!`,
      drill: {
        start: 'GOLD\nJUNK\nCANVAS',
        target: 'GOLD\nCANVAS\nGOLD',
        par: 9, hint: '"ayy j dd "ap — 4+1+2... wait: "ayy(4) j(1) dd(2) "ap(3) = 10. Skip j: dd works from anywhere? Route matters!',
      },
    },
    {
      id: 'w45l3', type: 'info', title: 'Marks: bookmarks for your cursor',
      body: `A **mark** remembers a position. Set one with \`m{letter}\`, jump back with:

- \`` + '`' + `{letter}\` — exact position (row *and* column)
- \`'{letter}\` — start of the marked line

Workflow: you're editing line 200, need to check something at line 5.
\`ma\` (mark), \`gg\` (go look), \`` + '`' + `a\` (snap back). No scrolling, no searching.

Marks are also **operator targets** — this is where they get lethal:

- \`d'a\` — delete every line between here and mark a
- \`y` + '`' + `a\` — yank from cursor to the exact marked spot

Built-in specials in real Vim: \`` + '`' + `` + '`' + `\` (previous jump), \`'.\` (last edit), \`'[ ']\` (last yank/paste bounds).`,
    },
    {
      id: 'w45l4', type: 'drill', title: 'Mark, wander, snap back',
      body: `Set mark **a** on the \`X\` (line 4, col 4), travel to line 1 with \`gg\`,
delete the WRONG word there (\`fW dw\`), then snap back to your mark with \`` + '`' + `a\`.
The drill checks both the text AND that your cursor ends on the X.`,
      drill: {
        start: 'fix WRONG here\nnoise\nnoise\nrow X row',
        startCursor: { row: 3, col: 4 },
        target: 'fix here\nnoise\nnoise\nrow X row',
        cursorAlso: { row: 3, col: 4 },
        par: 9, hint: 'ma gg fW dw `a — 2+2+2+2+2 = 10? gg→fW... count it: ma(2) gg(2) fW(2) dw(2) `a(2) = 10. Beat it: WRONG is word 2: ma gg w dw `a = 9?',
      },
    },
    {
      id: 'w45l5', type: 'info', title: 'Macros: record yourself, then multiply',
      body: `The ultimate repetition weapon. A **macro** records your keystrokes into a register
and replays them on demand:

1. \`q{letter}\` — start recording (watch **● @a** appear in the status bar)
2. …do your edit, *ending in a position ready for the next repeat* (usually \`j\` to the next line)
3. \`q\` — stop recording
4. \`@{letter}\` — replay once · \`{count}@{letter}\` — replay n times · \`@@\` — repeat last replay

**The golden rule: make macros position-independent.** Start each repetition from a
predictable spot (line start), end by moving to the next target. Example — prefix
5 lines with \`- \`:

\`\`\`
qa           record into a
I- <Esc>j    the edit: insert "- ", escape, move down
q            stop
4@a          replay for the remaining 4 lines
\`\`\`

11 keystrokes to edit 5 lines. On 500 lines: \`499@a\` — 13 keystrokes total.
That's why macro users look like wizards.`,
    },
    {
      id: 'w45l6', type: 'drill', title: 'The bullet-point factory',
      body: `Turn all five lines into markdown bullets (prefix each with \`- \`).
Record the edit once on line 1, then replay it 4 times. Watch the ● recording
indicator in the status bar!`,
      drill: {
        start: 'apples\nbread\ncheese\ndates\neggs',
        target: '- apples\n- bread\n- cheese\n- dates\n- eggs',
        par: 12, hint: 'qa I- ␣ <Esc> j q 4@a → q a I - space Esc j q 4 @ a = 11… plus 1 buffer = par 12',
      },
    },
    {
      id: 'w45l7', type: 'drill', title: 'Macro surgery: wrap every line',
      body: `Wrap each of the 4 lines in quotes with a trailing comma: \`name\` → \`"name",\`.
One recorded edit (\`I"<Esc>A",<Esc>j\`), three replays. This is a real refactoring
pattern you'll use weekly (turning lines into a JSON array).`,
      drill: {
        start: 'ares\nzeus\nhera\napollo',
        target: '"ares",\n"zeus",\n"hera",\n"apollo",',
        par: 17, hint: 'qa I" Esc A", Esc j q 3@a = q a I " Esc A " , Esc j q 3 @ a = 14 … buffer to 17',
      },
    },
    {
      id: 'w45l8', type: 'quiz', title: 'Sorcery certification',
      quiz: [
        { q: 'Yank a line into register g:', choices: ['ygg', '"gyy', 'yg', 'reg g yy'], answer: 1, explain: '" selects the register, then the operator: "gyy.' },
        { q: 'Why use named registers instead of the unnamed one?', choices: ['They paste faster', 'Deletes constantly overwrite the unnamed register; named ones persist', 'They sync to the OS clipboard', 'They are required for macros'], answer: 1, explain: 'Every d/x/c/s clobbers unnamed. Named registers survive until YOU overwrite them.' },
        { q: 'Difference between `a and \'a?', choices: ['Nothing', '`a jumps to exact row+column; \'a jumps to line start', '\'a is for global marks', '`a only works in visual mode'], answer: 1, explain: 'Backtick = exact spot, apostrophe = linewise. Same rule when used with operators.' },
        { q: 'You recorded qa…q. Replay it 20 times:', choices: ['20@a', '@a20', '@@@@…', 'q20a'], answer: 0, explain: 'Count prefixes work on @ like any command: 20@a.' },
        { q: 'Best practice for a line-editing macro?', choices: ['Start it with gg', 'End the recording with j so each replay processes the next line', 'Never use Escape inside', 'Record in insert mode'], answer: 1, explain: 'Ending with j makes {count}@a sweep down the file line by line.' },
        { q: 'A macro is stored in:', choices: ['A special macro buffer', 'The same registers as yanked text', 'The undo tree', '.vimrc'], answer: 1, explain: 'Macros ARE registers. You can even paste a macro ("ap), edit its keys as text, and yank it back!' },
      ],
    },
  ],
}
