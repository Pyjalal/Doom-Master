const KEY = 'doom-master-save-v2'
const OLD_KEY = 'doom-master-save-v1'

function defaults() {
  return {
    xp: 0,
    completed: {},
    golfBest: {},
    achievements: {},          // id -> timestamp
    streak: { count: 0, last: null },
    arcadeHigh: 0,
    bossBest: {},              // lessonId -> seconds left
    settings: { theme: 'doom', sound: true },
    stats: { infosRead: 0, drillsSolved: 0, perfectQuizzes: 0, bossesSlain: 0 },
  }
}

// Deep-merge so partial nested objects from older saves never leave
// completed/stats/bossBest undefined (which breaks completion marking).
function normalize(raw) {
  const d = defaults()
  if (!raw || typeof raw !== 'object') return d
  return {
    ...d,
    ...raw,
    completed: { ...d.completed, ...(raw.completed && typeof raw.completed === 'object' ? raw.completed : {}) },
    golfBest: { ...d.golfBest, ...(raw.golfBest && typeof raw.golfBest === 'object' ? raw.golfBest : {}) },
    achievements: { ...d.achievements, ...(raw.achievements && typeof raw.achievements === 'object' ? raw.achievements : {}) },
    streak: { ...d.streak, ...(raw.streak && typeof raw.streak === 'object' ? raw.streak : {}) },
    bossBest: { ...d.bossBest, ...(raw.bossBest && typeof raw.bossBest === 'object' ? raw.bossBest : {}) },
    settings: { ...d.settings, ...(raw.settings && typeof raw.settings === 'object' ? raw.settings : {}) },
    stats: { ...d.stats, ...(raw.stats && typeof raw.stats === 'object' ? raw.stats : {}) },
    xp: Number.isFinite(raw.xp) ? raw.xp : 0,
    arcadeHigh: Number.isFinite(raw.arcadeHigh) ? raw.arcadeHigh : 0,
  }
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return normalize(JSON.parse(raw))
    const old = localStorage.getItem(OLD_KEY)
    if (old) {
      const v1 = JSON.parse(old)
      const migrated = normalize({ xp: v1.xp || 0, completed: v1.completed || {}, golfBest: v1.golfBest || {} })
      localStorage.setItem(KEY, JSON.stringify(migrated))
      return migrated
    }
  } catch { }
  return defaults()
}

export function persist(save) {
  try { localStorage.setItem(KEY, JSON.stringify(save)) } catch { }
}

export function resetSave() {
  try { localStorage.removeItem(KEY); localStorage.removeItem(OLD_KEY) } catch { }
  return defaults()
}

// Daily streak: bump on first activity of each local calendar day.
export function touchStreak(save) {
  const today = new Date().toDateString()
  if (save.streak.last === today) return save
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const count = save.streak.last === yesterday ? save.streak.count + 1 : 1
  save.streak = { count, last: today }
  return save
}
