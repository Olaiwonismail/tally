import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

// Live wall clock, HH:MM. Optional seconds for the gate header.
export default function Clock({ seconds = false }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const t = `${pad(now.getHours())}:${pad(now.getMinutes())}${seconds ? ':' + pad(now.getSeconds()) : ''}`
  return <span className="tabular">{t}</span>
}
