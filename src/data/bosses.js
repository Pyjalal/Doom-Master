// Boss battles — one per world. Unlocked when all other lessons in the world
// are complete. Stage kinds: drill (vim editor), keys (sequence), quiz (question).

export const BOSSES = {
  w1: {
    id: 'w1boss', type: 'boss', title: 'BOSS · The Gatekeeper',
    boss: {
      time: 90,
      intro: 'The Gatekeeper guards the exit of the tutorial dungeon. It only respects those who can enter, escape, and strike. Three trials. Ninety seconds.',
      stages: [
        { kind: 'drill', prompt: 'TRIAL 1 — Type the passphrase (end in NORMAL mode)', start: '', target: 'i can escape', requireNormal: true },
        { kind: 'drill', prompt: 'TRIAL 2 — Reach the X with hjkl and counts', start: '#######\n#.....#\n#.....#\n#...X.#\n#######', cursorGoal: { row: 3, col: 4 } },
        { kind: 'drill', prompt: 'TRIAL 3 — Purge the corruption with x', start: 'clzzeazzn', target: 'clean' },
      ],
    },
  },
  w2: {
    id: 'w2boss', type: 'boss', title: 'BOSS · The Motion Wraith',
    boss: {
      time: 75,
      intro: 'The Wraith moves like wind through words. Match its speed: three teleports, seventy-five seconds. hjkl alone will not save you.',
      stages: [
        { kind: 'drill', prompt: 'TELEPORT 1 — Land on the word `target`', start: 'skip skip skip skip skip target skip', cursorGoal: { row: 0, col: 25 } },
        { kind: 'drill', prompt: 'TELEPORT 2 — Land on the @ (one find!)', start: 'xxxxxxxxxxxxxxxxxxxx @ xxxx', cursorGoal: { row: 0, col: 21 } },
        { kind: 'drill', prompt: 'TELEPORT 3 — Last line, last character', start: 'one\ntwo\nthree\nfour\nfive wide line here', cursorGoal: { row: 4, col: 18 } },
      ],
    },
  },
  w3: {
    id: 'w3boss', type: 'boss', title: 'BOSS · The Grammar Golem',
    boss: {
      time: 90,
      intro: 'The Golem speaks only operator+motion. Answer in its tongue — three sentences, ninety seconds.',
      stages: [
        { kind: 'drill', prompt: 'SENTENCE 1 — ciw the lie into truth: wrong→right', start: 'the wrong path', startCursor: { row: 0, col: 6 }, target: 'the right path', requireNormal: true },
        { kind: 'drill', prompt: 'SENTENCE 2 — Rewrite inside the quotes to say ok', start: 'status = "very broken"', startCursor: { row: 0, col: 12 }, target: 'status = "ok"', requireNormal: true },
        { kind: 'drill', prompt: 'SENTENCE 3 — Reorder the lines with dd/p', start: 'beta\nalpha\ngamma', target: 'alpha\nbeta\ngamma' },
      ],
    },
  },
  w4: {
    id: 'w4boss', type: 'boss', title: 'BOSS · The Par Reaper',
    boss: {
      time: 120,
      intro: 'The Reaper collects wasted keystrokes. Three holes, two minutes. It is watching your ⌨ counter.',
      stages: [
        { kind: 'drill', prompt: 'HOLE A — teh→the (remember xp)', start: 'teh reaper comes', target: 'the reaper comes' },
        { kind: 'drill', prompt: 'HOLE B — delete both `really `', start: 'death is really really patient', target: 'death is patient' },
        { kind: 'drill', prompt: 'HOLE C — quadruple the chant', start: 'DOOM', target: 'DOOM\nDOOM\nDOOM\nDOOM' },
      ],
    },
  },
  w45: {
    id: 'w45boss', type: 'boss', title: 'BOSS · The Macro Lich',
    boss: {
      time: 120,
      intro: 'The Lich has cursed six lines. Manual editing feeds its power — automate or perish. Two minutes.',
      stages: [
        { kind: 'drill', prompt: 'CURSE 1 — Bullet all six lines (- prefix). A macro is your sword.', start: 'bone\nash\ndust\nrot\nmist\nvoid', target: '- bone\n- ash\n- dust\n- rot\n- mist\n- void' },
        { kind: 'drill', prompt: 'CURSE 2 — Reverse the incantation (five lines)', start: 'five\nfour\nthree\ntwo\none', target: 'one\ntwo\nthree\nfour\nfive' },
      ],
    },
  },
  w46: {
    id: 'w46boss', type: 'boss', title: 'BOSS · The Regex Hydra',
    boss: {
      time: 100,
      intro: 'Three heads: search, substitute, purge. Cut them all in one hundred seconds or the Hydra regrows.',
      stages: [
        { kind: 'drill', prompt: 'HEAD 1 — Land on `hydra` with / search', start: 'noise noise hydra noise', cursorGoal: { row: 0, col: 12 } },
        { kind: 'drill', prompt: 'HEAD 2 — Rename all foo→bar with :%s', start: 'foo a\nfoo b\nfoo c', target: 'bar a\nbar b\nbar c' },
        { kind: 'drill', prompt: 'HEAD 3 — Purge lines containing BAD', start: 'ok\nBAD one\nok\nBAD two\nok', target: 'ok\nok\nok' },
      ],
    },
  },
  w47: {
    id: 'w47boss', type: 'boss', title: 'BOSS · The Scratch Handicapper',
    boss: {
      time: 120,
      intro: 'The Handicapper taxes every wasted stroke. Three holes. Two minutes. Play under par or walk home.',
      stages: [
        { kind: 'drill', prompt: 'HOLE X — Bullet four lines (macro or :%norm)', start: 'w\nx\ny\nz', target: '- w\n- x\n- y\n- z' },
        { kind: 'drill', prompt: 'HOLE Y — Rename all a→z file-wide', start: 'a=1\nprint(a)\na', target: 'z=1\nprint(z)\nz' },
        { kind: 'drill', prompt: 'HOLE Z — Reverse five lines', start: '5\n4\n3\n2\n1', target: '1\n2\n3\n4\n5' },
      ],
    },
  },
  w5: {
    id: 'w5boss', type: 'boss', title: 'BOSS · The Which-Key Warden',
    boss: {
      time: 60,
      intro: 'The Warden calls out tasks; your fingers must answer with the right Doom keys. No menus to read this time — sixty seconds.',
      stages: [
        { kind: 'keys', prompt: 'Open a file', keys: ['SPC', 'f', 'f'] },
        { kind: 'keys', prompt: 'Open Magit status', keys: ['SPC', 'g', 'g'] },
        { kind: 'keys', prompt: 'Search the whole project', keys: ['SPC', 's', 'p'] },
        { kind: 'keys', prompt: 'Split window vertically', keys: ['SPC', 'w', 'v'] },
        { kind: 'keys', prompt: 'Kill the current buffer', keys: ['SPC', 'b', 'k'] },
      ],
    },
  },
  w6: {
    id: 'w6boss', type: 'boss', title: 'BOSS · The Paren Daemon',
    boss: {
      time: 75,
      intro: 'The Daemon speaks in S-expressions and accepts only correct evaluations. Wrong answers cost 8 seconds. Seventy-five seconds on the clock.',
      stages: [
        { kind: 'quiz', q: '(* 2 (+ 3 4)) evaluates to…', choices: ['10', '14', '24', '11'], answer: 1 },
        { kind: 'quiz', q: 'Which makes a function callable via M-x?', choices: ['(defun', '(interactive)', '(public)', '(command)'], answer: 1 },
        { kind: 'quiz', q: '(let ((x 3)) (* x x x)) →', choices: ['9', '27', 'x³', 'error'], answer: 1 },
        { kind: 'quiz', q: 'Run code on every python-mode buffer start:', choices: ["(add-hook 'python-mode-hook …)", '(python-run …)', "(setq python-start …)", '(on-python …)'], answer: 0 },
        { kind: 'quiz', q: "'(a b c) is…", choices: ['A function call', 'Literal list data (quoted)', 'A syntax error', 'A string'], answer: 1 },
      ],
    },
  },
  w65: {
    id: 'w65boss', type: 'boss', title: 'BOSS · The Cons Cell Kraken',
    boss: {
      time: 75,
      intro: 'The Kraken coils around list cells and buffer points. Answer five riddles. Wrong answers cost 8 seconds.',
      stages: [
        { kind: 'quiz', q: "(car '(a b c)) →", choices: ['(a b c)', 'a', 'b', 'nil'], answer: 1 },
        { kind: 'quiz', q: "(cdr '(1 2 3)) →", choices: ['1', '(2 3)', '3', 'nil'], answer: 1 },
        { kind: 'quiz', q: 'save-excursion restores…', choices: ['The file', 'Point (and often mark)', 'The theme', 'Packages'], answer: 1 },
        { kind: 'quiz', q: 'cond tries clauses…', choices: ['In parallel', 'Top to bottom until one matches', 'Randomly', 'Only the last'], answer: 1 },
        { kind: 'quiz', q: '(cons 1 nil) equals…', choices: ["'(1)", '1', 'nil', "'(1 nil)"], answer: 0 },
      ],
    },
  },
  w7: {
    id: 'w7boss', type: 'boss', title: 'BOSS · The Config Archon',
    boss: {
      time: 75,
      intro: 'The Archon audits your Doom knowledge. Answer its config riddles — wrong answers cost 8 seconds.',
      stages: [
        { kind: 'quiz', q: 'New package goes in…', choices: ['config.el', 'packages.el + doom sync', 'init.el only', 'site-lisp/'], answer: 1 },
        { kind: 'quiz', q: 'Why (after! org …)?', choices: ['Style', 'Respect lazy loading — run config when org loads', 'Async execution', 'Required by lexical binding'], answer: 1 },
        { kind: 'quiz', q: 'Bind SPC o w globally:', choices: ["(map! :leader \"o w\" #'fn)", '(global-set-key …SPC…)', '(leader-bind o w)', '(evil-map SPC-o-w)'], answer: 0 },
        { kind: 'quiz', q: 'Doom broken after editing packages.el — first command?', choices: ['doom sync', 'rm -rf ~/.emacs.d', 'doom upgrade', 'apt reinstall emacs'], answer: 0 },
      ],
    },
  },
  w75: {
    id: 'w75boss', type: 'boss', title: 'BOSS · The Pipeline Warden',
    boss: {
      time: 60,
      intro: 'The Warden runs a live coding pipeline. Keys and knowledge under sixty seconds.',
      stages: [
        { kind: 'keys', prompt: 'Go to definition', keys: ['g', 'd'] },
        { kind: 'keys', prompt: 'Rename symbol', keys: ['SPC', 'c', 'r'] },
        { kind: 'quiz', q: 'SPC c x opens…', choices: ['Hex view', 'Diagnostics list', 'Config', 'Clipboard'], answer: 1 },
        { kind: 'keys', prompt: 'New workspace', keys: ['SPC', 'Tab', 'n'] },
        { kind: 'quiz', q: 'Workspaces isolate…', choices: ['CPU cores', 'Window layouts and buffers per project', 'Git remotes', 'Themes'], answer: 1 },
      ],
    },
  },
  w8: {
    id: 'w8boss', type: 'boss', title: 'BOSS · The Agenda Overlord',
    boss: {
      time: 60,
      intro: 'The Overlord demands a functioning life OS. Keys and knowledge, under time. Go.',
      stages: [
        { kind: 'keys', prompt: 'Cycle a TODO state', keys: ['SPC', 'm', 't'] },
        { kind: 'keys', prompt: 'Capture a thought instantly', keys: ['SPC', 'X'] },
        { kind: 'quiz', q: 'TAB on a heading…', choices: ['Indents', 'Cycles folding', 'Completes', 'Adds a TODO'], answer: 1 },
        { kind: 'keys', prompt: 'Open the agenda', keys: ['SPC', 'o', 'A'] },
        { kind: 'quiz', q: 'A literate config is…', choices: ['Well commented', 'An org file tangled into config.el', 'Written in French', 'Minimal'], answer: 1 },
      ],
    },
  },
}
