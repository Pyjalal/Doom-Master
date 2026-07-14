// World 4.7: Back Nine II — advanced golf combining macros, ex, marks, registers.

export const golf2World = {
  id: 'w47', name: 'World 4.7 · Back Nine II', icon: 'trophy',
  tagline: 'Tight pars. Every weapon legal. Macros, ex, marks, and registers welcome.',
  lessons: [
    {
      id: 'w47l0', type: 'info', title: 'Course rules',
      body: `This course assumes Worlds 4 and 4.5 (and ideally 4.6). Pars are tight.

**Legal weapons:** counts, operators, text objects, \`.\`, macros, \`/\` search,
\`:s\` \`:g\` \`:m\` \`:normal\`, marks, named registers.

Gold ≤ par. Reset freely. Count before you swing.`,
    },
    {
      id: 'w47l1', type: 'golf', title: 'Hole 1 · Quote factory',
      body: 'Wrap each of 4 lines in double quotes: `a` → `"a"`. Macro or `:%norm`.',
      drill: {
        start: 'alpha\nbeta\ngamma\ndelta',
        target: '"alpha"\n"beta"\n"gamma"\n"delta"',
        par: 12, hint: 'qa I" Esc A" Esc j q 3@a — or :%norm I" Esc A"',
      },
    },
    {
      id: 'w47l2', type: 'golf', title: 'Hole 2 · Last to first',
      body: 'Move the last line to the top. `:$m0` is the classic.',
      drill: {
        start: 'two\nthree\nfour\none',
        target: 'one\ntwo\nthree\nfour',
        par: 5, hint: ':$m0 Enter',
      },
    },
    {
      id: 'w47l3', type: 'golf', title: 'Hole 3 · Reverse eight',
      body: 'Reverse all eight lines. The legend: `:g/^/m0`.',
      drill: {
        start: '1\n2\n3\n4\n5\n6\n7\n8',
        target: '8\n7\n6\n5\n4\n3\n2\n1',
        par: 8, hint: ':g/^/m0 Enter',
      },
    },
    {
      id: 'w47l4', type: 'golf', title: 'Hole 4 · Cut to marker',
      body: 'Delete everything before `KEEP`. Search-motion delete: `d/KEEP` + Enter.',
      drill: {
        start: 'junk junk junk KEEP the rest',
        target: 'KEEP the rest',
        par: 7, hint: 'd/KEEP Enter',
      },
    },
    {
      id: 'w47l5', type: 'golf', title: 'Hole 5 · Double stash',
      body: 'Yank line 1 into register a, delete line 2, paste a twice under line 3.',
      drill: {
        start: 'GOLD\nJUNK\nBASE',
        target: 'GOLD\nBASE\nGOLD\nGOLD',
        par: 12, hint: '"ayy j dd "ap "ap',
      },
    },
    {
      id: 'w47l6', type: 'golf', title: 'Hole 6 · Mark range delete',
      body: "Delete the three middle CUT lines with a mark: ma, move, d'a.",
      drill: {
        start: 'top\ncut1\ncut2\ncut3\nbottom',
        startCursor: { row: 1, col: 0 },
        target: 'top\nbottom',
        par: 7, hint: "ma jj d'a",
      },
    },
    {
      id: 'w47l7', type: 'golf', title: 'Hole 7 · Blockquote all',
      body: 'Prefix every line with `> ` using `:%norm` or a macro.',
      drill: {
        start: 'line one\nline two\nline three',
        target: '> line one\n> line two\n> line three',
        par: 12, hint: ':%norm I> ␣ Enter — or macro',
      },
    },
    {
      id: 'w47l8', type: 'golf', title: 'Hole 8 · Star rename',
      body: 'Rename all three `idx` to `i`. Cursor on first. `*` + `ciw` + `n.` pattern.',
      drill: {
        start: 'idx = 0\nidx += 1\nreturn idx',
        startCursor: { row: 0, col: 0 },
        target: 'i = 0\ni += 1\nreturn i',
        par: 10, hint: '* ciwi Esc n. n.',
      },
    },
    {
      id: 'w47l9', type: 'golf', title: 'Hole 9 · Join cleanup',
      body: 'Join the two lines into one sentence (single spaces). `J` is your friend.',
      drill: {
        start: 'vim is\n  eternal',
        target: 'vim is eternal',
        par: 1, hint: 'J',
      },
    },
    {
      id: 'w47l10', type: 'golf', title: 'Hole 10 · BOSS HOLE: multi-edit',
      body: 'Rename `old`→`new` everywhere and delete the `// remove` line. Plan the cheapest route.',
      drill: {
        start: 'const old = 1\n// remove\nprint(old)\nreturn old',
        target: 'const new = 1\nprint(new)\nreturn new',
        par: 20, hint: ':%s/old/new/g then :g/remove/d — or jdd then substitute',
      },
    },
  ],
}
