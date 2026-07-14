import { useEffect, useState } from 'react'
import { useStore } from '../state/store.jsx'

const pad = (n) => String(n).padStart(2, '0')
const fmt = (ms) => { const d = new Date(ms); return `${pad(d.getHours())}:${pad(d.getMinutes())}` }

export default function GuestList() {
  const { state } = useStore()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="panel">
      <div className="section-head"><span>Guest passes</span><span className="t">time-limited</span></div>
      {state.guests.map((g) => {
        const minsLeft = Math.round((g.validUntil - now) / 60000)
        const expired = minsLeft <= 0
        const soon = !expired && minsLeft <= 10
        const status = expired ? 'Expired' : g.inside ? `Inside · until ${fmt(g.validUntil)}` : `Not in · until ${fmt(g.validUntil)}`
        return (
          <div className="guest-item" key={g.token}>
            <span>
              <b>{g.name}</b><br />
              <span className="muted">visiting {g.visiting} · {g.room}</span>
            </span>
            <span className={`exp${soon || expired ? ' soon' : ''}`}>{status}</span>
          </div>
        )
      })}
      <p className="note" style={{ marginTop: 14, marginBottom: 0 }}>
        Passes auto-expire so a guest can't quietly become a squatter.
      </p>
    </div>
  )
}
