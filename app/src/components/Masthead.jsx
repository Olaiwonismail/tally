import { useStore } from '../state/store.jsx'

export default function Masthead() {
  const { hall } = useStore()
  return (
    <header className="masthead">
      <div className="masthead-in">
        <span className="crest">University of Lagos</span>
        <span className="svc">Hostel Access &amp; Occupancy</span>
        <span className="spacer" />
        <span className="svc">{hall.name} · {hall.gate}</span>
      </div>
    </header>
  )
}
