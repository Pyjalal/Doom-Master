# DOOM MASTER

> An interactive game that teaches Vim and Doom Emacs from absolute zero to
> power-user level — through hands-on drills, timed boss battles, VimGolf
> challenges, and real Elisp coding exercises.

DOOM MASTER is a React + Vite app with a full Vim editing engine. It runs in the
browser **and** as a native desktop app via [Tauri 2](https://tauri.app/). No
backend, no sign-up — progress auto-saves to `localStorage`.

---

## Table of Contents

- [DOOM MASTER](#doom-master)
  - [Table of Contents](#table-of-contents)
  - [Worlds \& Curriculum](#worlds--curriculum)
  - [Lesson Types](#lesson-types)
  - [Vim Engine](#vim-engine)
  - [Boss Battles](#boss-battles)
  - [Speedrun Arcade](#speedrun-arcade)
  - [Achievements](#achievements)
  - [XP \& Ranks](#xp--ranks)
  - [Sound](#sound)
  - [Themes](#themes)
  - [Save System](#save-system)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites (web)](#prerequisites-web)
    - [Web (browser)](#web-browser)
  - [Desktop App (Tauri)](#desktop-app-tauri)
    - [Prerequisites (desktop)](#prerequisites-desktop)
    - [Dev (desktop)](#dev-desktop)
    - [Production desktop build](#production-desktop-build)
    - [Desktop scripts](#desktop-scripts)
    - [Desktop notes](#desktop-notes)
  - [Testing](#testing)
  - [License](#license)

---

## Worlds & Curriculum

The campaign is structured as 9 worlds with progressive difficulty. Each world
contains a mix of info lessons, interactive drills, quizzes, and a final boss
battle. Worlds unlock at 70% completion of the previous one; bosses unlock when
every other lesson in the world is complete.

| World | Title | Topics Covered |
|---|---|---|
| 1 | Vim Survival | Modal editing concept, hjkl movement, insert family (i/a/A/o/O), Escape, counts |
| 2 | Motion Mastery | Word motions (w/b/e/W/B/E), line jumps (0/^/$/gg/G), character search (f/t/;/,), counts with motions |
| 3 | Grammar of Editing | Operator + motion grammar (d/c/y), text objects (ciw, ci", da"), line operations (dd/yy/p), undo/redo |
| 4 | VimGolf Dojo | 18 competitive keystroke challenges with par scores — front nine covers basics (xp, ~, r, J); back nine covers macros, `:s` substitution, `:g` global commands, and dot-repeat optimization |
| 4.5 | Clipboard Sorcery | Named registers ("a-"z), marks (ma, \`a), macro recording and replay (qa...q, @a, @@), macro-based refactoring patterns |
| 5 | Enter DOOM | Doom Emacs overview, evil-mode, leader key (SPC), which-key discovery, Magit integration, project management, window splits — includes real key-sequence drills |
| 6 | The Lisp Within | Emacs Lisp fundamentals: syntax, `(interactive)`, hooks, major/minor modes, `save-excursion`, `let` bindings, `defun`, sharp-quotes — includes codedrills where you write actual Elisp |
| 7 | Forge Your Doom | Doom configuration: `init.el` module system, `config.el` customizations, `packages.el` package declaration, `map!` keybinding syntax, `after!` lazy-loading, `doom sync` workflow — includes codedrills |
| 8 | Org-mode Life OS | Org-mode: headings and folding, TODO states and priorities, tags, SCHEDULED vs DEADLINE, agenda views, capture (`SPC X`), org-babel code blocks, literate config with tangle |

---

## Lesson Types

| Type | Description |
|---|---|
| **info** | Reading lessons with Markdown-rendered content. Mark as learned to earn 15 XP. |
| **drill** | Live Vim editor tasks. Transform start text into target text using any valid Vim commands. Keystrokes are counted. Awards 30 XP. |
| **golf** | Competitive VimGolf challenges. Every keystroke counts (including Escape). Gold/Silver/Bronze medals awarded based on par. Awards 30 XP base + 40 gold / 20 silver bonus. |
| **quiz** | Multiple-choice quizzes with explanations. 10 XP per correct answer. Perfect scores are tracked. |
| **keydrill** | Physical key-sequence typing drills. Type exact Doom keybindings (e.g. `SPC f f`) to build muscle memory. 8 XP per drill. |
| **codedrill** | Free-text Elisp writing exercises. Solutions are validated against regex patterns. Hints and solution reveal available. Awards 25 XP. |
| **boss** | Multi-stage timed boss battles. See [Boss Battles](#boss-battles) below. Awards 100 XP. |

---

## Vim Engine

The application includes a from-scratch Vim engine (`src/engine/vim.js`) that
implements modal editing as pure functions operating on immutable state. No
external editing library is used.

**Supported features:**

- **Modes**: Normal, Insert, Visual, Visual-line
- **Motions**: `h j k l w b e W B E 0 ^ $ gg G f t F T ; , %`
- **Operators**: `d c y x p P` with counts and motion combinations
- **Text objects**: `iw aw i" a" i( a) i{ a} i' a' iw aw`
- **Counts**: `3w 2dd 5j 7x` — any count with any motion or operator
- **Dot-repeat**: `.` repeats the last change, including complex operations
- **Search**: `/pattern` forward search, `n`/`N` repeat, `*` word-under-cursor
- **Ex commands**: `:s/pat/repl/`, `:%s/g`, `:g/pat/d`, `:g/pat/m0`, `:N`, `:m`, `:2,3d`, `:%normal`
- **Registers**: 26 named registers (`"a` through `"z`), unnamed register, `"ayy`, `"ap`
- **Marks**: `ma` set mark, `` `a `` jump to mark, `d'a` delete to mark
- **Macros**: `qa` record, `q` stop, `@a` replay, `@@` repeat last, counts with macros
- **Undo/redo**: `u` undo, `Ctrl-r` redo
- **Case**: `~` toggle case under cursor
- **Visual mode**: `v` char-wise, `V` line-wise, operators work on visual selections

The engine tracks usage flags (`usedDot`, `usedMacro`, `usedEx`, `usedSearch`)
which feed into the achievement system — for example, solving a golf challenge
with `.` unlocks the "Dot Golfer" achievement.

---

## Boss Battles

Each world culminates in a boss battle — a timed, multi-stage encounter that
tests everything learned in that world.

- **Stage types**: Vim editor drills, key-sequence challenges, and quiz questions
- **Timer**: Each boss has a time limit (60-120 seconds depending on difficulty)
- **HP system**: Boss HP decreases as stages are cleared; a visual HP bar shows progress
- **Time penalties**: Wrong answers in quiz/keys stages cost 3-8 seconds
- **Best score**: Your best time remaining is saved per boss; replay to improve
- **Visual effects**: Screen shake on damage, critical timer styling under 10 seconds
- **Sound**: Boss encounter music, victory fanfare, and defeat tones

Bosses are gated — you must complete every non-boss lesson in the world before
the boss battle unlocks.

---

## Speedrun Arcade

A separate game mode accessible from the campaign map:

- 60-second timer with +6 seconds bonus per solve
- Random micro-drills drawn from a pool of 20 challenges
- Combo multiplier for consecutive solves without mistakes
- High score tracking with persistent storage
- Awards the "Speed Demon" achievement at 10+ points

---

## Achievements

15 unlockable achievements with toast notifications and a modal gallery:

| Achievement | Condition |
|---|---|
| First Blood | Solve your first drill |
| Bookworm | Read 10 info lessons |
| Under Par x5 | Earn 5 gold medals in the VimGolf Dojo |
| Dot Golfer | Solve a challenge using the `.` command |
| Macro Master | Solve a challenge using a macro (`@`) |
| Regex Surgeon | Solve a challenge using an ex command (`:`) |
| Searchlight | Solve a challenge using `/` search |
| Quiz Ace | Score 100% on any quiz |
| Key Warrior | Complete 5 keybinding drills |
| Week Warrior | Play 7 days in a row |
| Boss Slayer | Defeat your first boss |
| Doom Slayer | Defeat every boss |
| Speed Demon | Score 10+ in the arcade |
| Halfway There | Complete 50% of all lessons |
| Completionist | Complete every lesson |

---

## XP & Ranks

XP is awarded for completing lessons, with bonus XP for golf medals and boss
kills. Eight ranks track progression from beginner to master:

| Rank | XP Required |
|---|---|
| Evil Newborn | 0 |
| Escape Artist | 100 |
| Motion Apprentice | 250 |
| Operator Adept | 450 |
| Golf Hustler | 700 |
| Doom Initiate | 1000 |
| Elisp Sorcerer | 1350 |
| DOOM MASTER | 1700 |

Rank-ups trigger a celebratory modal with sound and visual effects.

**XP awards:**

| Action | XP |
|---|---|
| Info lesson | 15 |
| Quiz (per correct answer) | 10 |
| Drill | 30 |
| Golf (base) | 30 |
| Golf gold medal | +40 |
| Golf silver medal | +20 |
| Keybinding drill (per drill) | 8 |
| Code drill | 25 |
| Boss battle | 100 |

---

## Sound

All sound effects are synthesized in real-time using the Web Audio API — no
audio files are loaded. The synth (`src/sound.js`) provides:

- Keystroke ticks during editing
- Success and error tones for answers
- Medal fanfares (ascending arpeggios for gold)
- Rank-up ceremony sound
- Boss encounter, victory, and defeat sounds
- Combo multiplier tones in arcade mode
- Achievement unlock chime

Sound can be toggled from the header. The setting persists across sessions.

---

## Themes

Four color themes are available and switchable from the header dropdown:

| Theme | Style |
|---|---|
| Doom One | Default — dark blue/teal palette matching Doom Emacs |
| Gruvbox | Warm earth tones (green, yellow, orange on dark brown) |
| Nord | Cool blues and grays inspired by Nordic landscapes |
| Dracula | Purple and pink accents on dark background |

Theme selection persists across sessions.

---

## Save System

Progress is auto-saved to `localStorage` after every action. The save schema
includes:

- Completed lesson IDs and timestamps
- Total XP and current rank
- Golf best scores (fewest keystrokes per hole)
- Boss best scores (most time remaining per boss)
- Arcade high score
- Achievement unlock dates
- Daily streak data (count, last play date)
- Statistics (drills solved, info read, perfect quizzes, bosses slain)
- Settings (sound on/off, theme)

The save system includes a v1-to-v2 migration path for backward compatibility.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Desktop shell | Tauri 2 (WebView2 on Windows) |
| Icons | lucide-react |
| Testing | Node.js built-in test runner |
| Audio | Web Audio API (no audio files) |
| Storage | localStorage |
| Styling | Plain CSS with CSS custom properties (no preprocessor) |

Web runtime deps: React and lucide-react. Desktop also uses `@tauri-apps/api`.

---

## Project Structure

```
src/
  App.jsx                  # Main application component, routing, game state
  icons.jsx                # Lucide icon registry and <Icon> component
  sound.js                 # Web Audio API synth for all sound effects
  state.js                 # Save/load/migration logic
  styles.css               # All CSS (themes, components, animations)
  windowChrome.js          # Tauri window helpers (fullscreen, drag, etc.)
  platform.js              # Platform detection / service worker config
  engine/
    vim.js                 # Vim engine (pure functions, immutable state)
    vim.test.js            # 40+ unit tests for the engine
  data/
    index.js               # World aggregation, ranks, XP, unlock logic
    vimWorlds.js           # Worlds 1-3: Vim basics, motions, operators
    golfWorld.js           # World 4: 18 VimGolf challenges
    registersWorld.js      # World 4.5: registers, marks, macros
    doomWorlds.js          # Worlds 5-7: Doom Emacs, Elisp, config
    orgWorld.js            # World 8: Org-mode
    achievements.js        # Achievement definitions and unlock checker
    bosses.js              # Boss battle definitions for all 9 worlds
  components/
    VimEditor.jsx          # Interactive Vim editor with cursor, modes, cmdline
    Drill.jsx              # Drill and golf lesson renderer
    Quiz.jsx               # Quiz lesson renderer
    KeyDrill.jsx           # Key-sequence typing drill renderer
    CodeDrill.jsx          # Elisp free-text coding drill renderer
    Boss.jsx               # Boss battle component (phases, timer, HP)
    Arcade.jsx             # Speedrun arcade mode
    AchievementsModal.jsx  # Achievement gallery modal
    Markdown.jsx           # Lightweight Markdown renderer for lesson content
    TitleBar.jsx           # Custom frameless desktop title bar (Tauri only)
src-tauri/
  tauri.conf.json          # Window config, bundle settings, product name
  capabilities/            # Tauri ACL permissions (window controls, etc.)
  src/                     # Rust entry (window bg, shadow, plugins)
  icons/                   # App icons for installers
```

---

## Getting Started

### Prerequisites (web)

- **Node.js** 18+ and npm

### Web (browser)

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

Production web build:

```bash
npm run build
```

Output is in `dist/`. Preview with:

```bash
npm run preview
```

---

## Desktop App (Tauri)

The same UI ships as a native desktop app with a custom frameless title bar
(minimize / maximize / fullscreen / close), edge resize, and F11 fullscreen.

### Prerequisites (desktop)

| Tool | Notes |
|---|---|
| **Node.js** 18+ | Same as web |
| **Rust** | Install via [rustup](https://rustup.rs/) |
| **Windows** | [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) + WebView2 (usually preinstalled on Windows 10/11) |
| **macOS** | Xcode Command Line Tools (`xcode-select --install`) |
| **Linux** | WebKitGTK and build deps — see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) |

### Dev (desktop)

Runs Vite and opens a native window against the dev server:

```bash
npm install
npm run tauri:dev
```

Equivalent: `npm run tauri -- dev`

### Production desktop build

```bash
npm run tauri:build
```

Equivalent: `npm run tauri -- build`

This runs `npm run build` (Vite → `dist/`), then compiles the Rust shell and
produces installers under:

```
src-tauri/target/release/
  app.exe                          # runnable binary (Windows)
  bundle/msi/                      # MSI installer
  bundle/nsis/                     # NSIS setup.exe
```

On other platforms you get the usual Tauri bundles (`.dmg`, `.deb`, `.AppImage`, etc.).

### Desktop scripts

| Script | Description |
|---|---|
| `npm run tauri:dev` | Dev mode: Vite + native window |
| `npm run tauri:build` | Production installers + release binary |
| `npm run tauri -- <cmd>` | Pass-through to the Tauri CLI |

### Desktop notes

- Window is **frameless** (`decorations: false`) with a custom React title bar.
- Progress still uses **localStorage** (same as the browser build).
- Service workers are disabled / cleaned up in the Tauri shell so offline caches do not fight the desktop load path.
- Fullscreen uses Tauri’s window API (F11 or the title-bar button).

---

## Testing

```bash
npm test
```

Runs 40+ unit tests covering the Vim engine using Node.js's built-in test
runner. Tests cover:

- Insert and escape modes
- Delete operators with motions and counts (`dw`, `d2w`, `dd`)
- Change operators and text objects (`ciw`, `ci"`)
- Yank and paste with counts (`yy`, `3p`)
- Character search and repeat (`f`, `;`)
- Append at end of line (`A`)
- Case toggling (`~`)
- Dot-repeat across different change types
- Macro recording, replay, and `@@` repeat
- Search forward (`/`), repeat (`n`), word search (`*`)
- Ex commands: `:s` substitution, `:%s` with capture groups, `:g/pat/d`, `:g/^/m0`
- Line operations: `:m`, `:N`, `:2,3d`, `:%normal`
- Marks: set, jump, linewise delete
- Named registers: yank and paste
- Usage flags: dot, macro, ex, search tracking

---

## License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).

See the [LICENSE](LICENSE) file for the full license text.

```text
DOOM MASTER
Copyright (C) 2026

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
