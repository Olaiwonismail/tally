const STATE_CLASS = { allowed: 'ok', guest: 'guest', denied: 'bad' }

export default function ScanResult({ result }) {
  if (!result) {
    return (
      <div className="result idle" role="status" aria-live="polite">
        <p className="big" style={{ color: 'inherit' }}>Ready to scan</p>
        <p>Present a tag to the reader, or use Simulate scan below.</p>
      </div>
    )
  }
  const cls = STATE_CLASS[result.state] || 'bad'
  const headline = result.headline
    || (result.state === 'allowed' ? 'Entry allowed'
      : result.state === 'guest' ? 'Guest pass' : 'Entry denied')
  return (
    <div className={`result ${cls}`} role="status" aria-live="assertive">
      <p className="big">{headline}</p>
      <p>{result.detail}</p>
      {result.dir && result.dir !== '—' && (
        <span className="dir">{result.dir === 'In' ? 'Signing in' : 'Signing out'}</span>
      )}
    </div>
  )
}
