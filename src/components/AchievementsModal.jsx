import React from 'react'
import { ACHIEVEMENTS } from '../data/achievements'
import { Icon } from '../icons'

export default function AchievementsModal({ save, onClose }) {
  const unlocked = Object.keys(save.achievements).length
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal ach-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2><Icon name="trophy" size={20} /> Achievements</h2>
          <span className="ach-count">{unlocked} / {ACHIEVEMENTS.length}</span>
          <button className="modal-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="ach-grid">
          {ACHIEVEMENTS.map((a) => {
            const got = !!save.achievements[a.id]
            return (
              <div key={a.id} className={`ach-card ${got ? 'unlocked' : 'locked'}`}>
                <div className="ach-icon">{got ? <Icon name={a.icon} size={24} /> : <Icon name="lock" size={24} />}</div>
                <div>
                  <div className="ach-name">{a.name}</div>
                  <div className="ach-desc">{a.desc}</div>
                  {got && <div className="ach-date">{new Date(save.achievements[a.id]).toLocaleDateString()}</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
