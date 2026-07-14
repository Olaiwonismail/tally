import { useStore } from '../state/store.jsx'
import Clock from './Clock.jsx'
import Tiles from './Tiles.jsx'
import OccupancyMeter from './OccupancyMeter.jsx'
import AccessLog from './AccessLog.jsx'
import GuestList from './GuestList.jsx'
import NoShowBeds from './NoShowBeds.jsx'

export default function AdminDashboard() {
  const { hall, connected } = useStore()
  return (
    <>
      <p className="eyebrow">Admin — {hall.name}</p>
      <h1 className="page">Occupancy &amp; access</h1>
      <p className="lede">
        Real-time occupancy against designed capacity — hard, dated numbers, not guesses.
        Every check-in updates this view.
        {' '}<span className={`dot ${connected ? 'live' : 'off'}`} />
        <span className="muted">{connected ? 'live' : 'reconnecting…'} · <Clock /></span>
      </p>

      <Tiles />
      <OccupancyMeter />

      <div className="grid-2">
        <div><AccessLog /></div>
        <div>
          <NoShowBeds />
          <GuestList />
        </div>
      </div>

      <p className="footer-note">
        Movement logs are personal data. Dashboard access is restricted to hostel
        administration, in line with the Nigeria Data Protection Regulation (NDPR).
      </p>
    </>
  )
}
