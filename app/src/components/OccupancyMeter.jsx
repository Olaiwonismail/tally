import { useStore } from '../state/store.jsx'

export default function OccupancyMeter() {
  const { derived } = useStore()
  const over = derived.pct > 100
  return (
    <div className="meter">
      <div className="l">
        <span>Occupancy</span>
        <span><b>{derived.residentsInside} of {derived.capacity} beds</b> — {derived.pct}%</span>
      </div>
      <div className="track">
        <div className={`fill${over ? ' over' : ''}`} style={{ width: `${Math.min(derived.pct, 100)}%` }} />
      </div>
    </div>
  )
}
