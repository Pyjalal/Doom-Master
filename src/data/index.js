import { vimWorlds } from './vimWorlds'
import { golfWorld } from './golfWorld'
import { registersWorld } from './registersWorld'
import { doomWorlds } from './doomWorlds'
import { orgWorld } from './orgWorld'
import { BOSSES } from './bosses'

const baseWorlds = [...vimWorlds, golfWorld, registersWorld, ...doomWorlds, orgWorld]

// Append each world's boss battle as its final lesson.
export const worlds = baseWorlds.map((w) => (
  BOSSES[w.id] ? { ...w, lessons: [...w.lessons, BOSSES[w.id]] } : w
))

// ---- soft gating ----
// World 0 always open; others need >=70% of the previous world's non-boss lessons.
export function isWorldUnlocked(save, worldIdx) {
  if (worldIdx <= 0) return true
  const prev = worlds[worldIdx - 1]
  const core = prev.lessons.filter((l) => l.type !== 'boss')
  const done = core.filter((l) => save.completed[l.id]).length
  return done / core.length >= 0.7
}

// Boss unlocks when every other lesson in its world is complete.
export function isBossUnlocked(save, world) {
  const core = world.lessons.filter((l) => l.type !== 'boss')
  return core.every((l) => save.completed[l.id])
}

export const RANKS = [
  { xp: 0, name: 'Evil Newborn', icon: 'egg' },
  { xp: 100, name: 'Escape Artist', icon: 'bird' },
  { xp: 250, name: 'Motion Apprentice', icon: 'footprints' },
  { xp: 450, name: 'Operator Adept', icon: 'swords' },
  { xp: 700, name: 'Golf Hustler', icon: 'golf' },
  { xp: 1000, name: 'Doom Initiate', icon: 'flame' },
  { xp: 1350, name: 'Elisp Sorcerer', icon: 'wand' },
  { xp: 1700, name: 'DOOM MASTER', icon: 'crown' },
]

export function rankFor(xp) {
  let r = RANKS[0]
  for (const rank of RANKS) if (xp >= rank.xp) r = rank
  return r
}

export function nextRank(xp) {
  return RANKS.find((r) => r.xp > xp) || null
}

// XP awards
export const XP = { info: 15, quizPerQ: 10, drill: 30, golfBase: 30, golfGold: 40, golfSilver: 20, keydrillPer: 8, codedrill: 25, boss: 100 }
