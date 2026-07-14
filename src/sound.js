// Web Audio synth SFX — no asset files. All sounds gated by the enabled flag.
let ctx = null
let enabled = true

export function setSoundEnabled(e) { enabled = e }
export function isSoundEnabled() { return enabled }

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, dur, { type = 'sine', gain = 0.06, when = 0, slide = 0 } = {}) {
  if (!enabled) return
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t0 + dur)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const sfx = {
  tick() { tone(2600, 0.015, { type: 'square', gain: 0.012 }) },
  error() { tone(140, 0.18, { type: 'sawtooth', gain: 0.05, slide: -60 }) },
  success() {
    tone(660, 0.09, { type: 'triangle' })
    tone(880, 0.12, { type: 'triangle', when: 0.08 })
  },
  medal() {
    tone(523, 0.1, { type: 'triangle' })
    tone(659, 0.1, { type: 'triangle', when: 0.09 })
    tone(784, 0.1, { type: 'triangle', when: 0.18 })
    tone(1047, 0.22, { type: 'triangle', when: 0.27 })
  },
  rankup() {
    tone(392, 0.12, { type: 'square', gain: 0.04 })
    tone(523, 0.12, { type: 'square', gain: 0.04, when: 0.1 })
    tone(659, 0.12, { type: 'square', gain: 0.04, when: 0.2 })
    tone(784, 0.3, { type: 'square', gain: 0.05, when: 0.3 })
    tone(1047, 0.4, { type: 'triangle', gain: 0.06, when: 0.42 })
  },
  boss() {
    tone(110, 0.3, { type: 'sawtooth', gain: 0.06 })
    tone(104, 0.3, { type: 'sawtooth', gain: 0.06, when: 0.25 })
    tone(98, 0.5, { type: 'sawtooth', gain: 0.07, when: 0.5 })
  },
  bossWin() {
    tone(523, 0.12, { type: 'triangle' })
    tone(659, 0.12, { type: 'triangle', when: 0.1 })
    tone(784, 0.12, { type: 'triangle', when: 0.2 })
    tone(1047, 0.15, { type: 'triangle', when: 0.3 })
    tone(1319, 0.4, { type: 'triangle', when: 0.42 })
  },
  bossLose() {
    tone(220, 0.25, { type: 'sawtooth', gain: 0.05, slide: -80 })
    tone(165, 0.35, { type: 'sawtooth', gain: 0.05, when: 0.22, slide: -60 })
  },
  achievement() {
    tone(880, 0.08, { type: 'sine', gain: 0.05 })
    tone(1175, 0.18, { type: 'sine', gain: 0.05, when: 0.07 })
  },
  combo(level = 1) {
    tone(440 + level * 80, 0.07, { type: 'square', gain: 0.03 })
  },
}
