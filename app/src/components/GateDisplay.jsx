import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { useStore } from '../state/store.jsx'

// The single fixed QR for the gate. It encodes the check-in URL, so a phone's
// normal camera opens the check-in page — no in-app camera needed.
export default function GateDisplay() {
  const { hall, derived } = useStore()
  const [host, setHost] = useState(null)
  const [addr, setAddr] = useState('')
  const [qr, setQr] = useState('')

  useEffect(() => {
    fetch('/api/host').then((r) => r.json()).then((h) => {
      setHost(h)
      setAddr(h.addresses?.[0] || 'localhost')
    }).catch(() => setHost({ port: 4000, addresses: [] }))
  }, [])

  // Prefer the URL the dashboard itself was opened from — on a hosted deploy
  // (e.g. Render) that's the public URL a phone can actually reach. Only fall
  // back to the server's LAN address when the dashboard is viewed on the host
  // machine itself (localhost), whose origin a phone couldn't open.
  const onLocalhost = /^(localhost|127\.|0\.0\.0\.0$)/.test(window.location.hostname)
  const port = host?.port || 4000
  const lanUrl = `http://${addr || 'localhost'}:${port}/#/checkin`
  const url = onLocalhost ? lanUrl : `${window.location.origin}/#/checkin`

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 520, errorCorrectionLevel: 'M' })
      .then(setQr).catch(() => setQr(''))
  }, [url])

  return (
    <>
      <p className="eyebrow">Gate — {hall.name} {hall.gate}</p>
      <h1 className="page">Scan to check in</h1>
      <p className="lede">
        Point your phone camera at the code below. It opens the check-in page —
        confirm your matric to sign in, or check in as a guest.
      </p>

      <div className="gate-grid">
        <div className="gate-qr">
          {qr ? <img src={qr} alt="Gate check-in QR code" /> : <div className="qr-skeleton" />}
          <div className="gate-url">{url.replace(/^https?:\/\//, '')}</div>
          {host?.addresses?.length > 1 && (
            <label className="addr-pick">
              Phone can’t open it? Try another address:
              <select value={addr} onChange={(e) => setAddr(e.target.value)}>
                {host.addresses.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="gate-side">
          <div className="tile" style={{ marginBottom: 20 }}>
            <div className="v tabular">{derived.residentsInside}<span className="dim"> of {derived.capacity}</span></div>
            <div className="l">residents inside now</div>
          </div>
          <div className="panel">
            <h3>At the gate</h3>
            <p className="note" style={{ margin: 0 }}>
              <b>Human enforces, system decides.</b> The check-in returns an instant
              green or red so the security officer acts on a verified answer, not a guess.
            </p>
            <div className="inset" style={{ marginBottom: 0 }}>
              Entry and exit are both logged. The QR here proves the flow; production uses
              NFC tags, which are far harder to copy or share.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
