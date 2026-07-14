import { useStore } from '../state/store.jsx'

// Reclaim wasted no-show beds — the strongest card: adds capacity, no one punished.
export default function NoShowBeds() {
  const { state, reclaim, derived } = useStore()
  return (
    <div className="panel">
      <div className="section-head">
        <span>No-show beds</span>
        <span className="t">{derived.reclaimedCount} reclaimed this session</span>
      </div>
      <p className="note" style={{ marginTop: 0, marginBottom: 14 }}>
        Allocated, but the tag hasn't been seen in over a week — candidates to
        reclaim for waitlisted students. Reclaiming adds real capacity.
      </p>
      {state.noShowBeds.length === 0 ? (
        <p className="muted">All flagged beds have been reviewed.</p>
      ) : (
        <div className="tablewrap">
          <table>
            <thead>
              <tr><th>Room</th><th>Allocated to</th><th>Unseen</th><th></th></tr>
            </thead>
            <tbody>
              {state.noShowBeds.map((b) => (
                <tr key={b.room}>
                  <td className="tabular">{b.room}</td>
                  <td>{b.name} <span className="muted">· {b.matric}</span></td>
                  <td className="tabular">{b.daysUnseen} days</td>
                  <td><button className="linkbtn" onClick={() => reclaim(b.room)}>Reclaim</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {derived.reclaimedCount > 0 && (
        <div className="inset" style={{ marginBottom: 0 }}>
          {derived.reclaimedCount} bed{derived.reclaimedCount > 1 ? 's' : ''} reclaimed — offered to the waitlist.
        </div>
      )}
    </div>
  )
}
