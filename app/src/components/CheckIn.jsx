import { useState } from 'react'
import { useStore } from '../state/store.jsx'
import ScanResult from './ScanResult.jsx'

export default function CheckIn() {
  const { hall, checkin, guestCheckin } = useStore()
  const [mode, setMode] = useState('resident')
  const [matric, setMatric] = useState('')
  const [name, setName] = useState('')
  const [hostMatric, setHostMatric] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const reset = () => { setResult(null); setError(''); setMatric(''); setName(''); setHostMatric('') }

  async function submitResident(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const res = await checkin(matric)
    setBusy(false)
    if (res.error) setError(res.error)
    else setResult(res.result)
  }

  async function submitGuest(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const res = await guestCheckin({ name, hostMatric })
    setBusy(false)
    if (res.error) setError(res.error)
    else setResult(res.result)
  }

  if (result) {
    return (
      <div className="checkin">
        <p className="eyebrow">{hall.name} · {hall.gate}</p>
        <ScanResult result={result} />
        <button className="btn secondary" style={{ marginTop: 16 }} onClick={reset}>Check someone else in</button>
      </div>
    )
  }

  return (
    <div className="checkin">
      <p className="eyebrow">{hall.name} · {hall.gate}</p>
      <h1 className="page">Check in</h1>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={mode === 'resident'} className={`tab${mode === 'resident' ? ' on' : ''}`} onClick={() => { setMode('resident'); setError('') }}>I’m a resident</button>
        <button role="tab" aria-selected={mode === 'guest'} className={`tab${mode === 'guest' ? ' on' : ''}`} onClick={() => { setMode('guest'); setError('') }}>I’m a guest</button>
      </div>

      {mode === 'resident' ? (
        <form onSubmit={submitResident}>
          <label className="field">
            <span>Matric number</span>
            <input inputMode="numeric" autoComplete="off" value={matric}
              onChange={(e) => setMatric(e.target.value)} placeholder="e.g. 190401052" autoFocus />
          </label>
          {error && <p className="err">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Checking…' : 'Check in'}</button>
          <p className="note" style={{ marginTop: 14 }}>
            We check your matric against tonight’s allocation for {hall.name}. Entry and exit are both logged.
          </p>
        </form>
      ) : (
        <form onSubmit={submitGuest}>
          <label className="field">
            <span>Your name</span>
            <input autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tolu Adeyemi" autoFocus />
          </label>
          <label className="field">
            <span>Matric of the resident you’re visiting</span>
            <input inputMode="numeric" autoComplete="off" value={hostMatric}
              onChange={(e) => setHostMatric(e.target.value)} placeholder="e.g. 190403311" />
          </label>
          {error && <p className="err">{error}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Checking…' : 'Check in as guest'}</button>
          <p className="note" style={{ marginTop: 14 }}>
            Your pass is time-limited and tied to your host, and expires automatically.
          </p>
        </form>
      )}
    </div>
  )
}
