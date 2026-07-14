// World 8: org-mode — the reason many people never leave Emacs.

export const orgWorld = {
  id: 'w8', name: 'World 8 · Org-mode Life OS', icon: 'tree',
  tagline: 'Notes, TODOs, agendas, and literate config — plain text that runs your life.',
  lessons: [
    {
      id: 'w8l1', type: 'info', title: 'What is org-mode?',
      body: `**Org-mode** is a major mode for \`.org\` files — an outliner, task manager, notebook,
spreadsheet, and publishing system living in plain text:

\`\`\`org
* Project Phoenix          ← heading level 1
** Research               ← level 2 (more stars = deeper)
   Some notes here.
** TODO Write the report
   DEADLINE: <2026-07-20 Mon>
** DONE Setup repo
   CLOSED: [2026-07-10]
- [ ] checkbox item
- [X] done checkbox
\`\`\`

Because it's plain text: it diffs in git, greps with ripgrep, syncs anywhere, and
will still open in 30 years. Doom enables it via the \`:lang org\` module.

**The core interaction: TAB.** On a heading, \`TAB\` cycles fold states —
collapsed → children → everything. A 10,000-line file becomes a navigable outline.`,
    },
    {
      id: 'w8l2', type: 'info', title: 'TODOs, priorities, tags',
      body: `Any heading becomes a task by adding a TODO keyword. In Doom (evil bindings):

- \`SPC m t\` — cycle TODO state (TODO → DONE → none) on the current heading
- Shift-arrows also cycle states and priorities in org buffers
- \`[#A]\` \`[#B]\` \`[#C]\` — priorities: \`** TODO [#A] pay taxes\`
- \`:work:urgent:\` — tags at the end of a heading, set with \`SPC m q\`

Scheduling is first-class:

- \`SPC m d s\` — add a **SCHEDULED** date (when you plan to start)
- \`SPC m d d\` — add a **DEADLINE** (when it's due)

Dates use an interactive calendar. Once tasks have dates, the **agenda** turns
your scattered org files into a unified day/week planner.`,
    },
    {
      id: 'w8l3', type: 'keydrill', title: 'Muscle memory: org commands',
      body: `Drill the Doom org bindings. (\`SPC m\` is the "local leader" — mode-specific commands.)`,
      drills: [
        { prompt: 'Cycle TODO state on a heading', keys: ['SPC', 'm', 't'] },
        { prompt: 'Schedule the current task', keys: ['SPC', 'm', 'd', 's'] },
        { prompt: 'Set a deadline', keys: ['SPC', 'm', 'd', 'd'] },
        { prompt: 'Open the org agenda', keys: ['SPC', 'o', 'A'] },
        { prompt: 'Capture a quick note from anywhere', keys: ['SPC', 'X'] },
        { prompt: 'Set tags on a heading', keys: ['SPC', 'm', 'q'] },
      ],
    },
    {
      id: 'w8l4', type: 'info', title: 'Agenda & capture: the daily loop',
      body: `The two commands that make org a *system* instead of a pile of files:

**Capture (\`SPC X\`)** — from ANY buffer, pop a small window, jot a thought,
hit \`C-c C-c\`, and it's filed into your inbox org file. Your flow is never broken.

**Agenda (\`SPC o A\`)** — scans all your org files and builds:
- a **day/week calendar** of everything scheduled and due
- a **global TODO list** filterable by tag, priority, keyword
- from the agenda you can reschedule (\`S-→\`), mark done (\`t\`), jump to the task (\`RET\`)

The famous workflow (GTD — Getting Things Done):
1. Capture everything instantly (\`SPC X\`), zero friction.
2. Review the inbox daily; schedule or file each item.
3. Live from the agenda, not from memory.

Tell Emacs which files feed the agenda:
\`\`\`elisp
(setq org-agenda-files '("~/org/inbox.org" "~/org/projects.org"))
\`\`\``,
    },
    {
      id: 'w8l5', type: 'quiz', title: 'Org fundamentals check',
      quiz: [
        { q: 'How do you make a sub-heading under `* Project`?', choices: ['# Sub', '** Sub', '  * Sub', '> Sub'], answer: 1, explain: 'More stars = deeper nesting. ** is a child of *.' },
        { q: 'What does TAB do on an org heading?', choices: ['Indents it', 'Cycles fold visibility', 'Marks it done', 'Creates a table'], answer: 1, explain: 'TAB cycles: folded → children → all. S-TAB cycles the whole file.' },
        { q: 'Difference between SCHEDULED and DEADLINE?', choices: ['None', 'SCHEDULED = when you start; DEADLINE = when it is due', 'DEADLINE repeats daily', 'SCHEDULED is only for meetings'], answer: 1, explain: 'The agenda warns you as deadlines approach; scheduled items appear on their start day.' },
        { q: 'Capture (SPC X) is for:', choices: ['Screenshots', 'Instantly filing a note/task without leaving your current work', 'Recording macros', 'Git commits'], answer: 1, explain: 'Zero-friction capture is the heart of the GTD workflow.' },
        { q: 'Org files are:', choices: ['A binary database', 'Plain text — grep-able, diff-able, future-proof', 'XML', 'Only readable inside Emacs'], answer: 1, explain: 'Plain text is the whole point. Other apps (mobile: Orgzly, Plain Org) read them too.' },
      ],
    },
    {
      id: 'w8l8', type: 'info', title: 'Links & tables: org\'s secret weapons',
      body: `**Links** — org links to anything: files, headings, URLs, even emails:

\`\`\`org
[[https://doomemacs.org][Doom homepage]]     ← web link with description
[[file:notes.org::*Research][my research]]   ← jump to a heading in another file
\`\`\`

- \`SPC m l l\` — insert a link · \`RET\` on a link — follow it
- Store a link to where you are with \`SPC n l\`, paste it elsewhere later.
Your notes become a personal wiki — plain text, git-versioned.

**Tables** — type \`|\` and org builds spreadsheets as you type:

\`\`\`org
| Item   | Qty | Price |
|--------+-----+-------|
| apples |   4 |  2.50 |
| bread  |   1 |  3.20 |
\`\`\`

- \`TAB\` in a table — next cell, *realigning the whole table automatically*
- Type \`|-\` then \`TAB\` — instant separator line
- Formulas work too: \`#+TBLFM: $4=$2*$3\` turns a column into computed values.

People have run companies on org tables. Plain text, remember.`,
    },
    {
      id: 'w8l9', type: 'keydrill', title: 'Muscle memory: links & notes',
      body: `Drill link and capture-adjacent bindings used in daily org workflows.`,
      drills: [
        { prompt: 'Insert a link', keys: ['SPC', 'm', 'l', 'l'] },
        { prompt: 'Store a link to current location', keys: ['SPC', 'n', 'l'] },
        { prompt: 'Open the org agenda', keys: ['SPC', 'o', 'A'] },
        { prompt: 'Capture a quick note', keys: ['SPC', 'X'] },
        { prompt: 'Cycle TODO state', keys: ['SPC', 'm', 't'] },
      ],
    },
    {
      id: 'w8l10', type: 'quiz', title: 'Links & tables check',
      quiz: [
        { q: 'An org web link with description looks like:', choices: ['[url](text)', '[[url][text]]', '<url|text>', 'url:text'], answer: 1, explain: 'Double brackets: [[target][description]].' },
        { q: 'TAB inside an org table:', choices: ['Exits the table', 'Moves to next cell and realigns columns', 'Deletes the row', 'Runs a formula only'], answer: 1, explain: 'TAB navigates and auto-aligns.' },
        { q: 'SPC m l l is for:', choices: ['List all files', 'Insert a link', 'Load Lisp', 'Lock the buffer'], answer: 1, explain: 'Local leader → link → insert link.' },
        { q: 'Org tables are stored as:', choices: ['Binary blobs', 'Plain text with | columns', 'SQLite', 'JSON'], answer: 1, explain: 'Plain text — grep, diff, and future-proof.' },
      ],
    },
    {
      id: 'w8l6', type: 'info', title: 'Org-babel: your config as a document',
      body: `Org can **execute code blocks** — press \`C-c C-c\` inside one:

\`\`\`org
#+begin_src python :results output
print(2 ** 10)
#+end_src

#+RESULTS:
: 1024
\`\`\`

This enables **literate programming**: documents that mix prose, runnable code,
and results. Data scientists use it like Jupyter; sysadmins keep runnable runbooks.

The endgame flex: **a literate Doom config.** Write \`config.org\` with headings,
explanations, and elisp blocks — Doom tangles it into config.el automatically
(enable the \`:config literate\` module). Your editor config becomes a readable book
that *is* the implementation.

\`\`\`org
* UI tweaks
My theme and fonts, with reasoning.
#+begin_src elisp
(setq doom-theme 'doom-one)
#+end_src
\`\`\``,
    },
    {
      id: 'w8l7', type: 'quiz', title: 'Life OS final',
      quiz: [
        { q: 'Run the code block at point:', choices: ['C-c C-c', 'SPC r r', ':run', 'gx'], answer: 0, explain: 'C-c C-c is org\'s universal "do the thing here" key — also confirms captures and commits.' },
        { q: 'A "literate config" means:', choices: ['A config with many comments', 'An org document whose code blocks ARE your config, tangled automatically', 'A config written in Latin', 'Auto-generated config'], answer: 1, explain: 'Doom\'s :config literate module tangles config.org → config.el on sync.' },
        { q: 'Which module enables org in Doom?', choices: [':lang org', ':tools org', ':app org', 'org.el in packages'], answer: 0, explain: ':lang org in init.el — Doom\'s org setup is one of its best modules.' },
        { q: 'The GTD loop in org is:', choices: ['Edit → compile → run', 'Capture everything → review inbox → live from the agenda', 'Fork → commit → push', 'TODO → FIXME → HACK'], answer: 1, explain: 'Capture with SPC X, review, schedule, then trust the agenda instead of your memory.' },
      ],
    },
  ],
}
