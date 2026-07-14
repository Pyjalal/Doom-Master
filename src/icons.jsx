import {
  Egg, Bird, Footprints, Swords, Target, Flame, Wand2, Crown,
  BookOpen, Keyboard, HelpCircle, Piano, FlaskConical, Skull,
  Droplet, Medal, Repeat, Save, Scissors, Search, Award, Zap,
  Lock, Map, Trophy, Volume2, VolumeX, Timer, RotateCcw,
  CheckCircle, XCircle, X, ChevronRight, ChevronLeft,
  TreePine, Clipboard, Hammer, Sparkles, Cross, Moon,
  Minus, Square, Copy, Maximize2, Minimize2,
} from 'lucide-react'

const MAP = {
  egg: Egg,
  bird: Bird,
  footprints: Footprints,
  swords: Swords,
  golf: Target,
  flame: Flame,
  wand: Wand2,
  crown: Crown,
  book: BookOpen,
  keyboard: Keyboard,
  quiz: HelpCircle,
  piano: Piano,
  flask: FlaskConical,
  skull: Skull,
  droplet: Droplet,
  medal: Medal,
  repeat: Repeat,
  save: Save,
  scissors: Scissors,
  search: Search,
  award: Award,
  zap: Zap,
  lock: Lock,
  map: Map,
  trophy: Trophy,
  volume: Volume2,
  volumeX: VolumeX,
  timer: Timer,
  reset: RotateCcw,
  check: CheckCircle,
  xCircle: XCircle,
  x: X,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  tree: TreePine,
  clipboard: Clipboard,
  hammer: Hammer,
  sparkles: Sparkles,
  cross: Cross,
  moon: Moon,
  minus: Minus,
  square: Square,
  copy: Copy,
  maximize2: Maximize2,
  minimize2: Minimize2,
}

export function Icon({ name, size = 18, className = '', ...rest }) {
  const C = MAP[name]
  if (!C) return null
  return <C size={size} className={className} {...rest} />
}

export const LESSON_ICONS = {
  info: 'book',
  drill: 'keyboard',
  quiz: 'quiz',
  golf: 'golf',
  keydrill: 'piano',
  codedrill: 'flask',
  boss: 'skull',
}

export const MEDAL_ICONS = { gold: 'medal', silver: 'medal', bronze: 'medal' }
