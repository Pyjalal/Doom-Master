// Worlds 5–7.5: Doom Emacs, Emacs Lisp, deeper Lisp, config, and workflows.
// Lesson types: info | quiz | keydrill | codedrill

export const doomWorlds = [
  {
    id: 'w5', name: 'World 5 · Enter DOOM', icon: 'flame',
    tagline: 'Doom Emacs = Emacs core + Vim soul + a leader key that rules them all.',
    lessons: [
      {
        id: 'w5l1', type: 'info', title: 'What IS Doom Emacs?',
        body: `**Emacs** is a 40+ year old programmable text editor — really a Lisp machine that
happens to edit text. Infinitely extensible, historically hostile to newcomers.

**Doom Emacs** is a *configuration framework* for Emacs that gives you:

- **evil-mode** — full Vim emulation (everything from Worlds 1–4 works!)
- **The leader key: \`SPC\`** — press Space in normal mode and a searchable menu
  (*which-key*) pops up showing every command. Discoverability built in.
- **Sane defaults** — fuzzy finding (vertico), project management (projectile),
  git porcelain (magit), LSP support, org-mode, all preconfigured.
- **Speed** — lazy loading makes it start faster than stock Emacs configs.

Install (after installing Emacs + git + ripgrep + fd):
\`\`\`
git clone https://github.com/doomemacs/doomemacs ~/.config/emacs
~/.config/emacs/bin/doom install
\`\`\`

Your config lives in \`~/.config/doom/\` — three files: \`init.el\` (enable modules),
\`config.el\` (your customizations), \`packages.el\` (extra packages).
After editing modules/packages: run \`doom sync\` in a terminal.`,
      },
      {
        id: 'w5l2', type: 'info', title: 'The leader key mental map',
        body: `Everything in Doom hangs off \`SPC\` + a mnemonic letter:

- \`SPC f\` — **f**iles (\`ff\` find file, \`fs\` save, \`fr\` recent)
- \`SPC b\` — **b**uffers (\`bb\` switch, \`bk\` kill, \`bn\`/\`bp\` next/prev)
- \`SPC w\` — **w**indows (\`wv\` vsplit, \`ws\` split, \`wh/j/k/l\` navigate, \`wd\` delete)
- \`SPC p\` — **p**rojects (\`pp\` switch project, \`pf\` find file in project)
- \`SPC s\` — **s**earch (\`ss\` in buffer, \`sp\` in project — ripgrep powered)
- \`SPC g\` — **g**it (\`gg\` opens Magit status)
- \`SPC h\` — **h**elp (\`hf\` describe function, \`hv\` variable, \`hk\` key)
- \`SPC :\` — run any command by name (M-x)
- \`SPC .\` — find file · \`SPC ,\` — switch buffer · \`SPC /\` — search project

**You never memorize all of it.** Press \`SPC\`, pause, read the which-key popup.
The menu teaches you as you work.`,
      },
      {
        id: 'w5l3', type: 'keydrill', title: 'Muscle memory: files & buffers',
        body: `Type the actual key sequences on your keyboard. \`SPC\` = spacebar.`,
        drills: [
          { prompt: 'Find (open) a file', keys: ['SPC', 'f', 'f'] },
          { prompt: 'Save the current file', keys: ['SPC', 'f', 's'] },
          { prompt: 'Switch to another buffer', keys: ['SPC', 'b', 'b'] },
          { prompt: 'Kill (close) the current buffer', keys: ['SPC', 'b', 'k'] },
          { prompt: 'Open recent files list', keys: ['SPC', 'f', 'r'] },
        ],
      },
      {
        id: 'w5l4', type: 'keydrill', title: 'Muscle memory: windows & projects',
        body: `Window splits are how Emacs people live. Projects make big codebases feel small.`,
        drills: [
          { prompt: 'Split window vertically', keys: ['SPC', 'w', 'v'] },
          { prompt: 'Move to the window on the left', keys: ['SPC', 'w', 'h'] },
          { prompt: 'Close the current window', keys: ['SPC', 'w', 'd'] },
          { prompt: 'Find a file in the current project', keys: ['SPC', 'p', 'f'] },
          { prompt: 'Search the whole project (ripgrep)', keys: ['SPC', 's', 'p'] },
          { prompt: 'Open Magit (git status)', keys: ['SPC', 'g', 'g'] },
        ],
      },
      {
        id: 'w5l8', type: 'keydrill', title: 'Muscle memory: the help system',
        body: `Emacs is self-documenting — these bindings ARE the manual. Drill them until asking
Emacs feels faster than googling.`,
        drills: [
          { prompt: 'Describe a function (docs + source)', keys: ['SPC', 'h', 'f'] },
          { prompt: 'Describe a variable', keys: ['SPC', 'h', 'v'] },
          { prompt: 'What does this key do?', keys: ['SPC', 'h', 'k'] },
          { prompt: 'Run any command by name (M-x)', keys: ['SPC', ':'] },
          { prompt: 'Search text in the current buffer', keys: ['SPC', 's', 's'] },
        ],
      },
      {
        id: 'w5l5', type: 'info', title: 'Magit: git as a mind-reading UI',
        body: `Magit is the #1 reason people who hate Emacs use Emacs. From \`SPC g g\`:

- \`s\` — stage file/hunk under cursor · \`u\` — unstage
- \`c c\` — commit (write message, then \`C-c C-c\` to confirm)
- \`P p\` — push · \`F p\` — pull
- \`b b\` — switch branch · \`b c\` — create branch
- \`z z\` — stash
- \`Tab\` — expand/collapse diffs, \`?\` — show every possible action

You stage *hunks* (or single lines!) as easily as whole files. Interactive rebase
(\`r i\`) turns history editing into checkbox editing. Once magit clicks, the git CLI
feels like carving stone tablets.`,
      },
      {
        id: 'w5l6', type: 'info', title: 'Doom power tools you must know',
        body: `- **which-key** — the popup menu after \`SPC\`. Your permanent tutor.
- **vertico + consult** — every list (files, buffers, commands) is fuzzy-searchable. Type fragments: \`conf doo\` matches \`config/doom\`.
- **\`SPC h\` help system** — Emacs is self-documenting. \`SPC h f\` shows any function's docs AND source. \`SPC h k\` then press any key — tells you what it does.
- **org-mode** — outlines, TODOs, agendas, literate documents. A whole life-OS. \`SPC n\` prefix.
- **workspaces** — \`SPC TAB\` prefix: isolated window layouts per project.
- **\`gc\`** — comment/uncomment (with any motion: \`gcc\` line, \`gcap\` paragraph).
- **\`zz\`** — center screen on cursor · \`zs / z=\` spell · \`gd\` — go to definition (LSP).

The **g** and **z** prefixes are goldmines — explore them with which-key.`,
      },
      {
        id: 'w5l9', type: 'keydrill', title: 'Muscle memory: workspaces & quick jumps',
        body: `Workspaces isolate window layouts per project. Drill the everyday shortcuts.`,
        drills: [
          { prompt: 'Create a new workspace', keys: ['SPC', 'Tab', 'n'] },
          { prompt: 'Delete the current workspace', keys: ['SPC', 'Tab', 'd'] },
          { prompt: 'Switch buffer (quick)', keys: ['SPC', ','] },
          { prompt: 'Find file (quick)', keys: ['SPC', '.'] },
          { prompt: 'Toggle project sidebar (treemacs)', keys: ['SPC', 'o', 'p'] },
        ],
      },
      {
        id: 'w5l10', type: 'info', title: 'Dired & treemacs: files without leaving',
        body: `Two ways to manage files without a separate file manager:

**Treemacs (\`SPC o p\`)** — a persistent project tree on the side. Click or
keyboard-navigate; open files, create folders, rename. Great for orientation.

**Dired** — Emacs's built-in directory editor. Open a folder as a buffer:
\`SPC f d\` (or visit a directory with find-file). Then:
- \`RET\` open · \`+\` create directory · \`C\` copy · \`R\` rename · \`D\` delete
- Mark files with \`m\`, operate on the marked set

Dired is a *buffer*, so every Vim motion and Doom binding still works. Power users
live in dired for bulk renames and project cleanup.`,
      },
      {
        id: 'w5l7', type: 'quiz', title: 'Doom initiation exam',
        quiz: [
          { q: 'What provides Vim keybindings inside Doom Emacs?', choices: ['viper-mode', 'evil-mode', 'vim.el', 'doom-vim'], answer: 1, explain: 'evil-mode = Extensible VI Layer. The most complete Vim emulation anywhere.' },
          { q: 'You forgot a keybinding. Best move?', choices: ['Google it', 'Press SPC and read the which-key popup', 'Restart Emacs', 'Check the manual'], answer: 1, explain: 'which-key shows every continuation live. Discoverability > memorization.' },
          { q: 'After adding a package to packages.el you must run:', choices: ['doom sync', 'doom doctor', 'M-x restart', 'apt install'], answer: 0, explain: 'doom sync installs/rebuilds. doom doctor diagnoses problems.' },
          { q: 'Stage a hunk in Magit:', choices: ['a', 's', 'S', 'git add'], answer: 1, explain: 's stages the thing at point — file, hunk, or selected lines.' },
          { q: 'Where do YOUR customizations go?', choices: ['init.el in doom source', '~/.config/doom/config.el', '.emacs', 'anywhere'], answer: 1, explain: 'config.el is yours. init.el toggles modules; packages.el declares packages.' },
          { q: 'What does `gcc` do in Doom (normal mode)?', choices: ['Compile', 'Comment/uncomment the line', 'Git commit', 'Change case'], answer: 1, explain: 'gc is the comment operator — gcc for a line, gc + any motion/object.' },
        ],
      },
    ],
  },
  {
    id: 'w6', name: 'World 6 · The Lisp Within', icon: 'wand',
    tagline: 'Emacs is a Lisp interpreter with an editor attached. Learn the spellbook.',
    lessons: [
      {
        id: 'w6l1', type: 'info', title: 'Elisp in 10 minutes',
        body: `Emacs Lisp looks alien for one reason: **the function comes first, inside the parens.**

\`\`\`elisp
(+ 1 2)              ; → 3
(concat "doom" "ed") ; → "doomed"
(message "hi %s" "you") ; print to echo area
\`\`\`

Variables and functions:
\`\`\`elisp
(setq my-name "wizard")        ; set a variable
(defun greet (name)            ; define a function
  "Say hello to NAME."         ; docstring
  (message "Hello, %s!" name))
(greet my-name)                ; → "Hello, wizard!"
\`\`\`

Control flow:
\`\`\`elisp
(if (> 3 2) "yes" "no")        ; → "yes"
(when (fboundp 'magit) (magit-status))
(dolist (x '(1 2 3)) (message "%d" x))
(let ((a 1) (b 2)) (+ a b))    ; local variables → 3
\`\`\`

**The killer feature:** put your cursor after any expression and press
\`C-x C-e\` (eval-last-sexp) — it runs *immediately, inside your live editor*.
You reprogram Emacs while flying it.`,
      },
      {
        id: 'w6l2', type: 'quiz', title: 'Read the parens',
        quiz: [
          { q: 'What does (+ 2 (* 3 4)) evaluate to?', choices: ['20', '14', '24', 'error'], answer: 1, explain: 'Inner first: (* 3 4)=12, then (+ 2 12)=14.' },
          { q: 'How do you set variable `foo` to 42?', choices: ['foo = 42', '(setq foo 42)', '(set foo = 42)', '(defvar 42 foo)'], answer: 1, explain: 'setq = "set quoted". (defvar foo 42) also works for declarations with docstrings.' },
          { q: "What does the quote in '(1 2 3) mean?", choices: ['A string', "Don't evaluate — treat as literal list data", 'A comment', 'A macro'], answer: 1, explain: "Without quote, Lisp would try to call function `1`. Quote says: data, not code." },
          { q: 'In (defun greet (name) "docstring" body...), what is "docstring"?', choices: ['A comment', 'Documentation shown by SPC h f', 'The return value', 'Dead code'], answer: 1, explain: 'Docstrings power the self-documenting help system. Always write them.' },
          { q: '(let ((x 5)) (* x x)) returns:', choices: ['5', '25', 'x', 'error'], answer: 1, explain: 'let binds x=5 locally, body computes 25.' },
        ],
      },
      {
        id: 'w6cd1', type: 'codedrill', title: 'Cast your first spell: setq',
        body: `Time to WRITE Lisp, not just read it. Type real Elisp into the console below.`,
        code: {
          prompt: 'Set the variable `doom-theme` to the symbol `doom-gruvbox` (remember: symbols are quoted).',
          placeholder: '(setq ...)',
          checks: [
            { re: '^\\(setq\\b', hint: 'Start with (setq — the assignment special form.' },
            { re: 'doom-theme', hint: 'The variable is doom-theme.' },
            { re: "'doom-gruvbox", hint: "Quote the symbol: 'doom-gruvbox — without the quote, Lisp would evaluate it as a variable." },
            { re: '\\)\\s*$', hint: 'Close your parens!' },
          ],
          solution: "(setq doom-theme 'doom-gruvbox)",
        },
      },
      {
        id: 'w6l3', type: 'info', title: 'Hooks, modes, and interactive commands',
        body: `Three concepts unlock 90% of Emacs customization:

**1. Interactive commands** — add \`(interactive)\` and your function becomes
callable via \`M-x\` and bindable to keys:
\`\`\`elisp
(defun my/insert-date ()
  "Insert today's date."
  (interactive)
  (insert (format-time-string "%Y-%m-%d")))
\`\`\`

**2. Hooks** — lists of functions that run on events (mode start, save, etc.):
\`\`\`elisp
(add-hook 'python-mode-hook #'flycheck-mode)   ; lint when editing python
(add-hook 'before-save-hook #'whitespace-cleanup)
\`\`\`

**3. Major & minor modes** — every buffer has ONE major mode (python-mode,
org-mode) defining its core behavior, plus many minor modes (flycheck, evil…)
layering features. \`SPC h m\` describes the current modes.

Buffer-manipulation vocabulary worth knowing: \`(point)\` cursor position,
\`(insert "text")\`, \`(buffer-string)\`, \`(save-excursion ...)\` = do stuff and
restore cursor, \`(current-buffer)\`, \`(goto-char (point-min))\`.`,
      },
      {
        id: 'w6cd2', type: 'codedrill', title: 'Forge a command: interactive defun',
        body: `Write a complete interactive command — the kind you could bind to a key or run with \`M-x\`.`,
        code: {
          prompt: 'Define a function `my/hello` that takes no arguments, is interactive, and calls (message "hi").',
          placeholder: '(defun my/hello ()\n  ...)',
          checks: [
            { re: '^\\(defun\\s+my/hello\\s*\\(\\)', hint: 'Start: (defun my/hello () — name, then an empty argument list.' },
            { re: '\\(interactive\\)', hint: 'Add (interactive) — without it, M-x cannot see your function.' },
            { re: '\\(message\\s+"hi"\\)', hint: 'The body: (message "hi").' },
            { re: '\\)\\s*$', hint: 'Balance those parens at the end.' },
          ],
          solution: '(defun my/hello ()\n  (interactive)\n  (message "hi"))',
        },
      },
      {
        id: 'w6cd3', type: 'codedrill', title: 'Hook it up',
        body: `Hooks are how you say "whenever X happens, do Y". Write a real one.`,
        code: {
          prompt: "Add `display-line-numbers-mode` to `prog-mode-hook` (line numbers in every programming buffer). Remember: the hook symbol is quoted, the function gets a sharp quote.",
          placeholder: '(add-hook ...)',
          checks: [
            { re: '^\\(add-hook\\b', hint: 'Start with (add-hook — the function that registers hook callbacks.' },
            { re: "'prog-mode-hook", hint: "First argument: the hook symbol, quoted — 'prog-mode-hook." },
            { re: "#'display-line-numbers-mode", hint: "Second argument: the function reference with a sharp quote — #'display-line-numbers-mode." },
            { re: '\\)\\s*$', hint: 'Close the paren.' },
          ],
          solution: "(add-hook 'prog-mode-hook #'display-line-numbers-mode)",
        },
      },
      {
        id: 'w6cd4', type: 'codedrill', title: 'Local scope: let',
        body: `\`let\` binds variables only inside its body. Write a classic double.`,
        code: {
          prompt: 'Write a let form that binds x to 21 and returns (* x 2).',
          placeholder: '(let ...)',
          checks: [
            { re: '^\\(let\\b', hint: 'Start with (let' },
            { re: '\\(\\(\\s*x\\s+21\\s*\\)\\)', hint: 'Binding list: ((x 21)) — double parens!' },
            { re: '\\(\\*\\s+x\\s+2\\)', hint: 'Body: (* x 2)' },
            { re: '\\)\\s*$', hint: 'Close the outer paren.' },
          ],
          solution: '(let ((x 21)) (* x 2))',
        },
      },
      {
        id: 'w6l4', type: 'quiz', title: 'Machinery check',
        quiz: [
          { q: 'What makes a function callable with M-x?', choices: ['(public)', '(interactive)', 'defun alone', '(export)'], answer: 1, explain: '(interactive) marks it as a command, not just a function.' },
          { q: 'Run flycheck automatically in every Python buffer:', choices: ["(add-hook 'python-mode-hook #'flycheck-mode)", '(flycheck python)', "(setq python 'flycheck)", '(require flycheck-python)'], answer: 0, explain: 'Hooks fire when the mode activates. #\' is a sharp-quote for function references.' },
          { q: 'How many major modes can one buffer have?', choices: ['Unlimited', 'Exactly one', 'Two', 'Zero or one'], answer: 1, explain: 'One major mode; unlimited minor modes.' },
          { q: '(save-excursion ...) is for:', choices: ['Saving the file', 'Running code then restoring cursor/buffer position', 'Backup files', 'Undo'], answer: 1, explain: 'Lets your function wander the buffer without disturbing the user\'s cursor.' },
          { q: 'Evaluate the Lisp expression before the cursor:', choices: ['C-x C-e', 'M-x run', 'SPC e e', ':eval'], answer: 0, explain: 'eval-last-sexp — the tightest feedback loop in programming. (Doom: also `gr` in some modes, or SPC m e e in elisp buffers.)' },
        ],
      },
    ],
  },
  {
    id: 'w65', name: 'World 6.5 · Deeper Lisp', icon: 'sparkles',
    tagline: 'Lists, buffers, and control flow — write real Emacs code, not just config snippets.',
    lessons: [
      {
        id: 'w65l1', type: 'info', title: 'Lists: the bones of Lisp',
        body: `Almost everything in Elisp is a **list** (or an atom). The classic operations:

\`\`\`elisp
'(a b c)           ; a quoted list (data, not a call)
(car '(a b c))     ; → a   (first element)
(cdr '(a b c))     ; → (b c)  (rest of the list)
(cons 'x '(a b))   ; → (x a b)  (prepend)
(list 1 2 3)       ; → (1 2 3)  (build a list)
(length '(a b c))  ; → 3
(nth 1 '(a b c))   ; → b  (0-indexed)
\`\`\`

\`car\`/\`cdr\` names are historical (old machine registers). You will see them forever.
\`cons\` builds pairs; lists are chains of cons cells ending in \`nil\`.

**When to quote:** \`(list a b)\` evaluates \`a\` and \`b\`. \`(a b)\` tries to *call* function
\`a\`. \`' (a b)\` is literal data. This distinction is half of Lisp fluency.`,
      },
      {
        id: 'w65l2', type: 'quiz', title: 'List surgery exam',
        quiz: [
          { q: "(car '(doom emacs)) →", choices: ['doom', '(doom emacs)', 'emacs', 'error'], answer: 0, explain: 'car = first element.' },
          { q: "(cdr '(1 2 3)) →", choices: ['1', '(2 3)', '(1 2 3)', 'nil'], answer: 1, explain: 'cdr = the rest after the first.' },
          { q: "(cons 0 '(1 2)) →", choices: ['(0 1 2)', '(1 2 0)', '01 2', 'error'], answer: 0, explain: 'cons prepends to a list.' },
          { q: "Difference between (list a b) and '(a b)?", choices: ['None', '(list a b) evaluates a and b; quote is literal symbols', 'list is slower', 'quote is deprecated'], answer: 1, explain: 'Quote freezes evaluation. list builds from evaluated args.' },
          { q: '(length nil) →', choices: ['error', '0', '1', 'nil'], answer: 1, explain: 'nil is the empty list. Length 0.' },
        ],
      },
      {
        id: 'w65cd1', type: 'codedrill', title: 'Loop with dolist',
        body: `Iterate a list without indexes. \`dolist\` is the everyday loop.`,
        code: {
          prompt: "Write (dolist (x '(1 2 3)) (message \"%d\" x)) — print each number.",
          placeholder: '(dolist ...)',
          checks: [
            { re: '^\\(dolist\\b', hint: 'Start with (dolist' },
            { re: "\\(\\s*x\\s+'\\(1\\s+2\\s+3\\)\\s*\\)", hint: "Binding: (x '(1 2 3))" },
            { re: '\\(message\\s+"%d"\\s+x\\)', hint: 'Body: (message "%d" x)' },
            { re: '\\)\\s*$', hint: 'Close the outer paren.' },
          ],
          solution: "(dolist (x '(1 2 3)) (message \"%d\" x))",
        },
      },
      {
        id: 'w65l3', type: 'info', title: 'Talking to the buffer',
        body: `Your functions edit text by moving **point** (the cursor) and inserting:

\`\`\`elisp
(point)                    ; current position (integer)
(point-min) / (point-max)  ; start / end of accessible buffer
(goto-char (point-min))    ; jump to start
(insert "hello")           ; type text at point
(buffer-string)            ; whole buffer as a string
(save-excursion            ; do stuff, restore point after
  (goto-char (point-max))
  (insert "\\n;; end"))
\`\`\`

**Rule:** if a command wanders the buffer, wrap it in \`save-excursion\` so the
user's cursor doesn't teleport. Interactive commands that *should* move point
(like search) skip that wrapper on purpose.`,
      },
      {
        id: 'w65cd2', type: 'codedrill', title: "Insert today's date",
        body: `A real utility command: interactive, inserts an ISO date at point.`,
        code: {
          prompt: 'Define interactive my/insert-date that inserts (format-time-string "%Y-%m-%d").',
          placeholder: '(defun my/insert-date ()\n  ...)',
          checks: [
            { re: '^\\(defun\\s+my/insert-date\\s*\\(\\)', hint: '(defun my/insert-date ()' },
            { re: '\\(interactive\\)', hint: 'Must be (interactive)' },
            { re: '\\(insert\\s+\\(format-time-string\\s+"%Y-%m-%d"\\)\\)', hint: '(insert (format-time-string "%Y-%m-%d"))' },
            { re: '\\)\\s*$', hint: 'Close parens.' },
          ],
          solution: '(defun my/insert-date ()\n  (interactive)\n  (insert (format-time-string "%Y-%m-%d")))',
        },
      },
      {
        id: 'w65l4', type: 'info', title: 'cond, when, unless',
        body: `Beyond \`if\`:

\`\`\`elisp
(when condition
  body...)          ; if true, run body (no else)

(unless condition
  body...)          ; if false, run body

(cond
  ((eq x 'a) "aye")
  ((eq x 'b) "bee")
  (t "default"))    ; t is the catch-all
\`\`\`

\`cond\` is multi-branch \`if\`. Each clause is \`(test body...)\`; first true test wins.
\`when\`/\`unless\` keep single-branch logic readable — prefer them over \`(if x (progn …))\`.`,
      },
      {
        id: 'w65l5', type: 'quiz', title: 'Deeper Lisp final',
        quiz: [
          { q: "(cons 'a nil) is the same as:", choices: ["'(a)", 'nil', "'(a nil)", 'a'], answer: 0, explain: 'A one-element list is a cons with cdr nil.' },
          { q: 'save-excursion is for:', choices: ['Saving the file', 'Running code then restoring point', 'Undo', 'Autosave'], answer: 1, explain: 'Wander freely, put the cursor back.' },
          { q: 'cond clauses are tried:', choices: ['All in parallel', 'Top to bottom until one test is non-nil', 'Bottom to top', 'Randomly'], answer: 1, explain: 'First matching clause wins; t is the default.' },
          { q: 'unless is equivalent to:', choices: ['when', 'when not', 'if', 'cond'], answer: 1, explain: '(unless c body) = (when (not c) body).' },
          { q: 'insert places text:', choices: ['At end of buffer always', 'At point (cursor)', 'In the kill ring', 'In a new buffer'], answer: 1, explain: 'insert types at the current point.' },
        ],
      },
    ],
  },
  {
    id: 'w7', name: 'World 7 · Forge Your Doom', icon: 'hammer',
    tagline: 'Write config.el like a wizard. Add packages, bind keys, bend Doom to your will.',
    lessons: [
      {
        id: 'w7l1', type: 'info', title: 'The three sacred files',
        body: `\`~/.config/doom/\` contains your entire identity:

**\`init.el\`** — the module menu. Doom is ~150 modules; uncomment what you want:
\`\`\`elisp
:lang (python +lsp)   ; python support with LSP
:tools magit          ; git porcelain
:ui doom-dashboard    ; pretty start screen
\`\`\`

**\`packages.el\`** — declare extra packages (from MELPA etc.):
\`\`\`elisp
(package! rainbow-mode)
(package! copilot :recipe (:host github :repo "copilot-emacs/copilot.el"))
\`\`\`

**\`config.el\`** — your personal Lisp. Runs at startup:
\`\`\`elisp
(setq doom-theme 'doom-one
      display-line-numbers-type 'relative)

(map! :leader :desc "Insert date" "i d" #'my/insert-date)

(after! org
  (setq org-agenda-files '("~/notes")))
\`\`\`

Golden rules: wrap package config in \`after!\` (lazy-load safe), use \`map!\` for
keybindings, run \`doom sync\` after touching init.el/packages.el, and
\`doom doctor\` when something breaks.`,
      },
      {
        id: 'w7l2', type: 'info', title: 'map! — the keybinding spellbook',
        body: `Doom's \`map!\` macro handles evil states, leader keys, and mode-locals:

\`\`\`elisp
;; Global leader binding: SPC o w
(map! :leader
      :desc "Word count" "o w" #'count-words)

;; Normal-mode binding only in python buffers
(map! :map python-mode-map
      :n "g r" #'python-shell-send-region)

;; :n normal, :i insert, :v visual, :nv both
(map! :nv "C-j" #'evil-scroll-down)
\`\`\`

A complete custom command, bound and documented:
\`\`\`elisp
(defun my/open-config ()
  "Jump to my config.el."
  (interactive)
  (find-file "~/.config/doom/config.el"))

(map! :leader :desc "My config" "f m" #'my/open-config)
\`\`\`

That's the full loop: **write Lisp → eval with C-x C-e → bind with map! → it's
part of your editor forever.** You are no longer a user; you're a co-author.`,
      },
      {
        id: 'w7cd1', type: 'codedrill', title: 'Declare a package',
        body: `Write the packages.el line that installs a new package.`,
        code: {
          prompt: 'Declare the package `rainbow-mode` for installation (Doom style).',
          placeholder: '(package! ...)',
          checks: [
            { re: '^\\(package!\\s+', hint: "Doom's macro is package! (with the bang)." },
            { re: 'rainbow-mode', hint: 'The package name is rainbow-mode (no quote needed here).' },
            { re: '\\)\\s*$', hint: 'Close the paren.' },
          ],
          solution: '(package! rainbow-mode)',
        },
      },
      {
        id: 'w7cd2', type: 'codedrill', title: 'Bind your own key',
        body: `The full loop: bind \`SPC o d\` to the function \`my/insert-date\` with a which-key description.`,
        code: {
          prompt: 'Write a map! form: leader key "o d", description "Insert date", function #\'my/insert-date.',
          placeholder: '(map! :leader\n      ...)',
          checks: [
            { re: '^\\(map!\\s', hint: 'Use the (map! …) macro.' },
            { re: ':leader', hint: 'Add :leader so the binding hangs off SPC.' },
            { re: ':desc\\s+"Insert date"', hint: 'Add :desc "Insert date" — that text shows in the which-key popup.' },
            { re: '"o d"', hint: 'The key sequence is the string "o d".' },
            { re: "#'my/insert-date", hint: "Reference the function with a sharp quote: #'my/insert-date." },
          ],
          solution: "(map! :leader\n      :desc \"Insert date\" \"o d\" #'my/insert-date)",
        },
      },
      {
        id: 'w7cd3', type: 'codedrill', title: 'Lazy and safe: after!',
        body: `Never configure a package before it loads. Wrap settings in \`after!\`.`,
        code: {
          prompt: "Wrap (setq org-agenda-files '(\"~/org\")) inside (after! org …).",
          placeholder: '(after! org\n  ...)',
          checks: [
            { re: '^\\(after!\\s+org\\b', hint: 'Start: (after! org' },
            { re: '\\(setq\\s+org-agenda-files', hint: 'Inside: (setq org-agenda-files …)' },
            { re: "'\\(\"~/org\"\\)", hint: "The value is a quoted list: '(\"~/org\")" },
            { re: '\\)\\s*$', hint: 'Balance the parens.' },
          ],
          solution: "(after! org\n  (setq org-agenda-files '(\"~/org\")))",
        },
      },
      {
        id: 'w7l5', type: 'info', title: 'Anatomy of a Doom module',
        body: `Doom modules live under categories in \`init.el\`:

\`\`\`elisp
:ui       ; interface (doom-dashboard, treemacs, …)
:editor   ; evil, fold, snippets, …
:emacs    ; dired, undo, vc, …
:tools    ; magit, lsp, debugger, …
:lang     ; language packs (python, rust, org, …)
:config   ; default + literate
\`\`\`

Flags customize a module: \`(python +lsp +pyright)\` enables LSP with pyright.
After toggling modules or packages: **\`doom sync\`**.

Browse what a module provides: \`SPC h d m\` (or read the module's README under
\`~/.config/emacs/modules/\`). You almost never edit Doom's source — only your
three files in \`~/.config/doom/\`.`,
      },
      {
        id: 'w7l3', type: 'quiz', title: 'Config wizardry exam',
        quiz: [
          { q: 'Where do you enable/disable Doom modules?', choices: ['config.el', 'init.el', 'packages.el', 'modules.el'], answer: 1, explain: 'init.el holds the doom! block listing active modules.' },
          { q: 'Install package `rainbow-mode`:', choices: ['(require rainbow-mode) in config.el', '(package! rainbow-mode) in packages.el + doom sync', 'M-x install rainbow', 'pip install rainbow-mode'], answer: 1, explain: 'Declare in packages.el, then doom sync fetches and builds it.' },
          { q: 'Why wrap config in (after! org ...)?', choices: ['Style points', 'Runs config only once org loads — respects lazy loading', 'Makes it async', 'Required syntax'], answer: 1, explain: 'Doom lazy-loads packages. Configuring before load either fails or forces early loading.' },
          { q: 'Bind SPC o c to function my/thing for all modes:', choices: ["(map! :leader \"o c\" #'my/thing)", '(global-set-key …SPC…)', '(bind SPC-o-c my/thing)', '(evil-bind leader o c)'], answer: 0, explain: 'map! with :leader targets the SPC prefix. :desc adds which-key text.' },
          { q: 'Doom feels broken after editing packages.el. First command to run?', choices: ['rm -rf ~/.emacs.d', 'doom sync (then doom doctor)', 'doom upgrade', 'reinstall Emacs'], answer: 1, explain: 'sync rebuilds the package state; doctor diagnoses environment issues.' },
          { q: 'The TRUE mark of an Emacs master is:', choices: ['Memorizing every keybinding', 'Reading which-key menus, help buffers, and writing small Lisp fixes as needs arise', 'Using only the mouse', 'Never customizing anything'], answer: 1, explain: 'Emacs mastery = fluency in self-discovery + the confidence to reshape the editor. You have both now.' },
        ],
      },
      {
        id: 'w7l4', type: 'info', title: 'Your quest continues (real-world map)',
        body: `You've built the full mental model. Here's the road to true mastery:

**Daily practice**
- Install Doom for real and live in it: Magit, \`SPC p f\`, org-mode notes.
- Play [vimgolf.com](https://www.vimgolf.com) — study top solutions after solving.
- Run Vim's built-in \`vimtutor\` once; in Doom, \`SPC h b\` explores bindings.

**Reading list**
- *Practical Vim* by Drew Neil — the operator/motion bible.
- Doom's own docs: \`SPC h d h\` inside Doom.
- *Mastering Emacs* (Mickey Petersen) — deep Emacs internals.
- The Emacs Lisp manual: \`SPC h R\` — it's genuinely good.

**Challenge ladder**
1. Add 3 custom keybindings with map!
2. Write an interactive defun you use weekly.
3. Contribute a solution in the top 20% of any vimgolf hole.
4. Publish your literate config. Become the person others learn from.

*The editor of a lifetime deserves a lifetime of learning. Welcome to it.*`,
      },
    ],
  },
  {
    id: 'w75', name: 'World 7.5 · Doom Workflows', icon: 'map',
    tagline: 'LSP navigation, workspaces, diagnostics — the daily coding loop at full speed.',
    lessons: [
      {
        id: 'w75l1', type: 'info', title: 'LSP: your code intelligence layer',
        body: `Enable \`:tools lsp\` and language flags like \`(python +lsp)\`. Then in code buffers:

- \`gd\` — **g**o to **d**efinition
- \`gD\` — go to type/declaration (when supported)
- \`K\` — hover docs at point (also \`SPC c k\`)
- \`SPC c r\` — **r**ename symbol (project-wide, careful!)
- \`SPC c a\` — code **a**ctions (quick-fixes, refactors)
- \`SPC c j\` / \`SPC c J\` — jump to symbol in file / workspace
- \`SPC c x\` — list diagnostics (errors/warnings)

LSP needs a language server installed (pyright, rust-analyzer, gopls…).
\`doom doctor\` and the modeline tell you when the server is alive.`,
      },
      {
        id: 'w75l2', type: 'keydrill', title: 'Muscle memory: code navigation',
        body: `Drill the LSP-era bindings. These become muscle memory after one real project.`,
        drills: [
          { prompt: 'Go to definition', keys: ['g', 'd'] },
          { prompt: 'Hover documentation at point', keys: ['K'] },
          { prompt: 'Rename symbol', keys: ['SPC', 'c', 'r'] },
          { prompt: 'Code actions / quick-fix', keys: ['SPC', 'c', 'a'] },
          { prompt: 'List diagnostics', keys: ['SPC', 'c', 'x'] },
        ],
      },
      {
        id: 'w75l3', type: 'info', title: 'Workspaces: one layout per project',
        body: `Doom workspaces (\`persp-mode\`) keep window layouts and buffer sets isolated:

- \`SPC TAB n\` — new workspace
- \`SPC TAB .\` — switch workspace (or \`SPC TAB TAB\`)
- \`SPC TAB ]\` / \`[\` — next / previous workspace
- \`SPC TAB d\` — delete workspace
- \`SPC TAB r\` — rename

Typical flow: one workspace per project, maybe one for notes/org.
Switching projects with \`SPC p p\` can auto-create a workspace when configured.

Your brain stops thrashing buffers — each project feels like its own desktop.`,
      },
      {
        id: 'w75l4', type: 'keydrill', title: 'Muscle memory: workspaces & project UI',
        body: `Combine workspace keys with project tooling.`,
        drills: [
          { prompt: 'New workspace', keys: ['SPC', 'Tab', 'n'] },
          { prompt: 'Next workspace', keys: ['SPC', 'Tab', ']'] },
          { prompt: 'Toggle treemacs project sidebar', keys: ['SPC', 'o', 'p'] },
          { prompt: 'Switch project', keys: ['SPC', 'p', 'p'] },
          { prompt: 'Find file in project', keys: ['SPC', 'p', 'f'] },
        ],
      },
      {
        id: 'w75l5', type: 'info', title: 'Diagnostics & formatting',
        body: `**Flycheck / flymake** surface errors as you type. In Doom:

- Modeline shows error counts
- \`SPC c x\` — diagnostics list
- \`]e\` / \`[e\` — next / previous error (evil)

**Formatting:** enable \`format\` module flags on languages. Then:

- \`SPC c f\` — format buffer/region (when configured)
- Format-on-save is a common \`config.el\` tweak per language

**The loop:** edit → glance diagnostics → \`gd\` to understand → \`SPC c a\` to fix →
\`SPC c f\` to prettify → Magit commit. Stay in the editor the whole time.`,
      },
      {
        id: 'w75l6', type: 'quiz', title: 'Workflow exam',
        quiz: [
          { q: 'gd in a code buffer (with LSP) usually means:', choices: ['Go down', 'Go to definition', 'Git diff', 'Global delete'], answer: 1, explain: 'gd is the evil+LSP go-to-definition binding.' },
          { q: 'SPC c r is for:', choices: ['Restart Emacs', 'Rename symbol via LSP', 'Revert buffer', 'Run tests'], answer: 1, explain: 'c = code prefix; r = rename.' },
          { q: 'Workspaces help by:', choices: ['Faster typing', 'Isolating window layouts and buffers per project', 'Compiling faster', 'Replacing git'], answer: 1, explain: 'Each workspace is a separate desktop for a project or task.' },
          { q: 'SPC c x opens:', choices: ['Hex editor', 'Diagnostics list', 'Clipboard', 'Config'], answer: 1, explain: 'Code → diagnostics.' },
          { q: 'Best first step when LSP seems dead?', choices: ['Reinstall Windows', 'Check language server install + doom doctor / modeline', 'Disable evil', 'Delete config.el'], answer: 1, explain: 'Servers must be installed; doctor and modeline report status.' },
        ],
      },
    ],
  },
]
