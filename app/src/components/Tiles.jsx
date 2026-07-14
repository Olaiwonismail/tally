import { useStore } from '../state/store.jsx'

export default function Tiles() {
  const { derived } = useStore()
  return (
    <div className="tiles">
      <div className="tile">
        <div className="v tabular">{derived.residentsInside}<span className="dim"> of {derived.capacity}</span></div>
        <div className="l">inside now</div>
      </div>
      <div className="tile alert">
        <div className="v tabular">{derived.reclaimable}</div>
        <div className="l">no-show beds to reclaim</div>
      </div>
      <div className="tile">
        <div className="v tabular">{derived.deniedToday}</div>
        <div className="l">denied today</div>
      </div>
      <div className="tile">
        <div className="v tabular">{derived.guestsInside}</div>
        <div className="l">guests inside</div>
      </div>
    </div>
  )
}
