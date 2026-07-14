import { useStore } from '../state/store.jsx'

const TONE_CLASS = { ok: 'ok', bad: 'bad', guest: 'guest' }

export default function AccessLog() {
  const { state } = useStore()
  return (
    <div className="panel">
      <div className="section-head"><span>Access log</span><span className="t">live · newest first</span></div>
      <div className="tablewrap">
        <table>
          <thead>
            <tr><th>Time</th><th>Name</th><th>Direction</th><th>Result</th></tr>
          </thead>
          <tbody>
            {state.log.map((e) => (
              <tr key={e.id} className={e.fresh ? 'fresh' : undefined}>
                <td className="tabular">{e.time}</td>
                <td>{e.name}</td>
                <td>{e.dir === '—' ? <span className="muted">—</span> : <span className="chip dir">{e.dir}</span>}</td>
                <td><span className={`chip ${TONE_CLASS[e.tone] || 'bad'}`}>{e.result}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
