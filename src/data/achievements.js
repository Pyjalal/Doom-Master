// Achievement definitions + checker. Events:
// { kind:'drill'|'golf', strokes, par, flags:{dot,macro,ex,search} }
// { kind:'quiz', score, total } · { kind:'info' } · { kind:'keydrill' }
// { kind:'boss' } · { kind:'arcade', score } · { kind:'any' }

export const ACHIEVEMENTS = [
  { id: 'first-blood', icon: 'droplet', name: 'First Blood', desc: 'Solve your first drill' },
  { id: 'bookworm', icon: 'book', name: 'Bookworm', desc: 'Read 10 info lessons' },
  { id: 'under-par-5', icon: 'medal', name: 'Under Par ×5', desc: 'Earn 5 gold medals in the golf dojo' },
  { id: 'dot-golfer', icon: 'repeat', name: 'Dot Golfer', desc: 'Solve a challenge using the . command' },
  { id: 'macro-master', icon: 'save', name: 'Macro Master', desc: 'Solve a challenge using a macro (@)' },
  { id: 'regex-surgeon', icon: 'scissors', name: 'Regex Surgeon', desc: 'Solve a challenge using an ex command (:)' },
  { id: 'searchlight', icon: 'search', name: 'Searchlight', desc: 'Solve a challenge using / search' },
  { id: 'quiz-ace', icon: 'award', name: 'Quiz Ace', desc: 'Score 100% on any quiz' },
  { id: 'key-warrior', icon: 'piano', name: 'Key Warrior', desc: 'Complete 5 keybinding drills' },
  { id: 'week-warrior', icon: 'flame', name: 'Week Warrior', desc: 'Play 7 days in a row' },
  { id: 'boss-slayer', icon: 'skull', name: 'Boss Slayer', desc: 'Defeat your first boss' },
  { id: 'boss-god', icon: 'cross', name: 'Doom Slayer', desc: 'Defeat every boss' },
  { id: 'speed-demon', icon: 'zap', name: 'Speed Demon', desc: 'Score 10+ in the arcade' },
  { id: 'halfway', icon: 'moon', name: 'Halfway There', desc: 'Complete 50% of all lessons' },
  { id: 'completionist', icon: 'crown', name: 'Completionist', desc: 'Complete every lesson' },
]

// Returns array of newly unlocked achievement objects; mutates save.achievements.
export function checkAchievements(save, event, worlds) {
  const allLessons = worlds.flatMap((w) => w.lessons)
  const bossLessons = allLessons.filter((l) => l.type === 'boss')
  const golfLessons = allLessons.filter((l) => l.type === 'golf')
  const keydrills = allLessons.filter((l) => l.type === 'keydrill')
  const doneCount = allLessons.filter((l) => save.completed[l.id]).length
  const golds = golfLessons.filter((l) => save.golfBest[l.id] != null && save.golfBest[l.id] <= l.drill.par).length

  const cond = {
    'first-blood': () => event.kind === 'drill' || event.kind === 'golf',
    'bookworm': () => save.stats.infosRead >= 10,
    'under-par-5': () => golds >= 5,
    'dot-golfer': () => (event.flags && event.flags.dot) || false,
    'macro-master': () => (event.flags && event.flags.macro) || false,
    'regex-surgeon': () => (event.flags && event.flags.ex) || false,
    'searchlight': () => (event.flags && event.flags.search) || false,
    'quiz-ace': () => event.kind === 'quiz' && event.score === event.total && event.total > 0,
    'key-warrior': () => keydrills.filter((l) => save.completed[l.id]).length >= 5,
    'week-warrior': () => save.streak.count >= 7,
    'boss-slayer': () => save.stats.bossesSlain >= 1,
    'boss-god': () => bossLessons.length > 0 && bossLessons.every((l) => save.completed[l.id]),
    'speed-demon': () => event.kind === 'arcade' && event.score >= 10,
    'halfway': () => doneCount >= Math.ceil(allLessons.length / 2),
    'completionist': () => doneCount >= allLessons.length,
  }

  const unlocked = []
  for (const a of ACHIEVEMENTS) {
    if (save.achievements[a.id]) continue
    try {
      if (cond[a.id] && cond[a.id]()) {
        save.achievements[a.id] = Date.now()
        unlocked.push(a)
      }
    } catch { }
  }
  return unlocked
}
